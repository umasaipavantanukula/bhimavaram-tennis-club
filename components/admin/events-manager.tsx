// "use client"

// import type React from "react"

// import { useState, useEffect } from "react"
// import { Button } from "@/components/ui/button"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { Textarea } from "@/components/ui/textarea"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import { Badge } from "@/components/ui/badge"
// import { Switch } from "@/components/ui/switch"
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from "@/components/ui/dialog"
// import { Plus, Edit, Trash2, Calendar, MapPin } from "lucide-react"
// import { eventOperations, type Event } from "@/lib/firebase-operations"
// import { useToast } from "@/hooks/use-toast"

// export function EventsManager() {
//   const [events, setEvents] = useState<Event[]>([])
//   const [loading, setLoading] = useState(true)
//   const [dialogOpen, setDialogOpen] = useState(false)
//   const [editingEvent, setEditingEvent] = useState<Event | null>(null)
//   const { toast } = useToast()

//   const [formData, setFormData] = useState({
//     title: "",
//     description: "",
//     date: "",
//     location: "",
//     category: "tournament" as const,
//     registrationRequired: false,
//     maxParticipants: "",
//   })

//   useEffect(() => {
//     loadEvents()
//   }, [])

//   const loadEvents = async () => {
//     try {
//       const data = await eventOperations.getAll()
//       setEvents(data)
//     } catch (error) {
//       toast({
//         title: "Error",
//         description: "Failed to load events",
//         variant: "destructive",
//       })
//     } finally {
//       setLoading(false)
//     }
//   }

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault()
//     try {
//       const eventData = {
//         title: formData.title,
//         description: formData.description,
//         date: new Date(formData.date),
//         location: formData.location,
//         category: formData.category,
//         registrationRequired: formData.registrationRequired,
//         maxParticipants: formData.maxParticipants ? Number.parseInt(formData.maxParticipants) : undefined,
//       }

//       if (editingEvent) {
//         await eventOperations.update(editingEvent.id!, eventData)
//         toast({
//           title: "Success",
//           description: "Event updated successfully",
//         })
//       } else {
//         await eventOperations.create(eventData)
//         toast({
//           title: "Success",
//           description: "Event created successfully",
//         })
//       }

//       setDialogOpen(false)
//       resetForm()
//       loadEvents()
//     } catch (error) {
//       toast({
//         title: "Error",
//         description: "Failed to save event",
//         variant: "destructive",
//       })
//     }
//   }

//   const handleEdit = (event: Event) => {
//     setEditingEvent(event)
//     setFormData({
//       title: event.title,
//       description: event.description,
//       date: event.date.toISOString().split("T")[0],
//       location: event.location,
//       category: event.category,
//       registrationRequired: event.registrationRequired,
//       maxParticipants: event.maxParticipants?.toString() || "",
//     })
//     setDialogOpen(true)
//   }

//   const handleDelete = async (id: string) => {
//     if (confirm("Are you sure you want to delete this event?")) {
//       try {
//         await eventOperations.delete(id)
//         toast({
//           title: "Success",
//           description: "Event deleted successfully",
//         })
//         loadEvents()
//       } catch (error) {
//         toast({
//           title: "Error",
//           description: "Failed to delete event",
//           variant: "destructive",
//         })
//       }
//     }
//   }

//   const resetForm = () => {
//     setFormData({
//       title: "",
//       description: "",
//       date: "",
//       location: "",
//       category: "tournament",
//       registrationRequired: false,
//       maxParticipants: "",
//     })
//     setEditingEvent(null)
//   }

//   const getCategoryBadge = (category: string) => {
//     const variants = {
//       tournament: "default",
//       training: "secondary",
//       social: "outline",
//       maintenance: "destructive",
//     } as const
//     return <Badge variant={variants[category as keyof typeof variants]}>{category}</Badge>
//   }

//   if (loading) {
//     return <div className="flex justify-center p-8">Loading events...</div>
//   }

//   return (
//     <div className="space-y-6">
//       <div className="flex justify-between items-center">
//         <div>
//           <h2 className="text-2xl font-bold">Events Management</h2>
//           <p className="text-muted-foreground">Manage club events and activities</p>
//         </div>
//         <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
//           <DialogTrigger asChild>
//             <Button onClick={resetForm}>
//               <Plus className="h-4 w-4 mr-2" />
//               Add Event
//             </Button>
//           </DialogTrigger>
//           <DialogContent className="w-[95vw] sm:w-full max-w-md">
//             <DialogHeader>
//               <DialogTitle>{editingEvent ? "Edit Event" : "Add New Event"}</DialogTitle>
//               <DialogDescription>{editingEvent ? "Update event details" : "Create a new club event"}</DialogDescription>
//             </DialogHeader>
//             <form onSubmit={handleSubmit} className="space-y-4">
//               <div>
//                 <Label htmlFor="title">Title</Label>
//                 <Input
//                   id="title"
//                   value={formData.title}
//                   onChange={(e) => setFormData({ ...formData, title: e.target.value })}
//                   required
//                 />
//               </div>
//               <div>
//                 <Label htmlFor="description">Description</Label>
//                 <Textarea
//                   id="description"
//                   value={formData.description}
//                   onChange={(e) => setFormData({ ...formData, description: e.target.value })}
//                   rows={3}
//                   required
//                 />
//               </div>
//               <div className="grid grid-cols-2 gap-4">
//                 <div>
//                   <Label htmlFor="date">Date</Label>
//                   <Input
//                     id="date"
//                     type="date"
//                     value={formData.date}
//                     onChange={(e) => setFormData({ ...formData, date: e.target.value })}
//                     required
//                   />
//                 </div>
//                 <div>
//                   <Label htmlFor="category">Category</Label>
//                   <Select
//                     value={formData.category}
//                     onValueChange={(value: any) => setFormData({ ...formData, category: value })}
//                   >
//                     <SelectTrigger>
//                       <SelectValue />
//                     </SelectTrigger>
//                     <SelectContent>
//                       <SelectItem value="tournament">Tournament</SelectItem>
//                       <SelectItem value="training">Training</SelectItem>
//                       <SelectItem value="social">Social</SelectItem>
//                       <SelectItem value="maintenance">Maintenance</SelectItem>
//                     </SelectContent>
//                   </Select>
//                 </div>
//               </div>
//               <div>
//                 <Label htmlFor="location">Location</Label>
//                 <Input
//                   id="location"
//                   value={formData.location}
//                   onChange={(e) => setFormData({ ...formData, location: e.target.value })}
//                   placeholder="Court 1, Clubhouse, etc."
//                   required
//                 />
//               </div>
//               <div className="flex items-center space-x-2">
//                 <Switch
//                   id="registration"
//                   checked={formData.registrationRequired}
//                   onCheckedChange={(checked) => setFormData({ ...formData, registrationRequired: checked })}
//                 />
//                 <Label htmlFor="registration">Registration Required</Label>
//               </div>
//               {formData.registrationRequired && (
//                 <div>
//                   <Label htmlFor="maxParticipants">Max Participants (Optional)</Label>
//                   <Input
//                     id="maxParticipants"
//                     type="number"
//                     value={formData.maxParticipants}
//                     onChange={(e) => setFormData({ ...formData, maxParticipants: e.target.value })}
//                     placeholder="Leave empty for unlimited"
//                   />
//                 </div>
//               )}
//               <div className="flex gap-2 pt-4">
//                 <Button type="submit" className="flex-1">
//                   {editingEvent ? "Update" : "Create"} Event
//                 </Button>
//                 <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
//                   Cancel
//                 </Button>
//               </div>
//             </form>
//           </DialogContent>
//         </Dialog>
//       </div>

//       <div className="grid gap-6">
//         {events.map((event) => (
//           <Card key={event.id} className="group hover:shadow-lg transition-all duration-300">
//             <CardHeader>
//               <div className="flex items-start justify-between">
//                 <div className="flex-1">
//                   <div className="flex items-center gap-2 mb-2">
//                     {getCategoryBadge(event.category)}
//                     {event.registrationRequired && <Badge variant="outline">Registration Required</Badge>}
//                   </div>
//                   <CardTitle className="group-hover:text-primary transition-colors">{event.title}</CardTitle>
//                   <CardDescription className="mt-2">{event.description}</CardDescription>
//                   <div className="flex items-center gap-4 mt-3 text-sm text-muted-foreground">
//                     <div className="flex items-center gap-1">
//                       <Calendar className="h-4 w-4" />
//                       {event.date.toLocaleDateString()}
//                     </div>
//                     <div className="flex items-center gap-1">
//                       <MapPin className="h-4 w-4" />
//                       {event.location}
//                     </div>
//                     {event.maxParticipants && <div>Max: {event.maxParticipants} participants</div>}
//                   </div>
//                 </div>
//               </div>
//             </CardHeader>
//             <CardContent>
//               <div className="flex gap-2">
//                 <Button variant="outline" size="sm" className="flex-1 bg-transparent" onClick={() => handleEdit(event)}>
//                   <Edit className="h-4 w-4 mr-2" />
//                   Edit
//                 </Button>
//                 <Button variant="outline" size="sm" onClick={() => handleDelete(event.id!)}>
//                   <Trash2 className="h-4 w-4" />
//                 </Button>
//               </div>
//             </CardContent>
//           </Card>
//         ))}
//       </div>

//       {events.length === 0 && (
//         <Card>
//           <CardContent className="text-center py-12">
//             <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
//             <h3 className="text-lg font-semibold mb-2">No events yet</h3>
//             <p className="text-muted-foreground mb-4">Create your first event to get started</p>
//             <Button onClick={() => setDialogOpen(true)}>
//               <Plus className="h-4 w-4 mr-2" />
//               Add First Event
//             </Button>
//           </CardContent>
//         </Card>
//       )}
//     </div>
//   )
// }

// Placeholder component since the main EventsManager is commented out
export default function EventsManager() {
  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Events Manager</h2>
      <p>Events management functionality is currently disabled.</p>
    </div>
  )
}
