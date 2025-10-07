"use client"

import { useLoading } from "@/lib/loading-context"
import { PageLoading } from "@/components/page-loading"

export function PageLoadingWrapper() {
  const { isLoading } = useLoading()
  
  return <PageLoading isLoading={isLoading} />
}