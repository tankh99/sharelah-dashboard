import { PromoCode } from '@/lib/types';
import { PromoCodeForm } from '@/lib/validations';
import { apiRequest } from './utils';

export const promoCodesApi = {
  getAll: async (): Promise<PromoCode[]> => {
    return apiRequest<PromoCode[]>('/promo-codes');
  },

  getById: async (id: string): Promise<PromoCode> => {
    return apiRequest<PromoCode>(`/promo-codes/${id}`);
  },

  create: async (data: PromoCodeForm): Promise<PromoCode> => {
    return apiRequest<PromoCode>('/promo-codes', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  update: async (id: string, data: Partial<PromoCodeForm>): Promise<PromoCode> => {
    return apiRequest<PromoCode>(`/promo-codes/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  },

  delete: async (id: string): Promise<{ message: string }> => {
    return apiRequest<{ message: string }>(`/promo-codes/${id}`, {
      method: 'DELETE',
    });
  },
}; 