/**
 * Data Service for managing local JSON database
 * Handles all CRUD operations for users, courses, assignments, etc.
 */

const BASE_PATH = import.meta.env.BASE_URL || '/';
const DB_URL = BASE_PATH + 'db.json';

class DataService {
  constructor() {
    this.data = null;
    this.dataLoaded = this.loadData();
  }

  async loadData() {
    try {
      // Load from db.json
      const response = await fetch(DB_URL);
      this.data = await response.json();
    } catch (error) {
      console.error('Error loading data:', error);
      this.data = this.getDefaultData();
    }
  }

  getDefaultData() {
    return {
      users: [],
      courses: [],
      assignments: [],
      quizzes: [],
      achievements: [],
      notifications: [],
      systemStats: { totalUsers: 0, totalCourses: 0, activeInstructors: 0, systemUptime: 99.8, dailyActiveUsers: 0, newRegistrations: 0 },
      systemHealth: [],
      pendingTasks: [],
      recentActivities: []
    };
  }

  async saveData() {
    try {
      // In a real app, you'd save to a backend API
      // For demo purposes, data is not persisted
      // localStorage.setItem('smartlearn_db', JSON.stringify(this.data));
    } catch (error) {
      console.error('Error saving data:', error);
    }
  }

  // User Management
  async getUsers() {
    await this.dataLoaded;
    return this.data.users || [];
  }

  async getUserById(id) {
    const users = await this.getUsers();
    return users.find(user => user.id === parseInt(id));
  }

  async getUserByEmail(email) {
    const users = await this.getUsers();
    return users.find(user => user.email.toLowerCase() === email.toLowerCase());
  }

  async createUser(userData) {
    const users = await this.getUsers();
    const newUser = {
      id: Math.max(...users.map(u => u.id), 0) + 1,
      ...userData,
      createdAt: new Date().toISOString()
    };
    this.data.users.push(newUser);
    await this.saveData();
    return newUser;
  }

  async updateUser(id, updates) {
    const users = await this.getUsers();
    const index = users.findIndex(user => user.id === parseInt(id));
    if (index !== -1) {
      this.data.users[index] = { ...this.data.users[index], ...updates };
      await this.saveData();
      return this.data.users[index];
    }
    return null;
  }

  async deleteUser(id) {
    const users = await this.getUsers();
    const index = users.findIndex(user => user.id === parseInt(id));
    if (index !== -1) {
      const deletedUser = this.data.users.splice(index, 1)[0];
      await this.saveData();
      return deletedUser;
    }
    return null;
  }

  // Course Management
  async getCourses() {
    await this.dataLoaded;
    return this.data.courses || [];
  }

  async getCourseById(id) {
    const courses = await this.getCourses();
    return courses.find(course => course.id === parseInt(id));
  }

  async createCourse(courseData) {
    const courses = await this.getCourses();
    const newCourse = {
      id: Math.max(...courses.map(c => c.id), 0) + 1,
      ...courseData,
      createdAt: new Date().toISOString()
    };
    this.data.courses.push(newCourse);
    await this.saveData();
    return newCourse;
  }

  async updateCourse(id, updates) {
    const courses = await this.getCourses();
    const index = courses.findIndex(course => course.id === parseInt(id));
    if (index !== -1) {
      this.data.courses[index] = { ...this.data.courses[index], ...updates };
      await this.saveData();
      return this.data.courses[index];
    }
    return null;
  }

  async deleteCourse(id) {
    const courses = await this.getCourses();
    const index = courses.findIndex(course => course.id === parseInt(id));
    if (index !== -1) {
      const deletedCourse = this.data.courses.splice(index, 1)[0];
      await this.saveData();
      return deletedCourse;
    }
    return null;
  }

  // Assignment Management
  async getAssignments() {
    await this.dataLoaded;
    return this.data.assignments || [];
  }

  async getAssignmentsByCourse(courseId) {
    const assignments = await this.getAssignments();
    return assignments.filter(assignment => assignment.courseId === parseInt(courseId));
  }

  async createAssignment(assignmentData) {
    const assignments = await this.getAssignments();
    const newAssignment = {
      id: Math.max(...assignments.map(a => a.id), 0) + 1,
      ...assignmentData,
      createdAt: new Date().toISOString()
    };
    this.data.assignments.push(newAssignment);

    // Add notification for the new assignment
    const course = await this.getCourseById(assignmentData.courseId);
    if (!course) {
      throw new Error("Course not found");
    }
    const notifications = await this.getNotifications();
    const newNotification = {
      id: Math.max(...notifications.map(n => n.id), 0) + 1,
      message: `New assignment available in ${course.name}: ${newAssignment.title}`,
      type: "assignment",
      read: false,
      timestamp: new Date().toISOString()
    };
    this.data.notifications.push(newNotification);

    await this.saveData();
    return newAssignment;
  }

  // Quiz Management
  async getQuizzes() {
    await this.dataLoaded;
    return this.data.quizzes || [];
  }

  async getQuizzesByCourse(courseId) {
    const quizzes = await this.getQuizzes();
    return quizzes.filter(quiz => quiz.courseId === parseInt(courseId));
  }

  // Achievement Management
  async getAchievements() {
    await this.dataLoaded;
    return this.data.achievements || [];
  }

  async getUserAchievements(userId) {
    const achievements = await this.getAchievements();
    return achievements.filter(achievement => achievement.userId === parseInt(userId));
  }

  // Notification Management
  async getNotifications() {
    await this.dataLoaded;
    return this.data.notifications || [];
  }

  async getUnreadNotifications() {
    const notifications = await this.getNotifications();
    return notifications.filter(notification => !notification.read);
  }

  async markNotificationAsRead(id) {
    const notifications = await this.getNotifications();
    const index = notifications.findIndex(notification => notification.id === parseInt(id));
    if (index !== -1) {
      this.data.notifications[index].read = true;
      await this.saveData();
      return this.data.notifications[index];
    }
    return null;
  }

  // System Stats
  async getSystemStats() {
    const users = await this.getUsers();
    const courses = await this.getCourses();

    return {
      totalUsers: users.length,
      totalCourses: courses.length,
      activeInstructors: users.filter(u => u.role === 'faculty').length,
      systemUptime: 99.8,
      dailyActiveUsers: Math.floor(users.length * 0.4), // Mock data
      newRegistrations: Math.floor(users.length * 0.1)  // Mock data
    };
  }

  // Authentication
  async authenticateUser(email, password) {
    await this.dataLoaded; // Ensure data is loaded
    const user = await this.getUserByEmail(email);
    if (user && user.password === password) {
      // Update last login
      await this.updateUser(user.id, { lastLogin: new Date().toISOString() });
      return user;
    }
    return null;
  }

  // Dashboard Data
  async getStudentDashboardData(userId) {
    const user = await this.getUserById(userId);
    const courses = await this.getCourses();
    const assignments = await this.getAssignments();
    const quizzes = await this.getQuizzes();
    const achievements = await this.getAchievements();

    // Ensure enrolledCourses is an array and filter correctly
    const enrolledCourseIds = user.enrolledCourses || [];
    const enrolledCourses = courses.filter(course =>
      enrolledCourseIds.includes(course.id)
    );

    const userAssignments = assignments.filter(assignment =>
      enrolledCourses.some(course => course.id === assignment.courseId)
    );

    const userQuizzes = quizzes.filter(quiz =>
      enrolledCourses.some(course => course.id === quiz.courseId)
    );

    const userAchievements = achievements.filter(achievement =>
      achievement.userId === userId
    );

    return {
      user,
      enrolledCourses,
      assignments: userAssignments,
      quizzes: userQuizzes,
      achievements: userAchievements,
      stats: {
        totalCourses: enrolledCourses.length,
        completedCourses: enrolledCourses.filter(c => Number(c.progress) >= 100).length,
        currentLevel: user.level || 1,
        totalXP: user.xp || 0,
        weeklyGoal: 500,
        weeklyProgress: Math.floor(Math.random() * 500), // Mock data
        streak: user.streak || 0
      }
    };
  }

  async getFacultyDashboardData(userId) {
    const user = await this.getUserById(userId);
    const courses = await this.getCourses();
    const assignments = await this.getAssignments();

    const facultyCourses = courses.filter(course =>
      course.instructor === user.name || course.instructorId === userId
    );

    const courseAssignments = assignments.filter(assignment =>
      facultyCourses.some(course => course.id === assignment.courseId)
    );

    return {
      user,
      courses: facultyCourses,
      assignments: courseAssignments,
      stats: {
        totalStudents: facultyCourses.reduce((sum, course) => sum + course.students, 0),
        activeCourses: facultyCourses.length,
        pendingAssignments: courseAssignments.filter(a => a.status === 'pending').length,
        avgClassPerformance: Math.floor(Math.random() * 20) + 70 // Mock data
      }
    };
  }

  async getAdminDashboardData() {
    await this.dataLoaded;
    const users = await this.getUsers();
    const courses = await this.getCourses();
    const systemStats = await this.getSystemStats();

    const userStats = [
      { role: "Students", count: users.filter(u => u.role === 'student').length, change: "+12%" },
      { role: "Faculty", count: users.filter(u => u.role === 'faculty').length, change: "+3%" },
      { role: "Admins", count: users.filter(u => u.role === 'admin').length, change: "0%" }
    ];

    return {
      systemStats,
      userStats,
      recentActivities: this.data.recentActivities || [],
      systemHealth: this.data.systemHealth || [],
      pendingTasks: this.data.pendingTasks || []
    };
  }
}

// Create singleton instance
const dataService = new DataService();

export default dataService;
