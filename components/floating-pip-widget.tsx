"use client"

import { useState, useEffect, useRef } from "react"
import { X, Minimize2, Maximize2 } from "lucide-react"
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
            isMinimized ? "w-16 h-16" : "w-[320px] sm:w-[380px]"
          }`}
          style={{
            boxShadow: "0 8px 32px rgba(0, 0, 0, 0.4)",
          }}
        >
          {isMinimized ? (
            // Minimized view
            <button
              onClick={() => setIsMinimized(false)}
              className="w-full h-full bg-gradient-to-br from-teal-500 to-teal-600 rounded-full flex items-center justify-center text-white font-bold text-xl hover:scale-110 transition-transform shadow-lg"
            >
              {currentMatch.score1}
            </button>
          ) : (
            // Expanded view - Modern design matching the image
            <div className="bg-black rounded-lg overflow-hidden shadow-2xl">
              {/* Header with controls */}
              <div className="flex justify-between items-center p-2 bg-gray-900">
                <div className="flex items-center gap-2">
                  <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                    {currentMatch.status}
                  </span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={togglePiP}
                    className="text-white hover:text-teal-400 transition-colors p-1"
                    title="Open in Picture-in-Picture"
                  >
                    <Maximize2 className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setIsMinimized(true)}
                    className="text-white hover:text-yellow-400 transition-colors p-1"
                    title="Minimize"
                  >
                    <Minimize2 className="h-4 w-4" />
                  </button>
                  <button
                    onClick={closePiP}
                    className="text-white hover:text-red-400 transition-colors p-1"
                    title="Close"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Main content */}
              <div className="flex">
                {/* Left side - Player info */}
                <div className="flex-1 p-4 text-white">
                  <div className="space-y-4">
                    {/* Player 1 */}
                    <div>
                      <div className="text-lg font-bold">{currentMatch.player1}</div>
                      <div className="text-sm text-gray-400">Player 1</div>
                    </div>

                    {/* Player 2 */}
                    <div>
                      <div className="text-lg font-bold">{currentMatch.player2}</div>
                      <div className="text-sm text-gray-400">Player 2</div>
                    </div>

                    {/* Match info */}
                    <div className="text-xs text-gray-400 mt-4">
                      <div>{currentMatch.sets}</div>
                      <div className="mt-1">15 Oct 2025</div>
                    </div>
                  </div>
                </div>

                {/* Right side - Score (Teal section) */}
                <div className="w-32 bg-gradient-to-br from-teal-400 to-teal-600 flex flex-col items-center justify-center text-white">
                  <div className="text-xs font-semibold mb-2">SCORE</div>
                  <div className="text-5xl font-extrabold">{currentMatch.score1}</div>
                  <div className="text-sm mt-2">{currentMatch.time}</div>
                  <div className="text-xs mt-1 opacity-75">TEST</div>
                </div>
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
