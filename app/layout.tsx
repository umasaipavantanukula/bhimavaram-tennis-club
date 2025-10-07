import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { Suspense } from "react"
import { AuthProvider } from "@/lib/auth-context"
import { LoadingProvider } from "@/lib/loading-context"
import { NavigationHandler } from "@/components/navigation-handler"
import { PageLoadingWrapper } from "@/components/page-loading-wrapper"
import "./globals.css"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
})

export const metadata: Metadata = {
  title: "Bhimavaram Tennis Club - Official Website",
  description:
    "Join Bhimavaram Tennis Club - Professional coaching, court booking, tournaments, and tennis community in Bhimavaram",
  generator: "v0.app",
}

function RootLayoutContent({ children }: { children: React.ReactNode }) {
  return (
    <LoadingProvider>
      <NavigationHandler>
        <AuthProvider>
          <Suspense fallback={null}>{children}</Suspense>
        </AuthProvider>
        <PageLoadingWrapper />
      </NavigationHandler>
    </LoadingProvider>
  )
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans ${inter.variable}`}>
        <RootLayoutContent>{children}</RootLayoutContent>
        <Analytics />
      </body>
    </html>
  )
}
