import { useState, useEffect } from "react"
import { heroOperations, type HeroSlide } from "@/lib/firebase-operations"

export function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [slides, setSlides] = useState<any[]>([{
    id: 1,
    image: "https://tse1.mm.bing.net/th/id/OIP.hWiwB1x19v5DkwfpAYSX6wHaFj?pid=Api&P=0&h=180",
    title: "Master Your Game",
    subtitle: "Professional Training",
    accentColor: "from-blue-400 to-purple-400"
  }])
  const [loading, setLoading] = useState(true)

  // Default fallback slides if no slides are found in database
  const defaultSlides = [
    {
      id: 1,
      image: "https://tse1.mm.bing.net/th/id/OIP.hWiwB1x19v5DkwfpAYSX6wHaFj?pid=Api&P=0&h=180",
      title: "Master Your Game",
      subtitle: "Professional Training",
      accentColor: "from-blue-400 to-purple-400"
    },
    {
      id: 2,
      image: "https://tse3.mm.bing.net/th/id/OIP.S1OG8gO3WoxeJbH4mYTiOAHaEK?pid=Api&P=0&h=180",
      title: "Court Excellence",
      subtitle: "World-Class Facilities",
      accentColor: "from-emerald-400 to-teal-400"
    },
    {
      id: 3,
      image: "https://tse4.mm.bing.net/th/id/OIP.Bi49Rgno_0fPqqEA-2PS5gHaE8?pid=Api&P=0&h=180",
      title: "Champions Academy",
      subtitle: "Build Your Legacy",
      accentColor: "from-amber-400 to-orange-400"
    }
  ];

  useEffect(() => {
    loadHeroSlides()
  }, [])

  const loadHeroSlides = async () => {
    try {
      console.log("Loading hero slides from database...")
      const heroSlides = await heroOperations.getAll()
      console.log("Retrieved hero slides:", heroSlides)
      
      if (heroSlides && heroSlides.length > 0) {
        // Filter active slides and sort by order
        const activeSlides = heroSlides
          .filter((slide: HeroSlide) => slide.isActive)
          .sort((a: HeroSlide, b: HeroSlide) => a.order - b.order)
        
        if (activeSlides.length > 0) {
          // Convert Firebase slides to component format
          const formattedSlides = activeSlides.map((slide: HeroSlide) => ({
            id: slide.id,
            image: slide.imageUrl,
            title: slide.title,
            subtitle: slide.subtitle,
            accentColor: slide.accentColor || "from-blue-400 to-purple-400"
          }))
          console.log("Formatted slides:", formattedSlides)
          setSlides(formattedSlides)
        } else {
          console.log("No active slides found, using default slides")
          setSlides(defaultSlides)
        }
      } else {
        console.log("No slides found in database, using default slides")
        // Use default slides if no slides in database
        setSlides(defaultSlides)
      }
    } catch (error) {
      console.error("Error loading hero slides:", error)
      // Fallback to default slides on error
      setSlides(defaultSlides)
    } finally {
      setLoading(false)
    }
  }

  // Listen for hero slides updates (you can call this from admin dashboard)
  useEffect(() => {
    const handleStorageEvent = (e: StorageEvent) => {
      if (e.key === 'heroSlidesUpdated') {
        console.log("Hero slides updated, reloading...")
        loadHeroSlides()
      }
    }
    
    window.addEventListener('storage', handleStorageEvent)
    return () => window.removeEventListener('storage', handleStorageEvent)
  }, [])

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)
  }

  const goToSlide = (index: number) => {
    setCurrentSlide(index)
  }

  useEffect(() => {
    const interval = setInterval(nextSlide, 5000)
    return () => clearInterval(interval)
  }, [slides.length])

  if (loading) {
    return (
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading hero section...</p>
        </div>
      </section>
    )
  }

  if (slides.length === 0) {
    return (
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gray-900">
        <div className="text-center">
          <h2 className="text-white text-2xl mb-4">No hero slides available</h2>
          <p className="text-gray-300">Please add some slides from the admin dashboard.</p>
        </div>
      </section>
    )
  }

  return (
    <section className="relative h-screen w-full overflow-hidden bg-black">
      {/* Background Elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/4 left-1/4 w-20 h-20 bg-emerald-500/20 rounded-full animate-pulse"></div>
        <div className="absolute top-3/4 right-1/3 w-16 h-16 bg-blue-500/20 rounded-full animate-bounce"></div>
        <div className="absolute bottom-1/4 left-1/3 w-24 h-24 bg-orange-500/15 rounded-full animate-ping"></div>
      </div>

      {/* Carousel */}
      <div className="relative h-full w-full">
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-all duration-1000 ease-in-out ${
              index === currentSlide
                ? "opacity-100 scale-100"
                : "opacity-0 scale-110"
            }`}
            style={{
              backgroundImage: `url(${slide.image})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat'
            }}
          >
            {/* Full Coverage Background Image */}
            <div 
              className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat"
              style={{ 
                backgroundImage: `url(${slide.image})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat'
              }}
            />
            
            {/* Dark Overlay for Text Readability */}
            <div className="absolute inset-0 bg-black/40" />
            
            {/* Gradient Overlay with Accent Color */}
            <div className={`absolute inset-0 bg-gradient-to-br from-black/30 via-transparent to-black/50`} />
            
            {/* Animated Border Glow */}
            <div className={`absolute inset-0 bg-gradient-to-r ${slide.accentColor} opacity-0 rounded-full blur-3xl animate-pulse-slow ${
              index === currentSlide ? 'opacity-10' : 'opacity-0'
            }`} />
          </div>
        ))}
      </div>

      {/* All Content - Bottom Left */}
      <div className="absolute bottom-12 left-8 right-8 z-20 max-w-2xl animate-slide-in-left">
        <div className="group">
          {/* Location Tag */}
          <div className="text-white/80 text-sm font-light tracking-widest uppercase mb-4 transform transition-all duration-700 group-hover:translate-x-2">
            BHIMAVARAM
          </div>
          
          {/* Club Name */}
          <div className="text-3xl md:text-5xl font-bold bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent mb-6 leading-tight">
            TENNIS CLUB
          </div>
          
          {/* Main Hero Title */}
          <h1 className="text-4xl md:text-6xl font-black text-white mb-6 leading-tight">
            <span className="bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent block">
              {slides.length > 0 && slides[currentSlide] ? slides[currentSlide].title : "Master Your Game"}
            </span>
            <span className="bg-gradient-to-r from-yellow-300 via-orange-300 to-red-300 bg-clip-text text-transparent block">
              {slides.length > 0 && slides[currentSlide] ? slides[currentSlide].subtitle : "Professional Training"}
            </span>
          </h1>
          
          {/* Description */}
          <p className="text-lg md:text-xl text-white/80 mb-8 leading-relaxed max-w-lg">
            Join Bhimavaram's premier tennis club and unlock your true potential with world-class coaching and facilities.
          </p>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <button className="px-8 py-4 bg-white text-gray-900 font-semibold rounded-full hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-2xl hover:shadow-glow-white whitespace-nowrap">
              Start Your Journey
            </button>
            <button className="px-8 py-4 border-2 border-white/30 text-white font-semibold rounded-full backdrop-blur-sm hover:bg-white/10 transition-all duration-300 hover:scale-105 whitespace-nowrap">
              Watch Highlights
            </button>
          </div>
          
          {/* Underline Animation */}
          <div className="w-0 h-0.5 bg-gradient-to-r from-blue-400 to-purple-400 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-700 origin-left mt-4" />
        </div>
      </div>

      {/* Floating Court Elements */}
      <div className="absolute top-20 right-10 z-10 animate-bounce-slow">
        <div className="w-16 h-16 border-2 border-white/20 rounded-full flex items-center justify-center">
          <div className="w-8 h-8 bg-white/10 rounded-full animate-spin-slow" />
        </div>
      </div>

      {/* Enhanced Navigation Buttons */}
      <div className="absolute top-1/2 left-6 right-6 transform -translate-y-1/2 flex justify-between z-30">
        <button
          onClick={prevSlide}
          className="group relative p-4 rounded-full bg-white/10 backdrop-blur-xl text-white hover:bg-white/20 transition-all duration-500 border border-white/20 hover:border-white/40 hover:scale-110 shadow-2xl hover:shadow-glow"
        >
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-400/20 to-purple-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <svg className="w-6 h-6 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          <div className="absolute -inset-2 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full blur-xl opacity-0 group-hover:opacity-30 transition-opacity duration-500" />
        </button>
        
        <button
          onClick={nextSlide}
          className="group relative p-4 rounded-full bg-white/10 backdrop-blur-xl text-white hover:bg-white/20 transition-all duration-500 border border-white/20 hover:border-white/40 hover:scale-110 shadow-2xl hover:shadow-glow"
        >
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-emerald-400/20 to-teal-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <svg className="w-6 h-6 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
          <div className="absolute -inset-2 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-full blur-xl opacity-0 group-hover:opacity-30 transition-opacity duration-500" />
        </button>
      </div>

      {/* Enhanced Indicators with Glow */}
      <div className="absolute bottom-32 left-1/2 transform -translate-x-1/2 flex space-x-4 z-30">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentSlide
                ? 'bg-white scale-125'
                : 'bg-white/50 hover:bg-white/80'
            }`}
          >
            <div className={`absolute inset-0 rounded-full bg-gradient-to-r ${slides[index]?.accentColor || 'from-blue-400 to-purple-400'} opacity-0 group-hover:opacity-30 ${
              index === currentSlide ? 'opacity-50' : ''
            } blur-sm`} />
          </button>
        ))}
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 z-20 w-12 h-12 bg-black/30 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-black/50 transition-all duration-300 group"
      >
        <svg className="w-6 h-6 group-hover:-translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 z-20 w-12 h-12 bg-black/30 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-black/50 transition-all duration-300 group"
      >
        <svg className="w-6 h-6 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* Scroll Indicator */}
      <div className="absolute bottom-4 right-8 z-20 animate-bounce">
        <div className="text-white/60 text-sm rotate-90 origin-center whitespace-nowrap">
          Scroll Down
        </div>
      </div>
    </section>
  );
} 