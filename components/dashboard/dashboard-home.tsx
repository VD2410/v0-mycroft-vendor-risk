"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { companies, mycroftScores } from "@/lib/mock-data"
import { Search, Plus, Star, Shield, Bug, Globe, Users, Eye, ArrowRight, Clock } from "lucide-react"
import Link from "next/link"

const scoreCards = [
  { key: "cyberThreat", label: "Cyber Threat", icon: Shield, color: "text-[#4F46E5]", bgColor: "bg-[#4F46E5]/10" },
  { key: "vulnerability", label: "Vulnerability", icon: Bug, color: "text-[#2563EB]", bgColor: "bg-[#2563EB]/10" },
  { key: "darkWeb", label: "Dark Web", icon: Globe, color: "text-[#06B6D4]", bgColor: "bg-[#06B6D4]/10" },
  { key: "thirdParty", label: "Third-Party", icon: Users, color: "text-[#38BDF8]", bgColor: "bg-[#38BDF8]/10" },
  { key: "reputation", label: "Reputation", icon: Eye, color: "text-primary", bgColor: "bg-primary/10" },
]

function getRiskColor(score: number) {
  if (score >= 80) return "text-emerald-600"
  if (score >= 60) return "text-[#0891B2]"
  if (score >= 40) return "text-amber-600"
  return "text-red-600"
}

function getRiskBadge(score: number) {
  if (score >= 80)
    return {
      label: "Low Risk",
      variant: "default" as const,
      className: "bg-emerald-100 text-emerald-700 border-emerald-200",
    }
  if (score >= 60)
    return {
      label: "Moderate Risk",
      variant: "secondary" as const,
      className: "bg-cyan-100 text-cyan-700 border-cyan-200",
    }
  if (score >= 40)
    return {
      label: "High Risk",
      variant: "secondary" as const,
      className: "bg-amber-100 text-amber-700 border-amber-200",
    }
  return { label: "Critical", variant: "destructive" as const, className: "bg-red-100 text-red-700 border-red-200" }
}

export function DashboardHome() {
  const company = companies[0]
  const scores = mycroftScores
  const riskBadge = getRiskBadge(scores.overallScore)

  return (
    <div className="space-y-6">
      {/* Search and New Scan */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1 max-w-xl">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Enter company name and domain to scan..." className="pl-10 h-12 bg-card border-border" />
        </div>
        <Button className="h-12 bg-primary text-primary-foreground hover:bg-primary/90 shadow-md" asChild>
          <Link href="/dashboard/scan">
            <Plus className="w-4 h-4 mr-2" />
            New Scan
          </Link>
        </Button>
      </div>

      {/* Overall Score & Quick Stats */}
      <div className="grid lg:grid-cols-4 gap-6">
        {/* Main Score Card */}
        <Card className="lg:col-span-1 bg-card border-border shadow-md">
          <CardContent className="pt-6 text-center">
            <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <Shield className="w-10 h-10 text-primary" />
            </div>
            <div className={`text-5xl font-bold ${getRiskColor(scores.overallScore)}`}>{scores.overallScore}</div>
            <div className="text-lg font-semibold text-foreground mt-1">RiskAssure Index</div>
            <Badge className={`mt-3 ${riskBadge.className}`}>{riskBadge.label}</Badge>
            <div className="mt-4 pt-4 border-t border-border text-sm text-muted-foreground">
              Weighted: Threat 25%, Vuln 25%, Dark Web 20%, Third-Party 20%, Rep 10%
            </div>
          </CardContent>
        </Card>

        {/* Score Cards */}
        <div className="lg:col-span-3 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {scoreCards.map((card) => {
            const scoreData = scores.scores[card.key as keyof typeof scores.scores]
            return (
              <Card key={card.key} className="bg-card border-border shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="pt-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className={`w-8 h-8 rounded-lg ${card.bgColor} flex items-center justify-center`}>
                        <card.icon className={`w-4 h-4 ${card.color}`} />
                      </div>
                      <span className="text-sm font-medium text-foreground">{card.label}</span>
                    </div>
                    <span className={`text-2xl font-bold ${card.color}`}>{scoreData.score}</span>
                  </div>
                  <Progress value={scoreData.score} className="h-1.5" />
                  <p className="text-xs text-muted-foreground mt-2 line-clamp-2">{scoreData.justification}</p>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>

      {/* Recent Scans & Favorites */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Scans */}
        <Card className="bg-card border-border shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Recent Scans</CardTitle>
            <Button variant="ghost" size="sm" className="text-primary" asChild>
              <Link href="/dashboard/reports">
                View All
                <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {companies.map((co) => (
                <Link
                  key={co.id}
                  href={`/dashboard/company/${co.id}`}
                  className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Shield className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <div className="font-medium text-foreground">{co.name}</div>
                      <div className="text-sm text-muted-foreground">{co.domain}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`text-xl font-bold ${getRiskColor(scores.overallScore)}`}>
                      {scores.overallScore}
                    </div>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="w-3 h-3" />
                      {co.lastScan}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Favorites */}
        <Card className="bg-card border-border shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Saved Companies</CardTitle>
            <Button variant="ghost" size="sm" className="text-primary">
              Manage
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {companies
                .filter((c) => c.isFavorite)
                .map((co) => (
                  <Link
                    key={co.id}
                    href={`/dashboard/company/${co.id}`}
                    className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
                      <div>
                        <div className="font-medium text-foreground">{co.name}</div>
                        <div className="text-sm text-muted-foreground">{co.industry}</div>
                      </div>
                    </div>
                    <Badge className={getRiskBadge(scores.overallScore).className}>
                      {getRiskBadge(scores.overallScore).label}
                    </Badge>
                  </Link>
                ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
