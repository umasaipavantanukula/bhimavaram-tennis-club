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

  // Auto-refresh interval
  useEffect(() => {
    let interval: NodeJS.Timeout

    if (autoUpdate && isOpen) {
      interval = setInterval(() => {
        loadLiveMatches()
        updateCanvas()
        setLastUpdateTime(new Date())
      }, 5000) // Update every 5 seconds
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
        // Create demo matches
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
            {isPiPSupported && (
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0 text-white hover:bg-white/20 disabled:opacity-50"
                onClick={startPiP}
                disabled={isStartingPiP}
                title={isStartingPiP ? "Starting Picture-in-Picture..." : "Open in Picture-in-Picture"}
              >
                {isStartingPiP ? (
                  <div className="h-3 w-3 animate-spin rounded-full border border-white border-t-transparent" />
                ) : (
                  <PictureInPicture className="h-3 w-3" />
                )}
              </Button>
            )}
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
          {/* Picture-in-Picture Status */}
          {isPiPActive && (
            <div className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
              <div className="flex items-center justify-center gap-2 text-green-700 dark:text-green-300">
                <PictureInPicture className="h-4 w-4" />
                <span className="text-sm font-medium">Picture-in-Picture Active</span>
              </div>
              <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                Scores are now showing in a system overlay window
              </p>
            </div>
          )}

          {/* Browser PiP Info */}
          {isPiPSupported && !isPiPActive && (
            <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <div className="flex items-center justify-center gap-2 text-blue-700 dark:text-blue-300 mb-2">
                <PictureInPicture className="h-4 w-4" />
                <span className="text-sm font-medium">Native Picture-in-Picture Available</span>
              </div>
              <Button
                onClick={startPiP}
                disabled={isStartingPiP}
                size="sm"
                className="bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50"
              >
                {isStartingPiP ? (
                  <>
                    <div className="h-3 w-3 mr-1 animate-spin rounded-full border border-white border-t-transparent" />
                    Starting...
                  </>
                ) : (
                  <>
                    <ExternalLink className="h-3 w-3 mr-1" />
                    Open System Overlay
                  </>
                )}
              </Button>
              <p className="text-xs text-blue-600 dark:text-blue-400 mt-2">
                This will create a system-level window that stays on top of other applications
              </p>
            </div>
          )}

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
      </Card>

      {/* Hidden elements for PiP */}
      <canvas
        ref={canvasRef}
        width={400}
        height={300}
        style={{ display: 'none' }}
      />
      <video
        ref={videoRef}
        style={{ display: 'none' }}
        muted
        playsInline
        autoPlay
        loop
        controls={false}
        width={400}
        height={300}
        preload="metadata"
      />
    </div>
  )
}