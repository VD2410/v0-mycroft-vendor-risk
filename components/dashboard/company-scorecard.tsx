"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { companies, mycroftScores, signalData, recommendedActions } from "@/lib/mock-data"
import { Shield, Bug, Globe, Users, Download, RefreshCw, Star, Clock, FileText } from "lucide-react"
import { OverviewTab } from "./tabs/overview-tab"
import { TechnologyTab } from "./tabs/technology-tab"
import { VulnerabilitiesTab } from "./tabs/vulnerabilities-tab"
import { VendorsTab } from "./tabs/vendors-tab"
import { DarkWebTab } from "./tabs/darkweb-tab"
import { SentimentTab } from "./tabs/sentiment-tab"
import { ActionsTab } from "./tabs/actions-tab"

interface CompanyScorecardProps {
  companyId: string
}

export function CompanyScorecard({ companyId }: CompanyScorecardProps) {
  const company = companies.find((c) => c.id === companyId) || companies[0]
  const scores = mycroftScores
  const [isFavorite, setIsFavorite] = useState(company.isFavorite)

  const getRiskColor = (score: number) => {
    if (score >= 80) return "text-emerald-600"
    if (score >= 60) return "text-[#0891B2]"
    if (score >= 40) return "text-amber-600"
    return "text-red-600"
  }

  const getRiskBadge = (score: number) => {
    if (score >= 80) return { label: "Low Risk", className: "bg-emerald-100 text-emerald-700 border-emerald-200" }
    if (score >= 60) return { label: "Moderate Risk", className: "bg-cyan-100 text-cyan-700 border-cyan-200" }
    if (score >= 40) return { label: "High Risk", className: "bg-amber-100 text-amber-700 border-amber-200" }
    return { label: "Critical", className: "bg-red-100 text-red-700 border-red-200" }
  }

  const riskBadge = getRiskBadge(scores.overallScore)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-xl bg-primary/10 flex items-center justify-center">
            <Shield className="w-8 h-8 text-primary" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-foreground">{company.name}</h1>
              <button onClick={() => setIsFavorite(!isFavorite)}>
                <Star className={`w-5 h-5 ${isFavorite ? "text-amber-500 fill-amber-500" : "text-muted-foreground"}`} />
              </button>
            </div>
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <span>{company.domain}</span>
              <span>-</span>
              <span>{company.industry}</span>
              <span>-</span>
              <span>{company.location}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <RefreshCw className="w-4 h-4 mr-2" />
            Re-scan
          </Button>
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            PDF
          </Button>
          <Button variant="outline" size="sm">
            <FileText className="w-4 h-4 mr-2" />
            CSV
          </Button>
        </div>
      </div>

      {/* Score Summary Cards */}
      <div className="grid md:grid-cols-6 gap-4">
        <Card className="md:col-span-2 bg-card border-border shadow-md">
          <CardContent className="pt-6 text-center">
            <div className={`text-5xl font-bold ${getRiskColor(scores.overallScore)}`}>{scores.overallScore}</div>
            <div className="text-sm font-medium text-foreground mt-1">RiskAssure Index</div>
            <Badge className={`mt-2 ${riskBadge.className}`}>{riskBadge.label}</Badge>
            <div className="flex items-center justify-center gap-1 text-xs text-muted-foreground mt-3">
              <Clock className="w-3 h-3" />
              Last scanned: {company.lastScan}
            </div>
          </CardContent>
        </Card>

        {[
          { key: "cyberThreat", icon: Shield, label: "Threat", color: "text-[#4F46E5]", bgColor: "bg-[#4F46E5]/10" },
          { key: "vulnerability", icon: Bug, label: "Vuln", color: "text-[#2563EB]", bgColor: "bg-[#2563EB]/10" },
          { key: "darkWeb", icon: Globe, label: "Dark Web", color: "text-[#06B6D4]", bgColor: "bg-[#06B6D4]/10" },
          { key: "thirdParty", icon: Users, label: "3rd Party", color: "text-[#38BDF8]", bgColor: "bg-[#38BDF8]/10" },
        ].map((item) => {
          const scoreData = scores.scores[item.key as keyof typeof scores.scores]
          return (
            <Card key={item.key} className="bg-card border-border shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="pt-4 text-center">
                <div className={`w-8 h-8 rounded-lg ${item.bgColor} flex items-center justify-center mx-auto mb-1`}>
                  <item.icon className={`w-4 h-4 ${item.color}`} />
                </div>
                <div className={`text-2xl font-bold ${item.color}`}>{scoreData.score}</div>
                <div className="text-xs text-muted-foreground">{item.label}</div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Tabs */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="bg-muted p-1 h-auto flex-wrap">
          <TabsTrigger
            value="overview"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            Overview
          </TabsTrigger>
          <TabsTrigger
            value="technology"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            Technology
          </TabsTrigger>
          <TabsTrigger
            value="vulnerabilities"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            Vulnerabilities
          </TabsTrigger>
          <TabsTrigger
            value="vendors"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            Third-Party
          </TabsTrigger>
          <TabsTrigger
            value="darkweb"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            Dark Web
          </TabsTrigger>
          <TabsTrigger
            value="sentiment"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            Sentiment
          </TabsTrigger>
          <TabsTrigger
            value="actions"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            Actions
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <OverviewTab company={company} scores={scores} signals={signalData} />
        </TabsContent>
        <TabsContent value="technology">
          <TechnologyTab />
        </TabsContent>
        <TabsContent value="vulnerabilities">
          <VulnerabilitiesTab />
        </TabsContent>
        <TabsContent value="vendors">
          <VendorsTab />
        </TabsContent>
        <TabsContent value="darkweb">
          <DarkWebTab />
        </TabsContent>
        <TabsContent value="sentiment">
          <SentimentTab />
        </TabsContent>
        <TabsContent value="actions">
          <ActionsTab actions={recommendedActions} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
