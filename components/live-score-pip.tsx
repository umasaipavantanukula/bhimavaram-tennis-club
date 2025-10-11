"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Maximize2, 
  Minimize2, 
  X, 
  Move, 
  Trophy, 
  Clock, 
  Users,
  Wifi,
  WifiOff,
  Play,
  Volume2,
  VolumeX
} from "lucide-react"
import { matchOperations, type Match } from "@/lib/firebase-operations"

interface LiveScorePiPProps {
  isOpen: boolean
  onClose: () => void
  position?: { x: number; y: number }
  onPositionChange?: (position: { x: number; y: number }) => void
}

interface LiveMatch extends Match {
  isLive: boolean
  currentSet: string
  gameScore: string
  serverPlayer: 1 | 2
}

export function LiveScorePiP({ isOpen, onClose, position = { x: 20, y: 100 }, onPositionChange }: LiveScorePiPProps) {
  const [isMinimized, setIsMinimized] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  const [currentPosition, setCurrentPosition] = useState(position)
  const [liveMatches, setLiveMatches] = useState<LiveMatch[]>([])
  const [selectedMatchIndex, setSelectedMatchIndex] = useState(0)
  const [isConnected, setIsConnected] = useState(true)
  const [autoUpdate, setAutoUpdate] = useState(true)
  const [soundEnabled, setSoundEnabled] = useState(false)
  const [lastUpdateTime, setLastUpdateTime] = useState<Date>(new Date())

  const containerRef = useRef<HTMLDivElement>(null)
  const dragRef = useRef<HTMLDivElement>(null)

  // Auto-refresh interval
  useEffect(() => {
    let interval: NodeJS.Timeout

    if (autoUpdate && isOpen) {
      interval = setInterval(() => {
        loadLiveMatches()
        setLastUpdateTime(new Date())
      }, 15000) // Update every 15 seconds
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
      const live = matches
        .filter(match => match.status === "live" || match.status === "upcoming")
        .map(match => ({
          ...match,
          isLive: match.status === "live",
          currentSet: generateCurrentSet(),
          gameScore: generateGameScore(),
          serverPlayer: Math.random() > 0.5 ? 1 : 2 as 1 | 2
        }))
      
      setLiveMatches(live)
      if (live.length === 0) {
        // Create some demo live matches for demonstration
        const demoMatches: LiveMatch[] = [
          {
            id: "demo-1",
            player1: "Rafael Nadal",
            player2: "Novak Djokovic",
            score: "6-4, 3-2",
            date: new Date(),
            tournament: "Bhimavaram Open",
            status: "live",
            court: "Center Court",
            createdAt: new Date(),
            isLive: true,
            currentSet: "Set 2",
            gameScore: "40-30",
            serverPlayer: 1
          },
          {
            id: "demo-2",
            player1: "Serena Williams",
            player2: "Maria Sharapova",
            score: "7-6, 6-4",
            date: new Date(),
            tournament: "Club Championship",
            status: "live",
            court: "Court 2",
            createdAt: new Date(),
            isLive: true,
            currentSet: "Match Point",
            gameScore: "Match",
            serverPlayer: 2
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

  // Drag and drop handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!dragRef.current?.contains(e.target as Node)) return
    
    setIsDragging(true)
    const rect = containerRef.current?.getBoundingClientRect()
    if (rect) {
      setDragOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      })
    }
  }

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging) return
    
    const newPosition = {
      x: Math.max(0, Math.min(window.innerWidth - 350, e.clientX - dragOffset.x)),
      y: Math.max(0, Math.min(window.innerHeight - 200, e.clientY - dragOffset.y))
    }
    
    setCurrentPosition(newPosition)
    onPositionChange?.(newPosition)
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  // Attach global mouse events for dragging
  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }
  }, [isDragging, dragOffset])

  const currentMatch = liveMatches[selectedMatchIndex]

  if (!isOpen) return null

  return (
    <div
      ref={containerRef}
      className={`fixed z-[9999] bg-white dark:bg-gray-900 rounded-lg shadow-2xl border border-gray-200 dark:border-gray-700 transition-all duration-300 ${
        isDragging ? 'cursor-grabbing' : 'cursor-default'
      } ${isMinimized ? 'w-72 h-12' : 'w-80 h-auto min-h-[200px] max-h-[500px]'}`}
      style={{
        left: currentPosition.x,
        top: currentPosition.y,
        backdropFilter: 'blur(10px)',
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
      }}
      onMouseDown={handleMouseDown}
    >
      {/* Header */}
      <div
        ref={dragRef}
        className={`flex items-center justify-between p-3 bg-gradient-to-r from-primary/90 to-primary text-white rounded-t-lg cursor-grab active:cursor-grabbing ${
          isMinimized ? 'rounded-b-lg' : ''
        }`}
      >
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            {isConnected ? (
              <Wifi className="h-3 w-3 text-green-300" />
            ) : (
              <WifiOff className="h-3 w-3 text-red-300" />
            )}
            <Trophy className="h-4 w-4" />
          </div>
          <span className="text-sm font-semibold">
            {isMinimized ? 'Live Scores' : 'Live Tennis Scores'}
          </span>
          {!isMinimized && currentMatch && (
            <Badge variant="secondary" className="bg-green-500/20 text-green-100 text-xs">
              {currentMatch.isLive ? 'LIVE' : 'UPCOMING'}
            </Badge>
          )}
        </div>

        <div className="flex items-center gap-1">
          {!isMinimized && (
            <>
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0 text-white hover:bg-white/20"
                onClick={(e) => {
                  e.stopPropagation()
                  setSoundEnabled(!soundEnabled)
                }}
              >
                {soundEnabled ? <Volume2 className="h-3 w-3" /> : <VolumeX className="h-3 w-3" />}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0 text-white hover:bg-white/20"
                onClick={(e) => {
                  e.stopPropagation()
                  setAutoUpdate(!autoUpdate)
                }}
              >
                <Play className={`h-3 w-3 ${autoUpdate ? 'text-green-300' : 'text-red-300'}`} />
              </Button>
            </>
          )}
          <Button
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0 text-white hover:bg-white/20"
            onClick={(e) => {
              e.stopPropagation()
              setIsMinimized(!isMinimized)
            }}
          >
            {isMinimized ? <Maximize2 className="h-3 w-3" /> : <Minimize2 className="h-3 w-3" />}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0 text-white hover:bg-white/20"
            onClick={(e) => {
              e.stopPropagation()
              onClose()
            }}
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
      </div>

      {/* Content */}
      {!isMinimized && (
        <div className="p-4 space-y-3">
          {liveMatches.length === 0 ? (
            <div className="text-center py-8">
              <Clock className="h-8 w-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-500">No live matches currently</p>
              <p className="text-xs text-gray-400 mt-1">Check back later</p>
            </div>
          ) : (
            <>
              {/* Match Navigation */}
              {liveMatches.length > 1 && (
                <div className="flex gap-1 mb-3">
                  {liveMatches.map((_, index) => (
                    <Button
                      key={index}
                      variant={selectedMatchIndex === index ? "default" : "outline"}
                      size="sm"
                      className="h-6 px-2 text-xs"
                      onClick={() => setSelectedMatchIndex(index)}
                    >
                      Match {index + 1}
                    </Button>
                  ))}
                </div>
              )}

              {/* Current Match Display */}
              {currentMatch && (
                <div className="space-y-3">
                  {/* Tournament Info */}
                  <div className="text-center">
                    <h3 className="font-semibold text-sm text-gray-900 dark:text-white">
                      {currentMatch.tournament}
                    </h3>
                    <p className="text-xs text-gray-500">{currentMatch.court}</p>
                  </div>

                  {/* Players and Score */}
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

                  {/* Current Score */}
                  <div className="text-center space-y-1">
                    <div className="font-bold text-lg text-primary">{currentMatch.score}</div>
                    {currentMatch.isLive && (
                      <>
                        <div className="text-sm text-gray-600 dark:text-gray-300">{currentMatch.currentSet}</div>
                        <div className="font-medium text-primary">{currentMatch.gameScore}</div>
                      </>
                    )}
                  </div>

                  {/* Status Bar */}
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
            </>
          )}
        </div>
      )}
    </div>
  )
}