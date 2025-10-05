import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { cn } from "@/lib/utils";
import Index from "./pages/Index";
import SignIn from "./pages/Signin";
import SignUp from "./pages/Signup";
import NotFound from "./pages/NotFound";
import StudentDashboard from "./pages/student/StudentDashboard";
import FacultyDashboard from "./pages/faculty/FacultyDashboard";
import AdminDashboard from "./pages/admin/AdminDashboard";
import FacultyManagement from "./pages/admin/FacultyManagement";
import CreateNewAssignment from "./pages/faculty/CreateNewAssignment";
import GradeSubmissions from "./pages/faculty/GradeSubmissions";
import ScheduleClass from "./pages/faculty/ScheduleClass";
import Reports from "./pages/faculty/Reports";
import Courses from "./pages/faculty/Courses";
import CreateCourse from "./pages/faculty/CreateCourse";
import CourseStudents from "./pages/faculty/CourseStudents";
import AdminManagement from "./pages/admin/AdminManagement";
import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";
import Security from "./pages/Security";
import Status from "./pages/Status";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/student/dashboard" element={<StudentDashboard />} />
          <Route path="/faculty/dashboard" element={<FacultyDashboard />} />
          <Route path="/faculty/courses" element={<Courses />} />
          <Route path="/faculty/course/:id" element={<CourseStudents />} />
          <Route path="/faculty/create-course" element={<CreateCourse />} />
          <Route path="/faculty/create-assignment" element={<CreateNewAssignment />} />
          <Route path="/faculty/grade-submissions" element={<GradeSubmissions />} />
          <Route path="/faculty/schedule-class" element={<ScheduleClass />} />
          <Route path="/faculty/reports" element={<Reports />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/faculty-management" element={<FacultyManagement />} />
          <Route path="/admin/admin-management" element={<AdminManagement />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/security" element={<Security />} />
          <Route path="/status" element={<Status />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
