"use client"

import { useState } from "react"
import Link from "next/link"
import { LoadingLink } from "@/components/loading-link"
import { Button } from "@/components/ui/button"
import { Menu, X } from "lucide-react"

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false)

  const navItems = [
    { href: "/", label: "Home" },
    { href: "/events", label: "Events" },
    { href: "/profiles", label: "Players" },
    { href: "/rankings", label: "Rankings" },
    { href: "/gallery", label: "Gallery" },
    { href: "/highlights", label: "Highlights" },
    { href: "/news", label: "News" },
  ]

  return (
    <nav className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 gap-4">
            <div className="flex items-center flex-shrink-0">
            <Link href="/" className="flex items-center space-x-9">
              <img 
                src="/logo.png" 
                alt="Bhimavaram Tennis Club Logo" 
                className="w-20 h-20 object-contain"
              />
              {/* <span className="font-bold text-2xl lg:text-3xl text-foreground whitespace-nowrap">Bhimavaram Tennis Club</span> */}
            </Link>
            </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-8 flex items-center space-x-6">
              {navItems.map((item) => (
                <LoadingLink
                  key={item.href}
                  href={item.href}
                  className="text-muted-foreground hover:text-foreground px-2 py-2 rounded-md text-sm font-medium transition-colors whitespace-nowrap"
                >
                  {item.label}
                </LoadingLink>
              ))}
            </div>
          </div>

          <div className="hidden md:block flex-shrink-0">
            <LoadingLink href="/admin">
              <Button variant="outline" size="sm">Admin</Button>
            </LoadingLink>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button variant="ghost" size="sm" onClick={() => setIsOpen(!isOpen)}>
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-card border-t border-border">
              {navItems.map((item) => (
                <LoadingLink
                  key={item.href}
                  href={item.href}
                  className="text-muted-foreground hover:text-foreground block px-3 py-2 rounded-md text-base font-medium transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  {item.label}
                </LoadingLink>
              ))}
              <div className="px-3 py-2">
                <LoadingLink href="/admin">
                  <Button className="w-full bg-transparent" variant="outline">
                    Admin Dashboard
                  </Button>
                </LoadingLink>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
