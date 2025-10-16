import { apiRequest } from './utils';
import { User } from '@/lib/types';

export interface LoginCredentials {
  email: string;
  password: string;
}

// Backend user response structure
export interface BackendUser {
  _id: string;
  provider: string;
  displayName: string;
  defaultPassword: boolean;
  status: string;
  created: string;
  userRoles: string[];
  email: string;
  lastName: string;
  firstName: string;
  __v: number;
  dateOfBirth: string | null;
  gender: string;
  name: string;
  // resetPasswordExpires: string;
  // resetPasswordToken: string;
  accessToken: string;
  usedPromoCodes: string[];
  hasFreeSignup: boolean;

}

export type LoginResponse = BackendUser;

export const authApi = {
  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    return apiRequest<LoginResponse>('/auth/sign-in', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  },

  async getProfile(): Promise<User | null> {
    try {
      return await apiRequest<User>('/users/me');
    } catch {
      // If 401/403, user is not authenticated
      return null;
    }
  },

  async logout(): Promise<void> {
    // Clear any stored tokens/auth data
    // The backend doesn't seem to have a logout endpoint, so we just clear local storage
  },
};
