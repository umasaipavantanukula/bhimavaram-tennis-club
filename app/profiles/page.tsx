"use client"

import { useEffect, useState } from "react"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Users, Search, Trophy, Award } from "lucide-react"
import { profileOperations, type PlayerProfile } from "@/lib/firebase-operations"

export default function ProfilesPage() {
  const [profiles, setProfiles] = useState<PlayerProfile[]>([])
  const [filteredProfiles, setFilteredProfiles] = useState<PlayerProfile[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")

  useEffect(() => {
    loadProfiles()
  }, [])

  useEffect(() => {
    filterProfiles()
  }, [profiles, searchTerm, categoryFilter])

  const loadProfiles = async () => {
    try {
      const data = await profileOperations.getAll()
      setProfiles(data)
    } catch (error) {
      console.error("Error loading profiles:", error)
    } finally {
      setLoading(false)
    }
  }

  const filterProfiles = () => {
    let filtered = profiles

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        (profile) =>
          profile.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          profile.bio.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    // Filter by category
    if (categoryFilter !== "all") {
      filtered = filtered.filter((profile) => profile.category === categoryFilter)
    }

    setFilteredProfiles(filtered)
  }

  const getCategoryBadge = (category: string) => {
    const variants = {
      junior: "secondary",
      senior: "default",
      veteran: "outline",
    } as const
    return <Badge variant={variants[category as keyof typeof variants]}>{category}</Badge>
  }

  const getCategoryStats = () => {
    const stats = {
      total: profiles.length,
      junior: profiles.filter((p) => p.category === "junior").length,
      senior: profiles.filter((p) => p.category === "senior").length,
      veteran: profiles.filter((p) => p.category === "veteran").length,
    }
    return stats
  }

  const stats = getCategoryStats()

  return (
    <main className="min-h-screen">
      <Navigation />

      {/* Hero Section */}
      <section className="relative py-24 bg-gradient-to-br from-primary/10 via-background to-accent/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-6">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground text-balance">Player Profiles</h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto text-pretty">
              Meet our talented tennis community. Discover players, their achievements, and connect with fellow tennis
              enthusiasts.
            </p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <Card>
              <CardContent className="text-center p-6">
                <div className="text-3xl font-bold text-primary">{stats.total}</div>
                <div className="text-sm text-muted-foreground">Total Players</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="text-center p-6">
                <div className="text-3xl font-bold text-primary">{stats.junior}</div>
                <div className="text-sm text-muted-foreground">Junior Players</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="text-center p-6">
                <div className="text-3xl font-bold text-primary">{stats.senior}</div>
                <div className="text-sm text-muted-foreground">Senior Players</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="text-center p-6">
                <div className="text-3xl font-bold text-primary">{stats.veteran}</div>
                <div className="text-sm text-muted-foreground">Veteran Players</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Filters Section */}
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex items-center gap-4 w-full md:w-auto">
              <div className="relative flex-1 md:w-80">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search players..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="junior">Junior</SelectItem>
                  <SelectItem value="senior">Senior</SelectItem>
                  <SelectItem value="veteran">Veteran</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="text-sm text-muted-foreground">
              Showing {filteredProfiles.length} of {profiles.length} players
            </div>
          </div>
        </div>
      </section>

      {/* Profiles Grid */}
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {[...Array(6)].map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <CardHeader className="text-center">
                    <div className="w-20 h-20 bg-muted rounded-full mx-auto mb-4"></div>
                    <div className="h-6 bg-muted rounded mb-2"></div>
                    <div className="h-4 bg-muted rounded"></div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="h-4 bg-muted rounded"></div>
                      <div className="h-4 bg-muted rounded"></div>
                      <div className="h-4 bg-muted rounded w-3/4"></div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : filteredProfiles.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredProfiles.map((profile) => (
                <Card key={profile.id} className="group hover:shadow-lg transition-all duration-300">
                  <CardHeader className="text-center">
                    <div className="relative mx-auto mb-4">
                      <img
                        src={profile.imageUrl || "/placeholder.svg"}
                        alt={profile.name}
                        className="w-20 h-20 rounded-full object-cover mx-auto border-4 border-primary/20"
                      />
                      {profile.ranking && profile.ranking <= 10 && (
                        <div className="absolute -bottom-2 -right-2 bg-primary text-primary-foreground rounded-full p-2">
                          <Trophy className="h-4 w-4" />
                        </div>
                      )}
                    </div>
                    <CardTitle className="group-hover:text-primary transition-colors">{profile.name}</CardTitle>
                    <CardDescription className="flex items-center justify-center gap-2">
                      Age {profile.age} • {getCategoryBadge(profile.category)}
                    </CardDescription>
                    {profile.ranking && (
                      <Badge variant="outline" className="mx-auto">
                        Ranking #{profile.ranking}
                      </Badge>
                    )}
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground line-clamp-3">{profile.bio}</p>

                    {profile.achievements.length > 0 && (
                      <div>
                        <h4 className="font-semibold text-sm text-foreground mb-2 flex items-center gap-2">
                          <Award className="h-4 w-4" />
                          Recent Achievements
                        </h4>
                        <ul className="text-sm text-muted-foreground space-y-1">
                          {profile.achievements.slice(0, 3).map((achievement, index) => (
                            <li key={index} className="flex items-center">
                              <div className="w-1.5 h-1.5 bg-primary rounded-full mr-2 flex-shrink-0" />
                              {achievement}
                            </li>
                          ))}
                          {profile.achievements.length > 3 && (
                            <li className="text-xs text-muted-foreground/70 italic">
                              +{profile.achievements.length - 3} more achievements
                            </li>
                          )}
                        </ul>
                      </div>
                    )}

                    <div className="pt-4 border-t">
                      <Button variant="outline" className="w-full bg-transparent">
                        View Full Profile
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="text-center py-12">
                <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">
                  {searchTerm || categoryFilter !== "all" ? "No players found" : "No players yet"}
                </h3>
                <p className="text-muted-foreground mb-4">
                  {searchTerm || categoryFilter !== "all"
                    ? "Try adjusting your search or filter criteria"
                    : "Player profiles will appear here once they're added"}
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

      <Footer />
    </main>
  )
}
