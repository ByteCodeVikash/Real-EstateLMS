import { useState } from 'react';
import { Routes, Route, Navigate, useLocation, Link } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { useTheme } from './context/ThemeContext';
import LandingPage from './pages/LandingPage';
import About from './pages/about/About';
import Contact from './pages/contact/Contact';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Dashboard from './pages/Dashboard';
import MyCourses from './pages/MyCourses';
import PublicCoursesPage from './pages/PublicCoursesPage';
import CourseWatch from './pages/CourseWatch';
import Assignments from './pages/Assignments';
import LiveClasses from './pages/LiveClasses';
import ProfileSecurity from './pages/ProfileSecurity';
import Notifications from './pages/Notifications';
import AccessDenied from './pages/AccessDenied';
import CourseDetail from './pages/CourseDetail';
import { Sidebar, Navbar, PublicNavbar } from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';

// Admin imports
import { AdminLayout } from './components/admin/AdminLayout';
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminStudents from './pages/admin/AdminStudents';
import AdminCourses from './pages/admin/AdminCourses';
import AdminInstructors from './pages/admin/AdminInstructors';
import AdminLiveClasses from './pages/admin/AdminLiveClasses';
import AdminAssignments from './pages/admin/AdminAssignments';
import AdminAnalytics from './pages/admin/AdminAnalytics';
import AdminRevenue from './pages/admin/AdminRevenue';
import AdminCertificates from './pages/admin/AdminCertificates';
import AdminNotifications from './pages/admin/AdminNotifications';
import AdminSecurity from './pages/admin/AdminSecurity';
import AdminSettings from './pages/admin/AdminSettings';

const DashboardLayout = ({ children }) => {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  return (
    <div className="min-h-screen bg-premium-bg text-premium-text">
      <Sidebar isOpen={mobileSidebarOpen} onClose={() => setMobileSidebarOpen(false)} />
      <Navbar onMenuOpen={() => setMobileSidebarOpen(true)} />
      <main className="lg:pl-64 pt-28">
        <div className="p-4 sm:p-6 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  );
};

const AdminDashboardLayout = ({ children }) => {
  return (
    <AdminLayout>
      {children}
    </AdminLayout>
  );
};

// Public layout — uses the same navbar as LandingPage (theme-aware)
const PublicCourseLayout = ({ children }) => {
  const { isDarkMode } = useTheme();
  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDarkMode ? 'bg-[#050505] text-[#c5c5c7]' : 'bg-[#F9FAFB] text-[#1F2937]'}`}>
      <PublicNavbar />
      <main>
        {children}
      </main>
    </div>
  );
};

function App() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* Landing Page */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />

        {/* Auth Pages (Standalone) */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/access-denied" element={<AccessDenied />} />

        {/* Course Watch Page (Standalone Layout) */}
        <Route path="/watch/:id" element={<ProtectedRoute allowedRoles={['student', 'admin', 'super_admin']}><CourseWatch /></ProtectedRoute>} />

        {/* Dashboard Routes (Shared Layout) */}
        <Route path="/dashboard" element={<ProtectedRoute allowedRoles={['student', 'admin', 'super_admin']}><DashboardLayout><Dashboard /></DashboardLayout></ProtectedRoute>} />
        {/* Public Course Catalog — no login required */}
        <Route path="/courses" element={<PublicCoursesPage />} />
        {/* Public Course Detail — no login required; Buy Now redirects to login if needed */}
        <Route path="/courses/:id" element={<PublicCourseLayout><CourseDetail /></PublicCourseLayout>} />
        <Route path="/assignments" element={<ProtectedRoute allowedRoles={['student', 'admin', 'super_admin']}><DashboardLayout><Assignments /></DashboardLayout></ProtectedRoute>} />
        <Route path="/live" element={<ProtectedRoute allowedRoles={['student', 'admin', 'super_admin']}><DashboardLayout><LiveClasses /></DashboardLayout></ProtectedRoute>} />
        <Route path="/security" element={<ProtectedRoute allowedRoles={['student', 'admin', 'super_admin']}><DashboardLayout><ProfileSecurity /></DashboardLayout></ProtectedRoute>} />
        <Route path="/notifications" element={<ProtectedRoute allowedRoles={['student', 'admin', 'super_admin']}><DashboardLayout><Notifications /></DashboardLayout></ProtectedRoute>} />
        
        {/* Admin Console Routes (Shared Admin Layout) */}
        <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="/admin/dashboard" element={<ProtectedRoute allowedRoles={['admin', 'super_admin']}><AdminDashboardLayout><AdminDashboard /></AdminDashboardLayout></ProtectedRoute>} />
        <Route path="/admin/students" element={<ProtectedRoute allowedRoles={['admin', 'super_admin']}><AdminDashboardLayout><AdminStudents /></AdminDashboardLayout></ProtectedRoute>} />
        <Route path="/admin/courses" element={<ProtectedRoute allowedRoles={['admin', 'super_admin']}><AdminDashboardLayout><AdminCourses /></AdminDashboardLayout></ProtectedRoute>} />
        <Route path="/admin/instructors" element={<ProtectedRoute allowedRoles={['admin', 'super_admin']}><AdminDashboardLayout><AdminInstructors /></AdminDashboardLayout></ProtectedRoute>} />
        <Route path="/admin/live" element={<ProtectedRoute allowedRoles={['admin', 'super_admin']}><AdminDashboardLayout><AdminLiveClasses /></AdminDashboardLayout></ProtectedRoute>} />
        <Route path="/admin/assignments" element={<ProtectedRoute allowedRoles={['admin', 'super_admin']}><AdminDashboardLayout><AdminAssignments /></AdminDashboardLayout></ProtectedRoute>} />
        <Route path="/admin/analytics" element={<ProtectedRoute allowedRoles={['admin', 'super_admin']}><AdminDashboardLayout><AdminAnalytics /></AdminDashboardLayout></ProtectedRoute>} />
        <Route path="/admin/revenue" element={<ProtectedRoute allowedRoles={['admin', 'super_admin']}><AdminDashboardLayout><AdminRevenue /></AdminDashboardLayout></ProtectedRoute>} />
        <Route path="/admin/certificates" element={<ProtectedRoute allowedRoles={['admin', 'super_admin']}><AdminDashboardLayout><AdminCertificates /></AdminDashboardLayout></ProtectedRoute>} />
        <Route path="/admin/notifications" element={<ProtectedRoute allowedRoles={['admin', 'super_admin']}><AdminDashboardLayout><AdminNotifications /></AdminDashboardLayout></ProtectedRoute>} />
        <Route path="/admin/security" element={<ProtectedRoute allowedRoles={['admin', 'super_admin']}><AdminDashboardLayout><AdminSecurity /></AdminDashboardLayout></ProtectedRoute>} />
        <Route path="/admin/settings" element={<ProtectedRoute allowedRoles={['admin', 'super_admin']}><AdminDashboardLayout><AdminSettings /></AdminDashboardLayout></ProtectedRoute>} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AnimatePresence>
  );
}

export default App;
