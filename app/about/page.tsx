import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Trophy, Target, Heart, Star } from "lucide-react"

export default function AboutPage() {
  const achievements = [
    { year: "2023", title: "State Championship Winners", category: "Under-18 Category" },
    { year: "2022", title: "Regional Tennis Excellence Award", category: "Best Club Facilities" },
    { year: "2021", title: "District Tournament Champions", category: "Mixed Doubles" },
    { year: "2020", title: "Youth Development Program Award", category: "Community Impact" },
  ]

  const facilities = [
    { name: "Professional Courts", description: "6 well-maintained hard courts with professional lighting" },
    { name: "Training Center", description: "Modern training facility with video analysis equipment" },
    { name: "Pro Shop", description: "Full-service pro shop with equipment and apparel" },
    { name: "Clubhouse", description: "Comfortable clubhouse with lounge and refreshment area" },
    { name: "Parking", description: "Ample parking space for members and visitors" },
    { name: "Changing Rooms", description: "Clean, modern changing rooms with lockers" },
  ]

  return (
    <main className="min-h-screen">
      <Navigation />

      {/* Hero Section */}
      <section className="relative py-24 bg-gradient-to-br from-primary/10 via-background to-accent/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-6">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground text-balance">
              About Bhimavaram Tennis Club
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto text-pretty">
              Established in 2009, we've been nurturing tennis talent and building a strong community of players in
              Bhimavaram for over 15 years.
            </p>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <Card className="border-primary/20">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <Target className="h-8 w-8 text-primary" />
                  <CardTitle className="text-2xl">Our Mission</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                  To provide world-class tennis facilities and professional coaching that nurtures talent, promotes
                  physical fitness, and builds character. We strive to create an inclusive environment where players of
                  all ages and skill levels can develop their passion for tennis while fostering lifelong friendships
                  and sportsmanship.
                </p>
              </CardContent>
            </Card>

            <Card className="border-accent/20">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <Heart className="h-8 w-8 text-accent" />
                  <CardTitle className="text-2xl">Our Vision</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                  To be the leading tennis club in Andhra Pradesh, recognized for excellence in player development,
                  community engagement, and sporting achievements. We envision a future where Bhimavaram Tennis Club
                  serves as a beacon for tennis excellence, producing champions and inspiring the next generation of
                  tennis enthusiasts.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Club History */}
      <section className="py-16 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Our Journey</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              From humble beginnings to becoming Bhimavaram's premier tennis destination
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-2xl font-semibold text-foreground">Founded with Passion</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Established in 2009 by a group of tennis enthusiasts, Bhimavaram Tennis Club began with just two
                  courts and a dream to promote tennis in our community. What started as a small local club has grown
                  into a premier tennis facility serving hundreds of members.
                </p>
              </div>

              <div className="space-y-4">
                <h3 className="text-2xl font-semibold text-foreground">Growth & Excellence</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Over the years, we've expanded our facilities, welcomed professional coaches, and established training
                  programs that have produced numerous district and state-level champions. Our commitment to excellence
                  has made us a recognized name in Andhra Pradesh tennis circles.
                </p>
              </div>
            </div>

            <div className="relative">
              <img
                src="/tennis-club-building-exterior-with-courts.jpg"
                alt="Bhimavaram Tennis Club facility"
                className="rounded-lg shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Achievements */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Our Achievements</h2>
            <p className="text-xl text-muted-foreground">
              Celebrating our success and recognition in the tennis community
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {achievements.map((achievement, index) => (
              <Card key={index} className="group hover:shadow-lg transition-all duration-300">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <Trophy className="h-6 w-6 text-accent" />
                      <Badge variant="outline">{achievement.year}</Badge>
                    </div>
                    <Star className="h-5 w-5 text-primary" />
                  </div>
                  <CardTitle className="text-xl group-hover:text-primary transition-colors">
                    {achievement.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">{achievement.category}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Facilities */}
      <section className="py-16 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">World-Class Facilities</h2>
            <p className="text-xl text-muted-foreground">Everything you need for an exceptional tennis experience</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {facilities.map((facility, index) => (
              <Card key={index} className="text-center group hover:shadow-lg transition-all duration-300">
                <CardHeader>
                  <CardTitle className="text-lg group-hover:text-primary transition-colors">{facility.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base leading-relaxed">{facility.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
