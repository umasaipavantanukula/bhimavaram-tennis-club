"use client"

import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { 
  Trophy, 
  Clock,
  Wifi,
  WifiOff,
  Play,
  Pause,
  Volume2,
  VolumeX,
  RotateCcw
} from "lucide-react"
import { matchOperations, type Match } from "@/lib/firebase-operations"
import { getCurrentOrRecentMatches, formatDate } from "@/lib/date-utils"

interface LiveMatch extends Match {
  isLive: boolean
  currentSet: string
  gameScore: string
  serverPlayer: 1 | 2
}

export default function StandaloneScores() {
  const [liveMatches, setLiveMatches] = useState<LiveMatch[]>([])
  const [selectedMatchIndex, setSelectedMatchIndex] = useState(0)
  const [isConnected, setIsConnected] = useState(true)
  const [autoUpdate, setAutoUpdate] = useState(true)
  const [soundEnabled, setSoundEnabled] = useState(false)
  const [lastUpdateTime, setLastUpdateTime] = useState<Date>(new Date())

  // Auto-refresh interval
  useEffect(() => {
    let interval: NodeJS.Timeout

    if (autoUpdate) {
      interval = setInterval(() => {
        loadLiveMatches()
        setLastUpdateTime(new Date())
      }, 5000) // Update every 5 seconds
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [autoUpdate])

  // Load live matches on component mount
  useEffect(() => {
    loadLiveMatches()
  }, [])

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
        // Create demo matches with today's date
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
          },
          {
            id: "demo-2",
            player1: "Serena Williams",
            player2: "Maria Sharapova",
            score: "7-6, 6-4",
            date: today,
            tournament: "Club Championship",
            status: "live",
            court: "Court 2",
            createdAt: today,
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

  const currentMatch = liveMatches[selectedMatchIndex]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-blue-800 text-white p-4">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6 p-4 bg-black/20 rounded-lg backdrop-blur">
          <div className="flex items-center gap-2">
            <Trophy className="h-6 w-6 text-yellow-400" />
            <span className="text-lg font-bold">Live Tennis Scores</span>
          </div>
          <div className="flex items-center gap-2">
            {isConnected ? (
              <Wifi className="h-4 w-4 text-green-400" />
            ) : (
              <WifiOff className="h-4 w-4 text-red-400" />
            )}
            <Badge variant="outline" className="border-white/30 text-white">
              {currentMatch?.isLive ? 'LIVE' : 'UPCOMING'}
            </Badge>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-3 mb-6">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setAutoUpdate(!autoUpdate)}
            className="border-white/30 text-white hover:bg-white/10"
          >
            {autoUpdate ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            {autoUpdate ? 'Pause' : 'Resume'}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="border-white/30 text-white hover:bg-white/10"
          >
            {soundEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={loadLiveMatches}
            className="border-white/30 text-white hover:bg-white/10"
          >
            <RotateCcw className="h-4 w-4" />
          </Button>
        </div>

        {liveMatches.length === 0 ? (
          <div className="text-center py-12 bg-black/20 rounded-lg backdrop-blur">
            <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-lg text-gray-300">No live matches currently</p>
            <p className="text-sm text-gray-400 mt-2">Check back later for live updates</p>
          </div>
        ) : (
          <>
            {/* Match Navigation */}
            {liveMatches.length > 1 && (
              <div className="flex gap-2 mb-6 justify-center">
                {liveMatches.map((_, index) => (
                  <Button
                    key={index}
                    variant={selectedMatchIndex === index ? "default" : "outline"}
                    size="sm"
                    className={selectedMatchIndex === index ? 
                      "bg-white text-black" : 
                      "border-white/30 text-white hover:bg-white/10"
                    }
                    onClick={() => setSelectedMatchIndex(index)}
                  >
                    Match {index + 1}
                  </Button>
                ))}
              </div>
            )}

            {/* Current Match Display */}
            {currentMatch && (
              <div className="space-y-6">
                {/* Tournament Info */}
                <div className="text-center bg-black/20 rounded-lg p-4 backdrop-blur">
                  <h1 className="text-xl font-bold text-yellow-400 mb-1">
                    {currentMatch.tournament}
                  </h1>
                  <p className="text-gray-300">{currentMatch.court}</p>
                  <p className="text-sm text-gray-400 mt-1">{formatDate(currentMatch.date)}</p>
                </div>

                {/* Players */}
                <div className="space-y-3">
                  <div className={`flex items-center justify-between p-4 rounded-lg ${
                    currentMatch.serverPlayer === 1 ? 
                      'bg-green-500/20 border-l-4 border-green-400' : 
                      'bg-black/20'
                  } backdrop-blur`}>
                    <div className="flex items-center gap-3">
                      {currentMatch.serverPlayer === 1 && (
                        <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse" />
                      )}
                      <span className="text-lg font-semibold">{currentMatch.player1}</span>
                    </div>
                  </div>
                  
                  <div className={`flex items-center justify-between p-4 rounded-lg ${
                    currentMatch.serverPlayer === 2 ? 
                      'bg-green-500/20 border-l-4 border-green-400' : 
                      'bg-black/20'
                  } backdrop-blur`}>
                    <div className="flex items-center gap-3">
                      {currentMatch.serverPlayer === 2 && (
                        <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse" />
                      )}
                      <span className="text-lg font-semibold">{currentMatch.player2}</span>
                    </div>
                  </div>
                </div>

                {/* Score Display */}
                <div className="text-center bg-black/20 rounded-lg p-6 backdrop-blur">
                  <div className="text-3xl font-bold text-yellow-400 mb-3">
                    {currentMatch.score}
                  </div>
                  {currentMatch.isLive && (
                    <>
                      <div className="text-lg text-gray-300 mb-2">{currentMatch.currentSet}</div>
                      <div className="text-xl font-semibold text-white">
                        {currentMatch.gameScore}
                      </div>
                      <div className="flex items-center justify-center gap-2 mt-3">
                        <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                        <span className="text-red-400 font-medium">LIVE</span>
                      </div>
                    </>
                  )}
                </div>

                {/* Status Bar */}
                <div className="flex items-center justify-between text-sm text-gray-400 p-3 bg-black/20 rounded-lg backdrop-blur">
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-400' : 'bg-red-400'}`} />
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

        {/* Instructions */}
        <div className="mt-8 text-center text-xs text-gray-400 bg-black/20 rounded-lg p-3 backdrop-blur">
          <p>This window can be opened separately and kept on top of other applications.</p>
          <p className="mt-1">Bookmark this page for quick access to live scores.</p>
        </div>
      </div>
    </div>
  )
}