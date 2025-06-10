"use client"

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
import api from "@/services/api"
import { toast } from "react-hot-toast"

// Map of category names to their icons and colors
const categoryStyles: { [key: string]: { icon: any, bgColor: string, textColor: string } } = {
  'Accounts': { 
    icon: Calculator, 
    bgColor: 'bg-blue-100 dark:bg-blue-950', 
    textColor: 'text-blue-600 dark:text-blue-400' 
  },
  'Agriculture': { 
    icon: Sprout, 
    bgColor: 'bg-green-100 dark:bg-green-950', 
    textColor: 'text-green-600 dark:text-green-400' 
  },
  'Agro Commodities': { 
    icon: Wheat, 
    bgColor: 'bg-amber-100 dark:bg-amber-950', 
    textColor: 'text-amber-600 dark:text-amber-400' 
  },
  'Beverages': { 
    icon: Coffee, 
    bgColor: 'bg-orange-100 dark:bg-orange-950', 
    textColor: 'text-orange-600 dark:text-orange-400' 
  },
  'Cement': { 
    icon: Building2, 
    bgColor: 'bg-gray-100 dark:bg-gray-950', 
    textColor: 'text-gray-600 dark:text-gray-400' 
  },
  'Chartered Accountants': { 
    icon: Calculator, 
    bgColor: 'bg-indigo-100 dark:bg-indigo-950', 
    textColor: 'text-indigo-600 dark:text-indigo-400' 
  },
  'Chemicals & Lubricants': { 
    icon: FlaskConical, 
    bgColor: 'bg-purple-100 dark:bg-purple-950', 
    textColor: 'text-purple-600 dark:text-purple-400' 
  },
  'Construction': { 
    icon: HardHat, 
    bgColor: 'bg-red-100 dark:bg-red-950', 
    textColor: 'text-red-600 dark:text-red-400' 
  },
  'Cosmetics': { 
    icon: SprayCan, 
    bgColor: 'bg-pink-100 dark:bg-pink-950', 
    textColor: 'text-pink-600 dark:text-pink-400' 
  },
  'Edible Oils': { 
    icon: Droplet, 
    bgColor: 'bg-yellow-100 dark:bg-yellow-950', 
    textColor: 'text-yellow-600 dark:text-yellow-400' 
  },
  'Education': { 
    icon: GraduationCap, 
    bgColor: 'bg-teal-100 dark:bg-teal-950', 
    textColor: 'text-teal-600 dark:text-teal-400' 
  },
  'Electricals': { 
    icon: Zap, 
    bgColor: 'bg-cyan-100 dark:bg-cyan-950', 
    textColor: 'text-cyan-600 dark:text-cyan-400' 
  },
  'Engineering': { 
    icon: Wrench, 
    bgColor: 'bg-sky-100 dark:bg-sky-950', 
    textColor: 'text-sky-600 dark:text-sky-400' 
  },
  'Environment Health & Safety': { 
    icon: Shield, 
    bgColor: 'bg-emerald-100 dark:bg-emerald-950', 
    textColor: 'text-emerald-600 dark:text-emerald-400' 
  },
  'FMCG': { 
    icon: Package, 
    bgColor: 'bg-violet-100 dark:bg-violet-950', 
    textColor: 'text-violet-600 dark:text-violet-400' 
  },
  'Food Processing': { 
    icon: Utensils, 
    bgColor: 'bg-rose-100 dark:bg-rose-950', 
    textColor: 'text-rose-600 dark:text-rose-400' 
  },
  'General Manager & C-Suite': { 
    icon: Briefcase, 
    bgColor: 'bg-blue-100 dark:bg-blue-950', 
    textColor: 'text-blue-600 dark:text-blue-400' 
  },
  'HEMM & Automotive': { 
    icon: Car, 
    bgColor: 'bg-slate-100 dark:bg-slate-950', 
    textColor: 'text-slate-600 dark:text-slate-400' 
  },
  'Hospitals': { 
    icon: Stethoscope, 
    bgColor: 'bg-red-100 dark:bg-red-950', 
    textColor: 'text-red-600 dark:text-red-400' 
  },
  'Hotels': { 
    icon: Hotel, 
    bgColor: 'bg-amber-100 dark:bg-amber-950', 
    textColor: 'text-amber-600 dark:text-amber-400' 
  },
  'Human Resources': { 
    icon: Users, 
    bgColor: 'bg-indigo-100 dark:bg-indigo-950', 
    textColor: 'text-indigo-600 dark:text-indigo-400' 
  },
  'Information & Communication Technology': { 
    icon: Code, 
    bgColor: 'bg-blue-100 dark:bg-blue-950', 
    textColor: 'text-blue-600 dark:text-blue-400' 
  },
  'Instrumentation & Power Electronics': { 
    icon: CircuitBoard, 
    bgColor: 'bg-purple-100 dark:bg-purple-950', 
    textColor: 'text-purple-600 dark:text-purple-400' 
  },
  'Logistics': { 
    icon: Truck, 
    bgColor: 'bg-orange-100 dark:bg-orange-950', 
    textColor: 'text-orange-600 dark:text-orange-400' 
  },
  'Marketing & Brand Management': { 
    icon: Megaphone, 
    bgColor: 'bg-pink-100 dark:bg-pink-950', 
    textColor: 'text-pink-600 dark:text-pink-400' 
  },
  'Mining': { 
    icon: Pickaxe, 
    bgColor: 'bg-gray-100 dark:bg-gray-950', 
    textColor: 'text-gray-600 dark:text-gray-400' 
  },
  'Oil & Gas': { 
    icon: Fuel, 
    bgColor: 'bg-black-100 dark:bg-black-950', 
    textColor: 'text-black-600 dark:text-black-400' 
  },
  'Packaging': { 
    icon: Package, 
    bgColor: 'bg-green-100 dark:bg-green-950', 
    textColor: 'text-green-600 dark:text-green-400' 
  },
  'Pharma & Healthcare': { 
    icon: Pill, 
    bgColor: 'bg-red-100 dark:bg-red-950', 
    textColor: 'text-red-600 dark:text-red-400' 
  },
  'Plastics': { 
    icon: Box, 
    bgColor: 'bg-blue-100 dark:bg-blue-950', 
    textColor: 'text-blue-600 dark:text-blue-400' 
  },
  'Printing': { 
    icon: Printer, 
    bgColor: 'bg-gray-100 dark:bg-gray-950', 
    textColor: 'text-gray-600 dark:text-gray-400' 
  },
  'Procurement': { 
    icon: ClipboardList, 
    bgColor: 'bg-indigo-100 dark:bg-indigo-950', 
    textColor: 'text-indigo-600 dark:text-indigo-400' 
  },
  'Remote Work': { 
    icon: Laptop, 
    bgColor: 'bg-sky-100 dark:bg-sky-950', 
    textColor: 'text-sky-600 dark:text-sky-400' 
  },
  'Sales & Business Development': { 
    icon: TrendingUp, 
    bgColor: 'bg-green-100 dark:bg-green-950', 
    textColor: 'text-green-600 dark:text-green-400' 
  },
  'SCM & Warehouse Management': { 
    icon: Warehouse, 
    bgColor: 'bg-blue-100 dark:bg-blue-950', 
    textColor: 'text-blue-600 dark:text-blue-400' 
  },
  'Soaps & Detergents': { 
    icon: SprayCan, 
    bgColor: 'bg-pink-100 dark:bg-pink-950', 
    textColor: 'text-pink-600 dark:text-pink-400' 
  },
  'Specialized Fields': { 
    icon: Briefcase, 
    bgColor: 'bg-purple-100 dark:bg-purple-950', 
    textColor: 'text-purple-600 dark:text-purple-400' 
  },
  'Steel': { 
    icon: Hammer, 
    bgColor: 'bg-gray-100 dark:bg-gray-950', 
    textColor: 'text-gray-600 dark:text-gray-400' 
  },
  'Textiles': { 
    icon: Scissors, 
    bgColor: 'bg-pink-100 dark:bg-pink-950', 
    textColor: 'text-pink-600 dark:text-pink-400' 
  },
  'Other': { 
    icon: MoreHorizontal, 
    bgColor: 'bg-gray-100 dark:bg-gray-950', 
    textColor: 'text-gray-600 dark:text-gray-400' 
  }
}

// Default style for categories without a specific style
const defaultStyle = {
  icon: Briefcase,
  bgColor: 'bg-sky-100 dark:bg-sky-950',
  textColor: 'text-sky-600 dark:text-sky-400'
}

interface Category {
  id: string
  name: string
  count: number
}

export function FeaturedCategories() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await api.get('/categories')
        setCategories(data.categories?.slice(0, 8) || [])
      } catch (error) {
        console.error('Failed to fetch categories:', error)
        // Use default categories if API fails
        setCategories([
          { id: '1', name: 'Information & Communication Technology', count: 0 },
          { id: '2', name: 'Engineering', count: 0 },
          { id: '3', name: 'Sales & Business Development', count: 0 },
          { id: '4', name: 'Human Resources', count: 0 },
          { id: '5', name: 'Marketing & Brand Management', count: 0 },
          { id: '6', name: 'Finance', count: 0 },
          { id: '7', name: 'Healthcare', count: 0 },
          { id: '8', name: 'Education', count: 0 }
        ])
      } finally {
        setLoading(false)
      }
    }

    fetchCategories()
  }, [])

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {[...Array(8)].map((_, i) => (
          <CategoryCardSkeleton key={i} />
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {categories.map((category) => {
        const style = categoryStyles[category.name] || defaultStyle
        const Icon = style.icon

        return (
          <Link
            key={category.id}
            href={`/jobs?category=${encodeURIComponent(category.name)}`}
            className={`group relative overflow-hidden rounded-lg p-6 ${style.bgColor} transition-all hover:shadow-lg`}
          >
            <div className="flex items-center space-x-4">
              <div className={`rounded-lg p-2 ${style.textColor}`}>
                <Icon className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900 dark:text-gray-100">
                  {category.name}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {category.count} jobs
                </p>
              </div>
            </div>
          </Link>
        )
      })}
    </div>
  )
}
