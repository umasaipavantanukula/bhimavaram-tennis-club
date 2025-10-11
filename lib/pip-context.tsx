"use client"

import { createContext, useContext, useState, useCallback, ReactNode } from "react"

interface PiPContextType {
  isOpen: boolean
  position: { x: number; y: number }
  openPiP: () => void
  closePiP: () => void
  togglePiP: () => void
  updatePosition: (position: { x: number; y: number }) => void
}

const PiPContext = createContext<PiPContextType | undefined>(undefined)

export function usePiP() {
  const context = useContext(PiPContext)
  if (context === undefined) {
    throw new Error("usePiP must be used within a PiPProvider")
  }
  return context
}

interface PiPProviderProps {
  children: ReactNode
}

export function PiPProvider({ children }: PiPProviderProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [position, setPosition] = useState({ x: 20, y: 100 })

  const openPiP = useCallback(() => {
    setIsOpen(true)
  }, [])

  const closePiP = useCallback(() => {
    setIsOpen(false)
  }, [])

  const togglePiP = useCallback(() => {
    setIsOpen(prev => !prev)
  }, [])

  const updatePosition = useCallback((newPosition: { x: number; y: number }) => {
    setPosition(newPosition)
  }, [])

  const value: PiPContextType = {
    isOpen,
    position,
    openPiP,
    closePiP,
    togglePiP,
    updatePosition
  }

  return (
    <PiPContext.Provider value={value}>
      {children}
    </PiPContext.Provider>
  )
}