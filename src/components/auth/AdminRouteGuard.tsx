"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { hasAdminAccessFromToken, isTokenExpired } from '@/utils/jwt';
import { Button } from '../ui/button';

interface AdminRouteGuardProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export const AdminRouteGuard: React.FC<AdminRouteGuardProps> = ({ 
  children, 
  fallback 
}) => {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      const token = localStorage.getItem('token');
      
      if (!token) {
        // No token, redirect to login
        router.push('/');
        return;
      }
      
      // Check if token is expired
      if (isTokenExpired(token)) {
        // Token expired, clear storage and redirect
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        router.push('/');
        return;
      }
      
      // Check if user has admin access from token
      if (!hasAdminAccessFromToken(token)) {
        // No admin access, redirect to login
        router.push('/');
        return;
      }
    }
  }, [user, isLoading, router]);

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Get token for immediate validation
  const token = localStorage.getItem('token');
  
  // Show fallback or redirect if user doesn't have admin access
  if (!token || isTokenExpired(token) || !hasAdminAccessFromToken(token)) {
    if (fallback) {
      return <>{fallback}</>;
    }
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h1>
          <p className="text-gray-600 mb-4">
            You don&apos;t have permission to access this page.
          </p>
          <Button
            onClick={() => router.push('/')}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Go to Login
          </Button>
        </div>
      </div>
    );
  }

  // User has admin access, render the protected content
  return <>{children}</>;
};
