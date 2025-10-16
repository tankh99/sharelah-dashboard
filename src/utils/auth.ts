import { User } from '@/lib/types';
import { BackendUser } from '@/api/auth';
import { UserRole, UserGender, UserStatus } from '@/lib/enums';
import { getUserRolesFromToken, getUserIdFromToken, getUserEmailFromToken } from './jwt';

/**
 * Maps backend user response to frontend User type
 * This function transforms the backend API response structure to match
 * the frontend User interface, handling field name differences and type conversions.
 */
export const mapBackendUserToFrontend = (backendUser: BackendUser): User => {
  // Map userRoles to roles - properly check if user has admin role
  const roles: UserRole[] = backendUser.userRoles.map(role => {
    switch (role.toLowerCase()) {
      case 'admin':
        return UserRole.ADMIN;
      case 'moderator':
        return UserRole.MODERATOR;
      case 'user':
        return UserRole.USER;
      default:
        return UserRole.USER;
    }
  });

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
  // let status: UserStatus;
  // switch (backendUser.status?.toLowerCase()) {
  //   case 'active':
  //     status = UserStatus.ACTIVE;
  //     break;
  //   case 'inactive':
  //     status = UserStatus.INACTIVE;
  //     break;
  //   default:
  //     status = UserStatus.SUSPENDED;
  // }

  return {
    _id: backendUser._id,
    name: backendUser.name || `${backendUser.firstName} ${backendUser.lastName}`.trim(),
    gender,
    phoneNumber: '', // Not provided in backend response
    email: backendUser.email,
    yearOfBirth: 0,
    created: backendUser.created || null,
    userRoles: roles,
    usedPromoCodes: backendUser.usedPromoCodes || [],
    hasFreeSignup: backendUser.hasFreeSignup,
  };
};

/**
 * Gets user info from stored JWT token
 */
export const getUserFromToken = (): User | null => {
  try {
    const token = localStorage.getItem('token');
    if (!token) return null;

    const roles = getUserRolesFromToken(token);
    const userId = getUserIdFromToken(token);
    const email = getUserEmailFromToken(token);

    if (!userId || !email) return null;

    // Map roles to UserRole enum
    const userRoles: UserRole[] = roles.map(role => {
      switch (role.toLowerCase()) {
        case 'admin':
          return UserRole.ADMIN;
        case 'moderator':
          return UserRole.MODERATOR;
        case 'user':
          return UserRole.USER;
        default:
          return UserRole.USER;
      }
    });

    return {
      _id: userId,
      name: email.split('@')[0], // Use email prefix as name fallback
      gender: '',
      phoneNumber: '',
      email,
      yearOfBirth: 0,
      created: null,
      userRoles,
      usedPromoCodes: [],
      hasFreeSignup: false,
    };
  } catch (error) {
    console.error('Error getting user from token:', error);
    return null;
  }
};

/**
 * Checks if a user has admin privileges
 */
export const isAdmin = (user: User | null): boolean => {
  return user?.userRoles.includes(UserRole.ADMIN) ?? false;
};

/**
 * Checks if a user has moderator privileges
 */
export const isModerator = (user: User | null): boolean => {
  return user?.userRoles.includes(UserRole.MODERATOR) ?? false;
};

/**
 * Checks if a user has any of the specified roles
 */
export const hasRole = (user: User | null, roles: UserRole[]): boolean => {
  return user?.userRoles.some(role => roles.includes(role)) ?? false;
};

/**
 * Checks if a user has admin access (either admin or moderator role)
 */
export const hasAdminAccess = (user: User | null): boolean => {
  return hasRole(user, [UserRole.ADMIN, UserRole.MODERATOR]);
};

/**
 * Gets the user's display name, falling back to email if name is not available
 */
export const getUserDisplayName = (user: User | null): string => {
  if (!user) return 'Unknown User';
  return user.name || user.email || 'Unknown User';
};
