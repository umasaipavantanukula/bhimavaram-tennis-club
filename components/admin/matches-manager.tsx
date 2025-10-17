"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
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
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Edit, Trash2, Trophy, YoutubeIcon } from "lucide-react"
import { matchOperations, type Match } from "@/lib/firebase-operations"
import { useToast } from "@/hooks/use-toast"

export function MatchesManager() {
  const [matches, setMatches] = useState<Match[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingMatch, setEditingMatch] = useState<Match | null>(null)
  const { toast } = useToast()

  type FormData = {
    player1: string;
    player2: string;
    player1Score: string;
    player2Score: string;
    date: string;
    tournament: string;
    status: "upcoming" | "live" | "completed";
    court: string;
    live_link: string;
    score?: string;
    masterText?: string;
    trainingText?: string;
  };

  const [formData, setFormData] = useState<FormData>({
    player1: "",
    player2: "",
    player1Score: "",
    player2Score: "",
    date: "",
    tournament: "",
    status: "upcoming",
    court: "",
    live_link: "",
    score: "",
    masterText: "Master Your Game",
    trainingText: "Professional Training",
  })

  useEffect(() => {
    loadMatches()
  }, [])

  const loadMatches = async () => {
    try {
      const data = await matchOperations.getAll()
      setMatches(data)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load matches",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const matchData = {
        ...formData,
        score: `${formData.player1Score} - ${formData.player2Score}`,
        date: new Date(formData.date),
      }

      if (editingMatch) {
        await matchOperations.update(editingMatch.id!, matchData)
        toast({
          title: "Success",
          description: "Match updated successfully",
        })
      } else {
        await matchOperations.create(matchData)
        toast({
          title: "Success",
          description: "Match created successfully",
        })
      }

      setDialogOpen(false)
      resetForm()
      loadMatches()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save match",
        variant: "destructive",
      })
    }
  }

  const handleEdit = (match: Match) => {
    setEditingMatch(match)
    const [player1Score, player2Score] = (match.score || "").split(" - ")
    setFormData({
      player1: match.player1,
      player2: match.player2,
      player1Score: player1Score || "",
      player2Score: player2Score || "",
      date: match.date.toISOString().split("T")[0],
      tournament: match.tournament,
      status: match.status,
      court: match.court || "",
      live_link: match.live_link || "",
    })
    setDialogOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this match?")) {
      try {
        await matchOperations.delete(id)
        toast({
          title: "Success",
          description: "Match deleted successfully",
        })
        loadMatches()
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to delete match",
          variant: "destructive",
        })
      }
    }
  }

  const resetForm = () => {
    setFormData({
      player1: "",
      player2: "",
      player1Score: "",
      player2Score: "",
      date: "",
      tournament: "",
      status: "upcoming",
      court: "",
      live_link: "",
    })
    setEditingMatch(null)
  }

  const getStatusBadge = (status: string) => {
    const variants = {
      upcoming: "secondary",
      live: "default",
      completed: "outline",
    } as const
    return <Badge variant={variants[status as keyof typeof variants]}>{status}</Badge>
  }

  if (loading) {
    return <div className="flex justify-center p-8">Loading matches...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Matches Management</h2>
          <p className="text-muted-foreground">Manage tournament matches and scores</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="h-4 w-4 mr-2" />
              Add Match
            </Button>
          </DialogTrigger>
          <DialogContent className="w-[95vw] sm:w-full max-w-md">
            <DialogHeader>
              <DialogTitle>{editingMatch ? "Edit Match" : "Add New Match"}</DialogTitle>
              <DialogDescription>
                {editingMatch ? "Update match details" : "Create a new match entry"}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Hero Section Dynamic Text Fields */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="masterText">Hero Master Text</Label>
                  <Input
                    id="masterText"
                    value={formData.masterText}
                    onChange={(e) => setFormData({ ...formData, masterText: e.target.value })}
                    placeholder="Master Your Game"
                  />
                </div>
                <div>
                  <Label htmlFor="trainingText">Hero Training Text</Label>
                  <Input
                    id="trainingText"
                    value={formData.trainingText}
                    onChange={(e) => setFormData({ ...formData, trainingText: e.target.value })}
                    placeholder="Professional Training"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="player1">Player 1</Label>
                  <Input
                    id="player1"
                    value={formData.player1}
                    onChange={(e) => setFormData({ ...formData, player1: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="player2">Player 2</Label>
                  <Input
                    id="player2"
                    value={formData.player2}
                    onChange={(e) => setFormData({ ...formData, player2: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="live_link">Live Link (YouTube Embed URL)</Label>
                <Input
                  id="live_link"
                  value={formData.live_link}
                  onChange={(e) => setFormData({ ...formData, live_link: e.target.value })}
                  placeholder="https://www.youtube.com/embed/live_id"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="player1Score">Player 1 Score</Label>
                  <Input
                    id="player1Score"
                    value={formData.player1Score}
                    onChange={(e) => setFormData({ ...formData, player1Score: e.target.value })}
                    placeholder="e.g. 6"
                  />
                </div>
                <div>
                  <Label htmlFor="player2Score">Player 2 Score</Label>
                  <Input
                    id="player2Score"
                    value={formData.player2Score}
                    onChange={(e) => setFormData({ ...formData, player2Score: e.target.value })}
                    placeholder="e.g. 4"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="tournament">Tournament</Label>
                <Input
                  id="tournament"
                  value={formData.tournament}
                  onChange={(e) => setFormData({ ...formData, tournament: e.target.value })}
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="date">Date</Label>
                  <Input
                    id="date"
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="court">Court</Label>
                  <Input
                    id="court"
                    value={formData.court}
                    onChange={(e) => setFormData({ ...formData, court: e.target.value })}
                    placeholder="Court 1"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="score">Score</Label>
                  <Input
                    id="score"
                    value={formData.score}
                    onChange={(e) => setFormData({ ...formData, score: e.target.value })}
                    placeholder="6-4, 6-2"
                  />
                </div>
                <div>
                  <Label htmlFor="status">Status</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value: any) => setFormData({ ...formData, status: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="upcoming">Upcoming</SelectItem>
                      <SelectItem value="live">Live</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex gap-2 pt-4">
                <Button type="submit" className="flex-1">
                  {editingMatch ? "Update" : "Create"} Match
                </Button>
                <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5" />
            All Matches
          </CardTitle>
          <CardDescription>{matches.length} total matches</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Players</TableHead>
                <TableHead>Tournament</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Score</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {matches.map((match) => (
                <TableRow key={match.id}>
                  <TableCell className="font-medium">
                    <div className="flex flex-col">
                      <span className="flex items-center gap-2">
                        <span className="font-semibold">{match.player1}</span>
                      </span>
                      <span className="flex items-center gap-2 mt-1">
                        <span className="font-semibold">{match.player2}</span>
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>{match.tournament}</TableCell>
                  <TableCell>{match.date.toLocaleDateString()}</TableCell>
                  <TableCell>
                    {match.score ? (
                      match.score.includes(" - ") ? (
                        <>
                          <span className="font-bold text-green-700">{(match.score || "").split(" - ")[0]}</span>
                          <span className="mx-1 text-gray-500">vs</span>
                          <span className="font-bold text-green-700">{(match.score || "").split(" - ")[1]}</span>
                        </>
                      ) : (
                        <span className="font-bold">{match.score}</span>
                      )
                    ) : (
                      <span className="text-gray-500">TBD</span>
                    )}
                  </TableCell>
                  <TableCell>{getStatusBadge(match.status)}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => handleEdit(match)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleDelete(match.id!)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
