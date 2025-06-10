"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { useState, useEffect } from "react"
import { Switch } from "@/components/ui/switch"
import { profileService } from "@/services/api"
import { useToast } from "@/components/ui/use-toast"

const profileSchema = z.object({
  // Basic Info
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  phoneNumber: z.string().min(10, { message: "Please enter a valid phone number" }),
  profileSummary: z.string().min(1, { message: "Please enter your profile summary" }),

  // Key Skills & IT Skills
  keySkills: z.array(z.string()).min(1, { message: "Add at least one key skill" }),
  itSkills: z.array(z.object({
    skill: z.string(),
    experienceYears: z.number(),
    lastUsed: z.string(),
  })),

  // Education
  education: z.array(z.object({
    degree: z.string(),
    institution: z.string(),
    year: z.string(),
    specialization: z.string(),
  })),

  // Projects
  projects: z.array(z.object({
    title: z.string(),
    description: z.string(),
    duration: z.string(),
    technologies: z.array(z.string()),
  })),

  // Accomplishments
  accomplishments: z.object({
    onlineProfiles: z.array(z.string()),
    workSamples: z.array(z.string()),
    publications: z.array(z.object({
      title: z.string(),
      publisher: z.string(),
      year: z.string(),
      url: z.string().optional(),
    })),
    patents: z.array(z.object({
      title: z.string(),
      office: z.string(),
      status: z.string(),
      year: z.string(),
    })),
    certificates: z.array(z.object({
      name: z.string(),
      issuer: z.string(),
      year: z.string(),
      url: z.string().optional(),
    })),
  }),

  // Career Profile
  careerProfile: z.object({
    currentIndustry: z.string(),
    department: z.string(),
    desiredJobType: z.string(),
    employmentType: z.string(),
    expectedSalary: z.number(),
    preferredShift: z.string(),
    preferredWorkLocation: z.array(z.string()),
  }),

  // Personal Details
  personalDetails: z.object({
    dateOfBirth: z.string(),
    gender: z.enum(["male", "female", "other"]),
    maritalStatus: z.string(),
    careerBreak: z.object({
      hasBreak: z.boolean(),
      duration: z.string().optional(),
      reason: z.string().optional(),
    }),
    workPermit: z.array(z.string()),
    address: z.object({
      street: z.string(),
      city: z.string(),
      state: z.string(),
      country: z.string(),
      pincode: z.string(),
    }),
    differentlyAbled: z.object({
      isAbled: z.boolean(),
      type: z.string().optional(),
    }),
    languages: z.array(z.object({
      name: z.string(),
      proficiency: z.enum(["beginner", "intermediate", "advanced", "native"]),
      canRead: z.boolean(),
      canWrite: z.boolean(),
      canSpeak: z.boolean(),
    })),
  }),
})

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [activeSection, setActiveSection] = useState("basic")
  const { toast } = useToast()

  const form = useForm<z.infer<typeof profileSchema>>({  
    resolver: zodResolver(profileSchema),
    defaultValues: {
      // Basic Info
      name: "John Doe",
      email: "john@example.com",
      phoneNumber: "+1234567890",
      profileSummary: "A passionate professional with expertise in software development",

      // Key Skills & IT Skills
      keySkills: ["JavaScript", "React", "Node.js"],
      itSkills: [{
        skill: "React",
        experienceYears: 3,
        lastUsed: "2024",
      }],

      // Education
      education: [{
        degree: "Bachelor's Degree",
        institution: "Example University",
        year: "2020",
        specialization: "Computer Science",
      }],

      // Projects
      projects: [{
        title: "Example Project",
        description: "A sample project description",
        duration: "6 months",
        technologies: ["React", "Node.js"],
      }],

      // Accomplishments
      accomplishments: {
        onlineProfiles: ["https://github.com/example"],
        workSamples: ["https://example.com/portfolio"],
        publications: [],
        patents: [],
        certificates: [{
          name: "Example Certification",
          issuer: "Example Institute",
          year: "2023",
          url: "https://example.com/cert",
        }],
      },

      // Career Profile
      careerProfile: {
        currentIndustry: "Information Technology",
        department: "Software Development",
        desiredJobType: "Full-time",
        employmentType: "Permanent",
        expectedSalary: 75000,
        preferredShift: "Day",
        preferredWorkLocation: ["Remote", "On-site"],
      },

      // Personal Details
      personalDetails: {
        dateOfBirth: "1990-01-01",
        gender: "male",
        maritalStatus: "Single",
        careerBreak: {
          hasBreak: false,
        },
        workPermit: ["USA"],
        address: {
          street: "123 Example St",
          city: "New York",
          state: "NY",
          country: "USA",
          pincode: "10001",
        },
        differentlyAbled: {
          isAbled: false,
        },
        languages: [{
          name: "English",
          proficiency: "native",
          canRead: true,
          canWrite: true,
          canSpeak: true,
        }],
      },
    },
  })

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const profile = await profileService.getProfile();
        if (profile) {
          // Update form with profile data
          form.reset({
            name: profile.user.name,
            email: profile.user.email,
            phoneNumber: profile.user.phoneNumber,
            profileSummary: profile.profileSummary,
            keySkills: profile.keySkills,
            itSkills: profile.itSkills,
            education: profile.education,
            projects: profile.projects,
            accomplishments: profile.accomplishments,
            careerProfile: profile.careerProfile,
            personalDetails: {
              ...profile.personalDetails,
              dateOfBirth: profile.user.dateOfBirth,
              gender: profile.user.gender,
            }
          });
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load profile data",
          variant: "destructive",
        });
      }
    };

    fetchProfile();
  }, [form, toast]);

  async function onSubmit(values: z.infer<typeof profileSchema>) {
    setIsLoading(true);
    try {
      await profileService.updateProfile(values);
      toast({
        title: "Success",
        description: "Profile updated successfully",
      });
      setIsEditing(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  const sections = [
    { id: "basic", label: "Basic Information" },
    { id: "skills", label: "Skills" },
    { id: "education", label: "Education" },
    { id: "projects", label: "Projects" },
    { id: "accomplishments", label: "Accomplishments" },
    { id: "career", label: "Career Profile" },
    { id: "personal", label: "Personal Details" },
  ]

  return (
    <div className="container max-w-6xl mx-auto py-10 px-4">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Profile</CardTitle>
              <CardDescription>Manage your professional profile</CardDescription>
            </div>
            <Button
              variant={isEditing ? "outline" : "default"}
              onClick={() => setIsEditing(!isEditing)}
            >
              {isEditing ? "Cancel" : "Edit Profile"}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex gap-6">
            {/* Navigation Sidebar */}
            <div className="w-64 shrink-0">
              <div className="space-y-1">
                {sections.map((section) => (
                  <Button
                    key={section.id}
                    variant={activeSection === section.id ? "default" : "ghost"}
                    className="w-full justify-start"
                    onClick={() => setActiveSection(section.id)}
                  >
                    {section.label}
                  </Button>
                ))}
              </div>
            </div>

            {/* Main Content */}
            <div className="flex-1">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  {/* Basic Information Section */}
                  {activeSection === "basic" && (
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">Basic Information</h3>
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Full Name</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter your full name" {...field} disabled={!isEditing} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <Input type="email" placeholder="Enter your email" {...field} disabled={!isEditing} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="phoneNumber"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Phone Number</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter your phone number" {...field} disabled={!isEditing} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="profileSummary"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Profile Summary</FormLabel>
                            <FormControl>
                              <textarea
                                className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                placeholder="Write a brief summary about yourself"
                                {...field}
                                disabled={!isEditing}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  )}

                  {/* Skills Section */}
                  {activeSection === "skills" && (
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">Skills</h3>
                      <FormField
                        control={form.control}
                        name="keySkills"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Key Skills</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Add skills (comma separated)"
                                {...field}
                                value={field.value?.join(', ')}
                                onChange={(e) => field.onChange(e.target.value.split(',').map(item => item.trim()))}
                                disabled={!isEditing}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <div className="space-y-4">
                        <h4 className="font-medium">IT Skills</h4>
                        {form.watch('itSkills').map((_, index) => (
                          <div key={index} className="grid grid-cols-3 gap-4 p-4 border rounded-lg">
                            <FormField
                              control={form.control}
                              name={`itSkills.${index}.skill`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Skill</FormLabel>
                                  <FormControl>
                                    <Input {...field} disabled={!isEditing} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name={`itSkills.${index}.experienceYears`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Years of Experience</FormLabel>
                                  <FormControl>
                                    <Input type="number" {...field} disabled={!isEditing} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name={`itSkills.${index}.lastUsed`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Last Used</FormLabel>
                                  <FormControl>
                                    <Input type="number" {...field} disabled={!isEditing} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                        ))}
                        {isEditing && (
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => {
                              const currentSkills = form.getValues('itSkills');
                              form.setValue('itSkills', [
                                ...currentSkills,
                                { skill: '', experienceYears: 0, lastUsed: '' }
                              ]);
                            }}
                          >
                            Add IT Skill
                          </Button>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Education Section */}
                  {activeSection === "education" && (
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">Education</h3>
                      {form.watch('education').map((_, index) => (
                        <div key={index} className="grid grid-cols-2 gap-4 p-4 border rounded-lg">
                          <FormField
                            control={form.control}
                            name={`education.${index}.degree`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Degree</FormLabel>
                                <FormControl>
                                  <Input {...field} disabled={!isEditing} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name={`education.${index}.institution`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Institution</FormLabel>
                                <FormControl>
                                  <Input {...field} disabled={!isEditing} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name={`education.${index}.year`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Year</FormLabel>
                                <FormControl>
                                  <Input {...field} disabled={!isEditing} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name={`education.${index}.specialization`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Specialization</FormLabel>
                                <FormControl>
                                  <Input {...field} disabled={!isEditing} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      ))}
                      {isEditing && (
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => {
                            const currentEducation = form.getValues('education');
                            form.setValue('education', [
                              ...currentEducation,
                              { degree: '', institution: '', year: '', specialization: '' }
                            ]);
                          }}
                        >
                          Add Education
                        </Button>
                      )}
                    </div>
                  )}

                  {/* Projects Section */}
                  {activeSection === "projects" && (
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">Projects</h3>
                      {form.watch('projects').map((_, index) => (
                        <div key={index} className="space-y-4 p-4 border rounded-lg">
                          <FormField
                            control={form.control}
                            name={`projects.${index}.title`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Project Title</FormLabel>
                                <FormControl>
                                  <Input {...field} disabled={!isEditing} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name={`projects.${index}.description`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Description</FormLabel>
                                <FormControl>
                                  <textarea
                                    className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                    {...field}
                                    disabled={!isEditing}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <div className="grid grid-cols-2 gap-4">
                            <FormField
                              control={form.control}
                              name={`projects.${index}.duration`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Duration</FormLabel>
                                  <FormControl>
                                    <Input {...field} disabled={!isEditing} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name={`projects.${index}.technologies`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Technologies</FormLabel>
                                  <FormControl>
                                    <Input
                                      {...field}
                                      value={field.value?.join(', ')}
                                      onChange={(e) => field.onChange(e.target.value.split(',').map(item => item.trim()))}
                                      disabled={!isEditing}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                        </div>
                      ))}
                      {isEditing && (
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => {
                            const currentProjects = form.getValues('projects');
                            form.setValue('projects', [
                              ...currentProjects,
                              { title: '', description: '', duration: '', technologies: [] }
                            ]);
                          }}
                        >
                          Add Project
                        </Button>
                      )}
                    </div>
                  )}

                  {/* Accomplishments Section */}
                  {activeSection === "accomplishments" && (
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">Accomplishments</h3>

                      {/* Online Profiles */}
                      <FormField
                        control={form.control}
                        name="accomplishments.onlineProfiles"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Online Profiles</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Add URLs (comma separated)"
                                {...field}
                                value={field.value?.join(', ')}
                                onChange={(e) => field.onChange(e.target.value.split(',').map(item => item.trim()))}
                                disabled={!isEditing}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {/* Work Samples */}
                      <FormField
                        control={form.control}
                        name="accomplishments.workSamples"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Work Samples</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Add URLs (comma separated)"
                                {...field}
                                value={field.value?.join(', ')}
                                onChange={(e) => field.onChange(e.target.value.split(',').map(item => item.trim()))}
                                disabled={!isEditing}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {/* Publications */}
                      <div className="space-y-4">
                        <h4 className="font-medium">Publications</h4>
                        {form.watch('accomplishments.publications').map((_, index) => (
                          <div key={index} className="grid grid-cols-4 gap-4 p-4 border rounded-lg">
                            <FormField
                              control={form.control}
                              name={`accomplishments.publications.${index}.title`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Title</FormLabel>
                                  <FormControl>
                                    <Input {...field} disabled={!isEditing} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name={`accomplishments.publications.${index}.publisher`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Publisher</FormLabel>
                                  <FormControl>
                                    <Input {...field} disabled={!isEditing} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name={`accomplishments.publications.${index}.year`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Year</FormLabel>
                                  <FormControl>
                                    <Input {...field} disabled={!isEditing} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name={`accomplishments.publications.${index}.url`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>URL</FormLabel>
                                  <FormControl>
                                    <Input {...field} disabled={!isEditing} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                        ))}
                        {isEditing && (
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => {
                              const current = form.getValues('accomplishments.publications');
                              form.setValue('accomplishments.publications', [...current, { title: '', publisher: '', year: '', url: '' }]);
                            }}
                          >
                            Add Publication
                          </Button>
                        )}
                      </div>

                      {/* Patents */}
                      <div className="space-y-4">
                        <h4 className="font-medium">Patents</h4>
                        {form.watch('accomplishments.patents').map((_, index) => (
                          <div key={index} className="grid grid-cols-4 gap-4 p-4 border rounded-lg">
                            <FormField
                              control={form.control}
                              name={`accomplishments.patents.${index}.title`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Title</FormLabel>
                                  <FormControl>
                                    <Input {...field} disabled={!isEditing} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name={`accomplishments.patents.${index}.office`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Office</FormLabel>
                                  <FormControl>
                                    <Input {...field} disabled={!isEditing} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name={`accomplishments.patents.${index}.status`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Status</FormLabel>
                                  <FormControl>
                                    <Input {...field} disabled={!isEditing} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name={`accomplishments.patents.${index}.year`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Year</FormLabel>
                                  <FormControl>
                                    <Input {...field} disabled={!isEditing} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                        ))}
                        {isEditing && (
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => {
                              const current = form.getValues('accomplishments.patents');
                              form.setValue('accomplishments.patents', [...current, { title: '', office: '', status: '', year: '' }]);
                            }}
                          >
                            Add Patent
                          </Button>
                        )}
                      </div>

                      {/* Certificates */}
                      <div className="space-y-4">
                        <h4 className="font-medium">Certificates</h4>
                        {form.watch('accomplishments.certificates').map((_, index) => (
                          <div key={index} className="grid grid-cols-4 gap-4 p-4 border rounded-lg">
                            <FormField
                              control={form.control}
                              name={`accomplishments.certificates.${index}.name`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Name</FormLabel>
                                  <FormControl>
                                    <Input {...field} disabled={!isEditing} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name={`accomplishments.certificates.${index}.issuer`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Issuer</FormLabel>
                                  <FormControl>
                                    <Input {...field} disabled={!isEditing} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name={`accomplishments.certificates.${index}.year`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Year</FormLabel>
                                  <FormControl>
                                    <Input {...field} disabled={!isEditing} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name={`accomplishments.certificates.${index}.url`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>URL</FormLabel>
                                  <FormControl>
                                    <Input {...field} disabled={!isEditing} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                        ))}
                        {isEditing && (
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => {
                              const current = form.getValues('accomplishments.certificates');
                              form.setValue('accomplishments.certificates', [...current, { name: '', issuer: '', year: '', url: '' }]);
                            }}
                          >
                            Add Certificate
                          </Button>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Career Profile Section */}
                  {activeSection === "career" && (
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">Career Profile</h3>
                      <FormField
                        control={form.control}
                        name="careerProfile.currentIndustry"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Current Industry</FormLabel>
                            <Select
                              disabled={!isEditing}
                              onValueChange={field.onChange}
                              value={field.value}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select industry" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="it">Information Technology</SelectItem>
                                <SelectItem value="finance">Finance</SelectItem>
                                <SelectItem value="healthcare">Healthcare</SelectItem>
                                <SelectItem value="education">Education</SelectItem>
                                <SelectItem value="manufacturing">Manufacturing</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="careerProfile.expectedSalary"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Expected Salary</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                placeholder="Enter expected salary"
                                {...field}
                                onChange={(e) => field.onChange(Number(e.target.value))}
                                disabled={!isEditing}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="careerProfile.preferredShift"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Preferred Shift</FormLabel>
                            <Select
                              disabled={!isEditing}
                              onValueChange={field.onChange}
                              value={field.value}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select shift" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="day">Day</SelectItem>
                                <SelectItem value="night">Night</SelectItem>
                                <SelectItem value="flexible">Flexible</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  )}

                  {/* Personal Details Section */}
                  {activeSection === "personal" && (
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">Personal Details</h3>
                      <FormField
                        control={form.control}
                        name="personalDetails.dateOfBirth"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Date of Birth</FormLabel>
                            <FormControl>
                              <Input type="date" {...field} disabled={!isEditing} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="personalDetails.gender"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Gender</FormLabel>
                            <Select
                              disabled={!isEditing}
                              onValueChange={field.onChange}
                              value={field.value}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select gender" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="male">Male</SelectItem>
                                <SelectItem value="female">Female</SelectItem>
                                <SelectItem value="other">Other</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="personalDetails.maritalStatus"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Marital Status</FormLabel>
                            <Select
                              disabled={!isEditing}
                              onValueChange={field.onChange}
                              value={field.value}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select marital status" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="single">Single</SelectItem>
                                <SelectItem value="married">Married</SelectItem>
                                <SelectItem value="divorced">Divorced</SelectItem>
                                <SelectItem value="widowed">Widowed</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <div className="space-y-4">
                        <h4 className="font-medium">Address</h4>
                        <div className="grid grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name="personalDetails.address.street"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Street</FormLabel>
                                <FormControl>
                                  <Input {...field} disabled={!isEditing} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="personalDetails.address.city"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>City</FormLabel>
                                <FormControl>
                                  <Input {...field} disabled={!isEditing} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="personalDetails.address.state"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>State</FormLabel>
                                <FormControl>
                                  <Input {...field} disabled={!isEditing} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="personalDetails.address.country"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Country</FormLabel>
                                <FormControl>
                                  <Input {...field} disabled={!isEditing} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="personalDetails.address.pincode"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Pincode</FormLabel>
                                <FormControl>
                                  <Input {...field} disabled={!isEditing} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {isEditing && (
                    <div className="flex gap-4">
                      <Button type="submit" className="flex-1" disabled={isLoading}>
                        {isLoading ? "Saving..." : "Save Changes"}
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        className="flex-1"
                        onClick={() => setIsEditing(false)}
                      >
                        Cancel
                      </Button>
                    </div>
                  )}
                </form>
              </Form>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
