"use client"

import { useEffect, useState } from "react"
import { matchOperations, type Match } from "@/lib/firebase-operations"
import { getCurrentOrRecentMatches, formatDate } from "@/lib/date-utils"

interface ImagePiPProps {
  isOpen: boolean
  onClose: () => void
}

// Compact, professional PiP-style score card that mimics the attached design.
export function ImagePiPScores({ isOpen, onClose }: ImagePiPProps) {
  const [match, setMatch] = useState<Match | null>(null)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)

  useEffect(() => {
    if (!isOpen) return

    let mounted = true

    const load = async () => {
      try {
        const matches = await matchOperations.getAll()
        const filtered = getCurrentOrRecentMatches(matches)
        if (!mounted) return
        setMatch(filtered[0] || null)
        setLastUpdated(new Date())
      } catch (e) {
        console.error('Failed to load matches for ImagePiP', e)
      }
    }

    // Initial load
    load()

    // Refresh every 5 seconds to keep the pop-up real-time
    const interval = setInterval(load, 5000)

    return () => {
      mounted = false
      clearInterval(interval)
    }
  }, [isOpen])

  if (!isOpen || !match) return null

  // Split score into sets for a professional look if possible
  const score = match.score || ''

  return (
    <>
      {/* Mobile Capsule Design */}
      <div className="sm:hidden fixed bottom-4 left-1/2 transform -translate-x-1/2 z-[99999]">
        <div className="bg-gradient-to-r from-white/95 to-gray-50/95 backdrop-blur-xl rounded-full shadow-lg border border-gray-200/50 px-4 py-3 min-w-[280px] max-w-[90vw]">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <img 
                src="/bhimavaram-open-logo.svg" 
                alt="Bhimavaram Open" 
                className="w-8 h-8 rounded-full bg-white p-1 shadow-sm"
              />
              
              {/* Live indicator and players */}
              <div className="flex items-center gap-2">
                {match.status === 'live' && (
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                )}
                <span className="text-gray-800 font-semibold text-sm">
                  {match.player1.split(' ')[0]} vs {match.player2.split(' ')[0]}
                </span>
              </div>
            </div>
            
            {/* Score badge */}
            <div className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-3 py-1.5 rounded-full shadow-md">
              <span className="font-bold text-sm">{score}</span>
            </div>
            
            {/* Close button */}
            <button
              onClick={onClose}
              className="ml-2 text-gray-400 hover:text-gray-600 text-lg leading-none p-1 hover:bg-gray-100 rounded-full transition-colors"
              aria-label="Close"
            >
              ×
            </button>
          </div>
        </div>
      </div>

      {/* Desktop Design - Ultra Attractive */}
      <div className="hidden sm:block fixed bottom-6 right-6 z-[99999] animate-slide-up">
        <div className="relative w-[450px] max-w-full bg-gradient-to-br from-slate-900 via-gray-900 to-black rounded-3xl shadow-2xl overflow-hidden border border-emerald-400/30 backdrop-blur-xl">
          {/* Animated background pattern */}
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 via-teal-500/5 to-cyan-500/5 animate-pulse"></div>
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 animate-shimmer"></div>
          
          {/* Header with premium styling */}
          <div className="relative bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 px-5 py-4 shadow-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <img 
                    src="/bhimavaram-open-logo.svg" 
                    alt="Bhimavaram Open" 
                    className="w-12 h-12 rounded-full bg-white p-1.5 shadow-lg ring-2 ring-white/20"
                  />
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-400 rounded-full flex items-center justify-center">
                    <span className="text-yellow-900 text-xs font-bold">★</span>
                  </div>
                </div>
                <div>
                  <div className="text-white font-bold text-base tracking-wide drop-shadow-sm">BHIMAVARAM OPEN</div>
                  <div className="text-emerald-100 text-sm font-medium">{match.tournament}</div>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                {match.status === 'live' && (
                  <div className="flex items-center gap-2 bg-red-500/20 px-3 py-1.5 rounded-full border border-red-400/30">
                    <div className="w-2.5 h-2.5 bg-red-400 rounded-full animate-pulse shadow-lg shadow-red-400/50" />
                    <span className="text-red-100 text-sm font-bold tracking-wide">LIVE</span>
                  </div>
                )}
                <button
                  onClick={onClose}
                  className="text-white/70 hover:text-white text-xl leading-none p-2 hover:bg-white/10 rounded-full transition-all duration-200 hover:scale-110"
                  aria-label="Close"
                >
                  ×
                </button>
              </div>
            </div>
          </div>

          <div className="flex">
            {/* Left - players with premium styling */}
            <div className="flex-1 p-6 relative">
              <div className="space-y-4">
                {/* Player 1 Card */}
                <div className="group relative bg-gradient-to-r from-slate-800/60 to-gray-800/60 rounded-xl p-4 border border-emerald-500/20 hover:border-emerald-400/40 transition-all duration-300 hover:shadow-lg hover:shadow-emerald-500/10">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <div className={`w-4 h-4 rounded-full ${match.status === 'live' && Math.random() > 0.5 ? 'bg-emerald-400 shadow-lg shadow-emerald-400/50' : 'bg-gray-500'} animate-pulse`} />
                        {match.status === 'live' && Math.random() > 0.5 && (
                          <div className="absolute inset-0 w-4 h-4 rounded-full bg-emerald-400 animate-ping opacity-75" />
                        )}
                      </div>
                      <div>
                        <div className="text-white font-bold text-lg tracking-wide">{match.player1}</div>
                        <div className="text-emerald-300 text-sm font-medium">Serving</div>
                      </div>
                    </div>
                    <div className="text-emerald-400 font-bold text-xl opacity-0 group-hover:opacity-100 transition-opacity">
                      🎾
                    </div>
                  </div>
                </div>

                {/* VS Separator */}
                <div className="relative flex items-center justify-center py-2">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gradient-to-r from-transparent via-emerald-500/30 to-transparent"></div>
                  </div>
                  <div className="relative bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-4 py-1 rounded-full text-sm font-bold shadow-lg">
                    VS
                  </div>
                </div>

                {/* Player 2 Card */}
                <div className="group relative bg-gradient-to-r from-slate-800/60 to-gray-800/60 rounded-xl p-4 border border-emerald-500/20 hover:border-emerald-400/40 transition-all duration-300 hover:shadow-lg hover:shadow-emerald-500/10">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <div className={`w-4 h-4 rounded-full ${match.status === 'live' && Math.random() <= 0.5 ? 'bg-emerald-400 shadow-lg shadow-emerald-400/50' : 'bg-gray-500'} animate-pulse`} />
                        {match.status === 'live' && Math.random() <= 0.5 && (
                          <div className="absolute inset-0 w-4 h-4 rounded-full bg-emerald-400 animate-ping opacity-75" />
                        )}
                      </div>
                      <div>
                        <div className="text-white font-bold text-lg tracking-wide">{match.player2}</div>
                        <div className="text-gray-400 text-sm font-medium">Receiving</div>
                      </div>
                    </div>
                    <div className="text-emerald-400 font-bold text-xl opacity-0 group-hover:opacity-100 transition-opacity">
                      🎾
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 text-center">
                <div className="inline-flex items-center gap-2 bg-slate-800/50 px-4 py-2 rounded-full border border-emerald-500/20">
                  <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                  <div className="text-emerald-300 text-sm font-medium">{formatDate(match.date)}</div>
                </div>
              </div>
            </div>

            {/* Right - Ultra Attractive Score Panel */}
            <div className="w-40 relative overflow-hidden">
              {/* Animated background gradient */}
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-400 via-teal-500 to-cyan-600 animate-gradient-shift"></div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-white/10"></div>
              
              {/* Floating particles effect */}
              <div className="absolute top-2 left-3 w-1 h-1 bg-white/30 rounded-full animate-float delay-0"></div>
              <div className="absolute top-8 right-4 w-1.5 h-1.5 bg-white/20 rounded-full animate-float delay-1000"></div>
              <div className="absolute bottom-6 left-2 w-1 h-1 bg-white/40 rounded-full animate-float delay-2000"></div>
              
              <div className="relative z-10 h-full flex flex-col items-center justify-center p-6 text-center">
                {/* Score Label */}
                <div className="text-white/90 text-xs uppercase tracking-[0.2em] font-bold mb-2 drop-shadow-lg">
                  SCORE
                </div>
                
                {/* Main Score Display */}
                <div className="relative">
                  <div className="text-white text-5xl font-black tracking-tight drop-shadow-2xl transform transition-transform duration-300 hover:scale-110">
                    {score}
                  </div>
                  <div className="absolute inset-0 text-white text-5xl font-black tracking-tight opacity-50 blur-sm">
                    {score}
                  </div>
                </div>
                
                {/* Set Info */}
                <div className="mt-3 px-3 py-1 bg-white/20 rounded-full backdrop-blur-sm border border-white/10">
                  <span className="text-white text-xs font-semibold tracking-wide">Set 3</span>
                </div>
                
                {/* Time */}
                <div className="mt-3 text-white/80 text-xs font-medium tracking-wide">
                  {lastUpdated ? lastUpdated.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                </div>
                
                {/* Decorative elements */}
                <div className="absolute top-4 right-4 text-white/20 text-lg">⚡</div>
                <div className="absolute bottom-4 left-4 text-white/20 text-lg">🏆</div>
              </div>
            </div>
          </div>

          {/* Premium Footer */}
          <div className="relative bg-gradient-to-r from-slate-900 to-gray-900 px-6 py-3 border-t border-emerald-500/20">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                <div className="text-emerald-300 text-sm font-semibold">Live Match</div>
              </div>
              <div className="text-gray-300 text-sm font-medium">Oct 15, 2025</div>
            </div>
          </div>
        </div>
      </div>

      {/* Custom Animations */}
      <style jsx global>{`
        @keyframes slide-up {
          from {
            transform: translateY(20px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }

        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }

        @keyframes gradient-shift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }

        @keyframes float {
          0%, 100% { 
            transform: translateY(0px) rotate(0deg);
            opacity: 0.3;
          }
          50% { 
            transform: translateY(-10px) rotate(180deg);
            opacity: 0.8;
          }
        }

        .animate-slide-up {
          animation: slide-up 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        .animate-shimmer {
          background-size: 200% 100%;
          animation: shimmer 2s infinite;
        }

        .animate-gradient-shift {
          background-size: 400% 400%;
          animation: gradient-shift 3s ease infinite;
        }

        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
      `}</style>
    </>
  )
}
