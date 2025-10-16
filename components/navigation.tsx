"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { LoadingLink } from "@/components/loading-link"
import { Button } from "@/components/ui/button"
import { Menu, X, Smartphone, QrCode, MonitorSpeaker, ExternalLink, Home, Trophy, Users, Award, Image, Zap } from "lucide-react"
import { usePiP } from "@/lib/pip-context"

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false)
  const [isAppDropdownOpen, setIsAppDropdownOpen] = useState(false)
  const { togglePiP, isOpen: isPiPOpen } = usePiP()

  const openStandaloneScores = () => {
    window.open('/live-scores', 'liveScores', 'width=400,height=600,scrollbars=no,resizable=yes,status=no,location=no,toolbar=no,menubar=no')
  }

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement
      if (isOpen && !target.closest('.mobile-menu') && !target.closest('.hamburger-button')) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('click', handleClickOutside)
    }

    return () => {
      document.removeEventListener('click', handleClickOutside)
    }
  }, [isOpen])

  // Close mobile menu on route change
  useEffect(() => {
    setIsOpen(false)
  }, [])

  const navItems = [
    { href: "/", label: "Home", icon: Home },
    { href: "/tournaments", label: "Matches", icon: Trophy },
    { href: "/profiles", label: "Players", icon: Users },
    { href: "/rankings", label: "Rankings", icon: Award },
    { href: "/gallery", label: "Gallery", icon: Image },
    { href: "/highlights", label: "Highlights", icon: Zap },
  ]

  return (
    <nav className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 gap-4">
          {/* Logo */}
          <div className="flex items-center flex-shrink-0">
            <Link href="/" className="flex items-center space-x-2">
              <img src="/logo.png" alt="Bhimavaram Tennis Club Logo" className="w-16 h-16 md:w-20 md:h-20 object-contain" />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-8 flex items-center space-x-6">
              {navItems.map((item) => (
                <LoadingLink key={item.href} href={item.href} className="text-muted-foreground hover:text-foreground px-2 py-2 rounded-md text-sm font-medium transition-colors whitespace-nowrap">
                  {item.label}
                </LoadingLink>
              ))}
            </div>
          </div>

          {/* Desktop Admin Button */}
          <div className="hidden md:block flex-shrink-0 flex items-center space-x-3">
            <LoadingLink href="/admin">
              <Button variant="outline" size="sm">Admin</Button>
            </LoadingLink>
          </div>

          {/* Hamburger Menu Button */}
          <div className="md:hidden hamburger-button">
            <Button variant="ghost" size="sm" onClick={() => setIsOpen(!isOpen)}>
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      <div 
        className={`md:hidden mobile-menu transition-all duration-300 ease-in-out overflow-hidden ${
          isOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="px-4 pt-2 pb-4 space-y-2 bg-background/98 backdrop-blur-lg border-t border-border shadow-lg">
          {navItems.map((item) => {
            const Icon = item.icon
            return (
              <LoadingLink 
                key={item.href} 
                href={item.href}
                onClick={() => setIsOpen(false)}
                className="flex items-center space-x-3 text-muted-foreground hover:text-foreground hover:bg-accent px-4 py-3 rounded-lg text-base font-medium transition-all duration-200 group"
              >
                <Icon className="h-5 w-5 group-hover:scale-110 transition-transform" />
                <span>{item.label}</span>
              </LoadingLink>
            )
          })}
          
          {/* Mobile Admin Button */}
          <div className="pt-3 mt-3 border-t border-border">
            <LoadingLink href="/admin" onClick={() => setIsOpen(false)}>
              <Button variant="outline" className="w-full justify-start space-x-3" size="lg">
                <MonitorSpeaker className="h-5 w-5" />
                <span>Admin Dashboard</span>
              </Button>
            </LoadingLink>
          </div>
        </div>
      </div>
    </nav>
  )
}
