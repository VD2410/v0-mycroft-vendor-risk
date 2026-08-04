import Link from "next/link"
import { WisrLogo } from "@/components/wisr-logo"

export function LandingFooter() {
  return (
    <footer className="py-12 px-4 sm:px-6 lg:px-8 border-t border-border bg-muted/30">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <Link href="/" className="inline-block">
              <WisrLogo size="sm" />
            </Link>
            <p className="mt-4 text-sm text-muted-foreground">
              Intelligent Cyber Threat Solutions for modern enterprises.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-foreground mb-4">Product</h4>
            <ul className="space-y-2">
              <li>
                <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">
                  Features
                </Link>
              </li>
              <li>
                <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">
                  Integrations
                </Link>
              </li>
              <li>
                <Link href="#pricing" className="text-sm text-muted-foreground hover:text-foreground">
                  Pricing
                </Link>
              </li>
              <li>
                <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">
                  API Docs
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-foreground mb-4">Company</h4>
            <ul className="space-y-2">
              <li>
                <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">
                  About
                </Link>
              </li>
              <li>
                <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">
                  Careers
                </Link>
              </li>
              <li>
                <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-foreground mb-4">Legal</h4>
            <ul className="space-y-2">
              <li>
                <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">
                  Security
                </Link>
              </li>
              <li>
                <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">
                  Compliance
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">© 2026 RiskAssure by VisionBox. All rights reserved.</p>
          {/* Certification badges removed: RiskAssure holds no SOC 2 or ISO 27001
              audit, and "GDPR Ready" cannot be claimed without a privacy policy.
              Re-add each only once the corresponding report exists. */}
          <div className="flex items-center gap-4">
            <span className="text-xs px-2 py-1 rounded bg-primary/10 text-primary font-medium">
              SOC 2 &amp; NIST CSF framework mapping
            </span>
          </div>
        </div>
      </div>
    </footer>
  )
}
