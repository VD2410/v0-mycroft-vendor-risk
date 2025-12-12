"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Users, AlertTriangle } from "lucide-react"

const peerComparison = [
  { name: "Vanta", founded: "2018", customers: "12,000+", funding: "$500M+", incidents: "Cross-tenant bug (2025)" },
  { name: "Drata", founded: "2020", customers: "5,000+", funding: "$328M", incidents: "None public" },
  { name: "Thoropass", founded: "2019", customers: "1,000+", funding: "$98M", incidents: "None public" },
  { name: "Scrut", founded: "2022", customers: "500+", funding: "$11M", incidents: "None public" },
  { name: "Mycroft", founded: "2024", customers: "N/A", funding: "~$3.5M", incidents: "None public" },
]

export function VendorsTab() {
  return (
    <div className="space-y-6">
      {/* Score Card */}
      <Card className="glass">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-chart-2/20 flex items-center justify-center">
                <Users className="w-6 h-6 text-chart-2" />
              </div>
              <div>
                <div className="text-2xl font-bold text-chart-2">58/100</div>
                <div className="text-sm text-muted-foreground">Third-Party Risk Score</div>
              </div>
            </div>
            <Badge className="bg-chart-2/20 text-chart-2 border-chart-2/30">Elevated Risk</Badge>
          </div>
          <Progress value={58} className="h-2 mt-4" />
        </CardContent>
      </Card>

      {/* Key Finding */}
      <Card className="glass border-chart-2/30">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-chart-2 mt-0.5" />
            <div>
              <div className="font-semibold text-foreground">High Integration Surface</div>
              <p className="text-sm text-muted-foreground mt-1">
                150–250+ integrations across cloud, identity, SCM, ticketing, etc. This creates significant blast radius
                if their platform is compromised—similar architectural risk to Vanta/Drata but with less historical
                proof of secure operation.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Peer Comparison */}
      <Card className="glass">
        <CardHeader>
          <CardTitle className="text-base">Risk Peer Comparison</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Vendor</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Founded</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Customers</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Funding</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Known Incidents</th>
                </tr>
              </thead>
              <tbody>
                {peerComparison.map((peer) => (
                  <tr
                    key={peer.name}
                    className={`border-b border-border/50 ${peer.name === "Mycroft" ? "bg-accent/10" : ""}`}
                  >
                    <td className="py-3 px-4 text-sm font-medium text-foreground">
                      {peer.name}
                      {peer.name === "Mycroft" && <Badge className="ml-2 bg-accent/20 text-accent">Subject</Badge>}
                    </td>
                    <td className="py-3 px-4 text-sm text-muted-foreground">{peer.founded}</td>
                    <td className="py-3 px-4 text-sm text-muted-foreground">{peer.customers}</td>
                    <td className="py-3 px-4 text-sm text-muted-foreground">{peer.funding}</td>
                    <td className="py-3 px-4 text-sm">
                      {peer.incidents === "None public" ? (
                        <span className="text-chart-1">{peer.incidents}</span>
                      ) : (
                        <span className="text-chart-2">{peer.incidents}</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Reasoning */}
      <Card className="glass">
        <CardHeader>
          <CardTitle className="text-base">Analysis & Reasoning</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Mycroft's value comes from deep integration into cloud, SCM, identity, HRIS, and ticketing systems. This
            creates significant blast radius if compromised. For RiskAssure's modelling, rate Mycroft's intrinsic
            architectural risk similar to Vanta/Drata, but adjust the confidence interval wider due to shorter history
            and fewer third-party data points.
          </p>
          <div className="mt-4 p-3 rounded-lg bg-chart-2/10 border border-chart-2/20">
            <div className="font-medium text-foreground text-sm">Mitigation Suggestion</div>
            <p className="text-sm text-muted-foreground mt-1">
              Treat Mycroft as a "Tier-1 critical vendor" in your own TPRM. Require detailed data-flow diagrams per
              integration. Enforce least-privilege integration scopes and strong key rotation.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
