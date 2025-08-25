"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '@/lib/types';
import { authApi, LoginCredentials } from '@/api/auth';
import { mapBackendUserToFrontend } from '@/utils/auth';
import { hasAdminAccessFromToken, isTokenExpired } from '@/utils/jwt';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in by calling the API
    const checkAuthStatus = async () => {
      try {
        // First, try to get user from localStorage for immediate UI response
        const savedUser = localStorage.getItem('user');
        const savedToken = localStorage.getItem('token');
        
        if (savedUser && savedToken) {
          try {
            const parsedUser = JSON.parse(savedUser);
            
            // Check if token is expired
            if (isTokenExpired(savedToken)) {
              // Token expired, clear everything
              setUser(null);
              localStorage.removeItem('user');
              localStorage.removeItem('token');
              return;
            }
            
            // Check if user still has admin access
            if (!hasAdminAccessFromToken(savedToken)) {
              // User lost admin access, clear everything
              setUser(null);
              localStorage.removeItem('user');
              localStorage.removeItem('token');
              return;
            }
            
            setUser(parsedUser);
          } catch (error) {
            console.error('Error parsing saved user:', error);
            localStorage.removeItem('user');
            localStorage.removeItem('token');
          }
        }

        // Then verify with the API
        const apiUser = await authApi.getProfile();
        if (apiUser) {
          setUser(apiUser);
          // Update localStorage with fresh data
          localStorage.setItem('user', JSON.stringify(apiUser));
        } else if (savedUser) {
          // API says no user, but we had one in localStorage - clear it
          setUser(null);
          localStorage.removeItem('user');
          localStorage.removeItem('token');
        }
      } catch (error) {
        console.error('Error checking auth status:', error);
        // If API call fails, clear any stored data
        setUser(null);
        localStorage.removeItem('user');
        localStorage.removeItem('token');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const credentials: LoginCredentials = { email, password };
      const response = await authApi.login(credentials);
      
      console.log("response", response)
      if (response && response.accessToken) {
        // Validate token and check admin access before proceeding
        if (isTokenExpired(response.accessToken)) {
          return {
            success: false,
            error: 'Token expired. Please try again.'
          };
        }
        
        if (!hasAdminAccessFromToken(response.accessToken)) {
          return {
            success: false,
            error: 'Access denied. Only administrators and moderators can access this dashboard.'
          };
        }
        
        // Map backend user to frontend user
        const frontendUser = mapBackendUserToFrontend(response);
        setUser(frontendUser);
        
        // Store user data in localStorage for persistence
        localStorage.setItem('user', JSON.stringify(frontendUser));
        
        // Store access token
        localStorage.setItem('token', response.accessToken);
        
        return { success: true };
      }
      return { success: false, error: 'Invalid credentials' };
    } catch (error: any) {
      console.error('Login error:', error);
      // Handle specific error cases
      if (error.status === 401) {
        return { success: false, error: 'Invalid email or password' };
      } else if (error.status === 403) {
        return { success: false, error: 'Access denied. Insufficient permissions.' };
      } else if (error.status === 500) {
        return { success: false, error: 'Server error. Please try again later.' };
      } else {
        return { success: false, error: error.message || 'An error occurred during login' };
      }
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    
    // Call the logout API method
    authApi.logout();
  };

  const value = {
    user,
    login,
    logout,
    isLoading,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
