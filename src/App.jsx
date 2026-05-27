import { useState } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import MyCourses from './pages/MyCourses';
import CourseWatch from './pages/CourseWatch';
import Assignments from './pages/Assignments';
import LiveClasses from './pages/LiveClasses';
import ProfileSecurity from './pages/ProfileSecurity';
import Notifications from './pages/Notifications';
import { Sidebar, Navbar } from './components/Layout';

// Admin imports
import { AdminLayout } from './components/admin/AdminLayout';
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

function App() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* Landing Page */}
        <Route path="/" element={<LandingPage />} />

        {/* Course Watch Page (Standalone Layout) */}
        <Route path="/watch/:id" element={<CourseWatch />} />

        {/* Dashboard Routes (Shared Layout) */}
        <Route path="/dashboard" element={<DashboardLayout><Dashboard /></DashboardLayout>} />
        <Route path="/courses" element={<DashboardLayout><MyCourses /></DashboardLayout>} />
        <Route path="/assignments" element={<DashboardLayout><Assignments /></DashboardLayout>} />
        <Route path="/live" element={<DashboardLayout><LiveClasses /></DashboardLayout>} />
        <Route path="/security" element={<DashboardLayout><ProfileSecurity /></DashboardLayout>} />
        <Route path="/notifications" element={<DashboardLayout><Notifications /></DashboardLayout>} />
        
        {/* Admin Console Routes (Shared Admin Layout) */}
        <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="/admin/dashboard" element={<AdminDashboardLayout><AdminDashboard /></AdminDashboardLayout>} />
        <Route path="/admin/students" element={<AdminDashboardLayout><AdminStudents /></AdminDashboardLayout>} />
        <Route path="/admin/courses" element={<AdminDashboardLayout><AdminCourses /></AdminDashboardLayout>} />
        <Route path="/admin/instructors" element={<AdminDashboardLayout><AdminInstructors /></AdminDashboardLayout>} />
        <Route path="/admin/live" element={<AdminDashboardLayout><AdminLiveClasses /></AdminDashboardLayout>} />
        <Route path="/admin/assignments" element={<AdminDashboardLayout><AdminAssignments /></AdminDashboardLayout>} />
        <Route path="/admin/analytics" element={<AdminDashboardLayout><AdminAnalytics /></AdminDashboardLayout>} />
        <Route path="/admin/revenue" element={<AdminDashboardLayout><AdminRevenue /></AdminDashboardLayout>} />
        <Route path="/admin/certificates" element={<AdminDashboardLayout><AdminCertificates /></AdminDashboardLayout>} />
        <Route path="/admin/notifications" element={<AdminDashboardLayout><AdminNotifications /></AdminDashboardLayout>} />
        <Route path="/admin/security" element={<AdminDashboardLayout><AdminSecurity /></AdminDashboardLayout>} />
        <Route path="/admin/settings" element={<AdminDashboardLayout><AdminSettings /></AdminDashboardLayout>} />

        {/* Redirects */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AnimatePresence>
  );
}

export default App;
