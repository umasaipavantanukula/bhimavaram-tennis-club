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
  ranking?: number
  achievements: string[]
  bio: string
  imageUrl?: string
  category: "junior" | "senior" | "veteran"
  createdAt: Date
}

export const profileOperations = {
  async create(profile: Omit<PlayerProfile, "id" | "createdAt">) {
    const database = ensureDb()
    const docRef = await addDoc(collection(database, "profiles"), {
      ...profile,
      createdAt: Timestamp.now(),
    })
    return docRef.id
  },

  async getAll() {
    const database = ensureDb()
    const q = query(collection(database, "profiles"), orderBy("createdAt", "desc"))
    const snapshot = await getDocs(q)
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt.toDate(),
    })) as PlayerProfile[]
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