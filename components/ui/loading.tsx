"use client"

import { cn } from "@/lib/utils"
import { Loader2 } from "lucide-react"

interface LoadingProps {
  variant?: "default" | "spinner" | "dots"
  size?: "sm" | "md" | "lg"
  className?: string
}

export function Loading({ variant = "default", size = "md", className }: LoadingProps) {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-8 w-8",
    lg: "h-12 w-12"
  }

  if (variant === "spinner") {
    return (
      <div className={cn("flex items-center justify-center", className)}>
        <Loader2 className={cn("animate-spin text-sky-600", sizeClasses[size])} />
      </div>
    )
  }

  if (variant === "dots") {
    return (
      <div className={cn("flex items-center justify-center gap-2", className)}>
        <div className={cn("animate-bounce [animation-delay:-0.3s] bg-sky-600 rounded-full", sizeClasses[size])} />
        <div className={cn("animate-bounce [animation-delay:-0.15s] bg-sky-600 rounded-full", sizeClasses[size])} />
        <div className={cn("animate-bounce bg-sky-600 rounded-full", sizeClasses[size])} />
      </div>
    )
  }

  return (
    <div className={cn("flex items-center justify-center", className)}>
      <div className={cn("animate-spin rounded-full border-4 border-sky-200 border-t-sky-600", sizeClasses[size])} />
    </div>
  )
} 