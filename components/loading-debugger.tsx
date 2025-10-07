"use client"

import { useLoading } from "@/lib/loading-context"

export function LoadingDebugger() {
  const { isLoading } = useLoading()
  
  if (process.env.NODE_ENV !== 'development') return null
  
  return (
    <div className="fixed bottom-4 right-4 bg-black/80 text-white px-4 py-2 rounded-lg text-sm z-50">
      Loading State: {isLoading ? "🟢 TRUE" : "🔴 FALSE"}
    </div>
  )
}