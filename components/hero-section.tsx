"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { heroOperations } from "@/lib/firebase-operations"
import { ArrowRight, Play, Flame, Trophy, Users } from "lucide-react"

interface HeroStats {
  totalProfiles: number
  completedTournaments: number
}

export function HeroSection() {
  const [stats, setStats] = useState<HeroStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchHeroStats()
  }, [])

  const fetchHeroStats = async () => {
    try {
      setLoading(true)
      const heroStats = await heroOperations.getHeroStats()
      setStats(heroStats)
    } catch (error) {
      console.error("Error fetching hero stats:", error)
      // Set fallback values if Firebase fails
      setStats({
        totalProfiles: 0,
        completedTournaments: 0
      })
    } finally {
      setLoading(false)
    }
  }
  return (
    <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-green-900 via-emerald-800 to-lime-900 overflow-hidden">
      {/* Background texture and overlay */}
      <div className="absolute inset-0 bg-[url('/tennis-pattern.png')] opacity-10"></div>
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 to-transparent"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 grid lg:grid-cols-2 gap-16 items-center">
        
        {/* Left Section */}
        <div className="space-y-10 text-white">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md rounded-full px-5 py-2 border border-white/20">
            <Flame className="h-4 w-4 text-yellow-400" />
            <span className="text-sm font-medium tracking-wide">
              #1 Ranked Tennis Club in Bhimavaram
            </span>
          </div>

          <h1 className="text-5xl md:text-6xl lg:text-7xl font-black leading-tight">
            <span className="block bg-gradient-to-r from-yellow-400 to-green-300 bg-clip-text text-transparent">
              Unleash Your Power
            </span>
            <span className="block text-white">on the Court</span>
          </h1>

          <p className="text-lg md:text-xl text-green-100 max-w-xl leading-relaxed">
            Experience world-class coaching, tournaments, and a passionate community of players ready to rise to the challenge.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 pt-2">
            <Button size="lg" className="bg-gradient-to-r from-lime-500 to-green-400 text-white text-lg px-8 py-6 rounded-full shadow-lg hover:scale-105 transition">
              Join the Club <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            
            <Button
              size="lg"
              variant="outline"
              className="border-white/30 text-white text-lg px-8 py-6 rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20 transition"
            >
              <Play className="mr-2 h-5 w-5" />
              Watch Highlights
            </Button>
          </div>

          <div className="flex gap-8 pt-8">
            <div className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-yellow-400" />
              {loading ? (
                <Skeleton className="h-4 w-24 bg-white/20" />
              ) : (
                <span className="text-sm text-green-100">
                  {stats?.completedTournaments}+ Tournaments
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-green-300" />
              {loading ? (
                <Skeleton className="h-4 w-32 bg-white/20" />
              ) : (
                <span className="text-sm text-green-100">
                  {stats?.totalProfiles}+ Active Players
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Right Section */}
        <div className="relative">
          <div className="absolute -top-8 -left-8 w-72 h-72 bg-green-400/20 rounded-full blur-3xl"></div>
          <div className="relative rounded-[2rem] overflow-hidden shadow-2xl border border-green-400/20">
            <video
              src="/Tennis.mp4"
              className="w-full h-auto aspect-video object-cover hover:scale-105 transition duration-700"
              autoPlay
              loop
              muted
              playsInline
            />
            <div className="absolute bottom-4 left-4 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full text-sm text-white flex items-center gap-2">
              <Flame className="h-4 w-4 text-yellow-400" />
              Live Action Moments
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
