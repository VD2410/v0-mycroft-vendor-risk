import { Button } from "@/components/ui/button"
import { ArrowRight, Shield, Zap, Eye } from "lucide-react"
import Link from "next/link"

export function LandingHero() {
  return (
    <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-primary/2 to-transparent" />

      <div className="relative max-w-7xl mx-auto">
        <div className="text-center max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-6">
            <Zap className="w-4 h-4" />
            Intelligent Cyber Threat Solutions
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground leading-tight text-balance">
            Measure Vendor Risk{" "}
            <span className="bg-gradient-to-r from-[#4F46E5] via-[#2563EB] to-[#06B6D4] bg-clip-text text-transparent">
              in Minutes
            </span>
          </h1>

          <p className="mt-6 text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto text-pretty">
            AI-powered vendor risk assessment that gathers OSINT signals, generates multi-factor risk scores, and
            provides actionable compliance intelligence.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/25"
              asChild
            >
              <Link href="/dashboard">
                Start Free Scan
                <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="border-border hover:bg-muted bg-transparent" asChild>
              <Link href="#how-it-works">See How It Works</Link>
            </Button>
          </div>
        </div>

        {/* Stats row */}
        <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
          {[
            { value: "150+", label: "Signal Sources" },
            { value: "<2min", label: "Scan Time" },
            { value: "99.9%", label: "Uptime SLA" },
            { value: "SOC 2", label: "Compliant" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-3xl sm:text-4xl font-bold text-foreground">{stat.value}</div>
              <div className="text-sm text-muted-foreground mt-1">{stat.label}</div>
            </div>
          ))}
        </div>

        <div className="mt-20 grid md:grid-cols-3 gap-4">
          <div className="bg-card rounded-xl p-6 border border-border shadow-lg hover:shadow-xl transition-shadow">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Shield className="w-5 h-5 text-primary" />
              </div>
              <div>
                <div className="font-semibold text-card-foreground">RiskAssure Index</div>
                <div className="text-sm text-muted-foreground">Overall Score</div>
              </div>
            </div>
            <div className="text-4xl font-bold text-primary">66/100</div>
            <div className="text-sm text-muted-foreground mt-1">Moderate Risk</div>
          </div>

          <div className="bg-card rounded-xl p-6 border border-border shadow-md hover:shadow-lg transition-shadow">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-[#06B6D4]/10 flex items-center justify-center">
                <Zap className="w-5 h-5 text-[#06B6D4]" />
              </div>
              <div>
                <div className="font-semibold text-card-foreground">Vulnerability Score</div>
                <div className="text-sm text-muted-foreground">CVE Analysis</div>
              </div>
            </div>
            <div className="text-4xl font-bold text-[#06B6D4]">65/100</div>
            <div className="text-sm text-muted-foreground mt-1">No Platform CVEs</div>
          </div>

          <div className="bg-card rounded-xl p-6 border border-border shadow-md hover:shadow-lg transition-shadow">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-[#2563EB]/10 flex items-center justify-center">
                <Eye className="w-5 h-5 text-[#2563EB]" />
              </div>
              <div>
                <div className="font-semibold text-card-foreground">Reputation Score</div>
                <div className="text-sm text-muted-foreground">Sentiment Analysis</div>
              </div>
            </div>
            <div className="text-4xl font-bold text-[#2563EB]">83/100</div>
            <div className="text-sm text-muted-foreground mt-1">Strongly Positive</div>
          </div>
        </div>
      </div>
    </section>
  )
}
