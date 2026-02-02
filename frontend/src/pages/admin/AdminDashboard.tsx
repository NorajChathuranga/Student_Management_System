import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { StatCard } from "@/components/dashboard/StatCard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { dashboardApi } from "@/lib/api";
import { Users, UserCog, BookOpen, ClipboardList, Plus, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

interface DashboardStats {
  totalStudents: number;
  totalTeachers: number;
  totalClasses: number;
  totalSubjects: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalStudents: 0,
    totalTeachers: 0,
    totalClasses: 0,
    totalSubjects: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const response = await dashboardApi.getStats();
        const data = response.data.data;
        setStats({
          totalStudents: data.totalStudents || 0,
          totalTeachers: data.totalTeachers || 0,
          totalClasses: data.totalClasses || 0,
          totalSubjects: data.totalSubjects || 0,
        });
      } catch (error) {
        console.error("Error fetching stats:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, []);

  const quickActions = [
    { label: "Add Student", href: "/admin/students", icon: <Users className="w-4 h-4" /> },
    { label: "Add Teacher", href: "/admin/teachers", icon: <UserCog className="w-4 h-4" /> },
    { label: "Create Class", href: "/admin/classes", icon: <BookOpen className="w-4 h-4" /> },
    { label: "Add Subject", href: "/admin/subjects", icon: <ClipboardList className="w-4 h-4" /> },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Page Header */}
        <div className="page-header">
          <h1 className="page-title">Admin Dashboard</h1>
          <p className="page-description">
            Overview of your school management system
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="animate-slide-up">
            <StatCard
              title="Total Students"
              value={loading ? "..." : stats.totalStudents}
              description="Enrolled students"
              icon={<Users className="w-6 h-6" />}
              variant="primary"
            />
          </div>
          <div className="animate-slide-up delay-100">
            <StatCard
              title="Total Teachers"
              value={loading ? "..." : stats.totalTeachers}
              description="Active teachers"
              icon={<UserCog className="w-6 h-6" />}
              variant="accent"
            />
          </div>
          <div className="animate-slide-up delay-200">
            <StatCard
              title="Classes"
              value={loading ? "..." : stats.totalClasses}
              description="Active classes"
              icon={<BookOpen className="w-6 h-6" />}
              variant="success"
            />
          </div>
          <div className="animate-slide-up delay-300">
            <StatCard
              title="Subjects"
              value={loading ? "..." : stats.totalSubjects}
              description="Course subjects"
              icon={<ClipboardList className="w-6 h-6" />}
              variant="info"
            />
          </div>
        </div>

        {/* Quick Actions */}
        <Card className="animate-slide-up delay-400">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="w-5 h-5 text-primary" />
              Quick Actions
            </CardTitle>
            <CardDescription>
              Common administrative tasks
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {quickActions.map((action) => (
                <Link key={action.label} to={action.href}>
                  <Button
                    variant="outline"
                    className="w-full h-auto py-4 flex flex-col gap-2 hover:border-primary hover:bg-primary/5"
                  >
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                      {action.icon}
                    </div>
                    <span className="text-sm font-medium">{action.label}</span>
                  </Button>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Getting Started */}
        <Card className="border-primary/20 bg-primary/5">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
              <div className="flex-1">
                <h3 className="font-semibold text-lg">Getting Started</h3>
                <p className="text-muted-foreground mt-1">
                  Start by creating classes and subjects, then add teachers and students to build your school structure.
                </p>
              </div>
              <Link to="/admin/classes">
                <Button className="gap-2">
                  Create First Class
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
