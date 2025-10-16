import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDocs,
  query,
  orderBy,
  where,
  Timestamp,
  Firestore,
} from "firebase/firestore"
import { ref, uploadBytes, getDownloadURL, deleteObject, FirebaseStorage } from "firebase/storage"
import { db, storage } from "./firebase"

// Utility function to ensure db is available
function ensureDb(): Firestore {
  if (!db) {
    throw new Error("Firebase Firestore is not initialized. Please check your Firebase configuration.")
  }
  return db
}

// Utility function to ensure storage is available
function ensureStorage(): FirebaseStorage {
  if (!storage) {
    throw new Error("Firebase Storage is not initialized. Please check your Firebase configuration.")
  }
  return storage
}

// Match operations
export interface Match {
  id?: string
  player1: string
  player2: string
  score: string
  date: Date
  tournament: string
  status: "upcoming" | "completed" | "live"
  court?: string
  createdAt: Date
  live_link?: string
}

export const matchOperations = {
  async create(match: Omit<Match, "id" | "createdAt">) {
    const database = ensureDb()
    const docRef = await addDoc(collection(database, "matches"), {
      ...match,
      createdAt: Timestamp.now(),
      date: Timestamp.fromDate(match.date),
    })
    return docRef.id
  },

  async getAll() {
    const database = ensureDb()
    const q = query(collection(database, "matches"), orderBy("date", "desc"))
    const snapshot = await getDocs(q)
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      date: doc.data().date.toDate(),
      createdAt: doc.data().createdAt.toDate(),
    })) as Match[]
  },

  async update(id: string, match: Partial<Match>) {
    const database = ensureDb()
    const docRef = doc(database, "matches", id)
    const updateData: any = { ...match }
    if (match.date) {
      updateData.date = Timestamp.fromDate(match.date)
    }
    await updateDoc(docRef, updateData)
  },

  async delete(id: string) {
    const database = ensureDb()
    await deleteDoc(doc(database, "matches", id))
  },
}

// Player Profile operations
export interface PlayerProfile {
  id?: string
  name: string
  age: number
  ranking?: number | null
  achievements: string[]
  bio: string
  imageUrl?: string
  category: "junior" | "senior" | "veteran"
  // Tennis Statistics (optional for backwards compatibility)
  matchesPlayed?: number
  matchesWon?: number
  winPercentage?: number
  setsWon?: number
  setsLost?: number
  gamesWon?: number
  gamesLost?: number
  currentStreak?: number
  longestStreak?: number
  points?: number
  // Performance Stats (optional for backwards compatibility)
  servingPercentage?: number
  acesServed?: number
  doubleFaults?: number
  breakPointsSaved?: number
  breakPointsConverted?: number
  createdAt: Date
}

export const profileOperations = {
  async create(profile: Omit<PlayerProfile, "id" | "createdAt">) {
    const database = ensureDb()
    
    // Ensure all required tennis statistics have default values and remove undefined values
    const cleanProfile: any = {
      name: profile.name,
      age: profile.age,
      achievements: profile.achievements || [],
      bio: profile.bio,
      category: profile.category,
      matchesPlayed: profile.matchesPlayed ?? 0,
      matchesWon: profile.matchesWon ?? 0,
      winPercentage: profile.winPercentage ?? 0,
      setsWon: profile.setsWon ?? 0,
      setsLost: profile.setsLost ?? 0,
      gamesWon: profile.gamesWon ?? 0,
      gamesLost: profile.gamesLost ?? 0,
      currentStreak: profile.currentStreak ?? 0,
      longestStreak: profile.longestStreak ?? 0,
      points: profile.points ?? 0,
      servingPercentage: profile.servingPercentage ?? 0,
      acesServed: profile.acesServed ?? 0,
      doubleFaults: profile.doubleFaults ?? 0,
      breakPointsSaved: profile.breakPointsSaved ?? 0,
      breakPointsConverted: profile.breakPointsConverted ?? 0,
      createdAt: Timestamp.now(),
    }

    // Only add optional fields if they have valid values
    if (profile.ranking && profile.ranking > 0) {
      cleanProfile.ranking = profile.ranking
    }

    if (profile.imageUrl) {
      cleanProfile.imageUrl = profile.imageUrl
    }
    
    console.log("Creating profile with cleaned data:", cleanProfile)
    
    const docRef = await addDoc(collection(database, "profiles"), cleanProfile)
    console.log("Profile created successfully with ID:", docRef.id)
    return docRef.id
  },

  async getAll() {
    const database = ensureDb()
    const q = query(collection(database, "profiles"), orderBy("createdAt", "desc"))
    const snapshot = await getDocs(q)
    return snapshot.docs.map((doc) => {
      const data = doc.data()
      return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt.toDate(),
        // Provide default values for tennis statistics if missing
        matchesPlayed: data.matchesPlayed ?? 0,
        matchesWon: data.matchesWon ?? 0,
        winPercentage: data.winPercentage ?? 0,
        setsWon: data.setsWon ?? 0,
        setsLost: data.setsLost ?? 0,
        gamesWon: data.gamesWon ?? 0,
        gamesLost: data.gamesLost ?? 0,
        currentStreak: data.currentStreak ?? 0,
        longestStreak: data.longestStreak ?? 0,
        points: data.points ?? 0,
        servingPercentage: data.servingPercentage ?? 0,
        acesServed: data.acesServed ?? 0,
        doubleFaults: data.doubleFaults ?? 0,
        breakPointsSaved: data.breakPointsSaved ?? 0,
        breakPointsConverted: data.breakPointsConverted ?? 0,
      }
    }) as PlayerProfile[]
  },

  async update(id: string, profile: Partial<PlayerProfile>) {
    const database = ensureDb()
    const docRef = doc(database, "profiles", id)
    await updateDoc(docRef, profile)
  },

  async delete(id: string) {
    const database = ensureDb()
    await deleteDoc(doc(database, "profiles", id))
  },
}

// Gallery operations
export interface GalleryItem {
  id?: string
  title: string
  description: string
  imageUrl: string
  category: "tournament" | "training" | "events" | "facilities"
  createdAt: Date
}

export const galleryOperations = {
  async create(item: Omit<GalleryItem, "id" | "createdAt">) {
    const database = ensureDb()
    const docRef = await addDoc(collection(database, "gallery"), {
      ...item,
      createdAt: Timestamp.now(),
    })
    return docRef.id
  },

  async getAll() {
    const database = ensureDb()
    const q = query(collection(database, "gallery"), orderBy("createdAt", "desc"))
    const snapshot = await getDocs(q)
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt.toDate(),
    })) as GalleryItem[]
  },

  async update(id: string, item: Partial<GalleryItem>) {
    const database = ensureDb()
    const docRef = doc(database, "gallery", id)
    await updateDoc(docRef, item)
  },

  async delete(id: string) {
    const database = ensureDb()
    await deleteDoc(doc(database, "gallery", id))
  },
}

// News operations
export interface NewsArticle {
  id?: string
  title: string
  content: string
  excerpt: string
  imageUrl?: string
  category: "tournament" | "club" | "player" | "general"
  published: boolean
  createdAt: Date
}

export const newsOperations = {
  async create(article: Omit<NewsArticle, "id" | "createdAt">) {
    const database = ensureDb()
    const docRef = await addDoc(collection(database, "news"), {
      ...article,
      createdAt: Timestamp.now(),
    })
    return docRef.id
  },

  async getAll() {
    const database = ensureDb()
    const q = query(collection(database, "news"), orderBy("createdAt", "desc"))
    const snapshot = await getDocs(q)
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt.toDate(),
    })) as NewsArticle[]
  },

  async getPublished() {
    const database = ensureDb()
    console.log("[News Operations] Fetching published articles...")
    
    // First, let's get all articles to see what we have
    const allQuery = query(collection(database, "news"), orderBy("createdAt", "desc"))
    const allSnapshot = await getDocs(allQuery)
    const allArticles = allSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt.toDate(),
    })) as NewsArticle[]
    
    console.log("[News Operations] All articles:", allArticles)
    console.log("[News Operations] Published status of articles:", allArticles.map(a => ({ title: a.title, published: a.published })))
    
    // Now get only published ones
    const q = query(collection(database, "news"), where("published", "==", true))
    const snapshot = await getDocs(q)
    const articles = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt.toDate(),
    })) as NewsArticle[]

    console.log("[News Operations] Published articles:", articles)
    
    // Sort in memory instead of using compound index
    return articles.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
  },

  async update(id: string, article: Partial<NewsArticle>) {
    const database = ensureDb()
    const docRef = doc(database, "news", id)
    await updateDoc(docRef, article)
  },

  async delete(id: string) {
    const database = ensureDb()
    await deleteDoc(doc(database, "news", id))
  },
}

// Event operations
export interface Event {
  id?: string
  title: string
  description: string
  date: Date
  location: string
  category: "tournament" | "training" | "social" | "maintenance"
  registrationRequired: boolean
  maxParticipants?: number
  createdAt: Date
}

export const eventOperations = {
  async create(event: Omit<Event, "id" | "createdAt">) {
    const database = ensureDb()
    const docRef = await addDoc(collection(database, "events"), {
      ...event,
      date: Timestamp.fromDate(event.date),
      createdAt: Timestamp.now(),
    })
    return docRef.id
  },

  async getAll() {
    const database = ensureDb()
    const q = query(collection(database, "events"), orderBy("date", "asc"))
    const snapshot = await getDocs(q)
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      date: doc.data().date.toDate(),
      createdAt: doc.data().createdAt.toDate(),
    })) as Event[]
  },

  async update(id: string, event: Partial<Event>) {
    const database = ensureDb()
    const docRef = doc(database, "events", id)
    const updateData: any = { ...event }
    if (event.date) {
      updateData.date = Timestamp.fromDate(event.date)
    }
    await updateDoc(docRef, updateData)
  },

  async delete(id: string) {
    const database = ensureDb()
    await deleteDoc(doc(database, "events", id))
  },
}

// File upload operations (Base64 with automatic compression)
export const uploadOperations = {
  async uploadVideo(file: File, path: string): Promise<string> {
    try {
      const firebaseStorage = ensureStorage()
      console.log("[v0] Starting video upload:", file.name)
      console.log("[v0] File size:", (file.size / 1024 / 1024).toFixed(2), "MB")

      // Validate file type
      if (!file.type.startsWith('video/')) {
        throw new Error("Only video files are allowed.")
      }

      // Check file size (limit to 100MB)
      const maxSize = 100 * 1024 * 1024 // 100MB
      if (file.size > maxSize) {
        throw new Error("Video file is too large. Maximum size is 100MB.")
      }

      // Create a unique filename
      const timestamp = Date.now()
      const filename = `${timestamp}_${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`
      const fullPath = `${path}/${filename}`

      // Upload to Firebase Storage
      const storageRef = ref(firebaseStorage, fullPath)
      const snapshot = await uploadBytes(storageRef, file)
      
      // Get download URL
      const downloadURL = await getDownloadURL(snapshot.ref)
      
      console.log("[v0] Video upload successful:", downloadURL)
      return downloadURL

    } catch (error: any) {
      console.error("[v0] Video upload error:", error)
      throw new Error(`❌ Video upload failed: ${error.message}`)
    }
  },

  async uploadImage(file: File, path: string): Promise<string> {
    try {
      console.log("[v0] Starting image upload:", file.name)
      console.log("[v0] Original file size:", (file.size / 1024 / 1024).toFixed(2), "MB")
      console.log("[v0] Upload path:", path)

      // Validate file type
      if (!file.type.startsWith('image/')) {
        throw new Error("Only image files are allowed.")
      }

      // Compress image if it's too large
      const compressedFile = await this.compressImage(file)
      console.log("[v0] Compressed file size:", (compressedFile.size / 1024 / 1024).toFixed(2), "MB")

      // Convert to base64
      const base64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = () => resolve(reader.result as string)
        reader.onerror = reject
        reader.readAsDataURL(compressedFile)
      })

      console.log("[v0] Base64 conversion successful")
      return base64

    } catch (error: any) {
      console.error("[v0] Upload error:", error)
      throw new Error(`❌ Upload failed: ${error.message}`)
    }
  },

  async compressImage(file: File): Promise<File> {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      const img = new Image()

      img.onload = () => {
        try {
          // Calculate new dimensions (max 800px width/height)
          const maxSize = 800
          let { width, height } = img
          
          if (width > height) {
            if (width > maxSize) {
              height = (height * maxSize) / width
              width = maxSize
            }
          } else {
            if (height > maxSize) {
              width = (width * maxSize) / height
              height = maxSize
            }
          }

          // Set canvas dimensions
          canvas.width = width
          canvas.height = height

          // Draw and compress
          ctx?.drawImage(img, 0, 0, width, height)
          
          canvas.toBlob(
            (blob) => {
              if (blob) {
                const compressedFile = new File([blob], file.name, {
                  type: 'image/jpeg',
                  lastModified: Date.now()
                })
                resolve(compressedFile)
              } else {
                reject(new Error('Image compression failed'))
              }
            },
            'image/jpeg',
            0.7 // 70% quality
          )
        } catch (error) {
          reject(error)
        }
      }

      img.onerror = () => reject(new Error('Failed to load image'))
      img.src = URL.createObjectURL(file)
    })
  },

  async deleteImage(url: string) {
    // No deletion needed for base64 images stored in Firestore
    console.log("[v0] Base64 images don't need separate deletion")
  },
}

// Highlights operations
export interface MatchHighlight {
  id?: string
  title: string
  date: Date
  description: string
  thumbnailUrl: string
  videoUrl?: string
  youtubeUrl?: string
  imageUrls: string[]
  matchType: "tournament" | "friendly" | "training" | "championship"
  players: string[]
  score: string
  featured: boolean
  createdAt: Date
}

export const highlightsOperations = {
  async create(highlight: Omit<MatchHighlight, "id" | "createdAt">) {
    const database = ensureDb()
    const docRef = await addDoc(collection(database, "highlights"), {
      ...highlight,
      date: Timestamp.fromDate(highlight.date),
      createdAt: Timestamp.fromDate(new Date()),
    })
    return docRef.id
  },

  async getAll(): Promise<MatchHighlight[]> {
    const database = ensureDb()
    const q = query(collection(database, "highlights"), orderBy("date", "desc"))
    const querySnapshot = await getDocs(q)
    return querySnapshot.docs.map((doc) => {
      const data = doc.data()
      try {
        return {
          id: doc.id,
          title: data.title || "Untitled",
          date: data.date?.toDate ? data.date.toDate() : new Date(data.date),
          description: data.description || "",
          thumbnailUrl: data.thumbnailUrl || "/placeholder.jpg",
          videoUrl: data.videoUrl || "",
          imageUrls: data.imageUrls || [],
          matchType: data.matchType || "tournament",
          players: data.players || [],
          score: data.score || "Match",
          featured: data.featured || false,
          createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : new Date(),
        } as MatchHighlight
      } catch (error) {
        console.error("Error parsing highlight document:", doc.id, error)
        return {
          id: doc.id,
          title: data.title || "Untitled",
          date: new Date(),
          description: data.description || "",
          thumbnailUrl: "/placeholder.jpg",
          videoUrl: data.videoUrl || "",
          imageUrls: [],
          matchType: "tournament",
          players: [],
          score: "Match",
          featured: false,
          createdAt: new Date(),
        } as MatchHighlight
      }
    })
  },

  async getById(id: string): Promise<MatchHighlight | null> {
    const database = ensureDb()
    const docRef = doc(database, "highlights", id)
    const docSnap = await getDocs(query(collection(database, "highlights"), where("__name__", "==", id)))
    
    if (docSnap.empty) {
      return null
    }

    const data = docSnap.docs[0].data()
    return {
      id: docSnap.docs[0].id,
      title: data.title,
      date: data.date.toDate(),
      description: data.description,
      thumbnailUrl: data.thumbnailUrl,
      videoUrl: data.videoUrl || "",
      imageUrls: data.imageUrls || [],
      matchType: data.matchType,
      players: data.players || [],
      score: data.score,
      featured: data.featured || false,
      createdAt: data.createdAt.toDate(),
    } as MatchHighlight
  },

  async update(id: string, highlight: Partial<Omit<MatchHighlight, "id" | "createdAt">>) {
    const database = ensureDb()
    const docRef = doc(database, "highlights", id)
    const updateData: any = { ...highlight }
    
    if (highlight.date) {
      updateData.date = Timestamp.fromDate(highlight.date)
    }
    
    await updateDoc(docRef, updateData)
  },

  async delete(id: string) {
    const database = ensureDb()
    const docRef = doc(database, "highlights", id)
    await deleteDoc(docRef)
  },

  async getFeatured(): Promise<MatchHighlight[]> {
    const database = ensureDb()
    const q = query(
      collection(database, "highlights"),
      where("featured", "==", true),
      orderBy("date", "desc")
    )
    const querySnapshot = await getDocs(q)
    return querySnapshot.docs.map((doc) => {
      const data = doc.data()
      return {
        id: doc.id,
        title: data.title,
        date: data.date.toDate(),
        description: data.description,
        thumbnailUrl: data.thumbnailUrl,
        videoUrl: data.videoUrl || "",
        imageUrls: data.imageUrls || [],
        matchType: data.matchType,
        players: data.players || [],
        score: data.score,
        featured: data.featured || false,
        createdAt: data.createdAt.toDate(),
      } as MatchHighlight
    })
  },

  async getByType(matchType: string): Promise<MatchHighlight[]> {
    const database = ensureDb()
    const q = query(
      collection(database, "highlights"),
      where("matchType", "==", matchType),
      orderBy("date", "desc")
    )
    const querySnapshot = await getDocs(q)
    return querySnapshot.docs.map((doc) => {
      const data = doc.data()
      return {
        id: doc.id,
        title: data.title,
        date: data.date.toDate(),
        description: data.description,
        thumbnailUrl: data.thumbnailUrl,
        videoUrl: data.videoUrl || "",
        imageUrls: data.imageUrls || [],
        matchType: data.matchType,
        players: data.players || [],
        score: data.score,
        featured: data.featured || false,
        createdAt: data.createdAt.toDate(),
      } as MatchHighlight
    })
  },
}

// Hero Slide operations
export interface HeroSlide {
  id?: string
  title: string
  subtitle: string
  imageUrl: string
  accentColor: string
  isActive: boolean
  order: number
  createdAt: Date
  updatedAt: Date
}

export const heroOperations = {
  async create(slide: Omit<HeroSlide, "id" | "createdAt" | "updatedAt">) {
    const database = ensureDb()
    const docRef = await addDoc(collection(database, "heroSlides"), {
      ...slide,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    })
    return docRef.id
  },

  async getAll() {
    const database = ensureDb()
    try {
      // Try with ordering first
      const q = query(collection(database, "heroSlides"), orderBy("order", "asc"))
      const querySnapshot = await getDocs(q)
      return querySnapshot.docs.map((doc) => {
        const data = doc.data()
        return {
          id: doc.id,
          title: data.title,
          subtitle: data.subtitle,
          imageUrl: data.imageUrl,
          accentColor: data.accentColor,
          isActive: data.isActive,
          order: data.order || 0,
          createdAt: data.createdAt?.toDate() || new Date(),
          updatedAt: data.updatedAt?.toDate() || new Date(),
        } as HeroSlide
      })
    } catch (error) {
      console.log("Falling back to simple query without ordering...")
      // Fallback to simple query without ordering if index doesn't exist
      const querySnapshot = await getDocs(collection(database, "heroSlides"))
      return querySnapshot.docs.map((doc) => {
        const data = doc.data()
        return {
          id: doc.id,
          title: data.title,
          subtitle: data.subtitle,
          imageUrl: data.imageUrl,
          accentColor: data.accentColor,
          isActive: data.isActive,
          order: data.order || 0,
          createdAt: data.createdAt?.toDate() || new Date(),
          updatedAt: data.updatedAt?.toDate() || new Date(),
        } as HeroSlide
      }).sort((a, b) => a.order - b.order) // Sort on client-side
    }
  },

  async getActive() {
    const database = ensureDb()
    const q = query(
      collection(database, "heroSlides"), 
      where("isActive", "==", true),
      orderBy("order", "asc")
    )
    const querySnapshot = await getDocs(q)
    return querySnapshot.docs.map((doc) => {
      const data = doc.data()
      return {
        id: doc.id,
        title: data.title,
        subtitle: data.subtitle,
        imageUrl: data.imageUrl,
        accentColor: data.accentColor,
        isActive: data.isActive,
        order: data.order,
        createdAt: data.createdAt.toDate(),
        updatedAt: data.updatedAt.toDate(),
      } as HeroSlide
    })
  },

  async update(id: string, updates: Partial<Omit<HeroSlide, "id" | "createdAt">>) {
    const database = ensureDb()
    await updateDoc(doc(database, "heroSlides", id), {
      ...updates,
      updatedAt: Timestamp.now(),
    })
  },

  async delete(id: string) {
    const database = ensureDb()
    await deleteDoc(doc(database, "heroSlides", id))
  },

  async uploadImage(file: File, fileName: string): Promise<string> {
    const firebaseStorage = ensureStorage()
    const storageRef = ref(firebaseStorage, `hero-slides/${fileName}`)
    await uploadBytes(storageRef, file)
    return await getDownloadURL(storageRef)
  },
}