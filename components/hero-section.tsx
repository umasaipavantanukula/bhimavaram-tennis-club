import { useState, useEffect } from "react"

export function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0)

  const slides = [
    {
      id: 1,
      image: "/Tennis_Racket_and_Balls.jpg",
      // bgGradient: "from-blue-900/80 via-purple-900/80 to-indigo-900/80"  
    },
    {
      id: 2,
      image: "/Tennis_Racket_and_Balls.jpg",
      // bgGradient: "from-emerald-900/80 via-teal-900/80 to-cyan-900/80"
    },
    {
      id: 3,
      image: "/Tennis_Racket_and_Balls.jpg",
      // bgGradient: "from-amber-900/80 via-orange-900/80 to-red-900/80"
    }
  ]

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)
  }

  useEffect(() => {
    const interval = setInterval(nextSlide, 5000)
    return () => clearInterval(interval)
  }, [])

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Carousel Background */}
      <div className="absolute inset-0 z-0">
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentSlide ? 'opacity-100' : 'opacity-0'
            }`}
          >
            {/* Background Image */}
            <div 
              className="absolute inset-0 bg-cover bg-center bg-no-repeat"
              style={{ backgroundImage: `url(${slide.image})` }}
            />
            
            {/* Gradient Overlay */}
            <div className={`absolute inset-0 bg-gradient-to-br ${slide.bgGradient}`} />
          </div>
        ))}
      </div>

      {/* Bottom Left Small Heading */}
      <div className="absolute bottom-8 left-8 z-20">
        <div className="text-white/90 space-y-1">
          <div className="text-sm font-light tracking-wider opacity-80">BHIMAVARAM</div>
          <div className="text-xl font-semibold">TENNIS CLUB</div>
        </div>
      </div>

      {/* Carousel Navigation */}
      <div className="absolute top-1/2 left-4 right-4 transform -translate-y-1/2 flex justify-between z-20">
        <button
          onClick={prevSlide}
          className="p-3 rounded-full bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 transition-all duration-300 border border-white/30"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <button
          onClick={nextSlide}
          className="p-3 rounded-full bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 transition-all duration-300 border border-white/30"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Carousel Indicators */}
      <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 flex space-x-3 z-20">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentSlide 
                ? 'bg-white scale-125' 
                : 'bg-white/50 hover:bg-white/70'
            }`}
          />
        ))}
      </div>
    </section>
  )
}