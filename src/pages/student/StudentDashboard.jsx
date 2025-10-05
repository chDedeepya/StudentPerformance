import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import dataService from "@/lib/dataService";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ProgressBar } from "@/components/ui/progress-bar";
import BackButton from "@/components/ui/back-button";
import { cn } from "@/lib/utils";
import {
  BookOpen,
  Trophy,
  Target,
  Star,
  TrendingUp,
  Award,
  Calendar,
  Bell,
  Play,
  Zap,
  X,
  LogOut,
  Plus,
} from "lucide-react";

// ---------- Small primitives ----------
const SimpleCard = ({ children, className }) => (
  <Card className={cn("rounded-xl border border-border/60 shadow-sm bg-card/70 backdrop-blur", className)}>
    {children}
  </Card>
);

const StatValue = ({ children, sub, accent }) => (
  <div>
    <div className={cn("text-3xl font-extrabold tracking-tight", accent && "text-foreground")}>{children}</div>
    {sub ? <p className="text-sm text-muted-foreground mt-1">{sub}</p> : null}
  </div>
);

const PillButton = ({ children, className, ...props }) => (
  <Button className={cn("rounded-full px-4", className)} {...props}>
    {children}
  </Button>
);

const Dot = ({ active = false }) => (
  <span className={cn("inline-block h-3 w-3 rounded-full", active ? "bg-foreground" : "bg-muted")} />
);

// ---------- Utils ----------
const clamp = (n, min = 0, max = 100) => Math.max(min, Math.min(max, Number(n || 0)));
const formatDate = (d) => (d ? new Date(d).toLocaleDateString() : "-");

// ---------- Main ----------
const StudentDashboard = () => {
  const navigate = useNavigate();
  const [studentData, setStudentData] = useState(null);
  const [allCourses, setAllCourses] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [error, setError] = useState("");
  const [enrolling, setEnrolling] = useState(false);
  const dialogRef = useRef(null);

  useEffect(() => {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser || currentUser.role !== 'student') {
      navigate('/signin');
      return;
    }

  const fetchData = async () => {
    try {
      setError("");
      const dashboardData = await dataService.getStudentDashboardData(currentUser.id);
      const courses = await dataService.getCourses();
      const notifications = await dataService.getNotifications();
      const averageProgress = dashboardData.enrolledCourses.length > 0 ? Math.round(dashboardData.enrolledCourses.reduce((sum, c) => sum + clamp(c.progress), 0) / dashboardData.enrolledCourses.length) : 0;
      setStudentData({
        ...dashboardData.user,
        enrolledCourses: dashboardData.enrolledCourses,
        achievements: dashboardData.achievements,
        notifications,
        level: dashboardData.stats.currentLevel,
        averageProgress,
        streak: dashboardData.stats.streak,
        name: dashboardData.user.name,
      });
      setAllCourses(courses);
      setAssignments(dashboardData.assignments);
    } catch (err) {
      console.error("Error fetching data:", err);
      setError("Couldn't load your data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

    fetchData();
  }, [navigate]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") setSelectedCourse(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center" aria-live="polite" aria-busy="true">
          <div className="animate-spin rounded-full h-12 w-12 border-2 border-muted border-t-transparent mx-auto" />
          <p className="mt-3 text-muted-foreground">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (error || !studentData) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-3" role="alert" aria-live="assertive">
          <p className="text-sm text-destructive">{error || "Unexpected error."}</p>
          <Button onClick={() => window.location.reload()}>Retry</Button>
        </div>
      </div>
    );
  }

  const handleCourseClick = (course) => setSelectedCourse(course);
  const handleContinueCourse = (courseId) => {
    // TODO: navigate to course content
    console.log("Continue course:", courseId);
  };

  const handleEnroll = async (courseId) => {
    if (!studentData || enrolling) return;
    setEnrolling(true);
    try {
      const currentEnrolled = (studentData.enrolledCourses || []).map(c => c.id);
      if (currentEnrolled.includes(courseId)) {
        alert("Already enrolled in this course!");
        return;
      }
      const updatedEnrolled = [...currentEnrolled, courseId];
      await dataService.updateUser(studentData.id, { enrolledCourses: updatedEnrolled });
      const updatedUser = await dataService.getUserById(studentData.id);
      localStorage.setItem('currentUser', JSON.stringify(updatedUser));
      // Refresh data
      const updatedDashboard = await dataService.getStudentDashboardData(studentData.id);
      const notifications = await dataService.getNotifications();
      const averageProgress = updatedDashboard.enrolledCourses.length > 0 ? Math.round(updatedDashboard.enrolledCourses.reduce((sum, c) => sum + clamp(c.progress), 0) / updatedDashboard.enrolledCourses.length) : 0;
      setStudentData({
        ...updatedDashboard.user,
        enrolledCourses: updatedDashboard.enrolledCourses,
        achievements: updatedDashboard.achievements,
        notifications,
        level: updatedDashboard.stats.currentLevel,
        averageProgress,
        streak: updatedDashboard.stats.streak,
        name: updatedDashboard.user.name,
      });
      setAssignments(updatedDashboard.assignments);
      alert("Successfully enrolled in the course!");
    } catch (err) {
      console.error("Enrollment failed:", err);
      alert("Failed to enroll. Please try again.");
    } finally {
      setEnrolling(false);
    }
  };

  const completedCount = (studentData?.enrolledCourses || []).filter((c) => clamp(c.progress) >= 100).length;

  const availableCourses = allCourses.filter(course => 
    !(studentData?.enrolledCourses || []).includes(course.id)
  );

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-6 py-8 space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="flex items-center gap-3">
              <BackButton />
              <div>
                <h1 className="text-4xl font-extrabold tracking-tight text-foreground">
                  Welcome back, {(studentData.name || '').split(" ")[0] || 'Student'}!
                </h1>
                <p className="text-muted-foreground text-lg">Ready to continue your learning journey?</p>
              </div>
            </div>
          <div className="flex items-center gap-3">
            <Badge variant="secondary" className="flex items-center gap-2 px-3 py-1 rounded-full">
              <Trophy className="h-4 w-4" /> Level {studentData.level}
            </Badge>
            <Badge variant="outline" className="flex items-center gap-2 px-3 py-1 rounded-full">
              <Star className="h-4 w-4" /> {studentData.averageProgress}% Progress
            </Badge>
            <Badge variant="outline" className="flex items-center gap-2 px-3 py-1 rounded-full">
              <Zap className="h-4 w-4" /> {studentData.streak} Day Streak
            </Badge>
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

        {/* Top Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Weekly Goal */}
          <SimpleCard>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2"><Target className="h-5 w-5" /> Monthly Goal</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between text-sm text-muted-foreground"><span>22🔥</span><span>31🔥</span></div>
                <ProgressBar value={320} max={500} className="h-2 rounded-full bg-slate-200 dark:bg-slate-800" />
                <p className="text-sm text-muted-foreground">9🔥 go</p>
              </div>
            </CardContent>
          </SimpleCard>

          {/* Courses */}
          <SimpleCard>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2"><BookOpen className="h-5 w-5" /> Courses</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <StatValue sub="Enrolled">{studentData.enrolledCourses.length}</StatValue>
                <div className="text-sm text-muted-foreground">{completedCount} completed</div>
              </div>
            </CardContent>
          </SimpleCard>

          {/* Streak */}
          <SimpleCard>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2"><Trophy className="h-5 w-5" /> Streak</CardTitle>
            </CardHeader>
            <CardContent>
              <StatValue sub="Keep it up!">{studentData.streak} Days</StatValue>
              <div className="mt-3 flex gap-1">
                {Array.from({ length: 7 }, (_, i) => (
                  <Dot key={i} active={i < Math.min(7, Number(studentData.streak || 0))} />
                ))}
              </div>
            </CardContent>
          </SimpleCard>

          {/* Notifications */}
          <SimpleCard>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2"><Bell className="h-5 w-5" /> Notifications</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {(studentData.notifications || []).map((n) => (
                  <div key={n.id ?? n.timestamp} className="text-sm rounded-lg p-2 border border-border/60">
                    <p className="font-medium truncate">{n.message ?? n.text ?? "Notification"}</p>
                    <p className="text-xs text-muted-foreground">{n.timestamp ? formatDate(n.timestamp) : ""}</p>
                  </div>
                ))}
                <Button variant="ghost" className="w-full justify-center">View All</Button>
              </div>
            </CardContent>
          </SimpleCard>
        </div>

        {/* Available Courses Section - Full Width */}
        {availableCourses.length > 0 && (
          <SimpleCard className="w-full">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="text-xl font-semibold">Available Courses</span>
                <PillButton size="sm" variant="outline"><BookOpen className="h-4 w-4 mr-2" /> Explore More</PillButton>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {availableCourses.slice(0, 6).map((course) => (
                  <Card key={course.id} className="border border-border/60 rounded-xl">
                    <CardContent className="p-4 space-y-3">
                      <div className="flex-1">
                        <h3 className="font-semibold text-foreground">{course.name}</h3>
                        <p className="text-sm text-muted-foreground">{course.level}{course.instructor ? ` • ${course.instructor}` : ""}</p>
                        <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{course.description}</p>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Badge variant="secondary" className="text-xs">{Number(course.students ?? 0)} students</Badge>
                          <span><Calendar className="h-4 w-4" /> {formatDate(course.nextClass)}</span>
                        </div>
                        <Button 
                          size="sm" 
                          variant="default" 
                          onClick={() => handleEnroll(course.id)}
                          disabled={enrolling}
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          {enrolling ? "Enrolling..." : "Enroll Now"}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              {availableCourses.length > 6 && (
                <Button variant="ghost" className="w-full mt-4">View All Courses</Button>
              )}
            </CardContent>
          </SimpleCard>
        )}

        {/* Upcoming Assignments */}
        {assignments.length > 0 && (
          <SimpleCard className="w-full">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="text-xl font-semibold">Upcoming Assignments</span>
                <PillButton size="sm" variant="outline"><BookOpen className="h-4 w-4 mr-2" /> View All</PillButton>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {assignments.slice(0, 6).sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate)).map((assignment) => {
                  const course = allCourses.find(c => c.id === assignment.courseId);
                  return (
                    <Card key={assignment.id} className="border border-border/60 rounded-xl">
                      <CardContent className="p-4 space-y-3">
                        <div className="flex-1">
                          <h3 className="font-semibold text-foreground">{assignment.title}</h3>
                          <p className="text-sm text-muted-foreground">{course?.name || 'Unknown Course'}</p>
                          <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{assignment.description}</p>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Calendar className="h-4 w-4" />
                            <span>Due: {formatDate(assignment.dueDate)}</span>
                          </div>
                          <Badge variant={assignment.status === 'pending' ? 'secondary' : 'default'}>
                            {assignment.status}
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
              {assignments.length > 6 && (
                <Button variant="ghost" className="w-full mt-4">View All Assignments</Button>
              )}
            </CardContent>
          </SimpleCard>
        )}

        {/* Main Grid */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Enrolled Courses List */}
          <SimpleCard className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="text-xl font-semibold">Your Enrolled Courses</span>
                <PillButton size="sm" variant="default"><BookOpen className="h-4 w-4 mr-2" /> Browse All</PillButton>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {(studentData?.enrolledCourses || []).map((course) => (
                <Card key={course.id} className="border border-border/60 rounded-xl cursor-pointer hover:shadow-md transition-shadow" onClick={() => handleCourseClick(course)}>
                  <CardContent className="p-4 space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <h3 className="font-semibold text-foreground">{course.name}</h3>
                        <p className="text-sm text-muted-foreground">{course.level}{course.instructor ? ` • ${course.instructor}` : ""}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge variant="secondary" className="text-xs">{Number(course.students ?? 0)} students</Badge>
                        <span className="h-5 w-5 rounded-full border border-border/60 inline-flex items-center justify-center" />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-sm mb-1"><span>Progress</span><span>{clamp(course.progress)}%</span></div>
                      <ProgressBar value={clamp(course.progress)} className="h-2 rounded-full bg-slate-200 dark:bg-slate-800" />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground"><Calendar className="h-4 w-4" /><span>Next class: {formatDate(course.nextClass)}</span></div>
                      <PillButton size="sm" variant="default" onClick={(e) => { e.stopPropagation(); handleContinueCourse(course.id); }}>
                        <Play className="h-4 w-4 mr-2" /> Continue
                      </PillButton>
                    </div>
                  </CardContent>
                </Card>
              ))}
              {studentData?.enrolledCourses.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No enrolled courses yet. Start by enrolling in available courses above!</p>
                </div>
              )}
            </CardContent>
          </SimpleCard>

            {/* Achievements / Performance */}
            <div className="space-y-6">
              <SimpleCard>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl"><Award className="h-5 w-5" /> Achievements</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {(studentData.achievements || []).map((a, i) => (
                  <div key={`${a.title}-${i}`} className="flex items-start gap-3 p-3 rounded-lg border border-border/60">
                    <span className="text-lg leading-none">{a.icon ?? "🏅"}</span>
                    <div>
                      <h4 className="font-medium text-sm">{a.title}</h4>
                      <p className="text-xs text-muted-foreground">{a.description}</p>
                    </div>
                  </div>
                ))}
                {(!studentData.achievements || studentData.achievements.length === 0) && (
                  <p className="text-sm text-muted-foreground text-center py-4">No achievements yet. Keep learning!</p>
                )}
              </CardContent>
            </SimpleCard>

            <SimpleCard>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl"><TrendingUp className="h-5 w-5" /> Performance Trend</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center text-sm"><span className="text-muted-foreground">This Week</span><Badge variant="secondary">+15%</Badge></div>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm"><span>Quiz Average</span><span className="font-medium">87%</span></div>
                    <ProgressBar value={87} className="h-2 rounded-full bg-slate-200 dark:bg-slate-800" />
                    <div className="flex justify-between text-sm"><span>Assignment Score</span><span className="font-medium">92%</span></div>
                    <ProgressBar value={92} className="h-2 rounded-full bg-slate-200 dark:bg-slate-800" />
                    <div className="flex justify-between text-sm"><span>Participation</span><span className="font-medium">78%</span></div>
                    <ProgressBar value={78} className="h-2 rounded-full bg-slate-200 dark:bg-slate-800" />
                    <div className="flex justify-between text-sm"><span>Overall Progress</span><span className="font-medium">85%</span></div>
                    <ProgressBar value={85} className="h-2 rounded-full bg-slate-200 dark:bg-slate-800" />
                  </div>
                </div>
              </CardContent>
            </SimpleCard>
          </div>
        </div>
      </div>

      {/* Course detail dialog */}
      {selectedCourse && (
        <div
          className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
          onClick={() => setSelectedCourse(null)}
          aria-hidden={false}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-label={`${selectedCourse.name} details`}
            ref={dialogRef}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-lg rounded-xl border border-border/60 bg-background shadow-lg"
          >
            <div className="p-4 border-b border-border/60 flex items-center justify-between">
              <h3 className="font-semibold">{selectedCourse.name}</h3>
              <Button variant="ghost" size="sm" onClick={() => setSelectedCourse(null)} aria-label="Close">
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="p-4 space-y-3">
              <p className="text-sm text-muted-foreground">
                Level: {selectedCourse.level ?? "-"}
                {selectedCourse.instructor ? ` • Instructor: ${selectedCourse.instructor}` : ""}
              </p>
              <div>
                <div className="flex justify-between text-sm mb-1"><span>Progress</span><span>{clamp(selectedCourse.progress)}%</span></div>
                <ProgressBar value={clamp(selectedCourse.progress)} className="h-2 bg-slate-200 dark:bg-slate-800 rounded-full" />
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-muted-foreground"><Calendar className="h-4 w-4" /><span>Next class: {formatDate(selectedCourse.nextClass)}</span></div>
                <PillButton onClick={() => handleContinueCourse(selectedCourse.id)}><Play className="h-4 w-4 mr-2" /> Continue</PillButton>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentDashboard;
