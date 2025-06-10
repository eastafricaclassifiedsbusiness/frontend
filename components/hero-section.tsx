"use client"

import { Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useState } from "react"
import { useRouter } from "next/navigation"

export function HeroSection() {
  const [search, setSearch] = useState("")
  const [location, setLocation] = useState("")
  const router = useRouter()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const params = new URLSearchParams()
    if (search) params.append("search", search)
    if (location && location !== "all") params.append("location", location)
    router.push(`/jobs?${params.toString()}`)
    setSearch('')
    setLocation('')
  }

  return (
    <section className="relative bg-gradient-to-r from-sky-600 to-sky-700 rounded-xl overflow-hidden">
      <div className="absolute inset-0 bg-black/20"></div>
      <div className="relative pt-12 pb-16 px-6 md:px-10 flex flex-col items-center text-center">
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
          Find Jobs Across East Africa
        </h1>
        <p className="text-white/90 text-lg md:text-xl max-w-3xl mb-8">
          Connect with thousands of employers and job seekers across Kenya, Uganda, Tanzania,
          Rwanda and more.
        </p>

        <form onSubmit={handleSearch} className="w-full max-w-4xl bg-white dark:bg-zinc-900 rounded-lg p-4 shadow-lg">
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="col-span-1 md:col-span-2">
                <Input
                  type="text"
                  placeholder="Job title, keywords, or company"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="bg-white dark:bg-zinc-900"
                />
              </div>
              <Select value={location} onValueChange={setLocation}>
                <SelectTrigger>
                  <SelectValue placeholder="Select location" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="kenya">Kenya</SelectItem>
                  <SelectItem value="uganda">Uganda</SelectItem>
                  <SelectItem value="tanzania">Tanzania</SelectItem>
                  <SelectItem value="rwanda">Rwanda</SelectItem>
                  <SelectItem value="all">All Locations</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button type="submit" className="w-full bg-sky-600 hover:bg-sky-700">
              <Search className="mr-2 h-4 w-4" />
              Search Jobs
            </Button>
          </div>
        </form>
      </div>
    </section>
  )
}
