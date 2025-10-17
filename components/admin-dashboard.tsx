"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { LogOut, Users, Trophy, Camera, Newspaper, Calendar, BarChart3, Video, Image, Loader2 } from "lucide-react"
import { MatchesManager } from "./admin/matches-manager"
import { GalleryManager } from "./admin/gallery-manager"
import { ProfilesManager } from "./admin/profiles-manager"
import { NewsManager } from "./admin/news-manager"
import { EventsManager } from "./admin/events-manager"
import { HighlightsManager } from "./admin/highlights-manager"
import { HeroManager } from "./admin/hero-manager"
import { dashboardOperations, DashboardStats } from "@/lib/firebase-operations"

export function AdminDashboard() {
  const { user, logout } = useAuth()
  const [activeTab, setActiveTab] = useState("overview")
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)

  // Load dashboard stats with real-time updates
  useEffect(() => {
    console.log("📊 [Dashboard] Setting up real-time stats listener")
    
    // Initial load
    dashboardOperations.getStats().then(initialStats => {
      setStats(initialStats)
      setLoading(false)
      console.log("📊 [Dashboard] Initial stats loaded:", initialStats)
    })

    // Subscribe to real-time updates
    const unsubscribe = dashboardOperations.subscribeToStats((updatedStats) => {
      setStats(updatedStats)
      console.log("📊 [Dashboard] Stats updated:", updatedStats)
    })

    // Cleanup subscription on unmount
    return () => {
      console.log("📊 [Dashboard] Cleaning up stats listener")
      unsubscribe()
    }
  }, [])

  const handleLogout = async () => {
    try {
      await logout()
    } catch (error) {
      console.error("Error logging out:", error)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-primary">Admin Dashboard</h1>
            <p className="text-sm text-muted-foreground">Bhimavaram Tennis Club</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm font-medium">{user?.email}</p>
              <Badge variant="secondary">Administrator</Badge>
            </div>
            <Button variant="outline" size="sm" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-8">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="hero" className="flex items-center gap-2">
              <Image className="h-4 w-4" />
              Hero
            </TabsTrigger>
            <TabsTrigger value="matches" className="flex items-center gap-2">
              <Trophy className="h-4 w-4" />
              Matches
            </TabsTrigger>
            <TabsTrigger value="profiles" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Profiles
            </TabsTrigger>
            <TabsTrigger value="gallery" className="flex items-center gap-2">
              <Camera className="h-4 w-4" />
              Gallery
            </TabsTrigger>
            <TabsTrigger value="highlights" className="flex items-center gap-2">
              <Video className="h-4 w-4" />
              Highlights
            </TabsTrigger>
            {/* <TabsTrigger value="news" className="flex items-center gap-2">
              <Newspaper className="h-4 w-4" />
              News
            </TabsTrigger> */}
            {/* <TabsTrigger value="events" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Events
            </TabsTrigger> */}
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <span className="ml-3 text-muted-foreground">Loading dashboard statistics...</span>
              </div>
            ) : (
              <>
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Total Matches</CardTitle>
                      <Trophy className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{stats?.totalMatches || 0}</div>
                      <p className="text-xs text-muted-foreground">
                        {stats?.liveMatches || 0} live • {stats?.upcomingMatches || 0} upcoming
                      </p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Player Profiles</CardTitle>
                      <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{stats?.totalProfiles || 0}</div>
                      <p className="text-xs text-muted-foreground">Registered players</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Gallery Items</CardTitle>
                      <Camera className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{stats?.totalGalleryItems || 0}</div>
                      <p className="text-xs text-muted-foreground">Photos in gallery</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">News Articles</CardTitle>
                      <Newspaper className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{stats?.totalNewsArticles || 0}</div>
                      <p className="text-xs text-muted-foreground">Published articles</p>
                    </CardContent>
                  </Card>
                </div>

                {/* Additional Stats Row */}
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Events</CardTitle>
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{stats?.totalEvents || 0}</div>
                      <p className="text-xs text-muted-foreground">Scheduled events</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Highlights</CardTitle>
                      <Video className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{stats?.totalHighlights || 0}</div>
                      <p className="text-xs text-muted-foreground">Video highlights</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Match Status</CardTitle>
                      <BarChart3 className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center gap-2">
                        <Badge variant="destructive" className="text-xs">
                          {stats?.liveMatches || 0} Live
                        </Badge>
                        <Badge variant="secondary" className="text-xs">
                          {stats?.completedMatches || 0} Done
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mt-2">Current match status</p>
                    </CardContent>
                  </Card>
                </div>
              </>
            )}

            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Common administrative tasks</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Button
                  variant="outline"
                  className="h-20 flex-col gap-2 bg-transparent"
                  onClick={() => setActiveTab("matches")}
                >
                  <Trophy className="h-6 w-6" />
                  Add New Match
                </Button>
                <Button
                  variant="outline"
                  className="h-20 flex-col gap-2 bg-transparent"
                  onClick={() => setActiveTab("profiles")}
                >
                  <Users className="h-6 w-6" />
                  Create Player Profile
                </Button>
                <Button
                  variant="outline"
                  className="h-20 flex-col gap-2 bg-transparent"
                  onClick={() => setActiveTab("news")}
                >
                  <Newspaper className="h-6 w-6" />
                  Publish News
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="hero">
            <HeroManager />
          </TabsContent>

          <TabsContent value="matches">
            <MatchesManager />
          </TabsContent>

          <TabsContent value="profiles">
            <ProfilesManager />
          </TabsContent>

          <TabsContent value="gallery">
            <GalleryManager />
          </TabsContent>

          <TabsContent value="highlights">
            <HighlightsManager />
          </TabsContent>

          <TabsContent value="news">
            <NewsManager />
          </TabsContent>

          <TabsContent value="events">
            <EventsManager />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
