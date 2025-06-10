'use client';

import { useState, useEffect, Suspense } from 'react';
import api from '@/services/api';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { X } from 'lucide-react';
import { JobCardSkeleton } from "@/components/ui/skeleton";
import { Loading } from "@/components/ui/loading";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "react-hot-toast";

interface Job {
  _id: string;
  title: string;
  company: string;
  location: string;
  type: string;
  salary: string;
  description: string;
  createdAt: string;
  sector: string;
  education?: string;
  experienceLevel?: string;
  benefits?: string[];
  applicationDeadline?: string;
  updatedAt: string;
}

// Add date formatting function
const formatDate = (dateString: string) => {
  if (!dateString) return '--';
  const date = new Date(dateString);
  const day = date.getDate();
  const month = date.toLocaleString('default', { month: 'long' });
  const year = date.getFullYear();
  
  // Add ordinal suffix to day
  const ordinal = (n: number) => {
    const s = ['th', 'st', 'nd', 'rd'];
    const v = n % 100;
    return n + (s[(v - 20) % 10] || s[v] || s[0]);
  };

  return `${ordinal(day)} ${month} ${year}`;
};

// Add word limit function
const limitWords = (text: string, limit: number) => {
  if (!text) return '--';
  const words = text.split(' ');
  if (words.length <= limit) return text;
  return words.slice(0, limit).join(' ') + '...';
};

// List of predefined categories
const predefinedCategories = [
  'Accounts',
  'Agriculture',
  'Agro Commodities',
  'Beverages',
  'Cement',
  'Chartered Accountants',
  'Chemicals & Lubricants',
  'Construction',
  'Cosmetics',
  'Edible Oils',
  'Education',
  'Electricals',
  'Engineering',
  'Environment Health & Safety',
  'FMCG',
  'Food Processing',
  'General Manager & C-Suite',
  'HEMM & Automotive',
  'Hospitals',
  'Hotels',
  'Human Resources',
  'Information & Communication Technology',
  'Instrumentation & Power Electronics',
  'Logistics',
  'Marketing & Brand Management',
  'Mining',
  'Oil & Gas',
  'Packaging',
  'Pharma & Healthcare',
  'Plastics',
  'Printing',
  'Procurement',
  'Remote Work',
  'Sales & Business Development',
  'SCM & Warehouse Management',
  'Soaps & Detergents',
  'Specialized Fields',
  'Steel',
  'Textiles'
];

// Add predefined locations
const predefinedLocations = [
  'Nairobi',
  'Mombasa',
  'Kisumu',
  'Nakuru',
  'Eldoret',
  'Kampala',
  'Entebbe',
  'Jinja',
  'Dar es Salaam',
  'Arusha',
  'Mwanza',
  'Kigali',
  'Butare',
  'Gisenyi',
  'Bujumbura',
  'Gitega',
  'Djibouti City',
  'Addis Ababa',
  'Dire Dawa',
  'Mogadishu',
  'Hargeisa',
  'Juba',
  'Malakal'
];

function JobsContent() {
  const searchParams = useSearchParams();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [jobType, setJobType] = useState('all');
  const [locationFilter, setLocationFilter] = useState(searchParams.get('location') || 'all');
  const sectorFilter = searchParams.get('sector');
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);
        const params = new URLSearchParams();
        if (searchQuery) params.append('search', searchQuery);
        if (jobType !== 'all') params.append('type', jobType);
        if (locationFilter !== 'all') params.append('location', locationFilter);
        if (sectorFilter) params.append('sector', sectorFilter);
        
        const response = await api.get(`/jobs?${params.toString()}`);
        setJobs(response.data);
      } catch (error) {
        console.error('Error fetching jobs:', error);
        setError('Failed to load jobs. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, [searchQuery, jobType, locationFilter, sectorFilter]);

  // Update search query when URL parameters change
  useEffect(() => {
    const search = searchParams.get('search');
    const location = searchParams.get('location');
    if (search) setSearchQuery(search);
    if (location) setLocationFilter(location);
  }, [searchParams]);

  const handleGetDetails = async (jobId: string, e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigation
    e.stopPropagation(); // Stop event bubbling

    if (!user) {
      toast.error("Please login to get job details");
      return;
    }

    try {
      const response = await api.post(`/jobs/${jobId}/send-details`);
      toast.success("Job details sent to your email");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to send job details");
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">Jobs</h1>
          <p className="text-gray-600 dark:text-gray-300">Loading jobs...</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, index) => (
            <JobCardSkeleton key={index} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">
          {sectorFilter ? `Jobs in ${sectorFilter}` : 'Find Your Next Opportunity'}
        </h1>
        {sectorFilter && (
          <Link href="/jobs">
            <Button variant="outline" className="flex items-center gap-2">
              <X className="h-4 w-4" />
              Clear Filter
            </Button>
          </Link>
        )}
      </div>

      {/* Search and Filters */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Input
          placeholder="Search jobs..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="md:col-span-2"
        />
        <Select value={jobType} onValueChange={setJobType}>
          <SelectTrigger>
            <SelectValue placeholder="Job Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="Full Time">Full Time</SelectItem>
            <SelectItem value="Part Time">Part Time</SelectItem>
            <SelectItem value="Remote">Remote</SelectItem>
            <SelectItem value="Hybrid">Hybrid</SelectItem>
          </SelectContent>
        </Select>
        <Select value={locationFilter} onValueChange={setLocationFilter}>
          <SelectTrigger>
            <SelectValue placeholder="Select Location" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Locations</SelectItem>
            {predefinedLocations.map((location) => (
              <SelectItem key={location} value={location}>
                {location}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Job Listings */}
      {error ? (
        <div className="text-red-500 text-center py-4">{error}</div>
      ) : jobs.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-600 dark:text-gray-300">No jobs found matching your criteria.</p>
          {sectorFilter && (
            <Link href="/jobs">
              <Button variant="outline" className="mt-4">
                View All Jobs
              </Button>
            </Link>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {jobs.map((job) => (
            <Link 
              key={job._id} 
              href={`/jobs/${job._id}`}
              className="block transition-transform hover:scale-[1.02]"
            >
              <Card className="group relative bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 shadow-sm hover:shadow-md transition-all duration-200 p-5 h-[480px] flex flex-col rounded-lg overflow-hidden">
                {/* Subtle background accent */}
                <div className="absolute inset-0 bg-gradient-to-br from-gray-50/50 via-transparent to-gray-50/50 dark:from-gray-800/10 dark:via-transparent dark:to-gray-800/10 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>

                {/* Job Details */}
                <div className="relative z-10 flex-1 flex flex-col">
                  {/* Job Title and Type */}
                  <div className="flex justify-between items-start">
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white leading-tight mb-1" title={job.title}>
                      {job.title.length > 30 ? `${job.title.substring(0, 30)}...` : job.title}
                    </h3>
                    <span className="px-3 py-1.5 text-sm font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 rounded">
                      {job.type}
                    </span>
                  </div>
                  <p className="text-lg font-medium text-gray-600 dark:text-gray-400 mb-4" title={job.sector}>
                    {job.sector}
                  </p>

                  {/* Job Details */}
                  <div className="space-y-3 flex-1">
                    <div className="flex items-start">
                      <span className="font-semibold text-gray-700 dark:text-gray-300 min-w-[160px]">Location:</span> 
                      <span className="text-gray-700 dark:text-gray-300 flex-1" title={job.location}>
                        {job.location}
                      </span>
                    </div>
                    <div className="flex items-start">
                      <span className="font-semibold text-gray-700 dark:text-gray-300 min-w-[160px]">Description:</span> 
                      <span className="text-gray-700 dark:text-gray-300 flex-1" title={job.description}>
                        {limitWords(job.description, 15)}
                      </span>
                    </div>
                    <div className="flex items-start">
                      <span className="font-semibold text-gray-700 dark:text-gray-300 min-w-[160px]">Qualification:</span>
                      <span className="text-gray-700 dark:text-gray-300 flex-1" title={job.education}>
                        {job.education || '--'}
                      </span>
                    </div>
                    <div className="flex items-start">
                      <span className="font-semibold text-gray-700 dark:text-gray-300 min-w-[160px]">Experience:</span>
                      <span className="text-gray-700 dark:text-gray-300 flex-1" title={job.experienceLevel}>
                        {job.experienceLevel || '--'}
                      </span>
                    </div>
                    <div className="flex items-start">
                      <span className="font-semibold text-gray-700 dark:text-gray-300 min-w-[160px]">Salary:</span> 
                      <span className="text-gray-700 dark:text-gray-300 flex-1" title={job.salary}>
                        {job.salary}
                      </span>
                    </div>
                    {job.benefits && job.benefits.length > 0 && (
                      <div className="flex items-start">
                        <span className="font-semibold text-gray-700 dark:text-gray-300 min-w-[160px]">Benefits:</span> 
                        <span className="text-gray-700 dark:text-gray-300 flex-1" title={job.benefits.join(', ')}>
                          {job.benefits.join(', ').length > 25 ? `${job.benefits.join(', ').substring(0, 25)}...` : job.benefits.join(', ')}
                        </span>
                      </div>
                    )}
                    <div className="flex items-start">
                      <span className="font-semibold text-gray-700 dark:text-gray-300 min-w-[160px]">Application Deadline:</span> 
                      <span className="text-gray-700 dark:text-gray-300 flex-1" title={formatDate(job.applicationDeadline || '')}>
                        {formatDate(job.applicationDeadline || '')}
                      </span>
                    </div>
                  </div>

                  {/* Get Details Button */}
                  <div className="mt-2 pt-2 border-t border-gray-200 dark:border-gray-700">
                    <Button 
                      className="w-full bg-[#0285c7] hover:bg-[#0270a3] dark:bg-[#0285c7] dark:hover:bg-[#0270a3] text-white font-medium py-2.5 rounded-md shadow-sm hover:shadow-md transition-colors duration-200"
                      onClick={(e) => handleGetDetails(job._id, e)}
                    >
                      Get Details
                    </Button>
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default function JobsPage() {
  return (
    <Suspense fallback={
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">Jobs</h1>
          <p className="text-gray-600 dark:text-gray-300">Loading jobs...</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, index) => (
            <JobCardSkeleton key={index} />
          ))}
        </div>
      </div>
    }>
      <JobsContent />
    </Suspense>
  );
} 
