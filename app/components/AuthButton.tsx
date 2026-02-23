'use client'

import { useUser } from '@clerk/nextjs'
import Link from 'next/link'

interface AuthButtonProps {
  variant?: 'primary' | 'secondary'
  className?: string
}

export function AuthButton({ variant = 'primary', className = '' }: AuthButtonProps) {
  const { isSignedIn, isLoaded } = useUser()

  const baseClasses = variant === 'primary' 
    ? 'rounded-lg bg-white px-6 py-3 text-base font-semibold text-slate-900 shadow-sm hover:bg-slate-100 transition-colors'
    : 'rounded-lg bg-white px-8 py-4 text-base font-semibold text-slate-900 shadow-lg hover:bg-slate-100 transition-colors'

  if (!isLoaded) {
    return (
      <div className={`${baseClasses} ${className} opacity-50 cursor-not-allowed`}>
        Loading...
      </div>
    )
  }

  if (isSignedIn) {
    return (
      <Link
        href="/survey"
        className={`${baseClasses} ${className}`}
      >
        {variant === 'primary' ? 'Go to Dashboard' : 'Start Your Analysis'}
      </Link>
    )
  }

  return (
    <Link
      href="/sign-in"
      className={`${baseClasses} ${className}`}
    >
      {variant === 'primary' ? 'Get Started' : 'Start Your Analysis'}
    </Link>
  )
}

