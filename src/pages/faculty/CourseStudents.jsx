import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ProgressBar } from "@/components/ui/progress-bar";
import BackButton from "@/components/ui/back-button";
import { Users, TrendingUp, FileText, Calendar } from "lucide-react";
import dataService from "@/lib/dataService";

const CourseStudents = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [students, setStudents] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [quizzes, setQuizzes] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('currentUser'));
    if (!user || user.role !== 'faculty') {
      navigate('/signin');
      return;
    }
    setCurrentUser(user);
  }, [navigate]);

  useEffect(() => {
    if (!currentUser || !id) return;
    const fetchData = async () => {
      try {
        const courseData = await dataService.getCourseById(parseInt(id));
        if (!courseData || (courseData.instructorId !== currentUser.id && courseData.instructor !== currentUser.name)) {
          navigate('/faculty/courses');
          return;
        }
        setCourse(courseData);

        // Get enrolled students
        const allUsers = await dataService.getUsers();
        const enrolledStudents = allUsers.filter(u => u.role === 'student' && u.enrolledCourses?.includes(parseInt(id)));
        setStudents(enrolledStudents);

        // Get assignments and quizzes for this course
        const courseAssignments = await dataService.getAssignmentsByCourse(parseInt(id));
        setAssignments(courseAssignments);

        const courseQuizzes = await dataService.getQuizzesByCourse(parseInt(id));
        setQuizzes(courseQuizzes);
      } catch (error) {
        console.error('Error fetching course data:', error);
      }
    };
    fetchData();
  }, [currentUser, id, navigate]);

  const getStudentPerformance = (student) => {
    const studentQuizzes = quizzes.filter(q => q.userId === student.id);
    const avgQuizScore = studentQuizzes.length > 0 ? studentQuizzes.reduce((sum, q) => sum + q.score, 0) / studentQuizzes.length : 0;
    const completedAssignments = assignments.filter(a => a.status === 'submitted' && a.userId === student.id).length;
    const totalAssignments = assignments.length;
    const assignmentCompletion = totalAssignments > 0 ? (completedAssignments / totalAssignments) * 100 : 0;

    return {
      avgQuizScore: Math.round(avgQuizScore),
      assignmentCompletion: Math.round(assignmentCompletion),
      overallProgress: Math.round((avgQuizScore + assignmentCompletion) / 2)
    };
  };

  if (!course) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-background/80">
      <div className="mx-auto max-w-7xl px-6 py-8 space-y-8">
        <div className="flex items-center gap-4">
          <BackButton />
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight">{course.name}</h1>
            <p className="text-muted-foreground">Student Performance Overview</p>
          </div>
        </div>

        {/* Course Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <Users className="h-8 w-8 text-primary" />
                <div>
                  <p className="text-2xl font-bold">{students.length}</p>
                  <p className="text-sm text-muted-foreground">Enrolled Students</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <FileText className="h-8 w-8 text-primary" />
                <div>
                  <p className="text-2xl font-bold">{assignments.length}</p>
                  <p className="text-sm text-muted-foreground">Assignments</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <Calendar className="h-8 w-8 text-primary" />
                <div>
                  <p className="text-2xl font-bold">{quizzes.length}</p>
                  <p className="text-sm text-muted-foreground">Quizzes</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <TrendingUp className="h-8 w-8 text-primary" />
                <div>
                  <p className="text-2xl font-bold">{course.progress}%</p>
                  <p className="text-sm text-muted-foreground">Course Progress</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Students List */}
        <Card>
          <CardHeader>
            <CardTitle>Student Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {students.map((student) => {
                const performance = getStudentPerformance(student);
                return (
                  <div key={student.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                        <span className="text-sm font-semibold">{student.name.split(' ').map(n => n[0]).join('')}</span>
                      </div>
                      <div>
                        <h3 className="font-semibold">{student.name}</h3>
                        <p className="text-sm text-muted-foreground">Level {student.level || 1} • {student.xp || 0} XP</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-6">
                      <div className="text-center">
                        <p className="text-sm text-muted-foreground">Quiz Avg</p>
                        <p className="font-semibold">{performance.avgQuizScore}%</p>
                      </div>

                      <div className="text-center">
                        <p className="text-sm text-muted-foreground">Assignments</p>
                        <p className="font-semibold">{performance.assignmentCompletion}%</p>
                      </div>

                      <div className="text-center">
                        <p className="text-sm text-muted-foreground">Overall</p>
                        <div className="flex items-center gap-2">
                          <ProgressBar value={performance.overallProgress} className="w-16 h-2" />
                          <span className="font-semibold">{performance.overallProgress}%</span>
                        </div>
                      </div>

                      <Badge variant={performance.overallProgress >= 80 ? "default" : performance.overallProgress >= 60 ? "secondary" : "destructive"}>
                        {performance.overallProgress >= 80 ? "Excellent" : performance.overallProgress >= 60 ? "Good" : "Needs Attention"}
                      </Badge>
                    </div>
                  </div>
                );
              })}
            </div>

            {students.length === 0 && (
              <div className="text-center py-8">
                <Users className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-semibold mb-2">No students enrolled</h3>
                <p className="text-muted-foreground">Students haven't enrolled in this course yet.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CourseStudents;
