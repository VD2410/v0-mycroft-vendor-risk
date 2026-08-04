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
            Based on open-source intelligence analysis, <strong className="text-foreground">{company.name}</strong>{" "}
            ({company.domain}){company.location ? `, headquartered in ${company.location}` : ''}{company.industry ? `, operating in the ${company.industry} sector` : ''}, has been assessed across multiple risk dimensions.
            {scores.overallScore >= 80 && " The organization demonstrates strong cybersecurity posture with minimal identified risks. No critical vulnerabilities or significant dark web exposure were detected."}
            {scores.overallScore >= 60 && scores.overallScore < 80 && " The organization shows a moderate cybersecurity posture with some areas requiring attention. While no critical breaches were identified, certain risk factors warrant monitoring."}
            {scores.overallScore >= 40 && scores.overallScore < 60 && " The organization presents elevated cybersecurity risk across multiple dimensions. Several areas require immediate attention to reduce exposure."}
            {scores.overallScore < 40 && " The organization presents critical cybersecurity risk. Immediate remediation is recommended across multiple risk categories to prevent potential breaches."}
            {signals.length > 0 && ` Key findings include ${signals.length} notable signal${signals.length > 1 ? 's' : ''} across ${[...new Set(signals.map(s => s.category))].join(', ')} categories.`}
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
