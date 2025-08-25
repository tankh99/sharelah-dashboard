import { jwtDecode } from 'jwt-decode';

/**
 * JWT utility functions using the jwt-decode library
 * This provides reliable JWT decoding without custom implementation
 */

export interface JWTPayload {
  _id: string;
  email: string;
  userRoles: string[];
  iat: number;
  exp: number;
  [key: string]: any;
}

/**
 * Decodes a JWT token using the jwt-decode library
 */
export function decodeJWT(token: string): JWTPayload | null {
  try {
    return jwtDecode<JWTPayload>(token);
  } catch (error) {
    console.error('Error decoding JWT:', error);
    return null;
  }
}

/**
 * Checks if a JWT token is expired
 */
export function isTokenExpired(token: string): boolean {
  try {
    const payload = jwtDecode<JWTPayload>(token);
    const currentTime = Math.floor(Date.now() / 1000);
    return payload.exp < currentTime;
  } catch (error) {
    console.error('Error checking token expiration:', error);
    return true; // Treat as expired if we can't decode
  }
}

/**
 * Extracts user roles from JWT token
 */
export function getUserRolesFromToken(token: string): string[] {
  try {
    const payload = jwtDecode<JWTPayload>(token);
    return payload.userRoles || [];
  } catch (error) {
    console.error('Error extracting user roles from token:', error);
    return [];
  }
}

/**
 * Checks if user has admin role from JWT token
 */
export function hasAdminRoleFromToken(token: string): boolean {
  try {
    const roles = getUserRolesFromToken(token);
    return roles.some(role => role.toLowerCase() === 'admin');
  } catch (error) {
    console.error('Error checking admin role from token:', error);
    return false;
  }
}

/**
 * Checks if user has moderator role from JWT token
 */
export function hasModeratorRoleFromToken(token: string): boolean {
  try {
    const roles = getUserRolesFromToken(token);
    return roles.some(role => role.toLowerCase() === 'moderator');
  } catch (error) {
    console.error('Error checking moderator role from token:', error);
    return false;
  }
}

/**
 * Checks if user has admin access (admin or moderator) from JWT token
 */
export function hasAdminAccessFromToken(token: string): boolean {
  try {
    const roles = getUserRolesFromToken(token);
    return roles.some(role => 
      role.toLowerCase() === 'admin' || role.toLowerCase() === 'moderator'
    );
  } catch (error) {
    console.error('Error checking admin access from token:', error);
    return false;
  }
}

/**
 * Gets user ID from JWT token
 */
export function getUserIdFromToken(token: string): string | null {
  try {
    const payload = jwtDecode<JWTPayload>(token);
    return payload._id || null;
  } catch (error) {
    console.error('Error extracting user ID from token:', error);
    return null;
  }
}

/**
 * Gets user email from JWT token
 */
export function getUserEmailFromToken(token: string): string | null {
  try {
    const payload = jwtDecode<JWTPayload>(token);
    return payload.email || null;
  } catch (error) {
    console.error('Error extracting user email from token:', error);
    return null;
  }
}
