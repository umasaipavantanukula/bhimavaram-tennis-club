"use client"

import { useEffect, useState } from "react"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Camera, Calendar, X, ArrowLeft, ZoomIn } from "lucide-react"
import { galleryOperations, type GalleryItem } from "@/lib/firebase-operations"

export default function GalleryPage() {
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([])
  const [filteredItems, setFilteredItems] = useState<GalleryItem[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedImage, setSelectedImage] = useState<GalleryItem | null>(null)

  useEffect(() => {
    loadGallery()
  }, [])

  useEffect(() => {
    filterItems()
  }, [galleryItems, selectedCategory])

  useEffect(() => {
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && selectedImage) {
        closeFullscreenImage()
      }
    }

    if (selectedImage) {
      document.addEventListener('keydown', handleEscapeKey)
      document.body.style.overflow = 'hidden' // Prevent background scrolling
    }

    return () => {
      document.removeEventListener('keydown', handleEscapeKey)
      document.body.style.overflow = 'auto'
    }
  }, [selectedImage])

  const loadGallery = async () => {
    try {
      const data = await galleryOperations.getAll()
      setGalleryItems(data)
    } catch (error) {
      console.error("Error loading gallery:", error)
    } finally {
      setLoading(false)
    }
  }

  const filterItems = () => {
    if (selectedCategory === "all") {
      setFilteredItems(galleryItems)
    } else {
      setFilteredItems(galleryItems.filter(item => item.category === selectedCategory))
    }
  }

  const getCategoryStats = () => {
    return {
      all: galleryItems.length,
      tournament: galleryItems.filter(item => item.category === "tournament").length,
      training: galleryItems.filter(item => item.category === "training").length,
      events: galleryItems.filter(item => item.category === "events").length,
      facilities: galleryItems.filter(item => item.category === "facilities").length,
    }
  }

  const stats = getCategoryStats()
  
  const galleryCategories = [
    { name: "all", label: "All", count: stats.all, active: selectedCategory === "all" },
    { name: "tournament", label: "Tournaments", count: stats.tournament, active: selectedCategory === "tournament" },
    { name: "training", label: "Training", count: stats.training, active: selectedCategory === "training" },
    { name: "events", label: "Events", count: stats.events, active: selectedCategory === "events" },
    { name: "facilities", label: "Facilities", count: stats.facilities, active: selectedCategory === "facilities" },
  ]

  const openFullscreenImage = (item: GalleryItem) => {
    setSelectedImage(item)
  }

  const closeFullscreenImage = () => {
    setSelectedImage(null)
  }

  return (
    <main className="min-h-screen">
      <Navigation />

      {/* Gallery Filters */}
      <section className="py-12 bg-gradient-to-r from-green-50/50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-center gap-4 animate-fade-in-up" style={{animationDelay: '500ms'}}>
            {galleryCategories.map((category, index) => (
              <Button
                key={index}
                variant={category.active ? "default" : "outline"}
                className={`transform transition-all duration-300 hover:scale-105 hover:shadow-lg animate-fade-in-up ${
                  category.active 
                    ? "bg-gradient-to-r from-green-500 to-green-600 border-0 shadow-lg hover:from-green-600 hover:to-green-700" 
                    : "border-green-300 text-green-700 hover:bg-green-50 hover:border-green-400"
                }`}
                style={{animationDelay: `${0.1 * index}s`}}
                onClick={() => setSelectedCategory(category.name)}
              >
                🏆 {category.label}
                <Badge 
                  variant="secondary" 
                  className={`ml-2 text-xs ${category.active ? 'bg-white/20 text-white' : 'bg-green-100 text-green-700'}`}
                >
                  {category.count}
                </Badge>
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
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
          ) : filteredItems.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredItems.map((item, index) => (
                <Card 
                  key={item.id} 
                  className="group hover:shadow-2xl hover:shadow-green-500/20 transition-all duration-500 transform hover:-translate-y-3 overflow-hidden bg-white/90 backdrop-blur-sm border-green-200 animate-fade-in-up p-0"
                  style={{animationDelay: `${index * 0.1}s`}}
                >
                  <div 
                    className="relative aspect-video overflow-hidden cursor-pointer bg-gray-100 m-0"
                    onClick={() => openFullscreenImage(item)}
                  >
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"></div>
                    <img
                      src={item.imageUrl || "/placeholder.svg"}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 block"
                      loading="lazy"
                    />
                    <div className="absolute top-3 left-3 z-20">
                      <Badge className="bg-gradient-to-r from-green-500 to-green-600 text-white border-0 shadow-lg capitalize transform group-hover:scale-105 transition-transform duration-300">
                        🎾 {item.category}
                      </Badge>
                    </div>
                    <div className="absolute inset-0 bg-green-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <ZoomIn className="h-8 w-8 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>
                  </div>

                  <CardContent className="p-6 bg-gradient-to-br from-white to-green-50/30">
                    <h3 className="font-bold text-gray-800 group-hover:text-green-700 transition-colors duration-300 mb-3 text-lg">
                      📸 {item.title}
                    </h3>
                    <p className="text-sm text-green-700/70 mb-4 leading-relaxed group-hover:text-green-800 transition-colors duration-300">
                      {item.description}
                    </p>
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center space-x-2 bg-green-100 px-3 py-1 rounded-full">
                        <Calendar className="h-3 w-3 text-green-600" />
                        <span className="text-green-700 font-medium">{item.createdAt.toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center space-x-2 bg-green-500 text-white px-3 py-1 rounded-full shadow-md group-hover:shadow-lg transition-shadow duration-300">
                        <Camera className="h-3 w-3" />
                        <span className="font-medium">Gallery</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="bg-white/80 backdrop-blur-sm border-green-200 shadow-lg animate-fade-in-up">
              <CardContent className="text-center py-16">
                <div className="relative mb-6">
                  <Camera className="h-20 w-20 text-green-400 mx-auto animate-float" />
                  <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-24 h-24 bg-green-200/30 rounded-full animate-pulse"></div>
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-4">
                  📷 {selectedCategory === "all" ? "No photos yet" : `No ${selectedCategory} photos`}
                </h3>
                <p className="text-green-600 text-lg mb-6">
                  {selectedCategory === "all" 
                    ? "Beautiful tennis moments will appear here once photos are uploaded! 🎾"
                    : `No photos in the ${selectedCategory} category yet. Check back soon! ✨`
                  }
                </p>
                {selectedCategory !== "all" && (
                  <Button 
                    variant="outline" 
                    onClick={() => setSelectedCategory("all")}
                    className="bg-gradient-to-r from-green-500 to-green-600 text-white border-0 hover:from-green-600 hover:to-green-700 transform hover:scale-105 transition-all duration-300 shadow-lg"
                  >
                    🌟 View All Photos
                  </Button>
                )}
              </CardContent>
            </Card>
          )}

          {filteredItems.length > 0 && (
            <div className="text-center mt-16 animate-fade-in-up" style={{animationDelay: '0.8s'}}>
              <Button 
                size="lg" 
                className="px-12 py-6 text-lg bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white border-0 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
              >
                 Load More 
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* Fullscreen Image Modal */}
      {selectedImage && (
        <div 
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-sm flex items-center justify-center animate-fade-in"
          onClick={closeFullscreenImage}
        >
          {/* Back Button */}
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-4 left-4 z-60 bg-white/10 hover:bg-white/20 text-white border border-white/20 backdrop-blur-sm"
            onClick={(e) => {
              e.stopPropagation()
              closeFullscreenImage()
            }}
          >
            <ArrowLeft className="h-6 w-6" />
          </Button>

          {/* Close Button */}
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-4 right-4 z-60 bg-white/10 hover:bg-white/20 text-white border border-white/20 backdrop-blur-sm"
            onClick={(e) => {
              e.stopPropagation()
              closeFullscreenImage()
            }}
          >
            <X className="h-6 w-6" />
          </Button>

          {/* Image Container */}
          <div 
            className="relative w-full h-full flex items-center justify-center p-4 sm:p-8 lg:p-16 animate-scale-in"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={selectedImage.imageUrl || "/placeholder.svg"}
              alt={selectedImage.title}
              className="max-w-full max-h-full object-contain shadow-2xl rounded-lg"
            />
            
            {/* Image Info Overlay */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6 rounded-b-lg">
              <div className="flex items-center justify-between text-white">
                <div>
                  <h3 className="text-2xl font-bold mb-2">📸 {selectedImage.title}</h3>
                  <p className="text-white/80 mb-3">{selectedImage.description}</p>
                  <div className="flex items-center gap-4 text-sm">
                    <Badge className="bg-gradient-to-r from-green-500 to-green-600 text-white border-0 capitalize">
                      🎾 {selectedImage.category}
                    </Badge>
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4" />
                      <span>{selectedImage.createdAt.toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </main>
  )
}
