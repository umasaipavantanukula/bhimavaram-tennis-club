import Link from "next/link"
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin } from "lucide-react"

export function Footer() {
  return (
    <footer className="relative overflow-hidden bg-gradient-to-b from-green-950 via-emerald-900 to-green-800 text-white">
      {/* Decorative Top Wave */}
      <div className="absolute top-0 left-0 w-full overflow-hidden leading-[0] rotate-180">
        <svg
          className="relative block w-[calc(100%+1.3px)] h-[40px]"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
        >
          <path
            d="M321.39,56.44c58.6,18.09,117.2,36.19,175.8,28.6C555.09,77.31,613.69,44.93,672.29,44.6
            c58.6-.33,117.2,31.05,175.8,47.25,58.6,16.2,117.2,18.33,175.8,6.72,58.6-11.61,117.2-36.05,175.8-41.48V0H0V27.35
            A600.21,600.21,0,0,0,321.39,56.44Z"
            className="fill-green-800"
          ></path>
        </svg>
      </div>

      <div className="relative max-w-7xl mx-auto px-6 md:px-12 pt-16 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Club Info */}
          <div className="space-y-4 md:col-span-1 lg:pr-8">
            <div className="flex items-center space-x-2">
              <img 
                src="/logo.png" 
                alt="Bhimavaram Tennis Club Logo" 
                className="w-20 h-20 object-contain"
              />
              <h3 className="text-xl font-bold tracking-wide">Bhimavaram Tennis Club</h3>
            </div>
            <p className="text-green-100 text-sm leading-relaxed">
              Bhimavaram’s premier tennis destination fostering excellence in sport and community through
              passion, training, and teamwork.
            </p>
            <div className="flex space-x-4">
              <Link href="#" className="hover:scale-110 transition-transform text-green-200 hover:text-yellow-400">
                <Facebook className="h-5 w-5" />
              </Link>
              <Link href="#" className="hover:scale-110 transition-transform text-green-200 hover:text-yellow-400">
                <Instagram className="h-5 w-5" />
              </Link>
              <Link href="#" className="hover:scale-110 transition-transform text-green-200 hover:text-yellow-400">
                <Twitter className="h-5 w-5" />
              </Link>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-lg mb-4 text-yellow-400">Quick Links</h3>
            <ul className="space-y-2 text-green-100 text-sm">
              {["About Us", "Contact", "Events", "Gallery", "News"].map((item) => (
                <li key={item}>
                  <Link
                    href={`/${item.toLowerCase().replace(" ", "")}`}
                    className="hover:text-yellow-400 transition-colors"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info + Sponsors */}
          <div>
            <h3 className="font-semibold text-lg mb-4 text-yellow-400">Contact Info</h3>
            <ul className="space-y-3 text-green-100 text-sm mb-5">
              <li className="flex items-start gap-3">
                <MapPin className="h-4 w-4 text-yellow-400 mt-0.5" />
                <span>
                  Tennis Club Road, Bhimavaram <br />
                  West Godavari, Andhra Pradesh 534201
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-yellow-400" />
                +91 8812 345 678
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-yellow-400" />
                info@bhimavaramtennisclub.com
              </li>
            </ul>

            {/* Sponsors (Compact Inline Style) */}
            <h4 className="text-sm font-semibold text-yellow-400 uppercase tracking-wide mb-3">
              Developed & Maintained by
            </h4>
            <div className="flex items-center gap-6">
              <img
                src="https://bhimavaramtennis.com/img/bvrmol.png"
                alt="Sponsor 1"
                className="h-10 w-auto object-contain opacity-80 hover:opacity-100 transition"
              />
              <img
                src="https://bhimavaramtennis.com/img/csd.png"
                alt="Sponsor 2"
                className="h-10 w-auto object-contain opacity-80 hover:opacity-100 transition"
              />
            </div>
          </div>
        </div>

        {/* Bottom Line */}
        <div className="mt-10 border-t border-green-700 pt-5 text-center">
          <p className="text-xs text-green-200 tracking-wide">
            © 2025 Bhimavaram Tennis Club •
          </p>
        </div>
      </div>
    </footer>
  )
}
