import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Shield, Bug, Globe, Users, Eye, TrendingUp } from "lucide-react"

const scores = [
  { name: "Cyber Threat Score", score: 60, icon: Shield, color: "text-[#4F46E5]" },
  { name: "Vulnerability Score", score: 65, icon: Bug, color: "text-[#2563EB]" },
  { name: "Dark Web Score", score: 75, icon: Globe, color: "text-[#06B6D4]" },
  { name: "Third-Party Risk Score", score: 58, icon: Users, color: "text-[#38BDF8]" },
  { name: "Reputation Score", score: 83, icon: Eye, color: "text-primary" },
]

export function ExampleScorecard() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/30">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground">Example Scorecard</h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            Real vendor risk assessment for Mycroft (mycroft.io) - AI Security Platform
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main score card */}
          <div className="lg:col-span-1">
            <div className="bg-card rounded-xl p-8 text-center border border-border shadow-lg">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-8 h-8 text-primary" />
              </div>
              <div className="text-6xl font-bold text-primary mb-2">66</div>
              <div className="text-lg font-semibold text-foreground">RiskAssure Index</div>
              <Badge variant="secondary" className="mt-3 bg-cyan-100 text-cyan-700 border-cyan-200">
                Moderate Risk
              </Badge>
              <div className="mt-6 pt-6 border-t border-border">
                <div className="text-sm text-muted-foreground">
                  <p className="font-medium text-foreground mb-2">Mycroft (mycroft.io)</p>
                  <p>AI Security & Compliance SaaS</p>
                  <p>Founded 2024 - Toronto, Canada</p>
                </div>
              </div>
            </div>
          </div>

          {/* Score breakdown */}
          <div className="lg:col-span-2">
            <div className="bg-card rounded-xl p-6 border border-border shadow-md">
              <h3 className="text-lg font-semibold text-foreground mb-6">Score Breakdown</h3>
              <div className="space-y-5">
                {scores.map((item) => (
                  <div key={item.name} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <item.icon className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm font-medium text-foreground">{item.name}</span>
                      </div>
                      <span className={`text-sm font-bold ${item.color}`}>{item.score}/100</span>
                    </div>
                    <Progress value={item.score} className="h-2" />
                  </div>
                ))}
              </div>

              <div className="mt-8 p-4 rounded-lg bg-muted/50">
                <h4 className="text-sm font-semibold text-foreground mb-2">Key Findings</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>- 150-250+ integrations create significant vendor graph exposure</li>
                  <li>- No public CVEs specific to the platform identified</li>
                  <li>- Strong investor backing (Luge, Brightspark, Graphite)</li>
                  <li>- Early-stage with limited operational track record</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
