"use client";

import { useState } from 'react';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { TransactionFormComponent } from '@/components/forms/TransactionForm';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Edit, Trash2, Calendar, DollarSign } from 'lucide-react';
import { Transaction, User, Stall } from '@/lib/types';
import { TransactionForm } from '@/lib/validations';

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([
    {
      id: '1',
      user: {
        id: '1',
        name: 'John Doe',
        dateOfBirth: '1990-01-01',
        gender: 'male' as any,
        phoneNumber: '+1234567890',
        email: 'john@example.com',
        password: '',
        verifyPassword: '',
        roles: ['user' as any],
        deviceId: 'device123',
        facebookId: 'fb123',
        status: 'active' as any,
        properties: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      stall: {
        id: '1',
        name: 'Central Mall Stall',
        code: 'CM001',
        deviceName: 'Device-001',
        location: { lat: 1.3521, lng: 103.8198 },
        umbrellaCount: 50,
        status: 'approved' as any,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      amount: 5.00,
      borrowDate: new Date('2024-01-15T10:00:00'),
      returnDate: new Date('2024-01-15T18:00:00'),
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ]);

  const [showForm, setShowForm] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Mock data for form options
  const users: Array<{ id: string; name: string }> = [
    { id: '1', name: 'John Doe' },
    { id: '2', name: 'Jane Smith' },
  ];

  const stalls: Array<{ id: string; name: string }> = [
    { id: '1', name: 'Central Mall Stall' },
    { id: '2', name: 'Orchard Road Kiosk' },
  ];

  const handleCreateTransaction = (data: TransactionForm) => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      const newTransaction: Transaction = {
        ...data,
        id: Date.now().toString(),
        user: users.find(u => u.id === data.user) || null,
        stall: stalls.find(s => s.id === data.stall) || null,
        createdAt: new Date(),
        updatedAt: new Date(),
      } as Transaction;
      
      setTransactions(prev => [...prev, newTransaction]);
      setShowForm(false);
      setIsLoading(false);
    }, 1000);
  };

  const handleUpdateTransaction = (data: TransactionForm) => {
    if (!editingTransaction) return;
    
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setTransactions(prev => prev.map(transaction => 
        transaction.id === editingTransaction.id 
          ? { 
              ...transaction, 
              ...data,
              user: users.find(u => u.id === data.user) || null,
              stall: stalls.find(s => s.id === data.stall) || null,
              updatedAt: new Date() 
            }
          : transaction
      ));
      setEditingTransaction(null);
      setIsLoading(false);
    }, 1000);
  };

  const handleDeleteTransaction = (transactionId: string) => {
    if (confirm('Are you sure you want to delete this transaction?')) {
      setTransactions(prev => prev.filter(transaction => transaction.id !== transactionId));
    }
  };

  const handleEdit = (transaction: Transaction) => {
    setEditingTransaction({
      user: transaction.user?.id || null,
      stall: transaction.stall?.id || null,
      amount: transaction.amount,
      borrowDate: transaction.borrowDate,
      returnDate: transaction.returnDate,
    });
    setShowForm(true);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingTransaction(null);
  };

  const formatDate = (date: Date | null) => {
    if (!date) return 'Not set';
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Transactions</h1>
            <p className="text-gray-600">Manage umbrella rental transactions</p>
          </div>
          <Button onClick={() => setShowForm(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Transaction
          </Button>
        </div>

        {showForm ? (
          <Card>
            <CardHeader>
              <CardTitle>
                {editingTransaction ? 'Edit Transaction' : 'Create New Transaction'}
              </CardTitle>
              <CardDescription>
                {editingTransaction ? 'Update transaction information' : 'Add a new transaction to the system'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <TransactionFormComponent
                initialData={editingTransaction || undefined}
                onSubmit={editingTransaction ? handleUpdateTransaction : handleCreateTransaction}
                isLoading={isLoading}
                users={users}
                stalls={stalls}
              />
              <div className="mt-4">
                <Button variant="outline" onClick={handleCancel}>
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Transaction List</CardTitle>
              <CardDescription>All umbrella rental transactions in the system</CardDescription>
            </CardHeader>
            <CardContent>
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
                      <tr key={transaction.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="h-10 w-10 rounded-full bg-green-200 flex items-center justify-center">
                              <DollarSign className="h-5 w-5 text-green-600" />
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                #{transaction.id}
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
                              Borrow: {formatDate(transaction.borrowDate)}
                            </div>
                          </div>
                          <div className="text-sm text-gray-500">
                            Return: {formatDate(transaction.returnDate)}
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
                              onClick={() => handleDeleteTransaction(transaction.id)}
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
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}
