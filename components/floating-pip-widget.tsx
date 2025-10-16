"use client"

import { useState, useEffect, useRef } from "react"
import { X, Minimize2, Maximize2, BarChart3 } from "lucide-react"
import { usePiP } from "@/lib/pip-context"
import { matchOperations, type Match } from "@/lib/firebase-operations"
import Image from "next/image"

export function FloatingPiPWidget() {
  const { isOpen, closePiP } = usePiP()
  const [isMinimized, setIsMinimized] = useState(false)
  const [isPiPActive, setIsPiPActive] = useState(false)
  const [currentMatch, setCurrentMatch] = useState<Match | null>(null)
  const [loading, setLoading] = useState(true)
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

    canvas.width = 200
    canvas.height = 150

    ctx.fillStyle = "#000000"
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    if (currentMatch.status === "live") {
      ctx.fillStyle = "#ef4444"
      ctx.fillRect(10, 10, 40, 15)
      ctx.fillStyle = "#ffffff"
      ctx.font = "bold 8px Arial"
      ctx.fillText("LIVE", 15, 20)
    }

    ctx.fillStyle = "#84cc16"
    ctx.fillRect(110, 35, 80, 30)
    ctx.fillRect(110, 85, 80, 30)

    ctx.fillStyle = "#ffffff"
    ctx.font = "bold 10px Arial"
    ctx.fillText(currentMatch.player1, 10, 50)
    
    ctx.fillStyle = "#000000"
    ctx.font = "bold 18px Arial"
    ctx.fillText(player1Score, 135, 55)

    ctx.fillStyle = "#ffffff"
    ctx.font = "bold 10px Arial"
    ctx.fillText(currentMatch.player2, 10, 100)
    
    ctx.fillStyle = "#000000"
    ctx.font = "bold 18px Arial"
    ctx.fillText(player2Score, 135, 105)

    ctx.fillStyle = "#ffffff"
    ctx.font = "7px Arial"
    ctx.fillText(currentMatch.tournament, 10, 125)
    ctx.fillText(formatDate(currentMatch.date), 10, 135)
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
      alert("Picture-in-Picture is not supported in this browser.")
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

  // Auto-open PiP on page load when a match is available
  useEffect(() => {
    if (!loading && currentMatch && !isPiPActive && document.pictureInPictureEnabled) {
      enterPiP()
    }
  }, [loading, currentMatch, isPiPActive])

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

  return (
    <>
      <video ref={videoRef} className="hidden" muted playsInline />
      <canvas ref={canvasRef} className="hidden" />

      {!isPiPActive && (
        <div className={`fixed bottom-4 right-4 z-50 transition-all duration-300 ${isMinimized ? "w-10 h-10" : "w-[280px]"}`}>
          {isMinimized ? (
            <button
              onClick={() => setIsMinimized(false)}
              className="w-full h-full bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center text-white font-bold hover:scale-110 transition-transform shadow-lg"
            >
              <span className="text-sm">🎾</span>
            </button>
          ) : (
            <div className="bg-black rounded-xl overflow-hidden shadow-2xl border border-gray-800">
              <div className="bg-gradient-to-r from-gray-900 to-black px-3 py-2 flex items-center justify-between border-b border-gray-800">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-bold">TC</span>
                  </div>
                  <div>
                    <div className="text-white text-xs font-bold">Tennis Club</div>
                    <div className="flex items-center gap-1">
                      {currentMatch.status === "live" && (
                        <>
                          <Image 
                            src="/logo.png" 
                            alt="Club Logo" 
                            width={16} 
                            height={16} 
                            className="rounded-sm object-contain"
                          />
                          <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                          <span className="text-red-400 text-[10px] font-bold">LIVE</span>
                        </>
                      )}
                      {currentMatch.status === "upcoming" && (
                        <>
                          <Image 
                            src="/logo.png" 
                            alt="Club Logo" 
                            width={16} 
                            height={16} 
                            className="rounded-sm object-contain"
                          />
                          <span className="text-blue-400 text-[10px] font-bold">UPCOMING</span>
                        </>
                      )}
                      {currentMatch.status === "completed" && (
                        <>
                          <Image 
                            src="/logo.png" 
                            alt="Club Logo" 
                            width={16} 
                            height={16} 
                            className="rounded-sm object-contain"
                          />
                          <span className="text-gray-400 text-[10px] font-bold">COMPLETED</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={togglePiP}
                    className="p-1.5 hover:bg-white/10 rounded-full transition-colors"
                    title="Float on screen"
                  >
                    <Maximize2 className="h-3.5 w-3.5 text-gray-400" />
                  </button>
                  <button
                    onClick={() => setIsMinimized(true)}
                    className="p-1.5 hover:bg-white/10 rounded-full transition-colors"
                  >
                    <Minimize2 className="h-3.5 w-3.5 text-gray-400" />
                  </button>
                  <button
                    onClick={closePiP}
                    className="p-1.5 hover:bg-white/10 rounded-full transition-colors"
                  >
                    <X className="h-3.5 w-3.5 text-gray-400" />
                  </button>
                </div>
              </div>

              <div className="p-1">
                <div className="space-y-1">
                  <div className="flex items-center justify-between py-0.5 border-b border-gray-800">
                    <span className="text-white text-[10px] font-bold">{currentMatch.player1}</span>
                    <div className="bg-lime-500 text-black px-1.5 py-0.5 rounded font-bold text-sm min-w-[30px] text-center">
                      {player1Score}
                    </div>
                  </div>
                  <div className="flex items-center justify-between py-0.5">
                    <span className="text-white text-[10px] font-bold">{currentMatch.player2}</span>
                    <div className="bg-lime-500 text-black px-1.5 py-0.5 rounded font-bold text-sm min-w-[30px] text-center">
                      {player2Score}
                    </div>
                  </div>
                </div>

                <div className="mt-1 pt-1 border-t border-gray-800 space-y-0.5">
                  <div className="flex items-center justify-between text-[8px]">
                    <span className="text-gray-400">Tournament</span>
                    <span className="text-white font-medium">{currentMatch.tournament}</span>
                  </div>
                  {currentMatch.court && (
                    <div className="flex items-center justify-between text-[8px]">
                      <span className="text-gray-400">Court</span>
                      <span className="text-white font-medium">{currentMatch.court}</span>
                    </div>
                  )}
                  <div className="flex items-center justify-between text-[8px]">
                    <span className="text-gray-400">Date</span>
                    <span className="text-white font-medium">{formatDate(currentMatch.date)}</span>
                  </div>
                  <div className="flex items-center justify-between text-[8px]">
                    <span className="text-gray-400">Time</span>
                    <span className="text-white font-medium">{formatTime(currentMatch.date)}</span>
                  </div>
                </div>

                <button
                  className="w-full mt-1 bg-lime-500 hover:bg-lime-600 text-black font-bold py-1 rounded text-[10px] flex items-center justify-center gap-1 transition-colors"
                  onClick={() => window.location.href = '/tournaments'}
                >
                  <BarChart3 className="h-3 w-3" />
                  View Stats
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {isPiPActive && (
        <div className="fixed bottom-4 right-4 z-50 bg-black/90 text-white p-2 rounded-lg shadow-2xl max-w-[120px] text-[10px]">
          <div className="flex items-start gap-1.5">
            <div className="flex-1">
              <div className="font-semibold mb-0.5">PiP Active</div>
              <div className="text-gray-300">
                Score floating now!
              </div>
            </div>
            <button
              onClick={exitPiP}
              className="text-white hover:text-red-400 transition-colors"
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