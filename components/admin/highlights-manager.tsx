"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { Video, Image, Plus, Edit, Trash2, Calendar, Users, Trophy, Star, Upload, X } from "lucide-react"
import { toast } from "sonner"
import { highlightsOperations, uploadOperations, type MatchHighlight } from "@/lib/firebase-operations"

export function HighlightsManager() {
  const [highlights, setHighlights] = useState<MatchHighlight[]>([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingHighlight, setEditingHighlight] = useState<MatchHighlight | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [loading, setLoading] = useState(true)
  const [uploadingVideo, setUploadingVideo] = useState(false)

  useEffect(() => {
    loadHighlights()
  }, [])

  const loadHighlights = async () => {
    try {
      setLoading(true)
      const data = await highlightsOperations.getAll()
      console.log("Loaded highlights:", data) // Debug log
      setHighlights(data)
    } catch (error) {
      console.error("Error loading highlights:", error)
      toast.error("Failed to load highlights")
    } finally {
      setLoading(false)
    }
  }

  // Form state
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    matchType: "tournament" as "tournament" | "friendly" | "training" | "championship",
    players: "",
    date: "",
    videoUrl: "",
    youtubeUrl: "",
    imageUrls: [] as string[],
    featured: false
  })

  // Reset form
  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      matchType: "tournament",
      players: "",
      date: "",
      videoUrl: "",
      youtubeUrl: "",
      imageUrls: [],
      featured: false
    })
    setEditingHighlight(null)
  }

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const playersArray = formData.players.split(",").map(p => p.trim()).filter(p => p)
      const imageUrlsArray = formData.imageUrls

      const highlightData: any = {
        title: formData.title,
        description: formData.description,
        date: new Date(formData.date),
        matchType: formData.matchType,
        players: playersArray,
        score: "Match", // Default value since score field is removed
        videoUrl: formData.videoUrl.trim(), // Always include videoUrl field, even if empty
        youtubeUrl: formData.youtubeUrl.trim(), // YouTube embed URL
        imageUrls: imageUrlsArray,
        featured: formData.featured
      }

      if (editingHighlight && editingHighlight.id) {
        // Update existing highlight
        await highlightsOperations.update(editingHighlight.id, highlightData)
        toast.success("Highlight updated successfully!")
      } else {
        // Add new highlight
        await highlightsOperations.create(highlightData)
        toast.success("Highlight added successfully!")
      }

      // Reload highlights to get fresh data
      await loadHighlights()
      resetForm()
      setIsDialogOpen(false)
    } catch (error) {
      console.error("Error saving highlight:", error)
      toast.error("Failed to save highlight")
    } finally {
      setIsLoading(false)
    }
  }

  // Handle edit
  const handleEdit = (highlight: MatchHighlight) => {
    setEditingHighlight(highlight)
    setFormData({
      title: highlight.title,
      description: highlight.description,
      matchType: highlight.matchType,
      players: highlight.players.join(", "),
      date: highlight.date.toISOString().split('T')[0],
      videoUrl: highlight.videoUrl || "",
      youtubeUrl: highlight.youtubeUrl || "",
      imageUrls: highlight.imageUrls,
      featured: highlight.featured
    })
    setIsDialogOpen(true)
  }

  // Handle delete
  const handleDelete = async (id: string) => {
    try {
      await highlightsOperations.delete(id)
      await loadHighlights() // Reload highlights
      toast.success("Highlight deleted successfully!")
    } catch (error) {
      console.error("Error deleting highlight:", error)
      toast.error("Failed to delete highlight")
    }
  }

  // Toggle featured status
  const toggleFeatured = async (id: string) => {
    try {
      const highlight = highlights.find(h => h.id === id)
      if (highlight) {
        await highlightsOperations.update(id, { featured: !highlight.featured })
        await loadHighlights() // Reload highlights
        toast.success("Featured status updated!")
      }
    } catch (error) {
      console.error("Error updating featured status:", error)
      toast.error("Failed to update featured status")
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "tournament": return "bg-red-500"
      case "championship": return "bg-yellow-500"
      case "friendly": return "bg-blue-500" 
      case "training": return "bg-green-500"
      default: return "bg-gray-500"
    }
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Manage Highlights</h2>
          <p className="text-muted-foreground">Add and manage match highlights with videos and images</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="h-4 w-4 mr-2" />
              Add Highlight
            </Button>
          </DialogTrigger>
          <DialogContent className="w-[95vw] sm:w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingHighlight ? "Edit" : "Add"} Highlight</DialogTitle>
              <DialogDescription>
                {editingHighlight ? "Update the highlight details below." : "Fill in the details to create a new highlight."}
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Match highlight title"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="matchType">Match Type *</Label>
                  <Select 
                    value={formData.matchType} 
                    onValueChange={(value: any) => setFormData(prev => ({ ...prev, matchType: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="tournament">🏆 Tournament</SelectItem>
                      <SelectItem value="championship">👑 Championship</SelectItem>
                      <SelectItem value="friendly">🤝 Friendly Match</SelectItem>
                      <SelectItem value="training">💪 Training Session</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Describe the match highlights"
                  rows={3}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="date">Date *</Label>
                <Input
                  id="date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="players">Players *</Label>
                <Input
                  id="players"
                  value={formData.players}
                  onChange={(e) => setFormData(prev => ({ ...prev, players: e.target.value }))}
                  placeholder="Player 1, Player 2, Player 3 (comma-separated)"
                  required
                />
              </div>

              <div className="space-y-2">
                  <Label htmlFor="videoFile">Choose Video</Label>
                  <Input
                    id="videoFile"
                    type="file"
                    accept="video/*"
                    disabled={uploadingVideo}
                    onChange={async (e) => {
                      const file = e.target.files?.[0]
                      if (file) {
                        console.log("Starting video upload:", file.name, "Size:", file.size, "Type:", file.type)
                        setUploadingVideo(true)
                        
                        try {
                          // Dismiss any existing toasts
                          toast.dismiss()
                          const uploadToast = toast.loading(`Uploading ${file.name} to Cloudinary...`)
                          
                          console.log("Uploading video to Cloudinary...")
                          
                          // Create FormData for video upload
                          const formData = new FormData()
                          formData.append('video', file)
                          
                          // Upload video to Cloudinary via API route
                          const response = await fetch('/api/upload-video', {
                            method: 'POST',
                            body: formData
                          })
                          
                          const result = await response.json()
                          
                          if (!response.ok) {
                            throw new Error(result.error || 'Failed to upload video')
                          }
                          
                          console.log("Video uploaded successfully to Cloudinary:", result.videoUrl)
                          
                          // Dismiss loading toast
                          toast.dismiss(uploadToast)
                          
                          // Update form data with the Cloudinary URL
                          setFormData(prev => ({ ...prev, videoUrl: result.videoUrl }))
                          toast.success(`Video uploaded successfully to Cloudinary!`)
                          
                        } catch (error: any) {
                          console.error("Cloudinary video upload error:", error)
                          toast.dismiss() // Clear any loading toasts
                          toast.error(error.message || "Failed to upload video to Cloudinary")
                        } finally {
                          setUploadingVideo(false)
                          // Clear the file input
                          if (e.target) {
                            e.target.value = ""
                          }
                        }
                      }
                    }}
                  />
                  {uploadingVideo && (
                    <div className="flex items-center gap-2 text-sm text-blue-600">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                      Uploading video to Cloudinary...
                    </div>
                  )}
                  {formData.videoUrl && (
                    <div className="flex items-center gap-2 text-sm text-green-600">
                      <Video className="h-4 w-4" />
                      Video uploaded to Cloudinary successfully
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => setFormData(prev => ({ ...prev, videoUrl: "" }))}
                      >
                        Remove
                      </Button>
                    </div>
                  )}
                <p className="text-xs text-muted-foreground">
                  Maximum file size: 100MB. Supported formats: MP4, WebM, AVI, MOV. Videos are stored on Cloudinary with automatic optimization.
                </p>
              </div>

              {/* YouTube URL Input */}
              <div className="space-y-2">
                <Label htmlFor="youtubeUrl">YouTube Video URL (Alternative)</Label>
                <Input
                  id="youtubeUrl"
                  value={formData.youtubeUrl}
                  onChange={(e) => setFormData(prev => ({ ...prev, youtubeUrl: e.target.value }))}
                  placeholder="https://www.youtube.com/watch?v=... or https://youtu.be/..."
                  type="url"
                />
                <p className="text-xs text-muted-foreground">
                  Paste a YouTube video URL as an alternative to uploading. This will be used if no video file is uploaded.
                </p>
                {formData.youtubeUrl && (
                  <div className="flex items-center gap-2 text-sm text-blue-600">
                    <Video className="h-4 w-4" />
                    YouTube video will be embedded
                  </div>
                )}
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="featured"
                  checked={formData.featured}
                  onChange={(e) => setFormData(prev => ({ ...prev, featured: e.target.checked }))}
                  className="rounded border-gray-300"
                />
                <Label htmlFor="featured">Featured highlight</Label>
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isLoading || uploadingVideo}>
                  {uploadingVideo ? "Uploading to Cloudinary..." : 
                   isLoading ? "Saving..." : 
                   (editingHighlight ? "Update" : "Add")} Highlight
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Highlights</CardTitle>
            <Video className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{highlights.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">With Videos</CardTitle>
            <Video className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {highlights.filter(h => h.videoUrl).length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Featured</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {highlights.filter(h => h.featured).length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Month</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {highlights.filter(h => 
                new Date(h.date).getMonth() === new Date().getMonth() &&
                new Date(h.date).getFullYear() === new Date().getFullYear()
              ).length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Highlights List */}
      <Card>
        <CardHeader>
          <CardTitle>All Highlights</CardTitle>
          <CardDescription>Manage all match highlights</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading highlights...</p>
            </div>
          ) : highlights.length === 0 ? (
            <div className="text-center py-8">
              <Video className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No highlights found. Add your first highlight!</p>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {highlights.map((highlight) => {
                console.log("Rendering highlight:", highlight.id, highlight.thumbnailUrl) // Debug log
                return (
                <Card key={highlight.id} className="overflow-hidden">
                  <div className="relative">
                    <div className="aspect-video bg-gray-200 overflow-hidden">
                      <img 
                        src={highlight.thumbnailUrl || "/placeholder.jpg"} 
                        alt={highlight.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = "/placeholder.jpg";
                        }}
                      />
                      {highlight.videoUrl && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-12 h-12 bg-black/50 rounded-full flex items-center justify-center">
                            <Video className="h-6 w-6 text-white" />
                          </div>
                        </div>
                      )}
                    </div>
                    
                    {/* Badges */}
                    <div className="absolute top-2 left-2 flex gap-2">
                      <Badge className={`${getTypeColor(highlight.matchType)} text-white`}>
                        {highlight.matchType}
                      </Badge>
                      {highlight.featured && (
                        <Badge className="bg-yellow-500 text-black">
                          <Star className="h-3 w-3 mr-1" />
                          Featured
                        </Badge>
                      )}
                    </div>

                    {/* Media indicators */}
                    <div className="absolute top-2 right-2 flex gap-1">
                      {highlight.videoUrl && (
                        <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                          <Video className="h-3 w-3 text-white" />
                        </div>
                      )}
                      {highlight.imageUrls.length > 0 && (
                        <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                          <Image className="h-3 w-3 text-white" />
                        </div>
                      )}
                    </div>
                  </div>

                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg line-clamp-1">{highlight.title}</CardTitle>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {formatDate(highlight.date)}
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        {highlight.players.length}
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="pt-0">
                    <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                      {highlight.description}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <Badge variant="secondary">{highlight.score}</Badge>
                      <div className="flex gap-1">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => highlight.id && toggleFeatured(highlight.id)}
                          className={highlight.featured ? "bg-yellow-100" : ""}
                        >
                          <Star className={`h-3 w-3 ${highlight.featured ? "fill-yellow-500 text-yellow-500" : ""}`} />
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => handleEdit(highlight)}>
                          <Edit className="h-3 w-3" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button size="sm" variant="outline">
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete Highlight</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete "{highlight.title}"? This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={() => highlight.id && handleDelete(highlight.id)}>
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}