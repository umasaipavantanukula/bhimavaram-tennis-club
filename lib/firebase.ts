// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app"
import { getAuth, type Auth } from "firebase/auth"
import { getFirestore, type Firestore } from "firebase/firestore"
import { getStorage, type FirebaseStorage } from "firebase/storage"

const firebaseConfig = {
  apiKey: "AIzaSyCMACQ_uoygJ68LYlaK8EciYWHzH--lI00",
  authDomain: "bhimavaramtennis.firebaseapp.com",
  projectId: "bhimavaramtennis",
  storageBucket: "bhimavaramtennis.firebasestorage.app",
  messagingSenderId: "997041430593",
  appId: "1:997041430593:web:cf181763568510166566c0",
  measurementId: "G-X5VWKXLQYT",
}

// Initialize Firebase
let app: FirebaseApp | null = null
let auth: Auth | null = null
let db: Firestore | null = null
let storage: FirebaseStorage | null = null

try {
  // Initialize Firebase App (singleton pattern to prevent multiple initializations)
  app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp()

  // Initialize Firebase services with error handling
  auth = getAuth(app)
  db = getFirestore(app)
  storage = getStorage(app)

  // Enhanced logging
  console.log("[v0] Firebase initialized successfully")
  console.log("[v0] App name:", app.name)
  console.log("[v0] Project ID:", firebaseConfig.projectId)
  console.log("[v0] Storage bucket:", firebaseConfig.storageBucket)
  
  if (typeof window !== "undefined") {
    console.log("[v0] Current domain:", window.location.origin)
    console.log("[v0] Auth domain:", firebaseConfig.authDomain)
    
    // Check if we're in development mode
    const isDevelopment = window.location.hostname === 'localhost'
    console.log("[v0] Development mode:", isDevelopment)
  }

  // Verify storage configuration
  if (storage) {
    console.log("[v0] Storage initialized successfully")
    console.log("[v0] Storage app:", storage.app.name)
  } else {
    console.error("[v0] Storage failed to initialize")
  }

} catch (error) {
  console.error("[v0] Firebase initialization error:", error)
  
  // Type-safe error logging
  if (error instanceof Error) {
    console.error("[v0] Error details:", {
      message: error.message,
      name: error.name,
      stack: error.stack
    })
  }
  
  // Provide fallback services for development
  auth = null
  db = null
  storage = null
}

export { auth, db, storage }
export default app