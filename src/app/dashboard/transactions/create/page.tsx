"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { TransactionFormComponent } from '@/components/forms/TransactionForm';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';
import { User, Stall } from '@/lib/types';
import { TransactionForm } from '@/lib/validations';
import { usersApi, stallsApi, transactionsApi } from '@/api';
import { ApiError } from '@/api/utils';

export default function CreateTransactionPage() {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [stalls, setStalls] = useState<Stall[]>([]);
  const [formUsers, setFormUsers] = useState<Array<{ id: string; name: string }>>([]);
  const [formStalls, setFormStalls] = useState<Array<{ id: string; name: string }>>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoadingData(true);
        const [usersData, stallsData] = await Promise.all([
          usersApi.getAll(),
          stallsApi.getAll()
        ]);
        
        setUsers(usersData);
        setStalls(stallsData);
        
        // Transform data for form options
        setFormUsers(usersData.map(user => ({ id: user.id, name: user.name })));
        setFormStalls(stallsData.map(stall => ({ id: stall._id, name: stall.name })));
      } catch (error) {
        console.error('Error fetching data:', error);
        if (error instanceof ApiError) {
          alert(`Error: ${error.message}`);
        } else {
          alert('An unexpected error occurred');
        }
      } finally {
        setIsLoadingData(false);
      }
    };

    fetchData();
  }, []);

  const handleCreateTransaction = async (data: TransactionForm) => {
    try {
      setIsLoading(true);
      await transactionsApi.create(data);
      router.push('/dashboard/transactions');
    } catch (error) {
      console.error('Error creating transaction:', error);
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
    router.push('/dashboard/transactions');
  };

  if (isLoadingData) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading form data...</p>
          </div>
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
            Back to Transactions
          </Button>
        </div>

        <div>
          <h1 className="text-2xl font-bold text-gray-900">Create New Transaction</h1>
          <p className="text-gray-600">Add a new transaction to the system</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Transaction Information</CardTitle>
            <CardDescription>Enter the transaction details below</CardDescription>
          </CardHeader>
          <CardContent>
            <TransactionFormComponent
              onSubmit={handleCreateTransaction}
              isLoading={isLoading}
              users={formUsers}
              stalls={formStalls}
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
