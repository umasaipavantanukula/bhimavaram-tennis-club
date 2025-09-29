import Link from "next/link"
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-card border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
          {/* Club Info */}
          <div className="space-y-4 md:col-span-1 lg:pr-8">
            <div className="flex items-center space-x-2">
              <img 
                src="/logo.png" 
                alt="Bhimavaram Tennis Club Logo" 
                className="w-10 h-10 object-contain"
              />
              <span className="font-bold text-lg">Bhimavaram Tennis Club</span>
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Bhimavaram's premier tennis destination, fostering excellence in tennis through professional coaching,
              world-class facilities, and a vibrant community.
            </p>
            <div className="flex space-x-4">
              <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Facebook className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Instagram className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Twitter className="h-5 w-5" />
              </Link>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">Quick Links</h3>
            <ul className="space-y-2">
              {["About Us", "Membership", "Coaching", "Tournaments", "Gallery"].map((item) => (
                <li key={item}>
                  <Link href="#" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          {/* <div className="space-y-4">
            <h3 className="font-semibold text-foreground">Services</h3>
            <ul className="space-y-2">
              {["Court Booking", "Private Lessons", "Group Classes", "Equipment Rental", "Event Hosting"].map(
                (item) => (
                  <li key={item}>
                    <Link href="#" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                      {item}
                    </Link>
                  </li>
                ),
              )}
            </ul>
          </div> */}

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">Contact Info</h3>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <MapPin className="h-4 w-4 text-primary mt-1 flex-shrink-0" />
                <p className="text-muted-foreground text-sm">
                  Tennis Club Road, Bhimavaram
                  <br />
                  West Godavari, Andhra Pradesh 534201
                </p>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="h-4 w-4 text-primary flex-shrink-0" />
                <p className="text-muted-foreground text-sm">+91 8812 345 678</p>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="h-4 w-4 text-primary flex-shrink-0" />
                <p className="text-muted-foreground text-sm">info@bhimavaramtennisclub.com</p>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-8 text-center">
          <p className="text-muted-foreground text-sm">© 2025 Bhimavaram Tennis Club. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
