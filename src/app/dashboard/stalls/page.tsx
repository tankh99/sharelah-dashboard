"use client";

import { useState } from 'react';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { StallFormComponent } from '@/components/forms/StallForm';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Edit, Trash2, MapPin, Store } from 'lucide-react';
import { Stall } from '@/lib/types';
import { StallForm } from '@/lib/validations';
import { StallStatus } from '@/lib/enums';

export default function StallsPage() {
  const [stalls, setStalls] = useState<Stall[]>([
    {
      id: '1',
      name: 'Central Mall Stall',
      code: 'CM001',
      deviceName: 'Device-001',
      location: { lat: 1.3521, lng: 103.8198 },
      umbrellaCount: 50,
      status: StallStatus.APPROVED,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: '2',
      name: 'Orchard Road Kiosk',
      code: 'OR002',
      deviceName: 'Device-002',
      location: { lat: 1.3048, lng: 103.8318 },
      umbrellaCount: 30,
      status: StallStatus.APPROVED,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ]);

  const [showForm, setShowForm] = useState(false);
  const [editingStall, setEditingStall] = useState<Stall | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleCreateStall = (data: StallForm) => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      const newStall: Stall = {
        ...data,
        id: Date.now().toString(),
        createdAt: new Date(),
        updatedAt: new Date(),
      } as Stall;
      
      setStalls(prev => [...prev, newStall]);
      setShowForm(false);
      setIsLoading(false);
    }, 1000);
  };

  const handleUpdateStall = (data: StallForm) => {
    if (!editingStall) return;
    
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setStalls(prev => prev.map(stall => 
        stall.id === editingStall.id 
          ? { ...stall, ...data, updatedAt: new Date() }
          : stall
      ));
      setEditingStall(null);
      setIsLoading(false);
    }, 1000);
  };

  const handleDeleteStall = (stallId: string) => {
    if (confirm('Are you sure you want to delete this stall?')) {
      setStalls(prev => prev.filter(stall => stall.id !== stallId));
    }
  };

  const handleEdit = (stall: Stall) => {
    setEditingStall(stall);
    setShowForm(true);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingStall(null);
  };

  const getStatusBadge = (status: StallStatus) => (
    <span
      className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
        status === StallStatus.APPROVED
          ? 'bg-green-100 text-green-800'
          : status === StallStatus.DRAFT
          ? 'bg-yellow-100 text-yellow-800'
          : 'bg-red-100 text-red-800'
      }`}
    >
      {status}
    </span>
  );

  const formatCoordinates = (location: { lat: number; lng: number }) => {
    return `${location.lat.toFixed(4)}, ${location.lng.toFixed(4)}`;
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Stalls</h1>
            <p className="text-gray-600">Manage umbrella rental stalls and locations</p>
          </div>
          <Button onClick={() => setShowForm(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Stall
          </Button>
        </div>

        {showForm ? (
          <Card>
            <CardHeader>
              <CardTitle>
                {editingStall ? 'Edit Stall' : 'Create New Stall'}
              </CardTitle>
              <CardDescription>
                {editingStall ? 'Update stall information' : 'Add a new stall to the system'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <StallFormComponent
                initialData={editingStall || undefined}
                onSubmit={editingStall ? handleUpdateStall : handleCreateStall}
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
              <CardTitle>Stall List</CardTitle>
              <CardDescription>All umbrella rental stalls in the system</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Stall
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Device
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Location
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Umbrellas
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
                    {stalls.map((stall) => (
                      <tr key={stall.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="h-10 w-10 rounded-full bg-blue-200 flex items-center justify-center">
                              <Store className="h-5 w-5 text-blue-600" />
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{stall.name}</div>
                              <div className="text-sm text-gray-500">{stall.code}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{stall.deviceName}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <MapPin className="h-4 w-4 text-gray-400 mr-1" />
                            <span className="text-sm text-gray-900">
                              {formatCoordinates(stall.location)}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{stall.umbrellaCount}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {getStatusBadge(stall.status)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEdit(stall)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteStall(stall.id)}
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
