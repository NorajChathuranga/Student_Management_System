import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { marksApi } from "@/lib/api";
import { useAuth } from "@/hooks/useAuth";
import { ClipboardList, TrendingUp, Loader2 } from "lucide-react";
import { format } from "date-fns";

interface MarkRecord {
  id: string;
  subjectName: string;
  examType: string;
  score: number;
  maxScore: number;
  examDate: string;
  className: string;
}

interface SubjectOption {
  id: string;
  name: string;
}

export default function StudentResults() {
  const { user } = useAuth();
  const [subjects, setSubjects] = useState<SubjectOption[]>([]);
  const [selectedSubject, setSelectedSubject] = useState<string>("all");
  const [marks, setMarks] = useState<MarkRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      if (!user) return;

      try {
        // Fetch marks
        const response = await marksApi.getMyMarks();
        const marksData = response.data.data || [];

        const records = marksData.map((m: any) => ({
          id: m.id,
          subjectName: m.subject?.name || "Unknown",
          examType: m.examType,
          score: m.score,
          maxScore: m.maxScore,
          examDate: m.examDate,
          className: m.schoolClass?.name || "Unknown",
        }));

        setMarks(records);

        // Extract unique subjects
        const uniqueSubjects = Array.from(
          new Map(
            marksData
              .filter((m: any) => m.subject)
              .map((m: any) => [m.subject.id, { id: m.subject.id, name: m.subject.name }])
          ).values()
        ) as SubjectOption[];
        setSubjects(uniqueSubjects);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [user]);

  const filteredMarks = selectedSubject === "all"
    ? marks
    : marks.filter((m) => {
        const sub = subjects.find((s) => s.name === m.subjectName);
        return sub?.id === selectedSubject;
      });

  const getGradeColor = (percentage: number) => {
    if (percentage >= 80) return "text-success";
    if (percentage >= 60) return "text-warning";
    return "text-destructive";
  };

  const getGradeLetter = (percentage: number) => {
    if (percentage >= 90) return "A";
    if (percentage >= 80) return "B";
    if (percentage >= 70) return "C";
    if (percentage >= 60) return "D";
    return "F";
  };

  // Calculate overall average
  const overallAverage = marks.length > 0
    ? Math.round(
        marks.reduce((sum, m) => sum + (m.score / m.maxScore) * 100, 0) / marks.length
      )
    : 0;

  // Calculate subject averages
  const subjectAverages = subjects.map((sub) => {
    const subjectMarks = marks.filter((m) => m.subjectName === sub.name);
    const avg = subjectMarks.length > 0
      ? Math.round(
          subjectMarks.reduce((sum, m) => sum + (m.score / m.maxScore) * 100, 0) / subjectMarks.length
        )
      : 0;
    return { name: sub.name, average: avg };
  });

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="page-header">
          <h1 className="page-title">My Results</h1>
          <p className="page-description">View your exam results and grades</p>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="p-6">
            <div className="flex items-center gap-4">
              <div className="icon-container icon-primary">
                <TrendingUp className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Overall Average</p>
                <p className={`text-3xl font-bold ${getGradeColor(overallAverage)}`}>
                  {overallAverage}%
                </p>
              </div>
            </div>
          </Card>
          <Card className="p-6">
            <p className="text-sm text-muted-foreground mb-1">Overall Grade</p>
            <p className={`text-3xl font-bold ${getGradeColor(overallAverage)}`}>
              {getGradeLetter(overallAverage)}
            </p>
          </Card>
          <Card className="p-6">
            <p className="text-sm text-muted-foreground mb-1">Total Exams</p>
            <p className="text-3xl font-bold">{marks.length}</p>
          </Card>
        </div>

        {/* Subject Averages */}
        {subjectAverages.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Subject Performance</CardTitle>
              <CardDescription>Average scores by subject</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {subjectAverages.map((sub) => (
                  <div key={sub.name} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{sub.name}</span>
                      <span className={`font-bold ${getGradeColor(sub.average)}`}>
                        {sub.average}% ({getGradeLetter(sub.average)})
                      </span>
                    </div>
                    <Progress value={sub.average} className="h-2" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Detailed Results */}
        <Card>
          <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <CardTitle className="flex items-center gap-2">
                <ClipboardList className="w-5 h-5 text-primary" />
                Exam Results
              </CardTitle>
              <CardDescription>
                {filteredMarks.length} results found
              </CardDescription>
            </div>
            <div className="w-full sm:w-48">
              <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by subject" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Subjects</SelectItem>
                  {subjects.map((sub) => (
                    <SelectItem key={sub.id} value={sub.id}>
                      {sub.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : filteredMarks.length === 0 ? (
              <div className="text-center py-12">
                <ClipboardList className="w-12 h-12 mx-auto text-muted-foreground/40" />
                <p className="mt-4 text-muted-foreground">No results found.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredMarks.map((mark) => {
                  const percentage = Math.round((mark.score / mark.maxScore) * 100);
                  return (
                    <div
                      key={mark.id}
                      className="p-4 rounded-lg border border-border space-y-3"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-medium">{mark.subjectName}</p>
                          <p className="text-sm text-muted-foreground">
                            {mark.examType} • {mark.className}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {format(new Date(mark.examDate), "MMMM d, yyyy")}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className={`text-xl font-bold ${getGradeColor(percentage)}`}>
                            {mark.score}/{mark.maxScore}
                          </p>
                          <p className={`text-sm font-medium ${getGradeColor(percentage)}`}>
                            {percentage}% ({getGradeLetter(percentage)})
                          </p>
                        </div>
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
    </DashboardLayout>
  );
}
