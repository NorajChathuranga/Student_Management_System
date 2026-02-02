import { ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  GraduationCap,
  LayoutDashboard,
  Users,
  UserCog,
  BookOpen,
  Calendar,
  ClipboardList,
  BarChart3,
  Settings,
  LogOut,
  ChevronRight,
  Menu,
  X,
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

type AppRole = "ADMIN" | "TEACHER" | "STUDENT";

interface NavItem {
  label: string;
  href: string;
  icon: ReactNode;
}

const navItems: Record<AppRole, NavItem[]> = {
  ADMIN: [
    { label: "Dashboard", href: "/admin", icon: <LayoutDashboard className="w-5 h-5" /> },
    { label: "Students", href: "/admin/students", icon: <Users className="w-5 h-5" /> },
    { label: "Teachers", href: "/admin/teachers", icon: <UserCog className="w-5 h-5" /> },
    { label: "Classes", href: "/admin/classes", icon: <BookOpen className="w-5 h-5" /> },
    { label: "Subjects", href: "/admin/subjects", icon: <ClipboardList className="w-5 h-5" /> },
    { label: "Analytics", href: "/admin/analytics", icon: <BarChart3 className="w-5 h-5" /> },
  ],
  TEACHER: [
    { label: "Dashboard", href: "/teacher", icon: <LayoutDashboard className="w-5 h-5" /> },
    { label: "My Classes", href: "/teacher/classes", icon: <BookOpen className="w-5 h-5" /> },
    { label: "Attendance", href: "/teacher/attendance", icon: <Calendar className="w-5 h-5" /> },
    { label: "Marks", href: "/teacher/marks", icon: <ClipboardList className="w-5 h-5" /> },
  ],
  STUDENT: [
    { label: "Dashboard", href: "/student", icon: <LayoutDashboard className="w-5 h-5" /> },
    { label: "My Classes", href: "/student/classes", icon: <BookOpen className="w-5 h-5" /> },
    { label: "Attendance", href: "/student/attendance", icon: <Calendar className="w-5 h-5" /> },
    { label: "Results", href: "/student/results", icon: <ClipboardList className="w-5 h-5" /> },
  ],
};

interface DashboardLayoutProps {
  children: ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const { profile, role, signOut } = useAuth();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const items = role ? navItems[role as AppRole] : [];
  const initials = profile?.fullName
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase() || "U";

  const roleLabels: Record<AppRole, string> = {
    ADMIN: "Administrator",
    TEACHER: "Teacher",
    STUDENT: "Student",
  };

  return (
    <div className="dashboard-container flex">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-foreground/20 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:z-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex h-full flex-col gradient-bg">
          {/* Logo */}
          <div className="flex items-center gap-3 px-6 py-5 border-b border-sidebar-border">
            <div className="w-10 h-10 rounded-xl bg-sidebar-foreground/10 flex items-center justify-center">
              <GraduationCap className="w-6 h-6 text-sidebar-foreground" />
            </div>
            <div>
              <h1 className="font-bold text-sidebar-foreground">EduPortal</h1>
              <p className="text-xs text-sidebar-foreground/70">
                {role && roleLabels[role as AppRole]}
              </p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden ml-auto text-sidebar-foreground hover:bg-sidebar-accent"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
            {items.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.href}
                  to={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group",
                    isActive
                      ? "bg-sidebar-foreground/10 text-sidebar-foreground"
                      : "text-sidebar-foreground/70 hover:bg-sidebar-foreground/5 hover:text-sidebar-foreground"
                  )}
                >
                  {item.icon}
                  <span className="font-medium">{item.label}</span>
                  {isActive && (
                    <ChevronRight className="w-4 h-4 ml-auto" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* User Section */}
          <div className="px-3 py-4 border-t border-sidebar-border">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-sidebar-foreground/5 transition-colors">
                  <Avatar className="w-9 h-9 border-2 border-sidebar-foreground/20">
                    <AvatarImage src={profile?.avatarUrl || undefined} />
                    <AvatarFallback className="bg-sidebar-foreground/10 text-sidebar-foreground text-sm">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 text-left">
                    <p className="text-sm font-medium text-sidebar-foreground truncate">
                      {profile?.fullName || "User"}
                    </p>
                    <p className="text-xs text-sidebar-foreground/60 truncate">
                      {profile?.email}
                    </p>
                  </div>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Settings className="w-4 h-4 mr-2" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={signOut} className="text-destructive focus:text-destructive">
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Top Header */}
        <header className="sticky top-0 z-30 flex items-center gap-4 px-6 py-4 bg-background/95 backdrop-blur border-b border-border">
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="w-5 h-5" />
          </Button>

          <div className="flex-1" />

          <p className="text-sm text-muted-foreground hidden sm:block">
            Welcome back, <span className="font-medium text-foreground">{profile?.fullName?.split(" ")[0]}</span>
          </p>
        </header>

        {/* Page Content */}
        <main className="main-content flex-1">
          {children}
        </main>
      </div>
    </div>
  );
}
