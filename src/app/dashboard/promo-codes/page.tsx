"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { PromoCode } from '@/lib/types';
import { promoCodesApi } from '@/api';
import { ApiError } from '@/api/utils';
import { format } from 'date-fns';

export default function PromoCodesPage() {
  const router = useRouter();
  const [promoCodes, setPromoCodes] = useState<PromoCode[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  useEffect(() => {
    const fetchPromoCodes = async () => {
      try {
        setIsLoadingData(true);
        const promoCodesData = await promoCodesApi.getAll();
        setPromoCodes(promoCodesData);
      } catch (error) {
        console.error('Error fetching promo codes:', error);
        if (error instanceof ApiError) {
          alert(`Error: ${error.message}`);
        } else {
          alert('An unexpected error occurred');
        }
      } finally {
        setIsLoadingData(false);
      }
    };

    fetchPromoCodes();
  }, []);

  const normalizedSearch = search.trim().toLowerCase();
  const filtered = promoCodes.filter((pc) => {
    if (!normalizedSearch) return true;
    const hay = [pc.code, pc.type].filter(Boolean).join(' ').toLowerCase();
    return hay.includes(normalizedSearch);
  });
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const startIndex = (currentPage - 1) * pageSize;
  const paginated = filtered.slice(startIndex, startIndex + pageSize);

  useEffect(() => {
    setPage(1);
  }, [search, pageSize]);

  const handleDelete = async (promoCodeId: string) => {
    if (confirm('Are you sure you want to delete this promo code?')) {
      try {
        await promoCodesApi.delete(promoCodeId);
        setPromoCodes(prev => prev.filter(pc => pc._id !== promoCodeId));
      } catch (error) {
        console.error('Error deleting promo code:', error);
        if (error instanceof ApiError) {
          alert(`Error: ${error.message}`);
        } else {
          alert('An unexpected error occurred');
        }
      }
    }
  };

  const handleEdit = (promoCode: PromoCode) => {
    router.push(`/dashboard/promo-codes/${promoCode._id}/edit`);
  };

  const handleCreate = () => {
    router.push('/dashboard/promo-codes/create');
  };
  
  const getStatusBadge = (isActive: boolean) => (
    <span
      className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
        isActive
          ? 'bg-green-100 text-green-800'
          : 'bg-red-100 text-red-800'
      }`}
    >
      {isActive ? 'Active' : 'Inactive'}
    </span>
  );

  if (isLoadingData) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading promo codes...</p>
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
            <h1 className="text-2xl font-bold text-gray-900">Promo Codes</h1>
            <p className="text-gray-600">Manage promo codes for your users</p>
          </div>
          <Button onClick={handleCreate}>
            <Plus className="h-4 w-4 mr-2" />
            Add Promo Code
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Promo Code List</CardTitle>
            <CardDescription>All available promo codes in the system</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-4 flex flex-col md:flex-row md:items-end md:justify-between gap-3">
              <div className="flex-1 max-w-xl">
                <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
                <Input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search by code or type"
                />
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
                <Button type="button" variant="outline" onClick={() => setSearch('')}>
                  Clear
                </Button>
              </div>
            </div>
            {promoCodes.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">No promo codes found</p>
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
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Code</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Value</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Usage</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Expires At</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {paginated.map((promoCode) => (
                      <tr key={promoCode._id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{promoCode.code}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{promoCode.type}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{promoCode.value}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{promoCode.timesUsed} / {promoCode.maxUses}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {promoCode.expiresAt ? format(new Date(promoCode.expiresAt), 'PPP') : 'Never'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">{getStatusBadge(promoCode.isActive)}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <Button variant="ghost" size="sm" onClick={() => handleEdit(promoCode)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => handleDelete(promoCode._id)}>
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