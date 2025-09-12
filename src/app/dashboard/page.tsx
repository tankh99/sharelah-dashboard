"use client";

import { usersApi } from '@/api';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { User } from '@/lib/types';
import { formatTimeAgo } from '@/utils';
import { Users, Store, CreditCard, TrendingUp } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function DashboardPage() {

  const [latestUsers, setLatestUsers] = useState<User[]>([]);
  // Mock data - replace with actual API calls
  const stats = [
    {
      title: 'Total Users',
      value: '1,234',
      change: '+12%',
      changeType: 'positive',
      icon: Users,
    },
    {
      title: 'Active Stalls',
      value: '89',
      change: '+5%',
      changeType: 'positive',
      icon: Store,
    },
    {
      title: 'Total Transactions',
      value: '5,678',
      change: '+23%',
      changeType: 'positive',
      icon: CreditCard,
    },
    {
      title: 'Revenue',
      value: '$12,345',
      change: '+18%',
      changeType: 'positive',
      icon: TrendingUp,
    },
  ];

  useEffect(() => {
    getLatestUsers();
  }, [])

  const getLatestUsers = async (limit = 5) => {
    const users = await usersApi.getAll();
    // console.log(users)
    const filteredUsers = users.filter(user => !!user.created)
    // Sort by created latest to oldest
    const sortedUsers = filteredUsers.sort((a, b) => new Date(b.created).getTime() - new Date(a.created).getTime());
    const latestUsers = sortedUsers.slice(0, limit);
    setLatestUsers(latestUsers)
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Welcome to your ShareLah dashboard</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <stat.icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className={`text-xs ${
                  stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {stat.change} from last month
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Recent Users</CardTitle>
              <CardDescription>Latest user registrations</CardDescription>
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
            <CardHeader>
              <CardTitle>Recent Transactions</CardTitle>
              <CardDescription>Latest umbrella rentals</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center space-x-4">
                    <div className="h-8 w-8 rounded-full bg-blue-200" />
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-medium">Transaction {i}</p>
                      <p className="text-xs text-gray-500">$5.00 • 1 hour ago</p>
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
