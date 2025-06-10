"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Job } from "@/types/job"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Calendar,
  MapPin,
  Building2,
  Briefcase,
  GraduationCap,
  Clock,
  DollarSign,
} from "lucide-react"
import { format } from "date-fns"
import { Skeleton } from "@/components/ui/skeleton"
import { useAuth } from "@/contexts/AuthContext"
import { toast } from "react-hot-toast"
import api from "@/services/api"

export default function JobDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const { user } = useAuth()
  const [job, setJob] = useState<Job | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const handleApply = async () => {
    if (!user) {
      toast.error("Please login to apply for this job");
      return;
    }

    try {
      const response = await api.post(`/jobs/${params.id}/apply`, {
        jobId: params.id,
        userId: user.id
      });
      toast.success("Job details and contact information sent to your email");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to send job details");
    }
  };

  useEffect(() => {
    const fetchJob = async () => {
      try {
        setLoading(true)
        const response = await fetch(`http://localhost:5000/api/jobs/${params.id}`)
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        const data = await response.json()
        setJob(data)
      } catch (error) {
        console.error("Error fetching job:", error)
        setError("Failed to load job details. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    if (params.id) {
      fetchJob()
    }
  }, [params.id])

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Skeleton className="h-[400px]" />
            <div className="space-y-4">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Error</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">{error}</p>
          <Button onClick={() => router.push("/jobs")}>
            Back to Jobs
          </Button>
        </div>
      </div>
    )
  }

  if (!job) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Job Not Found</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">The job you're looking for doesn't exist or has been removed.</p>
          <Button onClick={() => router.push("/jobs")}>
            Back to Jobs
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="mb-4"
          >
            ← Back
          </Button>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            {job.title}
          </h1>
          {job.applicationDeadline && (
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Application Deadline: {format(new Date(job.applicationDeadline), 'MMMM dd, yyyy')}
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <Card className="p-6 mb-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Job Description
              </h2>
              <div className="prose dark:prose-invert max-w-none">
                {job.description}
              </div>
            </Card>

            {job.benefits && job.benefits.length > 0 && (
              <Card className="p-6 mb-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  Benefits
                </h2>
                <ul className="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-400">
                  {job.benefits.map((benefit: string, index: number) => (
                    <li key={index}>{benefit}</li>
                  ))}
                </ul>
              </Card>
            )}

            {job.education && (
              <Card className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  Education & Experience
                </h2>
                <div className="space-y-4">
                  {job.education && (
                    <div>
                      <h3 className="font-medium text-gray-900 dark:text-white mb-2">
                        Education
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400">
                        {job.education}
                      </p>
                    </div>
                  )}
                  {job.experienceLevel && (
                    <div>
                      <h3 className="font-medium text-gray-900 dark:text-white mb-2">
                        Experience Level
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400">
                        {job.experienceLevel}
                      </p>
                    </div>
                  )}
                </div>
              </Card>
            )}
          </div>

          <div className="space-y-6">
            <Card className="p-6">
              <div className="space-y-4">
                <div className="flex items-center text-gray-600 dark:text-gray-400">
                  <MapPin className="w-5 h-5 mr-2" />
                  <span>{job.location}</span>
                </div>
                <div className="flex items-center text-gray-600 dark:text-gray-400">
                  <Briefcase className="w-5 h-5 mr-2" />
                  <span>{job.type}</span>
                </div>
                <div className="flex items-center text-gray-600 dark:text-gray-400">
                  <DollarSign className="w-5 h-5 mr-2" />
                  <span>{job.salary}</span>
                </div>
                <div className="flex items-center text-gray-600 dark:text-gray-400">
                  <GraduationCap className="w-5 h-5 mr-2" />
                  <span>{job.sector}</span>
                </div>
                <div className="flex items-center text-gray-600 dark:text-gray-400">
                  <Calendar className="w-5 h-5 mr-2" />
                  <span>Posted {format(new Date(job.createdAt), 'MMM dd, yyyy')}</span>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <Button 
                className="w-full" 
                size="lg"
                onClick={handleApply}
              >
                Apply Now
              </Button>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
