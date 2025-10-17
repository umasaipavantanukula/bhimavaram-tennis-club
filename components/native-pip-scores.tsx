"use client"

import { useState, useEffect, useRef, useCallback } from "react"
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
  PictureInPicture
} from "lucide-react"
import { matchOperations, type Match } from "@/lib/firebase-operations"
import { getCurrentOrRecentMatches, formatDate } from "@/lib/date-utils"

interface NativePiPProps {
  isOpen: boolean
  onClose: () => void
}

interface LiveMatch extends Match {
  isLive: boolean
  currentSet: string
  gameScore: string
  serverPlayer: 1 | 2
}

export function NativePiPScores({ isOpen, onClose }: NativePiPProps) {
  const [liveMatches, setLiveMatches] = useState<LiveMatch[]>([])
  const [selectedMatchIndex, setSelectedMatchIndex] = useState(0)
  const [isConnected, setIsConnected] = useState(true)
  const [autoUpdate, setAutoUpdate] = useState(true)
  const [soundEnabled, setSoundEnabled] = useState(false)
  const [lastUpdateTime, setLastUpdateTime] = useState<Date>(new Date())
  const [isPiPSupported, setIsPiPSupported] = useState(false)
  const [isPiPActive, setIsPiPActive] = useState(false)
  const [isStartingPiP, setIsStartingPiP] = useState(false)
  
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // Check if Picture-in-Picture is supported
  useEffect(() => {
    setIsPiPSupported('pictureInPictureEnabled' in document)
  }, [])

  // Real-time Firestore listener (replaces polling)
  useEffect(() => {
    if (!isOpen) return

    console.log("🔴 [PiP] Setting up real-time listener for live matches")
    setIsConnected(true)

    // Subscribe to real-time updates from Firestore
    const unsubscribe = matchOperations.subscribeToLiveMatches((matches) => {
      console.log("🔴 [PiP] Real-time update received:", matches.length, "matches")
      
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
      setLastUpdateTime(new Date())

      // Show demo matches if no live matches found
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
    })

    // Cleanup: unsubscribe when component unmounts or isOpen changes
    return () => {
      console.log("🔴 [PiP] Cleaning up real-time listener")
      unsubscribe()
    }
  }, [isOpen])

  const generateCurrentSet = () => {
    const sets = ["Set 1", "Set 2", "Set 3", "Set 4", "Set 5"]
    return sets[Math.floor(Math.random() * 3)]
  }

  const generateGameScore = () => {
    const scores = ["0-0", "15-0", "30-0", "40-0", "15-15", "30-30", "40-40", "Deuce", "Advantage"]
    return scores[Math.floor(Math.random() * scores.length)]
  }

  // Update canvas with score information
  const updateCanvas = useCallback(() => {
    if (!canvasRef.current || liveMatches.length === 0) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    if (!ctx) return

  const currentMatch = liveMatches[selectedMatchIndex]
    if (!currentMatch) return

    // Set canvas size
    canvas.width = 400
    canvas.height = 300

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Background
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height)
    gradient.addColorStop(0, '#1e40af')
    gradient.addColorStop(1, '#7c3aed')
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Header
    ctx.fillStyle = 'white'
    ctx.font = 'bold 18px Arial'
    ctx.textAlign = 'center'
    ctx.fillText('Live Tennis Scores', canvas.width / 2, 30)

  // Tournament
  ctx.font = '14px Arial'
  ctx.fillText(currentMatch.tournament, canvas.width / 2, 55)
  ctx.fillText(currentMatch.court || '', canvas.width / 2, 75)
  // Date
  ctx.font = '12px Arial'
  ctx.fillStyle = '#d1d5db'
  ctx.fillText(formatDate(currentMatch.date), canvas.width / 2, 95)

    // Players
    ctx.font = 'bold 16px Arial'
    ctx.textAlign = 'left'
    ctx.fillStyle = currentMatch.serverPlayer === 1 ? '#10b981' : 'white'
    ctx.fillText(`${currentMatch.player1}`, 30, 120)
    
    ctx.fillStyle = currentMatch.serverPlayer === 2 ? '#10b981' : 'white'
    ctx.fillText(`${currentMatch.player2}`, 30, 150)

    // Score
    ctx.fillStyle = '#fbbf24'
    ctx.font = 'bold 24px Arial'
    ctx.textAlign = 'center'
    ctx.fillText(currentMatch.score, canvas.width / 2, 190)

    // Live info
    if (currentMatch.isLive) {
      ctx.fillStyle = '#ef4444'
      ctx.font = 'bold 12px Arial'
      ctx.fillText('● LIVE', canvas.width / 2, 210)
      
      ctx.fillStyle = 'white'
      ctx.font = '14px Arial'
      ctx.fillText(currentMatch.currentSet, canvas.width / 2, 230)
      ctx.fillText(currentMatch.gameScore, canvas.width / 2, 250)
    }

    // Connection status
    ctx.fillStyle = isConnected ? '#10b981' : '#ef4444'
    ctx.font = '10px Arial'
    ctx.textAlign = 'left'
    ctx.fillText(isConnected ? '● Connected' : '● Offline', 10, 290)

    // Update time
    ctx.fillStyle = 'white'
    ctx.textAlign = 'right'
    ctx.fillText(`Updated: ${lastUpdateTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`, canvas.width - 10, 290)

    // Update video frame
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream
      const track = stream.getVideoTracks()[0]
      if (track) {
        ctx.drawImage(canvas, 0, 0)
      }
    }
  }, [liveMatches, selectedMatchIndex, isConnected, lastUpdateTime])

  // Update canvas whenever matches or selection changes
  useEffect(() => {
    if (liveMatches.length > 0 && isPiPActive) {
      updateCanvas()
    }
  }, [liveMatches, selectedMatchIndex, isPiPActive, updateCanvas])

  // Start Picture-in-Picture mode
  const startPiP = async () => {
    if (!isPiPSupported || !canvasRef.current) {
      alert('Picture-in-Picture is not supported in your browser')
      return
    }

    if (isStartingPiP) return // Prevent multiple simultaneous attempts

    setIsStartingPiP(true)

    try {
      // Update canvas first to ensure we have content
      updateCanvas()
      
      // Wait a bit for canvas to be painted
      await new Promise(resolve => setTimeout(resolve, 100))
      
      // Create a video stream from the canvas
      const stream = canvasRef.current.captureStream(30) // 30 FPS
      
      if (videoRef.current && stream) {
        const video = videoRef.current
        video.srcObject = stream
        
        // Wait for video to be ready
        await new Promise<void>((resolve, reject) => {
          const timeout = setTimeout(() => {
            video.removeEventListener('loadedmetadata', onLoadedMetadata)
            video.removeEventListener('error', onError)
            reject(new Error('Video loading timeout'))
          }, 5000) // 5 second timeout
          
          const onLoadedMetadata = () => {
            clearTimeout(timeout)
            video.removeEventListener('loadedmetadata', onLoadedMetadata)
            video.removeEventListener('error', onError)
            resolve()
          }
          
          const onError = (error: Event) => {
            clearTimeout(timeout)
            video.removeEventListener('loadedmetadata', onLoadedMetadata)
            video.removeEventListener('error', onError)
            reject(new Error('Video failed to load'))
          }
          
          video.addEventListener('loadedmetadata', onLoadedMetadata)
          video.addEventListener('error', onError)
          
          // Start playing the video
          video.play().catch(err => {
            clearTimeout(timeout)
            reject(err)
          })
        })
        
        // Additional check to ensure video is ready
        if (video.readyState >= 1) { // HAVE_METADATA
          // Now request Picture-in-Picture
          await video.requestPictureInPicture()
          setIsPiPActive(true)
        } else {
          throw new Error('Video metadata not ready')
        }
      }
    } catch (error) {
      console.error('Failed to start Picture-in-Picture:', error)
      alert(`Failed to start Picture-in-Picture mode: ${error instanceof Error ? error.message : 'Unknown error'}. Please try again.`)
    } finally {
      setIsStartingPiP(false)
    }
  }

  // Handle PiP events
  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const handleEnterPiP = () => setIsPiPActive(true)
    const handleLeavePiP = () => setIsPiPActive(false)

    video.addEventListener('enterpictureinpicture', handleEnterPiP)
    video.addEventListener('leavepictureinpicture', handleLeavePiP)

    return () => {
      video.removeEventListener('enterpictureinpicture', handleEnterPiP)
      video.removeEventListener('leavepictureinpicture', handleLeavePiP)
    }
  }, [])

  // Update canvas when data changes
  useEffect(() => {
    updateCanvas()
  }, [updateCanvas])

  const currentMatch = liveMatches[selectedMatchIndex]

  if (!isOpen) return null

  return (
    <div className="fixed top-2 right-2 z-[9999] w-[280px] sm:w-80 md:w-96">
      <Card className="bg-white dark:bg-gray-900 shadow-2xl border border-gray-200 dark:border-gray-700">
        {/* Compact Header */}
        <div className="flex items-center justify-between px-3 py-2 bg-gradient-to-r from-primary/90 to-primary text-white rounded-t-lg">
          <div className="flex items-center gap-1.5">
            <Trophy className="h-3.5 w-3.5" />
            <span className="text-xs font-semibold">Live Scores</span>
            {currentMatch?.isLive && (
              <Badge variant="secondary" className="bg-green-500/20 text-green-100 text-[10px] px-1.5 py-0">
                LIVE
              </Badge>
            )}
          </div>

          <div className="flex items-center gap-1">
            {isPiPSupported && (
              <Button
                variant="ghost"
                size="sm"
                className="h-5 w-5 p-0 text-white hover:bg-white/20"
                onClick={startPiP}
                disabled={isStartingPiP}
              >
                {isStartingPiP ? (
                  <div className="h-2.5 w-2.5 animate-spin rounded-full border border-white border-t-transparent" />
                ) : (
                  <PictureInPicture className="h-2.5 w-2.5" />
                )}
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              className="h-5 w-5 p-0 text-white hover:bg-white/20"
              onClick={onClose}
            >
              <X className="h-2.5 w-2.5" />
            </Button>
          </div>
        </div>

        {/* Compact Content */}
        <div className="p-2.5 space-y-2">
          {liveMatches.length === 0 ? (
            <div className="text-center py-4">
              <Clock className="h-6 w-6 text-gray-400 mx-auto mb-1" />
              <p className="text-xs text-gray-500">No live matches</p>
            </div>
          ) : (
            <>
              {/* Match Navigation - Compact */}
              {liveMatches.length > 1 && (
                <div className="flex gap-1">
                  {liveMatches.map((_, index) => (
                    <Button
                      key={index}
                      variant={selectedMatchIndex === index ? "default" : "outline"}
                      size="sm"
                      className="h-5 px-2 text-[10px]"
                      onClick={() => setSelectedMatchIndex(index)}
                    >
                      M{index + 1}
                    </Button>
                  ))}
                </div>
              )}

              {/* Current Match - Ultra Compact */}
              {currentMatch && (
                <div className="space-y-2">
                  {/* Tournament - Minimal */}
                  <div className="text-center">
                    <h3 className="font-semibold text-xs text-gray-900 dark:text-white truncate">
                      {currentMatch.tournament}
                    </h3>
                  </div>

                  {/* Players - Compact */}
                  <div className="space-y-1">
                    <div className={`flex items-center justify-between px-2 py-1 rounded text-xs ${
                      currentMatch.serverPlayer === 1 ? 'bg-primary/10 border-l border-primary' : 'bg-gray-50 dark:bg-gray-800'
                    }`}>
                      <span className="font-medium truncate">{currentMatch.player1}</span>
                    </div>
                    
                    <div className={`flex items-center justify-between px-2 py-1 rounded text-xs ${
                      currentMatch.serverPlayer === 2 ? 'bg-primary/10 border-l border-primary' : 'bg-gray-50 dark:bg-gray-800'
                    }`}>
                      <span className="font-medium truncate">{currentMatch.player2}</span>
                    </div>
                  </div>

                  {/* Score - Compact */}
                  <div className="text-center space-y-0.5">
                    <div className="font-bold text-base text-primary">{currentMatch.score}</div>
                    {currentMatch.isLive && currentMatch.gameScore && (
                      <div className="text-xs font-medium text-primary">{currentMatch.gameScore}</div>
                    )}
                  </div>

                  {/* Status - Minimal */}
                  <div className="flex items-center justify-between text-[10px] text-gray-500 pt-1 border-t">
                    <div className="flex items-center gap-1">
                      <div className={`w-1.5 h-1.5 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
                      <span>{isConnected ? 'Live' : 'Offline'}</span>
                    </div>
                    <div>
                      {lastUpdateTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </Card>

      {/* Hidden elements for PiP */}
      <canvas ref={canvasRef} width={400} height={300} style={{ display: 'none' }} />
      <video ref={videoRef} style={{ display: 'none' }} muted playsInline autoPlay loop controls={false} width={400} height={300} />
    </div>
  )
}