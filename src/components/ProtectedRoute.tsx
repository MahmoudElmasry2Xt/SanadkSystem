import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAppSelector } from '../store';
import { type Permission, type UserRole } from '../store/authSlice';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredPermission?: Permission;
  requiredRole?: UserRole | UserRole[];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requiredPermission, requiredRole }) => {
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);
  const location = useLocation();

  if (!isAuthenticated || !user) {
    // Redirect to login page and remember the source location
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  // Force first-time login users to change password screen
  if (user.status === 'Pending First Login') {
    return <Navigate to="/auth/force-change-password" replace />;
  }

  if (requiredPermission && !user.permissions.includes(requiredPermission)) {
    // User does not have the required permission
    return <Navigate to="/403" replace />;
  }

  if (requiredRole) {
    const roles = Array.isArray(requiredRole) ? requiredRole : [requiredRole];
    if (!roles.includes(user.role)) {
      return <Navigate to="/403" replace />;
    }
  }

  return <>{children}</>;
};
export default ProtectedRoute;
