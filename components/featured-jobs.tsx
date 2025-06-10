"use client"

import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BriefcaseBusiness, Building, DollarSign, MapPin, GraduationCap } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"
import api from "@/services/api"

interface Job {
  _id: string
  title: string
  location: string
  salary: string
  type: string
  sector: string
  createdAt: string
  companyEmail: string
  companyContactNumber: string
  education: string
}

export function FeaturedJobs() {
  const [jobs, setJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const { data } = await api.get<Job[]>('/jobs/public')
        // Get the 6 most recent jobs
        setJobs(data.slice(0, 6))
      } catch (err) {
        console.error('Error fetching featured jobs:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchJobs()
  }, [])

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <Card key={i} className="h-full animate-pulse">
            <CardContent className="p-6">
              <div className="space-y-3">
                <div className="h-4 bg-zinc-200 dark:bg-zinc-700 rounded w-3/4" />
                <div className="h-3 bg-zinc-200 dark:bg-zinc-700 rounded w-1/2" />
                <div className="h-3 bg-zinc-200 dark:bg-zinc-700 rounded w-2/3" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {jobs.map((job) => (
        <Link 
          key={job._id} 
          href={`/jobs/${job._id}`}
          className="block transition-transform hover:scale-[1.02]"
        >
          <Card className="h-full hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50 truncate">{job.title}</h3>
                  <Badge
                    variant="secondary"
                    className="ml-2 bg-sky-100 text-sky-800 dark:bg-sky-900 dark:text-sky-300"
                  >
                    {job.type}
                  </Badge>
                </div>
                <div className="flex items-center text-sm text-zinc-500 dark:text-zinc-400 mb-1">
                  <Building className="h-4 w-4 mr-1 flex-shrink-0" />
                  <span className="truncate">{job.sector}</span>
                </div>
                <div className="flex items-center text-sm text-zinc-500 dark:text-zinc-400 mb-1">
                  <MapPin className="h-4 w-4 mr-1 flex-shrink-0" />
                  <span className="truncate">{job.location}</span>
                </div>
                <div className="flex items-center text-sm text-zinc-500 dark:text-zinc-400">
                  <DollarSign className="h-4 w-4 mr-1 flex-shrink-0" />
                  <span className="truncate">{job.salary}</span>
                </div>
              </div>
            </CardContent>
            <CardFooter className="border-t px-6 py-3 flex items-center justify-between">
              <div className="flex items-center">
                <GraduationCap className="h-4 w-4 mr-1 text-zinc-500 dark:text-zinc-400" />
                <span className="text-xs text-zinc-500 dark:text-zinc-400">
                  {job.education || 'Not specified'}
                </span>
              </div>
              <span className="text-xs text-zinc-500 dark:text-zinc-400">
                {new Date(job.createdAt).toLocaleDateString()}
              </span>
            </CardFooter>
          </Card>
        </Link>
      ))}
    </div>
  )
}
