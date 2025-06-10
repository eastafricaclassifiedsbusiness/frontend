'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import api from '@/services/api'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

interface Job {
  _id: string
  title: string
  location: string
  salary: string
  type: string
  createdAt: string
}

export default function AdminJobsPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [jobs, setJobs] = useState<Job[]>([])
  const [fetching, setFetching] = useState(false)

  // Redirect non-admin users
  useEffect(() => {
    if (!loading && user?.userType !== 'admin') {
      router.replace('/')
    }
  }, [loading, user, router])

  const fetchJobs = async () => {
    try {
      setFetching(true)
      const { data } = await api.get<Job[]>('/jobs')
      setJobs(data)
    } catch (err) {
      console.error(err)
    } finally {
      setFetching(false)
    }
  }

  useEffect(() => {
    if (user?.userType === 'admin') {
      fetchJobs()
    }
  }, [user])

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this job?')) return
    try {
      await api.delete(`/jobs/${id}`)
      setJobs((prev) => prev.filter((job) => job._id !== id))
    } catch (err) {
      console.error(err)
      alert('Failed to delete job')
    }
  }

  if (loading || fetching) {
    return <p className="p-4">Loading...</p>
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Job Listings</h1>
        <Link href="/admin/jobs/new">
          <Button>Add New Job</Button>
        </Link>
      </div>

      {jobs.length === 0 ? (
        <p>No jobs found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border text-sm">
            <thead className="border-b bg-zinc-50 dark:bg-zinc-900">
              <tr>
                <th className="px-4 py-2 text-left">Title</th>
                <th className="px-4 py-2 text-left">Location</th>
                <th className="px-4 py-2 text-left">Salary</th>
                <th className="px-4 py-2 text-left">Type</th>
                <th className="px-4 py-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {jobs.map((job) => (
                <tr key={job._id} className="border-b hover:bg-zinc-50 dark:hover:bg-zinc-900">
                  <td className="px-4 py-2">{job.title}</td>
                  <td className="px-4 py-2">{job.location}</td>
                  <td className="px-4 py-2">{job.salary}</td>
                  <td className="px-4 py-2">{job.type}</td>
                  <td className="px-4 py-2">
                    <div className="flex space-x-2">
                      <Link href={`/admin/jobs/${job._id}/edit`}>
                        <Button variant="outline" size="sm">Edit</Button>
                      </Link>
                      <Button variant="destructive" size="sm" onClick={() => handleDelete(job._id)}>Delete</Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
} 