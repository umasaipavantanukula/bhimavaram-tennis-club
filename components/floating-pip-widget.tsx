"use client"

import { useState, useEffect, useRef } from "react"
import { X, Minimize2, Maximize2, BarChart3 } from "lucide-react"
import { usePiP } from "@/lib/pip-context"

export function FloatingPiPWidget() {
  const { isOpen, closePiP } = usePiP()
  const [isMinimized, setIsMinimized] = useState(false)
  const [isPiPActive, setIsPiPActive] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // Mock match data (replace with real data from your context/API)
  const currentMatch = {
    player1: "USP",
    player2: "CHINTU",
    score1: "5",
    score2: "3",
    sets: "Set 3",
    status: "LIVE",
    time: "18:06"
  }

  useEffect(() => {
    if (!isOpen) {
      exitPiP()
    }
  }, [isOpen])

  const drawScoreToCanvas = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas size
    canvas.width = 400
    canvas.height = 300

    // Clear canvas
    ctx.fillStyle = "#000000"
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Draw LIVE indicator
    ctx.fillStyle = "#ef4444"
    ctx.fillRect(20, 20, 80, 30)
    ctx.fillStyle = "#ffffff"
    ctx.font = "bold 16px Arial"
    ctx.fillText("LIVE", 35, 42)

    // Draw SCORE section background
    ctx.fillStyle = "#14b8a6"
    ctx.fillRect(220, 80, 160, 140)

    // Draw "SCORE" text
    ctx.fillStyle = "#ffffff"
    ctx.font = "bold 14px Arial"
    ctx.fillText("SCORE", 265, 105)

    // Draw main score
    ctx.font = "bold 72px Arial"
    ctx.fillText(currentMatch.score1, 260, 175)

    // Draw time
    ctx.font = "16px Arial"
    ctx.fillText(currentMatch.time, 260, 205)

    // Draw player names
    ctx.fillStyle = "#ffffff"
    ctx.font = "bold 24px Arial"
    ctx.fillText(currentMatch.player1, 20, 100)
    ctx.fillText(currentMatch.player2, 20, 180)

    // Draw match info
    ctx.font = "14px Arial"
    ctx.fillText(currentMatch.sets, 20, 250)
    ctx.fillText("15 Oct 2025", 20, 280)
  }

  const enterPiP = async () => {
    try {
      const video = videoRef.current
      const canvas = canvasRef.current
      
      if (!video || !canvas) return

      // Draw score to canvas
      drawScoreToCanvas()

      // Capture canvas stream
      const stream = canvas.captureStream(30)
      video.srcObject = stream

      // Enter Picture-in-Picture
      if (document.pictureInPictureEnabled && !document.pictureInPictureElement) {
        await video.play()
        await video.requestPictureInPicture()
        setIsPiPActive(true)
      }
    } catch (error) {
      console.error("Failed to enter PiP mode:", error)
      alert("Picture-in-Picture is not supported in this browser. Please use Chrome, Edge, or Safari.")
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

  // Update canvas periodically (e.g., when score changes)
  useEffect(() => {
    if (isPiPActive) {
      const interval = setInterval(() => {
        drawScoreToCanvas()
      }, 1000) // Update every second

      return () => clearInterval(interval)
    }
  }, [isPiPActive, currentMatch])

  if (!isOpen) return null

  return (
    <>
      {/* Hidden video and canvas elements */}
      <video
        ref={videoRef}
        style={{ display: "none" }}
        muted
        playsInline
      />
      <canvas
        ref={canvasRef}
        style={{ display: "none" }}
      />

      {/* Floating widget (shows when not in PiP mode) */}
      {!isPiPActive && (
        <div
          className={`fixed bottom-4 right-4 z-50 transition-all duration-300 ${
            isMinimized ? "w-12 h-12" : "w-[240px]"
          }`}
          style={{
            boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
          }}
        >
          {isMinimized ? (
            // Minimized view - small circle
            <button
              onClick={() => setIsMinimized(false)}
              className="w-full h-full bg-gradient-to-br from-purple-600 to-blue-600 rounded-full flex items-center justify-center text-white font-bold hover:scale-110 transition-transform shadow-lg"
            >
              <span className="text-sm">⚡</span>
            </button>
          ) : (
            // Expanded view - Compact design matching the attached image
            <div className="bg-gradient-to-br from-purple-600 via-purple-500 to-blue-500 rounded-xl overflow-hidden shadow-2xl">
              {/* Content */}
              <div className="p-2.5 flex items-center gap-2.5">
                {/* Left: Team Icon Circle */}
                <div className="flex-shrink-0 w-9 h-9 bg-white rounded-full flex items-center justify-center shadow-md">
                  <div className="w-7 h-7 bg-gradient-to-br from-purple-600 to-blue-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-[10px] font-bold">⚡</span>
                  </div>
                </div>

                {/* Center: Match Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse"></div>
                    <span className="text-white font-bold text-xs truncate">
                      {currentMatch.player1} vs {currentMatch.player2}
                    </span>
                  </div>
                  <div className="text-white/90 text-[10px] font-medium">
                    {currentMatch.score1} - {currentMatch.sets}
                  </div>
                </div>

                {/* Right: Chart Icon Button */}
                <button
                  onClick={togglePiP}
                  className="flex-shrink-0 w-7 h-7 bg-white/20 hover:bg-white/30 rounded-lg flex items-center justify-center transition-colors"
                  title="Open in Picture-in-Picture"
                >
                  <BarChart3 className="h-3.5 w-3.5 text-white" />
                </button>

                {/* Close button */}
                <button
                  onClick={closePiP}
                  className="flex-shrink-0 w-5 h-5 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors"
                  title="Close"
                >
                  <X className="h-2.5 w-2.5 text-white" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Instructions overlay when PiP is active */}
      {isPiPActive && (
        <div className="fixed bottom-4 right-4 z-50 bg-black/90 text-white p-4 rounded-lg shadow-2xl max-w-xs">
          <div className="flex items-start gap-3">
            <div className="flex-1">
              <div className="font-semibold mb-1">Picture-in-Picture Active</div>
              <div className="text-sm text-gray-300">
                The score is now floating on top of all windows. You can move it around and continue browsing!
              </div>
            </div>
            <button
              onClick={exitPiP}
              className="text-white hover:text-red-400 transition-colors"
              title="Exit PiP"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
      )}
    </>
  )
}
