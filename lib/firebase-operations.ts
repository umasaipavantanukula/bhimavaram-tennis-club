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
    const q = query(collection(database, "news"), where("published", "==", true))
    const snapshot = await getDocs(q)
    const articles = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt.toDate(),
    })) as NewsArticle[]

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

// File upload operations
export const uploadOperations = {
  async uploadImage(file: File, path: string): Promise<string> {
    try {
      console.log("[v0] Starting image upload:", file.name)
      console.log("[v0] File size:", (file.size / 1024 / 1024).toFixed(2), "MB")
      console.log("[v0] File type:", file.type)
      console.log("[v0] Upload path:", path)

      const storageInstance = ensureStorage()
      console.log("[v0] Storage instance:", "Available")

      // Validate file type
      if (!file.type.startsWith('image/')) {
        throw new Error("Only image files are allowed.")
      }

      // Validate file size (10MB max)
      if (file.size > 10 * 1024 * 1024) {
        throw new Error("File size must be less than 10MB.")
      }

      const filename = `${Date.now()}_${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`
      const storageRef = ref(storageInstance, `${path}/${filename}`)
      console.log("[v0] Storage reference created:", storageRef.fullPath)

      const snapshot = await uploadBytes(storageRef, file)
      console.log("[v0] Upload successful, getting download URL")

      const downloadURL = await getDownloadURL(snapshot.ref)
      console.log("[v0] Download URL obtained:", downloadURL)

      return downloadURL
    } catch (error: any) {
      console.error("[v0] Upload error:", error)
      console.error("[v0] Error code:", error.code)
      console.error("[v0] Error message:", error.message)

      // Handle specific Firebase Storage errors
      if (error.code === "storage/unknown" || error.message?.includes("CORS")) {
        throw new Error(
          `❌ CORS Error: Upload failed due to cross-origin policy. This usually means:\n` +
          `• The Firebase Storage bucket CORS settings need to be updated\n` +
          `• Your domain (${typeof window !== 'undefined' ? window.location.origin : 'localhost'}) needs to be added to allowed origins\n\n` +
          `To fix this:\n` +
          `1. Go to Firebase Console > Storage > Rules\n` +
          `2. Set up CORS configuration for your domain\n` +
          `3. Or contact the developer to configure CORS settings`
        )
      }

      if (error.code === "storage/unauthorized") {
        throw new Error(
          `❌ Authorization Error: You don't have permission to upload files.\n` +
          `This could mean:\n` +
          `• You need to be signed in\n` +
          `• Storage security rules are too restrictive\n` +
          `• Your account doesn't have the required permissions`
        )
      }

      if (error.code === "storage/canceled") {
        throw new Error("❌ Upload was canceled. Please try again.")
      }

      if (error.code === "storage/quota-exceeded") {
        throw new Error("❌ Storage quota exceeded. Please contact the administrator.")
      }

      if (error.code === "storage/retry-limit-exceeded") {
        throw new Error("❌ Upload failed after multiple retries. Please check your internet connection.")
      }

      if (error.code === "storage/invalid-format") {
        throw new Error("❌ Invalid file format. Please upload a valid image file (JPG, PNG, GIF, WebP).")
      }

      // Network-related errors
      if (error.message?.includes("NetworkError") || error.message?.includes("Failed to fetch")) {
        throw new Error(
          `❌ Network Error: Failed to connect to Firebase Storage.\n` +
          `Please check:\n` +
          `• Your internet connection\n` +
          `• Firebase service status\n` +
          `• Try again in a moment`
        )
      }

      // Generic error with helpful context
      throw new Error(
        `❌ Upload failed: ${error.message || "Unknown error"}\n\n` +
        `Debug info:\n` +
        `• File: ${file.name} (${(file.size / 1024 / 1024).toFixed(2)}MB)\n` +
        `• Path: ${path}\n` +
        `• Type: ${file.type}\n` +
        `• Error code: ${error.code || 'N/A'}`
      )
    }
  },

  async deleteImage(url: string) {
    try {
      console.log("[v0] Deleting image:", url)

      const storageInstance = ensureStorage()
      const imageRef = ref(storageInstance, url)
      await deleteObject(imageRef)
      console.log("[v0] Image deleted successfully")
    } catch (error: any) {
      console.error("[v0] Delete error:", error)

      if (error.code === "storage/object-not-found") {
        console.warn("[v0] Image not found, may have been already deleted")
        return // Don't throw error for already deleted images
      }

      if (error.code === "storage/unauthorized") {
        throw new Error("❌ Delete access denied. You don't have permission to delete this file.")
      }

      throw new Error(`❌ Delete failed: ${error.message || "Unknown error"}`)
    }
  },
}