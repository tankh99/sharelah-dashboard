"use client";

import { useState } from 'react';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { UserFormComponent } from '@/components/forms/UserForm';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Edit, Trash2, Eye } from 'lucide-react';
import { User } from '@/lib/types';
import { UserForm } from '@/lib/validations';
import { UserRole, UserGender, UserStatus } from '@/lib/enums';

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([
    {
      id: '1',
      name: 'John Doe',
      dateOfBirth: '1990-01-01',
      gender: UserGender.MALE,
      phoneNumber: '+1234567890',
      email: 'john@example.com',
      password: '',
      verifyPassword: '',
      roles: [UserRole.USER],
      deviceId: 'device123',
      facebookId: 'fb123',
      status: UserStatus.ACTIVE,
      properties: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: '2',
      name: 'Jane Smith',
      dateOfBirth: '1992-05-15',
      gender: UserGender.FEMALE,
      phoneNumber: '+1234567891',
      email: 'jane@example.com',
      password: '',
      verifyPassword: '',
      roles: [UserRole.ADMIN],
      deviceId: 'device456',
      facebookId: 'fb456',
      status: UserStatus.ACTIVE,
      properties: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ]);

  const [showForm, setShowForm] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleCreateUser = (data: UserForm) => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      const newUser: User = {
        ...data,
        id: Date.now().toString(),
        createdAt: new Date(),
        updatedAt: new Date(),
      } as User;
      
      setUsers(prev => [...prev, newUser]);
      setShowForm(false);
      setIsLoading(false);
    }, 1000);
  };

  const handleUpdateUser = (data: UserForm) => {
    if (!editingUser) return;
    
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setUsers(prev => prev.map(user => 
        user.id === editingUser.id 
          ? { ...user, ...data, updatedAt: new Date() }
          : user
      ));
      setEditingUser(null);
      setIsLoading(false);
    }, 1000);
  };

  const handleDeleteUser = (userId: string) => {
    if (confirm('Are you sure you want to delete this user?')) {
      setUsers(prev => prev.filter(user => user.id !== userId));
    }
  };

  const handleEdit = (user: User) => {
    setEditingUser(user);
    setShowForm(true);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingUser(null);
  };

  const getRoleBadge = (roles: UserRole[]) => (
    <div className="flex gap-1">
      {roles.map(role => (
        <span
          key={role}
          className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
            role === UserRole.ADMIN 
              ? 'bg-red-100 text-red-800'
              : role === UserRole.MODERATOR
              ? 'bg-yellow-100 text-yellow-800'
              : 'bg-blue-100 text-blue-800'
          }`}
        >
          {role}
        </span>
      ))}
    </div>
  );

  const getStatusBadge = (status: UserStatus) => (
    <span
      className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
        status === UserStatus.ACTIVE
          ? 'bg-green-100 text-green-800'
          : status === UserStatus.INACTIVE
          ? 'bg-gray-100 text-gray-800'
          : 'bg-red-100 text-red-800'
      }`}
    >
      {status}
    </span>
  );

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Users</h1>
            <p className="text-gray-600">Manage user accounts and permissions</p>
          </div>
          <Button onClick={() => setShowForm(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add User
          </Button>
        </div>

        {showForm ? (
          <Card>
            <CardHeader>
              <CardTitle>
                {editingUser ? 'Edit User' : 'Create New User'}
              </CardTitle>
              <CardDescription>
                {editingUser ? 'Update user information' : 'Add a new user to the system'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <UserFormComponent
                initialData={editingUser || undefined}
                onSubmit={editingUser ? handleUpdateUser : handleCreateUser}
                isLoading={isLoading}
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
              <CardTitle>User List</CardTitle>
              <CardDescription>All registered users in the system</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        User
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Contact
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Roles
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {users.map((user) => (
                      <tr key={user.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                              <span className="text-sm font-medium text-gray-600">
                                {user.name.charAt(0)}
                              </span>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{user.name}</div>
                              <div className="text-sm text-gray-500">{user.gender}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{user.email}</div>
                          <div className="text-sm text-gray-500">{user.phoneNumber}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {getRoleBadge(user.roles)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {getStatusBadge(user.status)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEdit(user)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteUser(user.id)}
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
