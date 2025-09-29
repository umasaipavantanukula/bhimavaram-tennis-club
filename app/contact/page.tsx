import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MapPin, Phone, Mail, Clock, Car, Bus, NavigationIcon, MessageSquare } from "lucide-react"

export default function ContactPage() {
  const contactInfo = [
    {
      icon: MapPin,
      title: "Address",
      details: ["Bhimavaram Tennis Club", "Sports Complex Road", "Bhimavaram, West Godavari", "Andhra Pradesh 534201"],
      color: "text-blue-600",
      bgColor: "bg-blue-500/10",
    },
    {
      icon: Phone,
      title: "Phone Numbers",
      details: ["+91 8812 234567 (Reception)", "+91 8812 234568 (Coaching)", "+91 8812 234569 (Booking)"],
      color: "text-green-600",
      bgColor: "bg-green-500/10",
    },
    {
      icon: Mail,
      title: "Email",
      details: [
        "info@bhimavaramtennisclub.com",
        "coaching@bhimavaramtennisclub.com",
        "booking@bhimavaramtennisclub.com",
      ],
      color: "text-purple-600",
      bgColor: "bg-purple-500/10",
    },
    {
      icon: Clock,
      title: "Operating Hours",
      details: [
        "Monday - Friday: 6:00 AM - 10:00 PM",
        "Saturday - Sunday: 6:00 AM - 11:00 PM",
        "Public Holidays: 7:00 AM - 9:00 PM",
      ],
      color: "text-orange-600",
      bgColor: "bg-orange-500/10",
    },
  ]

  const departments = [
    {
      name: "General Inquiries",
      email: "info@bhimavaramtennisclub.com",
      phone: "+91 8812 234567",
      description: "Membership, facilities, and general information",
    },
    {
      name: "Coaching & Training",
      email: "coaching@bhimavaramtennisclub.com",
      phone: "+91 8812 234568",
      description: "Coaching programs, private lessons, and training camps",
    },
    {
      name: "Court Booking",
      email: "booking@bhimavaramtennisclub.com",
      phone: "+91 8812 234569",
      description: "Court reservations and booking inquiries",
    },
    {
      name: "Tournaments & Events",
      email: "tournaments@bhimavaramtennisclub.com",
      phone: "+91 8812 234570",
      description: "Tournament registration and event information",
    },
  ]

  const directions = [
    {
      icon: Car,
      method: "By Car",
      description: "Take NH16 towards Bhimavaram, exit at Sports Complex Road. Free parking available on-site.",
      time: "15 mins from city center",
    },
    {
      icon: Bus,
      method: "By Bus",
      description: "Take local bus routes 12, 15, or 18 to Sports Complex stop. 2-minute walk from bus stop.",
      time: "20-25 mins from railway station",
    },
    {
      icon: NavigationIcon,
      method: "GPS Coordinates",
      description: "Latitude: 16.5449° N, Longitude: 81.5212° E",
      time: "Use for precise navigation",
    },
  ]

  return (
    <main className="min-h-screen">
      <Navigation />

      {/* Hero Section */}
      <section className="relative py-24 bg-gradient-to-br from-primary/10 via-background to-accent/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-6">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground text-balance">Contact Us</h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto text-pretty">
              Get in touch with us for membership inquiries, court bookings, coaching information, or any questions
              about our tennis club. We're here to help you start your tennis journey.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Information Cards */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {contactInfo.map((info, index) => (
              <Card key={index} className="group hover:shadow-lg transition-all duration-300 text-center">
                <CardHeader>
                  <div className="flex justify-center mb-4">
                    <div className={`p-4 rounded-full ${info.bgColor}`}>
                      <info.icon className={`h-6 w-6 ${info.color}`} />
                    </div>
                  </div>
                  <CardTitle className="text-lg group-hover:text-primary transition-colors">{info.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {info.details.map((detail, detailIndex) => (
                      <p key={detailIndex} className="text-sm text-muted-foreground leading-relaxed">
                        {detail}
                      </p>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-16 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Find Us</h2>
            <p className="text-xl text-muted-foreground">Located in the heart of Bhimavaram's sports district</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Map Placeholder */}
            <div className="lg:col-span-2">
              <Card className="overflow-hidden">
                <div className="relative h-96 bg-muted flex items-center justify-center">
                  <div className="text-center space-y-4">
                    <MapPin className="h-12 w-12 text-primary mx-auto" />
                    <div>
                      <h3 className="text-lg font-semibold text-foreground">Interactive Map</h3>
                      <p className="text-sm text-muted-foreground">Bhimavaram Tennis Club, Sports Complex Road</p>
                    </div>
                    <Button>Open in Google Maps</Button>
                  </div>
                </div>
              </Card>
            </div>

            {/* Directions */}
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-foreground">How to Reach</h3>
              {directions.map((direction, index) => (
                <Card key={index} className="group hover:shadow-lg transition-all duration-300">
                  <CardContent className="p-4">
                    <div className="flex items-start space-x-3">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <direction.icon className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                          {direction.method}
                        </h4>
                        <p className="text-sm text-muted-foreground mt-1 leading-relaxed">{direction.description}</p>
                        <Badge variant="outline" className="mt-2 text-xs">
                          {direction.time}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div>
              <div className="mb-8">
                <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Send us a Message</h2>
                <p className="text-xl text-muted-foreground">
                  Have a question or want to learn more? Fill out the form and we'll get back to you within 24 hours.
                </p>
              </div>

              <Card>
                <CardContent className="p-6">
                  <form className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">First Name</label>
                        <input
                          type="text"
                          className="w-full px-4 py-3 rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                          placeholder="Enter your first name"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">Last Name</label>
                        <input
                          type="text"
                          className="w-full px-4 py-3 rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                          placeholder="Enter your last name"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">Email Address</label>
                      <input
                        type="email"
                        className="w-full px-4 py-3 rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                        placeholder="Enter your email address"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">Phone Number</label>
                      <input
                        type="tel"
                        className="w-full px-4 py-3 rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                        placeholder="Enter your phone number"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">Subject</label>
                      <select className="w-full px-4 py-3 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary">
                        <option>Select a subject</option>
                        <option>Membership Inquiry</option>
                        <option>Coaching Information</option>
                        <option>Court Booking</option>
                        <option>Tournament Registration</option>
                        <option>General Question</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">Message</label>
                      <textarea
                        rows={5}
                        className="w-full px-4 py-3 rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                        placeholder="Tell us how we can help you..."
                      ></textarea>
                    </div>

                    <Button size="lg" className="w-full">
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Send Message
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>

            {/* Department Contacts */}
            <div>
              <div className="mb-8">
                <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Department Contacts</h2>
                <p className="text-xl text-muted-foreground">
                  Contact the right department directly for faster assistance.
                </p>
              </div>

              <div className="space-y-6">
                {departments.map((dept, index) => (
                  <Card key={index} className="group hover:shadow-lg transition-all duration-300">
                    <CardHeader>
                      <CardTitle className="text-lg group-hover:text-primary transition-colors">{dept.name}</CardTitle>
                      <CardDescription className="text-base">{dept.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex items-center space-x-3 text-sm">
                        <Mail className="h-4 w-4 text-primary" />
                        <a
                          href={`mailto:${dept.email}`}
                          className="text-muted-foreground hover:text-primary transition-colors"
                        >
                          {dept.email}
                        </a>
                      </div>
                      <div className="flex items-center space-x-3 text-sm">
                        <Phone className="h-4 w-4 text-primary" />
                        <a
                          href={`tel:${dept.phone}`}
                          className="text-muted-foreground hover:text-primary transition-colors"
                        >
                          {dept.phone}
                        </a>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-muted/30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Frequently Asked Questions</h2>
            <p className="text-xl text-muted-foreground">Quick answers to common questions</p>
          </div>

          <div className="space-y-6">
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-foreground mb-2">What are your membership options?</h3>
                <p className="text-muted-foreground leading-relaxed">
                  We offer Individual, Family, and Student memberships with various benefits including court access,
                  coaching discounts, and priority booking. Visit our membership page for detailed information.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-foreground mb-2">How do I book a court?</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Courts can be booked online through our booking system, by phone, or in person at reception. Members
                  get priority booking and discounted rates.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-foreground mb-2">Do you provide equipment rental?</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Yes, we rent tennis rackets, balls, and other equipment. Members receive complimentary equipment
                  rental as part of their membership benefits.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
