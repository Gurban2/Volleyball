import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Loading from '../ui/Loading';

interface ProtectedRouteProps {
  requireAdmin?: boolean;
  requireOrganizer?: boolean;
  allowIncompleteProfile?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  requireAdmin = false,
  requireOrganizer = false,
  allowIncompleteProfile = false
}) => {
  const { currentUser, userData, loading, isAdmin, isOrganizer } = useAuth();
  const location = useLocation();
  const isCompleteProfilePage = location.pathname === '/profile/complete';
  
  if (loading) {
    return <Loading />;
  }
  
  if (!currentUser) {
    return <Navigate to="/login" />;
  }
  
  if (!allowIncompleteProfile && 
      !isCompleteProfilePage && 
      userData && 
      userData.profileCompleted === false) {
    return <Navigate to="/profile/complete" />;
  }
  
  if (requireAdmin && !isAdmin()) {
    return <Navigate to="/access-denied" />;
  }
  
  if (requireOrganizer && !isOrganizer()) {
    return <Navigate to="/access-denied" />;
  }
  
  return <Outlet />;
};

export default ProtectedRoute; 