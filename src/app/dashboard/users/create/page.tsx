"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { UserFormComponent } from '@/components/forms/UserForm';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';
import { UserForm } from '@/lib/validations';
import { usersApi } from '@/api';
import { ApiError } from '@/api/utils';

export default function CreateUserPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleCreateUser = async (data: UserForm) => {
    try {
      setIsLoading(true);
      await usersApi.create(data);
      router.push('/dashboard/users');
    } catch (error) {
      console.error('Error creating user:', error);
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
          <h1 className="text-2xl font-bold text-gray-900">Create New User</h1>
          <p className="text-gray-600">Add a new user to the system</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>User Information</CardTitle>
            <CardDescription>Enter the user details below</CardDescription>
          </CardHeader>
          <CardContent>
            <UserFormComponent
              onSubmit={handleCreateUser}
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
