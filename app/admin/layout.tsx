'use client';

import { Sidebar } from '@/components/dashboard/sidebar';
import React from 'react';
import { Toaster } from "@/components/ui/toaster";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-zinc-50 dark:bg-zinc-900">
      <div className="fixed inset-y-0 left-0 w-64">
        <Sidebar />
      </div>
      <main className="flex-1 ml-64 p-6">
        {children}
      </main>
      <Toaster />
    </div>
  );
} 