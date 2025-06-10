"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  Users,
  Briefcase,
  Tag,
  Settings,
  LogOut,
  Menu,
  X,
  UserPlus,
  FileText,
  Bell,
  Layers,
} from "lucide-react";

const adminNavItems = [
  { title: "Users", href: "/admin/users", icon: Users },
  { title: "Jobs", href: "/admin/jobs", icon: Briefcase },
  { title: "Classifieds", href: "/dashboard/classifieds", icon: Tag },
  { title: "Applications", href: "/dashboard/applications", icon: FileText },
  { title: "Notifications", href: "/dashboard/notifications", icon: Bell },
  { title: "Recruiters", href: "/dashboard/recruiters", icon: UserPlus },
  { title: "Settings", href: "/dashboard/settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <>
      {/* Mobile Toggle */}
      <Button
        variant="outline"
        size="icon"
        className="fixed top-4 left-4 z-40 md:hidden"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      >
        {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        <span className="sr-only">Toggle menu</span>
      </Button>

      {/* Sidebar */}
      <div
        className={`bg-white dark:bg-zinc-950 border-r dark:border-zinc-800 w-64 h-screen overflow-y-auto fixed inset-y-0 left-0 transform z-30 md:translate-x-0 transition duration-200 ease-in-out ${
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-6">
          <Link href="/dashboard" className="flex items-center space-x-2">
            <span className="text-xl font-bold bg-sky-600 text-white px-2 py-1 rounded">EAC</span>
            <span className="font-semibold">Admin Panel</span>
          </Link>
        </div>
        <nav className="px-4 pb-6 pt-2">
          <ul className="space-y-1">
            {adminNavItems.map((item) => {
              const isActive = pathname === item.href || pathname?.startsWith(`${item.href}/`);
              return (
                <li key={item.href}>
                  <Link href={item.href}>
                    <Button
                      variant={isActive ? "secondary" : "ghost"}
                      className={`w-full justify-start ${isActive ? "bg-sky-50 text-sky-700 hover:bg-sky-100 hover:text-sky-900 dark:bg-sky-900/20 dark:text-sky-300 dark:hover:bg-sky-900/30" : ""}`}
                    >
                      <item.icon className="h-5 w-5 mr-2" />
                      {item.title}
                    </Button>
                  </Link>
                </li>
              );
            })}
            <li className="pt-4">
              <Button
                variant="ghost"
                className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:text-red-300 dark:hover:bg-red-900/20"
                onClick={() => {
                  localStorage.removeItem("token");
                  document.cookie = "token=; path=/; max-age=0";
                  window.location.href = "/login";
                }}
              >
                <LogOut className="h-5 w-5 mr-2" /> Logout
              </Button>
            </li>
          </ul>
        </nav>
      </div>
    </>
  );
} 