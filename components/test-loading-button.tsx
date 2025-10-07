"use client"

import { Button } from "@/components/ui/button"
import { useLoading } from "@/lib/loading-context"

export function TestLoadingButton() {
  const { startLoading, stopLoading, isLoading } = useLoading()

  const testAnimation = () => {
    startLoading()
    
    // Stop loading after 3 seconds for testing
    setTimeout(() => {
      stopLoading()
    }, 3000)
  }

  return (
    <div className="space-y-4">
      <Button 
        onClick={testAnimation}
        disabled={isLoading}
        className="bg-yellow-600 hover:bg-yellow-700 text-white px-8 py-3 text-lg"
      >
        {isLoading ? "🎾 Animation Running..." : "🏸 Test Tennis Animation"}
      </Button>
      <p className="text-sm text-yellow-600">
        {isLoading 
          ? "Wait 500ms to see the tennis animation, then it will auto-stop after 3 seconds" 
          : "Animation will show after 500ms delay (simulating network lag)"
        }
      </p>
    </div>
  )
}