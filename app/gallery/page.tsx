import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Camera, Play, Calendar, Star } from "lucide-react"

export default function GalleryPage() {
  const galleryCategories = [
    { name: "All", count: 48, active: true },
    { name: "Tournaments", count: 18, active: false },
    { name: "Training", count: 12, active: false },
    { name: "Events", count: 10, active: false },
    { name: "Facilities", count: 8, active: false },
  ]

  const galleryItems = [
    {
      id: 1,
      type: "image",
      title: "Championship Final 2024",
      category: "Tournaments",
      date: "March 2024",
      image: "/tennis-tournament-court.jpg",
      description: "Intense final match of our annual championship tournament",
    },
    {
      id: 2,
      type: "image",
      title: "Junior Training Session",
      category: "Training",
      date: "February 2024",
      image: "/coach-priya-junior-tennis-specialist.jpg",
      description: "Young players learning fundamentals with our expert coaches",
    },
    {
      id: 3,
      type: "video",
      title: "Club Facilities Tour",
      category: "Facilities",
      date: "January 2024",
      image: "/tennis-club-building-exterior-with-courts.jpg",
      description: "Complete walkthrough of our premium tennis facilities",
      duration: "3:45",
    },
    {
      id: 4,
      type: "image",
      title: "Family Tennis Day",
      category: "Events",
      date: "December 2023",
      image: "/tennis-court-aerial-view-with-green-surface-and-wh.jpg",
      description: "Families enjoying tennis together at our monthly event",
    },
    {
      id: 5,
      type: "image",
      title: "Professional Coaching",
      category: "Training",
      date: "November 2023",
      image: "/coach-vikram-performance-specialist.jpg",
      description: "One-on-one coaching session with certified instructor",
    },
    {
      id: 6,
      type: "image",
      title: "Tournament Winners",
      category: "Tournaments",
      date: "October 2023",
      image: "/tennis-tournament-court.jpg",
      description: "Celebrating our tournament champions and their achievements",
    },
    {
      id: 7,
      type: "image",
      title: "Court Maintenance",
      category: "Facilities",
      date: "September 2023",
      image: "/tennis-court-aerial-view-with-green-surface-and-wh.jpg",
      description: "Regular maintenance ensuring perfect playing conditions",
    },
    {
      id: 8,
      type: "video",
      title: "Training Highlights",
      category: "Training",
      date: "August 2023",
      image: "/coach-priya-junior-tennis-specialist.jpg",
      description: "Best moments from our intensive training programs",
      duration: "2:30",
    },
    {
      id: 9,
      type: "image",
      title: "Club Anniversary",
      category: "Events",
      date: "July 2023",
      image: "/tennis-club-building-exterior-with-courts.jpg",
      description: "Celebrating 10 years of tennis excellence in Bhimavaram",
    },
  ]

  const stats = [
    { label: "Total Photos", value: "500+", icon: Camera },
    { label: "Video Content", value: "25+", icon: Play },
    { label: "Events Covered", value: "50+", icon: Calendar },
    { label: "Happy Moments", value: "1000+", icon: Star },
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
            {stats.map((stat, index) => (
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
              >
                {category.name}
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {galleryItems.map((item) => (
              <Card key={item.id} className="group hover:shadow-lg transition-all duration-300 overflow-hidden">
                <div className="relative">
                  <img
                    src={item.image || "/placeholder.svg"}
                    alt={item.title}
                    className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {item.type === "video" && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                      <div className="p-3 bg-white/90 rounded-full">
                        <Play className="h-6 w-6 text-primary" />
                      </div>
                    </div>
                  )}
                  {item.duration && (
                    <div className="absolute bottom-2 right-2">
                      <Badge className="bg-black/70 text-white">{item.duration}</Badge>
                    </div>
                  )}
                  <div className="absolute top-2 left-2">
                    <Badge variant="secondary">{item.category}</Badge>
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
                      <span>{item.date}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      {item.type === "video" ? <Play className="h-3 w-3" /> : <Camera className="h-3 w-3" />}
                      <span className="capitalize">{item.type}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button size="lg" variant="outline" className="px-8 py-6 text-lg bg-transparent">
              Load More Photos
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
