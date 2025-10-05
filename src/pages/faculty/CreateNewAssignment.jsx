import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import BackButton from "@/components/ui/back-button";
import { ArrowLeft, Save } from "lucide-react";
import dataService from "@/lib/dataService";

const CreateNewAssignment = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    course: "",
    dueDate: "",
    points: "",
  });
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
        const facultyCourses = allCourses.filter(c => c.instructorId === currentUser.id);
        setCourses(facultyCourses);
      } catch (error) {
        console.error('Error fetching courses:', error);
      }
    };
    fetchCourses();
  }, [currentUser]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.course) {
      alert("Please select a course.");
      return;
    }

    const assignmentData = {
      title: formData.title,
      description: formData.description,
      courseId: parseInt(formData.course),
      dueDate: formData.dueDate,
      points: parseInt(formData.points),
      status: "pending",
    };

    try {
      await dataService.createAssignment(assignmentData);
      alert("Assignment created successfully!");
      navigate("/faculty/dashboard");
    } catch (error) {
      console.error("Error creating assignment:", error);
      alert("Failed to create assignment: " + error.message);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-background/80">
      <div className="mx-auto max-w-4xl px-6 py-8 space-y-8">
        <div className="flex items-center gap-4">
          <BackButton />
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight">Create New Assignment</h1>
            <p className="text-muted-foreground">Create a new assignment for your students</p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Assignment Details</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="title">Assignment Title</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => handleInputChange("title", e.target.value)}
                    placeholder="Enter assignment title"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="course">Course</Label>
                  <Select value={formData.course} onValueChange={(value) => handleInputChange("course", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a course" />
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

                <div className="space-y-2">
                  <Label htmlFor="dueDate">Due Date</Label>
                  <Input
                    id="dueDate"
                    type="datetime-local"
                    value={formData.dueDate}
                    onChange={(e) => handleInputChange("dueDate", e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="points">Points</Label>
                  <Input
                    id="points"
                    type="number"
                    value={formData.points}
                    onChange={(e) => handleInputChange("points", e.target.value)}
                    placeholder="100"
                    min="0"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange("description", e.target.value)}
                  placeholder="Enter assignment description and instructions"
                  rows={6}
                  required
                />
              </div>

              <div className="flex gap-4">
                <Button type="submit" className="flex items-center gap-2">
                  <Save className="h-4 w-4" />
                  Create Assignment
                </Button>
                <Button type="button" variant="outline" onClick={() => navigate("/faculty/dashboard")}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CreateNewAssignment;
