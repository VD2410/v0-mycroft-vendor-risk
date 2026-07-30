"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { companies, mycroftScores } from "@/lib/mock-data"
import { Search, Plus, Shield, Users, Network } from "lucide-react"
import Link from "next/link"

const vendorGraph = [
  { name: "AWS", type: "Cloud", connection: "Direct", risk: "Medium" },
  { name: "Azure", type: "Cloud", connection: "Direct", risk: "Medium" },
  { name: "GCP", type: "Cloud", connection: "Direct", risk: "Medium" },
  { name: "GitHub", type: "SCM", connection: "Direct", risk: "High" },
  { name: "GitLab", type: "SCM", connection: "Direct", risk: "High" },
  { name: "Bitbucket", type: "SCM", connection: "Direct", risk: "High" },
  { name: "Okta", type: "Identity", connection: "Direct", risk: "Critical" },
  { name: "Azure AD", type: "Identity", connection: "Direct", risk: "Critical" },
  { name: "Jira", type: "Ticketing", connection: "Direct", risk: "Low" },
  { name: "Slack", type: "Messaging", connection: "Direct", risk: "Low" },
  { name: "Datadog", type: "Monitoring", connection: "Indirect", risk: "Low" },
  { name: "PagerDuty", type: "Alerting", connection: "Indirect", risk: "Low" },
]

const riskColors: Record<string, string> = {
  Low: "bg-chart-1/20 text-chart-1 border-chart-1/30",
  Medium: "bg-chart-4/20 text-chart-4 border-chart-4/30",
  High: "bg-chart-2/20 text-chart-2 border-chart-2/30",
  Critical: "bg-destructive/20 text-destructive border-destructive/30",
}

export function VendorsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Vendor Risk Graph</h1>
          <p className="text-muted-foreground">Third-party dependencies and integration exposure</p>
        </div>
        <Button className="bg-accent text-accent-foreground hover:bg-accent/90">
          <Plus className="w-4 h-4 mr-2" />
          Add Vendor
        </Button>
      </div>

      {/* Stats */}
      <div className="grid sm:grid-cols-4 gap-4">
        <Card className="glass">
          <CardContent className="pt-4 text-center">
            <Network className="w-8 h-8 text-accent mx-auto mb-2" />
            <div className="text-3xl font-bold text-foreground">150+</div>
            <div className="text-sm text-muted-foreground">Total Integrations</div>
          </CardContent>
        </Card>
        <Card className="glass">
          <CardContent className="pt-4 text-center">
            <Shield className="w-8 h-8 text-destructive mx-auto mb-2" />
            <div className="text-3xl font-bold text-destructive">2</div>
            <div className="text-sm text-muted-foreground">Critical Risk</div>
          </CardContent>
        </Card>
        <Card className="glass">
          <CardContent className="pt-4 text-center">
            <Shield className="w-8 h-8 text-chart-2 mx-auto mb-2" />
            <div className="text-3xl font-bold text-chart-2">3</div>
            <div className="text-sm text-muted-foreground">High Risk</div>
          </CardContent>
        </Card>
        <Card className="glass">
          <CardContent className="pt-4 text-center">
            <Users className="w-8 h-8 text-chart-4 mx-auto mb-2" />
            <div className="text-3xl font-bold text-chart-4">58</div>
            <div className="text-sm text-muted-foreground">3rd Party Score</div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input placeholder="Search vendors..." className="pl-10 bg-card border-border" />
      </div>

      {/* Vendor Graph */}
      <Card className="glass">
        <CardHeader>
          <CardTitle className="text-base">Vendor Dependency Graph</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4 justify-center py-8">
            {/* Center node */}
            <div className="relative">
              <div className="w-24 h-24 rounded-full bg-accent/20 flex flex-col items-center justify-center border-2 border-accent">
                <Shield className="w-8 h-8 text-accent mb-1" />
                <span className="text-xs font-medium text-foreground">Mycroft</span>
              </div>

              {/* Connection lines would be SVG in production */}
            </div>
          </div>

          {/* Vendor List */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 mt-6">
            {vendorGraph.map((vendor) => (
              <div key={vendor.name} className="flex items-center justify-between p-3 rounded-lg bg-secondary/50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-accent/20 flex items-center justify-center text-xs font-mono text-accent">
                    {vendor.name.slice(0, 2)}
                  </div>
                  <div>
                    <div className="text-sm font-medium text-foreground">{vendor.name}</div>
                    <div className="text-xs text-muted-foreground">{vendor.type}</div>
                  </div>
                </div>
                <Badge className={riskColors[vendor.risk]}>{vendor.risk}</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Monitored Companies */}
      <Card className="glass">
        <CardHeader>
          <CardTitle className="text-base">Monitored Companies</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {companies.map((company) => (
              <Link
                key={company.id}
                href={`/dashboard/company?id=${company.id}`}
                className="flex items-center justify-between p-4 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-accent/20 flex items-center justify-center">
                    <Shield className="w-6 h-6 text-accent" />
                  </div>
                  <div>
                    <div className="font-medium text-foreground">{company.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {company.domain} • {company.industry}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-chart-4">{mycroftScores.overallScore}</div>
                  <Badge className="bg-chart-4/20 text-chart-4 border-chart-4/30">Moderate</Badge>
                </div>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
