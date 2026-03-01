import type React from "react"
import type { Metadata, Viewport } from "next"
import { Space_Grotesk } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "../components/theme-provider"
import TitleBar from '../components/TitleBar'
const tronixfont = Space_Grotesk({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "APIONIX - Advanced API Development Platform",
  description: "Powerful desktop application for API development and testing built with Electron.js and Next.js. Streamline your workflow with APIONIX.",
  keywords: ["API development", "API testing", "desktop application", "Electron.js", "Next.js"],
  generator: "TRONIX",
  creator: "TRONIX",
  authors: [{ name: "TRONIX" }],
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
    },
  },
  openGraph: {
    type: "website",
    title: "APIONIX - Advanced API Development Platform",
    description: "Powerful desktop application for API development and testing",
    siteName: "APIONIX",
  },
  twitter: {
    card: "summary_large_image",
    title: "APIONIX - Advanced API Development Platform",
    description: "Powerful desktop application for API development and testing",
  },
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#000000" },
  ],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={tronixfont.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>

          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
