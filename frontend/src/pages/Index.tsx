import { Link, Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { GraduationCap, Users, BookOpen, Shield, ArrowRight, Loader2 } from "lucide-react";

type AppRole = "ADMIN" | "TEACHER" | "STUDENT";

export default function Index() {
  const { user, role, loading } = useAuth();

  // Redirect authenticated users to their dashboard
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (user && role) {
    const dashboardRoutes: Record<AppRole, string> = {
      ADMIN: "/admin",
      TEACHER: "/teacher",
      STUDENT: "/student",
    };
    return <Navigate to={dashboardRoutes[role as AppRole]} replace />;
  }

  const features = [
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Secure Access",
      description: "Role-based authentication with JWT tokens ensures data security",
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "Multi-Role Support",
      description: "Separate dashboards for Admins, Teachers, and Students",
    },
    {
      icon: <BookOpen className="w-6 h-6" />,
      title: "Complete Management",
      description: "Manage classes, attendance, grades, and more in one place",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 gradient-bg opacity-95" />
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-white/5 rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
        </div>
        
        <div className="relative z-10 max-w-6xl mx-auto px-6 py-20 lg:py-32">
          <div className="text-center">
            <div className="inline-flex items-center gap-3 mb-8">
              <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center backdrop-blur-sm">
                <GraduationCap className="w-8 h-8 text-white" />
              </div>
              <span className="text-2xl font-bold text-white">EduPortal</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              Secure Student
              <br />
              <span className="text-white/80">Management System</span>
            </h1>
            
            <p className="text-lg md:text-xl text-white/70 max-w-2xl mx-auto mb-10">
              A comprehensive platform for schools to manage students, teachers, 
              classes, attendance, and grades with role-based access control.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/auth">
                <Button size="lg" className="bg-white text-primary hover:bg-white/90 gap-2 text-base px-8">
                  Get Started
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
              <Link to="/auth">
                <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10 text-base px-8">
                  Sign In
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Everything You Need
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Built with security and ease-of-use in mind, EduPortal provides all the tools 
              for efficient school management.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, idx) => (
              <div
                key={idx}
                className="p-6 rounded-2xl border border-border bg-card hover:shadow-card transition-shadow"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Roles Section */}
      <div className="py-20 px-6 bg-muted/50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              For Everyone
            </h2>
            <p className="text-muted-foreground">
              Each role has a dedicated dashboard tailored to their needs
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 rounded-2xl bg-card border border-border text-center">
              <div className="w-16 h-16 rounded-2xl icon-primary mx-auto mb-4 flex items-center justify-center">
                <Shield className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Administrators</h3>
              <p className="text-muted-foreground text-sm">
                Full control over students, teachers, classes, and system settings
              </p>
            </div>
            
            <div className="p-8 rounded-2xl bg-card border border-border text-center">
              <div className="w-16 h-16 rounded-2xl icon-accent mx-auto mb-4 flex items-center justify-center">
                <BookOpen className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Teachers</h3>
              <p className="text-muted-foreground text-sm">
                Manage attendance, enter grades, and view assigned classes
              </p>
            </div>
            
            <div className="p-8 rounded-2xl bg-card border border-border text-center">
              <div className="w-16 h-16 rounded-2xl bg-success/10 mx-auto mb-4 flex items-center justify-center text-success">
                <Users className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Students</h3>
              <p className="text-muted-foreground text-sm">
                View classes, check attendance records, and see grades
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-border">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-primary" />
            <span className="font-semibold">EduPortal</span>
          </div>
          <p className="text-sm text-muted-foreground">
            © 2025 EduPortal. Secure Student Management System.
          </p>
        </div>
      </footer>
    </div>
  );
}
