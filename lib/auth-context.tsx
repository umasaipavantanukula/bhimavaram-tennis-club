"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import { type User, onAuthStateChanged, signInWithEmailAndPassword, signOut } from "firebase/auth"
import { auth } from "./firebase"

interface AuthContextType {
  user: User | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!auth) {
      console.error("[v0] Firebase auth not initialized")
      setLoading(false)
      return
    }

    const unsubscribe = onAuthStateChanged(
      auth,
      (user) => {
        console.log("[v0] Auth state changed:", user ? "User logged in" : "User logged out")
        setUser(user)
        setLoading(false)
      },
      (error) => {
        console.error("[v0] Auth state change error:", error)
        setLoading(false)
      },
    )

    return unsubscribe
  }, [])

  const signIn = async (email: string, password: string) => {
    if (!auth) {
      throw new Error("Firebase auth not initialized")
    }

    try {
      console.log("[v0] Attempting to sign in user:", email)
      await signInWithEmailAndPassword(auth, email, password)
      console.log("[v0] Sign in successful")
    } catch (error) {
      console.error("[v0] Sign in error:", error)
      throw error
    }
  }

  const logout = async () => {
    if (!auth) {
      throw new Error("Firebase auth not initialized")
    }

    try {
      console.log("[v0] Attempting to sign out")
      await signOut(auth)
      console.log("[v0] Sign out successful")
    } catch (error) {
      console.error("[v0] Sign out error:", error)
      throw error
    }
  }

  const value = {
    user,
    loading,
    signIn,
    logout,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
