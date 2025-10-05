import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import BackButton from "@/components/ui/back-button";
import { ArrowLeft, FileText, User, Calendar, Save } from "lucide-react";

const GradeSubmissions = () => {
  const navigate = useNavigate();
  const [submissions, setSubmissions] = useState([]);
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [grade, setGrade] = useState("");
  const [feedback, setFeedback] = useState("");

  useEffect(() => {
    // Mock data - in real app, fetch from API
    const mockSubmissions = [
      {
        id: 1,
        studentName: "Alice Johnson",
        assignmentTitle: "Data Structures Assignment 1",
        submittedDate: "2024-01-10",
        status: "pending",
        fileName: "assignment1.pdf",
      },
      {
        id: 2,
        studentName: "Bob Smith",
        assignmentTitle: "Data Structures Assignment 1",
        submittedDate: "2024-01-09",
        status: "pending",
        fileName: "ds_hw1.pdf",
      },
      {
        id: 3,
        studentName: "Carol Davis",
        assignmentTitle: "Machine Learning Project",
        submittedDate: "2024-01-08",
        status: "graded",
        grade: 85,
        feedback: "Good work on the algorithm implementation.",
        fileName: "ml_project.zip",
      },
    ];
    setSubmissions(mockSubmissions);
  }, []);

  const handleGradeSubmission = (submissionId) => {
    if (!grade.trim()) {
      alert("Please enter a grade");
      return;
    }

    // Update submission
    setSubmissions(prev =>
      prev.map(sub =>
        sub.id === submissionId
          ? { ...sub, status: "graded", grade: parseInt(grade), feedback }
          : sub
      )
    );

    alert("Submission graded successfully!");
    setSelectedSubmission(null);
    setGrade("");
    setFeedback("");
  };

  const getStatusBadge = (status, grade) => {
    if (status === "graded") {
      return <Badge variant="secondary">Graded: {grade}/100</Badge>;
    }
    return <Badge variant="outline">Pending Review</Badge>;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-background/80">
      <div className="mx-auto max-w-6xl px-6 py-8 space-y-8">
        <div className="flex items-center gap-4">
          <BackButton />
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight">Grade Submissions</h1>
            <p className="text-muted-foreground">Review and grade student assignment submissions</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Submissions List */}
          <div className="lg:col-span-2 space-y-4">
            {submissions.map((submission) => (
              <Card key={submission.id} className="cursor-pointer hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">{submission.studentName}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{submission.assignmentTitle}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">
                          Submitted: {submission.submittedDate}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">File: {submission.fileName}</p>
                    </div>
                    <div className="text-right space-y-2">
                      {getStatusBadge(submission.status, submission.grade)}
                      {submission.status === "pending" && (
                        <Button
                          size="sm"
                          onClick={() => setSelectedSubmission(submission)}
                        >
                          Grade
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Grading Panel */}
          <div className="space-y-4">
            {selectedSubmission ? (
              <Card>
                <CardHeader>
                  <CardTitle>Grade Submission</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h3 className="font-medium">{selectedSubmission.studentName}</h3>
                    <p className="text-sm text-muted-foreground">{selectedSubmission.assignmentTitle}</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="grade">Grade (0-100)</Label>
                    <Input
                      id="grade"
                      type="number"
                      min="0"
                      max="100"
                      value={grade}
                      onChange={(e) => setGrade(e.target.value)}
                      placeholder="Enter grade"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="feedback">Feedback</Label>
                    <textarea
                      id="feedback"
                      className="w-full min-h-[100px] px-3 py-2 text-sm border border-input bg-background rounded-md"
                      value={feedback}
                      onChange={(e) => setFeedback(e.target.value)}
                      placeholder="Enter feedback for the student"
                    />
                  </div>

                  <div className="flex gap-2">
                    <Button
                      onClick={() => handleGradeSubmission(selectedSubmission.id)}
                      className="flex-1"
                    >
                      <Save className="h-4 w-4 mr-2" />
                      Save Grade
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setSelectedSubmission(null);
                        setGrade("");
                        setFeedback("");
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="p-6 text-center text-muted-foreground">
                  <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Select a submission to grade</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GradeSubmissions;
