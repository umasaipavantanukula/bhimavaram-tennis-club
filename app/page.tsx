"use client"

import { useEffect, useState } from "react"
import { Navigation } from "@/components/navigation"
import { HeroSection } from "@/components/hero-section"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Trophy, Calendar, Newspaper, ArrowRight, Images, Play } from "lucide-react"
import {
  matchOperations,
  newsOperations,
  eventOperations,
  galleryOperations,
  highlightsOperations,
  type Match,
  type NewsArticle,
  type Event,
  type GalleryItem,
  type MatchHighlight,
} from "@/lib/firebase-operations"
import Link from "next/link"

export default function HomePage() {
  const [recentMatches, setRecentMatches] = useState<Match[]>([])
  const [latestNews, setLatestNews] = useState<NewsArticle[]>([])
  const [upcomingEvents, setUpcomingEvents] = useState<Event[]>([])
  const [galleryImages, setGalleryImages] = useState<GalleryItem[]>([])
  const [matchHighlights, setMatchHighlights] = useState<MatchHighlight[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadHomeData()
  }, [])

  const loadHomeData = async () => {
    try {
      const [matches, news, events, gallery, highlights] = await Promise.all([
        matchOperations.getAll(),
        newsOperations.getPublished(),
        eventOperations.getAll(),
        galleryOperations.getAll(),
        highlightsOperations.getAll(),
      ])

      // Get recent completed matches only (last 3)
      const completedMatches = matches.filter((match) => match.status === 'completed')
      setRecentMatches(completedMatches.slice(0, 3))

      // Get latest news (last 3)
      setLatestNews(news.slice(0, 3))

      // Get upcoming events (next 3)
      const now = new Date()
      const upcoming = events.filter((event) => event.date >= now).slice(0, 3)
      setUpcomingEvents(upcoming)

      // Get recent gallery images (last 3)
      setGalleryImages(gallery.slice(0, 3))

      // Get recent highlights (most recent 3, already sorted by date desc in firebase-operations)
      setMatchHighlights(highlights.slice(0, 3))
    } catch (error) {
      console.error("Error loading home data:", error)
    } finally {
      setLoading(false)
    }
  }

  const getMatchStatusBadge = (status: string) => {
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
      club: "secondary",
      player: "outline",
      general: "destructive",
    } as const
    return <Badge variant={variants[category as keyof typeof variants]}>{category}</Badge>
  }

  return (
    <main className="min-h-screen mb-0 pb-0">
      <Navigation />
      <HeroSection />

      {/* Dynamic Content Sections */}
      <div className="pb-0 space-y-8">
        {/* Upcoming Matches Scrolling Section */}
        <section className="py-12 bg-gradient-to-r from-green-100 to-blue-100 relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-green-700 mb-4">Upcoming Matches</h2>
              <p className="text-muted-foreground text-lg">Don't miss these exciting upcoming tournaments</p>
            </div>
            
            {/* Scrolling Container */}
            <div className="relative overflow-hidden">
              <div className="flex animate-scroll-rtl space-x-6" style={{width: 'max-content'}}>
                {/* Upcoming Match Cards */}
                {(() => {
                  const now = new Date();
                  const upcomingMatches = recentMatches.filter(match => {
                    // Filter by both status and actual date/time
                    return match.status === 'upcoming' && match.date > now;
                  });
                  return upcomingMatches.length > 0 ? (
                    <>
                      {/* First set of matches */}
                      {upcomingMatches.map((match) => (
                        <div key={match.id} className="flex-none w-80">
                          <Card className="bg-white/90 backdrop-blur-sm border-green-200 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                            <CardHeader className="pb-3">
                              <div className="flex items-center justify-between mb-2">
                                <Badge variant="secondary" className="bg-green-100 text-green-700">{match.tournament}</Badge>
                                <Badge variant="outline" className="bg-blue-100 text-blue-700 border-blue-300">upcoming</Badge>
                              </div>
                              <CardTitle className="text-lg font-bold text-gray-800">
                                {match.player1} vs {match.player2}
                              </CardTitle>
                              <CardDescription className="text-gray-600">
                                {match.date.toLocaleDateString()} • {match.court || "TBD"}
                              </CardDescription>
                            </CardHeader>
                            <CardContent className="pt-0">
                              <div className="text-xl font-bold text-green-600">{match.score || "Match Scheduled"}</div>
                            </CardContent>
                          </Card>
                        </div>
                      ))}
                      
                      {/* Second set for continuous scrolling */}
                      {upcomingMatches.map((match) => (
                        <div key={`scroll-${match.id}`} className="flex-none w-80">
                          <Card className="bg-white/90 backdrop-blur-sm border-green-200 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                            <CardHeader className="pb-3">
                              <div className="flex items-center justify-between mb-2">
                                <Badge variant="secondary" className="bg-green-100 text-green-700">{match.tournament}</Badge>
                                <Badge variant="outline" className="bg-blue-100 text-blue-700 border-blue-300">upcoming</Badge>
                              </div>
                              <CardTitle className="text-lg font-bold text-gray-800">
                                {match.player1} vs {match.player2}
                              </CardTitle>
                              <CardDescription className="text-gray-600">
                                {match.date.toLocaleDateString()} • {match.court || "TBD"}
                              </CardDescription>
                            </CardHeader>
                            <CardContent className="pt-0">
                              <div className="text-xl font-bold text-green-600">{match.score || "Match Scheduled"}</div>
                            </CardContent>
                          </Card>
                        </div>
                      ))}
                      
                      {/* Third set for extra smoothness */}
                      {upcomingMatches.map((match) => (
                        <div key={`extra-${match.id}`} className="flex-none w-80">
                          <Card className="bg-white/90 backdrop-blur-sm border-green-200 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                            <CardHeader className="pb-3">
                              <div className="flex items-center justify-between mb-2">
                                <Badge variant="secondary" className="bg-green-100 text-green-700">{match.tournament}</Badge>
                                <Badge variant="outline" className="bg-blue-100 text-blue-700 border-blue-300">upcoming</Badge>
                              </div>
                              <CardTitle className="text-lg font-bold text-gray-800">
                                {match.player1} vs {match.player2}
                              </CardTitle>
                              <CardDescription className="text-gray-600">
                                {match.date.toLocaleDateString()} • {match.court || "TBD"}
                              </CardDescription>
                            </CardHeader>
                            <CardContent className="pt-0">
                              <div className="text-xl font-bold text-green-600">{match.score || "Match Scheduled"}</div>
                            </CardContent>
                          </Card>
                        </div>
                      ))}
                    </>
                  ) : null;
                })() || (
                  /* Fallback upcoming matches if no data */
                  <>
                    <div className="flex-none w-80">
                      <Card className="bg-white/90 backdrop-blur-sm border-green-200 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                        <CardHeader className="pb-3">
                          <div className="flex items-center justify-between mb-2">
                            <Badge variant="secondary" className="bg-green-100 text-green-700">Singles Championship</Badge>
                            <Badge variant="outline" className="bg-blue-100 text-blue-700 border-blue-300">upcoming</Badge>
                          </div>
                          <CardTitle className="text-lg font-bold text-gray-800">
                            Ravi vs Anand
                          </CardTitle>
                          <CardDescription className="text-gray-600">
                            Oct 15, 2025 • Court 1
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="pt-0">
                          <div className="text-xl font-bold text-green-600">Match Scheduled</div>
                        </CardContent>
                      </Card>
                    </div>
                    
                    <div className="flex-none w-80">
                      <Card className="bg-white/90 backdrop-blur-sm border-green-200 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                        <CardHeader className="pb-3">
                          <div className="flex items-center justify-between mb-2">
                            <Badge variant="secondary" className="bg-green-100 text-green-700">Doubles Tournament</Badge>
                            <Badge variant="outline" className="bg-blue-100 text-blue-700 border-blue-300">upcoming</Badge>
                          </div>
                          <CardTitle className="text-lg font-bold text-gray-800">
                            Team A vs Team B
                          </CardTitle>
                          <CardDescription className="text-gray-600">
                            Oct 18, 2025 • Court 2
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="pt-0">
                          <div className="text-xl font-bold text-green-600">Match Scheduled</div>
                        </CardContent>
                      </Card>
                    </div>
                    
                    <div className="flex-none w-80">
                      <Card className="bg-white/90 backdrop-blur-sm border-green-200 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                        <CardHeader className="pb-3">
                          <div className="flex items-center justify-between mb-2">
                            <Badge variant="secondary" className="bg-green-100 text-green-700">Club Championship</Badge>
                            <Badge variant="outline" className="bg-blue-100 text-blue-700 border-blue-300">upcoming</Badge>
                          </div>
                          <CardTitle className="text-lg font-bold text-gray-800">
                            Priya vs Suresh
                          </CardTitle>
                          <CardDescription className="text-gray-600">
                            Oct 22, 2025 • Court 1
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="pt-0">
                          <div className="text-xl font-bold text-green-600">Match Scheduled</div>
                        </CardContent>
                      </Card>
                    </div>

                    {/* Duplicate for continuous scroll */}
                    <div className="flex-none w-80">
                      <Card className="bg-white/90 backdrop-blur-sm border-green-200 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                        <CardHeader className="pb-3">
                          <div className="flex items-center justify-between mb-2">
                            <Badge variant="secondary" className="bg-green-100 text-green-700">Singles Championship</Badge>
                            <Badge variant="outline" className="bg-blue-100 text-blue-700 border-blue-300">upcoming</Badge>
                          </div>
                          <CardTitle className="text-lg font-bold text-gray-800">
                            Ravi vs Anand
                          </CardTitle>
                          <CardDescription className="text-gray-600">
                            Oct 15, 2025 • Court 1
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="pt-0">
                          <div className="text-xl font-bold text-green-600">Match Scheduled</div>
                        </CardContent>
                      </Card>
                    </div>
                    
                    <div className="flex-none w-80">
                      <Card className="bg-white/90 backdrop-blur-sm border-green-200 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                        <CardHeader className="pb-3">
                          <div className="flex items-center justify-between mb-2">
                            <Badge variant="secondary" className="bg-green-100 text-green-700">Doubles Tournament</Badge>
                            <Badge variant="outline" className="bg-blue-100 text-blue-700 border-blue-300">upcoming</Badge>
                          </div>
                          <CardTitle className="text-lg font-bold text-gray-800">
                            Team A vs Team B
                          </CardTitle>
                          <CardDescription className="text-gray-600">
                            Oct 18, 2025 • Court 2
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="pt-0">
                          <div className="text-xl font-bold text-green-600">Match Scheduled</div>
                        </CardContent>
                      </Card>
                    </div>
                    
                    <div className="flex-none w-80">
                      <Card className="bg-white/90 backdrop-blur-sm border-green-200 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                        <CardHeader className="pb-3">
                          <div className="flex items-center justify-between mb-2">
                            <Badge variant="secondary" className="bg-green-100 text-green-700">Club Championship</Badge>
                            <Badge variant="outline" className="bg-blue-100 text-blue-700 border-blue-300">upcoming</Badge>
                          </div>
                          <CardTitle className="text-lg font-bold text-gray-800">
                            Priya vs Suresh
                          </CardTitle>
                          <CardDescription className="text-gray-600">
                            Oct 22, 2025 • Court 1
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="pt-0">
                          <div className="text-xl font-bold text-green-600">Match Scheduled</div>
                        </CardContent>
                      </Card>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Recent Matches */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative overflow-hidden">
          {/* Background decoration */}
          <div className="absolute inset-0 bg-gradient-to-r from-green-50/30 to-blue-50/30 rounded-3xl -z-10"></div>
          <div className="absolute top-4 right-4 w-32 h-32 bg-green-100/40 rounded-full blur-2xl -z-10"></div>
          <div className="absolute bottom-4 left-4 w-24 h-24 bg-blue-100/40 rounded-full blur-xl -z-10"></div>
          <div className="flex items-center justify-between mb-8 relative">
            <div className="relative">
              <div className="absolute -top-2 -left-2 w-16 h-16 bg-gradient-to-br from-green-200/50 to-blue-200/50 rounded-full blur-lg -z-10"></div>
              <h2 className="text-4xl font-bold text-green-700 flex items-center gap-3">
                <Trophy className="h-10 w-10 text-green-600 drop-shadow-sm" />
                Recent Matches
              </h2>
              <p className="text-muted-foreground mt-2 text-lg">Latest tournament results and upcoming matches</p>
            </div>
            <Link href="/tournaments">
              <Button variant="outline" className="bg-green-500 text-white border-0 hover:bg-green-600 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                View All <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>
          </div>

          {loading ? (
            <div className="grid gap-6 md:grid-cols-3">
              {[...Array(3)].map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <CardContent className="p-6">
                    <div className="h-4 bg-muted rounded mb-4"></div>
                    <div className="h-6 bg-muted rounded mb-2"></div>
                    <div className="h-4 bg-muted rounded"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : recentMatches.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-3">
              {recentMatches.map((match) => (
                <Card key={match.id} className="group hover:shadow-2xl hover:shadow-green-500/25 transition-all duration-500 transform hover:-translate-y-2 bg-gradient-to-br from-white to-green-50/50 border-0 shadow-lg backdrop-blur-sm">
                  <CardHeader>
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant="outline">{match.tournament}</Badge>
                      {getMatchStatusBadge(match.status)}
                    </div>
                    <CardTitle className="text-lg group-hover:text-primary transition-colors">
                      {match.player1} vs {match.player2}
                    </CardTitle>
                    <CardDescription>
                      {match.date.toLocaleDateString()} • {match.court || "TBD"}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-primary">{match.score || "TBD"}</div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="text-center py-12">
                <Trophy className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No matches yet</h3>
                <p className="text-muted-foreground">Check back soon for upcoming matches and results</p>
              </CardContent>
            </Card>
          )}
        </section>

        {/* Tennis Club Features - Alternating Layout */}
        {/* Feature 1: Professional Training */}
        <section className="py-12 bg-gradient-to-br from-green-50 to-blue-50 relative overflow-hidden">
          {/* Animated background elements */}
          <div className="absolute top-10 left-10 w-20 h-20 bg-green-200/30 rounded-full animate-pulse"></div>
          <div className="absolute bottom-10 right-10 w-32 h-32 bg-blue-200/30 rounded-full animate-bounce" style={{animationDuration: '3s'}}></div>
          <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-yellow-200/30 rounded-full animate-ping" style={{animationDuration: '4s'}}></div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Image Side */}
              <div className="relative group">
                <div className="relative overflow-hidden rounded-2xl shadow-2xl transform transition-transform duration-300 group-hover:scale-105">
                  <div className="absolute inset-0 bg-gradient-to-tr from-green-500/20 to-blue-500/20 z-10"></div>
                  <img
                    src="homeimage.png"
                    alt="Professional Tennis Training"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute top-4 right-4 bg-gradient-to-r from-green-500 to-blue-500 backdrop-blur-sm rounded-full p-4 z-20 animate-pulse">
                    <Trophy className="h-6 w-6 text-white drop-shadow-lg" />
                  </div>

                </div>
                {/* Decorative elements */}
                <div className="absolute -top-4 -right-4 w-20 h-20 bg-gradient-to-br from-yellow-300/30 to-orange-300/30 rounded-full blur-xl -z-10 animate-pulse"></div>
                <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-gradient-to-br from-blue-300/30 to-green-300/30 rounded-full blur-lg -z-10 animate-bounce" style={{animationDuration: '3s'}}></div>
              </div>
              
              {/* Text Side */}
              <div className="space-y-6">
                <div className="relative">
                  <div className="absolute -top-4 -left-4 w-24 h-24 bg-gradient-to-br from-green-300/40 to-blue-300/40 rounded-full blur-xl -z-10"></div>
                  <h2 className="text-5xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent mb-6 leading-tight">
                    Bhimavaram Tennis Club
                  </h2>
                  <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                    Elevate your game with expert coaching and personalized training programs. Join 100+ players who have improved their skills!
                  </p>
                </div>
                
                <div className="space-y-6">
                  <div className="flex items-center gap-4 group transform transition-transform duration-300 hover:translate-x-2">
                    <div className="h-12 w-12 rounded-full bg-green-500 flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow duration-300">
                      <div className="h-3 w-3 rounded-full bg-white"></div>
                    </div>
                    <span className="text-gray-700 font-semibold text-lg group-hover:text-green-600 transition-colors duration-300">Expert certified coaches</span>
                  </div>
                  <div className="flex items-center gap-4 group transform transition-transform duration-300 hover:translate-x-2">
                    <div className="h-12 w-12 rounded-full bg-green-500 flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow duration-300">
                      <div className="h-3 w-3 rounded-full bg-white"></div>
                    </div>
                    <span className="text-gray-700 font-semibold text-lg group-hover:text-green-600 transition-colors duration-300">Personalized training plans</span>
                  </div>
                  <div className="flex items-center gap-4 group transform transition-transform duration-300 hover:translate-x-2">
                    <div className="h-12 w-12 rounded-full bg-green-500 flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow duration-300">
                      <div className="h-3 w-3 rounded-full bg-white"></div>
                    </div>
                    <span className="text-gray-700 font-semibold text-lg group-hover:text-green-600 transition-colors duration-300">Modern training facilities</span>
                  </div>
                  <div className="flex items-center gap-4 group transform transition-transform duration-300 hover:translate-x-2">
                    <div className="h-12 w-12 rounded-full bg-green-500 flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow duration-300">
                      <div className="h-3 w-3 rounded-full bg-white"></div>
                    </div>
                    <span className="text-gray-700 font-semibold text-lg group-hover:text-green-600 transition-colors duration-300">Performance tracking & analysis</span>
                  </div>
                </div>
                
              </div>
            </div>
          </div>
        </section>

        {/* Gallery Section */}
        <section className="py-12 bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50 relative overflow-hidden">
          {/* Floating elements */}
          <div className="absolute top-8 right-8 w-40 h-40 bg-gradient-to-br from-purple-200/30 to-pink-200/30 rounded-full blur-2xl animate-float"></div>
          <div className="absolute bottom-8 left-8 w-28 h-28 bg-gradient-to-br from-blue-200/30 to-purple-200/30 rounded-full blur-xl animate-float" style={{animationDelay: '2s'}}></div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-8 relative">
              <div className="relative">
                <div className="absolute -top-3 -left-3 w-20 h-20 bg-gradient-to-br from-purple-200/50 to-pink-200/50 rounded-full blur-lg -z-10"></div>
                <h2 className="text-4xl font-bold text-green-700 flex items-center gap-3">
                  <Images className="h-10 w-10 text-green-600 drop-shadow-sm" />
                  Gallery
                </h2>
                <p className="text-muted-foreground mt-2 text-lg">Capture the moments from our tennis club activities</p>
              </div>
              <Link href="/gallery">
                <Button variant="outline" className="bg-green-500 text-white border-0 hover:bg-green-600 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                  View All <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </Link>
            </div>

            {loading ? (
              <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                {[...Array(3)].map((_, i) => (
                  <Card key={i} className="animate-pulse">
                    <div className="aspect-[4/3] bg-muted rounded-lg"></div>
                  </Card>
                ))}
              </div>
            ) : galleryImages.length > 0 ? (
              <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                {galleryImages.map((item) => (
                  <Card key={item.id} className="group overflow-hidden hover:shadow-2xl hover:shadow-purple-500/25 transition-all duration-500 transform hover:-translate-y-3 p-0 border-0 bg-gradient-to-br from-white to-purple-50/30 backdrop-blur-sm shadow-lg">
                    <div className="relative aspect-[4/3] overflow-hidden">
                      <img
                        src={item.imageUrl || "/placeholder.svg"}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      <div className="absolute bottom-0 left-0 right-0 p-4 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <h3 className="font-semibold text-sm mb-1">{item.title}</h3>
                        <p className="text-xs text-white/90 mb-2 line-clamp-2">{item.description}</p>
                        <Badge variant="secondary" className="text-xs">
                          {item.category}
                        </Badge>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                {/* Fallback Gallery Cards */}
                <Card className="group overflow-hidden hover:shadow-2xl hover:shadow-purple-500/25 transition-all duration-500 transform hover:-translate-y-3 p-0 border-0 bg-gradient-to-br from-white to-purple-50/30 backdrop-blur-sm shadow-lg">
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <img
                      src="/tennis-court-aerial-view-with-green-surface-and-wh.jpg"
                      alt="Tennis Court Aerial View"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="absolute bottom-0 left-0 right-0 p-4 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <h3 className="font-semibold text-sm">Court Views</h3>
                      <p className="text-xs text-white/90">Professional facilities</p>
                    </div>
                  </div>
                </Card>

                <Card className="group overflow-hidden hover:shadow-2xl hover:shadow-purple-500/25 transition-all duration-500 transform hover:-translate-y-3 p-0 border-0 bg-gradient-to-br from-white to-purple-50/30 backdrop-blur-sm shadow-lg">
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <img
                      src="/tennis-tournament-court.jpg"
                      alt="Tennis Tournament"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="absolute bottom-0 left-0 right-0 p-4 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <h3 className="font-semibold text-sm">Tournaments</h3>
                      <p className="text-xs text-white/90">Championship moments</p>
                    </div>
                  </div>
                </Card>

                <Card className="group overflow-hidden hover:shadow-2xl hover:shadow-purple-500/25 transition-all duration-500 transform hover:-translate-y-3 p-0 border-0 bg-gradient-to-br from-white to-purple-50/30 backdrop-blur-sm shadow-lg">
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <img
                      src="/coach-vikram-performance-specialist.jpg"
                      alt="Professional Coaching"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="absolute bottom-0 left-0 right-0 p-4 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <h3 className="font-semibold text-sm">Coaching</h3>
                      <p className="text-xs text-white/90">Expert guidance</p>
                    </div>
                  </div>
                </Card>
              </div>
            )}
          </div>
        </section>

        {/* Recent Highlights Section */}
        <section className="pt-12 pb-8 bg-gradient-to-br from-orange-50 via-red-50 to-pink-50 relative overflow-hidden">
          {/* Dynamic background elements */}
          <div className="absolute top-12 right-12 w-36 h-36 bg-gradient-to-br from-orange-200/40 to-red-200/40 rounded-full blur-2xl animate-pulse"></div>
          <div className="absolute bottom-12 left-12 w-28 h-28 bg-gradient-to-br from-red-200/40 to-pink-200/40 rounded-full blur-xl animate-bounce" style={{animationDuration: '4s'}}></div>
          <div className="absolute top-1/3 right-1/4 w-20 h-20 bg-gradient-to-br from-pink-200/30 to-orange-200/30 rounded-full blur-lg animate-ping" style={{animationDuration: '5s'}}></div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-8 relative">
              <div className="relative">
                <div className="absolute -top-4 -left-4 w-24 h-24 bg-gradient-to-br from-orange-200/50 to-red-200/50 rounded-full blur-lg -z-10"></div>
                <h2 className="text-4xl font-bold text-green-700 flex items-center gap-3">
                  <Play className="h-10 w-10 text-green-600 drop-shadow-sm" />
                  Recent Highlights
                </h2>
                <p className="text-muted-foreground mt-2 text-lg">Latest match highlights and memorable moments from our tournaments</p>
              </div>
              <Link href="/highlights">
                <Button variant="outline" className="bg-green-500 text-white border-0 hover:bg-green-600 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                  View All <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </Link>
            </div>

            {loading ? (
              <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                {[...Array(3)].map((_, i) => (
                  <Card key={i} className="animate-pulse bg-white/80 backdrop-blur-sm border-green-200 shadow-lg overflow-hidden p-0">
                    <div className="aspect-video bg-gradient-to-br from-green-100 to-green-200 m-0"></div>
                    <CardContent className="p-6">
                      <div className="h-5 bg-green-200 rounded mb-3"></div>
                      <div className="h-4 bg-green-100 rounded mb-2"></div>
                      <div className="h-3 bg-green-200 rounded w-3/4"></div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : matchHighlights.length > 0 ? (
              <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                {matchHighlights.map((highlight) => (
                  <Link key={highlight.id} href="/highlights">
                    <Card className="group hover:shadow-2xl hover:shadow-green-500/20 transition-all duration-500 transform hover:-translate-y-3 overflow-hidden bg-white/90 backdrop-blur-sm border-green-200 animate-fade-in-up p-0">
                      <div className="relative aspect-video overflow-hidden bg-gray-100 m-0">
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"></div>
                        
                        <img
                          src={highlight.thumbnailUrl || "/placeholder.jpg"}
                          alt={highlight.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 block"
                          loading="lazy"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = "/placeholder.jpg";
                          }}
                        />
                        
                        {/* Type badge */}
                        <div className="absolute top-3 left-3 z-20">
                          <Badge className={`
                            ${highlight.matchType === 'tournament' ? 'bg-red-500' : ''}
                            ${highlight.matchType === 'championship' ? 'bg-yellow-500' : ''}
                            ${highlight.matchType === 'friendly' ? 'bg-blue-500' : ''}
                            ${highlight.matchType === 'training' ? 'bg-green-500' : ''}
                            text-white border-0 shadow-lg capitalize transform group-hover:scale-105 transition-transform duration-300
                          `}>
                            🏆 {highlight.matchType}
                          </Badge>
                        </div>

                        {/* Featured badge */}
                        {highlight.featured && (
                          <div className="absolute top-3 right-3 z-20">
                            <Badge className="bg-yellow-500 text-black font-semibold border-0 shadow-lg transform group-hover:scale-105 transition-transform duration-300">
                              <Trophy className="h-3 w-3 mr-1" />
                              Featured
                            </Badge>
                          </div>
                        )}
                        
                        {/* Play button overlay for videos */}
                        {highlight.videoUrl ? (
                          <div className="absolute inset-0 bg-green-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                            <div className="w-16 h-16 bg-green-500/90 rounded-full flex items-center justify-center group-hover:bg-green-600/90 transition-colors duration-300 group-hover:scale-110">
                              <Play className="h-8 w-8 text-white ml-1" />
                            </div>
                          </div>
                        ) : (
                          <div className="absolute inset-0 bg-green-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                            <Trophy className="h-8 w-8 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                          </div>
                        )}
                      </div>

                      <CardContent className="p-4">
                        <h3 className="font-semibold text-gray-800 text-center">
                          {highlight.title}
                        </h3>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                {/* Fallback Highlight Cards */}
                <Link href="/highlights">
                  <Card className="group hover:shadow-2xl hover:shadow-green-500/20 transition-all duration-500 transform hover:-translate-y-3 overflow-hidden bg-white/90 backdrop-blur-sm border-green-200 p-0">
                    <div className="relative aspect-video overflow-hidden bg-gray-100 m-0">
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"></div>
                      <img
                        src="/tennis-tournament-court.jpg"
                        alt="Championship Match"
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 block"
                        loading="lazy"
                      />
                      <div className="absolute top-3 left-3 z-20">
                        <Badge className="bg-red-500 text-white border-0 shadow-lg capitalize transform group-hover:scale-105 transition-transform duration-300">
                          🏆 Tournament
                        </Badge>
                      </div>
                      <div className="absolute inset-0 bg-green-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                        <div className="w-16 h-16 bg-green-500/90 rounded-full flex items-center justify-center group-hover:bg-green-600/90 transition-colors duration-300 group-hover:scale-110">
                          <Play className="h-8 w-8 text-white ml-1" />
                        </div>
                      </div>
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-semibold text-gray-800 text-center">
                        Championship Finals
                      </h3>
                    </CardContent>
                  </Card>
                </Link>

                <Link href="/highlights">
                  <Card className="group hover:shadow-2xl hover:shadow-green-500/20 transition-all duration-500 transform hover:-translate-y-3 overflow-hidden bg-white/90 backdrop-blur-sm border-green-200 p-0">
                    <div className="relative aspect-video overflow-hidden bg-gray-100 m-0">
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"></div>
                      <img
                        src="/tennis-court-aerial-view-with-green-surface-and-wh.jpg"
                        alt="Training Session"
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 block"
                        loading="lazy"
                      />
                      <div className="absolute top-3 left-3 z-20">
                        <Badge className="bg-green-500 text-white border-0 shadow-lg capitalize transform group-hover:scale-105 transition-transform duration-300">
                          🏆 Training
                        </Badge>
                      </div>
                      <div className="absolute inset-0 bg-green-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                        <div className="w-16 h-16 bg-green-500/90 rounded-full flex items-center justify-center group-hover:bg-green-600/90 transition-colors duration-300 group-hover:scale-110">
                          <Play className="h-8 w-8 text-white ml-1" />
                        </div>
                      </div>
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-semibold text-gray-800 text-center">
                        Training Highlights
                      </h3>
                    </CardContent>
                  </Card>
                </Link>

                <Link href="/highlights">
                  <Card className="group hover:shadow-2xl hover:shadow-green-500/20 transition-all duration-500 transform hover:-translate-y-3 overflow-hidden bg-white/90 backdrop-blur-sm border-green-200 p-0">
                    <div className="relative aspect-video overflow-hidden bg-gray-100 m-0">
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"></div>
                      <img
                        src="/tennis-game-tennis-balls-rackets-background_488220-3598.jpg"
                        alt="Match Highlights"
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 block"
                        loading="lazy"
                      />
                      <div className="absolute top-3 left-3 z-20">
                        <Badge className="bg-blue-500 text-white border-0 shadow-lg capitalize transform group-hover:scale-105 transition-transform duration-300">
                          🏆 Friendly
                        </Badge>
                      </div>
                      <div className="absolute top-3 right-3 z-20">
                        <Badge className="bg-yellow-500 text-black font-semibold border-0 shadow-lg transform group-hover:scale-105 transition-transform duration-300">
                          <Trophy className="h-3 w-3 mr-1" />
                          Featured
                        </Badge>
                      </div>
                      <div className="absolute inset-0 bg-green-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                        <div className="w-16 h-16 bg-green-500/90 rounded-full flex items-center justify-center group-hover:bg-green-600/90 transition-colors duration-300 group-hover:scale-110">
                          <Play className="h-8 w-8 text-white ml-1" />
                        </div>
                      </div>
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-semibold text-gray-800 text-center">
                        Best Rallies
                      </h3>
                    </CardContent>
                  </Card>
                </Link>
              </div>
            )}
          </div>
        </section>
      </div>

      <Footer />
    </main>
  )
}
