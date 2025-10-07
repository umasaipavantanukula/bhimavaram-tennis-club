"use client"

import { useEffect, useState } from "react"

interface PageLoadingProps {
  isLoading: boolean
}

export function PageLoading({ isLoading }: PageLoadingProps) {
  const [showAnimation, setShowAnimation] = useState(false)
  const [delayTimeout, setDelayTimeout] = useState<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (isLoading) {
      // Only show animation after 500ms delay (for network lag situations)
      const timeout = setTimeout(() => {
        setShowAnimation(true)
      }, 100)
      setDelayTimeout(timeout)
    } else {
      // Clear timeout and hide animation immediately when loading stops
      if (delayTimeout) {
        clearTimeout(delayTimeout)
        setDelayTimeout(null)
      }
      setShowAnimation(false)
    }

    return () => {
      if (delayTimeout) {
        clearTimeout(delayTimeout)
      }
    }
  }, [isLoading])

  if (!showAnimation) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Fully Blurred Background */}
      <div className="absolute inset-0 bg-white/80 backdrop-blur-md"></div>
      
      {/* Tennis Animation Container */}
      <div className="relative z-10 flex flex-col items-center justify-center">
        {/* Tennis Racket and Ball Animation */}
        <div className="relative w-32 h-32 mb-8">
          {/* Tennis Racket */}
          <div className="absolute inset-0 animate-tennis-swing">
            <svg
              width="128"
              height="128"
              viewBox="0 0 128 128"
              className="drop-shadow-lg"
            >
              {/* Racket Handle */}
              <rect
                x="58"
                y="70"
                width="12"
                height="40"
                rx="6"
                fill="#8B4513"
                className="animate-pulse"
              />
              
              {/* Racket Head Outer */}
              <ellipse
                cx="64"
                cy="45"
                rx="25"
                ry="30"
                fill="none"
                stroke="#FFD700"
                strokeWidth="4"
                className="animate-spin"
                style={{ animationDuration: '2s' }}
              />
              
              {/* Racket Strings */}
              <g className="animate-pulse">
                {/* Vertical strings */}
                <line x1="50" y1="25" x2="50" y2="65" stroke="#E5E5E5" strokeWidth="1" />
                <line x1="57" y1="20" x2="57" y2="70" stroke="#E5E5E5" strokeWidth="1" />
                <line x1="64" y1="15" x2="64" y2="75" stroke="#E5E5E5" strokeWidth="1" />
                <line x1="71" y1="20" x2="71" y2="70" stroke="#E5E5E5" strokeWidth="1" />
                <line x1="78" y1="25" x2="78" y2="65" stroke="#E5E5E5" strokeWidth="1" />
                
                {/* Horizontal strings */}
                <line x1="42" y1="35" x2="86" y2="35" stroke="#E5E5E5" strokeWidth="1" />
                <line x1="45" y1="42" x2="83" y2="42" stroke="#E5E5E5" strokeWidth="1" />
                <line x1="39" y1="49" x2="89" y2="49" stroke="#E5E5E5" strokeWidth="1" />
                <line x1="45" y1="56" x2="83" y2="56" stroke="#E5E5E5" strokeWidth="1" />
                <line x1="42" y1="63" x2="86" y2="63" stroke="#E5E5E5" strokeWidth="1" />
              </g>
            </svg>
          </div>
          
          {/* Tennis Ball */}
          <div className="absolute top-8 left-20 w-8 h-8 animate-tennis-ball">
            <div className="w-full h-full bg-gradient-to-br from-yellow-300 to-yellow-500 rounded-full relative shadow-lg">
              {/* Ball curve lines */}
              <div className="absolute inset-1 border-2 border-white rounded-full opacity-80"></div>
              <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-white transform -translate-y-1/2"></div>
            </div>
          </div>
        </div>
        
        {/* Loading Text */}
        <div className="text-center animate-pulse">
          <h3 className="text-2xl font-bold text-green-700 mb-2">Loading...</h3>
          <p className="text-green-600">Preparing your tennis experience</p>
        </div>
        
        {/* Loading Dots */}
        <div className="flex space-x-2 mt-4">
          <div className="w-3 h-3 bg-green-500 rounded-full animate-bounce"></div>
          <div className="w-3 h-3 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
          <div className="w-3 h-3 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
        </div>
      </div>
    </div>
  )
}