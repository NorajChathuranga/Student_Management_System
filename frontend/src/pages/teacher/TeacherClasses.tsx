import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { teacherClassesApi } from "@/lib/api";
import { useAuth } from "@/hooks/useAuth";
import { BookOpen, Users, Loader2 } from "lucide-react";

interface AssignedClass {
  id: string;
  name: string;
  gradeLevel: string | null;
  description: string | null;
  studentCount: number;
  subjects: string[];
}

export default function TeacherClasses() {
  const { user } = useAuth();
  const [classes, setClasses] = useState<AssignedClass[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchClasses() {
      if (!user) return;

      try {
        const response = await teacherClassesApi.getMyClasses();
        const teacherClasses = response.data.data || [];
        
        const classMap = new Map<string, AssignedClass>();
        
        for (const tc of teacherClasses as any[]) {
          const classId = tc.schoolClass.id;
          const existing = classMap.get(classId);
          const subjectName = tc.subject?.name;
          
          if (existing) {
            if (subjectName && !existing.subjects.includes(subjectName)) {
              existing.subjects.push(subjectName);
            }
          } else {
            classMap.set(classId, {
              id: tc.schoolClass.id,
              name: tc.schoolClass.name,
              gradeLevel: tc.schoolClass.gradeLevel,
              description: tc.schoolClass.description,
              studentCount: tc.studentCount || 0,
              subjects: subjectName ? [subjectName] : [],
            });
          }
        }

        setClasses(Array.from(classMap.values()));
      } catch (error) {
        console.error("Error fetching classes:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchClasses();
  }, [user]);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="page-header">
          <h1 className="page-title">My Classes</h1>
          <p className="page-description">View all classes assigned to you</p>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : classes.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <BookOpen className="w-12 h-12 mx-auto text-muted-foreground/40" />
              <p className="mt-4 text-muted-foreground">No classes assigned yet.</p>
              <p className="text-sm text-muted-foreground">
                Contact your administrator to be assigned to classes.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {classes.map((cls) => (
              <Card key={cls.id} className="hover:shadow-card transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <BookOpen className="w-5 h-5 text-primary" />
                    </div>
                    {cls.name}
                  </CardTitle>
                  {cls.gradeLevel && (
                    <CardDescription>Grade: {cls.gradeLevel}</CardDescription>
                  )}
                </CardHeader>
                <CardContent className="space-y-4">
                  {cls.description && (
                    <p className="text-sm text-muted-foreground">{cls.description}</p>
                  )}
                  <div className="flex items-center gap-2 text-sm">
                    <Users className="w-4 h-4 text-muted-foreground" />
                    <span>{cls.studentCount} students</span>
                  </div>
                  {cls.subjects.length > 0 && (
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Subjects:</p>
                      <div className="flex flex-wrap gap-1">
                        {cls.subjects.map((subject) => (
                          <span
                            key={subject}
                            className="px-2 py-1 text-xs bg-secondary rounded-md"
                          >
                            {subject}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
