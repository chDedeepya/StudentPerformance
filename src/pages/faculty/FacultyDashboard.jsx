import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ProgressBar } from "@/components/ui/progress-bar";
import {
  Users,
  BookOpen,
  FileText,
  TrendingUp,
  Calendar,
  Plus,
  Eye,
  Edit,
  BarChart3,
  ChevronDown,
  Search,
  LogOut,
} from "lucide-react";
import dataService from "@/lib/dataService";

// ---------- Small primitives ----------
const SimpleCard = ({ children, className = "" }) => (
  <Card className={`rounded-2xl border border-border/60 bg-card/70 shadow-sm backdrop-blur ${className}`}>
    {children}
  </Card>
);

const StatBlock = ({ icon: Icon, label, value, note }) => (
  <SimpleCard>
    <CardHeader className="pb-3">
      <CardTitle className="text-lg flex items-center gap-2 font-semibold">
        <Icon className="h-5 w-5 text-primary" aria-hidden /> {label}
      </CardTitle>
    </CardHeader>
    <CardContent>
      <div className="text-3xl font-extrabold tracking-tight">{value}</div>
      {note ? <p className="text-sm text-muted-foreground mt-1">{note}</p> : null}
    </CardContent>
  </SimpleCard>
);

// ---------- Main Component ----------
const FacultyDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview"); // "overview" | "courses" | "reports"
  const [sortBy, setSortBy] = useState("name"); // "name" | "students" | "progress"
  const [query, setQuery] = useState("");
  const [currentUser, setCurrentUser] = useState(null);
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('currentUser'));
    if (!user || user.role !== 'faculty') {
      navigate('/signin');
      return;
    }
    setCurrentUser(user);
  }, [navigate]);

  useEffect(() => {
    if (!currentUser) return;
    const fetchCourses = async () => {
      try {
        const allCourses = await dataService.getCourses();
        setCourses(allCourses.map(c => ({
          id: c.id,
          name: c.name,
          students: c.students,
          avgProgress: c.progress,
          nextClass: c.nextClass,
          pendingAssignments: c.pendingAssignments,
        })));
      } catch (error) {
        console.error('Error fetching courses:', error);
      }
    };
    fetchCourses();
  }, [currentUser]);

  // Calculate stats from courses
  const facultyStats = {
    totalStudents: courses.reduce((sum, c) => sum + c.students, 0),
    activeCourses: courses.length,
    pendingAssignments: courses.reduce((sum, c) => sum + c.pendingAssignments, 0),
    avgClassPerformance: courses.length > 0 ? Math.round(courses.reduce((sum, c) => sum + c.avgProgress, 0) / courses.length) : 0,
  };

  // simple filter + sort
  const normalizedQuery = query.trim().toLowerCase();
  const filteredCourses = courses
    .filter((c) => (normalizedQuery ? c.name.toLowerCase().includes(normalizedQuery) : true))
    .sort((a, b) => {
      if (sortBy === "name") return a.name.localeCompare(b.name);
      if (sortBy === "students") return b.students - a.students;
      if (sortBy === "progress") return b.avgProgress - a.avgProgress;
      return 0;
    });

  const recentActivities = [
    { id: 1, text: "New assignment submitted by Alex Johnson", time: "2 hours ago" },
    { id: 2, text: "Course material updated for ML Fundamentals", time: "4 hours ago" },
    { id: 3, text: "Student query resolved in DSA course", time: "6 hours ago" },
    { id: 4, text: "Performance report generated", time: "1 day ago" },
  ];

  const progressBadgeTone = (p) => {
    if (p >= 80) return "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300";
    if (p >= 60) return "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300";
    return "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300";
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-background/80">
      <div className="mx-auto max-w-7xl px-6 py-8 space-y-8">
        {/* Page Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
              Welcome back, {currentUser ? currentUser.name.split(" ")[0] : "Faculty"}!
            </h1>
            <p className="text-muted-foreground">Monitor student progress and manage your courses</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button variant="outline" className="rounded-full" onClick={() => navigate('/faculty/reports')}>
              <BarChart3 className="h-4 w-4 mr-2" /> Analytics
            </Button>
            <Button className="rounded-full px-4" onClick={() => navigate('/faculty/create-assignment')}>
              <Plus className="h-4 w-4 mr-2" /> Create Assignment
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                localStorage.removeItem("currentUser");
                navigate("/");
              }}
              aria-label="Logout"
            >
              <LogOut className="h-4 w-4 mr-1" />
              Logout
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <div className="sticky top-16 z-20 -mx-6 border-b border-border/60 bg-background/70 px-6 backdrop-blur supports-[backdrop-filter]:bg-background/50">
          <div className="flex items-center justify-between">
            <div className="flex gap-4">
              {(["overview", "courses", "reports"]).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`py-3 px-3 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === tab
                      ? "border-foreground text-foreground"
                      : "border-transparent text-muted-foreground hover:text-foreground"
                  }`}
                  aria-current={activeTab === tab ? "page" : undefined}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>

            {/* Quick search (for courses tab) */}
            {activeTab === "courses" && (
              <label className="hidden md:flex items-center gap-2 text-sm text-muted-foreground">
                <Search className="h-4 w-4" />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search course…"
                  className="ml-1 rounded-md border bg-background px-2 py-1 text-foreground"
                />
              </label>
            )}
          </div>
        </div>

        {/* -------- Overview -------- */}
        {activeTab === "overview" && (
          <div className="space-y-6">
            {/* Stat grid */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
              <StatBlock icon={Users} label="Total Students" value={facultyStats.totalStudents} note="Across all courses" />
              <StatBlock icon={BookOpen} label="Active Courses" value={facultyStats.activeCourses} note="Currently teaching" />
              <StatBlock icon={FileText} label="Pending Reviews" value={facultyStats.pendingAssignments} note="Assignments to grade" />
              <StatBlock icon={TrendingUp} label="Avg Performance" value={`${facultyStats.avgClassPerformance}%`} note="Class average" />
            </div>

            {/* Courses + Sidebar */}
            <div className="grid gap-6 lg:grid-cols-3">
              {/* Courses overview list */}
              <SimpleCard className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>Total Courses Available</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {courses.map((course) => (
                    <Card key={course.id} className="border border-border/60 rounded-xl bg-card">
                      <CardContent className="p-4 space-y-4">
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                          <div>
                            <h3 className="font-semibold leading-tight">{course.name}</h3>
                            <p className="text-sm text-muted-foreground">
                              {course.students} students • Next class: {course.nextClass}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${progressBadgeTone(course.avgProgress)}`}>
                              {course.avgProgress}% avg
                            </span>
                            <Badge variant="secondary">{course.pendingAssignments} pending</Badge>
                          </div>
                        </div>

                        <div className="space-y-3">
                          <div>
                            <div className="mb-1 flex justify-between text-sm">
                              <span>Class Progress</span>
                              <span>{course.avgProgress}%</span>
                            </div>
                            <ProgressBar value={course.avgProgress} className="h-2 rounded-full bg-slate-200 dark:bg-slate-800" />
                          </div>
                          <div className="flex flex-col-reverse gap-2 sm:flex-row sm:items-center sm:justify-between">
                            <div className="flex gap-2">
                              <Button size="sm" variant="outline" aria-label="View course" onClick={() => navigate('/faculty/courses')}><Eye className="h-4 w-4 mr-1" /> View</Button>
                              <Button size="sm" variant="outline" aria-label="Edit course" onClick={() => alert(`Edit course ${course.name} coming soon!`)}><Edit className="h-4 w-4 mr-1" /> Edit</Button>
                            </div>
                            <Button size="sm" className="rounded-full px-4" onClick={() => navigate('/faculty/courses')}>Manage Course</Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </CardContent>
              </SimpleCard>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Recent Activities */}
                <SimpleCard>
                  <CardHeader>
                    <CardTitle>Recent Activities</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {recentActivities.map((activity) => (
                      <div key={activity.id} className="rounded-lg border border-border/60 p-3">
                        <p className="text-sm font-medium leading-snug">{activity.text}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">{activity.time}</p>
                      </div>
                    ))}
                    <Button variant="outline" size="sm" className="w-full" onClick={() => alert('View All Activities feature coming soon!')}>View All Activities</Button>
                  </CardContent>
                </SimpleCard>

                {/* Quick Actions */}
                <SimpleCard>
                  <CardHeader className="pb-2">
                    <CardTitle>Quick Actions</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Button className="w-full justify-start" variant="outline" onClick={() => navigate('/faculty/create-course')}>
                      <Plus className="h-4 w-4 mr-2" /> Add Course
                    </Button>
                    <Button className="w-full justify-start" variant="outline" onClick={() => navigate('/faculty/create-assignment')}>
                      <Plus className="h-4 w-4 mr-2" /> Create New Assignment
                    </Button>
                    <Button className="w-full justify-start" variant="outline" onClick={() => navigate('/faculty/grade-submissions')}>
                      <FileText className="h-4 w-4 mr-2" /> Grade Submissions
                    </Button>
                    <Button className="w-full justify-start" variant="outline" onClick={() => navigate('/faculty/reports')}>
                      <BarChart3 className="h-4 w-4 mr-2" /> Generate Report
                    </Button>
                    <Button className="w-full justify-start" variant="outline" onClick={() => navigate('/faculty/schedule-class')}>
                      <Calendar className="h-4 w-4 mr-2" /> Schedule Class
                    </Button>
                  </CardContent>
                </SimpleCard>
              </div>
            </div>
          </div>
        )}

        {/* -------- Courses (sortable table) -------- */}
        {activeTab === "courses" && (
          <div className="space-y-6">
            {/* Quick Actions */}
            <SimpleCard>
              <CardHeader className="pb-2">
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full justify-start" variant="outline" onClick={() => navigate('/faculty/create-course')}>
                  <Plus className="h-4 w-4 mr-2" /> Add Course
                </Button>
                <Button className="w-full justify-start" variant="outline" onClick={() => navigate('/faculty/create-assignment')}>
                  <Plus className="h-4 w-4 mr-2" /> Create New Assignment
                </Button>
                <Button className="w-full justify-start" variant="outline" onClick={() => navigate('/faculty/grade-submissions')}>
                  <FileText className="h-4 w-4 mr-2" /> Grade Submissions
                </Button>
                <Button className="w-full justify-start" variant="outline" onClick={() => navigate('/faculty/reports')}>
                  <BarChart3 className="h-4 w-4 mr-2" /> Generate Report
                </Button>
                <Button className="w-full justify-start" variant="outline" onClick={() => navigate('/faculty/schedule-class')}>
                  <Calendar className="h-4 w-4 mr-2" /> Schedule Class
                </Button>
              </CardContent>
            </SimpleCard>

            <SimpleCard>
              <CardHeader className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <CardTitle>Courses</CardTitle>
                <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center">
                  <label className="flex items-center gap-2 text-sm">
                    <Search className="h-4 w-4 text-muted-foreground" />
                    <input
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      placeholder="Search course…"
                      className="rounded-md border bg-background px-2 py-1 text-foreground"
                    />
                  </label>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">Sort by</span>
                    <div className="relative">
                      <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="appearance-none rounded-md border bg-background px-3 py-1 pr-8 text-sm"
                      >
                        <option value="name">Name</option>
                        <option value="students">Students</option>
                        <option value="progress">Progress</option>
                      </select>
                      <ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left border-b border-border/60 bg-muted/30">
                    <th className="py-2 font-semibold">Course</th>
                    <th className="font-semibold">Students Enrolled</th>
                    <th className="font-semibold">Overall Performance</th>
                    <th className="font-semibold">Next Class</th>
                    <th className="font-semibold">Pending</th>
                    <th className="w-36 font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCourses.map((c, idx) => (
                    <tr key={c.id} className={`border-b border-border/40 ${idx % 2 === 0 ? "bg-transparent" : "bg-muted/20"}`}>
                      <td className="py-2 font-medium">{c.name}</td>
                      <td>{c.students}</td>
                      <td>
                        <div className="flex items-center gap-2">
                          <span className={`rounded-full px-2 py-0.5 text-xs ${progressBadgeTone(c.avgProgress)}`}>{c.avgProgress}%</span>
                          <ProgressBar value={c.avgProgress} className="h-2 w-28 bg-slate-200 dark:bg-slate-800" />
                        </div>
                      </td>
                      <td>{c.nextClass}</td>
                      <td>{c.pendingAssignments}</td>
                      <td>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" aria-label="View" onClick={() => alert(`View course ${c.name} coming soon!`)}><Eye className="h-4 w-4" /></Button>
                          <Button size="sm" variant="outline" aria-label="Edit" onClick={() => alert(`Edit course ${c.name} coming soon!`)}><Edit className="h-4 w-4" /></Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Empty state */}
              {filteredCourses.length === 0 && (
                <div className="py-12 text-center text-sm text-muted-foreground">No courses match your search.</div>
              )}
            </CardContent>
          </SimpleCard>
          </div>
        )}

        {/* -------- Reports -------- */}
        {activeTab === "reports" && (
          <div className="space-y-6">
            {/* Quick Actions */}
            <SimpleCard>
              <CardHeader className="pb-2">
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full justify-start" variant="outline" onClick={() => navigate('/faculty/create-course')}>
                  <Plus className="h-4 w-4 mr-2" /> Add Course
                </Button>
                <Button className="w-full justify-start" variant="outline" onClick={() => navigate('/faculty/create-assignment')}>
                  <Plus className="h-4 w-4 mr-2" /> Create New Assignment
                </Button>
                <Button className="w-full justify-start" variant="outline" onClick={() => navigate('/faculty/grade-submissions')}>
                  <FileText className="h-4 w-4 mr-2" /> Grade Submissions
                </Button>
                <Button className="w-full justify-start" variant="outline" onClick={() => navigate('/faculty/reports')}>
                  <BarChart3 className="h-4 w-4 mr-2" /> Generate Report
                </Button>
                <Button className="w-full justify-start" variant="outline" onClick={() => navigate('/faculty/schedule-class')}>
                  <Calendar className="h-4 w-4 mr-2" /> Schedule Class
                </Button>
              </CardContent>
            </SimpleCard>

            <SimpleCard>
              <CardHeader>
                <CardTitle>Reports</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full justify-start" variant="outline" onClick={() => navigate('/faculty/grade-submissions')}>
                  <FileText className="h-4 w-4 mr-2" /> Grade Submissions
                </Button>
                <Button className="w-full justify-start" variant="outline" onClick={() => navigate('/faculty/reports')}>
                  <BarChart3 className="h-4 w-4 mr-2" /> Generate Report
                </Button>
                <Button className="w-full justify-start" variant="outline" onClick={() => navigate('/faculty/schedule-class')}>
                  <Calendar className="h-4 w-4 mr-2" /> Schedule Class
                </Button>
              </CardContent>
            </SimpleCard>
          </div>
        )}
      </div>
    </div>
  );
};

export default FacultyDashboard;
