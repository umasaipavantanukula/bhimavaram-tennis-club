"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Upload, Trash2, Edit, Eye, EyeOff, Save, X, Image as ImageIcon } from "lucide-react"
import { heroOperations, type HeroSlide } from "@/lib/firebase-operations"
import { base64Upload } from "@/lib/base64-upload"

export function HeroManager() {
  const [slides, setSlides] = useState<HeroSlide[]>([])
  const [loading, setLoading] = useState(true)
  const [editingSlide, setEditingSlide] = useState<HeroSlide | null>(null)
  const [isCreating, setIsCreating] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

  // Form state
  const [formData, setFormData] = useState({
    imageUrl: "",
    accentColor: "from-blue-400 to-purple-400",
    isActive: true,
    order: 1,
    title: "Master Your Game",
    subtitle: "Professional Training"
  })
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)

  const accentColorOptions = [
    { value: "from-blue-400 to-purple-400", label: "Blue to Purple", preview: "bg-gradient-to-r from-blue-400 to-purple-400" },
    { value: "from-emerald-400 to-teal-400", label: "Emerald to Teal", preview: "bg-gradient-to-r from-emerald-400 to-teal-400" },
    { value: "from-amber-400 to-orange-400", label: "Amber to Orange", preview: "bg-gradient-to-r from-amber-400 to-orange-400" },
    { value: "from-pink-400 to-rose-400", label: "Pink to Rose", preview: "bg-gradient-to-r from-pink-400 to-rose-400" },
    { value: "from-violet-400 to-purple-400", label: "Violet to Purple", preview: "bg-gradient-to-r from-violet-400 to-purple-400" },
    { value: "from-cyan-400 to-blue-400", label: "Cyan to Blue", preview: "bg-gradient-to-r from-cyan-400 to-blue-400" }
  ]

  useEffect(() => {
    loadSlides()
  }, [])

  const loadSlides = async () => {
    try {
      const slidesData = await heroOperations.getAll()
      setSlides(slidesData)
    } catch (error) {
      console.error("Error loading slides:", error)
      setMessage({ type: 'error', text: 'Failed to load hero slides' })
    } finally {
      setLoading(false)
    }
  }

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        setMessage({ type: 'error', text: 'File size must be less than 5MB' })
        return
      }
      if (!file.type.startsWith('image/')) {
        setMessage({ type: 'error', text: 'Please select an image file' })
        return
      }
      setSelectedFile(file)
      const reader = new FileReader()
      reader.onload = (e) => setPreviewUrl(e.target?.result as string)
      reader.readAsDataURL(file)
    }
  }

  const uploadSelectedFile = async (): Promise<string | null> => {
    if (!selectedFile) return null
    
    try {
      setUploading(true)
      setMessage({ type: 'success', text: `Processing image (${(selectedFile.size / 1024).toFixed(1)}KB)...` })
      
      const imageUrl = await base64Upload.uploadImage(selectedFile, 'hero-slides')
      setMessage({ type: 'success', text: 'Image processed successfully!' })
      return imageUrl
    } catch (error: any) {
      console.error("Error uploading image:", error)
      setMessage({ 
        type: 'error', 
        text: error.message || 'Failed to upload image. Please try a smaller image.' 
      })
      return null
    } finally {
      setUploading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.imageUrl && !selectedFile) {
      setMessage({ type: 'error', text: 'Please select an image' })
      return
    }

    try {
      setUploading(true)
      let imageUrl = formData.imageUrl

      // Upload new image if selected
      if (selectedFile) {
        const uploadedUrl = await uploadSelectedFile()
        if (!uploadedUrl) return
        imageUrl = uploadedUrl
      }

      if (!imageUrl) {
        setMessage({ type: 'error', text: 'Please select an image' })
        return
      }

      const slideData = {
        ...formData,
        imageUrl,
        title: formData.title,
        subtitle: formData.subtitle
      }

      if (editingSlide) {
        await heroOperations.update(editingSlide.id!, slideData)
        setMessage({ type: 'success', text: 'Hero slide updated successfully!' })
      } else {
        await heroOperations.create(slideData)
        setMessage({ type: 'success', text: 'Hero slide created successfully!' })
      }

      await loadSlides()
      resetForm()
      
      // Trigger hero section refresh
      localStorage.setItem('heroSlidesUpdated', Date.now().toString())
      window.dispatchEvent(new StorageEvent('storage', { key: 'heroSlidesUpdated' }))
    } catch (error) {
      console.error("Error saving slide:", error)
      setMessage({ type: 'error', text: 'Failed to save hero slide' })
    } finally {
      setUploading(false)
    }
  }

  const handleEdit = (slide: HeroSlide) => {
    setEditingSlide(slide)
    setFormData({
      imageUrl: slide.imageUrl,
      accentColor: slide.accentColor,
      isActive: slide.isActive,
      order: slide.order,
      title: slide.title || "Master Your Game",
      subtitle: slide.subtitle || "Professional Training"
    })
    setPreviewUrl(slide.imageUrl)
    setIsCreating(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this hero slide?')) return

    try {
      await heroOperations.delete(id)
      setMessage({ type: 'success', text: 'Hero slide deleted successfully' })
      await loadSlides()
      
      // Trigger hero section refresh
      localStorage.setItem('heroSlidesUpdated', Date.now().toString())
      window.dispatchEvent(new StorageEvent('storage', { key: 'heroSlidesUpdated' }))
    } catch (error) {
      console.error("Error deleting slide:", error)
      setMessage({ type: 'error', text: 'Failed to delete hero slide' })
    }
  }

  const toggleActive = async (slide: HeroSlide) => {
    try {
      await heroOperations.update(slide.id!, { isActive: !slide.isActive })
      await loadSlides()
      setMessage({ type: 'success', text: `Hero slide ${slide.isActive ? 'deactivated' : 'activated'}!` })
    } catch (error) {
      console.error("Error toggling slide status:", error)
      setMessage({ type: 'error', text: 'Failed to update slide status' })
    }
  }

  const resetForm = () => {
    setFormData({
      imageUrl: "",
      accentColor: "from-blue-400 to-purple-400",
      isActive: true,
      order: slides.length + 1,
      title: "Master Your Game",
      subtitle: "Professional Training"
    })
    setSelectedFile(null)
    setPreviewUrl(null)
    setEditingSlide(null)
    setIsCreating(false)
  }

  const clearMessage = () => setMessage(null)

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">Loading hero slides...</div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {message && (
        <Alert className={message.type === 'error' ? 'border-red-200 bg-red-50' : 'border-green-200 bg-green-50'}>
          <AlertDescription className="flex items-center justify-between">
            <span className={message.type === 'error' ? 'text-red-800' : 'text-green-800'}>
              {message.text}
            </span>
            <Button variant="ghost" size="sm" onClick={clearMessage}>
              <X className="h-4 w-4" />
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {/* Create/Edit Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <ImageIcon className="h-5 w-5" />
              {editingSlide ? 'Edit Hero Slide' : 'Create New Hero Slide'}
            </span>
            {!isCreating && (
              <Button onClick={() => setIsCreating(true)}>
                <Upload className="h-4 w-4 mr-2" />
                Add New Slide
              </Button>
            )}
          </CardTitle>
        </CardHeader>

        {isCreating && (
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <Label htmlFor="title">Hero Main Text</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={e => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Master Your Game"
                />
                <Label htmlFor="subtitle">Hero Sub Text</Label>
                <Input
                  id="subtitle"
                  value={formData.subtitle}
                  onChange={e => setFormData({ ...formData, subtitle: e.target.value })}
                  placeholder="Professional Training"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Left Column */}
                <div className="space-y-4">
                  {/* Permanent Text Display */}
                  <div className="p-4 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                    <div className="text-center">
                      <h3 className="text-lg font-semibold text-gray-700 mb-1">Permanent Text</h3>
                      <p className="text-sm text-gray-500 mb-3">This text will appear on all hero slides</p>
                      <div className="space-y-2">
                        <div className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                          Master Your Game
                        </div>
                        <div className="text-lg text-amber-500 font-medium">
                          Professional Training
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="accentColor">Accent Color</Label>
                    <Select value={formData.accentColor} onValueChange={(value) => setFormData({ ...formData, accentColor: value })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {accentColorOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            <div className="flex items-center gap-2">
                              <div className={`w-4 h-4 rounded ${option.preview}`}></div>
                              {option.label}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="isActive"
                        checked={formData.isActive}
                        onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
                      />
                      <Label htmlFor="isActive">Active</Label>
                    </div>

                    <div className="flex items-center gap-2">
                      <Label htmlFor="order">Order:</Label>
                      <Input
                        id="order"
                        type="number"
                        min="1"
                        value={formData.order}
                        onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 1 })}
                        className="w-20"
                      />
                    </div>
                  </div>
                </div>

                {/* Right Column - Image Upload */}
                <div className="space-y-4">
                  <Label>Hero Background Image *</Label>
                  
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    {previewUrl ? (
                      <div className="space-y-4">
                        <img
                          src={previewUrl}
                          alt="Preview"
                          className="w-full h-48 object-cover rounded-lg mx-auto"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => {
                            setPreviewUrl(null)
                            setSelectedFile(null)
                            setFormData({ ...formData, imageUrl: "" })
                          }}
                        >
                          Remove Image
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <Upload className="h-12 w-12 text-gray-400 mx-auto" />
                        <div>
                          <p className="text-sm text-gray-600">Click to select hero background image</p>
                          <p className="text-xs text-gray-500">PNG, JPG - Any size (will be automatically optimized)</p>
                          <p className="text-xs text-blue-500">✨ Smart compression keeps quality while reducing file size</p>
                        </div>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleFileSelect}
                          className="hidden"
                          id="image-upload"
                        />
                        <Button type="button" variant="outline" onClick={() => document.getElementById('image-upload')?.click()}>
                          Select Image
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex gap-4">
                <Button type="submit" disabled={uploading}>
                  {uploading ? (
                    <>
                      <Upload className="h-4 w-4 mr-2 animate-spin" />
                      {editingSlide ? 'Updating...' : 'Creating...'}
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      {editingSlide ? 'Update Slide' : 'Create Slide'}
                    </>
                  )}
                </Button>
                <Button type="button" variant="outline" onClick={resetForm}>
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        )}
      </Card>

      {/* Existing Slides */}
      <Card>
        <CardHeader>
          <CardTitle>Existing Hero Slides ({slides.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {slides.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No hero slides found. Create your first slide above.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {slides.map((slide) => (
                <div key={slide.id} className="border rounded-lg overflow-hidden bg-white shadow-sm">
                  <div className="relative h-32">
                    <img
                      src={slide.imageUrl}
                      alt={slide.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 right-2 flex gap-1">
                      <Badge variant={slide.isActive ? "default" : "secondary"} className="text-xs">
                        {slide.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="p-4">
                    <h3 className="font-semibold text-base mb-1 text-gray-800">Bhimavaram Tennis Club</h3>
                    <p className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">{slide.title}</p>
                    <p className="text-lg text-amber-500 font-medium">{slide.subtitle}</p>
                    <div className={`w-full h-2 rounded mb-3 bg-gradient-to-r ${slide.accentColor}`}></div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500">Order: {slide.order}</span>
                      <div className="flex gap-1">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => toggleActive(slide)}
                          className="h-8 w-8 p-0"
                        >
                          {slide.isActive ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEdit(slide)}
                          className="h-8 w-8 p-0"
                        >
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDelete(slide.id!)}
                          className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}