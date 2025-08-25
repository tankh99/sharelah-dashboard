"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Edit, Trash2, Calendar, DollarSign } from 'lucide-react';
import { Transaction, User, Stall } from '@/lib/types';
import { transactionsApi, usersApi, stallsApi } from '@/api';
import { ApiError } from '@/api/utils';
import { format, parseISO } from 'date-fns';

export default function TransactionsPage() {
  const router = useRouter();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [stalls, setStalls] = useState<Stall[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(true);

  // Fetch data on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoadingData(true);
        const [transactionsData, usersData, stallsData] = await Promise.all([
          transactionsApi.getAll(),
          usersApi.getAll(),
          stallsApi.getAll()
        ]);
        
        setTransactions(transactionsData);
        setUsers(usersData);
        setStalls(stallsData);
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

  const handleDeleteTransaction = async (transactionId: string) => {
    if (confirm('Are you sure you want to delete this transaction?')) {
      try {
        await transactionsApi.delete(transactionId);
        setTransactions(prev => prev.filter(transaction => transaction._id !== transactionId));
      } catch (error) {
        console.error('Error deleting transaction:', error);
        if (error instanceof ApiError) {
          alert(`Error: ${error.message}`);
        } else {
          alert('An unexpected error occurred');
        }
      }
    }
  };

  const handleEdit = (transaction: Transaction) => {
    router.push(`/dashboard/transactions/${transaction._id}/edit`);
  };

  const handleCreate = () => {
    router.push('/dashboard/transactions/create');
  };

  const formatDate = (date: string) => {
    if (!date) return 'Not set';
    const formatted = format(parseISO(date), "PPpp"); 
    return formatted
  };

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  if (isLoadingData) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading transactions...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Transactions</h1>
            <p className="text-gray-600">Manage umbrella rental transactions</p>
          </div>
          <Button onClick={handleCreate}>
            <Plus className="h-4 w-4 mr-2" />
            Add Transaction
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Transaction List</CardTitle>
            <CardDescription>All umbrella rental transactions in the system</CardDescription>
          </CardHeader>
          <CardContent>
            {transactions.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">No transactions found</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Transaction
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        User
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Stall
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Amount
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Dates
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {transactions.map((transaction) => (
                      <tr key={transaction._id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="h-10 w-10 rounded-full bg-green-200 flex items-center justify-center">
                              <DollarSign className="h-5 w-5 text-green-600" />
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                #{transaction._id}
                              </div>
                              <div className="text-sm text-gray-500">
                                {formatDate(transaction.createdAt)}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {transaction.user?.name || 'Unknown User'}
                          </div>
                          <div className="text-sm text-gray-500">
                            {transaction.user?.email || 'No email'}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {transaction.stall?.name || 'Unknown Stall'}
                          </div>
                          <div className="text-sm text-gray-500">
                            {transaction.stall?.code || 'No code'}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {formatAmount(transaction.amount)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            <div className="flex items-center">
                              <Calendar className="h-4 w-4 text-gray-400 mr-1" />
                              Borrow: {transaction.borrowDate ? formatDate(transaction.borrowDate) : 'Not set'}
                            </div>
                          </div>
                          <div className="text-sm text-gray-500">
                            Return: {transaction.returnDate ? formatDate(transaction.returnDate) : 'Not set'}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEdit(transaction)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteTransaction(transaction._id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
