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
    <div className="fixed bottom-6 right-6 z-[99999]">
      <div className="relative w-[420px] max-w-full bg-[#0f1114] rounded-xl shadow-2xl overflow-hidden border border-white/6">
        <div className="flex">
          {/* Left - players */}
          <div className="flex-1 p-3">
            <div className="flex items-center justify-between mb-2">
              <div className="text-xs text-gray-300 uppercase tracking-widest">{match.tournament}</div>
              <div className="text-xs text-white bg-teal-400/10 text-teal-300 px-2 py-0.5 rounded-md">{match.status?.toUpperCase() || ''}</div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between bg-[#0b0c0e] rounded-md p-3">
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${match.status === 'live' && Math.random() > 0.5 ? 'bg-teal-400' : 'bg-gray-600'}`} />
                  <div>
                    <div className="text-sm font-bold text-white">{match.player1}</div>
                    <div className="text-xs text-gray-400">Player 1</div>
                  </div>
                </div>
                <div className="text-xl font-bold text-white">{/* small right score area left blank */}</div>
              </div>

              <div className="flex items-center justify-between bg-[#0b0c0e] rounded-md p-3">
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${match.status === 'live' && Math.random() <= 0.5 ? 'bg-teal-400' : 'bg-gray-600'}`} />
                  <div>
                    <div className="text-sm font-bold text-white">{match.player2}</div>
                    <div className="text-xs text-gray-400">Player 2</div>
                  </div>
                </div>
                <div className="text-xl font-bold text-white">{/* small right score area left blank */}</div>
              </div>
            </div>

            <div className="mt-3 text-center">
              <div className="text-sm text-gray-400">{formatDate(match.date)}</div>
            </div>
          </div>

          {/* Right - score panel */}
          <div className="w-36 bg-gradient-to-b from-teal-500 to-teal-400 flex flex-col items-center justify-center p-3">
            <div className="text-xs text-black/70 uppercase tracking-wide">Score</div>
            <div className="text-2xl font-extrabold text-black mt-1">{score}</div>
            <div className="text-xs text-black/60 mt-2">{lastUpdated ? lastUpdated.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}</div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-3 py-2 bg-black/20">
          <div className="text-xs text-gray-400">Tournament</div>
          <div className="text-xs text-teal-300 font-medium">{match.tournament}</div>
        </div>

        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-300 hover:text-white text-sm"
          aria-label="Close"
        >
          ✕
        </button>
      </div>
    </div>
  )
}
