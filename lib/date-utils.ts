// Utility functions for date formatting and match filtering

export function formatDate(date: Date): string {
  return date.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

export function isToday(date: Date): boolean {
  const now = new Date()
  return (
    date.getDate() === now.getDate() &&
    date.getMonth() === now.getMonth() &&
    date.getFullYear() === now.getFullYear()
  )
}

export function isRecent(date: Date, days = 3): boolean {
  const now = new Date()
  const diff = Math.abs(now.getTime() - date.getTime())
  return diff < days * 24 * 60 * 60 * 1000
}

export function isThisWeek(date: Date): boolean {
  const now = new Date()
  const weekStart = new Date(now.setDate(now.getDate() - now.getDay()))
  const weekEnd = new Date(now.setDate(now.getDate() - now.getDay() + 6))
  return date >= weekStart && date <= weekEnd
}

import type { Match } from "./firebase-operations"

export function getCurrentOrRecentMatches(matches: Match[]): Match[] {
  // 1. First priority: Today's matches
  const today = matches.filter((m: Match) => isToday(m.date))
  if (today.length > 0) {
    console.log('Found today\'s matches:', today.length)
    return today
  }
  
  // 2. Second priority: This week's matches
  const thisWeek = matches.filter((m: Match) => isThisWeek(m.date))
  if (thisWeek.length > 0) {
    console.log('Found this week\'s matches:', thisWeek.length)
    return thisWeek
  }
  
  // 3. Fallback: Recent matches (last 7 days)
  const recent = matches.filter((m: Match) => isRecent(m.date, 7))
  console.log('Found recent matches:', recent.length)
  return recent
}
