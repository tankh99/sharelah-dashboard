"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Edit, Trash2, Calendar } from 'lucide-react';
import { Transaction } from '@/lib/types';
import { transactionsApi } from '@/api';
import { ApiError } from '@/api/utils';
import { differenceInBusinessDays, format, parseISO } from 'date-fns';
import { formatAmount } from '@/utils';
import { DateRangePicker } from '@/components/ui/date-range-picker';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DateRange } from 'react-day-picker';
import { LATE_THRESHOLD_DAYS, PURCHASE_THRESHOLD_DAYS } from '@/global/constants';

export default function TransactionsPage() {
  const router = useRouter();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [search, setSearch] = useState('');
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);
  const [dateFilterType, setDateFilterType] = useState('borrowDate');
  const [transactionType, setTransactionType] = useState('all');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Fetch data on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoadingData(true);
        const [transactionsData] = await Promise.all([
          transactionsApi.getAll(),
        ]);
        
        setTransactions(transactionsData);
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

  const parseDate = (d?: string | null): Date | null => {
    if (!d) return null;
    const dt = new Date(d);
    return isNaN(dt.getTime()) ? null : dt;
  };

  const elapsedBusinessDays = (t: Transaction): number | null => {
    const borrow = parseDate(t.borrowDate) || parseDate(t.created);
    if (!borrow) return null;
    const end = parseDate(t.returnDate) || new Date();
    return differenceInBusinessDays(end, borrow);
  };

  // Derived filtering and pagination
  const normalizedSearch = search.trim().toLowerCase();
  const filtered = transactions.filter((t) => {
    // Text search on user/stall
    const haystack = [
      t.user?.name ?? '',
      t.user?.email ?? '',
      t.stall?.name ?? '',
      t.stall?.code ?? '',
    ].join(' ').toLowerCase();
    if (normalizedSearch && !haystack.includes(normalizedSearch)) return false;

    // Date range filtering
    if (dateRange?.from) {
      const dateToFilter = dateFilterType === 'borrowDate' ? t.borrowDate : t.returnDate;
      const d = dateToFilter ? parseISO(dateToFilter) : null;
      if (!d || d < dateRange.from) return false;
    }
    if (dateRange?.to) {
      const dateToFilter = dateFilterType === 'borrowDate' ? t.borrowDate : t.returnDate;
      const d = dateToFilter ? parseISO(dateToFilter) : null;
      if (!d || d > dateRange.to) return false;
    }

    // Transaction type filtering
    if (transactionType !== 'all') {
      const days = elapsedBusinessDays(t);
      if (transactionType === 'returned') {
        if (!t.returnDate) return false;
      } else if (transactionType === 'purchased') {
        if (days === null || days < PURCHASE_THRESHOLD_DAYS) return false;
      } else if (transactionType === 'late') {
        if (days === null || !(days > LATE_THRESHOLD_DAYS && days < PURCHASE_THRESHOLD_DAYS)) return false;
      } else if (transactionType === 'ongoing') {
        if (t.returnDate) return false;
        if (days !== null && days > LATE_THRESHOLD_DAYS) return false;
      }
    }

    return true;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const startIndex = (currentPage - 1) * pageSize;
  const paginated = filtered.slice(startIndex, startIndex + pageSize);

  // Reset to first page when filters change
  useEffect(() => {
    setPage(1);
  }, [search, dateRange, dateFilterType, transactionType, pageSize]);


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
            <div className="mb-4 flex flex-col md:flex-row md:items-end md:justify-between gap-3">
              <div className="flex-1 max-w-xl">
                <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
                <Input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search by user, email, stall, code"
                />
              </div>
              <div className="flex items-end gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Transaction Type</label>
                  <Select value={transactionType} onValueChange={setTransactionType}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All</SelectItem>
                      <SelectItem value="ongoing">On-going</SelectItem>
                      <SelectItem value="late">Late</SelectItem>
                      <SelectItem value="purchased">Purchased</SelectItem>
                      <SelectItem value="returned">Returned</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Filter by date</label>
                  <Select value={dateFilterType} onValueChange={setDateFilterType}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Select date type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="borrowDate">Borrow Date</SelectItem>
                      <SelectItem value="returnDate">Return Date</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <DateRangePicker date={dateRange} onDateChange={setDateRange} />
                </div>
              </div>
              <div className="flex items-end gap-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Rows</label>
                  <select
                    className="h-9 rounded-md border border-input bg-background px-2 text-sm"
                    value={pageSize}
                    onChange={(e) => setPageSize(Number(e.target.value))}
                  >
                    <option value={10}>10</option>
                    <option value={20}>20</option>
                    <option value={50}>50</option>
                    <option value={100}>100</option>
                  </select>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setSearch('');
                    setDateRange(undefined);
                    setTransactionType('all');
                  }}
                >
                  Clear Filters
                </Button>
              </div>
            </div>
            {transactions.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">No transactions found</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                  <div>
                    Showing {filtered.length === 0 ? 0 : startIndex + 1}-{Math.min(startIndex + pageSize, filtered.length)} of {filtered.length}
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      disabled={currentPage <= 1}
                    >
                      Previous
                    </Button>
                    <span>
                      Page {currentPage} of {totalPages}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                      disabled={currentPage >= totalPages}
                    >
                      Next
                    </Button>
                  </div>
                </div>
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
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
                    {paginated.map((transaction) => (
                      <tr key={transaction._id}>
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
