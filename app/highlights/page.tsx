"use client"

import { useEffect, useState } from "react"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Play, Calendar, Clock, Trophy, Users, Video, Image, Star, Filter, X, ChevronLeft, ChevronRight } from "lucide-react"
import { highlightsOperations, type MatchHighlight } from "@/lib/firebase-operations"
import { getVideoThumbnail } from "@/lib/cloudinary-video-browser"

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
  const [viewingImages, setViewingImages] = useState<string[] | null>(null)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

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
    
    if (url.includes('youtube.com/watch')) {
      const videoId = url.split('v=')[1]?.split('&')[0]
      return `https://www.youtube.com/embed/${videoId}`
    } 
    if (url.includes('youtu.be/')) {
      const videoId = url.split('youtu.be/')[1]?.split('?')[0]
      return `https://www.youtube.com/embed/${videoId}`
    }
    
    if (url.includes('vimeo.com/')) {
      const videoId = url.split('vimeo.com/')[1]?.split('?')[0]
      return `https://player.vimeo.com/video/${videoId}`
    }
    
    return url
  }

  const getVideoThumbnailUrl = (highlight: MatchHighlight): string => {
    // If there's a custom thumbnail, use it
    if (highlight.thumbnailUrl && highlight.thumbnailUrl !== "/placeholder.jpg") {
      return highlight.thumbnailUrl
    }

    // For Cloudinary videos, generate thumbnail from video
    if (highlight.videoUrl && highlight.videoUrl.includes('cloudinary.com')) {
      try {
        // Extract public ID from Cloudinary URL
        // URL format: https://res.cloudinary.com/[cloud]/video/upload/[transformations]/[public_id].[extension]
        const matches = highlight.videoUrl.match(/\/upload\/(?:v\d+\/)?(.+)\.\w+$/)
        if (matches && matches[1]) {
          const publicId = matches[1]
          return getVideoThumbnail(publicId)
        }
      } catch (error) {
        console.error('Error generating video thumbnail:', error)
      }
    }

    // For YouTube videos, try to get YouTube thumbnail
    if (highlight.youtubeUrl) {
      try {
        let videoId = ''
        if (highlight.youtubeUrl.includes('youtube.com/watch')) {
          videoId = highlight.youtubeUrl.split('v=')[1]?.split('&')[0] || ''
        } else if (highlight.youtubeUrl.includes('youtu.be/')) {
          videoId = highlight.youtubeUrl.split('youtu.be/')[1]?.split('?')[0] || ''
        }
        
        if (videoId) {
          return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`
        }
      } catch (error) {
        console.error('Error generating YouTube thumbnail:', error)
      }
    }

    // Fallback to default thumbnail
    return highlight.thumbnailUrl || "/placeholder.jpg"
  }

  const handleImageView = (imageUrls: string[], imageIndex: number = 0) => {
    setViewingImages(imageUrls)
    setCurrentImageIndex(imageIndex)
  }

  const nextImage = () => {
    if (viewingImages && viewingImages.length > 0) {
      setCurrentImageIndex((prev) => 
        prev < viewingImages.length - 1 ? prev + 1 : 0
      )
    }
  }

  const prevImage = () => {
    if (viewingImages && viewingImages.length > 0) {
      setCurrentImageIndex((prev) => 
        prev > 0 ? prev - 1 : viewingImages.length - 1
      )
    }
  }

  return (
    <main className="min-h-screen">
      <Navigation />

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

          <div className="max-w-4xl mx-auto space-y-6">
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

            {(searchTerm || typeFilter !== "all") && (
              <div className="text-center text-sm text-gray-600 dark:text-gray-400">
                Showing {filteredHighlights.length} of {highlights.length} highlights
              </div>
            )}
          </div>
        </div>
      </section>

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
                <div key={highlight.id} className={`group bg-white dark:bg-gray-800 rounded-lg transform hover:scale-105 transition-all duration-300 hover:shadow-xl shadow-lg overflow-hidden ${
                  highlight.featured ? 'ring-2 ring-yellow-400 ring-opacity-75' : ''
                }`}>
                  <div className="relative">
                    <div className="aspect-video bg-gray-200 dark:bg-gray-700 relative overflow-hidden">
                      <img 
                        src={getVideoThumbnailUrl(highlight)} 
                        alt={highlight.title}
                        className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-300"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = "/placeholder.jpg";
                        }}
                      />
                      <div className="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition-all duration-300"></div>
                      
                      {(highlight.videoUrl || highlight.youtubeUrl) && (highlight.videoUrl?.trim() !== '' || highlight.youtubeUrl?.trim() !== '') && !failedVideos.has(highlight.id!) && (
                        <div 
                          className="absolute inset-0 flex items-center justify-center cursor-pointer"
                          onClick={() => handleVideoPlay(highlight.id!)}
                        >
                          <div className="w-16 h-16 bg-green-500/90 rounded-full flex items-center justify-center group-hover:bg-green-600/90 transition-colors duration-300 group-hover:scale-110">
                            <Play className="h-8 w-8 text-white ml-1" />
                          </div>
                        </div>
                      )}
                      
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

                      {highlight.featured && (
                        <div className="absolute top-3 left-3">
                          <div className="bg-yellow-500 text-black font-semibold px-2 py-1 rounded text-sm flex items-center">
                            <Star className="h-3 w-3 mr-1" />
                            Featured
                          </div>
                        </div>
                      )}

                      <div className="absolute top-3 right-3">
                        <div className={`${getTypeColor(highlight.matchType)} text-white font-semibold capitalize px-2 py-1 rounded text-sm`}>
                          {highlight.matchType}
                        </div>
                      </div>

                      <div className="absolute bottom-3 right-3 flex gap-2">
                        {((highlight.videoUrl && highlight.videoUrl.trim() !== '') || (highlight.youtubeUrl && highlight.youtubeUrl.trim() !== '')) && (
                          <div className="w-8 h-8 bg-red-500/90 rounded-full flex items-center justify-center" title={`Video: ${highlight.youtubeUrl || highlight.videoUrl}`}>
                            <Video className="h-4 w-4 text-white" />
                          </div>
                        )}
                        {highlight.imageUrls && highlight.imageUrls.length > 0 && (
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              handleImageView(highlight.imageUrls);
                            }}
                            className="w-8 h-8 bg-blue-500/90 hover:bg-blue-600/90 rounded-full flex items-center justify-center transition-colors cursor-pointer"
                            title={`View ${highlight.imageUrls.length} image${highlight.imageUrls.length > 1 ? 's' : ''}`}
                          >
                            <Image className="h-4 w-4 text-white" />
                            <span className="absolute -top-1 -right-1 w-4 h-4 bg-white text-blue-500 rounded-full text-xs flex items-center justify-center font-bold">
                              {highlight.imageUrls.length}
                            </span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="p-6">
                    <h3 className="text-lg font-semibold mb-2 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors duration-300">
                      {highlight.title}
                    </h3>
                    <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mb-4">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {formatDate(highlight.date)}
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        {highlight.players.length} players
                      </div>
                    </div>

                    <div>
                    <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                      {highlight.description}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex flex-wrap gap-1">
                        {highlight.players.slice(0, 2).map((player, idx) => (
                          <div key={idx} className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2 py-1 rounded text-xs">
                            {player}
                          </div>
                        ))}
                        {highlight.players.length > 2 && (
                          <div className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2 py-1 rounded text-xs">
                            +{highlight.players.length - 2} more
                          </div>
                        )}
                      </div>
                      <div className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 font-semibold px-2 py-1 rounded text-sm">
                        {highlight.score}
                      </div>
                    </div>
                    </div>
                  </div>
                </div>
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

      {playingVideo && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4">
          <div className="relative w-full max-w-6xl aspect-video bg-black rounded-lg overflow-hidden">
            {loadingVideo === playingVideo && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-10">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
              </div>
            )}
            
            {(() => {
              const currentHighlight = filteredHighlights.find(h => h.id === playingVideo)
              if (!currentHighlight) return null
              
              const videoSource = currentHighlight.youtubeUrl || currentHighlight.videoUrl || ''
              const isEmbedUrl = videoSource.includes('youtube.com') || videoSource.includes('youtu.be') || videoSource.includes('vimeo.com')
              
              return isEmbedUrl ? (
                <iframe
                  className="w-full h-full"
                  src={getEmbedUrl(videoSource)}
                  frameBorder="0"
                  allowFullScreen
                  title={currentHighlight.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                />
              ) : (
                <video
                  className="w-full h-full object-contain"
                  controls
                  autoPlay
                  onError={() => handleVideoError(currentHighlight.id!, videoSource)}
                >
                  <source src={videoSource} type="video/mp4" />
                  <source src={videoSource} type="video/webm" />
                  <source src={videoSource} type="video/ogg" />
                  Your browser does not support the video tag.
                </video>
              )
            })()}
            
            <button
              onClick={() => setPlayingVideo(null)}
              className="absolute top-4 right-4 w-10 h-10 bg-black/70 hover:bg-black/90 rounded-full flex items-center justify-center transition-colors duration-200 z-20"
            >
              <X className="h-6 w-6 text-white" />
            </button>
            
            {(() => {
              const currentHighlight = filteredHighlights.find(h => h.id === playingVideo)
              return currentHighlight ? (
                <div className="absolute bottom-4 left-4 bg-black/70 text-white p-3 rounded-lg z-20">
                  <h3 className="font-semibold text-lg">{currentHighlight.title}</h3>
                  <p className="text-sm opacity-90">{currentHighlight.description}</p>
                </div>
              ) : null
            })()}
          </div>
          
          <div 
            className="absolute inset-0 -z-10"
            onClick={() => setPlayingVideo(null)}
          />
        </div>
      )}

      {viewingImages && viewingImages.length > 0 && (
        <div className="fixed inset-0 bg-black z-50">
          <div className="absolute inset-0 overflow-auto">
            <div className="min-h-full flex items-center justify-center p-4">
              <img
                src={viewingImages[currentImageIndex]}
                alt={`Gallery image ${currentImageIndex + 1}`}
                className="w-auto h-auto max-w-full max-h-full object-contain"
                style={{ 
                  display: 'block',
                  margin: 'auto',
                  width: 'auto',
                  height: 'auto'
                }}
              />
            </div>
          </div>

          {viewingImages.length > 1 && (
            <>
              <button
                onClick={prevImage}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-black/70 hover:bg-black/90 rounded-full flex items-center justify-center transition-colors duration-200 z-20"
              >
                <ChevronLeft className="h-8 w-8 text-white" />
              </button>
              <button
                onClick={nextImage}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-black/70 hover:bg-black/90 rounded-full flex items-center justify-center transition-colors duration-200 z-20"
              >
                <ChevronRight className="h-8 w-8 text-white" />
              </button>
            </>
          )}

          <button
            onClick={() => setViewingImages(null)}
            className="absolute top-4 right-4 w-10 h-10 bg-black/70 hover:bg-black/90 rounded-full flex items-center justify-center transition-colors duration-200 z-20"
          >
            <X className="h-6 w-6 text-white" />
          </button>

          {viewingImages.length > 1 && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/70 text-white px-4 py-2 rounded-lg z-20">
              <span className="text-sm font-medium">
                {currentImageIndex + 1} / {viewingImages.length}
              </span>
            </div>
          )}

          <div 
            className="absolute inset-0 -z-10"
            onClick={() => setViewingImages(null)}
          />
        </div>
      )}
    </main>
  )
}