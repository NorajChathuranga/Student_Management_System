import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { teacherClassesApi, studentClassesApi, marksApi } from "@/lib/api";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { ClipboardList, Loader2, Save } from "lucide-react";
import { format } from "date-fns";

interface StudentMark {
  studentId: string;
  studentName: string;
  score: string;
}

interface ClassOption {
  id: string;
  name: string;
}

interface SubjectOption {
  id: string;
  name: string;
}

export default function TeacherMarks() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [classes, setClasses] = useState<ClassOption[]>([]);
  const [subjects, setSubjects] = useState<SubjectOption[]>([]);
  const [selectedClass, setSelectedClass] = useState<string>("");
  const [selectedSubject, setSelectedSubject] = useState<string>("");
  const [examType, setExamType] = useState("MIDTERM");
  const [maxScore, setMaxScore] = useState("100");
  const [examDate, setExamDate] = useState(format(new Date(), "yyyy-MM-dd"));
  const [students, setStudents] = useState<StudentMark[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Fetch teacher's classes and subjects
  useEffect(() => {
    async function fetchData() {
      if (!user) return;

      try {
        const response = await teacherClassesApi.getMyClasses();
        const teacherClasses = response.data.data || [];

        const uniqueClasses = Array.from(
          new Map(teacherClasses.map((tc: any) => [tc.schoolClass.id, { id: tc.schoolClass.id, name: tc.schoolClass.name }])).values()
        ) as ClassOption[];
        setClasses(uniqueClasses);

        const uniqueSubjects = Array.from(
          new Map(
            teacherClasses
              .filter((tc: any) => tc.subject)
              .map((tc: any) => [tc.subject.id, { id: tc.subject.id, name: tc.subject.name }])
          ).values()
        ) as SubjectOption[];
        setSubjects(uniqueSubjects);

        if (uniqueClasses.length > 0) setSelectedClass(uniqueClasses[0].id);
        if (uniqueSubjects.length > 0) setSelectedSubject(uniqueSubjects[0].id);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [user]);

  // Fetch students when class changes
  useEffect(() => {
    async function fetchStudents() {
      if (!selectedClass) return;

      setLoading(true);
      try {
        const response = await studentClassesApi.getStudentsByClass(selectedClass);
        const classStudents = response.data.data || [];

        setStudents(
          classStudents.map((sc: any) => ({
            studentId: sc.student.id,
            studentName: sc.student.fullName,
            score: "",
          }))
        );
      } catch (error) {
        console.error("Error fetching students:", error);
        setStudents([]);
      } finally {
        setLoading(false);
      }
    }

    fetchStudents();
  }, [selectedClass]);

  const updateScore = (studentId: string, score: string) => {
    setStudents((prev) =>
      prev.map((s) =>
        s.studentId === studentId ? { ...s, score } : s
      )
    );
  };

  const saveMarks = async () => {
    if (!user || !selectedClass || !selectedSubject) {
      toast({
        title: "Error",
        description: "Please select a class and subject",
        variant: "destructive",
      });
      return;
    }

    const studentsWithScores = students.filter((s) => s.score !== "");
    if (studentsWithScores.length === 0) {
      toast({
        title: "Error",
        description: "Please enter at least one score",
        variant: "destructive",
      });
      return;
    }

    setSaving(true);
    try {
      const marks = studentsWithScores.map((s) => ({
        studentId: s.studentId,
        classId: selectedClass,
        subjectId: selectedSubject,
        examType: examType,
        score: parseFloat(s.score),
        maxScore: parseFloat(maxScore),
        examDate: examDate,
      }));

      await marksApi.createBulk(marks);

      toast({
        title: "Marks Saved",
        description: `${studentsWithScores.length} student marks have been recorded.`,
      });

      // Clear scores
      setStudents((prev) => prev.map((s) => ({ ...s, score: "" })));
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to save marks",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="page-header">
          <h1 className="page-title">Enter Marks</h1>
          <p className="page-description">Grade exams and assignments</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ClipboardList className="w-5 h-5 text-primary" />
              Grade Entry
            </CardTitle>
            <CardDescription>Select class, subject, and exam type to enter marks</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Filters */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
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
              <div>
                <label className="text-sm font-medium mb-2 block">Subject</label>
                <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select subject" />
                  </SelectTrigger>
                  <SelectContent>
                    {subjects.map((sub) => (
                      <SelectItem key={sub.id} value={sub.id}>
                        {sub.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Exam Type</label>
                <Select value={examType} onValueChange={setExamType}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="QUIZ">Quiz</SelectItem>
                    <SelectItem value="ASSIGNMENT">Assignment</SelectItem>
                    <SelectItem value="MIDTERM">Midterm</SelectItem>
                    <SelectItem value="FINAL">Final</SelectItem>
                    <SelectItem value="PROJECT">Project</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Max Score</label>
                <Input
                  type="number"
                  value={maxScore}
                  onChange={(e) => setMaxScore(e.target.value)}
                  placeholder="100"
                />
              </div>
            </div>

            <div className="w-full sm:w-48">
              <label className="text-sm font-medium mb-2 block">Exam Date</label>
              <input
                type="date"
                value={examDate}
                onChange={(e) => setExamDate(e.target.value)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              />
            </div>

            {/* Student List */}
            {loading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : students.length === 0 ? (
              <div className="text-center py-12">
                <ClipboardList className="w-12 h-12 mx-auto text-muted-foreground/40" />
                <p className="mt-4 text-muted-foreground">No students in this class.</p>
              </div>
            ) : (
              <>
                <div className="space-y-3">
                  {students.map((student) => (
                    <div
                      key={student.studentId}
                      className="flex items-center justify-between gap-4 p-4 rounded-lg border border-border"
                    >
                      <span className="font-medium flex-1">{student.studentName}</span>
                      <div className="flex items-center gap-2">
                        <Input
                          type="number"
                          value={student.score}
                          onChange={(e) => updateScore(student.studentId, e.target.value)}
                          placeholder="Score"
                          className="w-24"
                          min="0"
                          max={maxScore}
                        />
                        <span className="text-muted-foreground">/ {maxScore}</span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex justify-end">
                  <Button onClick={saveMarks} disabled={saving} className="gap-2">
                    {saving ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Save className="w-4 h-4" />
                    )}
                    Save Marks
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
