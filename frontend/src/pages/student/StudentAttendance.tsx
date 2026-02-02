import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { studentClassesApi, attendanceApi } from "@/lib/api";
import { useAuth } from "@/hooks/useAuth";
import { Calendar, Check, X, Clock, AlertCircle, Loader2 } from "lucide-react";
import { format } from "date-fns";

interface AttendanceRecord {
  id: string;
  date: string;
  status: "PRESENT" | "ABSENT" | "LATE" | "EXCUSED";
  className: string;
}

interface ClassOption {
  id: string;
  name: string;
}

export default function StudentAttendance() {
  const { user } = useAuth();
  const [classes, setClasses] = useState<ClassOption[]>([]);
  const [selectedClass, setSelectedClass] = useState<string>("all");
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      if (!user) return;

      try {
        // Fetch enrolled classes
        const classesResponse = await studentClassesApi.getMyClasses();
        const studentClasses = classesResponse.data.data || [];

        setClasses(
          studentClasses.map((sc: any) => ({
            id: sc.schoolClass.id,
            name: sc.schoolClass.name,
          }))
        );

        // Fetch attendance records
        const attendanceResponse = await attendanceApi.getMyAttendance();
        const attendanceData = attendanceResponse.data.data || [];

        setRecords(
          attendanceData.map((a: any) => ({
            id: a.id,
            date: a.date,
            status: a.status,
            className: a.schoolClass?.name || "Unknown",
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

  const filteredRecords = selectedClass === "all"
    ? records
    : records.filter((r) => {
        const cls = classes.find((c) => c.name === r.className);
        return cls?.id === selectedClass;
      });

  const statusConfig = {
    PRESENT: { icon: <Check className="w-4 h-4" />, color: "bg-success/10 text-success", label: "Present" },
    ABSENT: { icon: <X className="w-4 h-4" />, color: "bg-destructive/10 text-destructive", label: "Absent" },
    LATE: { icon: <Clock className="w-4 h-4" />, color: "bg-warning/10 text-warning", label: "Late" },
    EXCUSED: { icon: <AlertCircle className="w-4 h-4" />, color: "bg-info/10 text-info", label: "Excused" },
  };

  const stats = {
    present: filteredRecords.filter((r) => r.status === "PRESENT").length,
    absent: filteredRecords.filter((r) => r.status === "ABSENT").length,
    late: filteredRecords.filter((r) => r.status === "LATE").length,
    excused: filteredRecords.filter((r) => r.status === "EXCUSED").length,
  };

  const total = filteredRecords.length;
  const attendanceRate = total > 0 ? Math.round(((stats.present + stats.late) / total) * 100) : 100;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="page-header">
          <h1 className="page-title">My Attendance</h1>
          <p className="page-description">View your attendance history</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <Card className="p-4">
            <p className="text-sm text-muted-foreground">Attendance Rate</p>
            <p className="text-2xl font-bold text-primary">{attendanceRate}%</p>
          </Card>
          <Card className="p-4">
            <p className="text-sm text-muted-foreground">Present</p>
            <p className="text-2xl font-bold text-success">{stats.present}</p>
          </Card>
          <Card className="p-4">
            <p className="text-sm text-muted-foreground">Absent</p>
            <p className="text-2xl font-bold text-destructive">{stats.absent}</p>
          </Card>
          <Card className="p-4">
            <p className="text-sm text-muted-foreground">Late</p>
            <p className="text-2xl font-bold text-warning">{stats.late}</p>
          </Card>
          <Card className="p-4">
            <p className="text-sm text-muted-foreground">Excused</p>
            <p className="text-2xl font-bold text-info">{stats.excused}</p>
          </Card>
        </div>

        <Card>
          <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-primary" />
                Attendance Records
              </CardTitle>
              <CardDescription>
                {filteredRecords.length} records found
              </CardDescription>
            </div>
            <div className="w-full sm:w-48">
              <Select value={selectedClass} onValueChange={setSelectedClass}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by class" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Classes</SelectItem>
                  {classes.map((cls) => (
                    <SelectItem key={cls.id} value={cls.id}>
                      {cls.name}
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
            ) : filteredRecords.length === 0 ? (
              <div className="text-center py-12">
                <Calendar className="w-12 h-12 mx-auto text-muted-foreground/40" />
                <p className="mt-4 text-muted-foreground">No attendance records found.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredRecords.map((record) => {
                  const config = statusConfig[record.status];
                  return (
                    <div
                      key={record.id}
                      className="flex items-center justify-between p-4 rounded-lg border border-border"
                    >
                      <div>
                        <p className="font-medium">
                          {format(new Date(record.date), "EEEE, MMMM d, yyyy")}
                        </p>
                        <p className="text-sm text-muted-foreground">{record.className}</p>
                      </div>
                      <Badge variant="outline" className={`${config.color} gap-1`}>
                        {config.icon}
                        {config.label}
                      </Badge>
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
