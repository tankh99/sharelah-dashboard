"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '@/lib/types';
import { authApi, LoginCredentials } from '@/api/auth';
import { mapBackendUserToFrontend } from '@/utils/auth';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
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
        if (savedUser) {
          try {
            const parsedUser = JSON.parse(savedUser);
            setUser(parsedUser);
          } catch (error) {
            console.error('Error parsing saved user:', error);
            localStorage.removeItem('user');
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

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const credentials: LoginCredentials = { email, password };
      const response = await authApi.login(credentials);
      
      if (response && response.accessToken) {
        // Map backend user to frontend user
        const frontendUser = mapBackendUserToFrontend(response);
        setUser(frontendUser);
        
        // Store user data in localStorage for persistence
        localStorage.setItem('user', JSON.stringify(frontendUser));
        
        // Store access token
        localStorage.setItem('token', response.accessToken);
        
        return true;
      }
      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
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
