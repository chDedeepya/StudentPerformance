import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ProgressBar } from "@/components/ui/progress-bar";
import { cn } from "@/lib/utils";
import {
  Users,
  BookOpen,
  Settings,
  TrendingUp,
  UserPlus,
  Shield,
  Database,
  Activity,
  AlertCircle,
  CheckCircle,
  Plus,
  Eye,
  LogOut,
} from "lucide-react";

const SimpleCard = ({ children, className = "" }) => (
  <Card className={cn("rounded-xl border border-border/60 shadow-sm", className)}>
    {children}
  </Card>
);

const StatBlock = ({ icon: Icon, label, value, note }) => (
  <SimpleCard>
    <CardHeader className="pb-3">
      <CardTitle className="text-lg flex items-center gap-2">
        <Icon className="h-5 w-5" /> {label}
      </CardTitle>
    </CardHeader>
    <CardContent>
      <div className="text-3xl font-extrabold tracking-tight">{value}</div>
      {note ? <p className="text-sm text-muted-foreground">{note}</p> : null}
    </CardContent>
  </SimpleCard>
);

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('currentUser'));
    if (!user || user.role !== 'admin') {
      navigate('/signin');
      return;
    }
    setCurrentUser(user);
  }, [navigate]);

  // Mock data
  const systemStats = {
    totalUsers: 2847,
    totalCourses: 45,
    activeInstructors: 67,
    systemUptime: 99.8,
    dailyActiveUsers: 1234,
    newRegistrations: 89,
  };

  const userStats = [
    { role: "Students", count: 2680, change: "+12%" },
    { role: "Faculty", count: 67, change: "+3%" },
    { role: "Admins", count: 12, change: "0%" },
  ];

  const recentActivities = [
    { id: 1, text: "New course 'Advanced AI' created by Dr. Smith", time: "2 hours ago", type: "course" },
    { id: 2, text: "System backup completed successfully", time: "4 hours ago", type: "system" },
    { id: 3, text: "25 new student registrations today", time: "6 hours ago", type: "user" },
    { id: 4, text: "Performance optimization applied", time: "8 hours ago", type: "system" },
    { id: 5, text: "Faculty member John Doe promoted to Senior", time: "1 day ago", type: "user" },
  ];

  const systemHealth = [
    { metric: "Server Performance", value: 95, status: "excellent" },
    { metric: "Database Health", value: 92, status: "good" },
    { metric: "User Satisfaction", value: 87, status: "good" },
    { metric: "Course Completion", value: 78, status: "fair" },
  ];

  const pendingTasks = [
    { id: 1, task: "Review 5 new faculty applications", priority: "high" },
    { id: 2, task: "Approve course material updates", priority: "medium" },
    { id: 3, task: "System maintenance scheduled for weekend", priority: "low" },
    { id: 4, task: "Review student feedback reports", priority: "medium" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-6 py-8 space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
              Welcome back, {currentUser ? currentUser.name.split(" ")[0] : "Admin"}!
            </h1>
            <p className="text-muted-foreground">System overview and management controls</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline">
              <Activity className="h-4 w-4 mr-2" />
              System Logs
            </Button>
            <Button className="rounded-full px-4">
              <Settings className="h-4 w-4 mr-2" />
              System Settings
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

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatBlock
            icon={Users}
            label="Total Users"
            value={systemStats.totalUsers.toLocaleString()}
            note="Platform-wide"
          />
          <StatBlock
            icon={BookOpen}
            label="Active Courses"
            value={systemStats.totalCourses}
            note="Across all departments"
          />
          <StatBlock
            icon={TrendingUp}
            label="Daily Active"
            value={systemStats.dailyActiveUsers.toLocaleString()}
            note="Users today"
          />
          <StatBlock
            icon={Shield}
            label="System Health"
            value={`${systemStats.systemUptime}%`}
            note="Uptime"
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-6">
            {/* User Management & System Health */}
            <div className="lg:col-span-2 space-y-6">
              {/* User Statistics */}
              <SimpleCard>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>User Management</span>
                    <div className="flex gap-2">
                      <Link to="/admin/faculty-management">
                        <Button variant="outline" size="sm">
                          <UserPlus className="h-4 w-4 mr-2" />
                          Add Faculty
                        </Button>
                      </Link>
                      <Link to="/admin/admin-management">
                        <Button variant="outline" size="sm">
                          <Shield className="h-4 w-4 mr-2" />
                          Manage Admins
                        </Button>
                      </Link>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {userStats.map((stat) => (
                    <div
                      key={stat.role}
                      className="flex items-center justify-between p-4 border border-border/60 rounded-lg"
                    >
                      <div>
                        <h3 className="font-semibold">{stat.role}</h3>
                        <p className="text-2xl font-bold">{stat.count.toLocaleString()}</p>
                      </div>
                      <div className="text-right">
                        <Badge
                          variant={stat.change.includes("+") ? "secondary" : "outline"}
                          className={stat.change.includes("+") ? "" : ""}
                        >
                          {stat.change}
                        </Badge>
                        <p className="text-sm text-muted-foreground mt-1">This month</p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </SimpleCard>

            {/* System Health Metrics */}
            <SimpleCard>
              <CardHeader>
                <CardTitle>System Health Metrics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {systemHealth.map((metric) => (
                  <div key={metric.metric} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">{metric.metric}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold">{metric.value}%</span>
                        {metric.value >= 90 ? (
                          <CheckCircle className="h-4 w-4" />
                        ) : metric.value >= 80 ? (
                          <AlertCircle className="h-4 w-4" />
                        ) : (
                          <AlertCircle className="h-4 w-4" />
                        )}
                      </div>
                    </div>
                    <ProgressBar
                      value={metric.value}
                      className="h-2 rounded-full bg-slate-200 dark:bg-slate-800"
                    />
                  </div>
                ))}
              </CardContent>
            </SimpleCard>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Pending Tasks */}
            <SimpleCard>
              <CardHeader>
                <CardTitle>Pending Tasks</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {pendingTasks.map((task) => (
                  <div key={task.id} className="p-3 border border-border/60 rounded-lg">
                    <div className="flex items-start justify-between mb-2">
                      <p className="text-sm font-medium flex-1">{task.task}</p>
                      <Badge
                        variant={
                          task.priority === "high"
                            ? "destructive"
                            : task.priority === "medium"
                            ? "secondary"
                            : "outline"
                        }
                        className="text-xs"
                      >
                        {task.priority}
                      </Badge>
                    </div>
                    <Button size="sm" variant="outline" className="w-full">
                      <Eye className="h-3 w-3 mr-2" />
                      Review
                    </Button>
                  </div>
                ))}
                <Button variant="outline" size="sm" className="w-full">
                  View All Tasks
                </Button>
              </CardContent>
            </SimpleCard>

            {/* Recent System Activities */}
            <SimpleCard>
              <CardHeader>
                <CardTitle>Recent Activities</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {recentActivities.slice(0, 4).map((activity) => (
                  <div key={activity.id} className="p-3 rounded-lg border border-border/60">
                    <div className="flex items-start gap-2">
                      <div
                        className={cn(
                          "w-2 h-2 rounded-full mt-2 flex-shrink-0",
                          activity.type === "system"
                            ? "bg-foreground"
                            : activity.type === "course"
                            ? "bg-muted-foreground"
                            : "bg-muted"
                        )}
                      />
                      <div className="flex-1">
                        <p className="text-sm font-medium">{activity.text}</p>
                        <p className="text-xs text-muted-foreground">{activity.time}</p>
                      </div>
                    </div>
                  </div>
                ))}
                <Button variant="outline" size="sm" className="w-full">
                  View System Logs
                </Button>
              </CardContent>
            </SimpleCard>

            {/* Quick Admin Actions */}
            <SimpleCard>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full justify-start rounded-full px-4" onClick={() => navigate('/admin/faculty-management')}>
                  <UserPlus className="h-4 w-4 mr-2" />
                  Add New User
                </Button>
                <Button className="w-full justify-start" variant="outline" onClick={() => navigate('/faculty/create-course')}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Course
                </Button>
                <Button className="w-full justify-start" variant="outline" onClick={() => alert('System backup initiated successfully!')}>
                  <Database className="h-4 w-4 mr-2" />
                  Backup System
                </Button>
                <Button className="w-full justify-start" variant="outline" onClick={() => alert('System settings page coming soon!')}>
                  <Settings className="h-4 w-4 mr-2" />
                  System Settings
                </Button>
              </CardContent>
            </SimpleCard>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
