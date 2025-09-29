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
import { Plus, Edit, Trash2, Camera, Upload } from "lucide-react"
import { galleryOperations, uploadOperations, type GalleryItem } from "@/lib/firebase-operations"
import { useToast } from "@/hooks/use-toast"

export function GalleryManager() {
  const [items, setItems] = useState<GalleryItem[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<GalleryItem | null>(null)
  const [uploading, setUploading] = useState(false)
  const { toast } = useToast()

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "tournament" as const,
    imageFile: null as File | null,
  })

  useEffect(() => {
    loadItems()
  }, [])

  const loadItems = async () => {
    try {
      const data = await galleryOperations.getAll()
      setItems(data)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load gallery items",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.imageFile && !editingItem) {
      toast({
        title: "Error",
        description: "Please select an image",
        variant: "destructive",
      })
      return
    }

    try {
      setUploading(true)

      let imageUrl = editingItem?.imageUrl

      if (formData.imageFile) {
        imageUrl = await uploadOperations.uploadImage(formData.imageFile, "gallery")
      }

      const itemData = {
        title: formData.title,
        description: formData.description,
        category: formData.category,
        imageUrl: imageUrl!,
      }

      if (editingItem) {
        await galleryOperations.update(editingItem.id!, itemData)
        toast({
          title: "Success",
          description: "Gallery item updated successfully",
        })
      } else {
        await galleryOperations.create(itemData)
        toast({
          title: "Success",
          description: "Gallery item created successfully",
        })
      }

      setDialogOpen(false)
      resetForm()
      loadItems()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save gallery item",
        variant: "destructive",
      })
    } finally {
      setUploading(false)
    }
  }

  const handleEdit = (item: GalleryItem) => {
    setEditingItem(item)
    setFormData({
      title: item.title,
      description: item.description,
      category: item.category,
      imageFile: null,
    })
    setDialogOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this gallery item?")) {
      try {
        await galleryOperations.delete(id)
        toast({
          title: "Success",
          description: "Gallery item deleted successfully",
        })
        loadItems()
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to delete gallery item",
          variant: "destructive",
        })
      }
    }
  }

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      category: "tournament",
      imageFile: null,
    })
    setEditingItem(null)
  }

  const getCategoryBadge = (category: string) => {
    const variants = {
      tournament: "default",
      training: "secondary",
      events: "outline",
      facilities: "destructive",
    } as const
    return <Badge variant={variants[category as keyof typeof variants]}>{category}</Badge>
  }

  if (loading) {
    return <div className="flex justify-center p-8">Loading gallery...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Gallery Management</h2>
          <p className="text-muted-foreground">Manage photos and media content</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="h-4 w-4 mr-2" />
              Add Photo
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>{editingItem ? "Edit Photo" : "Add New Photo"}</DialogTitle>
              <DialogDescription>
                {editingItem ? "Update photo details" : "Upload a new photo to the gallery"}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  required
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
                    <SelectItem value="tournament">Tournament</SelectItem>
                    <SelectItem value="training">Training</SelectItem>
                    <SelectItem value="events">Events</SelectItem>
                    <SelectItem value="facilities">Facilities</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="image">Image {!editingItem && "*"}</Label>
                <Input
                  id="image"
                  type="file"
                  accept="image/*"
                  onChange={(e) => setFormData({ ...formData, imageFile: e.target.files?.[0] || null })}
                  required={!editingItem}
                />
              </div>
              <div className="flex gap-2 pt-4">
                <Button type="submit" className="flex-1" disabled={uploading}>
                  {uploading ? (
                    <>
                      <Upload className="h-4 w-4 mr-2 animate-spin" />
                      {editingItem ? "Updating..." : "Uploading..."}
                    </>
                  ) : (
                    <>{editingItem ? "Update" : "Upload"} Photo</>
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
        {items.map((item) => (
          <Card key={item.id} className="group hover:shadow-lg transition-all duration-300">
            <CardHeader className="p-0">
              <div className="relative">
                <img
                  src={item.imageUrl || "/placeholder.svg"}
                  alt={item.title}
                  className="w-full h-48 object-cover rounded-t-lg"
                />
                <div className="absolute top-4 right-4">{getCategoryBadge(item.category)}</div>
              </div>
            </CardHeader>
            <CardContent className="p-4">
              <CardTitle className="text-lg group-hover:text-primary transition-colors mb-2">{item.title}</CardTitle>
              <CardDescription className="text-sm mb-4 line-clamp-2">{item.description}</CardDescription>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="flex-1 bg-transparent" onClick={() => handleEdit(item)}>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </Button>
                <Button variant="outline" size="sm" onClick={() => handleDelete(item.id!)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {items.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <Camera className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No photos yet</h3>
            <p className="text-muted-foreground mb-4">Upload your first photo to get started</p>
            <Button onClick={() => setDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add First Photo
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
