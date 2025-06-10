"use client"

import type React from "react"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
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
  BellRing,
  Mail,
  UserCheck,
  Shield,
  MessageSquare,
  BarChart3,
  Activity,
  TrendingUp,
  Calendar,
} from "lucide-react"

type NavItem = {
  title: string
  href: string
  icon: React.ElementType
}

type NavSection = {
  title: string
  items: NavItem[]
}

const adminNavSections: NavSection[] = [
  {
    title: "Overview",
    items: [
      {
        title: "Dashboard",
        href: "/admin",
        icon: LayoutDashboard,
      },
      {
        title: "Analytics",
        href: "/admin/analytics",
        icon: BarChart3,
      },
      {
        title: "Activity",
        href: "/admin/activity",
        icon: Activity,
      },
      {
        title: "Reports",
        href: "/admin/reports",
        icon: TrendingUp,
      },
      {
        title: "Calendar",
        href: "/admin/calendar",
        icon: Calendar,
      },
    ]
  },
  {
    title: "User Management",
    items: [
      {
        title: "All Users",
        href: "/admin/users",
        icon: Users,
      },
      {
        title: "Admin Users",
        href: "/admin/users/admins",
        icon: Shield,
      },
      {
        title: "Recruiters",
        href: "/admin/recruiters",
        icon: UserPlus,
      },
      {
        title: "User Verification",
        href: "/admin/users/verification",
        icon: UserCheck,
      },
    ]
  },
  {
    title: "Content Management",
    items: [
      {
        title: "Jobs",
        href: "/admin/jobs",
        icon: Briefcase,
      },
      {
        title: "Applications",
        href: "/admin/applications",
        icon: FileText,
      },
      {
        title: "Classifieds",
        href: "/admin/classifieds",
        icon: Tag,
      },
    ]
  }
]

export function Sidebar() {
  const pathname = usePathname()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  return (
    <>
      {/* Mobile Menu Toggle */}
      <Button
        variant="outline"
        size="icon"
        className="fixed top-4 left-4 z-40 md:hidden"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      >
        {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        <span className="sr-only">Toggle menu</span>
      </Button>

      {/* Mobile Sidebar */}
      <div
        className={`md:hidden fixed inset-0 bg-black/50 z-20 transition-opacity duration-200 ${
          isMobileMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setIsMobileMenuOpen(false)}
      />

      {/* Sidebar */}
      <div
        className={`bg-white dark:bg-zinc-950 border-r dark:border-zinc-800 w-64 h-screen overflow-y-auto fixed inset-y-0 left-0 z-30 transition-transform duration-200 ease-in-out ${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="p-6">
          <Link href="/admin" className="flex items-center space-x-2">
            <span className="text-xl font-bold bg-sky-600 text-white px-2 py-1 rounded">EAC</span>
            <span className="font-semibold">Admin Panel</span>
          </Link>
        </div>

        <nav className="px-4 pb-6 pt-2">
          {adminNavSections.map((section, sectionIndex) => (
            <div key={section.title} className={sectionIndex > 0 ? "mt-6" : ""}>
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 px-3">
                {section.title}
              </h3>
              <ul className="space-y-1">
                {section.items.map((item) => {
                  const isActive = pathname === item.href || pathname?.startsWith(`${item.href}/`)

                  return (
                    <li key={item.href}>
                      <Link href={item.href}>
                        <Button
                          variant={isActive ? "secondary" : "ghost"}
                          className={`w-full justify-start text-sm ${
                            isActive 
                              ? "bg-sky-50 text-sky-700 hover:bg-sky-100 hover:text-sky-900 dark:bg-sky-900/20 dark:text-sky-300 dark:hover:bg-sky-900/30" 
                              : "text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-800"
                          }`}
                        >
                          <item.icon className="h-4 w-4 mr-3" />
                          {item.title}
                        </Button>
                      </Link>
                    </li>
                  )
                })}
              </ul>
            </div>
          ))}
          
          <div className="mt-8 pt-4 border-t border-gray-200 dark:border-gray-700">
            <Button
              variant="ghost"
              className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:text-red-300 dark:hover:bg-red-900/20"
            >
              <LogOut className="h-4 w-4 mr-3" />
              Logout
            </Button>
          </div>
        </nav>
      </div>
    </>
  )
}
