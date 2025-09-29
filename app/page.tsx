"use client"

import { useEffect, useState } from "react"
import { Navigation } from "@/components/navigation"
import { HeroSection } from "@/components/hero-section"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Trophy, Calendar, Newspaper, ArrowRight } from "lucide-react"
import {
  matchOperations,
  newsOperations,
  eventOperations,
  type Match,
  type NewsArticle,
  type Event,
} from "@/lib/firebase-operations"
import Link from "next/link"

export default function HomePage() {
  const [recentMatches, setRecentMatches] = useState<Match[]>([])
  const [latestNews, setLatestNews] = useState<NewsArticle[]>([])
  const [upcomingEvents, setUpcomingEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadHomeData()
  }, [])

  const loadHomeData = async () => {
    try {
      const [matches, news, events] = await Promise.all([
        matchOperations.getAll(),
        newsOperations.getPublished(),
        eventOperations.getAll(),
      ])

      // Get recent matches (last 3)
      setRecentMatches(matches.slice(0, 3))

      // Get latest news (last 3)
      setLatestNews(news.slice(0, 3))

      // Get upcoming events (next 3)
      const now = new Date()
      const upcoming = events.filter((event) => event.date >= now).slice(0, 3)
      setUpcomingEvents(upcoming)
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
    <main className="min-h-screen">
      <Navigation />
      <HeroSection />

      {/* Dynamic Content Sections */}
      <div className="py-16 space-y-16">
        {/* Recent Matches */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-foreground flex items-center gap-3">
                <Trophy className="h-8 w-8 text-primary" />
                Recent Matches
              </h2>
              <p className="text-muted-foreground mt-2">Latest tournament results and upcoming matches</p>
            </div>
            <Link href="/tournaments">
              <Button variant="outline" className="bg-transparent">
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
                <Card key={match.id} className="group hover:shadow-lg transition-all duration-300">
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

        {/* Latest News */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 bg-muted/30 py-16 -mx-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-foreground flex items-center gap-3">
                <Newspaper className="h-8 w-8 text-primary" />
                Latest News
              </h2>
              <p className="text-muted-foreground mt-2">Stay updated with club announcements and news</p>
            </div>
            <Link href="/news">
              <Button variant="outline" className="bg-transparent">
                View All <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>
          </div>

          {loading ? (
            <div className="grid gap-6 md:grid-cols-3">
              {[...Array(3)].map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <CardContent className="p-6">
                    <div className="h-32 bg-muted rounded mb-4"></div>
                    <div className="h-4 bg-muted rounded mb-2"></div>
                    <div className="h-6 bg-muted rounded mb-2"></div>
                    <div className="h-4 bg-muted rounded"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : latestNews.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-3">
              {latestNews.map((article) => (
                <Card key={article.id} className="group hover:shadow-lg transition-all duration-300">
                  <CardHeader className="p-0">
                    {article.imageUrl && (
                      <img
                        src={article.imageUrl || "/placeholder.svg"}
                        alt={article.title}
                        className="w-full h-48 object-cover rounded-t-lg"
                      />
                    )}
                    <div className="p-6 pb-4">
                      <div className="flex items-center gap-2 mb-2">
                        {getCategoryBadge(article.category)}
                        <span className="text-xs text-muted-foreground">{article.createdAt.toLocaleDateString()}</span>
                      </div>
                      <CardTitle className="text-lg group-hover:text-primary transition-colors line-clamp-2">
                        {article.title}
                      </CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <CardDescription className="line-clamp-3 mb-4">{article.excerpt}</CardDescription>
                    <Button variant="outline" size="sm" className="bg-transparent">
                      Read More
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="text-center py-12">
                <Newspaper className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No news yet</h3>
                <p className="text-muted-foreground">Check back soon for club updates and announcements</p>
              </CardContent>
            </Card>
          )}
        </section>

        {/* Upcoming Events */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-foreground flex items-center gap-3">
                <Calendar className="h-8 w-8 text-primary" />
                Upcoming Events
              </h2>
              <p className="text-muted-foreground mt-2">Don't miss out on exciting club activities</p>
            </div>
            <Link href="/tournaments">
              <Button variant="outline" className="bg-transparent">
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
          ) : upcomingEvents.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-3">
              {upcomingEvents.map((event) => (
                <Card key={event.id} className="group hover:shadow-lg transition-all duration-300">
                  <CardHeader>
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant="outline">{event.category}</Badge>
                      {event.registrationRequired && <Badge variant="secondary">Registration Required</Badge>}
                    </div>
                    <CardTitle className="text-lg group-hover:text-primary transition-colors">{event.title}</CardTitle>
                    <CardDescription>
                      {event.date.toLocaleDateString()} • {event.location}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground line-clamp-3 mb-4">{event.description}</p>
                    {event.maxParticipants && (
                      <p className="text-xs text-muted-foreground">Max participants: {event.maxParticipants}</p>
                    )}
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
        </section>
      </div>

      <Footer />
    </main>
  )
}
