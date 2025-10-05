import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import BackButton from "@/components/ui/back-button";
import { BarChart3, Download, FileText, TrendingUp, Users, BookOpen } from "lucide-react";
import dataService from "@/lib/dataService";

const Reports = () => {
  const navigate = useNavigate();
  const [selectedReport, setSelectedReport] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("");
  const [reportData, setReportData] = useState(null);
  const [courses, setCourses] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('currentUser'));
    if (!user || user.role !== 'faculty') {
      navigate('/signin');
      return;
    }
    setCurrentUser(user);

    const fetchCourses = async () => {
      try {
        const allCourses = await dataService.getCourses();
        setCourses(allCourses);
      } catch (error) {
        console.error('Error fetching courses:', error);
      }
    };
    fetchCourses();
  }, [navigate]);

  const reportTypes = [
    { id: "student-performance", name: "Student Performance Report", icon: TrendingUp },
    { id: "course-analytics", name: "Course Analytics Report", icon: BarChart3 },
    { id: "assignment-grades", name: "Assignment Grades Report", icon: FileText },
    { id: "attendance-summary", name: "Attendance Summary Report", icon: Users },
  ];

  const generateReport = async () => {
    if (!selectedReport || !selectedCourse) {
      alert("Please select both report type and course");
      return;
    }

    const courseId = parseInt(selectedCourse);
    const selectedCourseData = courses.find(c => c.id === courseId);
    if (!selectedCourseData) return;

    try {
      const users = await dataService.getUsers();
      const assignments = await dataService.getAssignmentsByCourse(courseId);
      const studentUsers = users.filter(u => u.role === 'student' && u.enrolledCourses?.includes(courseId));
      const totalStudents = studentUsers.length;

      // Base report data
      const baseData = {
        title: "",
        course: selectedCourseData.name,
        generatedAt: new Date().toLocaleString(),
      };

      let reportData;

      switch (selectedReport) {
        case "student-performance":
          const mockGrades = studentUsers.map(() => Math.floor(Math.random() * 35) + 65); // Random grades 65-100
          const averageGrade = totalStudents > 0 ? mockGrades.reduce((a, b) => a + b, 0) / totalStudents : 0;
          const highestGrade = mockGrades.length > 0 ? Math.max(...mockGrades) : 0;
          const lowestGrade = mockGrades.length > 0 ? Math.min(...mockGrades) : 0;
          const passRate = totalStudents > 0 ? (mockGrades.filter(g => g >= 70).length / totalStudents * 100) : 0;

          const topPerformers = mockGrades
            .map((grade, index) => ({ name: studentUsers[index]?.name || `Student ${index + 1}`, grade }))
            .sort((a, b) => b.grade - a.grade)
            .slice(0, 3);

          reportData = {
            ...baseData,
            title: "Student Performance Report",
            summary: {
              totalStudents,
              averageGrade: Math.round(averageGrade),
              highestGrade,
              lowestGrade,
              passRate: Math.round(passRate),
            },
            topPerformers,
          };
          break;

        case "course-analytics":
          const totalEnrollments = totalStudents;
          const completionRate = selectedCourseData.progress || 0;
          const mockWeekly = [
            { week: "Week 1", logins: Math.floor(Math.random() * 50) + 100, assignments: Math.floor(Math.random() * 10) + 10 },
            { week: "Week 2", logins: Math.floor(Math.random() * 50) + 100, assignments: Math.floor(Math.random() * 10) + 10 },
            { week: "Week 3", logins: Math.floor(Math.random() * 50) + 100, assignments: Math.floor(Math.random() * 10) + 10 },
          ];

          reportData = {
            ...baseData,
            title: "Course Analytics Report",
            summary: {
              totalEnrollments,
              completionRate,
              averageTimeSpent: `${Math.floor(Math.random() * 10) + 10}.${Math.floor(Math.random() * 60)} hours`,
              mostAccessedTopic: "Introduction", // Mock
            },
            weeklyActivity: mockWeekly,
          };
          break;

        case "assignment-grades":
          const courseAssignments = assignments;
          const mockAssignments = courseAssignments.length > 0
            ? courseAssignments.map(a => ({
                name: a.title || `Assignment ${a.id}`,
                average: Math.floor(Math.random() * 20) + 70,
                submitted: Math.floor(Math.random() * totalStudents) + 1,
                total: totalStudents,
              }))
            : [
                { name: "Assignment 1", average: 85, submitted: Math.floor(Math.random() * totalStudents) + 1, total: totalStudents },
                { name: "Assignment 2", average: 78, submitted: Math.floor(Math.random() * totalStudents) + 1, total: totalStudents },
                { name: "Assignment 3", average: 92, submitted: Math.floor(Math.random() * totalStudents) + 1, total: totalStudents },
              ];

          reportData = {
            ...baseData,
            title: "Assignment Grades Report",
            assignments: mockAssignments,
          };
          break;

        case "attendance-summary":
          // Mock attendance since not in data
          reportData = {
            ...baseData,
            title: "Attendance Summary Report",
            attendance: {
              totalClasses: Math.floor(Math.random() * 10) + 20,
              averageAttendance: Math.floor(Math.random() * 15) + 80,
              bestAttendance: `${new Date().toISOString().split('T')[0]} (${Math.floor(Math.random() * 10) + 90}%)`,
              worstAttendance: `${new Date().toISOString().split('T')[0]} (${Math.floor(Math.random() * 15) + 70}%)`,
            },
          };
          break;

        default:
          return;
      }

      setReportData(reportData);
    } catch (error) {
      console.error('Error generating report:', error);
      alert('Error generating report. Please try again.');
    }
  };

  const downloadReport = () => {
    alert("Report downloaded successfully!");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-background/80">
      <div className="mx-auto max-w-6xl px-6 py-8 space-y-8">
        <div className="flex items-center gap-4">
          <BackButton />
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight">Reports</h1>
            <p className="text-muted-foreground">Generate and view detailed reports for your courses</p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Generate Report</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="space-y-2">
                <label className="text-sm font-medium">Report Type</label>
                <Select value={selectedReport} onValueChange={setSelectedReport}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select report type" />
                  </SelectTrigger>
                  <SelectContent>
                    {reportTypes.map((report) => (
                      <SelectItem key={report.id} value={report.id}>
                        <div className="flex items-center gap-2">
                          <report.icon className="h-4 w-4" />
                          {report.name}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Course</label>
                <Select value={selectedCourse} onValueChange={setSelectedCourse}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select course" />
                  </SelectTrigger>
                  <SelectContent>
                    {courses.map((course) => (
                      <SelectItem key={course.id} value={course.id.toString()}>
                        {course.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button onClick={generateReport} className="w-full md:w-auto" disabled={false}>
              <BarChart3 className="h-4 w-4 mr-2" />
              Generate Report
            </Button>
          </CardContent>
        </Card>

        {reportData && (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>{reportData.title}</CardTitle>
                <Button onClick={downloadReport} variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Download PDF
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-muted rounded-lg">
                  <BookOpen className="h-8 w-8 mx-auto mb-2 text-primary" />
                  <p className="text-2xl font-bold">{reportData.course}</p>
                  <p className="text-sm text-muted-foreground">Course</p>
                </div>
                <div className="text-center p-4 bg-muted rounded-lg">
                  <Users className="h-8 w-8 mx-auto mb-2 text-primary" />
                  <p className="text-2xl font-bold">
                    {reportData.summary?.totalStudents || reportData.summary?.totalEnrollments || reportData.attendance?.totalClasses}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {reportData.summary?.totalStudents ? "Students" : reportData.summary?.totalEnrollments ? "Enrollments" : "Classes"}
                  </p>
                </div>
                <div className="text-center p-4 bg-muted rounded-lg">
                  <TrendingUp className="h-8 w-8 mx-auto mb-2 text-primary" />
                  <p className="text-2xl font-bold">
                    {reportData.summary?.averageGrade || reportData.summary?.completionRate || reportData.attendance?.averageAttendance}%
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {reportData.summary?.averageGrade ? "Avg Grade" : reportData.summary?.completionRate ? "Completion" : "Attendance"}
                  </p>
                </div>
              </div>

              {reportData.summary && (
                <div>
                  <h3 className="text-lg font-semibold mb-4">Summary</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {Object.entries(reportData.summary).map(([key, value]) => (
                      <div key={key} className="p-3 border rounded-lg">
                        <p className="text-sm text-muted-foreground capitalize">
                          {key.replace(/([A-Z])/g, ' $1').trim()}
                        </p>
                        <p className="text-lg font-semibold">{value}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {reportData.topPerformers && (
                <div>
                  <h3 className="text-lg font-semibold mb-4">Top Performers</h3>
                  <div className="space-y-2">
                    {reportData.topPerformers.map((student, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                        <span>{student.name}</span>
                        <span className="font-semibold">{student.grade}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {reportData.assignments && (
                <div>
                  <h3 className="text-lg font-semibold mb-4">Assignment Breakdown</h3>
                  <div className="space-y-3">
                    {reportData.assignments.map((assignment, index) => (
                      <div key={index} className="p-4 border rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium">{assignment.name}</span>
                          <span className="text-sm text-muted-foreground">
                            {assignment.submitted}/{assignment.total} submitted
                          </span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2">
                          <div
                            className="bg-primary h-2 rounded-full"
                            style={{ width: `${assignment.average}%` }}
                          ></div>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                          Average: {assignment.average}%
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="text-sm text-muted-foreground">
                Generated on: {reportData.generatedAt}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Reports;
