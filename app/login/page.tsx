"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import LoginForm from '@/components/auth/LoginForm';

export default function LoginPage() {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Only redirect if user is authenticated
    if (isAuthenticated && user) {
      if (user.userType === 'admin') {
        router.push('/dashboard');
      } else {
        router.push('/');
      }
    }
  }, [isAuthenticated, user, router]);

  // Always show login form if not authenticated
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-[#0a0a0a]">
      <LoginForm />
    </div>
  );
}
