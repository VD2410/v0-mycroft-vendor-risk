"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Globe, Shield, AlertTriangle, CheckCircle } from "lucide-react"

const darkWebFindings = [
  { type: "Credential Leaks", status: "Not Found", confidence: "Low-Medium", source: "OSINT Scan" },
  { type: "Breach Mentions", status: "Not Found", confidence: "Low-Medium", source: "Security Media" },
  { type: "Forum Chatter", status: "Not Found", confidence: "Low", source: "Public Forums" },
  { type: "Data Sales", status: "Not Found", confidence: "Low", source: "Dark Web Feeds" },
]

export function DarkWebTab() {
  return (
    <div className="space-y-6">
      {/* Score Card */}
      <Card className="glass">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-accent/20 flex items-center justify-center">
                <Globe className="w-6 h-6 text-accent" />
              </div>
              <div>
                <div className="text-2xl font-bold text-accent">75/100</div>
                <div className="text-sm text-muted-foreground">Dark Web Score</div>
              </div>
            </div>
            <Badge className="bg-chart-1/20 text-chart-1 border-chart-1/30">Low Exposure</Badge>
          </div>
          <Progress value={75} className="h-2 mt-4" />
        </CardContent>
      </Card>

      {/* Key Finding */}
      <Card className="glass border-chart-1/30">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-chart-1 mt-0.5" />
            <div>
              <div className="font-semibold text-foreground">No Evidence of Exposure</div>
              <p className="text-sm text-muted-foreground mt-1">
                No OSINT-visible evidence of credentials or Mycroft-specific data circulating; no breach reports
                mentioning them as victims. This is a weak positive only—comprehensive dark-web coverage requires
                specialized feeds (HIBP, SpyCloud).
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Findings Table */}
      <Card className="glass">
        <CardHeader>
          <CardTitle className="text-base">Dark Web & Breach Intelligence</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {darkWebFindings.map((finding) => (
              <div key={finding.type} className="flex items-center justify-between p-3 rounded-lg bg-secondary/50">
                <div className="flex items-center gap-3">
                  <Shield className="w-5 h-5 text-chart-1" />
                  <div>
                    <div className="text-sm font-medium text-foreground">{finding.type}</div>
                    <div className="text-xs text-muted-foreground">{finding.source}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className="bg-chart-1/20 text-chart-1 border-chart-1/30">{finding.status}</Badge>
                  <span className="text-xs text-muted-foreground">Confidence: {finding.confidence}</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Caveat */}
      <Card className="glass border-chart-4/30">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-chart-4 mt-0.5" />
            <div>
              <div className="font-semibold text-foreground">Limited OSINT Coverage</div>
              <p className="text-sm text-muted-foreground mt-1">
                Deep dark-web checks (credentials, chatter) would require specialized feeds like HIBP, SpyCloud, or
                premium dark-web intelligence services not included in this OSINT assessment.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Reasoning */}
      <Card className="glass">
        <CardHeader>
          <CardTitle className="text-base">Mitigation Suggestions</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-accent mt-2" />
              Run recurring checks via HaveIBeenPwned/SpyCloud for your own domains that may intersect with Mycroft
              usage.
            </li>
            <li className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-accent mt-2" />
              Require Mycroft to operate phishing-resistant SSO + hardware-backed MFA for admin and support access.
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}
