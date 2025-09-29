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
    category: "senior" as const,
    imageFile: null as File | null,
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
    try {
      setUploading(true)

      let imageUrl = editingProfile?.imageUrl

      if (formData.imageFile) {
        imageUrl = await uploadOperations.uploadImage(formData.imageFile, "profiles")
      }

      const profileData = {
        name: formData.name,
        age: Number.parseInt(formData.age),
        ranking: formData.ranking ? Number.parseInt(formData.ranking) : undefined,
        achievements: formData.achievements.split("\n").filter((a) => a.trim()),
        bio: formData.bio,
        category: formData.category,
        imageUrl,
      }

      if (editingProfile) {
        await profileOperations.update(editingProfile.id!, profileData)
        toast({
          title: "Success",
          description: "Profile updated successfully",
        })
      } else {
        await profileOperations.create(profileData)
        toast({
          title: "Success",
          description: "Profile created successfully",
        })
      }

      setDialogOpen(false)
      resetForm()
      loadProfiles()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save profile",
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
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="h-4 w-4 mr-2" />
              Add Profile
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingProfile ? "Edit Profile" : "Add New Profile"}</DialogTitle>
              <DialogDescription>
                {editingProfile ? "Update player information" : "Create a new player profile"}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="age">Age</Label>
                  <Input
                    id="age"
                    type="number"
                    value={formData.age}
                    onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="ranking">Ranking (Optional)</Label>
                  <Input
                    id="ranking"
                    type="number"
                    value={formData.ranking}
                    onChange={(e) => setFormData({ ...formData, ranking: e.target.value })}
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
                <Label htmlFor="bio">Biography</Label>
                <Textarea
                  id="bio"
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  rows={3}
                  required
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
              <div className="flex gap-2 pt-4">
                <Button type="submit" className="flex-1" disabled={uploading}>
                  {uploading ? (
                    <>
                      <Upload className="h-4 w-4 mr-2 animate-spin" />
                      {editingProfile ? "Updating..." : "Creating..."}
                    </>
                  ) : (
                    <>{editingProfile ? "Update" : "Create"} Profile</>
                  )}
                </Button>
                <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                  Cancel
                </Button>
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
