import { User } from '@/lib/types';
import { BackendUser } from '@/api/auth';
import { UserRole, UserGender, UserStatus } from '@/lib/enums';

/**
 * Maps backend user response to frontend User type
 * This function transforms the backend API response structure to match
 * the frontend User interface, handling field name differences and type conversions.
 */
export const mapBackendUserToFrontend = (backendUser: BackendUser): User => {
  // Map userRoles to roles - assuming the first role is the primary one
  const roles: UserRole[] = backendUser.userRoles.length > 0 ? [UserRole.ADMIN] : [UserRole.USER];
  
  // Map gender
  let gender: UserGender;
  switch (backendUser.gender?.toLowerCase()) {
    case 'male':
      gender = UserGender.MALE;
      break;
    case 'female':
      gender = UserGender.FEMALE;
      break;
    default:
      gender = UserGender.OTHER;
  }

  // Map status
  let status: UserStatus;
  switch (backendUser.status?.toLowerCase()) {
    case 'active':
      status = UserStatus.ACTIVE;
      break;
    case 'inactive':
      status = UserStatus.INACTIVE;
      break;
    default:
      status = UserStatus.SUSPENDED;
  }

  return {
    id: backendUser._id,
    name: backendUser.name || `${backendUser.firstName} ${backendUser.lastName}`.trim(),
    dateOfBirth: backendUser.dateOfBirth || '1990-01-01',
    gender,
    phoneNumber: '', // Not provided in backend response
    email: backendUser.email,
    password: '', // Don't store password
    verifyPassword: '', // Don't store verify password
    roles,
    deviceId: backendUser.deviceId || '',
    facebookId: '', // Not provided in backend response
    status,
    properties: [], // Not provided in backend response
    createdAt: new Date(backendUser.created),
    updatedAt: new Date(backendUser.created), // Using created as updated for now
  };
};

/**
 * Checks if a user has admin privileges
 */
export const isAdmin = (user: User | null): boolean => {
  return user?.roles.includes(UserRole.ADMIN) ?? false;
};

/**
 * Checks if a user has moderator privileges
 */
export const isModerator = (user: User | null): boolean => {
  return user?.roles.includes(UserRole.MODERATOR) ?? false;
};

/**
 * Checks if a user has any of the specified roles
 */
export const hasRole = (user: User | null, roles: UserRole[]): boolean => {
  return user?.roles.some(role => roles.includes(role)) ?? false;
};

/**
 * Gets the user's display name, falling back to email if name is not available
 */
export const getUserDisplayName = (user: User | null): string => {
  if (!user) return 'Unknown User';
  return user.name || user.email || 'Unknown User';
};
