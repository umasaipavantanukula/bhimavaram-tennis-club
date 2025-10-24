"use client"

import { useState, useEffect, useRef } from "react"
import { X, Maximize2 } from "lucide-react"
import { usePiP } from "@/lib/pip-context"
import Image from "next/image"

// Using SQL-backed API instead of Firebase for floating PiP
type Match = {
  id?: string
  player1?: string | null
  player2?: string | null
  score?: string
  date?: string | null
  tournament?: string | null
  status?: "upcoming" | "completed" | "live" | string | null
  court?: string | null
  createdAt?: string | null
  live_link?: string | null
}

export function FloatingPiPWidget() {
  const { isOpen, closePiP } = usePiP()
  const [isPiPActive, setIsPiPActive] = useState(false)
  const [currentMatch, setCurrentMatch] = useState<Match | null>(null)
  const [loading, setLoading] = useState(true)
  const [showPermissionDialog, setShowPermissionDialog] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const parseScore = (scoreString?: string) => {
    const parts = (scoreString || "0-0").split("-").map(s => s.trim())
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

        const res = await fetch('/api/matches')
        if (!res.ok) throw new Error('Failed to fetch matches')
        const data = await res.json()
        const matches: Match[] = (data.matches || []).map((m: any) => ({ ...m, date: m.date ? new Date(m.date).toISOString() : null }))

        const now = new Date()

        const liveMatch = matches.find(match => match.status === "live")
        if (liveMatch) {
          setCurrentMatch({ ...liveMatch, date: liveMatch.date ? new Date(liveMatch.date).toString() : undefined } as any)
          setLoading(false)
          return
        }

        const upcomingMatches = matches
          .filter(match => match.status === "upcoming" && match.date && new Date(match.date) >= now)
          .sort((a, b) => (new Date(a.date || 0).getTime()) - (new Date(b.date || 0).getTime()))

        if (upcomingMatches.length > 0) {
          setCurrentMatch({ ...upcomingMatches[0], date: upcomingMatches[0].date ? new Date(upcomingMatches[0].date).toString() : undefined } as any)
        } else {
          const completedMatches = matches
            .filter(match => match.status === "completed")
            .sort((a, b) => (new Date(b.date || 0).getTime()) - (new Date(a.date || 0).getTime()))

          if (completedMatches.length > 0) {
            setCurrentMatch({ ...completedMatches[0], date: completedMatches[0].date ? new Date(completedMatches[0].date).toString() : undefined } as any)
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

  const { player1Score, player2Score } = parseScore(currentMatch.score ?? '0-0');

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

  drawAngledBlock(2);
<<<<<<< HEAD
  drawAngledBlock(rowHeight + 5);
=======
  drawAngledBlock(rowHeight + 4);
>>>>>>> 96415a91206b862650a70654c0b8dfd7d0e2294c

  // === Middle line (draw after green parts so it's visible) ===
  ctx.save();
  const gradient = ctx.createLinearGradient(0, rowHeight, canvas.width, rowHeight);
  gradient.addColorStop(0, "#5b5e61ff");   // light gray on dark side
  gradient.addColorStop(0.6, "#5b5e61ff"); // bright in the middle
  gradient.addColorStop(1, "#5b5e61ff");   // darker near green
  ctx.strokeStyle = gradient;
  ctx.lineWidth = 5;
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
  ctx.fillText(String(currentMatch.player1 || 'Player 1'), 65, rowHeight / 2 + 8);
  ctx.fillText(String(currentMatch.player2 || 'Player 2'), 65, rowHeight + rowHeight / 2 + 8);

  // === Scores ===
  ctx.fillStyle = "#000000";
  ctx.font = "bold 50px Arial";
  const score1Width = ctx.measureText(player1Score).width;
  const score2Width = ctx.measureText(player2Score).width;
  ctx.fillText(player1Score, canvas.width - score1Width - 100, rowHeight / 2 + 15);
  ctx.fillText(player2Score, canvas.width - score2Width - 100, rowHeight + rowHeight / 2 + 15);
<<<<<<< HEAD
      // === LIVE Indicator ===
=======
    // === LIVE Indicator ===
>>>>>>> 96415a91206b862650a70654c0b8dfd7d0e2294c
if (currentMatch.status === "live") {
  // Use a time-based continuous pulse so it keeps animating on every redraw
  const t = Date.now() / 120; // smaller divisor -> smoother / faster pulse
  const pulse = 3 + Math.abs(Math.sin(t)) * 3; // radius range: 4 -> 8

  const cx = 30;
  const cy = 20;

  // Outer soft glow (multiple rings for stronger effect)
  ctx.fillStyle = `rgba(255, 0, 0, 0.12)`;
  ctx.beginPath();
  ctx.arc(cx, cy, pulse + 8, 0, 2 * Math.PI);
  ctx.fill();

  ctx.fillStyle = `rgba(255, 0, 0, 0.08)`;
  ctx.beginPath();
  ctx.arc(cx, cy, pulse + 5, 0, 2 * Math.PI);
  ctx.fill();

  // Main glow
  ctx.fillStyle = `rgba(255, 0, 0, 0.25)`;
  ctx.beginPath();
  ctx.arc(cx, cy, pulse + 2, 0, 2 * Math.PI);
  ctx.fill();

  // Inner solid circle
  ctx.fillStyle = "#ff0000";
  ctx.beginPath();
  ctx.arc(cx, cy, Math.max(2, pulse - 1), 0, 2 * Math.PI);
  ctx.fill();

  // "LIVE" label with subtle shadow
  ctx.save();
  ctx.font = "bold 18px Arial";
  ctx.textBaseline = "middle";
  ctx.textAlign = "left";

  // shadow
  ctx.fillStyle = "rgba(0,0,0,0.5)";
  ctx.fillText("Live", cx + 14 + 1, cy + 1);

  // foreground
  ctx.fillStyle = "#ff4d4d";
  ctx.fillText("LIVE", cx + 14, cy);
  ctx.restore();
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

  const { player1Score, player2Score } = parseScore(currentMatch.score ?? '0-0')

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
