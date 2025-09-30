"use client"

import { useEffect, useState } from "react"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar, Clock, ArrowRight, Newspaper } from "lucide-react"
import { newsOperations, type NewsArticle } from "@/lib/firebase-operations"

export default function NewsPage() {
  const [articles, setArticles] = useState<NewsArticle[]>([])
  const [filteredArticles, setFilteredArticles] = useState<NewsArticle[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")

  useEffect(() => {
    loadNews()
  }, [])

  useEffect(() => {
    filterArticles()
  }, [articles, searchTerm, categoryFilter])

  const loadNews = async () => {
    try {
      console.log("[News] Loading published articles...")
      const data = await newsOperations.getPublished()
      console.log("[News] Fetched articles:", data)
      console.log("[News] Number of articles:", data.length)
      setArticles(data)
    } catch (error) {
      console.error("[News] Error loading news:", error)
    } finally {
      setLoading(false)
    }
  }

  const filterArticles = () => {
    let filtered = articles

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        (article) =>
          article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          article.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
          article.content.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    // Filter by category
    if (categoryFilter !== "all") {
      filtered = filtered.filter((article) => article.category === categoryFilter)
    }

    setFilteredArticles(filtered)
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

  const getCategoryStats = () => {
    const stats = {
      total: articles.length,
      tournament: articles.filter((a) => a.category === "tournament").length,
      club: articles.filter((a) => a.category === "club").length,
      player: articles.filter((a) => a.category === "player").length,
      general: articles.filter((a) => a.category === "general").length,
    }
    return stats
  }

  const stats = getCategoryStats()
  const featuredArticle = filteredArticles[0]

  return (
    <main className="min-h-screen">
      <Navigation />

      {/* Hero Section */}
      <section className="relative py-24 bg-gradient-to-br from-primary/10 via-background to-accent/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-6">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground text-balance">Club News & Updates</h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto text-pretty">
              Stay informed with the latest news, announcements, and updates from Bhimavaram Tennis Club. From
              tournament results to facility improvements and member achievements.
            </p>
          </div>
        </div>
      </section>

      {/* Search and Filter Section */}
      <section className="py-8 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-6">
            <div className="flex items-center gap-4 w-full md:w-auto">
              <div className="relative flex-1 md:w-80">
                <Input
                  placeholder="Search news..."
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
                  <SelectItem value="club">Club</SelectItem>
                  <SelectItem value="player">Player</SelectItem>
                  <SelectItem value="general">General</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="text-sm text-muted-foreground">
              Showing {filteredArticles.length} of {articles.length} articles
            </div>
          </div>

          {/* Category Stats */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <Card>
              <CardContent className="text-center p-4">
                <div className="text-2xl font-bold text-primary">{stats.total}</div>
                <div className="text-xs text-muted-foreground">Total Articles</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="text-center p-4">
                <div className="text-2xl font-bold text-primary">{stats.tournament}</div>
                <div className="text-xs text-muted-foreground">Tournament</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="text-center p-4">
                <div className="text-2xl font-bold text-primary">{stats.club}</div>
                <div className="text-xs text-muted-foreground">Club News</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="text-center p-4">
                <div className="text-2xl font-bold text-primary">{stats.player}</div>
                <div className="text-xs text-muted-foreground">Player News</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="text-center p-4">
                <div className="text-2xl font-bold text-primary">{stats.general}</div>
                <div className="text-xs text-muted-foreground">General</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Featured News */}
      {featuredArticle && (
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-foreground mb-2">Featured News</h2>
              <div className="w-12 h-1 bg-primary rounded"></div>
            </div>

            <Card className="group hover:shadow-lg transition-all duration-300">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="order-2 lg:order-1 p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    {getCategoryBadge(featuredArticle.category)}
                    <Badge variant="secondary">Featured</Badge>
                  </div>

                  <CardTitle className="text-2xl md:text-3xl group-hover:text-primary transition-colors mb-4 leading-tight">
                    {featuredArticle.title}
                  </CardTitle>

                  <CardDescription className="text-base leading-relaxed mb-6">
                    {featuredArticle.content.substring(0, 300)}...
                  </CardDescription>

                  <div className="flex items-center space-x-6 text-sm text-muted-foreground mb-6">
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-4 w-4" />
                      <span>{featuredArticle.createdAt.toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="h-4 w-4" />
                      <span>{Math.ceil(featuredArticle.content.length / 200)} min read</span>
                    </div>
                  </div>

                  <Button className="group/btn">
                    Read Full Article
                    <ArrowRight className="h-4 w-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                  </Button>
                </div>

                <div className="order-1 lg:order-2">
                  <img
                    src={featuredArticle.imageUrl || "/placeholder.svg"}
                    alt={featuredArticle.title}
                    className="w-full h-64 lg:h-full object-cover rounded-lg"
                  />
                </div>
              </div>
            </Card>
          </div>
        </section>
      )}

      {/* News Articles Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-foreground mb-2">
              {searchTerm || categoryFilter !== "all" ? "Search Results" : "Latest News"}
            </h2>
            <div className="w-12 h-1 bg-primary rounded"></div>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <CardHeader className="p-0">
                    <div className="h-48 bg-muted rounded-t-lg"></div>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="h-4 bg-muted rounded mb-2"></div>
                    <div className="h-6 bg-muted rounded mb-2"></div>
                    <div className="h-4 bg-muted rounded"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : filteredArticles.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredArticles.slice(1).map((article) => (
                <Card key={article.id} className="group hover:shadow-lg transition-all duration-300">
                  <CardHeader className="p-0">
                    <div className="relative">
                      <img
                        src={article.imageUrl || "/placeholder.svg"}
                        alt={article.title}
                        className="w-full h-48 object-cover rounded-t-lg group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute top-3 left-3">{getCategoryBadge(article.category)}</div>
                    </div>
                  </CardHeader>

                  <CardContent className="p-6">
                    <CardTitle className="text-lg group-hover:text-primary transition-colors mb-3 leading-tight">
                      {article.title}
                    </CardTitle>

                    <CardDescription className="text-sm leading-relaxed mb-4 line-clamp-3">
                      {article.excerpt}
                    </CardDescription>

                    <div className="flex items-center justify-between text-xs text-muted-foreground mb-4">
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-3 w-3" />
                        <span>{article.createdAt.toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="h-3 w-3" />
                        <span>{Math.ceil(article.content.length / 200)} min read</span>
                      </div>
                    </div>

                    <Button variant="outline" size="sm" className="w-full bg-transparent">
                      Read More
                      <ArrowRight className="h-3 w-3 ml-1" />
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="text-center py-12">
                <Newspaper className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">
                  {searchTerm || categoryFilter !== "all" ? "No articles found" : "No news yet"}
                </h3>
                <p className="text-muted-foreground mb-4">
                  {searchTerm || categoryFilter !== "all"
                    ? "Try adjusting your search or filter criteria"
                    : "News articles will appear here once they're published"}
                </p>
                {(searchTerm || categoryFilter !== "all") && (
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSearchTerm("")
                      setCategoryFilter("all")
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

      {/* Newsletter Signup */}
      <section className="py-16 bg-muted/30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Card className="bg-primary/5 border-primary/20">
            <CardContent className="p-8">
              <h2 className="text-3xl font-bold text-foreground mb-4">Stay Updated</h2>
              <p className="text-xl text-muted-foreground mb-6">
                Subscribe to our newsletter to receive the latest news, tournament updates, and club announcements
                directly in your inbox.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-3 rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <Button size="lg" className="px-6">
                  Subscribe
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
