"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Bug, AlertTriangle, CheckCircle, Info } from "lucide-react"

const cveFindings = [
  {
    cve: "Legacy CVE-2019-xxxx",
    product: "Mycroft AI mycroft-core",
    severity: "N/A",
    status: "Unrelated",
    notes: "Historical CVEs for the legacy open-source voice assistant project, not this company's platform.",
  },
]

export function VulnerabilitiesTab() {
  return (
    <div className="space-y-6">
      {/* Score Card */}
      <Card className="glass">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-chart-1/20 flex items-center justify-center">
                <Bug className="w-6 h-6 text-chart-1" />
              </div>
              <div>
                <div className="text-2xl font-bold text-chart-1">65/100</div>
                <div className="text-sm text-muted-foreground">Vulnerability Score</div>
              </div>
            </div>
            <Badge className="bg-chart-1/20 text-chart-1 border-chart-1/30">Low Exposure</Badge>
          </div>
          <Progress value={65} className="h-2 mt-4" />
        </CardContent>
      </Card>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Stats */}
        <Card className="glass">
          <CardContent className="pt-6 text-center">
            <CheckCircle className="w-10 h-10 text-chart-1 mx-auto mb-2" />
            <div className="text-3xl font-bold text-foreground">0</div>
            <div className="text-sm text-muted-foreground">Platform-Specific CVEs</div>
          </CardContent>
        </Card>
        <Card className="glass">
          <CardContent className="pt-6 text-center">
            <Info className="w-10 h-10 text-chart-4 mx-auto mb-2" />
            <div className="text-3xl font-bold text-foreground">N/A</div>
            <div className="text-sm text-muted-foreground">Active Exploits</div>
          </CardContent>
        </Card>
        <Card className="glass">
          <CardContent className="pt-6 text-center">
            <AlertTriangle className="w-10 h-10 text-muted-foreground mx-auto mb-2" />
            <div className="text-3xl font-bold text-foreground">Limited</div>
            <div className="text-sm text-muted-foreground">OSINT Coverage</div>
          </CardContent>
        </Card>
      </div>

      {/* CVE Table */}
      <Card className="glass">
        <CardHeader>
          <CardTitle className="text-base">CVE Database Findings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">CVE Reference</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Product</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Severity</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Status</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Notes</th>
                </tr>
              </thead>
              <tbody>
                {cveFindings.map((cve, i) => (
                  <tr key={i} className="border-b border-border/50">
                    <td className="py-3 px-4 text-sm font-mono text-foreground">{cve.cve}</td>
                    <td className="py-3 px-4 text-sm text-foreground">{cve.product}</td>
                    <td className="py-3 px-4">
                      <Badge variant="secondary">{cve.severity}</Badge>
                    </td>
                    <td className="py-3 px-4">
                      <Badge className="bg-secondary text-secondary-foreground">{cve.status}</Badge>
                    </td>
                    <td className="py-3 px-4 text-sm text-muted-foreground max-w-xs">{cve.notes}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-4 p-3 rounded-lg bg-chart-1/10 border border-chart-1/20">
            <div className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-chart-1 mt-0.5" />
              <div>
                <div className="font-medium text-foreground text-sm">No Platform CVEs Identified</div>
                <p className="text-sm text-muted-foreground mt-1">
                  No public platform-specific CVEs for mycroft.io identified. Historical CVEs exist for the unrelated
                  "Mycroft AI mycroft-core" open-source voice assistant.
                </p>
              </div>
            </div>
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
            No platform-specific CVEs identified. Agentic AI and heavy automation can both reduce and introduce risk
            depending on control design. The absence of evidence does not equal absence of vulnerabilities—this is a
            weak positive indicator only.
          </p>
          <div className="mt-4 p-3 rounded-lg bg-accent/10 border border-accent/20">
            <div className="font-medium text-foreground text-sm">Mitigation Suggestion</div>
            <p className="text-sm text-muted-foreground mt-1">
              Include mandatory annual third-party pentest + fix SLAs in contract. Request SAST/DAST results and verify
              secure SDLC practices.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
