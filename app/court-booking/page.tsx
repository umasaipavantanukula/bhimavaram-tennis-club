"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, MapPin, Users, Phone, Mail } from "lucide-react"

interface CourtSlot {
  id: string
  court: string
  time: string
  date: string
  available: boolean
  price: number
}

export default function CourtBookingPage() {
  const [selectedDate, setSelectedDate] = useState("")
  const [selectedCourt, setSelectedCourt] = useState("")
  const [selectedTime, setSelectedTime] = useState("")
  const [playerName, setPlayerName] = useState("")
  const [playerPhone, setPlayerPhone] = useState("")
  const [playerEmail, setPlayerEmail] = useState("")
  const [notes, setNotes] = useState("")
  const [courtSlots, setCourtSlots] = useState<CourtSlot[]>([])

  const courts = [
    { id: "court-1", name: "Court 1", surface: "Hard Court" },
    { id: "court-2", name: "Court 2", surface: "Clay Court" },
    { id: "court-3", name: "Court 3", surface: "Hard Court" },
    { id: "court-4", name: "Court 4", surface: "Grass Court" },
  ]

  const timeSlots = [
    "06:00 AM",
    "07:00 AM",
    "08:00 AM",
    "09:00 AM",
    "10:00 AM",
    "11:00 AM",
    "12:00 PM",
    "01:00 PM",
    "02:00 PM",
    "03:00 PM",
    "04:00 PM",
    "05:00 PM",
    "06:00 PM",
    "07:00 PM",
    "08:00 PM",
  ]

  useEffect(() => {
    if (selectedDate && selectedCourt) {
      generateCourtSlots()
    }
  }, [selectedDate, selectedCourt])

  const generateCourtSlots = () => {
    const slots: CourtSlot[] = timeSlots.map((time, index) => ({
      id: `${selectedCourt}-${selectedDate}-${time}`,
      court: selectedCourt,
      time,
      date: selectedDate,
      available: Math.random() > 0.3, // 70% availability
      price: time.includes("AM") ? 500 : 750, // Morning cheaper than evening
    }))
    setCourtSlots(slots)
  }

  const handleBooking = (e: React.FormEvent) => {
    e.preventDefault()

    if (!selectedDate || !selectedCourt || !selectedTime || !playerName || !playerPhone) {
      alert("Please fill in all required fields")
      return
    }

    // Here you would typically send the booking data to your backend
    alert(`Booking confirmed for ${playerName} on ${selectedDate} at ${selectedTime}`)

    // Reset form
    setPlayerName("")
    setPlayerPhone("")
    setPlayerEmail("")
    setNotes("")
    setSelectedTime("")
  }

  const getCourtSurface = (courtId: string) => {
    return courts.find((court) => court.id === courtId)?.surface || "Hard Court"
  }

  return (
    <main className="min-h-screen">
      <Navigation />

      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-foreground mb-4 flex items-center justify-center gap-3">
              <Calendar className="h-10 w-10 text-primary" />
              Court Booking
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Reserve your preferred court and time slot for an amazing tennis experience
            </p>
          </div>

          <div className="grid gap-8 lg:grid-cols-2">
            {/* Booking Form */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Book Your Court
                </CardTitle>
                <CardDescription>Select your preferred date, court, and time slot</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleBooking} className="space-y-6">
                  {/* Date Selection */}
                  <div className="space-y-2">
                    <Label htmlFor="date">Select Date *</Label>
                    <Input
                      id="date"
                      type="date"
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      min={new Date().toISOString().split("T")[0]}
                      required
                    />
                  </div>

                  {/* Court Selection */}
                  <div className="space-y-2">
                    <Label htmlFor="court">Select Court *</Label>
                    <Select value={selectedCourt} onValueChange={setSelectedCourt} required>
                      <SelectTrigger>
                        <SelectValue placeholder="Choose a court" />
                      </SelectTrigger>
                      <SelectContent>
                        {courts.map((court) => (
                          <SelectItem key={court.id} value={court.id}>
                            {court.name} - {court.surface}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Player Information */}
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name *</Label>
                      <Input
                        id="name"
                        value={playerName}
                        onChange={(e) => setPlayerName(e.target.value)}
                        placeholder="Enter your name"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number *</Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={playerPhone}
                        onChange={(e) => setPlayerPhone(e.target.value)}
                        placeholder="Enter phone number"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      value={playerEmail}
                      onChange={(e) => setPlayerEmail(e.target.value)}
                      placeholder="Enter email address"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="notes">Additional Notes</Label>
                    <Textarea
                      id="notes"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Any special requests or notes..."
                      rows={3}
                    />
                  </div>

                  <Button type="submit" className="w-full" disabled={!selectedTime}>
                    {selectedTime
                      ? `Book Court - ₹${courtSlots.find((slot) => slot.time === selectedTime)?.price || 0}`
                      : "Select Time Slot"}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Available Time Slots */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Available Time Slots
                </CardTitle>
                <CardDescription>
                  {selectedDate && selectedCourt
                    ? `Available slots for ${courts.find((c) => c.id === selectedCourt)?.name} on ${selectedDate}`
                    : "Select date and court to view available slots"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {selectedDate && selectedCourt ? (
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                      <MapPin className="h-4 w-4" />
                      Surface: {getCourtSurface(selectedCourt)}
                    </div>

                    <div className="grid gap-2">
                      {courtSlots.map((slot) => (
                        <div
                          key={slot.id}
                          className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-all ${
                            selectedTime === slot.time
                              ? "border-primary bg-primary/10"
                              : slot.available
                                ? "border-border hover:border-primary/50 hover:bg-muted/50"
                                : "border-border bg-muted/30 cursor-not-allowed opacity-60"
                          }`}
                          onClick={() => slot.available && setSelectedTime(slot.time)}
                        >
                          <div className="flex items-center gap-3">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            <span className="font-medium">{slot.time}</span>
                            {!slot.available && (
                              <Badge variant="destructive" className="text-xs">
                                Booked
                              </Badge>
                            )}
                          </div>
                          <div className="text-right">
                            <div className="font-semibold">₹{slot.price}</div>
                            <div className="text-xs text-muted-foreground">per hour</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">Select Date & Court</h3>
                    <p className="text-muted-foreground">
                      Choose your preferred date and court to view available time slots
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Court Information */}
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-foreground mb-6">Our Courts</h2>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {courts.map((court) => (
                <Card key={court.id} className="group hover:shadow-lg transition-all duration-300">
                  <CardHeader>
                    <CardTitle className="text-lg">{court.name}</CardTitle>
                    <CardDescription>{court.surface}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <span>Singles & Doubles</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span>6 AM - 8 PM</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Contact Information */}
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Need Help with Booking?</CardTitle>
              <CardDescription>Contact us for assistance or special arrangements</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="flex items-center gap-3">
                  <Phone className="h-5 w-5 text-primary" />
                  <div>
                    <div className="font-medium">Phone</div>
                    <div className="text-muted-foreground">+91 9876543210</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-primary" />
                  <div>
                    <div className="font-medium">Email</div>
                    <div className="text-muted-foreground">booking@bhimavaramtc.com</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Footer />
    </main>
  )
}
