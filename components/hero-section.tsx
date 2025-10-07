import { Button } from "@/components/ui/button"
import { Calendar, Users, Trophy } from "lucide-react"

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-gradient-to-br from-teal-900 via-emerald-900 to-teal-800">
      {/* Geometric Background Pattern */}
      <div className="absolute inset-0 z-0">
        {/* Large geometric shapes */}
        <div className="absolute top-20 right-10 w-96 h-96 rounded-full border-4 border-white/10"></div>
        <div className="absolute top-40 right-32 w-64 h-64 rounded-full border-2 border-white/5"></div>
        <div className="absolute bottom-20 left-10 w-80 h-80 rounded-full border-4 border-white/10"></div>
        
        {/* Tennis-themed patterns */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
          {/* Tennis Net Pattern */}
          <div className="absolute top-32 left-20 w-16 h-12 opacity-20">
            <div className="grid grid-cols-4 grid-rows-3 gap-1 w-full h-full">
              {[...Array(12)].map((_, i) => (
                <div key={i} className="border border-white/30"></div>
              ))}
            </div>
          </div>
          
          {/* Tennis Ball Patterns */}
          <div className="absolute top-60 left-40 w-6 h-6 bg-yellow-300/20 rounded-full">
            <div className="absolute inset-1 border-t border-white/40 rounded-full"></div>
            <div className="absolute inset-1 border-b border-white/40 rounded-full"></div>
          </div>
          <div className="absolute bottom-40 right-60 w-4 h-4 bg-yellow-400/15 rounded-full">
            <div className="absolute inset-0.5 border-t border-white/30 rounded-full"></div>
            <div className="absolute inset-0.5 border-b border-white/30 rounded-full"></div>
          </div>
          
          {/* Trophy Symbols */}
          <div className="absolute top-80 right-40 text-yellow-400/30 text-2xl animate-pulse">🏆</div>
          <div className="absolute top-20 left-60 text-yellow-300/20 text-lg animate-pulse delay-150">🏆</div>
          <div className="absolute bottom-80 left-80 text-amber-400/25 text-xl animate-pulse delay-300">🏆</div>
          
          {/* Tennis Racket Outlines */}
          <div className="absolute bottom-60 right-20 w-8 h-12 opacity-20">
            <div className="w-8 h-8 border-2 border-white/30 rounded-full relative">
              <div className="absolute inset-1 border border-white/20 rounded-full"></div>
              <div className="absolute -bottom-4 left-1/2 w-1 h-6 bg-white/30 transform -translate-x-1/2"></div>
            </div>
          </div>
          
          {/* Court Lines */}
          <div className="absolute top-40 right-80 w-24 h-1 bg-white/15 rotate-12"></div>
          <div className="absolute bottom-32 left-60 w-32 h-0.5 bg-white/10 -rotate-12"></div>
          
          {/* Championship Emblems */}
          <div className="absolute top-96 left-32 w-10 h-10 border-2 border-yellow-400/20 rounded-full flex items-center justify-center">
            <div className="w-6 h-6 border border-yellow-300/30 rounded-full"></div>
          </div>
          
          {/* Floating Tennis Elements */}
          <div className="absolute top-1/4 right-1/4 text-white/10 text-4xl animate-float">🎾</div>
          <div className="absolute bottom-1/4 left-1/4 text-white/15 text-3xl animate-float delay-200">🎾</div>
          
          {/* Score Numbers */}
          <div className="absolute top-72 left-96 text-white/20 text-6xl font-bold opacity-50">6</div>
          <div className="absolute bottom-72 right-96 text-white/15 text-5xl font-bold opacity-40">4</div>
        </div>
        
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-teal-900/50 via-transparent to-teal-800/30" />
      </div>

      {/* Main Content Container */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center min-h-screen">
        
        {/* Left Content */}
        <div className="space-y-8 text-left">
          <div className="space-y-6">
            <div className="inline-block transform hover:scale-105 transition-transform duration-300">
              <span className="px-5 py-3 bg-gradient-to-r from-yellow-400 to-amber-500 text-black text-sm font-bold rounded-full uppercase tracking-wider shadow-lg hover:shadow-xl transition-shadow duration-300 border-2 border-amber-300">
                Championship 2025
              </span>
            </div>
            
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-black leading-tight">
              <span className="block text-white drop-shadow-lg hover:drop-shadow-2xl transition-all duration-300">
                BHIMAVARAM
              </span>
              <span className="block text-yellow-400 drop-shadow-xl animate-pulse hover:animate-none transition-all duration-500">
                TENNIS CLUB
              </span>
            </h1>
            
            <div className="space-y-5">
                <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-white/95 uppercase tracking-wide drop-shadow-md">
                  <span className="bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent">
                    GAME ON, EVERY POINT COUNTS
                  </span>
                </h2>
              <div className="space-y-3">
                <p className="text-lg md:text-xl text-yellow-300/90 font-semibold italic">
                  "Unleash Your Inner Champion"
                </p>
                <p className="text-base md:text-lg text-white/85 max-w-lg leading-relaxed">
                  Train with passion, play with purpose.
                  <br />
                  <span className="text-yellow-400/90 font-medium">Because greatness starts on the court.</span>
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-6">
            <Button 
              size="lg" 
              className="group relative text-lg px-10 py-6 bg-gradient-to-r from-yellow-400 to-amber-500 hover:from-yellow-500 hover:to-amber-600 text-black font-bold rounded-xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 border-2 border-amber-300"
            >
              <div className="absolute inset-0 bg-white/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <Trophy className="mr-3 h-6 w-6 group-hover:rotate-12 transition-transform duration-300" />
              <span className="relative z-10">Live Scoreboard</span>
              <div className="ml-2 w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            </Button>
            
            <Button 
              size="lg" 
              className="group relative text-lg px-10 py-6 bg-transparent border-3 border-white text-white hover:bg-white hover:text-teal-900 font-bold rounded-xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 backdrop-blur-sm"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-white/10 rounded-xl"></div>
              <Users className="mr-3 h-6 w-6 group-hover:scale-110 transition-transform duration-300" />
              <span className="relative z-10">Explore Players</span>
              <div className="ml-2 opacity-70 group-hover:opacity-100 transition-opacity duration-300">→</div>
            </Button>
          </div>
        </div>

        {/* Right Content - Tennis Action Image */}
        <div className="relative flex justify-center lg:justify-end">
          <div className="relative">
            {/* Animated background circles */}
            <div className="absolute inset-0 w-96 h-96 rounded-full border-4 border-yellow-400/30 animate-spin-slow"></div>
            <div className="absolute inset-4 w-88 h-88 rounded-full border-2 border-white/20 animate-pulse"></div>
            <div className="absolute inset-8 w-80 h-80 rounded-full border border-yellow-300/40 animate-ping"></div>
            
            {/* Tennis Court Background */}
            <div className="absolute inset-0 w-96 h-96 rounded-full bg-gradient-to-br from-green-400/10 via-emerald-500/5 to-teal-600/10"></div>
            
            {/* Main Tennis Image */}
            <div className="relative w-96 h-96 flex items-center justify-center">
              <img 
                src="https://www.google.com/url?sa=i&url=https%3A%2F%2Fcommons.wikimedia.org%2Fwiki%2FFile%3ATennis_Racket_and_Balls.jpg&psig=AOvVaw2UEhBmKWOVtPWRILHppenT&ust=1759902072592000&source=images&cd=vfe&opi=89978449&ved=0CBUQjRxqFwoTCIDH96SwkZADFQAAAAAdAAAAABAE" 
                alt="Tennis Championship Action" 
                className="w-80 h-80 object-cover rounded-full border-4 border-gradient-to-r from-yellow-400 to-amber-500 shadow-2xl filter brightness-110 contrast-110"
              />
              
              {/* Glowing overlay */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-yellow-400/10 via-transparent to-emerald-400/10"></div>
              
              {/* Tennis court lines effect */}
              <div className="absolute inset-16 border-2 border-white/20 rounded-full"></div>
              <div className="absolute inset-20 border border-white/15 rounded-full"></div>
            </div>
            
            {/* Floating Tennis Elements */}
            <div className="absolute -top-8 -right-8 w-16 h-16 bg-gradient-to-br from-yellow-400 to-amber-500 rounded-full flex items-center justify-center shadow-2xl animate-bounce border-2 border-yellow-300">
              <Trophy className="h-8 w-8 text-black" />
            </div>
            
            {/* Tennis Ball */}
            <div className="absolute -bottom-4 -left-4 w-12 h-12 bg-gradient-to-br from-yellow-300 to-yellow-500 rounded-full shadow-xl animate-bounce delay-300 border-2 border-white/30">
              <div className="absolute inset-2 border-t-2 border-white/80 rounded-full"></div>
              <div className="absolute inset-2 border-b-2 border-white/80 rounded-full"></div>
            </div>
            
            {/* Tennis Racket Symbol */}
            <div className="absolute top-8 -left-8 w-10 h-10 bg-white/20 rounded-full flex items-center justify-center shadow-lg animate-pulse">
              <div className="w-6 h-6 border-2 border-white rounded-full relative">
                <div className="absolute inset-1 border border-white/60 rounded-full"></div>
                <div className="absolute bottom-0 left-1/2 w-0.5 h-4 bg-white transform -translate-x-1/2 translate-y-full"></div>
              </div>
            </div>
            
            {/* Championship Stars */}
            <div className="absolute top-16 right-8 text-yellow-400 animate-twinkle">
              <div className="text-2xl">⭐</div>
            </div>
            <div className="absolute bottom-16 right-4 text-yellow-300 animate-twinkle delay-150">
              <div className="text-lg">⭐</div>
            </div>
            <div className="absolute bottom-8 left-16 text-amber-400 animate-twinkle delay-300">
              <div className="text-xl">⭐</div>
            </div>
          
          </div>
        </div>
      </div>
    </section>
  )
}
