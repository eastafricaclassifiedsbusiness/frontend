"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { 
  Briefcase, Code, Database, Globe, LineChart, MessageSquare, 
  Palette, Settings, Shield, Truck, Calculator, Sprout, Wheat, 
  Coffee, FlaskConical, Building2, GraduationCap, Zap, Wrench, 
  Stethoscope, Hotel, Users, CircuitBoard, Megaphone, Pickaxe, 
  Fuel, Package, Pill, Box, Printer, ClipboardList, Laptop, 
  TrendingUp, Warehouse, SprayCan, Hammer, Scissors, HardHat, 
  Droplet, Utensils, Car, MoreHorizontal 
} from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"
import { CategoryCardSkeleton } from "@/components/ui/skeleton"
import { Loading } from "@/components/ui/loading"

// Map of category names to their icons
const categoryIcons: { [key: string]: any } = {
  'Accounts': Calculator,
  'Agriculture': Sprout,
  'Agro Commodities': Wheat,
  'Beverages': Coffee,
  'Cement': Building2,
  'Chartered Accountants': Calculator,
  'Chemicals & Lubricants': FlaskConical,
  'Construction': HardHat,
  'Cosmetics': SprayCan,
  'Edible Oils': Droplet,
  'Education': GraduationCap,
  'Electricals': Zap,
  'Engineering': Wrench,
  'Environment Health & Safety': Shield,
  'FMCG': Package,
  'Food Processing': Utensils,
  'General Manager & C-Suite': Briefcase,
  'HEMM & Automotive': Car,
  'Hospitals': Stethoscope,
  'Hotels': Hotel,
  'Human Resources': Users,
  'Information & Communication Technology': Code,
  'Instrumentation & Power Electronics': CircuitBoard,
  'Logistics': Truck,
  'Marketing & Brand Management': Megaphone,
  'Mining': Pickaxe,
  'Oil & Gas': Fuel,
  'Packaging': Package,
  'Pharma & Healthcare': Pill,
  'Plastics': Box,
  'Printing': Printer,
  'Procurement': ClipboardList,
  'Remote Work': Laptop,
  'Sales & Business Development': TrendingUp,
  'SCM & Warehouse Management': Warehouse,
  'Soaps & Detergents': SprayCan,
  'Specialized Fields': Briefcase,
  'Steel': Hammer,
  'Textiles': Scissors,
  'Other': MoreHorizontal
}

// Default icon for categories without a specific icon
const DefaultIcon = Briefcase

interface Category {
  id: string
  name: string
  count: number
}

interface UnlistedSector {
  name: string
  count: number
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [unlistedSectors, setUnlistedSectors] = useState<UnlistedSector[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/categories')
        if (!response.ok) {
          throw new Error('Failed to fetch categories')
        }
        const data = await response.json()
        setCategories(data.categories)
        setUnlistedSectors(data.unlistedSectors || [])
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setLoading(false)
      }
    }

    fetchCategories()
  }, [])

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">Job Categories</h1>
          <p className="text-gray-600 dark:text-gray-300">Loading categories...</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(8)].map((_, index) => (
            <CategoryCardSkeleton key={index} />
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center text-red-500">
          <p>Error: {error}</p>
          <Button 
            variant="outline" 
            className="mt-4"
            onClick={() => window.location.reload()}
          >
            Try Again
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">Job Categories</h1>
        <p className="text-gray-600 dark:text-gray-300">Browse jobs by category to find your perfect match</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {categories.map((category) => {
          const Icon = categoryIcons[category.name] || DefaultIcon
          return (
            <Link 
              key={category.id} 
              href={`/jobs?sector=${encodeURIComponent(category.name)}`}
              className="block"
            >
              <Card className="h-full hover:shadow-lg transition-shadow bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-sky-50 dark:bg-sky-900 rounded-lg">
                      <Icon className="w-6 h-6 text-sky-600 dark:text-sky-300" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-gray-100">{category.name}</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{category.count} jobs</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          )
        })}

        {/* Other Sectors Card */}
        <Link 
          href="/jobs?sector=Other"
          className="block"
        >
          <Card className="h-full hover:shadow-lg transition-shadow bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-sky-50 dark:bg-sky-900 rounded-lg">
                  <MoreHorizontal className="w-6 h-6 text-sky-600 dark:text-sky-300" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100">Other Sectors</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {unlistedSectors.length} unlisted sectors
                  </p>
                </div>
              </div>
              {unlistedSectors.length > 0 && (
                <div className="mt-4 space-y-2">
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-200">Unlisted sectors:</p>
                  <div className="space-y-1">
                    {unlistedSectors.map((sector) => (
                      <div key={sector.name} className="flex justify-between items-center text-sm">
                        <span className="text-gray-600 dark:text-gray-300">{sector.name}</span>
                        <span className="text-gray-500 dark:text-gray-400">{sector.count} jobs</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  )
} 