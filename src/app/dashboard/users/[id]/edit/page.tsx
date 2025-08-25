"use client";

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { UserFormComponent } from '@/components/forms/UserForm';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';
import { User } from '@/lib/types';
import { UserForm } from '@/lib/validations';
import { usersApi } from '@/api';
import { ApiError } from '@/api/utils';

export default function EditUserPage() {
  const router = useRouter();
  const params = useParams();
  const userId = params.id as string;
  
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setIsLoadingData(true);
        const userData = await usersApi.getById(userId);
        setUser(userData);
      } catch (error) {
        console.error('Error fetching user:', error);
        if (error instanceof ApiError) {
          alert(`Error: ${error.message}`);
        } else {
          alert('An unexpected error occurred');
        }
        router.push('/dashboard/users');
      } finally {
        setIsLoadingData(false);
      }
    };

    if (userId) {
      fetchUser();
    }
  }, [userId, router]);

  const handleUpdateUser = async (data: UserForm) => {
    try {
      setIsLoading(true);
      await usersApi.update(userId, data);
      router.push('/dashboard/users');
    } catch (error) {
      console.error('Error updating user:', error);
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
    router.push('/dashboard/users');
  };

  if (isLoadingData) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading user...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (!user) {
    return (
      <DashboardLayout>
        <div className="text-center py-8">
          <p className="text-gray-500">User not found</p>
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
            Back to Users
          </Button>
        </div>

        <div>
          <h1 className="text-2xl font-bold text-gray-900">Edit User</h1>
          <p className="text-gray-600">Update user information</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>User Information</CardTitle>
            <CardDescription>Update the user details below</CardDescription>
          </CardHeader>
          <CardContent>
            <UserFormComponent
              initialData={user}
              onSubmit={handleUpdateUser}
              isLoading={isLoading}
            />
            <div className="mt-4 flex space-x-4">
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
