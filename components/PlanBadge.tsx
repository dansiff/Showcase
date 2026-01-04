"use client"

import { Star, Crown } from 'lucide-react'
import { cn } from '@/lib/utils'

interface PlanBadgeProps {
  plan: 'STANDARD' | 'PRO'
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export default function PlanBadge({ plan, size = 'md', className }: PlanBadgeProps) {
  const isPro = plan === 'PRO'

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-3 py-1',
    lg: 'text-base px-4 py-1.5',
  }

  const iconSize = {
    sm: 'h-3 w-3',
    md: 'h-4 w-4',
    lg: 'h-5 w-5',
  }

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full font-semibold',
        isPro
          ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
          : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300',
        sizeClasses[size],
        className
      )}
    >
      {isPro ? (
        <Crown className={iconSize[size]} />
      ) : (
        <Star className={iconSize[size]} />
      )}
      {isPro ? 'Pro' : 'Free'}
    </span>
  )
}
