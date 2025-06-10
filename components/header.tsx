"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Bell, ChevronDown, LogIn, Menu, UserCircle, Sun, Moon, LayoutDashboard, User, LogOut } from "lucide-react"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { DropdownMenuLabel, DropdownMenuSeparator } from "@/components/ui/dropdown-menu"
import { useAuth } from "@/contexts/AuthContext"
import { useTheme } from "next-themes"

const Header = () => {
  const { user, isAuthenticated, logout } = useAuth()
  const { theme, setTheme } = useTheme()
  const router = useRouter()

  const handleLoginClick = () => {
    router.push('/login');
  };

  return (
    <header className="border-b sticky top-0 z-50 bg-white dark:bg-zinc-950">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[300px] sm:w-[400px]">
                <nav className="flex flex-col gap-4 mt-8">
                  <Link href="/" className="text-lg font-medium">
                    Home
                  </Link>
                  <Link href="/jobs" className="text-lg font-medium">
                    Jobs
                  </Link>
                  <Link href="/classifieds" className="text-lg font-medium">
                    Classifieds
                  </Link>
                  <Link href="/about" className="text-lg font-medium">
                    About Us
                  </Link>
                  <Link href="/contact" className="text-lg font-medium">
                    Contact Us
                  </Link>
                  {!isAuthenticated && (
                    <>
                      <Link href="/login" className="text-lg font-medium">
                        Login
                      </Link>
                      <Link href="/register" className="text-lg font-medium">
                        Register
                      </Link>
                    </>
                  )}
                </nav>
              </SheetContent>
            </Sheet>

            <Link href="/" className="flex items-center space-x-2 ml-2 md:ml-0">
              <span className="text-xl font-bold bg-sky-600 text-white px-2 py-1 rounded">EAC</span>
              <span className="hidden md:inline-block font-semibold">East Africa Classifieds</span>
            </Link>

            <nav className="hidden md:flex items-center space-x-6 ml-10">
              <Link href="/" className="text-sm font-medium hover:text-teal-600 transition-colors">
                Home
              </Link>
              <Link href="/jobs" className="text-sm font-medium hover:text-teal-600 transition-colors">
                Jobs
              </Link>
              <Link href="/about" className="text-sm font-medium hover:text-teal-600 transition-colors">
                About Us
              </Link>
              <Link href="/contact" className="text-sm font-medium hover:text-teal-600 transition-colors">
                Contact Us
              </Link>
              {user?.userType === 'admin' && (
                <Link href="/admin" className="text-sm font-medium hover:text-teal-600 transition-colors">
                  Dashboard
                </Link>
              )}
            </nav>
          </div>

          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "light" ? "dark" : "light")}
            >
              <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              <span className="sr-only">Toggle theme</span>
            </Button>

            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user?.avatar} alt={user?.name} />
                      <AvatarFallback>{user?.name?.charAt(0)}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{user?.name}</p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {user?.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {user?.userType === 'admin' && (
                    <DropdownMenuItem asChild>
                      <Link href="/admin">
                        <LayoutDashboard className="mr-2 h-4 w-4" />
                        <span>Dashboard</span>
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem asChild>
                    <Link href="/profile">
                      <User className="mr-2 h-4 w-4" />
                      <span>Profile</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={logout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center space-x-2">
                <Button variant="ghost" onClick={handleLoginClick}>
                  <LogIn className="h-5 w-5 mr-2" />
                  <span className="hidden md:inline-block">Login</span>
                </Button>
                <Button variant="default" onClick={() => router.push('/register')}>
                  <User className="h-5 w-5 mr-2" />
                  <span className="hidden md:inline-block">Register</span>
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
