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
    // Open in a new window with specific dimensions for a better PiP-like experience
    window.open(
      '/live-scores',
      'liveScores',
      'width=400,height=600,scrollbars=no,resizable=yes,status=no,location=no,toolbar=no,menubar=no'
    )
  }

  const navItems = [
    { href: "/", label: "Home" },
    // { href: "/events", label: "Events" },
    { href: "/profiles", label: "Players" },
    { href: "/rankings", label: "Rankings" },
    { href: "/gallery", label: "Gallery" },
    { href: "/highlights", label: "Highlights" },
    // { href: "/news", label: "News" },
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
              
              {/* Get the App Dropdown */}
              <div 
                className="relative"
                onMouseEnter={() => setIsAppDropdownOpen(true)}
                onMouseLeave={() => setIsAppDropdownOpen(false)}
              >
                <button className="text-muted-foreground hover:text-foreground px-2 py-2 rounded-md text-sm font-medium transition-colors whitespace-nowrap flex items-center gap-2">
                  <Smartphone className="h-4 w-4" />
                  Get the App
                </button>
                
                {/* Dropdown Content */}
                {isAppDropdownOpen && (
                  <div className="absolute right-0 top-full mt-2 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 p-6 z-50">
                    <div className="text-center space-y-4">
                      {/* Header */}
                      <div className="flex items-center justify-center gap-3 mb-4">
                        <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
                          <QrCode className="h-6 w-6 text-gray-600 dark:text-gray-300" />
                        </div>
                        <div className="text-left">
                          <h3 className="font-semibold text-gray-900 dark:text-white">Scan QR to Download</h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400">Get our mobile app</p>
                        </div>
                      </div>
                      
                      {/* QR Code */}
                      <div className="flex justify-center mb-4">
                        <div className="p-4 bg-white rounded-lg border-2 border-gray-100">
                          <img 
                            src="/URL QR Code.svg" 
                            alt="Download App QR Code"
                            className="w-32 h-32"
                          />
                        </div>
                      </div>
                      
                      {/* Instructions */}
                      <div className="space-y-2 text-xs text-gray-600 dark:text-gray-400">
                        <div className="flex items-center gap-2 justify-start">
                          <div className="w-4 h-4 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center text-xs font-bold">1</div>
                          <span>Open camera on your phone</span>
                        </div>
                        <div className="flex items-center gap-2 justify-start">
                          <div className="w-4 h-4 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center text-xs font-bold">2</div>
                          <span>Point at QR code</span>
                        </div>
                        <div className="flex items-center gap-2 justify-start">
                          <div className="w-4 h-4 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center text-xs font-bold">3</div>
                          <span>Tap the link to download</span>
                        </div>
                      </div>
                      
                      {/* Get the App Button */}
                      <Button className="w-full bg-primary hover:bg-primary/90 text-white mt-4">
                        <Smartphone className="h-4 w-4 mr-2" />
                        Get the App
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="hidden md:block flex-shrink-0 flex items-center space-x-3">
            {/* Live Scores Options */}
            <div className="flex items-center gap-1">
              <Button
                variant={isPiPOpen ? "default" : "outline"}
                size="sm"
                onClick={togglePiP}
                className="flex items-center gap-2"
              >
                <MonitorSpeaker className="h-4 w-4" />
                Live Scores
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={openStandaloneScores}
                className="flex items-center gap-1 px-2"
                title="Open in separate window"
              >
                <ExternalLink className="h-3 w-3" />
              </Button>
            </div>
            
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
              
              {/* Mobile Get the App Section */}
              <div className="px-3 py-4 border-t border-border mt-4">
                <h4 className="font-semibold text-sm text-foreground mb-3 flex items-center gap-2">
                  <Smartphone className="h-4 w-4" />
                  Get the App
                </h4>
                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 text-center">
                  <div className="flex justify-center mb-3">
                    <div className="p-2 bg-white rounded-lg border">
                      <img 
                        src="/URL QR Code.svg" 
                        alt="Download App QR Code"
                        className="w-24 h-24"
                      />
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground mb-3">Scan QR to Download</p>
                  <Button size="sm" className="w-full">
                    <Smartphone className="h-4 w-4 mr-2" />
                    Get the App
                  </Button>
                </div>
              </div>
              
              <div className="px-3 py-2 space-y-2">
                {/* Mobile Live Scores Options */}
                <div className="space-y-2">
                  <Button
                    variant={isPiPOpen ? "default" : "outline"}
                    size="sm"
                    onClick={togglePiP}
                    className="w-full flex items-center gap-2"
                  >
                    <MonitorSpeaker className="h-4 w-4" />
                    {isPiPOpen ? 'Hide Live Scores' : 'Show Live Scores'}
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={openStandaloneScores}
                    className="w-full flex items-center gap-2"
                  >
                    <ExternalLink className="h-4 w-4" />
                    Open in New Window
                  </Button>
                </div>
                
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
