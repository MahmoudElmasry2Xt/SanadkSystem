import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAppSelector } from '../store';
import { type Permission, type UserRole, rolePermissions } from '../store/authSlice';
import { useDevModuleStore } from '../store/devModuleStore';
import { canAccessPath } from '../utils/permissionSystem';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredPermission?: Permission;
  requiredRole?: UserRole | UserRole[];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requiredPermission, requiredRole }) => {
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);
  const { currentRole } = useDevModuleStore();
  const location = useLocation();

  if (!isAuthenticated || !user) {
    // Redirect to login page and remember the source location
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  // Force first-time login users to change password screen
  if (user.status === 'Pending First Login') {
    return <Navigate to="/auth/force-change-password" replace />;
  }

  const activeRole = currentRole || user.role;

  // Map DevRoles to equivalent Redux UserRoles for permission checks
  const mappedRole: UserRole = 
    activeRole === 'Team Manager' ? 'Team Leader' : 
    activeRole === 'Sales Employee' ? 'Employee' : 
    activeRole as UserRole;

  // General route path access check
  if (!canAccessPath(activeRole as unknown as UserRole, location.pathname)) {
    return <Navigate to="/403" replace />;
  }

  // Check permissions based on active role
  const activePermissions = rolePermissions[mappedRole] || [];
  if (requiredPermission && !activePermissions.includes(requiredPermission)) {
    // User does not have the required permission
    return <Navigate to="/403" replace />;
  }

  // Check roles
  if (requiredRole) {
    const roles = Array.isArray(requiredRole) ? requiredRole : [requiredRole];
    if (!roles.includes(mappedRole)) {
      return <Navigate to="/403" replace />;
    }
  }

  return <>{children}</>;
};
export default ProtectedRoute;

