"use client"

import { useEffect, useState } from "react"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Play, Calendar, Clock, Trophy, Users, Video, Image, Star, Filter, X } from "lucide-react"
import { highlightsOperations, type MatchHighlight } from "@/lib/firebase-operations"

export default function HighlightsPage() {
  const [highlights, setHighlights] = useState<MatchHighlight[]>([])
  const [filteredHighlights, setFilteredHighlights] = useState<MatchHighlight[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [typeFilter, setTypeFilter] = useState("all")
  const [selectedHighlight, setSelectedHighlight] = useState<MatchHighlight | null>(null)
  const [playingVideo, setPlayingVideo] = useState<string | null>(null)
  const [loadingVideo, setLoadingVideo] = useState<string | null>(null)
  const [failedVideos, setFailedVideos] = useState<Set<string>>(new Set())

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

  const handleVideoPlay = (highlightId: string) => {
    if (playingVideo === highlightId) {
      setPlayingVideo(null)
      setLoadingVideo(null)
    } else {
      setLoadingVideo(highlightId)
      setPlayingVideo(highlightId)
      // Clear loading after a short delay
      setTimeout(() => setLoadingVideo(null), 1000)
    }
  }

  const isVideoFile = (url: string) => {
    if (!url) return false
    const videoExtensions = ['.mp4', '.webm', '.ogg', '.mov', '.avi', '.mkv']
    return videoExtensions.some(ext => url.toLowerCase().includes(ext)) || 
           url.includes('youtube.com') || url.includes('vimeo.com') || url.includes('youtu.be')
  }

  const handleVideoError = (highlightId: string, videoUrl: string) => {
    console.error("Video failed to load:", { highlightId, videoUrl })
    setPlayingVideo(null)
    setLoadingVideo(null)
    setFailedVideos(prev => new Set([...prev, highlightId]))
  }

  const getEmbedUrl = (url: string) => {
    if (!url) return url
    
    // YouTube URL transformations
    if (url.includes('youtube.com/watch')) {
      const videoId = url.split('v=')[1]?.split('&')[0]
      return `https://www.youtube.com/embed/${videoId}`
    } 
    if (url.includes('youtu.be/')) {
      const videoId = url.split('youtu.be/')[1]?.split('?')[0]
      return `https://www.youtube.com/embed/${videoId}`
    }
    
    // Vimeo URL transformations
    if (url.includes('vimeo.com/')) {
      const videoId = url.split('vimeo.com/')[1]?.split('?')[0]
      return `https://player.vimeo.com/video/${videoId}`
    }
    
    return url
  }

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

          {/* Search and Filter Controls */}
          <div className="max-w-4xl mx-auto space-y-6">
            {/* Search and Filter Bar */}
            <div className="flex flex-col md:flex-row gap-4 items-center">
              <div className="flex-1 relative">
                <Input
                  placeholder="Search highlights, players, or description..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border-2 border-gray-200 dark:border-gray-700 focus:border-green-500 dark:focus:border-green-400 rounded-lg"
                />
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                  <Filter className="h-4 w-4 text-gray-400" />
                </div>
              </div>
              
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-full md:w-48 border-2 border-gray-200 dark:border-gray-700 focus:border-green-500 dark:focus:border-green-400">
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="tournament">Tournament</SelectItem>
                  <SelectItem value="championship">Championship</SelectItem>
                  <SelectItem value="friendly">Friendly</SelectItem>
                  <SelectItem value="training">Training</SelectItem>
                </SelectContent>
              </Select>

              <Button
                variant="outline"
                onClick={loadHighlights}
                disabled={loading}
                className="flex items-center gap-2"
              >
                <Calendar className="h-4 w-4" />
                Refresh
              </Button>

              {(searchTerm || typeFilter !== "all") && (
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchTerm("")
                    setTypeFilter("all")
                  }}
                  className="flex items-center gap-2"
                >
                  <X className="h-4 w-4" />
                  Clear
                </Button>
              )}
            </div>

            {/* Results count */}
            {(searchTerm || typeFilter !== "all") && (
              <div className="text-center text-sm text-gray-600 dark:text-gray-400">
                Showing {filteredHighlights.length} of {highlights.length} highlights
              </div>
            )}
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
                <Card key={highlight.id} className={`group transform hover:scale-105 transition-all duration-300 hover:shadow-xl border-0 shadow-lg overflow-hidden ${
                  highlight.featured ? 'ring-2 ring-yellow-400 ring-opacity-75' : ''
                }`}>
                  <div className="relative">
                    <div className="aspect-video bg-gray-200 dark:bg-gray-700 rounded-t-lg overflow-hidden">
                      {/* Show video if playing, otherwise show thumbnail */}
                      {playingVideo === highlight.id && highlight.videoUrl ? (
                        <div className="relative">
                          {/* Loading indicator */}
                          {loadingVideo === highlight.id && (
                            <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-10">
                              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
                            </div>
                          )}
                          
                          {/* Handle YouTube/Vimeo embeds */}
                          {highlight.videoUrl.includes('youtube.com') || highlight.videoUrl.includes('youtu.be') || highlight.videoUrl.includes('vimeo.com') ? (
                            <iframe
                              className="w-full h-full"
                              src={getEmbedUrl(highlight.videoUrl)}
                              frameBorder="0"
                              allowFullScreen
                              title={highlight.title}
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            />
                          ) : (
                            <video
                              className="w-full h-full object-cover"
                              controls
                              autoPlay
                              onError={() => handleVideoError(highlight.id!, highlight.videoUrl || '')}
                            >
                              <source src={highlight.videoUrl} type="video/mp4" />
                              <source src={highlight.videoUrl} type="video/webm" />
                              <source src={highlight.videoUrl} type="video/ogg" />
                              Your browser does not support the video tag.
                            </video>
                          )}
                          {/* Close button */}
                          <button
                            onClick={() => setPlayingVideo(null)}
                            className="absolute top-2 right-2 w-8 h-8 bg-black/50 hover:bg-black/70 rounded-full flex items-center justify-center transition-colors duration-200"
                          >
                            <X className="h-4 w-4 text-white" />
                          </button>
                        </div>
                      ) : (
                        <>
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
                          {highlight.videoUrl && highlight.videoUrl.trim() !== '' && !failedVideos.has(highlight.id!) && (
                            <div 
                              className="absolute inset-0 flex items-center justify-center cursor-pointer"
                              onClick={() => handleVideoPlay(highlight.id!)}
                            >
                              <div className="w-16 h-16 bg-green-500/90 rounded-full flex items-center justify-center group-hover:bg-green-600/90 transition-colors duration-300 group-hover:scale-110">
                                <Play className="h-8 w-8 text-white ml-1" />
                              </div>
                            </div>
                          )}
                          
                          {/* Video error message */}
                          {failedVideos.has(highlight.id!) && (
                            <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                              <div className="text-center text-white p-4">
                                <Video className="h-12 w-12 mx-auto mb-2 opacity-50" />
                                <p className="text-sm">Video unavailable</p>
                                <p className="text-xs opacity-75 mt-1">URL: {highlight.videoUrl}</p>
                                <Button 
                                  size="sm" 
                                  variant="outline" 
                                  className="mt-2 text-xs"
                                  onClick={() => {
                                    setFailedVideos(prev => {
                                      const newSet = new Set(prev)
                                      newSet.delete(highlight.id!)
                                      return newSet
                                    })
                                  }}
                                >
                                  Retry
                                </Button>
                              </div>
                            </div>
                          )}
                        </>
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
                        {highlight.videoUrl && highlight.videoUrl.trim() !== '' && (
                          <div className="w-8 h-8 bg-red-500/90 rounded-full flex items-center justify-center" title={`Video: ${highlight.videoUrl}`}>
                            <Video className="h-4 w-4 text-white" />
                          </div>
                        )}
                        {highlight.imageUrls && highlight.imageUrls.length > 0 && (
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
          ) : highlights.length === 0 ? (
            <div className="text-center py-12">
              <Trophy className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 dark:text-gray-400 mb-2">No Highlights Available</h3>
              <p className="text-gray-500 dark:text-gray-500 mb-4">
                No highlights have been uploaded yet. Check back later or contact admin to add highlights.
              </p>
              <Button onClick={loadHighlights} variant="outline">
                <Calendar className="h-4 w-4 mr-2" />
                Refresh Page
              </Button>
            </div>
          ) : (
            <div className="text-center py-12">
              <Trophy className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 dark:text-gray-400 mb-2">No Highlights Found</h3>
              <p className="text-gray-500 dark:text-gray-500">
                Try adjusting your search or filter criteria. Found {highlights.length} total highlights.
              </p>
              <div className="flex gap-2 justify-center mt-4">
                <Button 
                  onClick={() => {
                    setSearchTerm("")
                    setTypeFilter("all")
                  }} 
                  variant="outline"
                >
                  <X className="h-4 w-4 mr-2" />
                  Clear Filters
                </Button>
                <Button onClick={loadHighlights} variant="outline">
                  <Calendar className="h-4 w-4 mr-2" />
                  Refresh
                </Button>
              </div>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </main>
  )
}