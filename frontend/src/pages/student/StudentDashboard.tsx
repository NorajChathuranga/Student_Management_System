import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { StatCard } from "@/components/dashboard/StatCard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { studentClassesApi, attendanceApi, marksApi } from "@/lib/api";
import { useAuth } from "@/hooks/useAuth";
import { BookOpen, Calendar, ClipboardList, TrendingUp, CheckCircle2, XCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { Progress } from "@/components/ui/progress";

interface StudentStats {
  enrolledClasses: number;
  attendanceRate: number;
  totalPresent: number;
  totalAbsent: number;
}

interface EnrolledClass {
  id: string;
  name: string;
  gradeLevel: string | null;
}

interface RecentMark {
  subjectName: string;
  examType: string;
  score: number;
  maxScore: number;
  examDate: string;
}

export default function StudentDashboard() {
  const { user, profile } = useAuth();
  const [stats, setStats] = useState<StudentStats>({
    enrolledClasses: 0,
    attendanceRate: 0,
    totalPresent: 0,
    totalAbsent: 0,
  });
  const [classes, setClasses] = useState<EnrolledClass[]>([]);
  const [recentMarks, setRecentMarks] = useState<RecentMark[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      if (!user) return;

      try {
        // Fetch enrolled classes
        const classesResponse = await studentClassesApi.getMyClasses();
        const studentClasses = classesResponse.data.data || [];

        const enrolledClasses = studentClasses.map((sc: any) => ({
          id: sc.schoolClass.id,
          name: sc.schoolClass.name,
          gradeLevel: sc.schoolClass.gradeLevel,
        }));
        setClasses(enrolledClasses);

        // Fetch attendance stats
        const attendanceResponse = await attendanceApi.getMyAttendance();
        const attendance = attendanceResponse.data.data || [];

        const present = attendance.filter((a: any) => a.status === "PRESENT" || a.status === "LATE").length;
        const absent = attendance.filter((a: any) => a.status === "ABSENT").length;
        const total = attendance.length;
        const rate = total > 0 ? Math.round((present / total) * 100) : 100;

        setStats({
          enrolledClasses: enrolledClasses.length,
          attendanceRate: rate,
          totalPresent: present,
          totalAbsent: absent,
        });

        // Fetch recent marks
        const marksResponse = await marksApi.getMyMarks();
        const marks = (marksResponse.data.data || []).slice(0, 5);

        setRecentMarks(
          marks.map((m: any) => ({
            subjectName: m.subject?.name || "Unknown",
            examType: m.examType,
            score: m.score,
            maxScore: m.maxScore,
            examDate: m.examDate,
          }))
        );
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [user]);

  const getGradeColor = (percentage: number) => {
    if (percentage >= 80) return "text-success";
    if (percentage >= 60) return "text-warning";
    return "text-destructive";
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Page Header */}
        <div className="page-header">
          <h1 className="page-title">Welcome, {profile?.fullName?.split(" ")[0]}!</h1>
          <p className="page-description">
            Here's an overview of your academic progress
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="animate-slide-up">
            <StatCard
              title="My Classes"
              value={loading ? "..." : stats.enrolledClasses}
              description="Enrolled classes"
              icon={<BookOpen className="w-6 h-6" />}
              variant="primary"
            />
          </div>
          <div className="animate-slide-up delay-100">
            <StatCard
              title="Attendance"
              value={loading ? "..." : `${stats.attendanceRate}%`}
              description="Overall attendance rate"
              icon={<Calendar className="w-6 h-6" />}
              variant={stats.attendanceRate >= 80 ? "success" : stats.attendanceRate >= 60 ? "warning" : "accent"}
            />
          </div>
          <div className="animate-slide-up delay-200">
            <StatCard
              title="Days Present"
              value={loading ? "..." : stats.totalPresent}
              description="This semester"
              icon={<CheckCircle2 className="w-6 h-6" />}
              variant="success"
            />
          </div>
          <div className="animate-slide-up delay-300">
            <StatCard
              title="Days Absent"
              value={loading ? "..." : stats.totalAbsent}
              description="This semester"
              icon={<XCircle className="w-6 h-6" />}
              variant="warning"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* My Classes */}
          <Card className="animate-slide-up delay-400">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-primary" />
                My Classes
              </CardTitle>
              <CardDescription>
                Classes you are enrolled in
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
                  <p className="mt-4 text-muted-foreground">Not enrolled in any classes yet.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {classes.map((cls) => (
                    <div
                      key={cls.id}
                      className="flex items-center gap-4 p-3 rounded-lg border border-border hover:border-primary/30 hover:bg-primary/5 transition-colors"
                    >
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <BookOpen className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-medium">{cls.name}</h4>
                        {cls.gradeLevel && (
                          <p className="text-sm text-muted-foreground">Grade: {cls.gradeLevel}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recent Results */}
          <Card className="animate-slide-up delay-400">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ClipboardList className="w-5 h-5 text-primary" />
                Recent Results
              </CardTitle>
              <CardDescription>
                Your latest exam scores
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex justify-center py-8">
                  <div className="spinner" />
                </div>
              ) : recentMarks.length === 0 ? (
                <div className="text-center py-8">
                  <ClipboardList className="w-12 h-12 mx-auto text-muted-foreground/40" />
                  <p className="mt-4 text-muted-foreground">No results yet.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {recentMarks.map((mark, idx) => {
                    const percentage = Math.round((mark.score / mark.maxScore) * 100);
                    return (
                      <div key={idx} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">{mark.subjectName}</p>
                            <p className="text-xs text-muted-foreground">{mark.examType}</p>
                          </div>
                          <span className={`font-bold ${getGradeColor(percentage)}`}>
                            {mark.score}/{mark.maxScore}
                          </span>
                        </div>
                        <Progress value={percentage} className="h-2" />
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link to="/student/attendance">
            <Card className="hover:border-primary/30 hover:shadow-card transition-all cursor-pointer">
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="icon-container icon-success">
                    <Calendar className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold">View Full Attendance</h3>
                    <p className="text-sm text-muted-foreground">
                      Check your complete attendance history
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link to="/student/results">
            <Card className="hover:border-primary/30 hover:shadow-card transition-all cursor-pointer">
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="icon-container icon-info">
                    <TrendingUp className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold">View All Results</h3>
                    <p className="text-sm text-muted-foreground">
                      See detailed exam results and grades
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>
    </DashboardLayout>
  );
}
