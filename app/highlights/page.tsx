"use client"

import { useEffect, useState } from "react"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Play, Calendar, Clock, Trophy, Users, Video, Image, Star, Filter } from "lucide-react"
import { highlightsOperations, type MatchHighlight } from "@/lib/firebase-operations"

export default function HighlightsPage() {
  const [highlights, setHighlights] = useState<MatchHighlight[]>([])
  const [filteredHighlights, setFilteredHighlights] = useState<MatchHighlight[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [typeFilter, setTypeFilter] = useState("all")
  const [selectedHighlight, setSelectedHighlight] = useState<MatchHighlight | null>(null)

  useEffect(() => {
    loadHighlights()
  }, [])

  useEffect(() => {
    filterHighlights()
  }, [highlights, searchTerm, typeFilter])

  const loadHighlights = async () => {
    try {
      setLoading(true)
      const data = await highlightsOperations.getAll()
      setHighlights(data)
    } catch (error) {
      console.error("Error loading highlights:", error)
    } finally {
      setLoading(false)
    }
  }

  const filterHighlights = () => {
    let filtered = highlights

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        (highlight) =>
          highlight.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          highlight.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          highlight.players.some(player => player.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    }

    // Filter by type
    if (typeFilter !== "all") {
      filtered = filtered.filter((highlight) => highlight.matchType === typeFilter)
    }

    // Sort by date (newest first) and featured items first
    filtered.sort((a, b) => {
      if (a.featured && !b.featured) return -1
      if (!a.featured && b.featured) return 1
      return b.date.getTime() - a.date.getTime()
    })

    setFilteredHighlights(filtered)
  }

  const getTypeStats = () => {
    return {
      all: highlights.length,
      tournament: highlights.filter(h => h.matchType === "tournament").length,
      championship: highlights.filter(h => h.matchType === "championship").length,
      friendly: highlights.filter(h => h.matchType === "friendly").length,
      training: highlights.filter(h => h.matchType === "training").length,
    }
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    })
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "tournament": return "bg-red-500"
      case "championship": return "bg-yellow-500"
      case "friendly": return "bg-blue-500" 
      case "training": return "bg-green-500"
      default: return "bg-gray-500"
    }
  }

  const stats = getTypeStats()

  return (
    <main className="min-h-screen">
      <Navigation />

      {/* Header Section */}
      <section className="py-8 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Match Highlights
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Relive the best moments from completed matches, tournaments and training sessions
            </p>
          </div>
        </div>
      </section>

      {/* Highlights Grid */}
      <section className="py-12 bg-gradient-to-br from-gray-50 to-green-50/30 dark:from-gray-950 dark:to-green-950/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
              <p className="mt-4 text-gray-600 dark:text-gray-400">Loading highlights...</p>
            </div>
          ) : filteredHighlights.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredHighlights.map((highlight, index) => (
                <Card key={highlight.id} className={`group cursor-pointer transform hover:scale-105 transition-all duration-300 hover:shadow-xl border-0 shadow-lg overflow-hidden ${
                  highlight.featured ? 'ring-2 ring-yellow-400 ring-opacity-75' : ''
                }`}>
                  <div className="relative">
                    <div className="aspect-video bg-gray-200 dark:bg-gray-700 rounded-t-lg overflow-hidden">
                      <img 
                        src={highlight.thumbnailUrl || "/placeholder.jpg"} 
                        alt={highlight.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = "/placeholder.jpg";
                        }}
                      />
                      <div className="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition-all duration-300"></div>
                      
                      {/* Play button overlay for videos */}
                      {highlight.videoUrl && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-16 h-16 bg-green-500/90 rounded-full flex items-center justify-center group-hover:bg-green-600/90 transition-colors duration-300 group-hover:scale-110">
                            <Play className="h-8 w-8 text-white ml-1" />
                          </div>
                        </div>
                      )}

                      {/* Featured badge */}
                      {highlight.featured && (
                        <div className="absolute top-3 left-3">
                          <Badge className="bg-yellow-500 text-black font-semibold">
                            <Star className="h-3 w-3 mr-1" />
                            Featured
                          </Badge>
                        </div>
                      )}

                      {/* Type badge */}
                      <div className="absolute top-3 right-3">
                        <Badge className={`${getTypeColor(highlight.matchType)} text-white font-semibold capitalize`}>
                          {highlight.matchType}
                        </Badge>
                      </div>

                      {/* Media indicators */}
                      <div className="absolute bottom-3 right-3 flex gap-2">
                        {highlight.videoUrl && (
                          <div className="w-8 h-8 bg-red-500/90 rounded-full flex items-center justify-center">
                            <Video className="h-4 w-4 text-white" />
                          </div>
                        )}
                        {highlight.imageUrls.length > 0 && (
                          <div className="w-8 h-8 bg-blue-500/90 rounded-full flex items-center justify-center">
                            <Image className="h-4 w-4 text-white" />
                            <span className="absolute -top-1 -right-1 w-4 h-4 bg-white text-blue-500 rounded-full text-xs flex items-center justify-center font-bold">
                              {highlight.imageUrls.length}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors duration-300">
                      {highlight.title}
                    </CardTitle>
                    <CardDescription className="flex items-center gap-4 text-sm">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {formatDate(highlight.date)}
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        {highlight.players.length} players
                      </div>
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="pt-0">
                    <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                      {highlight.description}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex flex-wrap gap-1">
                        {highlight.players.slice(0, 2).map((player, idx) => (
                          <Badge key={idx} variant="secondary" className="text-xs">
                            {player}
                          </Badge>
                        ))}
                        {highlight.players.length > 2 && (
                          <Badge variant="secondary" className="text-xs">
                            +{highlight.players.length - 2} more
                          </Badge>
                        )}
                      </div>
                      <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 font-semibold">
                        {highlight.score}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Trophy className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 dark:text-gray-400 mb-2">No Highlights Found</h3>
              <p className="text-gray-500 dark:text-gray-500">Try adjusting your search or filter criteria</p>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </main>
  )
}