import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { authApi } from "@/lib/api";

type AppRole = "ADMIN" | "TEACHER" | "STUDENT";

interface User {
  id: string;
  email: string;
  fullName: string;
  phone: string | null;
  avatarUrl: string | null;
  role: AppRole;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  role: AppRole | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signUp: (email: string, password: string, fullName: string, role: AppRole) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [role, setRole] = useState<AppRole | null>(null);
  const [loading, setLoading] = useState(true);

  // Clear any old tokens on mount to avoid JWT signature issues
  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem("token");
      const storedUser = localStorage.getItem("user");

      if (storedToken && storedUser) {
        try {
          // Verify token is still valid
          const response = await authApi.getCurrentUser();
          const userData = response.data.data;
          setToken(storedToken);
          setUser(userData);
          setRole(userData.role);
          localStorage.setItem("user", JSON.stringify(userData));
        } catch (error) {
          // Token is invalid or expired, clear storage
          console.log("Token invalid, clearing storage");
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          setToken(null);
          setUser(null);
          setRole(null);
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      const response = await authApi.login(email, password);
      const { token: newToken, userId, email: userEmail, fullName, role: userRole } = response.data.data;
      
      const userData: User = {
        id: userId,
        email: userEmail,
        fullName: fullName,
        phone: null,
        avatarUrl: null,
        role: userRole,
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      localStorage.setItem("token", newToken);
      localStorage.setItem("user", JSON.stringify(userData));
      
      setToken(newToken);
      setUser(userData);
      setRole(userRole);

      return { error: null };
    } catch (error: any) {
      const message = error.response?.data?.message || "Login failed";
      return { error: new Error(message) };
    }
  };

  const signUp = async (email: string, password: string, fullName: string, selectedRole: AppRole) => {
    try {
      const response = await authApi.signup({
        email,
        password,
        fullName,
        role: selectedRole,
      });
      
      const { token: newToken, userId, email: userEmail, fullName: userName, role: userRole } = response.data.data;
      
      const userData: User = {
        id: userId,
        email: userEmail,
        fullName: userName,
        phone: null,
        avatarUrl: null,
        role: userRole,
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      localStorage.setItem("token", newToken);
      localStorage.setItem("user", JSON.stringify(userData));
      
      setToken(newToken);
      setUser(userData);
      setRole(userRole);

      return { error: null };
    } catch (error: any) {
      const message = error.response?.data?.message || "Signup failed";
      return { error: new Error(message) };
    }
  };

  const signOut = async () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);
    setRole(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, role, loading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
