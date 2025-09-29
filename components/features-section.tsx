import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Users, Calendar, Trophy, GraduationCap, Camera, MapPin } from "lucide-react"

export function FeaturesSection() {
  const features = [
    {
      icon: Users,
      title: "Membership Plans",
      description:
        "Flexible membership options for players of all levels with exclusive benefits and access to premium facilities.",
      href: "/membership",
    },
    {
      icon: GraduationCap,
      title: "Professional Coaching",
      description:
        "Learn from certified coaches with personalized training programs for beginners to advanced players.",
      href: "/coaching",
    },
    {
      icon: Calendar,
      title: "Court Booking",
      description: "Easy online court reservation system with real-time availability and flexible scheduling options.",
      href: "/booking",
    },
    {
      icon: Trophy,
      title: "Tournaments & Events",
      description:
        "Regular tournaments, championships, and social events to showcase your skills and connect with fellow players.",
      href: "/tournaments",
    },
    {
      icon: Camera,
      title: "Gallery & Highlights",
      description: "Relive the best moments with our photo gallery and video highlights from matches and events.",
      href: "/gallery",
    },
    {
      icon: MapPin,
      title: "Prime Location",
      description: "Conveniently located in the heart of Bhimavaram with easy access and ample parking facilities.",
      href: "/contact",
    },
  ]

  return (
    <section className="py-24 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4 text-balance">
            Everything You Need for Tennis Excellence
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto text-pretty">
            From professional coaching to competitive tournaments, we provide comprehensive facilities and services to
            help you achieve your tennis goals.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="group hover:shadow-lg transition-all duration-300 border-border bg-card">
              <CardHeader>
                <div className="flex items-center space-x-4">
                  <div className="p-2 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <CardDescription className="text-base leading-relaxed">{feature.description}</CardDescription>
                <Button
                  variant="outline"
                  className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors bg-transparent"
                >
                  Learn More
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
