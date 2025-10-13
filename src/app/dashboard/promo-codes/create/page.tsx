"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { PromoCodeFormComponent } from '@/components/forms/PromoCodeForm';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { PromoCodeForm } from '@/lib/validations';
import { promoCodesApi } from '@/api';
import { ApiError } from '@/api/utils';

export default function CreatePromoCodePage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleCreatePromoCode = async (data: PromoCodeForm) => {
    try {
      setIsLoading(true);
      await promoCodesApi.create(data);
      router.push('/dashboard/promo-codes');
    } catch (error) {
      console.error('Error creating promo code:', error);
      if (error instanceof ApiError) {
        alert(`Error: ${error.message}`);
      } else {
        alert('An unexpected error occurred');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    router.push('/dashboard/promo-codes');
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" onClick={handleCancel}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Promo Codes
          </Button>
        </div>

        <div>
          <h1 className="text-2xl font-bold text-gray-900">Create New Promo Code</h1>
          <p className="text-gray-600">Add a new promo code to the system</p>
        </div>

        <PromoCodeFormComponent
          onSubmit={handleCreatePromoCode}
          isLoading={isLoading}
        />
      </div>
    </DashboardLayout>
  );
} 