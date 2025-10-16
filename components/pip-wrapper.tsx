"use client"

import { FloatingPiPWidget } from "@/components/floating-pip-widget"
import { usePiP } from "@/lib/pip-context"

export function PiPWrapper() {
  const { isOpen, closePiP } = usePiP()
  
  if (!isOpen) return null
  
  // Use the canvas-based PiP widget that can float outside the browser
  return <FloatingPiPWidget isOpen={isOpen} onClose={closePiP} />
}