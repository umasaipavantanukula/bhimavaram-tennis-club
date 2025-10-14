"use client"

import { LiveScorePiP } from "@/components/live-score-pip"
import { NativePiPScores } from "@/components/native-pip-scores"
import { SimplePiPScores } from "@/components/simple-pip-scores"
import { ImagePiPScores } from "@/components/image-pip"
import { usePiP } from "@/lib/pip-context"
import { useState, useEffect } from "react"

export function PiPWrapper() {
  const { isOpen, position, closePiP, updatePosition } = usePiP()
  const [pipMode, setPipMode] = useState<'simple' | 'native' | 'floating' | 'image'>('simple')
  
  // Check browser capabilities
  useEffect(() => {
    if (typeof document !== 'undefined') {
      // Prefer Document PiP (newest), then Video PiP, then floating fallback
      if ('documentPictureInPicture' in window) {
        setPipMode('simple') // Simple mode includes Document PiP
      } else if ('getComputedStyle' in window) {
        // If getComputedStyle exists, we can also show the compact image PiP as an option
        setPipMode('image')
      } else if ('pictureInPictureEnabled' in document) {
        setPipMode('native')
      } else {
        setPipMode('floating')
      }
    }
  }, [])
  
  if (!isOpen) return null
  
  // Use the most compatible PiP implementation
  switch (pipMode) {
    case 'simple':
      return <SimplePiPScores isOpen={isOpen} onClose={closePiP} />
    case 'native':
      return <NativePiPScores isOpen={isOpen} onClose={closePiP} />
    case 'image':
      return <ImagePiPScores isOpen={isOpen} onClose={closePiP} />
    default:
      return (
        <LiveScorePiP
          isOpen={isOpen}
          position={position}
          onClose={closePiP}
          onPositionChange={updatePosition}
        />
      )
  }
}