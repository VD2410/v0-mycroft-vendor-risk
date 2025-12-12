"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Menu, X } from "lucide-react"
import { useState } from "react"
import { WisrLogo } from "@/components/wisr-logo"

export function LandingNav() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-md border-b border-border/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center">
            <WisrLogo size="sm" showText={true} />
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <Link
              href="#how-it-works"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              How It Works
            </Link>
            <Link href="#signals" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Signals
            </Link>
            <Link href="#compliance" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Compliance
            </Link>
            <Link href="#pricing" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Pricing
            </Link>
          </div>

          <div className="hidden md:flex items-center gap-3">
            <Button variant="ghost" asChild>
              <Link href="/signin">Sign In</Link>
            </Button>
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90" asChild>
              <Link href="/signup">Start Free Scan</Link>
            </Button>
          </div>

          <button className="md:hidden p-2 text-foreground" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden bg-background border-t border-border">
          <div className="px-4 py-4 space-y-3">
            <Link href="#how-it-works" className="block text-sm text-muted-foreground hover:text-foreground">
              How It Works
            </Link>
            <Link href="#signals" className="block text-sm text-muted-foreground hover:text-foreground">
              Signals
            </Link>
            <Link href="#compliance" className="block text-sm text-muted-foreground hover:text-foreground">
              Compliance
            </Link>
            <Link href="#pricing" className="block text-sm text-muted-foreground hover:text-foreground">
              Pricing
            </Link>
            <div className="pt-3 flex flex-col gap-2">
              <Button variant="ghost" className="w-full justify-center" asChild>
                <Link href="/signin">Sign In</Link>
              </Button>
              <Button className="w-full bg-primary text-primary-foreground" asChild>
                <Link href="/signup">Start Free Scan</Link>
              </Button>
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}
