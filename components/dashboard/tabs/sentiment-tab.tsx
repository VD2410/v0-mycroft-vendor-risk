"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Eye, TrendingUp } from "lucide-react"

const sentimentSources = [
  {
    source: "Brightspark VC",
    sentiment: "Positive",
    type: "Investor",
    quote: "Portfolio company - AI security leader",
  },
  { source: "BetaKit", sentiment: "Positive", type: "Media", quote: "Canadian cybersecurity startup to watch" },
  { source: "SecurityWeek", sentiment: "Positive", type: "Media", quote: "Mentioned in security industry coverage" },
  { source: "Luge Capital", sentiment: "Positive", type: "Investor", quote: "Fintech security innovation" },
  { source: "G2 Reviews", sentiment: "Neutral", type: "Reviews", quote: "Limited reviews (early stage)" },
]

const investors = [
  { name: "Luge Capital", type: "Lead", focus: "Fintech" },
  { name: "Brightspark Ventures", type: "Participant", focus: "Tech" },
  { name: "Graphite Ventures", type: "Participant", focus: "Enterprise" },
]

export function SentimentTab() {
  return (
    <div className="space-y-6">
      {/* Score Card */}
      <Card className="glass">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-chart-1/20 flex items-center justify-center">
                <Eye className="w-6 h-6 text-chart-1" />
              </div>
              <div>
                <div className="text-2xl font-bold text-chart-1">83/100</div>
                <div className="text-sm text-muted-foreground">Reputation & Sentiment Score</div>
              </div>
            </div>
            <Badge className="bg-chart-1/20 text-chart-1 border-chart-1/30">Strongly Positive</Badge>
          </div>
          <Progress value={83} className="h-2 mt-4" />
        </CardContent>
      </Card>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Sentiment Sources */}
        <Card className="glass">
          <CardHeader>
            <CardTitle className="text-base">Sentiment Analysis Sources</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {sentimentSources.map((item) => (
                <div key={item.source} className="flex items-center justify-between p-3 rounded-lg bg-secondary/50">
                  <div>
                    <div className="text-sm font-medium text-foreground">{item.source}</div>
                    <div className="text-xs text-muted-foreground">{item.quote}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">
                      {item.type}
                    </Badge>
                    <Badge
                      className={
                        item.sentiment === "Positive"
                          ? "bg-chart-1/20 text-chart-1 border-chart-1/30"
                          : "bg-secondary text-secondary-foreground"
                      }
                    >
                      {item.sentiment}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Investors */}
        <Card className="glass">
          <CardHeader>
            <CardTitle className="text-base">Notable Investors</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {investors.map((inv) => (
                <div key={inv.name} className="flex items-center justify-between p-3 rounded-lg bg-secondary/50">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-accent/20 flex items-center justify-center">
                      <TrendingUp className="w-5 h-5 text-accent" />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-foreground">{inv.name}</div>
                      <div className="text-xs text-muted-foreground">{inv.focus}</div>
                    </div>
                  </div>
                  <Badge variant="outline">{inv.type}</Badge>
                </div>
              ))}
            </div>
            <div className="mt-4 p-3 rounded-lg bg-chart-1/10 border border-chart-1/20">
              <div className="text-sm text-muted-foreground">
                Total funding: <strong className="text-foreground">~$3.5M USD</strong> (Seed + Extension)
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Reasoning */}
      <Card className="glass">
        <CardHeader>
          <CardTitle className="text-base">Analysis & Reasoning</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Backed by reputable Canadian and fintech-focused VCs (Luge, Brightspark, Graphite) with repeated positive
            coverage in SecurityWeek, BetaKit, and others. Listed in Canadian cyber directories and VC portfolios as a
            core security asset. No negative media coverage found.
          </p>
          <div className="mt-4 p-3 rounded-lg bg-accent/10 border border-accent/20">
            <div className="font-medium text-foreground text-sm">Recommendation</div>
            <p className="text-sm text-muted-foreground mt-1">
              Validate that public messaging matches actual product maturity—ask for reference customers similar to your
              profile. Confirm they themselves obtain SOC 2 / ISO attestations, not just help customers achieve them.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
