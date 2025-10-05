import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import BackButton from "@/components/ui/back-button";
import { Save, BookOpen } from "lucide-react";
import dataService from "@/lib/dataService";

const CreateCourse = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    level: "",
    duration: "",
    maxStudents: "",
  });

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Get current user (faculty)
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser) {
      alert("Please log in first");
      navigate("/signin");
      return;
    }

    const courseData = {
      ...formData,
      instructor: currentUser.name,
      instructorId: currentUser.id,
      students: 0,
      progress: 0,
      pendingAssignments: 0,
      assignments: [],
      quizzes: [],
      nextClass: null,
    };

    try {
      await dataService.createCourse(courseData);
      alert("Course created successfully!");
      navigate("/faculty/courses");
    } catch (error) {
      console.error("Error creating course:", error);
      alert("Failed to create course. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-background/80">
      <div className="mx-auto max-w-4xl px-6 py-8 space-y-8">
        <div className="flex items-center gap-4">
          <BackButton />
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight">Create New Course</h1>
            <p className="text-muted-foreground">Create a new course for your students</p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Course Details</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Course Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    placeholder="e.g., Data Structures & Algorithms"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="level">Difficulty Level</Label>
                  <Select value={formData.level} onValueChange={(value) => handleInputChange("level", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Beginner">Beginner</SelectItem>
                      <SelectItem value="Intermediate">Intermediate</SelectItem>
                      <SelectItem value="Advanced">Advanced</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="duration">Duration</Label>
                  <Input
                    id="duration"
                    value={formData.duration}
                    onChange={(e) => handleInputChange("duration", e.target.value)}
                    placeholder="e.g., 16 weeks"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="maxStudents">Maximum Students</Label>
                  <Input
                    id="maxStudents"
                    type="number"
                    value={formData.maxStudents}
                    onChange={(e) => handleInputChange("maxStudents", e.target.value)}
                    placeholder="50"
                    min="1"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange("description", e.target.value)}
                  placeholder="Enter course description and objectives"
                  rows={4}
                  required
                />
              </div>

              <div className="flex gap-4">
                <Button type="submit" className="flex items-center gap-2">
                  <Save className="h-4 w-4" />
                  Create Course
                </Button>
                <Button type="button" variant="outline" onClick={() => navigate("/faculty/courses")}>
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

export default CreateCourse;
