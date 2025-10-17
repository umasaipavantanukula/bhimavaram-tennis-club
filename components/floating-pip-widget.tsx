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
  const canvas = canvasRef.current;
  if (!canvas || !currentMatch) return;

  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const { player1Score, player2Score } = parseScore(currentMatch.score);

  canvas.width = 700;
  canvas.height = 200;

  const borderRadius = 10;
  const rowHeight = canvas.height / 2;

  // === Background ===
  ctx.fillStyle = "#000000";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // === Outer rounded container ===
  ctx.fillStyle = "#1e1e1e";
  ctx.strokeStyle = "#3a3a3a";
  ctx.lineWidth = 3;

  const roundedRect = (x: number, y: number, w: number, h: number, r: number) => {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h - r);
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx.lineTo(x + r, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();
  };

  roundedRect(5, 5, canvas.width - 10, canvas.height - 10, borderRadius);
  ctx.fill();
  ctx.stroke();

  // === Lime angled ends ===
  const drawAngledBlock = (y: number) => {
    ctx.fillStyle = "#9BE22D";
    ctx.beginPath();
    ctx.moveTo(canvas.width * 0.7, y);
    ctx.lineTo(canvas.width - 5, y);
    ctx.lineTo(canvas.width - 5, y + rowHeight);
    ctx.lineTo(canvas.width * 0.6, y + rowHeight);
    ctx.closePath();
    ctx.fill();
  };

  drawAngledBlock(5);
  drawAngledBlock(rowHeight + 5);

  // === Middle line (draw after green parts so it's visible) ===
  ctx.save();
  const gradient = ctx.createLinearGradient(0, rowHeight, canvas.width, rowHeight);
  gradient.addColorStop(0, "#5b5e61ff");   // light gray on dark side
  gradient.addColorStop(0.6, "#5b5e61ff"); // bright in the middle
  gradient.addColorStop(1, "#5b5e61ff");   // darker near green
  ctx.strokeStyle = gradient;
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(10, rowHeight);
  ctx.lineTo(canvas.width - 10, rowHeight);
  ctx.stroke();
  ctx.restore();

  // === Player Circles ===
  const drawCircle = (x: number, y: number) => {
    ctx.fillStyle = "#8b8b8b";
    ctx.beginPath();
    ctx.arc(x, y, 10, 0, 2 * Math.PI);
    ctx.fill();

    ctx.fillStyle = "#2e2e2e";
    ctx.beginPath();
    ctx.arc(x, y, 5, 0, 2 * Math.PI);
    ctx.fill();
  };

  drawCircle(35, rowHeight / 2);
  drawCircle(35, rowHeight + rowHeight / 2);

  // === Player Names ===
  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 22px Arial";
  ctx.fillText(currentMatch.player1, 65, rowHeight / 2 + 8);
  ctx.fillText(currentMatch.player2, 65, rowHeight + rowHeight / 2 + 8);

  // === Scores ===
  ctx.fillStyle = "#000000";
  ctx.font = "bold 50px Arial";
  const score1Width = ctx.measureText(player1Score).width;
  const score2Width = ctx.measureText(player2Score).width;
  ctx.fillText(player1Score, canvas.width - score1Width - 100, rowHeight / 2 + 15);
  ctx.fillText(player2Score, canvas.width - score2Width - 100, rowHeight + rowHeight / 2 + 15);
    // === LIVE Indicator ===
  if (currentMatch.status === "live") {
    ctx.fillStyle = "#ff0000"
    ctx.beginPath()
    ctx.arc(33, 22, 6, 0, 2 * Math.PI)
    ctx.fill()

    ctx.fillStyle = "#ff4d4d"
    ctx.font = "bold 20px Arial"
    ctx.fillText("Live", 45, 28)
  }
};


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
                {/* <p className="text-gray-300 text-sm mb-4">
                  Would you like to enable the floating live score display? It will show the current match score in a small window that stays on top while you browse.
                </p> */}
                
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
                  {/* <div className="mt-2 pt-2 border-t border-gray-700 text-center">
                    <span className="text-gray-400 text-xs">{currentMatch.tournament}</span>
                    {currentMatch.status === "live" && (
                      <span className="ml-2 text-red-400 text-xs font-bold flex items-center justify-center gap-1 mt-1">
                        <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" />
                        LIVE NOW
                      </span>
                    )}
                  </div> */}
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
      {/* Removed - no notification needed */}
    </>
  )
}
