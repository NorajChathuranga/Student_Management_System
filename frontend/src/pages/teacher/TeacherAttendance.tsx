import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { teacherClassesApi, attendanceApi, studentClassesApi } from "@/lib/api";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { Calendar, Check, X, Clock, AlertCircle, Loader2, Save } from "lucide-react";
import { format } from "date-fns";

interface StudentAttendance {
  studentId: string;
  studentName: string;
  status: "PRESENT" | "ABSENT" | "LATE" | "EXCUSED" | null;
}

interface ClassOption {
  id: string;
  name: string;
}

export default function TeacherAttendance() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [classes, setClasses] = useState<ClassOption[]>([]);
  const [selectedClass, setSelectedClass] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState(format(new Date(), "yyyy-MM-dd"));
  const [students, setStudents] = useState<StudentAttendance[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Fetch teacher's classes
  useEffect(() => {
    async function fetchClasses() {
      if (!user) return;

      try {
        const response = await teacherClassesApi.getMyClasses();
        const teacherClasses = response.data.data || [];
        
        const uniqueClasses = Array.from(
          new Map(teacherClasses.map((tc: any) => [tc.schoolClass.id, { id: tc.schoolClass.id, name: tc.schoolClass.name }])).values()
        ) as ClassOption[];
        
        setClasses(uniqueClasses);
        if (uniqueClasses.length > 0) {
          setSelectedClass(uniqueClasses[0].id);
        }
      } catch (error) {
        console.error("Error fetching classes:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchClasses();
  }, [user]);

  // Fetch students and attendance when class or date changes
  useEffect(() => {
    async function fetchStudentsAndAttendance() {
      if (!selectedClass) return;

      setLoading(true);
      try {
        // Get students in the class
        const studentsResponse = await studentClassesApi.getStudentsByClass(selectedClass);
        const classStudents = studentsResponse.data.data || [];
        
        // Get existing attendance for the date
        const attendanceResponse = await attendanceApi.getByClassAndDate(selectedClass, selectedDate);
        const attendanceData = attendanceResponse.data.data || [];
        
        const attendanceMap = new Map(
          attendanceData.map((a: any) => [a.student.id, a.status])
        );

        setStudents(
          classStudents.map((sc: any) => ({
            studentId: sc.student.id,
            studentName: sc.student.fullName,
            status: (attendanceMap.get(sc.student.id) as any) || null,
          }))
        );
      } catch (error) {
        console.error("Error fetching students:", error);
        setStudents([]);
      } finally {
        setLoading(false);
      }
    }

    fetchStudentsAndAttendance();
  }, [selectedClass, selectedDate]);

  const updateStatus = (studentId: string, status: "PRESENT" | "ABSENT" | "LATE" | "EXCUSED") => {
    setStudents((prev) =>
      prev.map((s) =>
        s.studentId === studentId ? { ...s, status } : s
      )
    );
  };

  const saveAttendance = async () => {
    if (!user || !selectedClass) return;

    setSaving(true);
    try {
      const attendanceRecords = students
        .filter((s) => s.status !== null)
        .map((s) => ({
          studentId: s.studentId,
          classId: selectedClass,
          date: selectedDate,
          status: s.status!,
        }));

      // Save attendance records
      await attendanceApi.markBulk(attendanceRecords);

      toast({
        title: "Attendance Saved",
        description: `Attendance for ${format(new Date(selectedDate), "MMMM d, yyyy")} has been saved.`,
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to save attendance",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const statusButtons = [
    { status: "PRESENT" as const, icon: <Check className="w-4 h-4" />, label: "Present", color: "bg-success/10 text-success hover:bg-success/20" },
    { status: "ABSENT" as const, icon: <X className="w-4 h-4" />, label: "Absent", color: "bg-destructive/10 text-destructive hover:bg-destructive/20" },
    { status: "LATE" as const, icon: <Clock className="w-4 h-4" />, label: "Late", color: "bg-warning/10 text-warning hover:bg-warning/20" },
    { status: "EXCUSED" as const, icon: <AlertCircle className="w-4 h-4" />, label: "Excused", color: "bg-info/10 text-info hover:bg-info/20" },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="page-header">
          <h1 className="page-title">Mark Attendance</h1>
          <p className="page-description">Record student attendance for your classes</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-primary" />
              Attendance Sheet
            </CardTitle>
            <CardDescription>Select a class and date to mark attendance</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <label className="text-sm font-medium mb-2 block">Class</label>
                <Select value={selectedClass} onValueChange={setSelectedClass}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select class" />
                  </SelectTrigger>
                  <SelectContent>
                    {classes.map((cls) => (
                      <SelectItem key={cls.id} value={cls.id}>
                        {cls.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex-1">
                <label className="text-sm font-medium mb-2 block">Date</label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                />
              </div>
            </div>

            {/* Student List */}
            {loading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : students.length === 0 ? (
              <div className="text-center py-12">
                <Calendar className="w-12 h-12 mx-auto text-muted-foreground/40" />
                <p className="mt-4 text-muted-foreground">No students in this class.</p>
              </div>
            ) : (
              <>
                <div className="space-y-3">
                  {students.map((student) => (
                    <div
                      key={student.studentId}
                      className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-lg border border-border"
                    >
                      <span className="font-medium">{student.studentName}</span>
                      <div className="flex flex-wrap gap-2">
                        {statusButtons.map((btn) => (
                          <Button
                            key={btn.status}
                            type="button"
                            size="sm"
                            variant="ghost"
                            className={`gap-1 ${student.status === btn.status ? btn.color + " ring-2 ring-offset-2" : ""}`}
                            onClick={() => updateStatus(student.studentId, btn.status)}
                          >
                            {btn.icon}
                            <span className="hidden sm:inline">{btn.label}</span>
                          </Button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex justify-end">
                  <Button onClick={saveAttendance} disabled={saving} className="gap-2">
                    {saving ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Save className="w-4 h-4" />
                    )}
                    Save Attendance
                  </Button>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
