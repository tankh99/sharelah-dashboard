import { User } from '@/lib/types';
import { UserForm } from '@/lib/validations';
import { apiRequest, ApiError } from './utils';

// Users API functions
export const usersApi = {
  // Get all users
  getAll: async (): Promise<User[]> => {
    return apiRequest<User[]>('/users');
  },

  // Get a specific user by ID
  getById: async (id: string): Promise<User> => {
    return apiRequest<User>(`/users/${id}`);
  },

  // Create a new user
  create: async (data: UserForm): Promise<User> => {
    return apiRequest<User>('/users', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // Update an existing user
  update: async (id: string, data: Partial<UserForm>): Promise<User> => {
    return apiRequest<User>(`/users/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  },

  // Delete a user
  delete: async (id: string): Promise<{ message: string }> => {
    return apiRequest<{ message: string }>(`/users/${id}`, {
      method: 'DELETE',
    });
  },
};

// Export the generic API request function for custom endpoints
export { apiRequest, ApiError };
