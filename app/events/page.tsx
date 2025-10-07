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
    const config = {
      tournament: {
        variant: "default" as const,
        className: "bg-gradient-to-r from-yellow-500 to-orange-600 text-white font-bold shadow-lg border-0",
        icon: "🏆",
        label: "Tournament"
      },
      training: {
        variant: "secondary" as const,
        className: "bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-bold shadow-lg border-0",
        icon: "💪",
        label: "Training"
      },
      social: {
        variant: "outline" as const,
        className: "bg-gradient-to-r from-pink-500 to-rose-600 text-white font-bold shadow-lg border-0",
        icon: "🎉",
        label: "Social"
      },
      maintenance: {
        variant: "destructive" as const,
        className: "bg-gradient-to-r from-gray-500 to-slate-600 text-white font-bold shadow-lg border-0",
        icon: "🔧",
        label: "Maintenance"
      },
    }
    
    const categoryConfig = config[category as keyof typeof config] || config.training
    return (
      <Badge variant={categoryConfig.variant} className={categoryConfig.className}>
        <span className="flex items-center gap-1">
          <span>{categoryConfig.icon}</span>
          <span>{categoryConfig.label}</span>
        </span>
      </Badge>
    )
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



      {/* Quick Stats */}
      <section className="py-8 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="group hover:shadow-lg hover:scale-105 transition-all duration-300 animate-fade-in-up">
              <CardContent className="text-center p-6">
                <CalendarDays className="h-8 w-8 text-green-500 mx-auto mb-2 group-hover:scale-110 transition-transform" />
                <div className="text-2xl font-bold text-green-600 animate-pulse">{stats.total}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Total Events</div>
              </CardContent>
            </Card>
            
            <Card className="group hover:shadow-lg hover:scale-105 transition-all duration-300 animate-fade-in-up animate-delay-100">
              <CardContent className="text-center p-6">
                <Clock className="h-8 w-8 text-emerald-500 mx-auto mb-2 group-hover:scale-110 transition-transform" />
                <div className="text-2xl font-bold text-emerald-600 animate-pulse">{stats.upcoming}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Upcoming</div>
              </CardContent>
            </Card>
            
            <Card className="group hover:shadow-lg hover:scale-105 transition-all duration-300 animate-fade-in-up animate-delay-200">
              <CardContent className="text-center p-6">
                <Users className="h-8 w-8 text-teal-500 mx-auto mb-2 group-hover:scale-110 transition-transform" />
                <div className="text-2xl font-bold text-teal-600 animate-pulse">{stats.tournament}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Tournaments</div>
              </CardContent>
            </Card>
            
            <Card className="group hover:shadow-lg hover:scale-105 transition-all duration-300 animate-fade-in-up animate-delay-300">
              <CardContent className="text-center p-6">
                <Filter className="h-8 w-8 text-lime-500 mx-auto mb-2 group-hover:scale-110 transition-transform" />
                <div className="text-2xl font-bold text-lime-600 animate-pulse">{stats.training}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Training</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Search and Filter Section */}
      <section className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950 rounded-2xl p-6 border border-green-200 dark:border-green-800 animate-fade-in-up">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="flex items-center gap-4 w-full md:w-auto">
                <div className="relative flex-1 md:w-80">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-green-500" />
                  <Input
                    placeholder="Search events..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 border-green-200 dark:border-green-700 focus:border-green-500 rounded-xl"
                  />
                </div>
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger className="w-40 border-green-200 dark:border-green-700 rounded-xl">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">🎾 All Events</SelectItem>
                    <SelectItem value="tournament">🏆 Tournament</SelectItem>
                    <SelectItem value="training">💪 Training</SelectItem>
                    <SelectItem value="social">🎉 Social</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={timeFilter} onValueChange={setTimeFilter}>
                  <SelectTrigger className="w-32 border-green-200 dark:border-green-700 rounded-xl">
                    <SelectValue placeholder="Time" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Time</SelectItem>
                    <SelectItem value="upcoming">Upcoming</SelectItem>
                    <SelectItem value="past">Past</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="text-sm font-medium text-green-700 dark:text-green-300">
                {filteredEvents.length} events found
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Event */}
      {featuredEvent && (
        <section className="py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Card className="group hover:shadow-2xl hover:scale-105 transition-all duration-500 bg-gradient-to-br from-green-50/80 via-emerald-50/60 to-teal-50/80 dark:from-green-950/50 dark:via-emerald-950/30 dark:to-teal-950/50 border-0 shadow-xl rounded-3xl animate-fade-in-up overflow-hidden">
              <CardContent className="p-8">
                <div className="flex items-center gap-3 mb-4">
                  {getCategoryBadge(featuredEvent.category)}
                  <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white animate-pulse">
                    ⭐ Featured
                  </Badge>
                </div>

                <CardTitle className="text-3xl font-bold text-green-800 dark:text-green-200 mb-4 group-hover:text-green-600 transition-colors">
                  {featuredEvent.title}
                </CardTitle>

                <CardDescription className="text-green-700 dark:text-green-300 leading-relaxed mb-6 text-lg">
                  {featuredEvent.description}
                </CardDescription>

                <div className="grid md:grid-cols-3 gap-6 mb-6">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-green-500 rounded-full shadow-lg">
                      <Calendar className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <div className="font-semibold text-green-800 dark:text-green-200">
                        {featuredEvent.date.toLocaleDateString()}
                      </div>
                      <div className="text-sm text-emerald-600 font-medium animate-pulse">
                        {formatEventDate(featuredEvent.date)}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-emerald-500 rounded-full shadow-lg">
                      <MapPin className="h-5 w-5 text-white" />
                    </div>
                    <div className="font-medium text-green-700 dark:text-green-300">
                      {featuredEvent.location}
                    </div>
                  </div>

                  {featuredEvent.maxParticipants && (
                    <div className="flex items-center gap-3">
                      <div className="p-3 bg-teal-500 rounded-full shadow-lg">
                        <Users className="h-5 w-5 text-white" />
                      </div>
                      <div className="font-medium text-green-700 dark:text-green-300">
                        {featuredEvent.maxParticipants} participants
                      </div>
                    </div>
                  )}
                </div>

                {featuredEvent.registrationRequired && isEventUpcoming(featuredEvent.date) && (
                  <Button className="w-full md:w-auto bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold py-3 px-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                    <span className="flex items-center gap-2">
                      🎾 Register Now
                    </span>
                  </Button>
                )}
              </CardContent>
            </Card>
          </div>
        </section>
      )}

      {/* Events Grid */}
      <section className="py-12 bg-gradient-to-br from-green-50/20 via-emerald-50/10 to-teal-50/20 dark:from-green-950/10 dark:via-emerald-950/5 dark:to-teal-950/10 relative overflow-hidden">
        {/* Background animated elements */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-20 left-20 w-24 h-24 border-4 border-green-500 rounded-full animate-float"></div>
          <div className="absolute bottom-20 right-20 w-16 h-16 border-4 border-emerald-500 rounded-full animate-float animate-delay-200"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="mb-8 text-center animate-fade-in-up">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-green-700 via-emerald-600 to-teal-600 bg-clip-text text-transparent mb-4">
              {searchTerm || categoryFilter !== "all" || timeFilter !== "all" 
                ? "🔍 Search Results" 
                : "🎾 All Events"}
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-green-500 to-emerald-500 mx-auto rounded-full"></div>
          </div>

          {loading ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {[...Array(6)].map((_, i) => (
                <Card 
                  key={i} 
                  className="animate-pulse rounded-2xl border-0 shadow-lg bg-gradient-to-br from-white to-green-50/30 dark:from-gray-900 dark:to-green-950/20 animate-fade-in-up"
                  style={{ animationDelay: `${i * 100}ms` }}
                >
                  <CardContent className="p-6">
                    <div className="h-4 bg-gradient-to-r from-green-200 to-emerald-300 dark:from-green-800 dark:to-emerald-900 rounded mb-3 animate-shimmer"></div>
                    <div className="h-6 bg-gradient-to-r from-green-200 to-emerald-300 dark:from-green-800 dark:to-emerald-900 rounded mb-3 animate-shimmer"></div>
                    <div className="h-4 bg-gradient-to-r from-green-200 to-emerald-300 dark:from-green-800 dark:to-emerald-900 rounded mb-4 w-3/4 animate-shimmer"></div>
                    <div className="space-y-3">
                      <div className="h-3 bg-gradient-to-r from-emerald-200 to-teal-300 dark:from-emerald-800 dark:to-teal-900 rounded animate-shimmer"></div>
                      <div className="h-3 bg-gradient-to-r from-emerald-200 to-teal-300 dark:from-emerald-800 dark:to-teal-900 rounded animate-shimmer"></div>
                      <div className="h-3 bg-gradient-to-r from-emerald-200 to-teal-300 dark:from-emerald-800 dark:to-teal-900 rounded animate-shimmer"></div>
                    </div>
                    <div className="h-8 bg-gradient-to-r from-green-300 to-emerald-400 dark:from-green-700 dark:to-emerald-800 rounded mt-4 animate-shimmer"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : filteredEvents.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredEvents.map((event, index) => (
                <Card 
                  key={event.id} 
                  className={`group hover:shadow-xl hover:scale-105 hover:-translate-y-2 transition-all duration-500 rounded-2xl border-0 shadow-lg animate-fade-in-up overflow-hidden ${
                    !isEventUpcoming(event.date) ? 'opacity-75' : 'bg-gradient-to-br from-white to-green-50/30 dark:from-gray-900 dark:to-green-950/20'
                  }`}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        {getCategoryBadge(event.category)}
                      </div>
                      {isEventUpcoming(event.date) ? (
                        <Badge className="bg-green-600 text-white animate-pulse">Upcoming</Badge>
                      ) : (
                        <Badge variant="secondary" className="bg-gray-600 text-white">Past</Badge>
                      )}
                    </div>

                    <CardTitle className="text-lg font-bold text-green-800 dark:text-green-200 mb-2 group-hover:text-green-600 transition-colors line-clamp-1">
                      {event.title}
                    </CardTitle>

                    <CardDescription className="text-green-700 dark:text-green-300 text-sm line-clamp-2 mb-4">
                      {event.description}
                    </CardDescription>

                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="h-4 w-4 text-green-500" />
                        <span className="text-green-700 dark:text-green-300 font-medium">
                          {event.date.toLocaleDateString()}
                        </span>
                        {isEventUpcoming(event.date) && (
                          <span className="text-emerald-600 font-medium animate-pulse">
                            • {formatEventDate(event.date)}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2 text-sm">
                        <MapPin className="h-4 w-4 text-green-500" />
                        <span className="text-green-700 dark:text-green-300 line-clamp-1">
                          {event.location}
                        </span>
                      </div>

                      {event.maxParticipants && (
                        <div className="flex items-center gap-2 text-sm">
                          <Users className="h-4 w-4 text-green-500" />
                          <span className="text-green-700 dark:text-green-300">
                            Max {event.maxParticipants} participants
                          </span>
                        </div>
                      )}
                    </div>

                    {event.registrationRequired && isEventUpcoming(event.date) && (
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="w-full border-green-200 hover:border-green-400 hover:bg-green-50 dark:border-green-700 dark:hover:border-green-500 dark:hover:bg-green-950 text-green-700 hover:text-green-800 transition-all duration-300 hover:scale-105"
                      >
                        🎾 Register Now
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