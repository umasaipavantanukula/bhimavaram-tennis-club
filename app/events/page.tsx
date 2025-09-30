"use client"

import { useEffect, useState } from "react"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar, Clock, MapPin, Users, CalendarDays, Filter } from "lucide-react"
import { eventOperations, type Event } from "@/lib/firebase-operations"

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([])
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [timeFilter, setTimeFilter] = useState("all")

  useEffect(() => {
    loadEvents()
  }, [])

  useEffect(() => {
    filterEvents()
  }, [events, searchTerm, categoryFilter, timeFilter])

  const loadEvents = async () => {
    try {
      console.log("[Events] Loading events...")
      const data = await eventOperations.getAll()
      console.log("[Events] Fetched events:", data)
      console.log("[Events] Number of events:", data.length)
      setEvents(data)
    } catch (error) {
      console.error("[Events] Error loading events:", error)
    } finally {
      setLoading(false)
    }
  }

  const filterEvents = () => {
    let filtered = events

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        (event) =>
          event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          event.location.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Filter by category
    if (categoryFilter !== "all") {
      filtered = filtered.filter((event) => event.category === categoryFilter)
    }

    // Filter by time
    const now = new Date()
    if (timeFilter === "upcoming") {
      filtered = filtered.filter((event) => event.date >= now)
    } else if (timeFilter === "past") {
      filtered = filtered.filter((event) => event.date < now)
    }

    setFilteredEvents(filtered)
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

  const getCategoryStats = () => {
    const now = new Date()
    const stats = {
      total: events.length,
      upcoming: events.filter((e) => e.date >= now).length,
      tournament: events.filter((e) => e.category === "tournament").length,
      training: events.filter((e) => e.category === "training").length,
      social: events.filter((e) => e.category === "social").length,
      maintenance: events.filter((e) => e.category === "maintenance").length,
    }
    return stats
  }

  const isEventUpcoming = (eventDate: Date) => {
    return eventDate >= new Date()
  }

  const formatEventDate = (date: Date) => {
    const today = new Date()
    const eventDate = new Date(date)
    const diffTime = eventDate.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays === 0) {
      return "Today"
    } else if (diffDays === 1) {
      return "Tomorrow"
    } else if (diffDays > 1 && diffDays <= 7) {
      return `In ${diffDays} days`
    } else if (diffDays < 0) {
      return eventDate.toLocaleDateString()
    } else {
      return eventDate.toLocaleDateString()
    }
  }

  const stats = getCategoryStats()
  const upcomingEvents = filteredEvents.filter(event => isEventUpcoming(event.date))
  const featuredEvent = upcomingEvents[0]

  return (
    <main className="min-h-screen">
      <Navigation />

      {/* Hero Section */}
      <section className="relative py-24 bg-gradient-to-br from-primary/10 via-background to-accent/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-6">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground text-balance">Club Events</h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto text-pretty">
              Join us for exciting tournaments, training sessions, social gatherings, and special events. 
              Stay connected with our vibrant tennis community throughout the year.
            </p>
          </div>
        </div>
      </section>

      {/* Event Stats */}
      <section className="py-12 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
            <Card>
              <CardContent className="text-center p-4">
                <div className="text-2xl font-bold text-primary">{stats.total}</div>
                <div className="text-xs text-muted-foreground">Total Events</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="text-center p-4">
                <div className="text-2xl font-bold text-green-600">{stats.upcoming}</div>
                <div className="text-xs text-muted-foreground">Upcoming</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="text-center p-4">
                <div className="text-2xl font-bold text-primary">{stats.tournament}</div>
                <div className="text-xs text-muted-foreground">Tournaments</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="text-center p-4">
                <div className="text-2xl font-bold text-primary">{stats.training}</div>
                <div className="text-xs text-muted-foreground">Training</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="text-center p-4">
                <div className="text-2xl font-bold text-primary">{stats.social}</div>
                <div className="text-xs text-muted-foreground">Social</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="text-center p-4">
                <div className="text-2xl font-bold text-primary">{stats.maintenance}</div>
                <div className="text-xs text-muted-foreground">Maintenance</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Search and Filter Section */}
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-6">
            <div className="flex items-center gap-4 w-full md:w-auto">
              <div className="relative flex-1 md:w-80">
                <Input
                  placeholder="Search events..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-4"
                />
              </div>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="tournament">Tournament</SelectItem>
                  <SelectItem value="training">Training</SelectItem>
                  <SelectItem value="social">Social</SelectItem>
                  <SelectItem value="maintenance">Maintenance</SelectItem>
                </SelectContent>
              </Select>
              <Select value={timeFilter} onValueChange={setTimeFilter}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Time" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Time</SelectItem>
                  <SelectItem value="upcoming">Upcoming</SelectItem>
                  <SelectItem value="past">Past</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="text-sm text-muted-foreground">
              Showing {filteredEvents.length} of {events.length} events
            </div>
          </div>
        </div>
      </section>

      {/* Featured Event */}
      {featuredEvent && (
        <section className="py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-foreground mb-2">Featured Event</h2>
              <div className="w-12 h-1 bg-primary rounded"></div>
            </div>

            <Card className="group hover:shadow-lg transition-all duration-300 bg-gradient-to-r from-primary/5 to-accent/5">
              <CardContent className="p-8">
                <div className="flex items-center space-x-3 mb-4">
                  {getCategoryBadge(featuredEvent.category)}
                  <Badge variant="secondary">Featured</Badge>
                  {isEventUpcoming(featuredEvent.date) && (
                    <Badge variant="default" className="bg-green-600">Upcoming</Badge>
                  )}
                </div>

                <CardTitle className="text-3xl group-hover:text-primary transition-colors mb-4">
                  {featuredEvent.title}
                </CardTitle>

                <CardDescription className="text-lg leading-relaxed mb-6">
                  {featuredEvent.description}
                </CardDescription>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-primary/10 rounded-full">
                      <Calendar className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <div className="font-semibold">Date</div>
                      <div className="text-sm text-muted-foreground">
                        {featuredEvent.date.toLocaleDateString()}
                      </div>
                      <div className="text-xs text-green-600 font-medium">
                        {formatEventDate(featuredEvent.date)}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-primary/10 rounded-full">
                      <MapPin className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <div className="font-semibold">Location</div>
                      <div className="text-sm text-muted-foreground">{featuredEvent.location}</div>
                    </div>
                  </div>

                  {featuredEvent.maxParticipants && (
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-primary/10 rounded-full">
                        <Users className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <div className="font-semibold">Capacity</div>
                        <div className="text-sm text-muted-foreground">
                          {featuredEvent.maxParticipants} participants
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {featuredEvent.registrationRequired && isEventUpcoming(featuredEvent.date) && (
                  <Button size="lg" className="w-full md:w-auto">
                    Register Now
                  </Button>
                )}
              </CardContent>
            </Card>
          </div>
        </section>
      )}

      {/* Events Grid */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-foreground mb-2">
              {searchTerm || categoryFilter !== "all" || timeFilter !== "all" 
                ? "Search Results" 
                : "All Events"}
            </h2>
            <div className="w-12 h-1 bg-primary rounded"></div>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <CardHeader>
                    <div className="h-4 bg-muted rounded mb-2"></div>
                    <div className="h-6 bg-muted rounded mb-2"></div>
                    <div className="h-4 bg-muted rounded"></div>
                  </CardHeader>
                  <CardContent>
                    <div className="h-4 bg-muted rounded mb-2"></div>
                    <div className="h-4 bg-muted rounded"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : filteredEvents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredEvents.map((event) => (
                <Card key={event.id} className={`group hover:shadow-lg transition-all duration-300 ${
                  !isEventUpcoming(event.date) ? 'opacity-75' : ''
                }`}>
                  <CardHeader>
                    <div className="flex items-center justify-between mb-2">
                      {getCategoryBadge(event.category)}
                      {isEventUpcoming(event.date) ? (
                        <Badge variant="default" className="bg-green-600">Upcoming</Badge>
                      ) : (
                        <Badge variant="outline">Past</Badge>
                      )}
                    </div>

                    <CardTitle className="group-hover:text-primary transition-colors">
                      {event.title}
                    </CardTitle>

                    <CardDescription className="line-clamp-2">
                      {event.description}
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    <div className="flex items-center space-x-2 text-sm">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>{event.date.toLocaleDateString()}</span>
                      {isEventUpcoming(event.date) && (
                        <span className="text-green-600 font-medium">
                          • {formatEventDate(event.date)}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center space-x-2 text-sm">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span className="line-clamp-1">{event.location}</span>
                    </div>

                    {event.maxParticipants && (
                      <div className="flex items-center space-x-2 text-sm">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <span>Max {event.maxParticipants} participants</span>
                      </div>
                    )}

                    {event.registrationRequired && isEventUpcoming(event.date) && (
                      <Button variant="outline" size="sm" className="w-full">
                        Register
                      </Button>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="text-center py-12">
                <CalendarDays className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">
                  {searchTerm || categoryFilter !== "all" || timeFilter !== "all"
                    ? "No events found"
                    : "No events yet"}
                </h3>
                <p className="text-muted-foreground mb-4">
                  {searchTerm || categoryFilter !== "all" || timeFilter !== "all"
                    ? "Try adjusting your search or filter criteria"
                    : "Events will appear here once they're scheduled"}
                </p>
                {(searchTerm || categoryFilter !== "all" || timeFilter !== "all") && (
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSearchTerm("")
                      setCategoryFilter("all")
                      setTimeFilter("all")
                    }}
                  >
                    Clear Filters
                  </Button>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </section>

      <Footer />
    </main>
  )
}