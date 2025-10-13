"use client";

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { PromoCodeFormComponent } from '@/components/forms/PromoCodeForm';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { PromoCode } from '@/lib/types';
import { PromoCodeForm } from '@/lib/validations';
import { promoCodesApi } from '@/api';
import { ApiError } from '@/api/utils';

export default function EditPromoCodePage() {
  const router = useRouter();
  const params = useParams();
  const promoCodeId = params.id as string;
  
  const [promoCode, setPromoCode] = useState<PromoCode | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(true);

  useEffect(() => {
    const fetchPromoCode = async () => {
      try {
        setIsLoadingData(true);
        const promoCodeData = await promoCodesApi.getById(promoCodeId);
        setPromoCode(promoCodeData);
      } catch (error) {
        console.error('Error fetching promo code:', error);
        if (error instanceof ApiError) {
          alert(`Error: ${error.message}`);
        } else {
          alert('An unexpected error occurred');
        }
        router.push('/dashboard/promo-codes');
      } finally {
        setIsLoadingData(false);
      }
    };

    if (promoCodeId) {
      fetchPromoCode();
    }
  }, [promoCodeId, router]);

  const handleUpdatePromoCode = async (data: PromoCodeForm) => {
    try {
      setIsLoading(true);
      await promoCodesApi.update(promoCodeId, data);
      router.push('/dashboard/promo-codes');
    } catch (error) {
      console.error('Error updating promo code:', error);
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

  if (isLoadingData) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading promo code...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (!promoCode) {
    return (
      <DashboardLayout>
        <div className="text-center py-8">
          <p className="text-gray-500">Promo code not found</p>
        </div>
      </DashboardLayout>
    );
  }

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
          <h1 className="text-2xl font-bold text-gray-900">Edit Promo Code</h1>
          <p className="text-gray-600">Update promo code information</p>
        </div>

        <PromoCodeFormComponent
          initialData={promoCode}
          onSubmit={handleUpdatePromoCode}
          isLoading={isLoading}
        />
      </div>
    </DashboardLayout>
  );
} 