"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '@/services/api';
import { useRouter } from 'next/navigation';

interface User {
  id: string;
  name: string;
  email: string;
  userType: string;
  phoneNumber: string;
  city?: string;
  state?: string;
  country?: string;
  dateOfBirth?: string;
  gender?: string;
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string, userType: string) => Promise<void>;
  register: (userData: any) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  sendOTP: (email: string) => Promise<void>;
  verifyOTP: (email: string, otp: string) => Promise<void>;
  updateUser: (userData: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const loadUser = async () => {
      if (authService.isAuthenticated()) {
        try {
          const userData = await authService.getCurrentUser();
          setUser(userData);
        } catch (err: any) {
          console.error('Error loading user:', err);
          if (err.message === 'Network Error') {
            setError('Unable to connect to the server. Please check if the server is running and try again.');
          } else {
            setError(err.response?.data?.msg || 'Error loading user data');
          }
          authService.logout();
        }
      }
      setLoading(false);
    };

    loadUser();
  }, []);

  const login = async (email: string, password: string, userType: string) => {
    try {
      setError(null);
      setLoading(true);
      console.log('Attempting login...');
      
      const data = await authService.login(email, password, userType);
      console.log('Login response:', data);
      
      if (!data.token) {
        throw new Error('No token received from server');
      }
      
      const userData = await authService.getCurrentUser();
      console.log('User data:', userData);
      
      setUser(userData);
      
      // Use router.push instead of window.location for smoother navigation
      if (userData.userType === 'admin') {
        router.push('/dashboard');
      } else {
        router.push('/');
      }
    } catch (err: any) {
      console.error('Login error:', err);
      if (err.message === 'Network Error') {
        setError('Unable to connect to the server. Please check if the server is running and try again.');
      } else if (err.code === 'ECONNABORTED') {
        setError('Request timed out. Please check your internet connection and try again.');
      } else {
        setError(err.response?.data?.msg || err.message || 'An error occurred during login');
      }
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData: any) => {
    try {
      setError(null);
      const data = await authService.register(userData);
      const userDataResponse = await authService.getCurrentUser();
      setUser(userDataResponse);
      window.location.href = '/';
    } catch (err: any) {
      setError(err.response?.data?.msg || 'An error occurred during registration');
      throw err;
    }
  };

  const logout = () => {
    // Clear all auth data
    authService.logout();
    setUser(null);
    setError(null);
    
    // Clear any stored tokens
    localStorage.removeItem('token');
    document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    
    // Use router.push for smoother navigation
    router.push('/login');
  };

  const sendOTP = async (email: string) => {
    try {
      setLoading(true);
      setError(null);
      await authService.sendOTP(email);
    } catch (err: any) {
      setError(err.response?.data?.msg || 'An error occurred while sending OTP');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const verifyOTP = async (email: string, otp: string) => {
    try {
      setLoading(true);
      setError(null);
      await authService.verifyOTP(email, otp);
    } catch (err: any) {
      setError(err.response?.data?.msg || 'An error occurred while verifying OTP');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateUser = (userData: Partial<User>) => {
    setUser(prev => prev ? { ...prev, ...userData } : null);
  };

  const value = {
    user,
    loading,
    error,
    login,
    register,
    logout,
    isAuthenticated: !!user,
    sendOTP,
    verifyOTP,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}