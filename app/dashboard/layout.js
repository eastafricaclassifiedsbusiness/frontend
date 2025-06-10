"use client";

import { Sidebar } from "@/components/dashboard/sidebar.js";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function DashboardLayout({ children }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!loading && (!user || user.userType !== 'admin')) {
      router.push('/');
    }
  }, [user, loading, router]);

  // Show nothing during SSR and initial client render
  if (!isClient) {
    return null;
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-600"></div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-zinc-50 dark:bg-zinc-900">
      <div className="hidden md:block">
        <Sidebar />
      </div>
      <div className="flex-1 overflow-auto md:ml-64">
        <div className="md:hidden">
          <Sidebar />
        </div>
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
} 