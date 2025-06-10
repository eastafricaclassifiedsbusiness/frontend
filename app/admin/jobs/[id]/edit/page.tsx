'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import api from '@/services/api'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import AutocompleteInput from '@/components/ui/autocomplete-input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

interface Job {
  _id: string
  title: string
  company: string
  description: string
  location: string
  salary: string
  type: string
  sector: string
  benefits: string | string[]
  education?: string
  experienceLevel?: string
  companyEmail?: string
  companyContactNumber?: string
  applicationDeadline?: string
}

export default function EditJobPage() {
  const router = useRouter()
  const params = useParams()
  const { user } = useAuth()
  const [job, setJob] = useState<Job | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [companies, setCompanies] = useState<string[]>([])
  const [titleOptions, setTitleOptions] = useState<string[]>([])
  const [locationOptions, setLocationOptions] = useState<string[]>([])
  const defaultSectors = ['Technology','Marketing','Finance','Healthcare','Education','Manufacturing','Retail','Agriculture','Other']
  const [sectorOptions, setSectorOptions] = useState<string[]>(defaultSectors)

  const jobId = params?.id as string

  useEffect(() => {
    if (user && user.userType !== 'admin') {
      router.replace('/')
    }
  }, [user, router])

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const { data } = await api.get<Job>(`/jobs/${jobId}`)
        setJob(data)
      } catch (err) {
        console.error(err)
        alert('Failed to load job')
      } finally {
        setLoading(false)
      }
    }
    if (jobId) fetchJob()
  }, [jobId])

  // Fetch companies list
  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const { data } = await api.get<string[]>('/jobs/companies')
        setCompanies(data)
      } catch (err) {
        console.error(err)
      }
    }
    if (user?.userType === 'admin') {
      fetchCompanies()
    }
  }, [user])

  useEffect(() => {
    const fetchTitlesLocations = async () => {
      try {
        const [titlesRes, locsRes] = await Promise.all([
          api.get<string[]>('/jobs/titles'),
          api.get<string[]>('/jobs/locations'),
        ])
        setTitleOptions(titlesRes.data)
        setLocationOptions(locsRes.data)
      } catch(err){ console.error(err) }
    }
    if(user?.userType==='admin') fetchTitlesLocations()
  }, [user])

  useEffect(() => {
    const fetchSectors = async () => {
      try {
        const { data } = await api.get<string[]>('/jobs/sectors')
        setSectorOptions(Array.from(new Set([...defaultSectors, ...data])))
      } catch(err){ console.error(err) }
    }
    if(user?.userType==='admin') fetchSectors()
  }, [user])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (!job) return
    setJob({ ...job, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!job) return
    try {
      setSaving(true)
      const payload = {
        ...job,
        education: job.education,
        experienceLevel: job.experienceLevel,
        benefits:
          typeof job.benefits === 'string'
            ? job.benefits
            : (job.benefits as string[]).join(', '),
        companyEmail: job.companyEmail,
        companyContactNumber: job.companyContactNumber,
        applicationDeadline: job.applicationDeadline,
      }
      await api.put(`/jobs/${job._id}`, payload)
      router.push('/admin/jobs')
    } catch (err) {
      console.error(err)
      alert('Failed to update job')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <p className="p-4">Loading...</p>
  if (!job) return <p className="p-4">Job not found.</p>

  return (
    <div className="container mx-auto px-4 py-6 max-w-xl">
      <h1 className="text-2xl font-bold mb-4">Edit Job</h1>
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Job Details */}
        <div className="space-y-4 border p-4 rounded">
          <h2 className="text-xl font-semibold">Job Details</h2>
          <div>
            <Label htmlFor="title">Job Title</Label>
            <AutocompleteInput
              id="title"
              name="title"
              value={job.title}
              onChange={(val) => setJob({ ...job, title: val })}
              suggestions={titleOptions}
              placeholder="Start typing job title"
              required
            />
          </div>
          <div>
            <Label htmlFor="description">Description</Label>
            <textarea
              id="description"
              name="description"
              className="w-full border rounded px-3 py-2"
              value={job.description}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <Label htmlFor="location">Location</Label>
            <AutocompleteInput
              id="location"
              name="location"
              value={job.location}
              onChange={(val) => setJob({ ...job, location: val })}
              suggestions={locationOptions}
              placeholder="Start typing location"
              required
            />
          </div>
          <div>
            <Label htmlFor="salary">Salary</Label>
            <Input id="salary" name="salary" value={job.salary} onChange={handleChange} required />
          </div>
          <div>
            <Label htmlFor="applicationDeadline">Application Deadline</Label>
            <Input
              type="date"
              id="applicationDeadline"
              name="applicationDeadline"
              value={job.applicationDeadline ? job.applicationDeadline.substring(0,10) : ''}
              onChange={handleChange}
            />
          </div>
          <div>
            <Label htmlFor="education">Education Requirement</Label>
            <Input id="education" name="education" value={job.education || ''} onChange={handleChange} placeholder="e.g. Bachelor's in CS" />
          </div>
          <div>
            <Label htmlFor="experienceLevel">Experience Level</Label>
            <Input id="experienceLevel" name="experienceLevel" value={job.experienceLevel || ''} onChange={handleChange} placeholder="e.g. 3+ years" />
          </div>
          <div>
            <Label htmlFor="type">Type</Label>
            <Select value={job.type} onValueChange={(val)=> setJob({...job, type: val})}>
              <SelectTrigger>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Full-time">Full Time</SelectItem>
                <SelectItem value="Part-time">Part Time</SelectItem>
                <SelectItem value="Remote">Remote</SelectItem>
                <SelectItem value="Hybrid">Hybrid</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="sector">Sector</Label>
            <AutocompleteInput
              id="sector"
              name="sector"
              value={job.sector}
              onChange={(val) => {
                setJob({ ...job, sector: val })
                if (val && !sectorOptions.includes(val)) {
                  setSectorOptions((prev) => [...prev, val])
                }
              }}
              suggestions={sectorOptions}
              placeholder="Select sector"
              required
            />
          </div>
          <div>
            <Label htmlFor="benefits">Benefits (comma or newline separated)</Label>
            <textarea
              id="benefits"
              name="benefits"
              className="w-full border rounded px-3 py-2"
              value={typeof job.benefits === 'string' ? job.benefits : (job.benefits as string[]).join(', ')}
              onChange={handleChange}
            />
          </div>
          <div>
            <Label htmlFor="companyEmail">Company Email (admin only)</Label>
            <Input id="companyEmail" name="companyEmail" type="email" value={job.companyEmail || ''} onChange={handleChange} placeholder="hr@example.com" />
          </div>
          <div>
            <Label htmlFor="companyContactNumber">Contact Number (admin only)</Label>
            <Input id="companyContactNumber" name="companyContactNumber" value={job.companyContactNumber || ''} onChange={handleChange} placeholder="+123456789" />
          </div>
        </div>
        <Button type="submit" disabled={saving}>
          {saving ? 'Saving...' : 'Save Changes'}
        </Button>
      </form>
    </div>
  )
} 