import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { StatCard } from "@/components/dashboard/StatCard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { teacherClassesApi } from "@/lib/api";
import { useAuth } from "@/hooks/useAuth";
import { BookOpen, Users, Calendar, ClipboardList, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

interface TeacherStats {
  assignedClasses: number;
  totalStudents: number;
}

interface AssignedClass {
  id: string;
  name: string;
  gradeLevel: string | null;
  studentCount: number;
}

export default function TeacherDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState<TeacherStats>({ assignedClasses: 0, totalStudents: 0 });
  const [classes, setClasses] = useState<AssignedClass[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      if (!user) return;

      try {
        // Fetch assigned classes for current teacher
        const response = await teacherClassesApi.getMyClasses();
        const teacherClasses = response.data.data || [];

        // Transform and deduplicate classes
        const uniqueClasses = teacherClasses.reduce((acc: AssignedClass[], tc: any) => {
          if (!acc.find((c) => c.id === tc.schoolClass.id)) {
            acc.push({
              id: tc.schoolClass.id,
              name: tc.schoolClass.name,
              gradeLevel: tc.schoolClass.gradeLevel,
              studentCount: tc.studentCount || 0,
            });
          }
          return acc;
        }, []);

        setClasses(uniqueClasses);
        setStats({
          assignedClasses: uniqueClasses.length,
          totalStudents: uniqueClasses.reduce((sum: number, c: AssignedClass) => sum + c.studentCount, 0),
        });
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [user]);

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Page Header */}
        <div className="page-header">
          <h1 className="page-title">Teacher Dashboard</h1>
          <p className="page-description">
            Manage your classes, attendance, and student grades
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="animate-slide-up">
            <StatCard
              title="My Classes"
              value={loading ? "..." : stats.assignedClasses}
              description="Classes assigned to you"
              icon={<BookOpen className="w-6 h-6" />}
              variant="primary"
            />
          </div>
          <div className="animate-slide-up delay-100">
            <StatCard
              title="Total Students"
              value={loading ? "..." : stats.totalStudents}
              description="Across all classes"
              icon={<Users className="w-6 h-6" />}
              variant="accent"
            />
          </div>
          <div className="animate-slide-up delay-200">
            <Link to="/teacher/attendance">
              <StatCard
                title="Attendance"
                value="Mark"
                description="Record attendance"
                icon={<Calendar className="w-6 h-6" />}
                variant="success"
              />
            </Link>
          </div>
          <div className="animate-slide-up delay-300">
            <Link to="/teacher/marks">
              <StatCard
                title="Marks"
                value="Enter"
                description="Grade students"
                icon={<ClipboardList className="w-6 h-6" />}
                variant="info"
              />
            </Link>
          </div>
        </div>

        {/* My Classes */}
        <Card className="animate-slide-up delay-400">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-primary" />
              My Classes
            </CardTitle>
            <CardDescription>
              Classes you are currently teaching
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center py-8">
                <div className="spinner" />
              </div>
            ) : classes.length === 0 ? (
              <div className="text-center py-8">
                <BookOpen className="w-12 h-12 mx-auto text-muted-foreground/40" />
                <p className="mt-4 text-muted-foreground">No classes assigned yet.</p>
                <p className="text-sm text-muted-foreground">
                  Contact your administrator to be assigned to classes.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {classes.map((cls) => (
                  <div
                    key={cls.id}
                    className="p-4 rounded-lg border border-border hover:border-primary/30 hover:bg-primary/5 transition-colors"
                  >
                    <h4 className="font-semibold">{cls.name}</h4>
                    {cls.gradeLevel && (
                      <p className="text-sm text-muted-foreground">Grade: {cls.gradeLevel}</p>
                    )}
                    <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
                      <Users className="w-4 h-4" />
                      <span>{cls.studentCount} students</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="border-primary/20 bg-primary/5">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="icon-container icon-primary">
                  <Calendar className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold">Mark Attendance</h3>
                  <p className="text-sm text-muted-foreground">
                    Record today's attendance for your classes
                  </p>
                </div>
                <Link to="/teacher/attendance">
                  <Button size="sm" className="gap-1">
                    Go <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          <Card className="border-accent/20 bg-accent/5">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="icon-container icon-accent">
                  <ClipboardList className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold">Enter Marks</h3>
                  <p className="text-sm text-muted-foreground">
                    Grade exams and assignments
                  </p>
                </div>
                <Link to="/teacher/marks">
                  <Button size="sm" variant="outline" className="gap-1">
                    Go <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
