import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import BackButton from "@/components/ui/back-button";
import { cn } from "@/lib/utils";
import dataService from "@/lib/dataService";
import {
  UserPlus,
  Mail,
  Lock,
  Users,
  Search,
  Filter,
  Edit,
  Trash2,
  Eye,
  CheckCircle,
  XCircle,
  AlertCircle,
  GraduationCap,
  Calendar,
  Phone,
  MapPin,
} from "lucide-react";

const Input = ({ className, ...props }) => (
  <input
    className={cn(
      "w-full rounded-md border border-border/60 bg-background px-3 py-2 text-sm outline-none",
      "placeholder:text-muted-foreground",
      "focus:ring-2 focus:ring-ring/40 focus:border-ring",
      className
    )}
    {...props}
  />
);

const SimpleCard = ({ children, className = "" }) => (
  <Card className={cn("rounded-xl border border-border/60 shadow-sm", className)}>
    {children}
  </Card>
);

const FacultyManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [showAddFaculty, setShowAddFaculty] = useState(false);
  const [selectedFaculty, setSelectedFaculty] = useState(null);

  // Mock faculty data
  const [facultyList, setFacultyList] = useState([
    {
      id: 1,
      name: "Dr. Sarah Johnson",
      email: "sarah.johnson@university.edu",
      department: "Computer Science",
      status: "active",
      joinDate: "2023-01-15",
      courses: 5,
      phone: "+1 (555) 123-4567",
      location: "Building A, Room 201",
    },
    {
      id: 2,
      name: "Prof. Michael Chen",
      email: "michael.chen@university.edu",
      department: "Mathematics",
      status: "active",
      joinDate: "2022-09-01",
      courses: 3,
      phone: "+1 (555) 987-6543",
      location: "Building B, Room 105",
    },
    {
      id: 3,
      name: "Dr. Emily Rodriguez",
      email: "emily.rodriguez@university.edu",
      department: "Physics",
      status: "pending",
      joinDate: "2024-01-10",
      courses: 0,
      phone: "+1 (555) 456-7890",
      location: "Building C, Room 302",
    },
  ]);

  const [newFaculty, setNewFaculty] = useState({
    name: "",
    email: "",
    department: "",
    phone: "",
    location: "",
    password: "",
  });

  useEffect(() => {
    const fetchFaculty = async () => {
      try {
        const response = await fetch('/db.json');
        const data = await response.json();
        const faculty = data.users.filter(u => u.role === 'faculty').map(f => ({
          ...f,
          status: 'active',
          joinDate: '2023-01-01',
          courses: f.courses ? f.courses.length : 0,
          phone: f.phone || '',
          location: f.location || ''
        }));
        setFacultyList(faculty);
      } catch (error) {
        console.error('Error fetching faculty:', error);
      }
    };
    fetchFaculty();
  }, []);

  const filteredFaculty = facultyList.filter((faculty) => {
    const matchesSearch = faculty.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         faculty.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         faculty.department.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === "all" || faculty.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const handleAddFaculty = async () => {
    if (!newFaculty.name || !newFaculty.email || !newFaculty.department || !newFaculty.password) {
      alert("Please fill in all required fields");
      return;
    }

    try {
      const newUser = await dataService.createUser({
        name: newFaculty.name,
        email: newFaculty.email,
        password: newFaculty.password,
        role: 'faculty',
        department: newFaculty.department,
        phone: newFaculty.phone,
        location: newFaculty.location,
      });

      const faculty = {
        ...newUser,
        status: "pending",
        joinDate: new Date().toISOString().split('T')[0],
        courses: 0,
      };

      setFacultyList([...facultyList, faculty]);
      setNewFaculty({
        name: "",
        email: "",
        department: "",
        phone: "",
        location: "",
        password: "",
      });
      setShowAddFaculty(false);
    } catch (error) {
      alert("Failed to add faculty member");
    }
  };

  const handleStatusChange = (id, newStatus) => {
    setFacultyList(facultyList.map(faculty =>
      faculty.id === id ? { ...faculty, status: newStatus } : faculty
    ));
  };

  const handleDeleteFaculty = (id) => {
    if (confirm("Are you sure you want to delete this faculty member?")) {
      setFacultyList(facultyList.filter(faculty => faculty.id !== id));
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">Active</Badge>;
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300">Pending</Badge>;
      case "inactive":
        return <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300">Inactive</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-6 py-8 space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center gap-3">
            <BackButton />
            <div>
              <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">Faculty Management</h1>
              <p className="text-muted-foreground">Manage faculty accounts and permissions</p>
            </div>
          </div>
          <Button
            onClick={() => setShowAddFaculty(true)}
            className="rounded-full px-4"
          >
            <UserPlus className="h-4 w-4 mr-2" />
            Add Faculty
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <SimpleCard>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Faculty</p>
                  <p className="text-2xl font-bold">{facultyList.length}</p>
                </div>
                <Users className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </SimpleCard>

          <SimpleCard>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Active</p>
                  <p className="text-2xl font-bold">{facultyList.filter(f => f.status === 'active').length}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </SimpleCard>

          <SimpleCard>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Pending</p>
                  <p className="text-2xl font-bold">{facultyList.filter(f => f.status === 'pending').length}</p>
                </div>
                <AlertCircle className="h-8 w-8 text-yellow-600" />
              </div>
            </CardContent>
          </SimpleCard>

          <SimpleCard>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Departments</p>
                  <p className="text-2xl font-bold">{new Set(facultyList.map(f => f.department)).size}</p>
                </div>
                <GraduationCap className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </SimpleCard>
        </div>

        {/* Search and Filter */}
        <SimpleCard>
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search faculty by name, email, or department..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
              <div className="flex gap-2">
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-3 py-2 border border-border/60 rounded-md bg-background text-sm"
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="pending">Pending</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>
          </CardContent>
        </SimpleCard>

        {/* Faculty List */}
        <SimpleCard>
          <CardHeader>
            <CardTitle>Faculty Members ({filteredFaculty.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredFaculty.map((faculty) => (
                <div key={faculty.id} className="p-4 border border-border/60 rounded-lg">
                  <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-lg">{faculty.name}</h3>
                        {getStatusBadge(faculty.status)}
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4" />
                          {faculty.email}
                        </div>
                        <div className="flex items-center gap-2">
                          <GraduationCap className="h-4 w-4" />
                          {faculty.department}
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          Joined {new Date(faculty.joinDate).toLocaleDateString()}
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4" />
                          {faculty.phone}
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4" />
                          {faculty.location}
                        </div>
                      </div>
                      <div className="mt-2">
                        <span className="text-sm font-medium">Courses: {faculty.courses}</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
                        <Eye className="h-4 w-4 mr-2" />
                        View
                      </Button>
                      <Button size="sm" variant="outline">
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </Button>
                      {faculty.status === "pending" && (
                        <>
                          <Button
                            size="sm"
                            onClick={() => handleStatusChange(faculty.id, "active")}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleStatusChange(faculty.id, "inactive")}
                            className="text-red-600 hover:text-red-700"
                          >
                            <XCircle className="h-4 w-4 mr-2" />
                            Reject
                          </Button>
                        </>
                      )}
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDeleteFaculty(faculty.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </SimpleCard>

        {/* Add Faculty Modal */}
        {showAddFaculty && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <SimpleCard className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <CardHeader>
                <CardTitle>Add New Faculty Member</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium">Full Name *</label>
                    <Input
                      placeholder="Dr. John Doe"
                      value={newFaculty.name}
                      onChange={(e) => setNewFaculty({...newFaculty, name: e.target.value})}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium">Email *</label>
                    <Input
                      type="email"
                      placeholder="john.doe@university.edu"
                      value={newFaculty.email}
                      onChange={(e) => setNewFaculty({...newFaculty, email: e.target.value})}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium">Department *</label>
                    <Input
                      placeholder="Computer Science"
                      value={newFaculty.department}
                      onChange={(e) => setNewFaculty({...newFaculty, department: e.target.value})}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium">Phone</label>
                    <Input
                      placeholder="+1 (555) 123-4567"
                      value={newFaculty.phone}
                      onChange={(e) => setNewFaculty({...newFaculty, phone: e.target.value})}
                    />
                  </div>
                  <div className="space-y-1.5 md:col-span-2">
                    <label className="text-sm font-medium">Location/Office</label>
                    <Input
                      placeholder="Building A, Room 201"
                      value={newFaculty.location}
                      onChange={(e) => setNewFaculty({...newFaculty, location: e.target.value})}
                    />
                  </div>
                  <div className="space-y-1.5 md:col-span-2">
                    <label className="text-sm font-medium">Temporary Password *</label>
                    <Input
                      type="password"
                      placeholder="Enter temporary password"
                      value={newFaculty.password}
                      onChange={(e) => setNewFaculty({...newFaculty, password: e.target.value})}
                    />
                    <p className="text-xs text-muted-foreground">
                      Faculty member will use this password to sign in initially
                    </p>
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <Button onClick={handleAddFaculty} className="flex-1">
                    <UserPlus className="h-4 w-4 mr-2" />
                    Add Faculty Member
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setShowAddFaculty(false)}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </SimpleCard>
          </div>
        )}
      </div>
    </div>
  );
};

export default FacultyManagement;
