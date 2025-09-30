"use client"

import { useEffect, useState } from "react"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Camera, Play, Calendar, Star } from "lucide-react"
import { galleryOperations, type GalleryItem } from "@/lib/firebase-operations"

export default function GalleryPage() {
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([])
  const [filteredItems, setFilteredItems] = useState<GalleryItem[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState("all")

  useEffect(() => {
    loadGallery()
  }, [])

  useEffect(() => {
    filterItems()
  }, [galleryItems, selectedCategory])

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

  const overallStats = [
    { label: "Total Photos", value: `${galleryItems.length}+`, icon: Camera },
    { label: "Categories", value: "4", icon: Play },
    { label: "Latest Upload", value: galleryItems.length > 0 ? "Recent" : "None", icon: Calendar },
    { label: "Memories", value: `${galleryItems.length * 10}+`, icon: Star },
  ]

  return (
    <main className="min-h-screen">
      <Navigation />

      {/* Hero Section */}
      <section className="relative py-24 bg-gradient-to-br from-primary/10 via-background to-accent/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-6">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground text-balance">Photo Gallery</h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto text-pretty">
              Explore our collection of memorable moments, tournament highlights, training sessions, and club events.
              Witness the passion and excellence that defines our tennis community.
            </p>
          </div>
        </div>
      </section>

      {/* Gallery Stats */}
      <section className="py-12 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {overallStats.map((stat, index) => (
              <div key={index} className="text-center space-y-2">
                <div className="flex justify-center">
                  <div className="p-3 bg-primary/10 rounded-full">
                    <stat.icon className="h-6 w-6 text-primary" />
                  </div>
                </div>
                <div className="text-2xl font-bold text-foreground">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Filters */}
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-center gap-3">
            {galleryCategories.map((category, index) => (
              <Button
                key={index}
                variant={category.active ? "default" : "outline"}
                className={`${!category.active ? "bg-transparent" : ""}`}
                onClick={() => setSelectedCategory(category.name)}
              >
                {category.label}
                <Badge variant="secondary" className="ml-2 text-xs">
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <div className="h-64 bg-muted rounded-t-lg"></div>
                  <CardContent className="p-4">
                    <div className="h-4 bg-muted rounded mb-2"></div>
                    <div className="h-4 bg-muted rounded mb-2"></div>
                    <div className="h-3 bg-muted rounded"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : filteredItems.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredItems.map((item) => (
                <Card key={item.id} className="group hover:shadow-lg transition-all duration-300 overflow-hidden">
                  <div className="relative">
                    <img
                      src={item.imageUrl || "/placeholder.svg"}
                      alt={item.title}
                      className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-2 left-2">
                      <Badge variant="secondary" className="capitalize">{item.category}</Badge>
                    </div>
                  </div>

                  <CardContent className="p-4">
                    <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors mb-2">
                      {item.title}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-3 leading-relaxed">{item.description}</p>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-3 w-3" />
                        <span>{item.createdAt.toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Camera className="h-3 w-3" />
                        <span>Photo</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="text-center py-12">
                <Camera className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">
                  {selectedCategory === "all" ? "No photos yet" : `No ${selectedCategory} photos`}
                </h3>
                <p className="text-muted-foreground mb-4">
                  {selectedCategory === "all" 
                    ? "Gallery photos will appear here once they're uploaded"
                    : `No photos in the ${selectedCategory} category yet`
                  }
                </p>
                {selectedCategory !== "all" && (
                  <Button variant="outline" onClick={() => setSelectedCategory("all")}>
                    View All Photos
                  </Button>
                )}
              </CardContent>
            </Card>
          )}

          {filteredItems.length > 0 && (
            <div className="text-center mt-12">
              <Button size="lg" variant="outline" className="px-8 py-6 text-lg bg-transparent">
                Load More Photos
              </Button>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </main>
  )
}
