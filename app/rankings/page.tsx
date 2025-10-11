"use client"

import { useEffect, useState } from "react"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Trophy, Medal, Award, Search, TrendingUp, TrendingDown, Minus } from "lucide-react"
import { profileOperations, type PlayerProfile } from "@/lib/firebase-operations"

interface RankingData extends PlayerProfile {
  previousRanking?: number
  trend: "up" | "down" | "same"
  isAutoRanked?: boolean
}

export default function RankingsPage() {
  const [rankings, setRankings] = useState<RankingData[]>([])
  const [filteredRankings, setFilteredRankings] = useState<RankingData[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState<string>("all")

  useEffect(() => {
    loadRankings()
  }, [])

  useEffect(() => {
    filterRankings()
  }, [rankings, searchTerm, categoryFilter])

  const loadRankings = async () => {
    try {
      const profiles = await profileOperations.getAll()

      // Convert profiles to ranking data with trends
      // First, assign auto-rankings to players without rankings based on points
      const profilesWithRankings = profiles.map((profile, index) => {
        if (!profile.ranking) {
          // Auto-assign ranking based on points or order
          const autoRank = profiles.filter(p => p.ranking).length + index + 1
          return { ...profile, ranking: autoRank, isAutoRanked: true }
        }
        return { ...profile, isAutoRanked: false }
      })

      const rankingData: RankingData[] = profilesWithRankings
        .map((profile, index) => {
          const trendValue = Math.random()
          let trend: "up" | "down" | "same" = "same"
          if (trendValue > 0.6) trend = "up"
          else if (trendValue < 0.3) trend = "down"
          
          return {
            ...profile,
            previousRanking: profile.ranking! + Math.floor(Math.random() * 3) - 1,
            trend,
          }
        })
        .sort((a, b) => {
          // Sort by points first (descending), then by ranking
          const pointsA = a.points || 0
          const pointsB = b.points || 0
          if (pointsA !== pointsB) {
            return pointsB - pointsA
          }
          return (a.ranking || 999) - (b.ranking || 999)
        })

      setRankings(rankingData)
    } catch (error) {
      console.error("Error loading rankings:", error)
    } finally {
      setLoading(false)
    }
  }

  const filterRankings = () => {
    let filtered = rankings

    if (searchTerm) {
      filtered = filtered.filter((player) => player.name.toLowerCase().includes(searchTerm.toLowerCase()))
    }

    if (categoryFilter !== "all") {
      filtered = filtered.filter((player) => player.category === categoryFilter)
    }

    setFilteredRankings(filtered)
  }

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "up":
        return <TrendingUp className="h-4 w-4 text-green-500" />
      case "down":
        return <TrendingDown className="h-4 w-4 text-red-500" />
      default:
        return <Minus className="h-4 w-4 text-muted-foreground" />
    }
  }

  const getRankingBadge = (ranking: number) => {
    if (ranking === 1) return <Trophy className="h-5 w-5 text-yellow-500" />
    if (ranking === 2) return <Medal className="h-5 w-5 text-gray-400" />
    if (ranking === 3) return <Award className="h-5 w-5 text-orange-500" />
    return <span className="text-lg font-bold text-muted-foreground">#{ranking}</span>
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      <Navigation />

      {/* Header Section */}
      <div className="text-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-2">Tennis Club Rankings</h1>
          </div>
        </div>
      </div>

      <div className="py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Filters */}
          <Card className="mb-4 shadow-lg border-0">
            <CardContent className="p-4">
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search players..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 border-green-200 focus:border-green-500"
                  />
                </div>
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger className="w-full sm:w-48 border-green-200 focus:border-green-500">
                    <SelectValue placeholder="Filter by category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="junior">Junior</SelectItem>
                    <SelectItem value="senior">Senior</SelectItem>
                    <SelectItem value="veteran">Veteran</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Tennis Statistics Table */}
          {loading ? (
            <Card className="shadow-lg border-0">
              <CardContent className="p-0">
                <div className="animate-pulse">
                  <div className="bg-gray-200 h-12"></div>
                  {[...Array(10)].map((_, i) => (
                    <div key={i} className="flex items-center space-x-4 p-4 border-b">
                      <div className="w-8 h-8 bg-gray-200 rounded"></div>
                      <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                      <div className="flex-1">
                        <div className="h-4 bg-gray-200 rounded mb-2"></div>
                        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                      </div>
                      <div className="w-16 h-8 bg-gray-200 rounded"></div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ) : filteredRankings.length > 0 ? (
            <Card className="shadow-lg border-0 overflow-hidden">
              <CardContent className="p-0">
                {/* Table Header */}
                <div className="bg-gradient-to-r from-slate-700 to-slate-800 text-white">
                  <div className="grid grid-cols-12 gap-4 p-3 text-sm font-semibold">
                    <div className="col-span-1 text-center">POS</div>
                    <div className="col-span-2">Player</div>
                    <div className="col-span-1 text-center">Points</div>
                    <div className="col-span-1 text-center">Mat</div>
                    <div className="col-span-1 text-center">Won</div>
                    <div className="col-span-1 text-center">Win%</div>
                    <div className="col-span-1 text-center">Sets</div>
                    <div className="col-span-1 text-center">Games</div>
                    <div className="col-span-1 text-center">Serve%</div>
                    <div className="col-span-1 text-center">Aces</div>
                    <div className="col-span-1 text-center">Streak</div>
                  </div>
                </div>

                {/* Table Rows */}
                <div>
                  {filteredRankings.map((player, index) => (
                    <div key={player.id} className={`grid grid-cols-12 gap-4 p-3 items-center hover:bg-green-50/50 transition-colors border-b border-gray-100 ${
                      index % 2 === 1 ? "bg-gray-50/30" : "bg-white"
                    }`}>
                      {/* Position */}
                      <div className="col-span-1 text-center">
                        <div className="flex flex-col items-center justify-center">
                          <div className="flex items-center justify-center">
                            {player.ranking === 1 && <Trophy className="h-5 w-5 text-yellow-500" />}
                            {player.ranking === 2 && <Medal className="h-5 w-5 text-gray-400" />}
                            {player.ranking === 3 && <Award className="h-5 w-5 text-orange-500" />}
                            {(player.ranking || 0) > 3 && (
                              <span className="text-lg font-bold text-gray-700">{index + 1}</span>
                            )}
                          </div>
                          {player.isAutoRanked && (
                            <span className="text-xs text-gray-400 mt-1">Auto</span>
                          )}
                        </div>
                      </div>

                      {/* Player Info */}
                      <div className="col-span-2 flex items-center gap-3">
                        <img
                          src={player.imageUrl || "/placeholder-user.jpg"}
                          alt={player.name}
                          className="w-12 h-12 rounded-full object-cover border-2 border-green-200"
                        />
                        <div>
                          <div className="font-semibold text-gray-900 text-sm">
                            {player.name}
                          </div>
                          <div className="text-xs text-gray-500 uppercase font-medium">
                            {player.category}
                          </div>
                        </div>
                      </div>

                      {/* Points */}
                      <div className="col-span-1 text-center">
                        <div className="font-bold text-lg text-gray-900">{player.points || 0}</div>
                      </div>

                      {/* Matches Played */}
                      <div className="col-span-1 text-center">
                        <div className="text-sm text-gray-700">{player.matchesPlayed || 0}</div>
                      </div>

                      {/* Matches Won */}
                      <div className="col-span-1 text-center">
                        <div className="text-sm text-gray-700">{player.matchesWon || 0}</div>
                      </div>

                      {/* Win Percentage */}
                      <div className="col-span-1 text-center">
                        <div className="text-sm font-medium text-gray-900">
                          {player.winPercentage?.toFixed(1) || '0.0'}%
                        </div>
                      </div>

                      {/* Sets Ratio */}
                      <div className="col-span-1 text-center">
                        <div className="text-sm text-gray-700">
                          {player.setsWon || 0}-{player.setsLost || 0}
                        </div>
                      </div>

                      {/* Games Ratio */}
                      <div className="col-span-1 text-center">
                        <div className="text-sm text-gray-700">
                          {player.gamesWon || 0}-{player.gamesLost || 0}
                        </div>
                      </div>

                      {/* Serving Percentage */}
                      <div className="col-span-1 text-center">
                        <div className="text-sm text-gray-700">
                          {player.servingPercentage?.toFixed(1) || '0.0'}%
                        </div>
                      </div>

                      {/* Aces */}
                      <div className="col-span-1 text-center">
                        <div className="text-sm text-gray-700">{player.acesServed || 0}</div>
                      </div>

                      {/* Current Streak */}
                      <div className="col-span-1 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <span className={`text-sm font-medium ${
                            (player.currentStreak || 0) > 0 ? 'text-green-600' : 
                            (player.currentStreak || 0) < 0 ? 'text-red-500' : 'text-gray-700'
                          }`}>
                            {player.currentStreak || 0}
                          </span>
                          {getTrendIcon(player.trend)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="shadow-lg border-0">
              <CardContent className="text-center py-8">
                <Trophy className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No rankings found</h3>
                <p className="text-gray-600">
                  {searchTerm || categoryFilter !== "all"
                    ? "Try adjusting your search or filter criteria."
                    : "Rankings will appear here once players join the club."}
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      <Footer />
    </main>
  )
}
