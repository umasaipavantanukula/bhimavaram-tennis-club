import { useState, useEffect, useCallback } from "react";

export function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const slides = [
    {
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
    }
  ];

  const nextSlide = useCallback(() => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  }, [isTransitioning, slides.length]);

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
          </div>
        ))}
      </div>

      {/* Navigation Dots */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 flex gap-3">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentSlide
                ? 'bg-white scale-125'
                : 'bg-white/50 hover:bg-white/80'
            }`}
          />
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