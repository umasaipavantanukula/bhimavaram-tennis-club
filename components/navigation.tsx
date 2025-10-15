"use client"

import { useState } from "react"
import Link from "next/link"
import { LoadingLink } from "@/components/loading-link"
import { Button } from "@/components/ui/button"
import { Menu, X, Smartphone, QrCode, MonitorSpeaker, ExternalLink } from "lucide-react"
import { usePiP } from "@/lib/pip-context"

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false)
  const [isAppDropdownOpen, setIsAppDropdownOpen] = useState(false)
  const { togglePiP, isOpen: isPiPOpen } = usePiP()

  const openStandaloneScores = () => {
    window.open('/live-scores', 'liveScores', 'width=400,height=600,scrollbars=no,resizable=yes,status=no,location=no,toolbar=no,menubar=no')
  }

  const navItems = [
    { href: "/", label: "Home" },
    { href: "/tournaments", label: "Matches" },
    { href: "/profiles", label: "Players" },
    { href: "/rankings", label: "Rankings" },
    { href: "/gallery", label: "Gallery" },
    { href: "/highlights", label: "Highlights" },
  ]

  return (
    <nav className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 gap-4">
          <div className="flex items-center flex-shrink-0">
            <Link href="/" className="flex items-center space-x-9">
              <img src="/logo.png" alt="Bhimavaram Tennis Club Logo" className="w-20 h-20 object-contain" />
            </Link>
          </div>
          <div className="hidden md:block">
            <div className="ml-8 flex items-center space-x-6">
              {navItems.map((item) => (
                <LoadingLink key={item.href} href={item.href} className="text-muted-foreground hover:text-foreground px-2 py-2 rounded-md text-sm font-medium transition-colors whitespace-nowrap">
                  {item.label}
                </LoadingLink>
              ))}
            </div>
          </div>
          <div className="hidden md:block flex-shrink-0 flex items-center space-x-3">
            <LoadingLink href="/admin">
              <Button variant="outline" size="sm">Admin</Button>
            </LoadingLink>
          </div>
          <div className="md:hidden">
            <Button variant="ghost" size="sm" onClick={() => setIsOpen(!isOpen)}>
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>
      </div>
    </nav>
  )
}
