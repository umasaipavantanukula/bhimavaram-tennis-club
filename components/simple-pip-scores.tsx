"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Maximize2, 
  Minimize2, 
  X, 
  Trophy, 
  Clock,
  Wifi,
  WifiOff,
  Play,
  Volume2,
  VolumeX,
  ExternalLink,
  PictureInPicture2
} from "lucide-react"
import { matchOperations, type Match } from "@/lib/firebase-operations"
import { getCurrentOrRecentMatches, formatDate } from "@/lib/date-utils"

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
  const [soundEnabled, setSoundEnabled] = useState(false)
  const [lastUpdateTime, setLastUpdateTime] = useState<Date>(new Date())
  const [isDocumentPiPSupported, setIsDocumentPiPSupported] = useState(false)

  // Check if Document Picture-in-Picture is supported (newer API)
  useEffect(() => {
    setIsDocumentPiPSupported('documentPictureInPicture' in window)
  }, [])

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

  // Start Document Picture-in-Picture (if supported)
  const startDocumentPiP = async () => {
    if (!isDocumentPiPSupported) {
      alert('Document Picture-in-Picture is not supported in your browser')
      return
    }

    try {
      // @ts-ignore - documentPictureInPicture is experimental
      const pipWindow = await window.documentPictureInPicture.requestWindow({
        width: 400,
        height: 300,
      })

      // Copy styles to the PiP window
      const styleSheets = Array.from(document.styleSheets)
      styleSheets.forEach((styleSheet) => {
        try {
          const cssRules = Array.from(styleSheet.cssRules).map(rule => rule.cssText).join('')
          const style = pipWindow.document.createElement('style')
          style.textContent = cssRules
          pipWindow.document.head.appendChild(style)
        } catch (e) {
          console.warn('Could not copy stylesheet:', e)
        }
      })

      // Create content for PiP window
      pipWindow.document.body.innerHTML = `
        <div style="
          background: linear-gradient(135deg, #1e40af 0%, #7c3aed 100%);
          color: white;
          padding: 20px;
          font-family: system-ui;
          height: 100vh;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
        ">
          <div style="text-align: center;">
            <h2 style="margin: 0 0 10px 0; font-size: 18px;">🏆 Live Tennis Scores</h2>
            <div style="background: rgba(0,0,0,0.2); padding: 15px; border-radius: 8px; margin-bottom: 15px;">
              <div style="font-size: 14px; margin-bottom: 5px;">${liveMatches[0]?.tournament || 'Bhimavaram Open'}</div>
              <div style="font-size: 12px; opacity: 0.8; margin-bottom: 5px;">${liveMatches[0]?.court || 'Center Court'}</div>
              <div style="font-size: 12px; opacity: 0.7; margin-bottom: 10px;">${formatDate(liveMatches[0]?.date || new Date())}</div>
              <div style="font-size: 16px; margin-bottom: 5px;">${liveMatches[0]?.player1 || 'Rafael Nadal'}</div>
              <div style="font-size: 16px; margin-bottom: 10px;">${liveMatches[0]?.player2 || 'Novak Djokovic'}</div>
              <div style="font-size: 20px; font-weight: bold; color: #fbbf24;">${liveMatches[0]?.score || '6-4, 3-2'}</div>
              <div style="font-size: 14px; margin-top: 5px;">${liveMatches[0]?.currentSet || 'Set 2'}</div>
              <div style="font-size: 14px;">${liveMatches[0]?.gameScore || '40-30'}</div>
            </div>
            <div style="font-size: 10px; opacity: 0.7;">
              Last updated: ${new Date().toLocaleTimeString()}
            </div>
          </div>
        </div>
      `

      // Auto-update the PiP window content
      const updatePiPContent = () => {
        if (!pipWindow.closed) {
          const currentMatch = liveMatches[0]
          if (currentMatch) {
            const scoreDiv = pipWindow.document.querySelector('[style*="color: #fbbf24"]')
            const timeDiv = pipWindow.document.querySelector('[style*="opacity: 0.7"]')
            if (scoreDiv) scoreDiv.textContent = currentMatch.score
            if (timeDiv) timeDiv.textContent = `Last updated: ${new Date().toLocaleTimeString()}`
          }
          setTimeout(updatePiPContent, 5000)
        }
      }
      setTimeout(updatePiPContent, 5000)

    } catch (error) {
      console.error('Failed to start Document Picture-in-Picture:', error)
      alert('Failed to start Picture-in-Picture mode')
    }
  }

  const openNewWindow = () => {
    window.open(
      '/live-scores',
      'liveScores',
      'width=400,height=600,scrollbars=no,resizable=yes,status=no,location=no,toolbar=no,menubar=no'
    )
  }

  const currentMatch = liveMatches[selectedMatchIndex]

  if (!isOpen) return null

  return (
    <div className="fixed top-4 right-4 z-[9999] w-96">
      <Card className="bg-white dark:bg-gray-900 shadow-2xl border border-gray-200 dark:border-gray-700">
        {/* Header */}
        <div className="flex items-center justify-between p-4 bg-gradient-to-r from-primary/90 to-primary text-white rounded-t-lg">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              {isConnected ? (
                <Wifi className="h-4 w-4 text-green-300" />
              ) : (
                <WifiOff className="h-4 w-4 text-red-300" />
              )}
              <Trophy className="h-4 w-4" />
            </div>
            <span className="text-sm font-semibold">Live Tennis Scores</span>
            {currentMatch && (
              <Badge variant="secondary" className="bg-green-500/20 text-green-100 text-xs">
                {currentMatch.isLive ? 'LIVE' : 'UPCOMING'}
              </Badge>
            )}
          </div>

          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0 text-white hover:bg-white/20"
              onClick={() => setSoundEnabled(!soundEnabled)}
            >
              {soundEnabled ? <Volume2 className="h-3 w-3" /> : <VolumeX className="h-3 w-3" />}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0 text-white hover:bg-white/20"
              onClick={() => setAutoUpdate(!autoUpdate)}
            >
              <Play className={`h-3 w-3 ${autoUpdate ? 'text-green-300' : 'text-red-300'}`} />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0 text-white hover:bg-white/20"
              onClick={onClose}
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 space-y-4">
          {/* PiP Options */}
          <div className="space-y-3">
            {isDocumentPiPSupported && (
              <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                <div className="flex items-center justify-center gap-2 text-blue-700 dark:text-blue-300 mb-2">
                  <PictureInPicture2 className="h-4 w-4" />
                  <span className="text-sm font-medium">Document Picture-in-Picture</span>
                </div>
                <Button
                  onClick={startDocumentPiP}
                  size="sm"
                  className="bg-blue-600 hover:bg-blue-700 text-white mb-2"
                >
                  <PictureInPicture2 className="h-3 w-3 mr-1" />
                  Open System Overlay
                </Button>
                <p className="text-xs text-blue-600 dark:text-blue-400">
                  Creates a native system window (Chrome 116+ only)
                </p>
              </div>
            )}

            <div className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
              <div className="flex items-center justify-center gap-2 text-green-700 dark:text-green-300 mb-2">
                <ExternalLink className="h-4 w-4" />
                <span className="text-sm font-medium">Standalone Window</span>
              </div>
              <Button
                onClick={openNewWindow}
                size="sm"
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                <ExternalLink className="h-3 w-3 mr-1" />
                Open New Window
              </Button>
              <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                Opens in a separate browser window
              </p>
            </div>
          </div>

          {/* Current Match Display */}
          {currentMatch && (
            <div className="space-y-3">
              <div className="text-center">
                <h3 className="font-semibold text-sm text-gray-900 dark:text-white">
                  {currentMatch.tournament}
                </h3>
                <p className="text-xs text-gray-500">{currentMatch.court}</p>
                <p className="text-xs text-gray-400 mt-1">{formatDate(currentMatch.date)}</p>
              </div>

              <div className="space-y-2">
                <div className={`flex items-center justify-between p-2 rounded ${
                  currentMatch.serverPlayer === 1 ? 'bg-primary/10 border-l-2 border-primary' : 'bg-gray-50 dark:bg-gray-800'
                }`}>
                  <div className="flex items-center gap-2">
                    {currentMatch.serverPlayer === 1 && <div className="w-2 h-2 bg-green-500 rounded-full" />}
                    <span className="font-medium text-sm">{currentMatch.player1}</span>
                  </div>
                </div>
                
                <div className={`flex items-center justify-between p-2 rounded ${
                  currentMatch.serverPlayer === 2 ? 'bg-primary/10 border-l-2 border-primary' : 'bg-gray-50 dark:bg-gray-800'
                }`}>
                  <div className="flex items-center gap-2">
                    {currentMatch.serverPlayer === 2 && <div className="w-2 h-2 bg-green-500 rounded-full" />}
                    <span className="font-medium text-sm">{currentMatch.player2}</span>
                  </div>
                </div>
              </div>

              <div className="text-center space-y-1">
                <div className="font-bold text-lg text-primary">{currentMatch.score}</div>
                {currentMatch.isLive && (
                  <>
                    <div className="text-sm text-gray-600 dark:text-gray-300">{currentMatch.currentSet}</div>
                    <div className="font-medium text-primary">{currentMatch.gameScore}</div>
                  </>
                )}
              </div>

              <div className="flex items-center justify-between text-xs text-gray-500 pt-2 border-t">
                <div className="flex items-center gap-1">
                  <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
                  <span>{isConnected ? 'Connected' : 'Offline'}</span>
                </div>
                <div>
                  Updated: {lastUpdateTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  )
}