"use client"

import { useRouter, usePathname } from 'next/navigation'
import { useLoading } from '@/lib/loading-context'
import { useEffect } from 'react'

export function NavigationHandler({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const { startLoading, stopLoading } = useLoading()

  useEffect(() => {
    // Stop loading when route changes (page has loaded)
    stopLoading()
  }, [pathname, stopLoading])

  useEffect(() => {
    // Override the default router push to include loading state
    const originalPush = router.push
    router.push = (href: string, options?: any) => {
      startLoading()
      return originalPush(href, options)
    }

    const originalReplace = router.replace
    router.replace = (href: string, options?: any) => {
      startLoading()
      return originalReplace(href, options)
    }

    // Handle browser back/forward buttons
    const handleStart = () => startLoading()
    const handleComplete = () => stopLoading()

    window.addEventListener('beforeunload', handleStart)
    window.addEventListener('popstate', handleComplete)

    return () => {
      window.removeEventListener('beforeunload', handleStart)
      window.removeEventListener('popstate', handleComplete)
    }
  }, [router, startLoading, stopLoading])

  return <>{children}</>
}