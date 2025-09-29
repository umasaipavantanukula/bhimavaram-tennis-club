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
  points: number
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

      // Convert profiles to ranking data with mock points and trends
      const rankingData: RankingData[] = profiles
        .filter((profile) => profile.ranking)
        .map((profile, index) => ({
          ...profile,
          points: Math.max(1000 - profile.ranking! * 50 + Math.floor(Math.random() * 200), 100),
          previousRanking: profile.ranking! + Math.floor(Math.random() * 3) - 1,
          trend: Math.random() > 0.5 ? "up" : Math.random() > 0.3 ? "down" : "same",
        }))
        .sort((a, b) => (a.ranking || 999) - (b.ranking || 999))

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
    if (ranking === 3) return <Award className="h-5 w-5 text-amber-600" />
    return <span className="text-lg font-bold text-muted-foreground">#{ranking}</span>
  }

  return (
    <main className="min-h-screen">
      <Navigation />

      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-foreground mb-4 flex items-center justify-center gap-3">
              <Trophy className="h-10 w-10 text-primary" />
              Player Rankings
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Current standings and performance rankings of our club members
            </p>
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search players..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full sm:w-48">
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

          {/* Rankings List */}
          {loading ? (
            <div className="space-y-4">
              {[...Array(10)].map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-muted rounded-full"></div>
                      <div className="flex-1">
                        <div className="h-4 bg-muted rounded mb-2"></div>
                        <div className="h-3 bg-muted rounded w-1/2"></div>
                      </div>
                      <div className="w-16 h-8 bg-muted rounded"></div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : filteredRankings.length > 0 ? (
            <div className="space-y-4">
              {filteredRankings.map((player, index) => (
                <Card
                  key={player.id}
                  className={`group hover:shadow-lg transition-all duration-300 ${
                    player.ranking === 1
                      ? "ring-2 ring-yellow-500/20 bg-yellow-50/50 dark:bg-yellow-950/20"
                      : player.ranking === 2
                        ? "ring-2 ring-gray-400/20 bg-gray-50/50 dark:bg-gray-950/20"
                        : player.ranking === 3
                          ? "ring-2 ring-amber-600/20 bg-amber-50/50 dark:bg-amber-950/20"
                          : ""
                  }`}
                >
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center justify-center w-12 h-12">
                          {getRankingBadge(player.ranking!)}
                        </div>

                        <div className="flex items-center space-x-4">
                          {player.imageUrl && (
                            <img
                              src={player.imageUrl || "/placeholder.svg"}
                              alt={player.name}
                              className="w-12 h-12 rounded-full object-cover"
                            />
                          )}
                          <div>
                            <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
                              {player.name}
                            </h3>
                            <div className="flex items-center gap-2">
                              <Badge variant="outline">{player.category}</Badge>
                              <span className="text-sm text-muted-foreground">Age {player.age}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-6">
                        <div className="text-right">
                          <div className="text-lg font-bold text-foreground">{player.points} pts</div>
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            {getTrendIcon(player.trend)}
                            {player.previousRanking && player.previousRanking !== player.ranking && (
                              <span>
                                {player.trend === "up" ? "+" : "-"}
                                {Math.abs(player.previousRanking - player.ranking!)}
                              </span>
                            )}
                          </div>
                        </div>

                        <Button variant="outline" size="sm">
                          View Profile
                        </Button>
                      </div>
                    </div>

                    {player.achievements.length > 0 && (
                      <div className="mt-4 pt-4 border-t border-border">
                        <p className="text-sm text-muted-foreground mb-2">Recent Achievements:</p>
                        <div className="flex flex-wrap gap-1">
                          {player.achievements.slice(0, 3).map((achievement, i) => (
                            <Badge key={i} variant="secondary" className="text-xs">
                              {achievement}
                            </Badge>
                          ))}
                          {player.achievements.length > 3 && (
                            <Badge variant="secondary" className="text-xs">
                              +{player.achievements.length - 3} more
                            </Badge>
                          )}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="text-center py-12">
                <Trophy className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No rankings found</h3>
                <p className="text-muted-foreground">
                  {searchTerm || categoryFilter !== "all"
                    ? "Try adjusting your search or filter criteria"
                    : "Rankings will appear here once players are added to the system"}
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
