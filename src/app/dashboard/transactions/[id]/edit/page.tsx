"use client";

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { TransactionFormComponent } from '@/components/forms/TransactionForm';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';
import { Transaction } from '@/lib/types';
import { TransactionForm } from '@/lib/validations';
import { transactionsApi, usersApi, stallsApi } from '@/api';
import { ApiError } from '@/api/utils';

export default function EditTransactionPage() {
  const router = useRouter();
  const params = useParams();
  const transactionId = params.id as string;
  
  const [transaction, setTransaction] = useState<Transaction | null>(null);
  const [formUsers, setFormUsers] = useState<Array<{ id: string; name: string }>>([]);
  const [formStalls, setFormStalls] = useState<Array<{ id: string; name: string }>>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoadingData(true);
        const [transactionData, usersData, stallsData] = await Promise.all([
          transactionsApi.getById(transactionId),
          usersApi.getAll(),
          stallsApi.getAll()
        ]);
        
        setTransaction(transactionData);
        
        // Transform data for form options
        setFormUsers(usersData.map(user => ({ id: user._id, name: user.name })));
        setFormStalls(stallsData.map(stall => ({ id: stall._id, name: stall.name })));
      } catch (error) {
        console.error('Error fetching data:', error);
        if (error instanceof ApiError) {
          alert(`Error: ${error.message}`);
        } else {
          alert('An unexpected error occurred');
        }
        router.push('/dashboard/transactions');
      } finally {
        setIsLoadingData(false);
      }
    };

    if (transactionId) {
      fetchData();
    }
  }, [transactionId, router]);

  const handleUpdateTransaction = async (data: TransactionForm) => {
    try {
      setIsLoading(true);
      await transactionsApi.update(transactionId, data);
    } catch (error) {
      console.error('Error updating transaction:', error);
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
            <p className="mt-4 text-gray-600">Loading transaction...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (!transaction) {
    return (
      <DashboardLayout>
        <div className="text-center py-8">
          <p className="text-gray-500">Transaction not found</p>
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
          <h1 className="text-2xl font-bold text-gray-900">Edit Transaction</h1>
          <p className="text-gray-600">Update transaction information</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Transaction Information</CardTitle>
            <CardDescription>Update the transaction details below</CardDescription>
          </CardHeader>
          <CardContent>
            <TransactionFormComponent
              initialData={{
                user: transaction.user?._id || null,
                stall: transaction.stall?._id || null,
                amount: transaction.amount,
                borrowDate: transaction.borrowDate ? new Date(transaction.borrowDate) : null,
                returnDate: transaction.returnDate ? new Date(transaction.returnDate) : null,
              }}
              onSubmit={handleUpdateTransaction}
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
