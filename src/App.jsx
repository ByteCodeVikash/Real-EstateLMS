import React from 'react';
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

const DashboardLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-premium-bg text-premium-text">
      <Sidebar />
      <Navbar />
      <main className="lg:pl-64 pt-20">
        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  );
};

function App() {
  const location = useLocation();
  const isWatchPage = location.pathname.startsWith('/watch');
  const isLandingPage = location.pathname === '/';

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
        
        {/* Redirects */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AnimatePresence>
  );
}

export default App;
