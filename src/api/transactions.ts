import { Transaction } from '@/lib/types';
import { TransactionForm } from '@/lib/validations';
import { apiRequest, ApiError } from './utils';

// Transactions API functions
export const transactionsApi = {
  // Get all transactions
  getAll: async (): Promise<Transaction[]> => {
    return apiRequest<Transaction[]>('/transactions');
  },

  // Get a specific transaction by ID
  getById: async (id: string): Promise<Transaction> => {
    return apiRequest<Transaction>(`/transactions/${id}`);
  },

  // Create a new transaction
  create: async (data: TransactionForm): Promise<Transaction> => {
    return apiRequest<Transaction>('/transactions', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // Update an existing transaction
  update: async (id: string, data: Partial<TransactionForm>): Promise<Transaction> => {
    return apiRequest<Transaction>(`/transactions/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  },

  // Delete a transaction
  delete: async (id: string): Promise<{ message: string }> => {
    return apiRequest<{ message: string }>(`/transactions/${id}`, {
      method: 'DELETE',
    });
  },
};


