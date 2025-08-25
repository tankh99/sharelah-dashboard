import { Stall } from '@/lib/types';
import { StallForm } from '@/lib/validations';
import { apiRequest } from './utils';

// Stalls API functions
export const stallsApi = {
  // Get all stalls
  getAll: async (): Promise<Stall[]> => {
    return apiRequest<Stall[]>('/stalls/all');
  },

  // Get a specific stall by ID
  getById: async (id: string): Promise<Stall> => {
    return apiRequest<Stall>(`/stalls/${id}`);
  },

  // Create a new stall
  create: async (data: StallForm): Promise<Stall> => {
    return apiRequest<Stall>('/stalls', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // Update an existing stall
  update: async (id: string, data: Partial<StallForm>): Promise<Stall> => {
    return apiRequest<Stall>(`/stalls/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  },

  // Delete a stall
  delete: async (id: string): Promise<{ message: string }> => {
    return apiRequest<{ message: string }>(`/stalls/${id}`, {
      method: 'DELETE',
    });
  },

  // Rent a stall
  rent: async (id: string): Promise<{
    message: string;
    transactionId: string;
    stallId: string;
    rentedAt: string;
  }> => {
    return apiRequest(`/stalls/${id}/rent`, {
      method: 'POST',
    });
  },

  // Return a rented stall
  return: async (id: string, transactionId: string): Promise<{
    message: string;
    transactionId: string;
    stallId: string;
    returnedAt: string;
  }> => {
    return apiRequest(`/stalls/${id}/return`, {
      method: 'POST',
      body: JSON.stringify({ transactionId }),
    });
  },
};
