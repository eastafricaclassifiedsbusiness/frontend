"use client"

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Briefcase, Users, Building2, Globe2, Shield, CheckCircle2, Search, MapPin, Calendar, Bell, FileText } from "lucide-react"
import { useAuth } from "@/contexts/AuthContext"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { FeaturedCategories } from '@/components/featured-categories';
import { Job } from '@/types/job';
import { FeaturedJobs } from "@/components/featured-jobs"
import { HeroSection } from "@/components/hero-section"
import { UserTestimonials } from "@/components/user-testimonials"

export default function HomePage() {
  const router = useRouter();
  const { isAuthenticated, user } = useAuth()
  const [searchQuery, setSearchQuery] = useState('');
  const [location, setLocation] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [recentJobs, setRecentJobs] = useState<Job[]>([]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Build search parameters
    const searchParams = new URLSearchParams();
    if (searchQuery.trim()) {
      searchParams.append('search', searchQuery.trim());
    }
    if (location.trim()) {
      searchParams.append('location', location.trim());
    }

    // Navigate to jobs page with search parameters
    router.push(`/jobs?${searchParams.toString()}`);
  };

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto px-4 py-6">
        <HeroSection />

        <section className="my-12">
          <div className="flex flex-col md:flex-row justify-between items-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-zinc-900 dark:text-zinc-50">Featured Categories</h2>
            <Link href="/categories">
              <Button variant="outline" className="mt-4 md:mt-0">
                View All Categories
              </Button>
            </Link>
          </div>
          <FeaturedCategories />
        </section>

        <section className="my-12">
          <div className="flex flex-col md:flex-row justify-between items-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-zinc-900 dark:text-zinc-50">Featured Jobs</h2>
            <Link href="/jobs">
              <Button variant="outline" className="mt-4 md:mt-0">
                View All Jobs
              </Button>
            </Link>
          </div>
          <FeaturedJobs />
        </section>

        <section className="my-12 bg-zinc-50 dark:bg-zinc-900 py-10 px-6 rounded-xl">
          <h2 className="text-2xl md:text-3xl font-bold text-center text-zinc-900 dark:text-zinc-50 mb-8">
            What Our Users Say
          </h2>
          <UserTestimonials />
        </section>
      </div>
    )
  }

  // Content for authenticated users
  return (
    <div className="container mx-auto px-4 py-6">
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">
          Welcome back, {user?.name}!
        </h1>
        <p className="text-gray-600 dark:text-gray-300 mt-2">
          Find your next career opportunity
        </p>
      </div>

      {/* Search Section */}
      <section className="mb-12">
        <Card className="p-6">
          <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input
                  placeholder="Search jobs, companies, or keywords"
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            <div className="flex-1">
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input
                  placeholder="Location"
                  className="pl-10"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
              </div>
            </div>
            <Button type="submit" className="w-full md:w-auto" disabled={loading}>
              {loading ? 'Searching...' : 'Search Jobs'}
            </Button>
          </form>
          {error && <p className="text-red-500 mt-2">{error}</p>}
        </Card>
      </section>

      {/* Featured Categories */}
      <section className="my-12">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-zinc-900 dark:text-zinc-50">Featured Categories</h2>
          <Link href="/categories">
            <Button variant="outline" className="mt-4 md:mt-0">
              View All Categories
            </Button>
          </Link>
        </div>
        <FeaturedCategories />
      </section>

      {/* Featured Jobs */}
      <section className="my-12">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-zinc-900 dark:text-zinc-50">Featured Jobs</h2>
          <Link href="/jobs">
            <Button variant="outline" className="mt-4 md:mt-0">
              View All Jobs
            </Button>
          </Link>
        </div>
        <FeaturedJobs />
      </section>
    </div>
  )
}
