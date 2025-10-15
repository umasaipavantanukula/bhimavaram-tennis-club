"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Plus, Edit, Trash2, Users, Upload } from "lucide-react"
import { profileOperations, uploadOperations, type PlayerProfile } from "@/lib/firebase-operations"
import { useToast } from "@/hooks/use-toast"

export function ProfilesManager() {
  const [profiles, setProfiles] = useState<PlayerProfile[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingProfile, setEditingProfile] = useState<PlayerProfile | null>(null)
  const [uploading, setUploading] = useState(false)
  const { toast } = useToast()

  const [formData, setFormData] = useState({
    name: "",
    age: "",
    ranking: "",
    achievements: "",
    bio: "",
    category: "senior" as "junior" | "senior" | "veteran",
    imageFile: null as File | null,
    // Tennis Statistics
    matchesPlayed: "",
    matchesWon: "",
    winPercentage: "",
    setsWon: "",
    setsLost: "",
    gamesWon: "",
    gamesLost: "",
    currentStreak: "",
    longestStreak: "",
    points: "",
    servingPercentage: "",
    acesServed: "",
    doubleFaults: "",
    breakPointsSaved: "",
    breakPointsConverted: "",
  })

  useEffect(() => {
    loadProfiles()
  }, [])

  const loadProfiles = async () => {
    try {
      const data = await profileOperations.getAll()
      setProfiles(data)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load profiles",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    console.log("Form submission started")
    console.log("Form data:", formData)
    
    // Validate required fields
    if (!formData.name.trim()) {
      console.log("Validation failed: Name is empty")
      toast({
        title: "Validation Error",
        description: "Player name is required",
        variant: "destructive",
      })
      return
    }

    if (!formData.age || Number.parseInt(formData.age) <= 0) {
      console.log("Validation failed: Age is invalid", formData.age)
      toast({
        title: "Validation Error", 
        description: "Valid age is required",
        variant: "destructive",
      })
      return
    }

    if (!formData.bio.trim()) {
      console.log("Validation failed: Bio is empty")
      toast({
        title: "Validation Error",
        description: "Biography is required",
        variant: "destructive", 
      })
      return
    }

    console.log("Validation passed, proceeding with submission")

    try {
      setUploading(true)
      console.log("Upload state set to true")

      let imageUrl = editingProfile?.imageUrl

      if (formData.imageFile) {
        try {
          imageUrl = await uploadOperations.uploadImage(formData.imageFile, "profiles")
        } catch (uploadError) {
          console.error("Image upload failed:", uploadError)
          toast({
            title: "Upload Error",
            description: "Failed to upload image. Profile will be created without image.",
            variant: "destructive",
          })
          imageUrl = undefined
        }
      }

      // Calculate win percentage automatically
      const matchesPlayed = Number.parseInt(formData.matchesPlayed) || 0
      const matchesWon = Number.parseInt(formData.matchesWon) || 0
      const calculatedWinPercentage = matchesPlayed > 0 ? (matchesWon / matchesPlayed) * 100 : 0

      // Build profile data object
      const profileData: any = {
        name: formData.name.trim(),
        age: Number.parseInt(formData.age),
        achievements: formData.achievements.split("\n").filter((a) => a.trim()),
        bio: formData.bio.trim(),
        category: formData.category,
        imageUrl,
        // Tennis Statistics with proper defaults
        matchesPlayed,
        matchesWon,
        winPercentage: calculatedWinPercentage,
        setsWon: Number.parseInt(formData.setsWon) || 0,
        setsLost: Number.parseInt(formData.setsLost) || 0,
        gamesWon: Number.parseInt(formData.gamesWon) || 0,
        gamesLost: Number.parseInt(formData.gamesLost) || 0,
        currentStreak: Number.parseInt(formData.currentStreak) || 0,
        longestStreak: Number.parseInt(formData.longestStreak) || 0,
        points: Number.parseInt(formData.points) || 0,
        servingPercentage: Number.parseFloat(formData.servingPercentage) || 0,
        acesServed: Number.parseInt(formData.acesServed) || 0,
        doubleFaults: Number.parseInt(formData.doubleFaults) || 0,
        breakPointsSaved: Number.parseInt(formData.breakPointsSaved) || 0,
        breakPointsConverted: Number.parseInt(formData.breakPointsConverted) || 0,
      }

      // Only add ranking if it has a valid value (not undefined)
      if (formData.ranking && Number.parseInt(formData.ranking) > 0) {
        profileData.ranking = Number.parseInt(formData.ranking)
      }

      console.log("Creating profile with data:", profileData)

      if (editingProfile) {
        await profileOperations.update(editingProfile.id!, profileData)
        toast({
          title: "Success",
          description: "Profile updated successfully",
        })
      } else {
        const newProfileId = await profileOperations.create(profileData)
        console.log("Profile created with ID:", newProfileId)
        toast({
          title: "Success", 
          description: `Profile created successfully for ${profileData.name}`,
        })
      }

      // Close dialog and refresh data
      setDialogOpen(false)
      resetForm()
      setEditingProfile(null)
      
      // Reload profiles to show the new one
      await loadProfiles()
    } catch (error) {
      console.error("Profile save error:", error)
      console.error("Error details:", {
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
        formData: formData
      })
      toast({
        title: "Error",
        description: `Failed to save profile: ${error instanceof Error ? error.message : 'Unknown error'}. Check console for details.`,
        variant: "destructive",
      })
    } finally {
      setUploading(false)
    }
  }

  const handleEdit = (profile: PlayerProfile) => {
    setEditingProfile(profile)
    setFormData({
      name: profile.name,
      age: profile.age.toString(),
      ranking: profile.ranking?.toString() || "",
      achievements: profile.achievements.join("\n"),
      bio: profile.bio,
      category: profile.category,
      imageFile: null,
      matchesPlayed: profile.matchesPlayed?.toString() || "0",
      matchesWon: profile.matchesWon?.toString() || "0",
      winPercentage: profile.winPercentage?.toString() || "0",
      setsWon: profile.setsWon?.toString() || "0",
      setsLost: profile.setsLost?.toString() || "0",
      gamesWon: profile.gamesWon?.toString() || "0",
      gamesLost: profile.gamesLost?.toString() || "0",
      currentStreak: profile.currentStreak?.toString() || "0",
      longestStreak: profile.longestStreak?.toString() || "0",
      points: profile.points?.toString() || "0",
      servingPercentage: profile.servingPercentage?.toString() || "0",
      acesServed: profile.acesServed?.toString() || "0",
      doubleFaults: profile.doubleFaults?.toString() || "0",
      breakPointsSaved: profile.breakPointsSaved?.toString() || "0",
      breakPointsConverted: profile.breakPointsConverted?.toString() || "0",
    })
    setDialogOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this profile?")) {
      try {
        await profileOperations.delete(id)
        toast({
          title: "Success",
          description: "Profile deleted successfully",
        })
        loadProfiles()
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to delete profile",
          variant: "destructive",
        })
      }
    }
  }

  const resetForm = () => {
    setFormData({
      name: "",
      age: "",
      ranking: "",
      achievements: "",
      bio: "",
      category: "senior",
      imageFile: null,
      matchesPlayed: "0",
      matchesWon: "0",
      winPercentage: "0",
      setsWon: "0",
      setsLost: "0",
      gamesWon: "0",
      gamesLost: "0",
      currentStreak: "0",
      longestStreak: "0",
      points: "0",
      servingPercentage: "0",
      acesServed: "0",
      doubleFaults: "0",
      breakPointsSaved: "0",
      breakPointsConverted: "0",
    })
    setEditingProfile(null)
  }

  const getCategoryBadge = (category: string) => {
    const variants = {
      junior: "secondary",
      senior: "default",
      veteran: "outline",
    } as const
    return <Badge variant={variants[category as keyof typeof variants]}>{category}</Badge>
  }

  if (loading) {
    return <div className="flex justify-center p-8">Loading profiles...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Player Profiles</h2>
          <p className="text-muted-foreground">Manage player profiles and achievements</p>
        </div>
        
        {/* Test Button for Debugging */}
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={async () => {
              try {
                console.log("Testing profile creation...")
                const testProfile = {
                  name: "Test Player",
                  age: 25,
                  bio: "Test biography",
                  category: "senior" as const,
                  achievements: [],
                  matchesPlayed: 0,
                  matchesWon: 0,
                  winPercentage: 0,
                  setsWon: 0,
                  setsLost: 0,
                  gamesWon: 0,
                  gamesLost: 0,
                  currentStreak: 0,
                  longestStreak: 0,
                  points: 0,
                  servingPercentage: 0,
                  acesServed: 0,
                  doubleFaults: 0,
                  breakPointsSaved: 0,
                  breakPointsConverted: 0,
                }
                const id = await profileOperations.create(testProfile)
                console.log("Test profile created with ID:", id)
                toast({
                  title: "Success",
                  description: `Test profile created with ID: ${id}`,
                })
                await loadProfiles()
              } catch (error) {
                console.error("Test profile creation failed:", error)
                toast({
                  title: "Error",
                  description: `Test failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
                  variant: "destructive",
                })
              }
            }}
          >
            Test Create
          </Button>
        </div>
        <Dialog open={dialogOpen} onOpenChange={(open) => {
          setDialogOpen(open)
          if (!open) {
            resetForm()
            setEditingProfile(null)
          }
        }}>
          <DialogTrigger asChild>
            <Button onClick={() => {
              resetForm()
              setEditingProfile(null)
              setDialogOpen(true)
            }}>
              <Plus className="h-4 w-4 mr-2" />
              Add Profile
            </Button>
          </DialogTrigger>
          <DialogContent className="w-[95vw] sm:w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingProfile ? "Edit Profile" : "Add New Profile"}</DialogTitle>
              <DialogDescription>
                {editingProfile ? "Update player information" : "Create a new player profile"}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    placeholder="Enter player's full name"
                    className="border-red-200 focus:border-red-500"
                  />
                </div>
                <div>
                  <Label htmlFor="age">Age *</Label>
                  <Input
                    id="age"
                    type="number"
                    min="1"
                    max="100"
                    value={formData.age}
                    onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                    required
                    placeholder="Enter age"
                    className="border-red-200 focus:border-red-500"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="ranking">Ranking (Optional - Auto-assigned if empty)</Label>
                  <Input
                    id="ranking"
                    type="number"
                    min="1"
                    value={formData.ranking}
                    onChange={(e) => setFormData({ ...formData, ranking: e.target.value })}
                    placeholder="Leave empty for auto-ranking by points"
                  />
                </div>
                <div>
                  <Label htmlFor="category">Category</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value: any) => setFormData({ ...formData, category: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="junior">Junior</SelectItem>
                      <SelectItem value="senior">Senior</SelectItem>
                      <SelectItem value="veteran">Veteran</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label htmlFor="bio">Biography *</Label>
                <Textarea
                  id="bio"
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  rows={3}
                  required
                  placeholder="Enter player's biography, playing style, and background..."
                  className="border-red-200 focus:border-red-500"
                />
              </div>
              <div>
                <Label htmlFor="achievements">Achievements (one per line)</Label>
                <Textarea
                  id="achievements"
                  value={formData.achievements}
                  onChange={(e) => setFormData({ ...formData, achievements: e.target.value })}
                  rows={4}
                  placeholder="State Champion 2023&#10;Club Tournament Winner&#10;Regional Finalist"
                />
              </div>
              <div>
                <Label htmlFor="image">Profile Image</Label>
                <Input
                  id="image"
                  type="file"
                  accept="image/*"
                  onChange={(e) => setFormData({ ...formData, imageFile: e.target.files?.[0] || null })}
                />
              </div>

              {/* Tennis Statistics Section */}
              <div className="border-t pt-4 mt-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-green-700">Tennis Statistics</h3>
                  <div className="text-xs text-gray-500 bg-blue-50 p-2 rounded">
                    💡 If ranking is not set, players will be auto-ranked by points
                  </div>
                </div>
                
                {/* Basic Match Statistics */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                  <div>
                    <Label htmlFor="matchesPlayed">Matches Played</Label>
                    <Input
                      id="matchesPlayed"
                      type="number"
                      min="0"
                      value={formData.matchesPlayed}
                      onChange={(e) => {
                        const played = Number.parseInt(e.target.value) || 0
                        const won = Number.parseInt(formData.matchesWon) || 0
                        const winPercentage = played > 0 ? ((won / played) * 100).toFixed(1) : "0"
                        setFormData({ ...formData, matchesPlayed: e.target.value, winPercentage })
                      }}
                    />
                  </div>
                  <div>
                    <Label htmlFor="matchesWon">Matches Won</Label>
                    <Input
                      id="matchesWon"
                      type="number"
                      min="0"
                      value={formData.matchesWon}
                      onChange={(e) => {
                        const won = Number.parseInt(e.target.value) || 0
                        const played = Number.parseInt(formData.matchesPlayed) || 0
                        const winPercentage = played > 0 ? ((won / played) * 100).toFixed(1) : "0"
                        setFormData({ ...formData, matchesWon: e.target.value, winPercentage })
                      }}
                    />
                  </div>
                  <div>
                    <Label htmlFor="points">Ranking Points *</Label>
                    <Input
                      id="points"
                      type="number"
                      min="0"
                      value={formData.points}
                      onChange={(e) => setFormData({ ...formData, points: e.target.value })}
                      placeholder="Used for auto-ranking"
                      className="border-green-300 focus:border-green-500"
                    />
                    <p className="text-xs text-gray-500 mt-1">Higher points = better ranking</p>
                  </div>
                </div>

                {/* Sets and Games Statistics */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mb-4">
                  <div>
                    <Label htmlFor="setsWon">Sets Won</Label>
                    <Input
                      id="setsWon"
                      type="number"
                      min="0"
                      value={formData.setsWon}
                      onChange={(e) => setFormData({ ...formData, setsWon: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="setsLost">Sets Lost</Label>
                    <Input
                      id="setsLost"
                      type="number"
                      min="0"
                      value={formData.setsLost}
                      onChange={(e) => setFormData({ ...formData, setsLost: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="gamesWon">Games Won</Label>
                    <Input
                      id="gamesWon"
                      type="number"
                      min="0"
                      value={formData.gamesWon}
                      onChange={(e) => setFormData({ ...formData, gamesWon: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="gamesLost">Games Lost</Label>
                    <Input
                      id="gamesLost"
                      type="number"
                      min="0"
                      value={formData.gamesLost}
                      onChange={(e) => setFormData({ ...formData, gamesLost: e.target.value })}
                    />
                  </div>
                </div>

                {/* Performance Statistics */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                  <div>
                    <Label htmlFor="servingPercentage">Serve % (First)</Label>
                    <Input
                      id="servingPercentage"
                      type="number"
                      min="0"
                      max="100"
                      step="0.1"
                      value={formData.servingPercentage}
                      onChange={(e) => setFormData({ ...formData, servingPercentage: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="acesServed">Aces Served</Label>
                    <Input
                      id="acesServed"
                      type="number"
                      min="0"
                      value={formData.acesServed}
                      onChange={(e) => setFormData({ ...formData, acesServed: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="doubleFaults">Double Faults</Label>
                    <Input
                      id="doubleFaults"
                      type="number"
                      min="0"
                      value={formData.doubleFaults}
                      onChange={(e) => setFormData({ ...formData, doubleFaults: e.target.value })}
                    />
                  </div>
                </div>

                {/* Break Points and Streaks */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mb-4">
                  <div>
                    <Label htmlFor="breakPointsSaved">BP Saved</Label>
                    <Input
                      id="breakPointsSaved"
                      type="number"
                      min="0"
                      value={formData.breakPointsSaved}
                      onChange={(e) => setFormData({ ...formData, breakPointsSaved: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="breakPointsConverted">BP Converted</Label>
                    <Input
                      id="breakPointsConverted"
                      type="number"
                      min="0"
                      value={formData.breakPointsConverted}
                      onChange={(e) => setFormData({ ...formData, breakPointsConverted: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="currentStreak">Current Streak</Label>
                    <Input
                      id="currentStreak"
                      type="number"
                      value={formData.currentStreak}
                      onChange={(e) => setFormData({ ...formData, currentStreak: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="longestStreak">Longest Streak</Label>
                    <Input
                      id="longestStreak"
                      type="number"
                      min="0"
                      value={formData.longestStreak}
                      onChange={(e) => setFormData({ ...formData, longestStreak: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-2 pt-4">
                <Button 
                  type="submit" 
                  className="flex-1 bg-green-600 hover:bg-green-700" 
                  disabled={uploading || !formData.name.trim() || !formData.age || !formData.bio.trim()}
                >
                  {uploading ? (
                    <>
                      <Upload className="h-4 w-4 mr-2 animate-spin" />
                      {editingProfile ? "Updating..." : "Creating..."}
                    </>
                  ) : (
                    <>{editingProfile ? "Update" : "Create"} Profile</>
                  )}
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => {
                    setDialogOpen(false)
                    resetForm()
                  }}
                  disabled={uploading}
                >
                  Cancel
                </Button>
              </div>
              
              <div className="text-sm text-gray-500 mt-2">
                * Required fields. Tennis statistics are optional and can be updated later.
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {profiles.map((profile) => (
          <Card key={profile.id} className="group hover:shadow-lg transition-all duration-300">
            <CardHeader className="text-center">
              <div className="relative mx-auto mb-4">
                <img
                  src={profile.imageUrl || "/placeholder.svg"}
                  alt={profile.name}
                  className="w-16 h-16 rounded-full object-cover"
                />
              </div>
              <CardTitle className="group-hover:text-primary transition-colors">{profile.name}</CardTitle>
              <CardDescription className="flex items-center justify-center gap-2">
                Age {profile.age} • {getCategoryBadge(profile.category)}
              </CardDescription>
              {profile.ranking && <Badge variant="outline">Ranking #{profile.ranking}</Badge>}
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground line-clamp-3">{profile.bio}</p>
              {profile.achievements.length > 0 && (
                <div>
                  <h4 className="font-semibold text-sm text-foreground mb-2">Recent Achievements</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    {profile.achievements.slice(0, 2).map((achievement, index) => (
                      <li key={index} className="flex items-center">
                        <div className="w-1.5 h-1.5 bg-primary rounded-full mr-2" />
                        {achievement}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              <div className="flex gap-2 pt-4">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 bg-transparent"
                  onClick={() => handleEdit(profile)}
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </Button>
                <Button variant="outline" size="sm" onClick={() => handleDelete(profile.id!)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {profiles.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No profiles yet</h3>
            <p className="text-muted-foreground mb-4">Create your first player profile to get started</p>
            <Button onClick={() => setDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add First Profile
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
