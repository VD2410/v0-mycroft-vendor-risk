import type React from "react"
import type { Metadata } from "next"
import { Inter, Geist_Mono } from "next/font/google"
// import { Analytics } from "@vercel/analytics/next"
import "./globals.css"

const _inter = Inter({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "RiskAssure | Cybersecurity Intelligence Platform",
  description:
    "Measure Cyber Risk in Minutes. AI-powered vendor risk assessment, vulnerability scoring, and compliance intelligence.",
  generator: "RiskAssure",
  icons: {
    icon: "/images/image.png",
    apple: "/images/image.png",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`font-sans antialiased`} suppressHydrationWarning>
        {children}
        {/* <Analytics /> */}
      </body>
    </html>
  )
}
