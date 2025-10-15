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
  const logoImgRef = useRef<HTMLImageElement | null>(null)
  const [logoLoaded, setLogoLoaded] = useState(false)

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

  // Load logo once when component mounts
  useEffect(() => {
    const logoImg = new Image()
    logoImg.crossOrigin = 'anonymous'
    logoImg.onload = () => {
      logoImgRef.current = logoImg
      setLogoLoaded(true)
    }
    logoImg.onerror = () => {
      logoImgRef.current = null
      setLogoLoaded(true)
    }
    logoImg.src = '/logo.png'
  }, [])

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
    canvas.width = 420
    canvas.height = 280

    // Draw immediately with cached logo (or without if not loaded)
    drawCanvasContent(ctx, canvas, logoImgRef.current)
  }

  const drawCanvasContent = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, logoImg: HTMLImageElement | null) => {

    // Helper function for rounded rectangles
    const drawRoundedRect = (x: number, y: number, w: number, h: number, r: number) => {
      ctx.beginPath()
      ctx.moveTo(x + r, y)
      ctx.lineTo(x + w - r, y)
      ctx.quadraticCurveTo(x + w, y, x + w, y + r)
      ctx.lineTo(x + w, y + h - r)
      ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h)
      ctx.lineTo(x + r, y + h)
      ctx.quadraticCurveTo(x, y + h, x, y + h - r)
      ctx.lineTo(x, y + r)
      ctx.quadraticCurveTo(x, y, x + r, y)
      ctx.closePath()
    }

    // Create gradient background
    const bgGradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height)
    bgGradient.addColorStop(0, '#1e293b')
    bgGradient.addColorStop(0.5, '#334155')
    bgGradient.addColorStop(1, '#0f172a')
    
    // Fill background with gradient
    ctx.fillStyle = bgGradient
    drawRoundedRect(0, 0, canvas.width, canvas.height, 16)
    ctx.fill()

    // Add subtle border
    ctx.strokeStyle = '#10b981'
    ctx.lineWidth = 2
    drawRoundedRect(1, 1, canvas.width - 2, canvas.height - 2, 15)
    ctx.stroke()

    // Header section with logo area
    const headerGradient = ctx.createLinearGradient(0, 0, canvas.width, 60)
    headerGradient.addColorStop(0, '#059669')
    headerGradient.addColorStop(1, '#0d9488')
    ctx.fillStyle = headerGradient
    drawRoundedRect(8, 8, canvas.width - 16, 52, 12)
    ctx.fill()

    // Tournament title
    ctx.fillStyle = '#ffffff'
    ctx.font = 'bold 16px Arial, sans-serif'
    ctx.fillText('BHIMAVARAM OPEN', 60, 35)

    // Draw logo background circle
    ctx.fillStyle = '#ffffff'
    ctx.beginPath()
    ctx.arc(35, 35, 20, 0, 2 * Math.PI)
    ctx.fill()
    
    // Draw the PNG logo if loaded, otherwise draw fallback
    if (logoImg) {
      ctx.save()
      ctx.beginPath()
      ctx.arc(35, 35, 18, 0, 2 * Math.PI)
      ctx.clip()
      ctx.drawImage(logoImg, 17, 17, 36, 36)
      ctx.restore()
    } else {
      // Fallback design
      ctx.fillStyle = '#b7098cff'
      ctx.beginPath()
      ctx.arc(35, 35, 16, 0, 2 * Math.PI)
      ctx.fill()
      
      ctx.fillStyle = '#ffffff'
      ctx.font = 'bold 16px Arial'  
      ctx.textAlign = 'center'
      ctx.fillText('🎾', 35, 40)
      ctx.textAlign = 'left'
    }

    // LIVE indicator
    if (currentMatch.status === 'LIVE') {
      ctx.fillStyle = '#ef4444'
      drawRoundedRect(15, 80, 50, 25, 8)
      ctx.fill()
      
      ctx.fillStyle = '#ffffff'
      ctx.font = 'bold 12px Arial'
      ctx.fillText('LIVE', 25, 97)
      
      // Pulsing dot
      ctx.fillStyle = '#ef4444'
      ctx.beginPath()
      ctx.arc(72, 92, 4, 0, 2 * Math.PI)
      ctx.fill()
    }

    // Player 1
    ctx.fillStyle = 'rgba(30, 41, 59, 0.8)'
    drawRoundedRect(15, 120, 180, 40, 8)
    ctx.fill()
    
    ctx.strokeStyle = '#10b981'
    ctx.lineWidth = 1
    drawRoundedRect(15, 120, 180, 40, 8)
    ctx.stroke()
    
    ctx.fillStyle = '#ffffff'
    ctx.font = 'bold 16px Arial'
    ctx.fillText(currentMatch.player1, 25, 145)
    
    // Player 2
    ctx.fillStyle = 'rgba(30, 41, 59, 0.8)'
    drawRoundedRect(15, 170, 180, 40, 8)
    ctx.fill()
    
    ctx.strokeStyle = '#10b981'
    ctx.lineWidth = 1
    drawRoundedRect(15, 170, 180, 40, 8)
    ctx.stroke()
    
    ctx.fillStyle = '#ffffff'
    ctx.font = 'bold 16px Arial'
    ctx.fillText(currentMatch.player2, 25, 195)

    // Score panel with attractive gradient
    const scoreGradient = ctx.createLinearGradient(220, 80, 420, 220)
    scoreGradient.addColorStop(0, '#10b981')
    scoreGradient.addColorStop(0.5, '#059669')
    scoreGradient.addColorStop(1, '#047857')
    
    ctx.fillStyle = scoreGradient
    drawRoundedRect(220, 80, 185, 140, 12)
    ctx.fill()

    // Score panel border glow
    ctx.shadowColor = '#10b981'
    ctx.shadowBlur = 10
    ctx.strokeStyle = '#34d399'
    ctx.lineWidth = 2
    drawRoundedRect(220, 80, 185, 140, 12)
    ctx.stroke()
    ctx.shadowBlur = 0

    // "SCORE" label
    ctx.fillStyle = 'rgba(255, 255, 255, 0.9)'
    ctx.font = 'bold 14px Arial'
    ctx.textAlign = 'center'
    ctx.fillText('SCORE', 312, 105)

    // Main score with shadow effect
    ctx.shadowColor = 'rgba(0, 0, 0, 0.5)'
    ctx.shadowOffsetX = 2
    ctx.shadowOffsetY = 2
    ctx.shadowBlur = 4
    
    ctx.fillStyle = '#ffffff'
    ctx.font = 'bold 48px Arial'
    ctx.fillText(currentMatch.score1, 312, 160)
    
    ctx.shadowOffsetX = 0
    ctx.shadowOffsetY = 0
    ctx.shadowBlur = 0

    // Time
    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)'
    ctx.font = '14px Arial'
    ctx.fillText(currentMatch.time, 312, 185)

    // Set info
    ctx.fillStyle = 'rgba(255, 255, 255, 0.7)'
    ctx.font = '12px Arial'
    ctx.fillText(currentMatch.sets, 312, 205)

    // Footer with date
    ctx.fillStyle = 'rgba(30, 41, 59, 0.6)'
    drawRoundedRect(15, 235, canvas.width - 30, 30, 8)
    ctx.fill()
    
    ctx.fillStyle = '#10b981'
    ctx.font = '11px Arial'
    ctx.textAlign = 'left'
    ctx.fillText('Oct 15, 2025', 25, 252)
    
    ctx.textAlign = 'right'
    ctx.fillText('Tournament Match', canvas.width - 25, 252)
    
    ctx.textAlign = 'left'
  }

  const enterPiP = async () => {
    try {
      const video = videoRef.current
      const canvas = canvasRef.current
      
      if (!video || !canvas) return

      // Wait for logo to be loaded before drawing
      if (!logoLoaded) {
        // If logo is still loading, wait a bit
        await new Promise(resolve => setTimeout(resolve, 500))
      }

      // Draw score to canvas
      drawScoreToCanvas()

      // Capture canvas stream with a lower frame rate to prevent flickering
      const stream = canvas.captureStream(1) // 1 FPS instead of 30
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
    if (isPiPActive && logoLoaded) {
      // Initial draw
      drawScoreToCanvas()
      
      // Then update every 5 seconds (less frequent to reduce flickering)
      const interval = setInterval(() => {
        drawScoreToCanvas()
      }, 5000) // Update every 5 seconds instead of 1

      return () => clearInterval(interval)
    }
  }, [isPiPActive, currentMatch, logoLoaded])

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
            // Minimized view - small circle with logo
            <button
              onClick={() => setIsMinimized(false)}
              className="w-full h-full bg-gradient-to-br from-purple-600 to-blue-600 rounded-full flex items-center justify-center text-white font-bold hover:scale-110 transition-transform shadow-lg overflow-hidden"
            >
              <img 
                src="/logo.png" 
                alt="Bhimavaram Open" 
                className="w-8 h-8 object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.outerHTML = '<span class="text-sm">🎾</span>';
                }}
              />
            </button>
          ) : (
            // Expanded view - Purple/Blue gradient design
            <div className="bg-gradient-to-br from-purple-600 via-purple-500 to-blue-500 rounded-xl overflow-hidden shadow-2xl">
              {/* Content */}
              <div className="p-2.5 flex items-center gap-2.5">
                {/* Left: Bhimavaram Open Logo */}
                <div className="flex-shrink-0 w-9 h-9 bg-white rounded-full flex items-center justify-center shadow-md">
                  <img 
                    src="/logo.png" 
                    alt="Bhimavaram Open" 
                    className="w-7 h-7 rounded-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      const parent = target.parentElement;
                      if (parent) {
                        parent.innerHTML = '<div class="w-7 h-7 bg-gradient-to-br from-purple-600 to-blue-500 rounded-full flex items-center justify-center"><span class="text-white text-[8px] font-bold">🎾</span></div>';
                      }
                    }}
                  />
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
    </>
  )
}

export default FloatingPiPWidget
