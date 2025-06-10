'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import api from '@/services/api'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import AutocompleteInput from '@/components/ui/autocomplete-input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Combobox } from '@/components/ui/combobox'
import { toast } from 'react-hot-toast'

// Add word limit constants
const WORD_LIMITS = {
  role: 20,
  responsibilities: 100,
  benefits: 20
};

// Default sectors if API fails
const DEFAULT_SECTORS = [
  'Technology',
  'Marketing',
  'Finance',
  'Healthcare',
  'Education',
  'Manufacturing',
  'Retail',
  'Agriculture',
  'Other',
];

export default function NewJobPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [titleOptions, setTitleOptions] = useState<string[]>([])
  const [locationOptions, setLocationOptions] = useState<string[]>([])
  const [form, setForm] = useState({
    title: '',
    description: '',
    requirements: '',
    responsibilities: '',
    salary: '',
    location: '',
    sector: '',
    contactEmail: '',
    contactNumber: '',
    type: '',
    role: '',
    education: '',
    experienceLevel: '',
    benefits: '',
    applicationDeadline: '',
    companyEmail: ''
  })
  const [submitting, setSubmitting] = useState(false)
  const [sectorOptions, setSectorOptions] = useState<string[]>(DEFAULT_SECTORS)
  const [positionOptions, setPositionOptions] = useState<string[]>([])
  const [recommendedSectors, setRecommendedSectors] = useState<string[]>([])
  const [recommendedPositions, setRecommendedPositions] = useState<string[]>([])

  const [wordCounts, setWordCounts] = useState({
    description: 0,
    requirements: 0,
    responsibilities: 0,
    benefits: 0
  });

  const [warnings, setWarnings] = useState({
    role: false,
    responsibilities: false,
    benefits: false
  });

  const [sectorInput, setSectorInput] = useState('')
  const [filteredSectors, setFilteredSectors] = useState<string[]>(sectorOptions)
  const [showCreateOption, setShowCreateOption] = useState(false)

  if (user && user.userType !== 'admin') {
    router.replace('/')
  }

  useEffect(() => {
    if (user?.userType === 'admin') {
      const fetchData = async () => {
        try {
          // Fetch all sectors, titles, and locations
          const [sectorsRes, titlesRes, locationsRes, recommendedSectorsRes, recommendedPositionsRes] = await Promise.all([
            api.get('/jobs/sectors').catch(() => ({ data: DEFAULT_SECTORS })),
            api.get('/jobs/titles').catch(() => ({ data: [] })),
            api.get('/jobs/locations').catch(() => ({ data: [] })),
            api.get('/jobs/recommended-sectors').catch(() => ({ data: [] })),
            api.get('/jobs/recommended-positions').catch(() => ({ data: [] }))
          ]);

          // Merge default sectors with API sectors
          const uniqueSectors = Array.from(new Set([
            ...DEFAULT_SECTORS,
            ...(sectorsRes.data || [])
          ]));
          
          setSectorOptions(uniqueSectors);
          setPositionOptions(titlesRes.data || []);
          setLocationOptions(locationsRes.data || []);
          setRecommendedSectors(recommendedSectorsRes.data || []);
          setRecommendedPositions(recommendedPositionsRes.data || []);
        } catch (error) {
          console.error('Error fetching data:', error);
          // Use default data on error
          setSectorOptions(DEFAULT_SECTORS);
          setPositionOptions([]);
          setLocationOptions([]);
          setRecommendedSectors([]);
          setRecommendedPositions([]);
          toast.error('Using default data. Some features may be limited.');
        }
      }
      fetchData()
    }
  }, [user])

  // Update filtered sectors when input changes
  useEffect(() => {
    const input = sectorInput.toLowerCase().trim()
    const filtered = sectorOptions.filter(sector =>
      sector.toLowerCase().includes(input)
    )
    
    // Show "Create new" option if input doesn't match any existing sector
    const exactMatch = sectorOptions.some(sector => 
      sector.toLowerCase() === input
    )
    setShowCreateOption(input !== '' && !exactMatch)
    
    setFilteredSectors(filtered)
  }, [sectorInput, sectorOptions])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));

    // Update word counts and warnings
    if (name === 'role' || name === 'description') {
      const words = value.trim().split(/\s+/).filter(word => word.length > 0);
      setWordCounts(prev => ({ ...prev, [name === 'role' ? 'role' : 'responsibilities']: words.length }));
      setWarnings(prev => ({
        ...prev,
        [name === 'role' ? 'role' : 'responsibilities']: words.length > WORD_LIMITS[name === 'role' ? 'role' : 'responsibilities']
      }));
    } else if (name === 'benefits') {
      const words = value.trim().split(/\s+/).filter(word => word.length > 0);
      setWordCounts(prev => ({ ...prev, benefits: words.length }));
      setWarnings(prev => ({ ...prev, benefits: words.length > WORD_LIMITS.benefits }));
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      // Validate required fields
      const requiredFields = ['title', 'location', 'education', 'experienceLevel', 'sector', 'description', 'salary', 'type', 'applicationDeadline']
      const missingFields = requiredFields.filter(field => !form[field as keyof typeof form])
      
      if (missingFields.length > 0) {
        toast.error(`Please fill in all required fields: ${missingFields.join(', ')}`)
        setSubmitting(false);
        return;
      }

      // Validate word limits
      if (warnings.role || warnings.responsibilities || warnings.benefits) {
        toast.error('Please check word limits for Role, Responsibilities, and Benefits');
        setSubmitting(false);
        return;
      }

      // Validate date format and ensure it's in the future
      const deadlineDate = new Date(form.applicationDeadline);
      const today = new Date();
      if (deadlineDate < today) {
        toast.error('Application deadline must be a future date');
        setSubmitting(false);
        return;
      }

      // Validate email format if provided
      if (form.companyEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.companyEmail)) {
        toast.error('Please enter a valid email address');
        setSubmitting(false);
        return;
      }

      // Validate phone number format if provided
      if (form.contactNumber && !/^\+?[\d\s-]{10,}$/.test(form.contactNumber)) {
        toast.error('Please enter a valid phone number');
        setSubmitting(false);
        return;
      }

      // Validate job type
      const validTypes = ['Full Time', 'Part Time', 'Remote', 'Hybrid'];
      if (!validTypes.includes(form.type)) {
        toast.error(`Job type must be one of: ${validTypes.join(', ')}`);
        setSubmitting(false);
        return;
      }

      const payload = {
        title: form.title.trim(),
        location: form.location.trim(),
        education: form.education.trim(),
        experienceLevel: form.experienceLevel.trim(),
        sector: form.sector.trim(),
        description: form.description.trim(),
        salary: form.salary.trim(),
        benefits: form.benefits.split('\n').filter(b => b.trim() !== ''),
        applicationDeadline: new Date(form.applicationDeadline).toISOString(),
        companyEmail: form.companyEmail.trim(),
        companyContactNumber: form.contactNumber.trim(),
        type: form.type.trim(),
        role: form.role.trim(),
        status: 'active'
      }

      console.log('Submitting job with payload:', payload);

      const response = await api.post('/jobs', payload);
      
      if (response.data) {
        toast.success('Job created successfully');
        router.push('/admin/jobs');
      } else {
        throw new Error('Failed to create job');
      }
    } catch (error: any) {
      console.error('Error creating job:', error);
      console.error('Error response:', error.response?.data);
      console.error('Error status:', error.response?.status);
      console.error('Error headers:', error.response?.headers);
      
      // Handle specific error cases
      if (error.response?.status === 400) {
        const errorMessage = error.response.data?.msg || error.response.data?.message || 'Invalid form data. Please check all fields and try again.';
        toast.error(errorMessage);
        
        // Log validation errors if they exist
        if (error.response.data?.errors) {
          console.error('Validation errors:', error.response.data.errors);
          Object.entries(error.response.data.errors).forEach(([field, message]) => {
            toast.error(`${field}: ${message}`);
          });
        }
      } else {
        const errorMessage = error.msg || error.message || 'Failed to create job. Please try again.';
        toast.error(errorMessage);
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Create New Job</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Position */}
            <div className="col-span-2">
              <Label htmlFor="title" className="text-base">Position *</Label>
              <AutocompleteInput
                id="title"
                name="title"
                value={form.title}
                onChange={(val) => {
                  setForm({ ...form, title: val })
                  if (val && !titleOptions.includes(val)) setTitleOptions(prev => [...prev, val])
                }}
                suggestions={titleOptions}
                placeholder="Enter job position"
                required
              />
            </div>

            {/* Location */}
            <div>
              <Label htmlFor="location" className="text-base">Location *</Label>
              <Input
                type="text"
                id="location"
                name="location"
                value={form.location}
                onChange={(e) => setForm(prev => ({ ...prev, location: e.target.value }))}
                placeholder="Enter location"
                required
                className="w-full h-12 text-base"
              />
            </div>

            {/* Qualification */}
            <div>
              <Label htmlFor="education" className="text-base">Qualification *</Label>
              <Input
                type="text"
                id="education"
                name="education"
                value={form.education}
                onChange={(e) => setForm(prev => ({ ...prev, education: e.target.value }))}
                placeholder="Enter required qualification"
                required
                className="w-full h-12 text-base"
              />
            </div>

            {/* Experience */}
            <div>
              <Label htmlFor="experienceLevel" className="text-base">Experience *</Label>
              <Input
                type="text"
                id="experienceLevel"
                name="experienceLevel"
                value={form.experienceLevel}
                onChange={(e) => setForm(prev => ({ ...prev, experienceLevel: e.target.value }))}
                placeholder="Enter required experience"
                required
                className="w-full h-12 text-base"
              />
            </div>

            {/* Sector */}
            <div>
              <Label htmlFor="sector" className="text-base">Sector</Label>
              <Input
                type="text"
                id="sector"
                name="sector"
                value={form.sector}
                onChange={(e) => setForm(prev => ({ ...prev, sector: e.target.value }))}
                placeholder="Enter sector"
                required
                className="w-full h-12 text-base"
              />
            </div>

            {/* Role */}
            <div>
              <Label htmlFor="role" className="text-base">Role *</Label>
              <Input
                type="text"
                id="role"
                name="role"
                value={form.role}
                onChange={(e) => setForm(prev => ({ ...prev, role: e.target.value }))}
                placeholder="Enter role"
                required
                className="w-full h-12 text-base"
              />
            </div>

            {/* Job Type */}
            <div>
              <Label htmlFor="type" className="text-base">Job Type *</Label>
              <Select
                value={form.type}
                onValueChange={(value) => setForm(prev => ({ ...prev, type: value }))}
              >
                <SelectTrigger className="w-full h-12 text-base">
                  <SelectValue placeholder="Select job type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Full Time">Full Time</SelectItem>
                  <SelectItem value="Part Time">Part Time</SelectItem>
                  <SelectItem value="Remote">Remote</SelectItem>
                  <SelectItem value="Hybrid">Hybrid</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Responsibilities */}
            <div className="col-span-2">
              <Label htmlFor="description" className="text-base">Responsibilities *</Label>
              <textarea
                id="description"
                name="description"
                className="w-full border rounded px-4 py-3 text-base min-h-[120px]"
                value={form.description}
                onChange={handleChange}
                placeholder="Enter job responsibilities"
                required
              />
              <div className="flex justify-between mt-1">
                <span className={`text-sm ${warnings.responsibilities ? 'text-red-500' : 'text-gray-500'}`}>
                  {wordCounts.responsibilities} / {WORD_LIMITS.responsibilities} words
                </span>
                {warnings.responsibilities && (
                  <span className="text-sm text-red-500">
                    Maximum {WORD_LIMITS.responsibilities} words allowed
                  </span>
                )}
              </div>
            </div>

            {/* Benefits Section - Full Width */}
            <div className="md:col-span-2">
              <Label htmlFor="benefits" className="text-base">Benefits *</Label>
              <textarea
                id="benefits"
                name="benefits"
                value={form.benefits}
                onChange={handleChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                placeholder="Enter benefits (one per line)"
                required
              />
              <div className="flex justify-between mt-1">
                <span className={`text-sm ${warnings.benefits ? 'text-red-500' : 'text-gray-500'}`}>
                  {wordCounts.benefits} / {WORD_LIMITS.benefits} words
                </span>
                {warnings.benefits && (
                  <span className="text-sm text-red-500">
                    Maximum {WORD_LIMITS.benefits} words allowed
                  </span>
                )}
              </div>
            </div>

            {/* Salary Section */}
            <div>
              <Label htmlFor="salary" className="text-base">Salary *</Label>
              <Input
                id="salary"
                name="salary"
                value={form.salary}
                onChange={handleChange}
                placeholder="Enter salary range"
                required
                className="w-full h-12 text-base"
              />
            </div>

            {/* Application Deadline */}
            <div>
              <Label htmlFor="applicationDeadline" className="text-base">Application Deadline *</Label>
              <Input
                type="date"
                id="applicationDeadline"
                name="applicationDeadline"
                value={form.applicationDeadline}
                onChange={handleChange}
                required
                className="w-full h-12 text-base"
              />
            </div>

            {/* Company Email (Admin Only) */}
            <div>
              <Label htmlFor="companyEmail" className="text-base">Company Email (Admin Only) *</Label>
              <Input
                id="companyEmail"
                name="companyEmail"
                type="email"
                value={form.companyEmail}
                onChange={handleChange}
                placeholder="Enter company email"
                required
                className="w-full h-12 text-base"
              />
            </div>

            {/* Contact Number (Admin Only) */}
            <div>
              <Label htmlFor="contactNumber" className="text-base">Contact Number (Admin Only) *</Label>
              <Input
                id="contactNumber"
                name="contactNumber"
                value={form.contactNumber}
                onChange={handleChange}
                placeholder="Enter contact number"
                required
                className="w-full h-12 text-base"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              disabled={submitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? 'Creating...' : 'Create Job'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
} 