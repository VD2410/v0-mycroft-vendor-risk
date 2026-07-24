"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Shield, Bug, Globe, Users, Eye, Building2, MapPin, Calendar, DollarSign } from "lucide-react"

interface OverviewTabProps {
  company: {
    name: string
    domain: string
    industry: string
    location: string
    founded: string
    employees: string
    funding: string
  }
  scores: {
    overallScore: number
    scores: {
      cyberThreat: { score: number; label: string; justification: string }
      vulnerability: { score: number; label: string; justification: string }
      darkWeb: { score: number; label: string; justification: string }
      thirdParty: { score: number; label: string; justification: string }
      reputation: { score: number; label: string; justification: string }
    }
  }
  signals: Array<{
    id: number
    category: string
    source: string
    finding: string
    severity: string
    confidence: string
  }>
}

const scoreConfig = [
  { key: "cyberThreat", icon: Shield, color: "text-chart-4", bgColor: "bg-chart-4/20" },
  { key: "vulnerability", icon: Bug, color: "text-chart-1", bgColor: "bg-chart-1/20" },
  { key: "darkWeb", icon: Globe, color: "text-accent", bgColor: "bg-accent/20" },
  { key: "thirdParty", icon: Users, color: "text-chart-2", bgColor: "bg-chart-2/20" },
  { key: "reputation", icon: Eye, color: "text-chart-1", bgColor: "bg-chart-1/20" },
]

export function OverviewTab({ company, scores, signals }: OverviewTabProps) {
  return (
    <div className="grid lg:grid-cols-3 gap-6">
      {/* Company Info */}
      <Card className="glass">
        <CardHeader>
          <CardTitle className="text-base">Company Profile</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-3">
            <Building2 className="w-4 h-4 text-muted-foreground" />
            <div>
              <div className="text-sm text-muted-foreground">Industry</div>
              <div className="text-foreground">{company.industry}</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <MapPin className="w-4 h-4 text-muted-foreground" />
            <div>
              <div className="text-sm text-muted-foreground">Location</div>
              <div className="text-foreground">{company.location}</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Calendar className="w-4 h-4 text-muted-foreground" />
            <div>
              <div className="text-sm text-muted-foreground">Founded</div>
              <div className="text-foreground">{company.founded}</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Users className="w-4 h-4 text-muted-foreground" />
            <div>
              <div className="text-sm text-muted-foreground">Employees</div>
              <div className="text-foreground">{company.employees}</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <DollarSign className="w-4 h-4 text-muted-foreground" />
            <div>
              <div className="text-sm text-muted-foreground">Funding</div>
              <div className="text-foreground">{company.funding}</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Score Justifications */}
      <Card className="lg:col-span-2 glass">
        <CardHeader>
          <CardTitle className="text-base">Score Breakdown & Justification</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {scoreConfig.map((config) => {
            const scoreData = scores.scores[config.key as keyof typeof scores.scores]
            return (
              <div key={config.key} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`w-8 h-8 rounded-lg ${config.bgColor} flex items-center justify-center`}>
                      <config.icon className={`w-4 h-4 ${config.color}`} />
                    </div>
                    <span className="font-medium text-foreground">{scoreData.label}</span>
                  </div>
                  <span className={`text-xl font-bold ${config.color}`}>{scoreData.score}/100</span>
                </div>
                <Progress value={scoreData.score} className="h-2" />
                <p className="text-sm text-muted-foreground">{scoreData.justification}</p>
              </div>
            )
          })}
        </CardContent>
      </Card>

      {/* Executive Summary */}
      <Card className="lg:col-span-3 glass">
        <CardHeader>
          <CardTitle className="text-base">Executive Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground leading-relaxed">
            Based on open-source intelligence as of 8 Dec 2025, <strong className="text-foreground">Mycroft</strong>{" "}
            (mycroft.io) is a 2024-founded, Toronto-based, AI-native security and compliance SaaS platform that
            positions itself as an "AI Security and Compliance Officer" consolidating cloud security, device management,
            GRC, and audit readiness for B2B SaaS and similar companies. No public evidence of breaches or CVEs specific
            to Mycroft's current platform was found. Mycroft's extensive integration surface (150–250+ SaaS and cloud
            platforms) and agentic automation create meaningful concentration and third-party risk, but the company is
            backed by notable cybersecurity/fintech investors and is clearly oriented around SOC 2 / ISO 27001-style
            controls. Overall, we assess Mycroft's vendor risk as <strong className="text-chart-4">Moderate</strong>{" "}
            versus peers like Vanta, Drata, Thoropass, and Scrut—comparable architectural risk, but with a shorter
            operational track record and smaller footprint.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
