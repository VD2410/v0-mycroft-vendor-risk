"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Code, Cloud, Lock, GitBranch, Server } from "lucide-react"

const techStack = [
  { category: "Cloud Providers", items: ["AWS", "Azure", "GCP"], icon: Cloud },
  { category: "Source Control", items: ["GitHub", "GitLab", "Bitbucket"], icon: GitBranch },
  { category: "Identity Providers", items: ["Okta", "Azure AD", "Google Workspace"], icon: Lock },
  { category: "Infrastructure", items: ["API Gateway", "Serverless Functions", "CDN"], icon: Server },
]

const integrations = [
  { name: "AWS", type: "Cloud", risk: "Medium", access: "Read/Write" },
  { name: "Azure", type: "Cloud", risk: "Medium", access: "Read/Write" },
  { name: "GCP", type: "Cloud", risk: "Medium", access: "Read/Write" },
  { name: "GitHub", type: "SCM", risk: "High", access: "Read/Write" },
  { name: "GitLab", type: "SCM", risk: "High", access: "Read/Write" },
  { name: "Okta", type: "Identity", risk: "Critical", access: "Read" },
  { name: "Jira", type: "Ticketing", risk: "Low", access: "Read/Write" },
  { name: "Slack", type: "Messaging", risk: "Low", access: "Read" },
]

export function TechnologyTab() {
  return (
    <div className="space-y-6">
      {/* Score Card */}
      <Card className="glass">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-chart-4/20 flex items-center justify-center">
                <Code className="w-6 h-6 text-chart-4" />
              </div>
              <div>
                <div className="text-2xl font-bold text-chart-4">65/100</div>
                <div className="text-sm text-muted-foreground">Technology Exposure Score</div>
              </div>
            </div>
            <Badge className="bg-chart-4/20 text-chart-4 border-chart-4/30">Moderate Exposure</Badge>
          </div>
          <Progress value={65} className="h-2 mt-4" />
        </CardContent>
      </Card>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Tech Stack */}
        <Card className="glass">
          <CardHeader>
            <CardTitle className="text-base">Detected Technology Stack</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {techStack.map((category) => (
              <div key={category.category} className="space-y-2">
                <div className="flex items-center gap-2">
                  <category.icon className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm font-medium text-foreground">{category.category}</span>
                </div>
                <div className="flex flex-wrap gap-2 pl-6">
                  {category.items.map((item) => (
                    <Badge key={item} variant="secondary">
                      {item}
                    </Badge>
                  ))}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Integration Surface */}
        <Card className="glass">
          <CardHeader>
            <CardTitle className="text-base">Integration Surface (150-250+ tools)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {integrations.map((int) => (
                <div key={int.name} className="flex items-center justify-between p-2 rounded-lg bg-secondary/50">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded bg-accent/20 flex items-center justify-center text-xs font-mono text-accent">
                      {int.name.slice(0, 2)}
                    </div>
                    <div>
                      <div className="text-sm font-medium text-foreground">{int.name}</div>
                      <div className="text-xs text-muted-foreground">{int.type}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge
                      variant="outline"
                      className={
                        int.risk === "Critical"
                          ? "border-destructive/50 text-destructive"
                          : int.risk === "High"
                            ? "border-chart-2/50 text-chart-2"
                            : int.risk === "Medium"
                              ? "border-chart-4/50 text-chart-4"
                              : "border-chart-1/50 text-chart-1"
                      }
                    >
                      {int.risk}
                    </Badge>
                    <span className="text-xs text-muted-foreground">{int.access}</span>
                  </div>
                </div>
              ))}
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
            AI-native platform with agentic automation; integrates with AWS, Azure, GCP, GitHub, GitLab, Bitbucket and
            ~150–250+ tools; performs cloud config checks, device management, codebase and infra scans, evidence
            collection via APIs. This extensive integration surface creates significant blast radius if the platform is
            compromised—similar to competitors Vanta and Drata but with less historical proof of secure operation.
          </p>
          <div className="mt-4 p-3 rounded-lg bg-chart-4/10 border border-chart-4/20">
            <div className="font-medium text-foreground text-sm">Mitigation Suggestion</div>
            <p className="text-sm text-muted-foreground mt-1">
              Ask for independent AppSec results (SAST/DAST, supply-chain scanning). Verify secure SDLC and how they
              test their agents' actions.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
