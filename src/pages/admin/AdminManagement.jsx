import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
  Shield,
  Calendar,
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

const AdminManagement = () => {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [showAddAdmin, setShowAddAdmin] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState(null);

  // Mock admin data
  const [adminList, setAdminList] = useState([
    {
      id: 1,
      name: "Admin User",
      email: "admin@smartlearn.edu",
      status: "active",
      joinDate: "2023-01-01",
      permissions: "full",
    },
    {
      id: 2,
      name: "Super Admin",
      email: "superadmin@smartlearn.edu",
      status: "active",
      joinDate: "2023-06-15",
      permissions: "full",
    },
    {
      id: 3,
      name: "New Admin",
      email: "newadmin@smartlearn.edu",
      status: "pending",
      joinDate: "2024-01-10",
      permissions: "limited",
    },
  ]);

  const [newAdmin, setNewAdmin] = useState({
    name: "",
    email: "",
    password: "",
    permissions: "full",
  });

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('currentUser'));
    if (!user || user.role !== 'admin') {
      navigate('/signin');
      return;
    }
    setCurrentUser(user);
  }, [navigate]);

  useEffect(() => {
    const fetchAdmins = async () => {
      try {
        const response = await fetch('/db.json');
        const data = await response.json();
        const admins = data.users.filter(u => u.role === 'admin').map(a => ({
          ...a,
          status: 'active',
          joinDate: '2023-01-01',
          permissions: 'full'
        }));
        setAdminList(admins);
      } catch (error) {
        console.error('Error fetching admins:', error);
      }
    };
    fetchAdmins();
  }, []);

  const filteredAdmins = adminList.filter((admin) => {
    const matchesSearch = admin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         admin.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === "all" || admin.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const handleAddAdmin = async () => {
    if (!newAdmin.name || !newAdmin.email || !newAdmin.password) {
      alert("Please fill in all required fields");
      return;
    }

    try {
      const newUser = await dataService.createUser({
        name: newAdmin.name,
        email: newAdmin.email,
        password: newAdmin.password,
        role: 'admin',
        permissions: newAdmin.permissions,
      });

      const admin = {
        ...newUser,
        status: "pending",
        joinDate: new Date().toISOString().split('T')[0],
      };

      setAdminList([...adminList, admin]);
      setNewAdmin({
        name: "",
        email: "",
        password: "",
        permissions: "full",
      });
      setShowAddAdmin(false);
    } catch (error) {
      alert("Failed to add admin");
    }
  };

  const handleStatusChange = (id, newStatus) => {
    setAdminList(adminList.map(admin =>
      admin.id === id ? { ...admin, status: newStatus } : admin
    ));
  };

  const handleDeleteAdmin = (id) => {
    if (confirm("Are you sure you want to delete this admin?")) {
      setAdminList(adminList.filter(admin => admin.id !== id));
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
              <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">Admin Management</h1>
              <p className="text-muted-foreground">Manage admin accounts and permissions</p>
            </div>
          </div>
          <Button
            onClick={() => setShowAddAdmin(true)}
            className="rounded-full px-4"
          >
            <UserPlus className="h-4 w-4 mr-2" />
            Add Admin
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <SimpleCard>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Admins</p>
                  <p className="text-2xl font-bold">{adminList.length}</p>
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
                  <p className="text-2xl font-bold">{adminList.filter(a => a.status === 'active').length}</p>
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
                  <p className="text-2xl font-bold">{adminList.filter(a => a.status === 'pending').length}</p>
                </div>
                <AlertCircle className="h-8 w-8 text-yellow-600" />
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
                  placeholder="Search admins by name or email..."
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

        {/* Admin List */}
        <SimpleCard>
          <CardHeader>
            <CardTitle>Admin Members ({filteredAdmins.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredAdmins.map((admin) => (
                <div key={admin.id} className="p-4 border border-border/60 rounded-lg">
                  <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-lg">{admin.name}</h3>
                        {getStatusBadge(admin.status)}
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4" />
                          {admin.email}
                        </div>
                        <div className="flex items-center gap-2">
                          <Shield className="h-4 w-4" />
                          {admin.permissions}
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          Joined {new Date(admin.joinDate).toLocaleDateString()}
                        </div>
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
                      {admin.status === "pending" && (
                        <>
                          <Button
                            size="sm"
                            onClick={() => handleStatusChange(admin.id, "active")}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleStatusChange(admin.id, "inactive")}
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
                        onClick={() => handleDeleteAdmin(admin.id)}
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

        {/* Add Admin Modal */}
        {showAddAdmin && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <SimpleCard className="w-full max-w-md max-h-[90vh] overflow-y-auto">
              <CardHeader>
                <CardTitle>Add New Admin</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium">Full Name *</label>
                    <Input
                      placeholder="Admin Name"
                      value={newAdmin.name}
                      onChange={(e) => setNewAdmin({...newAdmin, name: e.target.value})}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium">Email *</label>
                    <Input
                      type="email"
                      placeholder="admin@smartlearn.edu"
                      value={newAdmin.email}
                      onChange={(e) => setNewAdmin({...newAdmin, email: e.target.value})}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium">Temporary Password *</label>
                    <Input
                      type="password"
                      placeholder="Enter temporary password"
                      value={newAdmin.password}
                      onChange={(e) => setNewAdmin({...newAdmin, password: e.target.value})}
                    />
                    <p className="text-xs text-muted-foreground">
                      Admin will use this password to sign in initially
                    </p>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium">Permissions</label>
                    <select
                      value={newAdmin.permissions}
                      onChange={(e) => setNewAdmin({...newAdmin, permissions: e.target.value})}
                      className="w-full px-3 py-2 border border-border/60 rounded-md bg-background text-sm"
                    >
                      <option value="full">Full Access</option>
                      <option value="limited">Limited Access</option>
                    </select>
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <Button onClick={handleAddAdmin} className="flex-1">
                    <UserPlus className="h-4 w-4 mr-2" />
                    Add Admin
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setShowAddAdmin(false)}
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

export default AdminManagement;
