import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import BackButton from "@/components/ui/back-button";
import { BookOpen, Users, Calendar, Eye, Edit, Plus } from "lucide-react";
import dataService from "@/lib/dataService";

const Courses = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
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
    if (!currentUser) return;
    const fetchCourses = async () => {
      try {
        const allCourses = await dataService.getCourses();
        const facultyCourses = allCourses.filter(c => c.instructorId === currentUser.id || c.instructor === currentUser.name);
        setCourses(facultyCourses);
      } catch (error) {
        console.error('Error fetching courses:', error);
      }
    };
    fetchCourses();
  }, [currentUser]);

  const getStatusBadge = (status) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-100 text-green-800">Active</Badge>;
      case "upcoming":
        return <Badge variant="outline">Upcoming</Badge>;
      case "completed":
        return <Badge variant="secondary">Completed</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-background/80">
      <div className="mx-auto max-w-6xl px-6 py-8 space-y-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <BackButton />
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight">My Courses</h1>
              <p className="text-muted-foreground">Manage and view all your assigned courses</p>
            </div>
          </div>
          <Button onClick={() => navigate('/faculty/create-course')}>
            <Plus className="h-4 w-4 mr-2" />
            Create Course
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <Card key={course.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle className="text-lg">{course.name}</CardTitle>
                    <p className="text-sm text-muted-foreground">{course.level} • {course.duration}</p>
                  </div>
                  {getStatusBadge("active")}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {course.description}
                </p>

                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span>{course.students} students enrolled</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="text-xs">{course.nextClass}</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>Progress</span>
                      <span>{course.progress}%</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div
                        className="bg-primary h-2 rounded-full transition-all duration-300"
                        style={{ width: `${course.progress}%` }}
                      ></div>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1"
                    onClick={() => navigate(`/faculty/course/${course.id}`)}
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    View Students
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1"
                    onClick={() => alert(`Edit course ${course.name} coming soon!`)}
                  >
                    <Edit className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {courses.length === 0 && (
          <Card>
            <CardContent className="p-12 text-center">
              <BookOpen className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">No courses assigned</h3>
              <p className="text-muted-foreground">
                You don't have any courses assigned yet. Contact your administrator to get courses assigned.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Courses;
