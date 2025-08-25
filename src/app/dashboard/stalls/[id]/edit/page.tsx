"use client";

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { StallFormComponent } from '@/components/forms/StallForm';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { Stall } from '@/lib/types';
import { StallForm } from '@/lib/validations';
import { stallsApi, ApiError } from '@/api';

export default function EditStallPage() {
  const router = useRouter();
  const params = useParams();
  const stallId = params.id as string;
  
  const [stall, setStall] = useState<Stall | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStall = async () => {
      try {
        setIsFetching(true);
        setError(null);
        const fetchedStall = await stallsApi.getById(stallId);
        setStall(fetchedStall);
      } catch (err) {
        if (err instanceof ApiError) {
          setError(err.message);
        } else {
          setError('Failed to fetch stall');
        }
        console.error('Error fetching stall:', err);
      } finally {
        setIsFetching(false);
      }
    };

    if (stallId) {
      fetchStall();
    }
  }, [stallId]);

  const handleUpdateStall = async (data: StallForm) => {
    try {
      setIsLoading(true);
      setError(null);
      await stallsApi.update(stallId, data);
      router.push('/dashboard/stalls');
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError('Failed to update stall');
      }
      console.error('Error updating stall:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    router.push('/dashboard/stalls');
  };

  if (isFetching) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center py-8">
          <div className="flex items-center space-x-2">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span className="text-gray-500">Loading stall...</span>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (error && !stall) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" onClick={handleCancel} className="p-2">
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Edit Stall</h1>
              <p className="text-gray-600">Update stall information</p>
            </div>
          </div>

          <div className="bg-red-50 border border-red-200 rounded-md p-4">
            <div className="flex">
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Error</h3>
                <div className="mt-2 text-sm text-red-700">{error}</div>
              </div>
            </div>
          </div>

          <Button variant="outline" onClick={handleCancel}>
            Back to Stalls
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  if (!stall) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" onClick={handleCancel} className="p-2">
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Stall Not Found</h1>
              <p className="text-gray-600">The requested stall could not be found</p>
            </div>
          </div>

          <Button variant="outline" onClick={handleCancel}>
            Back to Stalls
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" onClick={handleCancel} className="p-2">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Edit Stall</h1>
            <p className="text-gray-600">Update stall information</p>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-4">
            <div className="flex">
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Error</h3>
                <div className="mt-2 text-sm text-red-700">{error}</div>
              </div>
            </div>
          </div>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Stall Information</CardTitle>
            <CardDescription>Update the stall details below</CardDescription>
          </CardHeader>
          <CardContent>
            <StallFormComponent
              initialData={stall}
              onSubmit={handleUpdateStall}
              isLoading={isLoading}
            />
            <div className="mt-4">
              <Button variant="outline" onClick={handleCancel}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
