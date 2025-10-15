"use client"

import { useState, useEffect, useRef } from "react"
import { Trophy, Wifi, WifiOff, X } from "lucide-react"
import { matchOperations, type Match } from "@/lib/firebase-operations"
import { getCurrentOrRecentMatches } from "@/lib/date-utils"

interface SimplePiPProps {
  isOpen: boolean
  onClose: () => void
}

interface LiveMatch extends Match {
  isLive: boolean
  currentSet: string
  gameScore: string
  serverPlayer: 1 | 2
}

export function SimplePiPScores({ isOpen, onClose }: SimplePiPProps) {
  const [liveMatches, setLiveMatches] = useState<LiveMatch[]>([])
  const [selectedMatchIndex, setSelectedMatchIndex] = useState(0)
  const [isConnected, setIsConnected] = useState(true)
  const [autoUpdate, setAutoUpdate] = useState(true)
  const [lastUpdateTime, setLastUpdateTime] = useState<Date>(new Date())
  const [pipWindow, setPipWindow] = useState<Window | null>(null)
  const [isPiPSupported, setIsPiPSupported] = useState(false)
  const pipContainerRef = useRef<HTMLDivElement>(null)

  // Check PiP support
  useEffect(() => {
    if (typeof window !== 'undefined' && 'documentPictureInPicture' in window) {
      setIsPiPSupported(true)
    }
  }, [])

  // Function to open Picture-in-Picture window
  const openDocumentPiP = async () => {
    // Check if Document PiP is supported
    if (!('documentPictureInPicture' in window)) {
      alert('Picture-in-Picture is not supported in your browser. Please use Chrome 116+ or Edge 116+')
      return
    }

    try {
      const documentPiP = (window as any).documentPictureInPicture
      
      // Close existing PiP window if any
      if (documentPiP.window) {
        documentPiP.window.close()
      }

      // Request PiP window
      const pipWin = await documentPiP.requestWindow({
        width: 340,
        height: 100,
        disallowReturnToOpener: false
      })

      setPipWindow(pipWin)

      // Copy styles to PiP window
      const allStyles = Array.from(document.styleSheets)
        .map(styleSheet => {
          try {
            return Array.from(styleSheet.cssRules)
              .map(rule => rule.cssText)
              .join('\n')
          } catch (e) {
            return ''
          }
        })
        .join('\n')

      const styleElement = pipWin.document.createElement('style')
      styleElement.textContent = allStyles
      pipWin.document.head.appendChild(styleElement)

      // Add Tailwind CDN for styling
      const tailwindScript = pipWin.document.createElement('script')
      tailwindScript.src = 'https://cdn.tailwindcss.com'
      pipWin.document.head.appendChild(tailwindScript)

      // Handle PiP window close
      pipWin.addEventListener('pagehide', () => {
        setPipWindow(null)
      })

    } catch (error) {
      console.error('Error opening PiP:', error)
      alert('Could not open Picture-in-Picture. Please try again.')
    }
  }

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (pipWindow) {
        pipWindow.close()
      }
    }
  }, [pipWindow])

  // Auto-refresh interval
  useEffect(() => {
    let interval: NodeJS.Timeout

    if (autoUpdate && isOpen) {
      interval = setInterval(() => {
        loadLiveMatches()
        setLastUpdateTime(new Date())
      }, 5000)
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [autoUpdate, isOpen])

  // Load live matches on component mount
  useEffect(() => {
    if (isOpen) {
      loadLiveMatches()
    }
  }, [isOpen])

  const loadLiveMatches = async () => {
    try {
      const matches = await matchOperations.getAll()
      // Use date utility to get current or recent matches
      const filtered = getCurrentOrRecentMatches(matches)
        .filter(match => match.status === "live" || match.status === "upcoming")
        .map(match => ({
          ...match,
          isLive: match.status === "live",
          currentSet: generateCurrentSet(),
          gameScore: generateGameScore(),
          serverPlayer: Math.random() > 0.5 ? 1 : 2 as 1 | 2
        }))

      setLiveMatches(filtered)
      if (filtered.length === 0) {
        const today = new Date()
        const demoMatches: LiveMatch[] = [
          {
            id: "demo-1",
            player1: "Rafael Nadal",
            player2: "Novak Djokovic",
            score: "6-4, 3-2",
            date: today,
            tournament: "Bhimavaram Open",
            status: "live",
            court: "Center Court",
            createdAt: today,
            isLive: true,
            currentSet: "Set 2",
            gameScore: "40-30",
            serverPlayer: 1
          }
        ]
        setLiveMatches(demoMatches)
      }
      setIsConnected(true)
    } catch (error) {
      console.error("Error loading live matches:", error)
      setIsConnected(false)
    }
  }

  const generateCurrentSet = () => {
    const sets = ["Set 1", "Set 2", "Set 3", "Set 4", "Set 5"]
    return sets[Math.floor(Math.random() * 3)]
  }

  const generateGameScore = () => {
    const scores = ["0-0", "15-0", "30-0", "40-0", "15-15", "30-30", "40-40", "Deuce", "Advantage"]
    return scores[Math.floor(Math.random() * scores.length)]
  }

  const currentMatch = liveMatches[selectedMatchIndex]

  // Always display - no conditional return
  // if (!isOpen) return null

  // Parse score for sets display
  const parseScore = (scoreStr: string) => {
    if (!scoreStr) return []
    return scoreStr.split(',').map(set => set.trim())
  }

  const sets = currentMatch ? parseScore(currentMatch.score) : []

  // Render score content in PiP window
  useEffect(() => {
    if (!pipWindow || !pipWindow.document) return

    const renderContent = () => {
      const content = currentMatch ? `
        <div style="
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          font-family: system-ui, -apple-system, sans-serif;
          padding: 12px;
        ">
          <div style="
            background: white;
            border-radius: 16px;
            padding: 12px 16px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            display: flex;
            align-items: center;
            gap: 12px;
            width: 100%;
          ">
            <!-- Logo -->
            <div style="
              width: 36px;
              height: 36px;
              border-radius: 50%;
              background: linear-gradient(135deg, #9333ea 0%, #4f46e5 100%);
              display: flex;
              align-items: center;
              justify-content: center;
              flex-shrink: 0;
              font-size: 18px;
            ">
              🎾
            </div>
            
            <!-- Match Info -->
            <div style="flex: 1; min-width: 0;">
              <div style="display: flex; align-items: center; gap: 6px; margin-bottom: 4px;">
                ${currentMatch.isLive ? '<div style="width: 8px; height: 8px; background: #ef4444; border-radius: 50%; animation: pulse 2s infinite;"></div>' : ''}
                <div style="
                  font-weight: 600;
                  font-size: 13px;
                  color: #1f2937;
                  white-space: nowrap;
                  overflow: hidden;
                  text-overflow: ellipsis;
                ">
                  ${currentMatch.player1.split(' ')[0]} vs ${currentMatch.player2.split(' ')[0]}
                </div>
              </div>
              <div style="display: flex; align-items: center; gap: 6px;">
                <span style="font-weight: 500; font-size: 11px; color: #6b7280;">
                  ${currentMatch.score}
                </span>
                ${currentMatch.isLive ? `
                  <span style="color: #9ca3af; font-size: 10px;">•</span>
                  <span style="font-weight: 600; font-size: 11px; color: #9333ea;">
                    ${currentMatch.currentSet}
                  </span>
                ` : ''}
              </div>
            </div>
            
            <!-- Connection Status -->
            <div style="
              width: 16px;
              height: 16px;
              color: ${isConnected ? '#22c55e' : '#ef4444'};
              flex-shrink: 0;
            ">
              ${isConnected ? '📶' : '❌'}
            </div>
          </div>
        </div>
        <style>
          @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.5; }
          }
        </style>
      ` : `
        <div style="
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          font-family: system-ui, -apple-system, sans-serif;
        ">
          <div style="
            background: white;
            border-radius: 16px;
            padding: 12px 20px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
          ">
            <span style="color: #6b7280; font-size: 12px;">No live matches</span>
          </div>
        </div>
      `

      pipWindow.document.body.innerHTML = content
      pipWindow.document.body.style.margin = '0'
      pipWindow.document.body.style.padding = '0'
      pipWindow.document.body.style.overflow = 'hidden'
    }

    renderContent()
  }, [pipWindow, currentMatch, isConnected])

  // Show regular badge on the website if PiP not supported or not opened
  if (!pipWindow) {
    return (
      <>
        {/* Compact Pill-Style Score Badge - Bottom Right */}
        <div className="fixed bottom-4 right-4 z-[9999] animate-slide-in">
          {currentMatch ? (
            <div className="bg-white/95 backdrop-blur-xl rounded-full shadow-[0_8px_32px_rgba(0,0,0,0.3)] border border-gray-200/50 px-3 sm:px-4 py-2 sm:py-2.5 hover:shadow-[0_12px_40px_rgba(0,0,0,0.4)] transition-all duration-300">
              <div className="flex items-center gap-2 sm:gap-3">
                
                {/* Logo */}
                <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-gradient-to-br from-purple-600 to-indigo-600 p-1 flex items-center justify-center flex-shrink-0 shadow-md">
                  <img 
                    src="/logo.png" 
                    alt="BTC" 
                    className="w-full h-full object-contain"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      const parent = target.parentElement;
                      if (parent) {
                        parent.innerHTML = '<div class="text-white font-bold text-xs">🎾</div>';
                      }
                    }}
                  />
                </div>

                {/* Score Info */}
                <div className="flex flex-col min-w-0">
                  <div className="flex items-center gap-1.5">
                    {/* Live Indicator */}
                    {currentMatch.isLive && (
                      <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse flex-shrink-0" />
                    )}
                    
                    {/* Players */}
                    <span className="text-gray-800 font-semibold text-xs sm:text-sm truncate max-w-[120px] sm:max-w-[150px]">
                      {currentMatch.player1.split(' ')[0]} vs {currentMatch.player2.split(' ')[0]}
                    </span>
                  </div>

                  {/* Score */}
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="text-gray-600 font-medium text-[10px] sm:text-xs">
                      {currentMatch.score}
                    </span>
                    {currentMatch.isLive && (
                      <>
                        <span className="text-gray-400 text-[10px]">•</span>
                        <span className="text-purple-600 font-semibold text-[10px] sm:text-xs">
                          {currentMatch.currentSet}
                        </span>
                      </>
                    )}
                  </div>
                </div>

                {/* Connection Status */}
                {isConnected ? (
                  <Wifi className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-green-500 flex-shrink-0" />
                ) : (
                  <WifiOff className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-red-500 flex-shrink-0" />
                )}
              </div>
            </div>
          ) : (
            <div className="bg-white/95 backdrop-blur-xl rounded-full shadow-lg border border-gray-200/50 px-3 py-2">
              <span className="text-gray-600 text-xs">No live matches</span>
            </div>
          )}
        </div>

        {/* Floating PiP Button - Show if PiP is supported */}
        {isPiPSupported && currentMatch && (
          <button
            onClick={openDocumentPiP}
            className="fixed bottom-20 right-4 z-[9999] bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-full p-3 shadow-lg hover:shadow-xl transition-all duration-300 animate-bounce"
            title="Open floating window (stays on top of all apps)"
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="20" 
              height="20" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              <rect x="2" y="7" width="20" height="15" rx="2" ry="2"/>
              <polyline points="17 2 12 7 7 2"/>
            </svg>
          </button>
        )}

        {/* Animations */}
        <style jsx global>{`
          @keyframes slide-in {
            from {
              transform: translateX(120%);
              opacity: 0;
            }
            to {
              transform: translateX(0);
              opacity: 1;
            }
          }

          .animate-slide-in {
            animation: slide-in 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
          }
        `}</style>
      </>
    )
  }

  // If PiP window is active, show a minimized indicator
  return (
    <div className="fixed bottom-4 right-4 z-[9999]">
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-full px-4 py-2 shadow-lg">
        <span className="text-xs font-medium">📺 Floating on screen</span>
      </div>
    </div>
  )
}