import { useAuth } from '@/contexts/AuthContext';
import { hasAdminAccessFromToken, isTokenExpired, getUserRolesFromToken } from '@/utils/jwt';
import { UserRole } from '@/lib/enums';

/**
 * Custom hook for checking user permissions
 * Provides real-time permission checking based on JWT token
 */
export const usePermissions = () => {
  const { user, isLoading } = useAuth();

  const getToken = () => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('token');
  };

  const hasRole = (role: UserRole): boolean => {
    const token = getToken();
    if (!token || isTokenExpired(token)) return false;
    
    const roles = getUserRolesFromToken(token);
    return roles.some((r: string) => r.toLowerCase() === role.toLowerCase());
  };

  const hasAnyRole = (roles: UserRole[]): boolean => {
    const token = getToken();
    if (!token || isTokenExpired(token)) return false;
    
    const userRoles = getUserRolesFromToken(token);
    return roles.some(role => 
      userRoles.some((r: string) => r.toLowerCase() === role.toLowerCase())
    );
  };

  const isAdmin = (): boolean => {
    const token = getToken();
    if (!token || isTokenExpired(token)) return false;
    return hasAdminAccessFromToken(token);
  };

  const isModerator = (): boolean => {
    return hasRole(UserRole.MODERATOR);
  };

  const isUser = (): boolean => {
    return hasRole(UserRole.USER);
  };

  const canAccessAdmin = (): boolean => {
    return isAdmin() || isModerator();
  };

  const canManageUsers = (): boolean => {
    return isAdmin();
  };

  const canManageStalls = (): boolean => {
    return isAdmin() || isModerator();
  };

  const canViewTransactions = (): boolean => {
    return isAdmin() || isModerator();
  };

  return {
    isLoading,
    user,
    hasRole,
    hasAnyRole,
    isAdmin,
    isModerator,
    isUser,
    canAccessAdmin,
    canManageUsers,
    canManageStalls,
    canViewTransactions,
  };
};
