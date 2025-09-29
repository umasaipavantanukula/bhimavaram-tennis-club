"use client"

import { useEffect, useState } from "react"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar, Trophy, Users, Search } from "lucide-react"
import { matchOperations, eventOperations, type Match, type Event } from "@/lib/firebase-operations"

export default function TournamentsPage() {
  const [matches, setMatches] = useState<Match[]>([])
  const [events, setEvents] = useState<Event[]>([])
  const [filteredMatches, setFilteredMatches] = useState<Match[]>([])
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  useEffect(() => {
    loadData()
  }, [])

  useEffect(() => {
    filterData()
  }, [matches, events, searchTerm, statusFilter])

  const loadData = async () => {
    try {
      const [matchData, eventData] = await Promise.all([matchOperations.getAll(), eventOperations.getAll()])
      setMatches(matchData)
      setEvents(eventData)
    } catch (error) {
      console.error("Error loading tournament data:", error)
    } finally {
      setLoading(false)
    }
  }

  const filterData = () => {
    let filteredMatchData = matches
    let filteredEventData = events

    // Filter by search term
    if (searchTerm) {
      filteredMatchData = filteredMatchData.filter(
        (match) =>
          match.tournament.toLowerCase().includes(searchTerm.toLowerCase()) ||
          match.player1.toLowerCase().includes(searchTerm.toLowerCase()) ||
          match.player2.toLowerCase().includes(searchTerm.toLowerCase()),
      )
      filteredEventData = filteredEventData.filter(
        (event) =>
          event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          event.description.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    // Filter by status
    if (statusFilter !== "all") {
      if (statusFilter === "upcoming") {
        const now = new Date()
        filteredMatchData = filteredMatchData.filter((match) => match.date >= now)
        filteredEventData = filteredEventData.filter((event) => event.date >= now)
      } else if (statusFilter === "completed") {
        const now = new Date()
        filteredMatchData = filteredMatchData.filter((match) => match.date < now)
        filteredEventData = filteredEventData.filter((event) => event.date < now)
      }
    }

    setFilteredMatches(filteredMatchData)
    setFilteredEvents(filteredEventData)
  }

  const getStatusBadge = (status: string) => {
    const variants = {
      upcoming: "secondary",
      live: "default",
      completed: "outline",
    } as const
    return <Badge variant={variants[status as keyof typeof variants]}>{status}</Badge>
  }

  const getCategoryBadge = (category: string) => {
    const variants = {
      tournament: "default",
      training: "secondary",
      social: "outline",
      maintenance: "destructive",
    } as const
    return <Badge variant={variants[category as keyof typeof variants]}>{category}</Badge>
  }

  const upcomingMatches = filteredMatches.filter((match) => match.status === "upcoming").slice(0, 3)
  const upcomingEvents = filteredEvents.filter((event) => event.date >= new Date()).slice(0, 4)
  const recentMatches = filteredMatches.filter((match) => match.status === "completed").slice(0, 3)

  return (
    <main className="min-h-screen">
      <Navigation />

      {/* Hero Section */}
      <section className="relative py-24 bg-gradient-to-br from-primary/10 via-background to-accent/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-6">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground text-balance">Tournaments & Events</h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto text-pretty">
              Join competitive tournaments, participate in club events, and be part of our vibrant tennis community.
              From beginner-friendly competitions to championship-level tournaments.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="px-8 py-6 text-lg">
                Register for Tournament
              </Button>
              <Button variant="outline" size="lg" className="px-8 py-6 text-lg bg-transparent">
                View Event Calendar
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Search and Filter Section */}
      <section className="py-8 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex items-center gap-4 w-full md:w-auto">
              <div className="relative flex-1 md:w-80">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search tournaments and events..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Events</SelectItem>
                  <SelectItem value="upcoming">Upcoming</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="text-sm text-muted-foreground">
              {filteredMatches.length} matches • {filteredEvents.length} events
            </div>
          </div>
        </div>
      </section>

      {/* Upcoming Tournaments */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Upcoming Tournaments</h2>
            <p className="text-xl text-muted-foreground">
              Register now for our exciting upcoming tournaments and competitions
            </p>
          </div>

          {loading ? (
            <div className="space-y-8">
              {[...Array(3)].map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-1">
                      <div className="w-full h-64 bg-muted rounded-l-lg"></div>
                    </div>
                    <div className="lg:col-span-2 p-6">
                      <div className="h-6 bg-muted rounded mb-4"></div>
                      <div className="h-4 bg-muted rounded mb-2"></div>
                      <div className="h-4 bg-muted rounded mb-4"></div>
                      <div className="h-20 bg-muted rounded"></div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : upcomingMatches.length > 0 ? (
            <div className="space-y-8">
              {upcomingMatches.map((match) => (
                <Card key={match.id} className="group hover:shadow-lg transition-all duration-300">
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-1">
                      <img
                        src="/tennis-tournament-court.jpg"
                        alt={match.tournament}
                        className="w-full h-64 lg:h-full object-cover rounded-l-lg"
                      />
                    </div>

                    <div className="lg:col-span-2 p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <CardTitle className="text-2xl group-hover:text-primary transition-colors mb-2">
                            {match.tournament}
                          </CardTitle>
                          <div className="flex items-center space-x-4 text-sm text-muted-foreground mb-3">
                            <div className="flex items-center space-x-1">
                              <Calendar className="h-4 w-4" />
                              <span>{match.date.toLocaleDateString()}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Users className="h-4 w-4" />
                              <span>
                                {match.player1} vs {match.player2}
                              </span>
                            </div>
                            {match.court && (
                              <div className="flex items-center space-x-1">
                                <Trophy className="h-4 w-4" />
                                <span>{match.court}</span>
                              </div>
                            )}
                          </div>
                        </div>
                        {getStatusBadge(match.status)}
                      </div>

                      <CardDescription className="text-base leading-relaxed mb-4">
                        Join us for an exciting match in the {match.tournament}.
                        {match.status === "upcoming" ? " Registration is still open!" : ""}
                      </CardDescription>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                        <div className="space-y-2">
                          <h4 className="font-semibold text-sm text-foreground">Match Details</h4>
                          <div className="space-y-1 text-sm text-muted-foreground">
                            <div>
                              Date: <span className="font-medium">{match.date.toLocaleDateString()}</span>
                            </div>
                            <div>
                              Court: <span className="font-medium">{match.court || "TBD"}</span>
                            </div>
                            <div>
                              Status: <span className="font-medium">{match.status}</span>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <h4 className="font-semibold text-sm text-foreground">Players</h4>
                          <div className="space-y-1 text-sm text-muted-foreground">
                            <div>
                              Player 1: <span className="font-medium">{match.player1}</span>
                            </div>
                            <div>
                              Player 2: <span className="font-medium">{match.player2}</span>
                            </div>
                            {match.score && (
                              <div>
                                Score: <span className="font-medium">{match.score}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col sm:flex-row gap-3">
                        <Button className="flex-1" disabled={match.status !== "upcoming"}>
                          {match.status === "upcoming" ? "Register to Watch" : "View Results"}
                        </Button>
                        <Button variant="outline" className="flex-1 bg-transparent">
                          View Details
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="text-center py-12">
                <Trophy className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No upcoming tournaments</h3>
                <p className="text-muted-foreground">Check back soon for new tournament announcements</p>
              </CardContent>
            </Card>
          )}
        </div>
      </section>

      {/* Club Events */}
      <section className="py-16 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Club Events</h2>
            <p className="text-xl text-muted-foreground">Regular events and activities for our tennis community</p>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[...Array(4)].map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <CardHeader>
                    <div className="h-6 bg-muted rounded mb-2"></div>
                    <div className="h-4 bg-muted rounded"></div>
                  </CardHeader>
                  <CardContent>
                    <div className="h-16 bg-muted rounded"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : upcomingEvents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {upcomingEvents.map((event) => (
                <Card key={event.id} className="group hover:shadow-lg transition-all duration-300">
                  <CardHeader>
                    <div className="flex items-start space-x-4">
                      <div className="p-3 bg-primary/10 rounded-lg">
                        <Calendar className="h-6 w-6 text-primary" />
                      </div>
                      <div className="flex-1">
                        <CardTitle className="text-xl group-hover:text-primary transition-colors">
                          {event.title}
                        </CardTitle>
                        <div className="flex items-center space-x-4 mt-2 text-sm text-muted-foreground">
                          <div className="flex items-center space-x-1">
                            <Calendar className="h-4 w-4" />
                            <span>{event.date.toLocaleDateString()}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Users className="h-4 w-4" />
                            <span>{event.location}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 mt-2">
                          {getCategoryBadge(event.category)}
                          {event.registrationRequired && <Badge variant="secondary">Registration Required</Badge>}
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base leading-relaxed mb-4">{event.description}</CardDescription>
                    {event.maxParticipants && (
                      <p className="text-xs text-muted-foreground mb-4">Max participants: {event.maxParticipants}</p>
                    )}
                    <Button variant="outline" className="w-full bg-transparent">
                      {event.registrationRequired ? "Register Now" : "Learn More"}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="text-center py-12">
                <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No upcoming events</h3>
                <p className="text-muted-foreground">Check back soon for exciting club activities</p>
              </CardContent>
            </Card>
          )}
        </div>
      </section>

      {/* Past Tournament Winners */}
      {recentMatches.length > 0 && (
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Recent Results</h2>
              <p className="text-xl text-muted-foreground">Latest tournament results and match outcomes</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {recentMatches.map((match) => (
                <Card key={match.id} className="group hover:shadow-lg transition-all duration-300 text-center">
                  <CardHeader>
                    <div className="flex justify-center mb-4">
                      <div className="p-4 bg-yellow-500/10 rounded-full">
                        <Trophy className="h-8 w-8 text-yellow-600" />
                      </div>
                    </div>
                    <CardTitle className="text-xl group-hover:text-primary transition-colors">
                      {match.tournament}
                    </CardTitle>
                    <CardDescription className="text-base font-medium text-primary">
                      {match.date.toLocaleDateString()}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <h4 className="font-semibold text-foreground text-lg">
                        {match.player1} vs {match.player2}
                      </h4>
                      <p className="text-sm text-muted-foreground">{match.court}</p>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      <div>
                        Final Score: <span className="font-medium text-foreground">{match.score || "TBD"}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Tournament Registration CTA */}
      <section className="py-16 bg-muted/30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Card className="bg-primary/5 border-primary/20">
            <CardContent className="p-8">
              <h2 className="text-3xl font-bold text-foreground mb-4">Ready to Compete?</h2>
              <p className="text-xl text-muted-foreground mb-6">
                Join our tournaments and events to challenge yourself, meet fellow players, and be part of our tennis
                community.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="px-8 py-6 text-lg">
                  Register for Tournament
                </Button>
                <Button variant="outline" size="lg" className="px-8 py-6 text-lg bg-transparent">
                  Contact Tournament Director
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <Footer />
    </main>
  )
}
