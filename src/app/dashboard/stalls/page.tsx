"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Edit, Trash2, MapPin, Store } from 'lucide-react';
import { Stall } from '@/lib/types';
import { StallStatus } from '@/lib/enums';
import { stallsApi, ApiError } from '@/api';

export default function StallsPage() {
  const router = useRouter();
  const [stalls, setStalls] = useState<Stall[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch stalls on component mount
  useEffect(() => {
    fetchStalls();
  }, []);

  const fetchStalls = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const fetchedStalls = await stallsApi.getAll();
      setStalls(fetchedStalls);
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError('Failed to fetch stalls');
      }
      console.error('Error fetching stalls:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteStall = async (stallId: string) => {
    if (confirm('Are you sure you want to delete this stall?')) {
      try {
        setIsLoading(true);
        setError(null);
        await stallsApi.delete(stallId);
        setStalls(prev => prev.filter(stall => stall._id !== stallId));
      } catch (err) {
        if (err instanceof ApiError) {
          setError(err.message);
        } else {
          setError('Failed to delete stall');
        }
        console.error('Error deleting stall:', err);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleCreateStall = () => {
    router.push('/dashboard/stalls/create');
  };

  const handleEdit = (stall: Stall) => {
    router.push(`/dashboard/stalls/${stall._id}/edit`);
  };

  const getStatusBadge = (status: StallStatus) => (
    <span
      className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${status === StallStatus.APPROVED
          ? 'bg-green-100 text-green-800'
          : status === StallStatus.DRAFT
            ? 'bg-yellow-100 text-yellow-800'
            : 'bg-red-100 text-red-800'
        }`}
    >
      {status}
    </span>
  );

  const formatCoordinates = (location: number[]) => {
    return `${location[0].toFixed(4)}, ${location[1].toFixed(4)}`;
  };


  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Stalls</h1>
            <p className="text-gray-600">Manage umbrella rental stalls and locations</p>
          </div>
          <Button onClick={handleCreateStall}>
            <Plus className="h-4 w-4 mr-2" />
            Add Stall
          </Button>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-4">
            <div className="flex">
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Error</h3>
                <div className="mt-2 text-sm text-red-700">{error}</div>
              </div>
            </div>
          </div>
        )}

        <Card>
          <Card>
            <CardHeader>
              <CardTitle>Stall List</CardTitle>
              <CardDescription>All umbrella rental stalls in the system</CardDescription>
            </CardHeader>
            <CardContent className=''>
              {isLoading ? (
                <div className="flex justify-center items-center py-8">
                  <div className="text-gray-500">Loading stalls...</div>
                </div>
              ) : stalls.length === 0 ? (
                <div className="text-center py-8">
                  <div className="text-gray-500">No stalls found</div>
                </div>
              ) : (
                <div className="overflow-auto max-h-[480px]">
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
                        <tr key={stall._id}>
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
                                onClick={() => handleDeleteStall(stall._id)}
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
        </Card>
      </div>
    </DashboardLayout>
  );
}
