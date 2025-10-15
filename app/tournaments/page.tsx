"use client"

import { useEffect, useState } from "react"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar, Trophy, Play, BarChart3, ChevronDown, Clock } from "lucide-react"
import { matchOperations, profileOperations, type Match, type PlayerProfile } from "@/lib/firebase-operations"

export default function TournamentsPage() {
  const [matches, setMatches] = useState<Match[]>([])
  const [filteredMatches, setFilteredMatches] = useState<Match[]>([])
  const [profiles, setProfiles] = useState<PlayerProfile[]>([])
  const [loading, setLoading] = useState(true)
  const [playerFilter, setPlayerFilter] = useState("all")
  const [venueFilter, setVenueFilter] = useState("all")
  const [seasonFilter, setSeasonFilter] = useState("2025")
  const [statusFilter, setStatusFilter] = useState("all")

  useEffect(() => {
    loadData()
  }, [])

  useEffect(() => {
    filterData()
  }, [matches, playerFilter, venueFilter, seasonFilter, statusFilter])

  const loadData = async () => {
    try {
      const [matchData, profileData] = await Promise.all([
        matchOperations.getAll(),
        profileOperations.getAll()
      ])
      setMatches(matchData)
      setProfiles(profileData)
    } catch (error) {
      console.error("Error loading data:", error)
    } finally {
      setLoading(false)
    }
  }

  const filterData = () => {
    let filtered = matches

    // Filter by player
    if (playerFilter !== "all") {
      filtered = filtered.filter(
        (match) => 
          match.player1.toLowerCase().includes(playerFilter.toLowerCase()) ||
          match.player2.toLowerCase().includes(playerFilter.toLowerCase())
      )
    }

    // Filter by venue
    if (venueFilter !== "all") {
      filtered = filtered.filter((match) => 
        match.court && match.court.toLowerCase().includes(venueFilter.toLowerCase())
      )
    }

    // Filter by season (year)
    if (seasonFilter !== "all") {
      filtered = filtered.filter((match) => 
        match.date.getFullYear().toString() === seasonFilter
      )
    }

    // Filter by status
    if (statusFilter !== "all") {
      filtered = filtered.filter((match) => {
        const actualStatus = getActualMatchStatus(match)
        return actualStatus === statusFilter
      })
    }

    setFilteredMatches(filtered)
  }

  const formatMatchScore = (match: Match) => {
    const actualStatus = getActualMatchStatus(match)
    
    if (actualStatus === "upcoming" || !match.score || match.score === "TBD" || match.score === "") {
      return { player1Score: "", player2Score: "" }
    }
    
    const scores = match.score.split(" - ")
    return {
      player1Score: scores[0] || "",
      player2Score: scores[1] || ""
    }
  }

  const formatDate = (date: Date) => {
    const days = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT']
    const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC']
    
    const dayName = days[date.getDay()]
    const month = months[date.getMonth()]
    const day = date.getDate()
    const time = date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })
    
    return `${dayName}, ${month} ${day}, ${time} IST`
  }

  const getUniqueVenues = () => {
    const venues = matches.map(match => match.court).filter(Boolean)
    return [...new Set(venues)]
  }

  const getUniquePlayers = () => {
    const players = matches.flatMap(match => [match.player1, match.player2])
    return [...new Set(players)]
  }

  const getPlayerImage = (playerName: string) => {
    const profile = profiles.find(p => p.name.toLowerCase() === playerName.toLowerCase())
    return profile?.imageUrl || null
  }

  const getPlayerInitials = (playerName: string) => {
    return playerName.split(' ').map(n => n[0]).join('').substring(0, 2)
  }

  const getActualMatchStatus = (match: Match) => {
    const now = new Date()
    const matchDate = new Date(match.date)
    
    // If match has a score and is marked as completed, it's completed
    if (match.status === "completed" || (match.score && match.score !== "TBD" && match.score !== "")) {
      return "completed"
    }
    
    // If match date has passed (assuming 2 hour match duration), it should be completed
    const matchEndTime = new Date(matchDate.getTime() + (2 * 60 * 60 * 1000)) // Add 2 hours
    if (now > matchEndTime) {
      return "completed"
    }
    
    // If match is currently happening (within match time)
    if (now >= matchDate && now <= matchEndTime) {
      return "live"
    }
    
    // If match is in the future
    return "upcoming"
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50">
      <Navigation />

      {/* Tennis Tournament Header */}
      <section className="py-8 bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-white mb-2">Tennis Tournament Schedule</h1>
            <p className="text-green-100 text-lg">Live matches and upcoming tournaments</p>
          </div>
        </div>
      </section>

      {/* Filter Section */}
      <section className="py-6 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center gap-4">
            {/* Players Filter */}
            <Select value={playerFilter} onValueChange={setPlayerFilter}>
              <SelectTrigger className="w-48 bg-white border-gray-300 rounded-lg">
                <div className="flex items-center gap-2">
                  <Trophy className="h-4 w-4 text-gray-500" />
                  <SelectValue placeholder="ALL PLAYERS" />
                </div>
                <ChevronDown className="h-4 w-4" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">ALL PLAYERS</SelectItem>
                {getUniquePlayers().map((player) => (
                  <SelectItem key={player} value={player}>{player}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Venues Filter */}
            <Select value={venueFilter} onValueChange={setVenueFilter}>
              <SelectTrigger className="w-48 bg-white border-gray-300 rounded-lg">
                <div className="flex items-center gap-2">
                  <Trophy className="h-4 w-4 text-gray-500" />
                  <SelectValue placeholder="ALL VENUES" />
                </div>
                <ChevronDown className="h-4 w-4" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">ALL VENUES</SelectItem>
                {getUniqueVenues().map((venue) => (
                  <SelectItem key={venue} value={venue || ""}>{venue || "TBD"}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Season Filter */}
            <Select value={seasonFilter} onValueChange={setSeasonFilter}>
              <SelectTrigger className="w-48 bg-white border-gray-300 rounded-lg">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <SelectValue placeholder="SEASON 2025" />
                </div>
                <ChevronDown className="h-4 w-4" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="2025">SEASON 2025</SelectItem>
                <SelectItem value="2024">SEASON 2024</SelectItem>
                <SelectItem value="all">ALL SEASONS</SelectItem>
              </SelectContent>
            </Select>

            {/* Status Filter */}
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48 bg-white border-gray-300 rounded-lg">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-gray-500" />
                  <SelectValue placeholder="ALL MATCHES" />
                </div>
                <ChevronDown className="h-4 w-4" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">ALL MATCHES</SelectItem>
                <SelectItem value="upcoming">UPCOMING MATCHES</SelectItem>
                <SelectItem value="live">LIVE MATCHES</SelectItem>
                <SelectItem value="completed">COMPLETED MATCHES</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </section>

      {/* Tennis Matches List */}
      <section className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 animate-pulse">
                  <div className="h-6 bg-gray-200 rounded mb-4"></div>
                  <div className="h-20 bg-gray-200 rounded"></div>
                </div>
              ))}
            </div>
          ) : filteredMatches.length > 0 ? (
            <div className="space-y-4">
              {filteredMatches.map((match) => {
                const actualStatus = getActualMatchStatus(match)
                const { player1Score, player2Score } = formatMatchScore(match)
                const statusColor = actualStatus === "upcoming" ? "bg-blue-500" : 
                                   actualStatus === "live" ? "bg-red-500 animate-pulse" : "bg-green-500"
                const statusText = actualStatus === "upcoming" ? "Upcoming" :
                                  actualStatus === "live" ? "LIVE" : "Completed"
                return (
                <Card key={match.id} className="bg-white border border-gray-200 hover:shadow-md transition-shadow">
                    <CardContent className="p-0">
                      {/* Match Header - Mobile Responsive */}
                      <div className="bg-gray-50 px-4 sm:px-6 py-3 border-b border-gray-100">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-0">
                          <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
                            <div className={`w-2 h-2 ${statusColor} rounded-full flex-shrink-0`}></div>
                            <Badge 
                              variant={actualStatus === "live" ? "destructive" : actualStatus === "upcoming" ? "default" : "secondary"}
                              className={`text-xs ${actualStatus === "live" ? "animate-pulse" : ""}`}
                            >
                              {statusText}
                            </Badge>
                            <span className="font-medium text-gray-700 text-sm sm:text-base">
                              {match.court || "Tennis Court"}, {match.tournament}
                            </span>
                          </div>
                          <span className="text-xs sm:text-sm text-gray-500">{formatDate(match.date)}</span>
                        </div>
                      </div>

                      {/* Match Details - Responsive Layout */}
                      <div className="px-4 sm:px-8 py-6 sm:py-8">
                        {/* Desktop Layout - Horizontal */}
                        <div className="hidden md:flex items-center justify-center gap-6">
                          {/* Player 1 Section */}
                          <div className="flex items-center gap-4">
                            {/* Player 1 Photo - Medium Size */}
                            <div className="w-16 h-16 rounded-full overflow-hidden border-3 border-blue-300 shadow-md">
                              {getPlayerImage(match.player1) ? (
                                <img 
                                  src={getPlayerImage(match.player1)!} 
                                  alt={match.player1}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                                  <span className="text-white font-bold text-lg">
                                    {getPlayerInitials(match.player1)}
                                  </span>
                                </div>
                              )}
                            </div>
                            
                            {/* Player 1 Details */}
                            <div>
                              <div className="font-bold text-gray-900 text-base">{match.player1}</div>
                              <div className="text-xs text-gray-500 uppercase tracking-wide">Senior</div>
                            </div>
                          </div>

                          {/* Player 1 Score */}
                          <div className="text-4xl font-extrabold text-green-600 min-w-[50px] text-center">
                            {actualStatus === "upcoming" ? "-" : (player1Score || "0")}
                          </div>

                          {/* VS Divider */}
                          <div className="flex flex-col items-center px-6">
                            <div className="text-2xl font-black text-gray-400 tracking-wider">VS</div>
                            {actualStatus === "live" && (
                              <div className="flex items-center gap-1 mt-2">
                                <div className="w-2 h-2 bg-red-500 rounded-full animate-ping"></div>
                                <span className="text-xs font-bold text-red-500 uppercase">Live</span>
                              </div>
                            )}
                          </div>

                          {/* Player 2 Score */}
                          <div className="text-4xl font-extrabold text-green-600 min-w-[50px] text-center">
                            {actualStatus === "upcoming" ? "-" : (player2Score || "0")}
                          </div>

                          {/* Player 2 Section */}
                          <div className="flex items-center gap-4">
                            {/* Player 2 Details */}
                            <div className="text-right">
                              <div className="font-bold text-gray-900 text-base">{match.player2}</div>
                              <div className="text-xs text-gray-500 uppercase tracking-wide">Senior</div>
                            </div>
                            
                            {/* Player 2 Photo - Medium Size */}
                            <div className="w-16 h-16 rounded-full overflow-hidden border-3 border-red-300 shadow-md">
                              {getPlayerImage(match.player2) ? (
                                <img 
                                  src={getPlayerImage(match.player2)!} 
                                  alt={match.player2}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center">
                                  <span className="text-white font-bold text-lg">
                                    {getPlayerInitials(match.player2)}
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Mobile Layout - Vertical */}
                        <div className="md:hidden space-y-6">
                          {/* Player 1 */}
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              {/* Player 1 Photo */}
                              <div className="w-14 h-14 rounded-full overflow-hidden border-3 border-blue-300 shadow-md">
                                {getPlayerImage(match.player1) ? (
                                  <img 
                                    src={getPlayerImage(match.player1)!} 
                                    alt={match.player1}
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <div className="w-full h-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                                    <span className="text-white font-bold text-base">
                                      {getPlayerInitials(match.player1)}
                                    </span>
                                  </div>
                                )}
                              </div>
                              
                              {/* Player 1 Details */}
                              <div>
                                <div className="font-bold text-gray-900 text-sm">{match.player1}</div>
                                <div className="text-xs text-gray-500 uppercase tracking-wide">Senior</div>
                              </div>
                            </div>
                            
                            {/* Player 1 Score */}
                            <div className="text-3xl font-extrabold text-green-600">
                              {actualStatus === "upcoming" ? "-" : (player1Score || "0")}
                            </div>
                          </div>

                          {/* VS Divider */}
                          <div className="flex items-center justify-center py-2">
                            <div className="flex-1 h-px bg-gray-300"></div>
                            <div className="px-4 flex flex-col items-center">
                              <div className="text-xl font-black text-gray-400 tracking-wider">VS</div>
                              {actualStatus === "live" && (
                                <div className="flex items-center gap-1 mt-1">
                                  <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-ping"></div>
                                  <span className="text-xs font-bold text-red-500 uppercase">Live</span>
                                </div>
                              )}
                            </div>
                            <div className="flex-1 h-px bg-gray-300"></div>
                          </div>

                          {/* Player 2 */}
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              {/* Player 2 Photo */}
                              <div className="w-14 h-14 rounded-full overflow-hidden border-3 border-red-300 shadow-md">
                                {getPlayerImage(match.player2) ? (
                                  <img 
                                    src={getPlayerImage(match.player2)!} 
                                    alt={match.player2}
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <div className="w-full h-full bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center">
                                    <span className="text-white font-bold text-base">
                                      {getPlayerInitials(match.player2)}
                                    </span>
                                  </div>
                                )}
                              </div>
                              
                              {/* Player 2 Details */}
                              <div>
                                <div className="font-bold text-gray-900 text-sm">{match.player2}</div>
                                <div className="text-xs text-gray-500 uppercase tracking-wide">Senior</div>
                              </div>
                            </div>
                            
                            {/* Player 2 Score */}
                            <div className="text-3xl font-extrabold text-green-600">
                              {actualStatus === "upcoming" ? "-" : (player2Score || "0")}
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          ) : (
            <Card className="text-center py-12">
              <CardContent>
                <Trophy className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No matches found</h3>
                <p className="text-gray-500">Try adjusting your filters to see more matches</p>
              </CardContent>
            </Card>
          )}
        </div>
      </section>

      <Footer />
    </main>
  )
}
