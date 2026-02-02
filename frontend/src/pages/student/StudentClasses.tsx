import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { studentClassesApi } from "@/lib/api";
import { useAuth } from "@/hooks/useAuth";
import { BookOpen, Users, Loader2 } from "lucide-react";

interface EnrolledClass {
  id: string;
  name: string;
  gradeLevel: string | null;
  description: string | null;
  academicYear: string;
}

export default function StudentClasses() {
  const { user } = useAuth();
  const [classes, setClasses] = useState<EnrolledClass[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchClasses() {
      if (!user) return;

      try {
        const response = await studentClassesApi.getMyClasses();
        const studentClasses = response.data.data || [];
        
        setClasses(
          studentClasses.map((sc: any) => ({
            id: sc.schoolClass.id,
            name: sc.schoolClass.name,
            gradeLevel: sc.schoolClass.gradeLevel,
            description: sc.schoolClass.description,
            academicYear: sc.schoolClass.academicYear,
          }))
        );
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
          <p className="page-description">View all classes you are enrolled in</p>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : classes.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <BookOpen className="w-12 h-12 mx-auto text-muted-foreground/40" />
              <p className="mt-4 text-muted-foreground">Not enrolled in any classes yet.</p>
              <p className="text-sm text-muted-foreground">
                Contact your administrator to be enrolled in classes.
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
                <CardContent className="space-y-2">
                  {cls.description && (
                    <p className="text-sm text-muted-foreground">{cls.description}</p>
                  )}
                  <p className="text-xs text-muted-foreground">
                    Academic Year: {cls.academicYear}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
