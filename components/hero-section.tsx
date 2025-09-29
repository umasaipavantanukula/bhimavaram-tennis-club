import { Button } from "@/components/ui/button"
import { Calendar, Users, Trophy } from "lucide-react"

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img src="/tennis-court-aerial-view-with-green-surface-and-wh.jpg" alt="Tennis court background" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-background/70 to-background/90" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="space-y-8">
          <div className="space-y-4">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-balance">
              <span className="text-foreground">Welcome to</span>
              <br />
              <span className="text-primary">Bhimavaram Tennis Club</span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto text-pretty">
              Where passion meets precision. Join our vibrant tennis community and elevate your game with professional
              coaching, world-class facilities, and competitive tournaments.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button size="lg" className="text-lg px-8 py-6">
              <Trophy className="mr-2 h-5 w-5" />
              Live Scoreboard
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8 py-6 bg-transparent">
              <Users className="mr-2 h-5 w-5" />
              Explore Players
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
            <div className="bg-card/80 backdrop-blur rounded-lg p-6 border border-border">
              <div className="flex items-center justify-center mb-4">
                <Users className="h-8 w-8 text-primary" />
              </div>
              <div className="text-3xl font-bold text-foreground mb-2">500+</div>
              <div className="text-muted-foreground">Active Members</div>
            </div>
            <div className="bg-card/80 backdrop-blur rounded-lg p-6 border border-border">
              <div className="flex items-center justify-center mb-4">
                <Trophy className="h-8 w-8 text-accent" />
              </div>
              <div className="text-3xl font-bold text-foreground mb-2">25+</div>
              <div className="text-muted-foreground">Tournaments Won</div>
            </div>
            <div className="bg-card/80 backdrop-blur rounded-lg p-6 border border-border">
              <div className="flex items-center justify-center mb-4">
                <Calendar className="h-8 w-8 text-primary" />
              </div>
              <div className="text-3xl font-bold text-foreground mb-2">15</div>
              <div className="text-muted-foreground">Years of Excellence</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
