<<<<<<< HEAD
import { useState, useEffect, useCallback } from "react";

export function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
=======
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
>>>>>>> 00a74a1b1bd0af67f8517514502ecc908d21295a

  // Default fallback slides if no slides are found in database
  const defaultSlides = [
    {
<<<<<<< HEAD
      image: "https://media.istockphoto.com/id/2155734323/photo/clay-tennis-court.webp?a=1&b=1&s=612x612&w=0&k=20&c=QaLNuv_rvisTjHcSBgRWQ7kEfhAy8TbdeE0PqevAXxo=",
      title: "Championship Tennis",
      subtitle: "Experience world-class facilities and professional coaching",
      cta: "Book Courts"
    },
    {
      image: "https://images.unsplash.com/photo-1554068865-24cecd4e34b8?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8dGVubmlzfGVufDB8fDB8fHww&auto=format&fit=crop&q=60&w=600",
      title: "Bhimavaram Tennis Club",
      subtitle: "Best place to play tennis in Bhimavaram",
      cta: "View Programs"
    },
    {
      image: "https://images.unsplash.com/photo-1587683437362-da7775ffc532?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTZ8fHRlbm5pcyUyMHBsYXllcnxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&q=60&w=600",
      title: "Join The Community",
      subtitle: "Connect with passionate players and compete in tournaments",
      cta: "Join Now"
=======
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
>>>>>>> 00a74a1b1bd0af67f8517514502ecc908d21295a
    }
  ];

<<<<<<< HEAD
  const nextSlide = useCallback(() => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  }, [isTransitioning, slides.length]);
=======
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
>>>>>>> 00a74a1b1bd0af67f8517514502ecc908d21295a

  const prevSlide = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const goToSlide = (index: number) => {
    if (isTransitioning || index === currentSlide) return;
    setIsTransitioning(true);
    setCurrentSlide(index);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsTransitioning(false);
    }, 800);
    return () => clearTimeout(timer);
  }, [currentSlide]);

  useEffect(() => {
    const interval = setInterval(nextSlide, 5000);
    return () => clearInterval(interval);
  }, [nextSlide]);

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
<<<<<<< HEAD
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent"></div>
            
            {/* Animated Tennis Ball */}
            <div className="absolute top-10 right-10 w-12 h-12 bg-white rounded-full animate-bounce">
              <div className="w-full h-full bg-gradient-to-br from-white to-gray-200 rounded-full flex items-center justify-center">
                <div className="w-1 h-8 bg-gray-400 transform rotate-45"></div>
              </div>
            </div>

            {/* Content */}
            <div className="relative z-10 h-full flex items-end pb-20 pl-10 md:pl-20">
              <div className="max-w-2xl space-y-6 transform transition-all duration-1000 delay-300">
                {/* Badge */}
                <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-emerald-500 to-blue-600 rounded-full animate-pulse">
                  <span className="text-white text-sm font-semibold">Premium Tennis Club</span>
                </div>

                {/* Title */}
                <h1 className="text-5xl md:text-7xl font-bold text-white leading-tight">
                  <span className="bg-gradient-to-r from-white via-emerald-200 to-blue-200 bg-clip-text text-transparent animate-gradient">
                    {slide.title}
                  </span>
                </h1>

                {/* Subtitle */}
                <p className="text-xl md:text-2xl text-gray-200 font-light max-w-lg leading-relaxed">
                  {slide.subtitle}
                </p>

                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                  <button className="group relative px-8 py-4 bg-gradient-to-r from-emerald-500 to-blue-600 text-white font-semibold rounded-lg overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-2xl">
                    <span className="relative z-10 flex items-center gap-2">
                      {slide.cta}
                      <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </button>

                  <button className="group px-8 py-4 border-2 border-white/30 text-white font-semibold rounded-lg backdrop-blur-sm transition-all duration-300 hover:bg-white/10 hover:border-white/50">
                    <span className="flex items-center gap-2">
                      Learn More
                      <svg className="w-4 h-4 group-hover:rotate-90 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </span>
                  </button>
                </div>

                {/* Stats */}
                <div className="flex gap-8 pt-8">
                  <div className="text-white">
                    <div className="text-2xl font-bold text-emerald-400">50+</div>
                    <div className="text-sm text-gray-300">Professional Courts</div>
                  </div>
                  <div className="text-white">
                    <div className="text-2xl font-bold text-blue-400">1000+</div>
                    <div className="text-sm text-gray-300">Active Members</div>
                  </div>
                  <div className="text-white">
                    <div className="text-2xl font-bold text-orange-400">24/7</div>
                    <div className="text-sm text-gray-300">Available</div>
                  </div>
                </div>
              </div>
            </div>
=======
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
>>>>>>> 00a74a1b1bd0af67f8517514502ecc908d21295a
          </div>
        ))}
      </div>

<<<<<<< HEAD
      {/* Navigation Dots */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 flex gap-3">
=======
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
>>>>>>> 00a74a1b1bd0af67f8517514502ecc908d21295a
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentSlide
                ? 'bg-white scale-125'
                : 'bg-white/50 hover:bg-white/80'
            }`}
<<<<<<< HEAD
          />
=======
          >
            <div className={`absolute inset-0 rounded-full bg-gradient-to-r ${slides[index]?.accentColor || 'from-blue-400 to-purple-400'} opacity-0 group-hover:opacity-30 ${
              index === currentSlide ? 'opacity-50' : ''
            } blur-sm`} />
          </button>
>>>>>>> 00a74a1b1bd0af67f8517514502ecc908d21295a
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