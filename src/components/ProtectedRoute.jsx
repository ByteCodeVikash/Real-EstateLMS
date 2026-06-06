import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center font-sans">
        <div className="w-10 h-10 border-4 border-[#D4AF37]/25 border-t-[#D4AF37] rounded-full animate-spin mb-4" />
        <h3 className="text-white/60 text-xs font-black uppercase tracking-widest">Verifying session...</h3>
      </div>
    );
  }

  if (!user) {
    const redirectPath = location.pathname.startsWith('/admin') ? '/admin/login' : '/login';
    return <Navigate to={redirectPath} state={{ from: location }} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/access-denied" replace />;
  }

  return children;
};

export default ProtectedRoute;
