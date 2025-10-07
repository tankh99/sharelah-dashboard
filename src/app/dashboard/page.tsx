"use client";

import { transactionsApi, usersApi } from '@/api';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Transaction, User } from "@/lib/types";
import { formatAmount, formatTimeAgo } from "@/utils";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { differenceInBusinessDays, eachDayOfInterval, format as formatDateFns, parseISO, startOfDay } from 'date-fns';
import { LATE_THRESHOLD_DAYS, PURCHASE_THRESHOLD_DAYS } from '@/global/constants';

export default function DashboardPage() {

  const [latestUsers, setLatestUsers] = useState<User[]>([]);
  const [latestTransactions, setLatestTransactions] = useState<Transaction[]>([]);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [allTransactions, setAllTransactions] = useState<Transaction[]>([]);

  // Date range and thresholds for analytics
  const today = new Date();
  const defaultFrom = (() => {
    const d = new Date();
    d.setDate(d.getDate() - 30);
    return d;
  })();
  const [rangeFrom, setRangeFrom] = useState<string>(defaultFrom.toISOString().split('T')[0]);
  const [rangeTo, setRangeTo] = useState<string>(today.toISOString().split('T')[0]);
  const [lateThresholdDays, setLateThresholdDays] = useState<number>(LATE_THRESHOLD_DAYS);
  const [purchaseThresholdDays, setPurchaseThresholdDays] = useState<number>(PURCHASE_THRESHOLD_DAYS);
  // Deprecated mock stats removed

  useEffect(() => {
    const loadData = async () => {
      const [users, transactions] = await Promise.all([
        usersApi.getAll(),
        transactionsApi.getAll(),
      ]);

      setAllUsers(users);
      setAllTransactions(transactions);

      const latestUsersComputed = users
        .filter(u => !!u.created)
        .sort((a, b) => new Date(b.created!).getTime() - new Date(a.created!).getTime())
        .slice(0, 5);
      setLatestUsers(latestUsersComputed);

      const latestTxComputed = transactions
        .filter(t => !!t.created)
        .sort((a, b) => new Date(b.created!).getTime() - new Date(a.created).getTime())
        .slice(0, 5);
      setLatestTransactions(latestTxComputed);
    };

    loadData();
  }, [])

  // Helpers
  const parseDate = (d?: string | null): Date | null => {
    if (!d) return null;
    const dt = new Date(d);
    return isNaN(dt.getTime()) ? null : dt;
  };

  const isWithinRange = (d: Date | null, fromStr: string, toStr: string): boolean => {
    if (!d) return false;
    const from = new Date(fromStr);
    const to = new Date(toStr);
    // Normalize inclusive end by setting to end of day
    to.setHours(23, 59, 59, 999);
    return d >= from && d <= to;
  };

  const diffDays = (a: Date, b: Date): number => {
    const ms = b.getTime() - a.getTime();
    return Math.floor(ms / (1000 * 60 * 60 * 24));
  };

  // Analytics calculations based on date range
  const newUsersInRange = useMemo(() => allUsers.filter(u => {
    const created = parseDate(u.created);
    return isWithinRange(created, rangeFrom, rangeTo);
  }), [allUsers, rangeFrom, rangeTo]);

  const transactionsInRange = allTransactions.filter(t => {
    const base = parseDate(t.borrowDate) || parseDate(t.created);
    return isWithinRange(base, rangeFrom, rangeTo);
  });

  const isLateTx = (t: Transaction): boolean => {
    const borrow = parseDate(t.borrowDate) || parseDate(t.created);
    if (!borrow) return false;
    const returned = parseDate(t.returnDate) || new Date();
    return differenceInBusinessDays(returned, borrow) > lateThresholdDays;
  };

  const isPurchasedTx = (t: Transaction): boolean => {
    const borrow = parseDate(t.borrowDate) || parseDate(t.created);
    if (!borrow) return false;
    const returned = parseDate(t.returnDate);
    if (!returned) return false;
    return differenceInBusinessDays(returned, borrow) >= purchaseThresholdDays;
  };

  const newUsersInRangeCount = newUsersInRange.length;
  const transactionsInRangeCount = transactionsInRange.length;
  const lateTransactionsCount = transactionsInRange.filter(isLateTx).length;
  const purchasedCount = transactionsInRange.filter(isPurchasedTx).length;

  // Data for charts
  const lineChartData = useMemo(() => {
    try {
      const from = startOfDay(parseISO(rangeFrom));
      const to = startOfDay(parseISO(rangeTo));

      const dateInterval = eachDayOfInterval({ start: from, end: to });
      const dailyData = new Map<string, { users: number; transactions: number }>(
        dateInterval.map(day => [
          formatDateFns(day, 'yyyy-MM-dd'),
          { users: 0, transactions: 0 },
        ])
      );

      newUsersInRange.forEach(user => {
        if (user.created) {
          const dayKey = formatDateFns(startOfDay(parseISO(user.created)), 'yyyy-MM-dd');
          if (dailyData.has(dayKey)) {
            dailyData.get(dayKey)!.users++;
          }
        }
      });

      transactionsInRange.forEach(transaction => {
        const dateString = transaction.borrowDate || transaction.created;
        if (dateString) {
          const dayKey = formatDateFns(startOfDay(parseISO(dateString)), 'yyyy-MM-dd');
          if (dailyData.has(dayKey)) {
            dailyData.get(dayKey)!.transactions++;
          }
        }
      });

      const chartData = Array.from(dailyData.entries()).map(([date, counts]) => ({
        date,
        users: counts.users,
        transactions: counts.transactions,
      }));

      return chartData.sort((a, b) => a.date.localeCompare(b.date));
    } catch (error) {
      console.error("Error processing chart data:", error);
      return [];
    }
  }, [rangeFrom, rangeTo, newUsersInRange, transactionsInRange]);

  // console.log("line", lineChartData)
  const transactionStatusData = [
    { name: 'On-time', value: transactionsInRangeCount - lateTransactionsCount - purchasedCount },
    { name: 'Late', value: lateTransactionsCount },
    { name: 'Purchased', value: purchasedCount },
  ];
  const PIE_COLORS = ['#0088FE', '#FFBB28', '#FF8042'];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Welcome to your ShareLah dashboard</p>
        </div>

        {/* Analytics Controls */}
        <Card>
          <CardHeader>
            <CardTitle>Analytics</CardTitle>
            <CardDescription>Adjust date range and thresholds</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">From</label>
                <Input type="date" value={rangeFrom} onChange={(e) => setRangeFrom(e.target.value)} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">To</label>
                <Input type="date" value={rangeTo} onChange={(e) => setRangeTo(e.target.value)} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Late threshold (days)</label>
                  <Input
                    type="number"
                    value={lateThresholdDays}
                    onChange={(e) => setLateThresholdDays(Number(e.target.value) || 0)}
                    min={0}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Purchase threshold (days)</label>
                  <Input
                    type="number"
                    value={purchaseThresholdDays}
                    onChange={(e) => setPurchaseThresholdDays(Number(e.target.value) || 0)}
                    min={0}
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Analytics Summary */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">New Users (range)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{newUsersInRangeCount}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Transactions (range)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{transactionsInRangeCount}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Late Transactions (range)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{lateTransactionsCount}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Bought Umbrellas (range)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{purchasedCount}</div>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <Card className="xl:col-span-2">
            <CardHeader>
              <CardTitle>New Users & Transactions</CardTitle>
              <CardDescription>Volume over selected date range</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={lineChartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="users" name="New Users" stroke="#8884d8" />
                  <Line type="monotone" dataKey="transactions" name="Transactions" stroke="#82ca9d" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Transaction Status</CardTitle>
              <CardDescription>Breakdown of transactions in range</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie data={transactionStatusData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} fill="#8884d8" label>
                    {transactionStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader className='flex justify-between items-center'>
              <div>
                <CardTitle>Recent Users</CardTitle>
                <CardDescription>Latest user registrations</CardDescription>
              </div>
              <Link href='/dashboard/users'>
                <Button variant='outline'>
                  View All
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {latestUsers.map((user,i) => (
                  <div key={i} className="flex items-center space-x-4">
                    <div className="h-8 w-8 rounded-full bg-gray-200" />
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-medium">{user.name}</p>
                      <p className="text-xs text-gray-500">{formatTimeAgo(user.created)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className='flex justify-between items-center'>
              <div>
                <CardTitle>Recent Transactions</CardTitle>
                <CardDescription>Latest umbrella rentals</CardDescription>
              </div>
              <Link href='/dashboard/transactions'>
                <Button variant='outline'>
                  View All
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {latestTransactions.map((transaction, i) => (
                  <div key={i} className="flex items-center space-x-4">
                    <div className="h-8 w-8 rounded-full bg-blue-200" />
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-medium">{transaction.stall?.name}</p>
                      <p className="text-xs text-gray-500">{formatAmount(transaction.amount)} • {formatTimeAgo(transaction.borrowDate)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
