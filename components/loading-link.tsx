"use client"

import Link from "next/link"
import { useLoading } from "@/lib/loading-context"
import { ReactNode } from "react"

interface LoadingLinkProps {
  href: string
  children: ReactNode
  className?: string
  onClick?: () => void
}

export function LoadingLink({ href, children, className, onClick }: LoadingLinkProps) {
  const { startLoading } = useLoading()

  const handleClick = () => {
    startLoading()
    if (onClick) onClick()
  }

  return (
    <Link href={href} className={className} onClick={handleClick}>
      {children}
    </Link>
  )
}