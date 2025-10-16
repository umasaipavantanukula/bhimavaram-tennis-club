"use client"

import { useState, useEffect, useRef } from "react"
import { X, Maximize2 } from "lucide-react"
import { usePiP } from "@/lib/pip-context"
import { matchOperations, type Match } from "@/lib/firebase-operations"
import Image from "next/image"

export function FloatingPiPWidget() {
  const { isOpen, closePiP } = usePiP()
  const [isPiPActive, setIsPiPActive] = useState(false)
  const [currentMatch, setCurrentMatch] = useState<Match | null>(null)
  const [loading, setLoading] = useState(true)
  const [showPermissionDialog, setShowPermissionDialog] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const parseScore = (scoreString: string) => {
    const parts = scoreString.split("-").map(s => s.trim())
    if (parts.length >= 2) {
      return { player1Score: parts[0], player2Score: parts[1] }
    }
    return { player1Score: "0", player2Score: "0" }
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' })
  }

  useEffect(() => {
    const fetchMatch = async () => {
      try {
        setLoading(true)
        const matches = await matchOperations.getAll()
        const now = new Date()
        
        const liveMatch = matches.find(match => match.status === "live")
        if (liveMatch) {
          setCurrentMatch(liveMatch)
          setLoading(false)
          return
        }
        
        const upcomingMatches = matches
          .filter(match => match.status === "upcoming" && match.date >= now)
          .sort((a, b) => a.date.getTime() - b.date.getTime())
        
        if (upcomingMatches.length > 0) {
          setCurrentMatch(upcomingMatches[0])
        } else {
          const completedMatches = matches
            .filter(match => match.status === "completed")
            .sort((a, b) => b.date.getTime() - a.date.getTime())
          
          if (completedMatches.length > 0) {
            setCurrentMatch(completedMatches[0])
          }
        }
        
        setLoading(false)
      } catch (error) {
        console.error("Error fetching match data:", error)
        setLoading(false)
      }
    }

    fetchMatch()
    const interval = setInterval(fetchMatch, 30000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    if (!isOpen) {
      exitPiP()
    }
  }, [isOpen])

  const drawScoreToCanvas = () => {
    const canvas = canvasRef.current
    if (!canvas || !currentMatch) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const { player1Score, player2Score } = parseScore(currentMatch.score)

    // Rectangle dimensions for PiP (wider aspect ratio)
    canvas.width = 400
    canvas.height = 200

    // Black background
    ctx.fillStyle = "#000000"
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Draw LIVE indicator if status is live
    if (currentMatch.status === "live") {
      ctx.fillStyle = "#ef4444"
      ctx.fillRect(15, 15, 60, 25)
      ctx.fillStyle = "#ffffff"
      ctx.font = "bold 14px Arial"
      ctx.fillText("LIVE", 25, 32)
    }

    ctx.fillStyle = "#84cc16"
    ctx.fillRect(260, 50, 120, 50)
    ctx.fillRect(260, 120, 120, 50)

    ctx.fillStyle = "#ffffff"
    ctx.font = "bold 18px Arial"
    ctx.fillText(currentMatch.player1, 15, 75)
    
    ctx.fillStyle = "#000000"
    ctx.font = "bold 32px Arial"
    ctx.fillText(player1Score, 290, 85)

    ctx.fillStyle = "#ffffff"
    ctx.font = "bold 18px Arial"
    ctx.fillText(currentMatch.player2, 15, 150)
    
    ctx.fillStyle = "#000000"
    ctx.font = "bold 32px Arial"
    ctx.fillText(player2Score, 290, 160)

    ctx.fillStyle = "#ffffff"
    ctx.font = "12px Arial"
    ctx.fillText(`${currentMatch.tournament} • ${formatTime(currentMatch.date)}`, 15, 190)
  }

  const enterPiP = async () => {
    try {
      const video = videoRef.current
      const canvas = canvasRef.current
      
      if (!video || !canvas || !currentMatch) return

      drawScoreToCanvas()

      const stream = canvas.captureStream(30)
      video.srcObject = stream

      if (document.pictureInPictureEnabled && !document.pictureInPictureElement) {
        await video.play()
        await video.requestPictureInPicture()
        setIsPiPActive(true)
      }
    } catch (error) {
      console.error("Failed to enter PiP mode:", error)
      // alert("Picture-in-Picture is not supported in this browser.")
    }
  }

  const exitPiP = async () => {
    try {
      if (document.pictureInPictureElement) {
        await document.exitPictureInPicture()
      }
      setIsPiPActive(false)
    } catch (error) {
      console.error("Failed to exit PiP mode:", error)
    }
  }

  const togglePiP = () => {
    if (isPiPActive) {
      exitPiP()
    } else {
      enterPiP()
    }
  }

  // Show permission dialog when match data is ready
  useEffect(() => {
    if (!loading && currentMatch && !isPiPActive) {
      // Show permission dialog after a short delay
      const timer = setTimeout(() => {
        setShowPermissionDialog(true)
      }, 1000)
      
      return () => clearTimeout(timer)
    }
  }, [loading, currentMatch])

  useEffect(() => {
    if (isPiPActive && currentMatch) {
      const interval = setInterval(() => {
        drawScoreToCanvas()
      }, 1000)

      return () => clearInterval(interval)
    }
  }, [isPiPActive, currentMatch])

  if (!isOpen || loading) return null

  if (!currentMatch) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <div className="bg-gray-900 text-white p-2 rounded-lg shadow-2xl text-xs">
          <p>No matches available</p>
        </div>
      </div>
    )
  }

  const { player1Score, player2Score } = parseScore(currentMatch.score)

  const handleAllowPiP = () => {
    setShowPermissionDialog(false)
    enterPiP()
  }

  const handleDenyPiP = () => {
    setShowPermissionDialog(false)
    // User denied, don't show PiP
  }

  return (
    <>
      <video ref={videoRef} className="hidden" muted playsInline />
      <canvas ref={canvasRef} className="hidden" />

      {/* Permission Dialog */}
      {showPermissionDialog && !isPiPActive && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-gradient-to-br from-gray-900 to-black rounded-2xl shadow-2xl border-2 border-lime-500/50 p-6 max-w-md w-full mx-4 animate-in fade-in zoom-in duration-300">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <Image 
                  src="/logo.png" 
                  alt="Club Logo" 
                  width={48} 
                  height={48} 
                  className="rounded-lg object-contain"
                />
              </div>
              <div className="flex-1">
                <h3 className="text-white text-xl font-bold mb-2">
                  Enable Live Score Floating?
                </h3>
                <p className="text-gray-300 text-sm mb-4">
                  Would you like to enable the floating live score display? It will show the current match score in a small window that stays on top while you browse.
                </p>
                
                {/* Match Preview */}
                <div className="bg-black/40 rounded-lg p-3 mb-4 border border-lime-500/20">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-white text-sm font-semibold">{currentMatch.player1}</span>
                    <span className="bg-lime-500 text-black px-2 py-1 rounded font-bold text-sm">{player1Score}</span>
                  </div>
                  <div className="flex items-center justify-center my-1">
                    <span className="text-lime-500 text-xs font-bold">VS</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-white text-sm font-semibold">{currentMatch.player2}</span>
                    <span className="bg-lime-500 text-black px-2 py-1 rounded font-bold text-sm">{player2Score}</span>
                  </div>
                  <div className="mt-2 pt-2 border-t border-gray-700 text-center">
                    <span className="text-gray-400 text-xs">{currentMatch.tournament}</span>
                    {currentMatch.status === "live" && (
                      <span className="ml-2 text-red-400 text-xs font-bold flex items-center justify-center gap-1 mt-1">
                        <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" />
                        LIVE NOW
                      </span>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <button
                    onClick={handleDenyPiP}
                    className="flex-1 px-4 py-2.5 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-semibold transition-colors"
                  >
                    No Thanks
                  </button>
                  <button
                    onClick={handleAllowPiP}
                    className="flex-1 px-4 py-2.5 bg-lime-500 hover:bg-lime-600 text-black rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
                  >
                    <Maximize2 className="h-4 w-4" />
                    Enable Float
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Show notification when PiP is active */}
      {isPiPActive && (
        <div className="fixed bottom-4 right-4 z-50 bg-black/90 text-white p-3 rounded-lg shadow-2xl max-w-[200px] border border-lime-500/50">
          <div className="flex items-start gap-2">
            <div className="flex-1">
              <div className="font-semibold mb-1 text-sm flex items-center gap-2">
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                Live Score Floating
              </div>
              <div className="text-xs text-gray-300">
                {currentMatch.player1} vs {currentMatch.player2}
              </div>
              <div className="text-xs text-lime-400 mt-1">
                Score: {player1Score} - {player2Score}
              </div>
            </div>
            <button
              onClick={exitPiP}
              className="text-gray-400 hover:text-red-400 transition-colors"
              title="Exit PiP"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </>
  )
}