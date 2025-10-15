"use client"

import { useEffect, useState } from "react"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Users, Search, Trophy, Award, Star, Medal, Crown, Target } from "lucide-react"
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
    const config = {
      junior: {
        variant: "secondary" as const,
        className: "bg-gradient-to-r from-emerald-500 to-green-600 text-white font-bold shadow-lg border-0",
        icon: <Star className="h-3 w-3 mr-1" />,
        label: "Junior"
      },
      senior: {
        variant: "default" as const,
        className: "bg-gradient-to-r from-teal-500 to-cyan-600 text-white font-bold shadow-lg border-0",
        icon: <Trophy className="h-3 w-3 mr-1" />,
        label: "Senior"
      },
      veteran: {
        variant: "outline" as const,
        className: "bg-gradient-to-r from-lime-500 to-green-600 text-white font-bold shadow-lg border-0",
        icon: <Crown className="h-3 w-3 mr-1" />,
        label: "Veteran"
      },
    }
    
    const categoryConfig = config[category as keyof typeof config]
    return (
      <Badge variant={categoryConfig.variant} className={categoryConfig.className}>
        {categoryConfig.icon}
        {categoryConfig.label}
      </Badge>
    )
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

      {/* Community Overview */}
      <section className="py-6 sm:py-8 bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 dark:from-green-950 dark:via-emerald-950 dark:to-teal-950">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
          <div className="text-center mb-6 sm:mb-8">
            <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full mb-3 sm:mb-4">
              <Users className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-green-700 via-emerald-600 to-teal-600 bg-clip-text text-transparent mb-2">Tennis Community</h1>
            <p className="text-green-700 dark:text-green-300 text-sm sm:text-base md:text-lg px-4">Discover our passionate tennis players</p>
            <div className="w-16 sm:w-24 h-1 bg-gradient-to-r from-green-500 to-emerald-500 mx-auto mt-2 sm:mt-3 rounded-full"></div>
          </div>
          
          <div className="flex flex-wrap justify-center gap-2 max-w-4xl mx-auto px-2">
            <Button
              variant={categoryFilter === "all" ? "default" : "outline"}
              className={`flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 h-10 sm:h-12 rounded-full font-medium transition-all duration-300 text-xs sm:text-sm ${
                categoryFilter === "all" 
                  ? "bg-green-500 hover:bg-green-600 text-white shadow-lg" 
                  : "bg-white hover:bg-green-50 text-green-700 border-green-300"
              }`}
              onClick={() => setCategoryFilter("all")}
            >
              <Users className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="hidden xs:inline">All</span>
              <span className="text-xs sm:text-sm font-bold">{stats.total}</span>
            </Button>
            
            <Button
              variant={categoryFilter === "junior" ? "default" : "outline"}
              className={`flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 h-10 sm:h-12 rounded-full font-medium transition-all duration-300 text-xs sm:text-sm ${
                categoryFilter === "junior" 
                  ? "bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg" 
                  : "bg-white hover:bg-emerald-50 text-emerald-700 border-emerald-300"
              }`}
              onClick={() => setCategoryFilter("junior")}
            >
              <Star className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="hidden sm:inline">Junior</span>
              <span className="sm:hidden">Jr</span>
              <span className="text-xs sm:text-sm font-bold">{stats.junior}</span>
            </Button>
            
            <Button
              variant={categoryFilter === "senior" ? "default" : "outline"}
              className={`flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 h-10 sm:h-12 rounded-full font-medium transition-all duration-300 text-xs sm:text-sm ${
                categoryFilter === "senior" 
                  ? "bg-teal-500 hover:bg-teal-600 text-white shadow-lg" 
                  : "bg-white hover:bg-teal-50 text-teal-700 border-teal-300"
              }`}
              onClick={() => setCategoryFilter("senior")}
            >
              <Trophy className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="hidden sm:inline">Senior</span>
              <span className="sm:hidden">Sr</span>
              <span className="text-xs sm:text-sm font-bold">{stats.senior}</span>
            </Button>
            
            <Button
              variant={categoryFilter === "veteran" ? "default" : "outline"}
              className={`flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 h-10 sm:h-12 rounded-full font-medium transition-all duration-300 text-xs sm:text-sm ${
                categoryFilter === "veteran" 
                  ? "bg-lime-500 hover:bg-lime-600 text-white shadow-lg" 
                  : "bg-white hover:bg-lime-50 text-lime-700 border-lime-300"
              }`}
              onClick={() => setCategoryFilter("veteran")}
            >
              <Crown className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="hidden sm:inline">Veteran</span>
              <span className="sm:hidden">Vet</span>
              <span className="text-xs sm:text-sm font-bold">{stats.veteran}</span>
            </Button>
          </div>
        </div>
      </section>

      {/* Filters Section */}
      <section className="py-3 sm:py-4 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950 rounded-xl sm:rounded-2xl p-3 sm:p-4 border border-green-200 dark:border-green-800 shadow-lg">
            <div className="flex flex-col gap-3 items-stretch">
              <div className="relative w-full">
                <Search className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-green-500" />
                <Input
                  placeholder="Search players..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 sm:pl-12 pr-3 sm:pr-4 py-2 sm:py-3 text-sm sm:text-base border-2 border-green-200 dark:border-green-700 rounded-lg sm:rounded-xl focus:border-green-500 focus:ring-2 focus:ring-green-200 dark:focus:ring-green-800 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 w-full"
                />
              </div>
              <div className="flex flex-col xs:flex-row gap-3 items-stretch xs:items-center justify-between">
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger className="w-full xs:w-48 py-2 sm:py-3 text-sm sm:text-base border-2 border-green-200 dark:border-green-700 rounded-lg sm:rounded-xl focus:border-green-500 bg-white dark:bg-gray-800">
                    <div className="flex items-center gap-2">
                      <Target className="h-3 w-3 sm:h-4 sm:w-4 text-green-500" />
                      <SelectValue placeholder="Filter by category" />
                    </div>
                  </SelectTrigger>
                  <SelectContent className="rounded-lg sm:rounded-xl">
                    <SelectItem value="all">🎾 All Players</SelectItem>
                    <SelectItem value="junior">⭐ Junior Stars</SelectItem>
                    <SelectItem value="senior">🏆 Senior Champions</SelectItem>
                    <SelectItem value="veteran">👑 Veteran Legends</SelectItem>
                  </SelectContent>
                </Select>
                <div className="px-3 sm:px-4 py-2 bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-900 dark:to-emerald-900 rounded-full font-semibold text-green-800 dark:text-green-200 border border-green-300 dark:border-green-700 text-xs sm:text-sm text-center xs:text-left whitespace-nowrap">
                  {filteredProfiles.length} of {profiles.length} players
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Profiles Grid */}
      <section className="py-6 sm:py-8 bg-gradient-to-br from-green-50/30 via-emerald-50/20 to-teal-50/30 dark:from-green-950/20 dark:via-emerald-950/10 dark:to-teal-950/20 relative overflow-hidden">
        {/* Animated Background Tennis Elements */}
        <div className="absolute inset-0 opacity-10 dark:opacity-20">
          <div className="absolute top-20 left-10 w-16 sm:w-32 h-16 sm:h-32 border-2 sm:border-4 border-green-500 rounded-full animate-float"></div>
          <div className="absolute bottom-20 right-10 w-12 sm:w-24 h-12 sm:h-24 border-2 sm:border-4 border-emerald-500 rounded-full animate-float animate-delay-200"></div>
          <div className="absolute top-1/2 left-1/4 w-8 sm:w-16 h-8 sm:h-16 border-2 sm:border-4 border-teal-500 rounded-full animate-float animate-delay-400"></div>
          <div className="absolute top-40 right-1/3 w-6 sm:w-12 h-6 sm:h-12 bg-green-400 rounded-full animate-bounce opacity-30"></div>
          <div className="absolute bottom-40 left-1/3 w-4 sm:w-8 h-4 sm:h-8 bg-emerald-400 rounded-full animate-pulse opacity-40"></div>
        </div>
        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 relative">
          {loading ? (
            <div className="grid gap-3 sm:gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
              {[...Array(10)].map((_, i) => (
                <Card 
                  key={i} 
                  className="animate-pulse rounded-lg sm:rounded-xl shadow-sm animate-fade-in-up"
                  style={{ animationDelay: `${i * 100}ms` }}
                >
                  <CardContent className="p-3 sm:p-4 text-center">
                    <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-green-200 to-emerald-300 dark:from-green-800 dark:to-emerald-900 rounded-full mx-auto mb-2 sm:mb-3 animate-shimmer"></div>
                    <div className="h-3 sm:h-4 bg-gradient-to-r from-gray-200 via-green-200 to-gray-200 dark:from-gray-700 dark:via-green-800 dark:to-gray-700 rounded mb-2 animate-shimmer"></div>
                    <div className="h-2 sm:h-3 bg-gradient-to-r from-gray-200 via-emerald-200 to-gray-200 dark:from-gray-700 dark:via-emerald-800 dark:to-gray-700 rounded mb-2 w-2/3 mx-auto animate-shimmer"></div>
                    <div className="h-2 sm:h-3 bg-gradient-to-r from-green-200 via-gray-200 to-green-200 dark:from-green-800 dark:via-gray-700 dark:to-green-800 rounded mb-2 sm:mb-3 animate-shimmer"></div>
                    <div className="h-5 sm:h-6 bg-gradient-to-r from-green-300 to-emerald-400 dark:from-green-700 dark:to-emerald-800 rounded animate-shimmer"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : filteredProfiles.length > 0 ? (
            <div className="grid gap-3 sm:gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
              {filteredProfiles.map((profile, index) => (
                <Card 
                  key={profile.id} 
                  className={`group hover:shadow-lg hover:scale-105 hover:-translate-y-1 transition-all duration-300 rounded-lg sm:rounded-xl border bg-white dark:bg-gray-900 shadow-sm animate-fade-in-up`}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <CardContent className="p-3 sm:p-4 text-center">
                    <div className="relative mb-2 sm:mb-3">
                      <img
                        src={profile.imageUrl || "/placeholder.svg"}
                        alt={profile.name}
                        className="w-12 h-12 sm:w-16 sm:h-16 rounded-full object-cover mx-auto border-2 border-green-200 dark:border-green-700 group-hover:border-green-400 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300"
                      />
                    </div>
                    
                    <h3 className="font-semibold text-gray-900 dark:text-white text-xs sm:text-sm mb-1 truncate group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors duration-300">
                      {profile.name}
                    </h3>
                    
                    <div className="flex flex-col xs:flex-row items-center justify-center gap-1 sm:gap-2 mb-2 transform group-hover:scale-105 transition-transform duration-300">
                      <span className="text-xs text-gray-600 dark:text-gray-400">Age {profile.age}</span>
                      {getCategoryBadge(profile.category)}
                    </div>
                    
                    <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2 mb-2 sm:mb-3 leading-relaxed opacity-80 group-hover:opacity-100 transition-opacity duration-300 hidden sm:block">
                      {profile.bio}
                    </p>

                    {profile.achievements.length > 0 && (
                      <div className="mb-2 sm:mb-3 transform group-hover:scale-105 transition-transform duration-300">
                        <div className="text-xs text-green-700 dark:text-green-300 font-medium animate-pulse">
                          🏆 {profile.achievements.length}
                        </div>
                      </div>
                    )}

                    <Button 
                      variant="outline" 
                      size="sm"
                      className="w-full text-xs h-7 sm:h-8 border-green-200 hover:border-green-400 hover:bg-green-50 dark:border-green-700 dark:hover:border-green-500 dark:hover:bg-green-950 transform hover:scale-105 transition-all duration-300"
                    >
                      <span className="group-hover:animate-pulse">View</span>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="col-span-full">
              <CardContent className="text-center py-6 sm:py-8 px-4">
                <Users className="h-10 w-10 sm:h-12 sm:w-12 text-green-500 mx-auto mb-3 sm:mb-4" />
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  {searchTerm || categoryFilter !== "all" ? "No players found" : "No players yet"}
                </h3>
                <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mb-4">
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
                    className="border-green-200 hover:border-green-400 hover:bg-green-50 dark:border-green-700 dark:hover:border-green-500 dark:hover:bg-green-950 text-sm sm:text-base"
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
