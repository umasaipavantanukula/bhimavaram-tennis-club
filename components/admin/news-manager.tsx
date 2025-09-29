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
import { Switch } from "@/components/ui/switch"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Plus, Edit, Trash2, Newspaper, Upload } from "lucide-react"
import { newsOperations, uploadOperations, type NewsArticle } from "@/lib/firebase-operations"
import { useToast } from "@/hooks/use-toast"

export function NewsManager() {
  const [articles, setArticles] = useState<NewsArticle[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingArticle, setEditingArticle] = useState<NewsArticle | null>(null)
  const [uploading, setUploading] = useState(false)
  const { toast } = useToast()

  const [formData, setFormData] = useState({
    title: "",
    excerpt: "",
    content: "",
    category: "general" as const,
    published: false,
    imageFile: null as File | null,
  })

  useEffect(() => {
    loadArticles()
  }, [])

  const loadArticles = async () => {
    try {
      const data = await newsOperations.getAll()
      setArticles(data)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load articles",
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

      let imageUrl = editingArticle?.imageUrl

      if (formData.imageFile) {
        imageUrl = await uploadOperations.uploadImage(formData.imageFile, "news")
      }

      const articleData = {
        title: formData.title,
        excerpt: formData.excerpt,
        content: formData.content,
        category: formData.category,
        published: formData.published,
        imageUrl,
      }

      if (editingArticle) {
        await newsOperations.update(editingArticle.id!, articleData)
        toast({
          title: "Success",
          description: "Article updated successfully",
        })
      } else {
        await newsOperations.create(articleData)
        toast({
          title: "Success",
          description: "Article created successfully",
        })
      }

      setDialogOpen(false)
      resetForm()
      loadArticles()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save article",
        variant: "destructive",
      })
    } finally {
      setUploading(false)
    }
  }

  const handleEdit = (article: NewsArticle) => {
    setEditingArticle(article)
    setFormData({
      title: article.title,
      excerpt: article.excerpt,
      content: article.content,
      category: article.category,
      published: article.published,
      imageFile: null,
    })
    setDialogOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this article?")) {
      try {
        await newsOperations.delete(id)
        toast({
          title: "Success",
          description: "Article deleted successfully",
        })
        loadArticles()
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to delete article",
          variant: "destructive",
        })
      }
    }
  }

  const resetForm = () => {
    setFormData({
      title: "",
      excerpt: "",
      content: "",
      category: "general",
      published: false,
      imageFile: null,
    })
    setEditingArticle(null)
  }

  const getCategoryBadge = (category: string) => {
    const variants = {
      tournament: "default",
      club: "secondary",
      player: "outline",
      general: "destructive",
    } as const
    return <Badge variant={variants[category as keyof typeof variants]}>{category}</Badge>
  }

  if (loading) {
    return <div className="flex justify-center p-8">Loading articles...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">News Management</h2>
          <p className="text-muted-foreground">Create and manage news articles</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="h-4 w-4 mr-2" />
              Add Article
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingArticle ? "Edit Article" : "Add New Article"}</DialogTitle>
              <DialogDescription>
                {editingArticle ? "Update article content" : "Create a new news article"}
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
                <Label htmlFor="excerpt">Excerpt</Label>
                <Textarea
                  id="excerpt"
                  value={formData.excerpt}
                  onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                  rows={2}
                  placeholder="Brief summary of the article..."
                  required
                />
              </div>
              <div>
                <Label htmlFor="content">Content</Label>
                <Textarea
                  id="content"
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  rows={8}
                  placeholder="Full article content..."
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
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
                      <SelectItem value="club">Club News</SelectItem>
                      <SelectItem value="player">Player News</SelectItem>
                      <SelectItem value="general">General</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center space-x-2 pt-6">
                  <Switch
                    id="published"
                    checked={formData.published}
                    onCheckedChange={(checked) => setFormData({ ...formData, published: checked })}
                  />
                  <Label htmlFor="published">Published</Label>
                </div>
              </div>
              <div>
                <Label htmlFor="image">Featured Image (Optional)</Label>
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
                      {editingArticle ? "Updating..." : "Creating..."}
                    </>
                  ) : (
                    <>{editingArticle ? "Update" : "Create"} Article</>
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

      <div className="grid gap-6">
        {articles.map((article) => (
          <Card key={article.id} className="group hover:shadow-lg transition-all duration-300">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    {getCategoryBadge(article.category)}
                    <Badge variant={article.published ? "default" : "secondary"}>
                      {article.published ? "Published" : "Draft"}
                    </Badge>
                  </div>
                  <CardTitle className="group-hover:text-primary transition-colors">{article.title}</CardTitle>
                  <CardDescription className="mt-2">{article.excerpt}</CardDescription>
                  <p className="text-xs text-muted-foreground mt-2">
                    Created: {article.createdAt.toLocaleDateString()}
                  </p>
                </div>
                {article.imageUrl && (
                  <img
                    src={article.imageUrl || "/placeholder.svg"}
                    alt={article.title}
                    className="w-24 h-24 object-cover rounded-lg ml-4"
                  />
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 bg-transparent"
                  onClick={() => handleEdit(article)}
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </Button>
                <Button variant="outline" size="sm" onClick={() => handleDelete(article.id!)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {articles.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <Newspaper className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No articles yet</h3>
            <p className="text-muted-foreground mb-4">Create your first news article to get started</p>
            <Button onClick={() => setDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add First Article
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
