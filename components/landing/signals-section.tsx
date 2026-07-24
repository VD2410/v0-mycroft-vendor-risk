import { Building2, Code, Bug, Users, Globe, MessageSquare } from "lucide-react"

const signals = [
  {
    icon: Building2,
    title: "Firmographic Data",
    description: "Company size, funding, location, industry classification, and organizational structure.",
    sources: ["Crunchbase", "LinkedIn", "SEC Filings"],
  },
  {
    icon: Code,
    title: "Technology Footprint",
    description: "Tech stack analysis, integration surface, API exposure, and infrastructure assessment.",
    sources: ["BuiltWith", "Wappalyzer", "GitHub"],
  },
  {
    icon: Bug,
    title: "Vulnerability Intel",
    description: "CVE database correlation, known exploits, patch status, and security advisories.",
    sources: ["NVD", "CVE", "Exploit-DB"],
  },
  {
    icon: Users,
    title: "Third-Party Risk",
    description: "Vendor dependencies, supply chain exposure, integration complexity analysis.",
    sources: ["Integration APIs", "Trust Centers", "SBOM"],
  },
  {
    icon: Globe,
    title: "Dark Web Monitoring",
    description: "Credential leaks, breach mentions, forum chatter, and threat actor activity.",
    sources: ["HIBP", "SpyCloud", "Dark Web Feeds"],
  },
  {
    icon: MessageSquare,
    title: "Reputation & Sentiment",
    description: "News analysis, social sentiment, customer reviews, and industry perception.",
    sources: ["News APIs", "G2", "Glassdoor"],
  },
]

export function SignalsSection() {
  return (
    <section id="signals" className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground">Signals We Collect</h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            Comprehensive OSINT collection across 6 intelligence categories
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {signals.map((signal) => (
            <div
              key={signal.title}
              className="bg-card rounded-xl p-6 border border-border shadow-sm hover:shadow-md hover:border-primary/30 transition-all"
            >
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <signal.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">{signal.title}</h3>
              <p className="text-sm text-muted-foreground mb-4">{signal.description}</p>
              <div className="flex flex-wrap gap-2">
                {signal.sources.map((source) => (
                  <span key={source} className="text-xs px-2 py-1 rounded-full bg-secondary text-secondary-foreground">
                    {source}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
