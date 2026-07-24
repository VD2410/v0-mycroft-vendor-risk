"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { companies, historicalScores } from "@/lib/mock-data"
import { RefreshCw, TrendingUp, TrendingDown, Minus, Shield, Bug, Globe, Users, Eye } from "lucide-react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts"
import { useState } from "react"

const scoreMetrics = [
  { key: "overall", label: "Overall Index", color: "#4F46E5", icon: Shield },
  { key: "threat", label: "Cyber Threat", color: "#6366F1", icon: Shield },
  { key: "vuln", label: "Vulnerability", color: "#2563EB", icon: Bug },
  { key: "darkWeb", label: "Dark Web", color: "#06B6D4", icon: Globe },
  { key: "thirdParty", label: "Third-Party", color: "#38BDF8", icon: Users },
  { key: "reputation", label: "Reputation", color: "#10B981", icon: Eye },
]

export function TrendsPage() {
  const [selectedCompany, setSelectedCompany] = useState("mycroft")
  const [timeRange, setTimeRange] = useState("3m")

  const company = companies.find((c) => c.id === selectedCompany) || companies[0]

  const latestScore = historicalScores[historicalScores.length - 1]
  const previousScore = historicalScores[historicalScores.length - 2]

  const getTrend = (current: number, previous: number) => {
    const diff = current - previous
    if (diff > 0) return { direction: "up", value: diff, icon: TrendingUp, color: "text-emerald-500" }
    if (diff < 0) return { direction: "down", value: Math.abs(diff), icon: TrendingDown, color: "text-destructive" }
    return { direction: "flat", value: 0, icon: Minus, color: "text-muted-foreground" }
  }

  const trends = {
    overall: getTrend(latestScore.overall, previousScore.overall),
    threat: getTrend(latestScore.threat, previousScore.threat),
    vuln: getTrend(latestScore.vuln, previousScore.vuln),
    darkWeb: getTrend(latestScore.darkWeb, previousScore.darkWeb),
    thirdParty: getTrend(latestScore.thirdParty, previousScore.thirdParty),
    reputation: getTrend(latestScore.reputation, previousScore.reputation),
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Historical Trends</h1>
          <p className="text-muted-foreground">Track risk score changes over time</p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={selectedCompany} onValueChange={setSelectedCompany}>
            <SelectTrigger className="w-48 bg-secondary border-border">
              <SelectValue placeholder="Select company" />
            </SelectTrigger>
            <SelectContent>
              {companies.map((c) => (
                <SelectItem key={c.id} value={c.id}>
                  {c.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-32 bg-secondary border-border">
              <SelectValue placeholder="Time range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1m">1 Month</SelectItem>
              <SelectItem value="3m">3 Months</SelectItem>
              <SelectItem value="6m">6 Months</SelectItem>
              <SelectItem value="1y">1 Year</SelectItem>
            </SelectContent>
          </Select>
          <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
            <RefreshCw className="w-4 h-4 mr-2" />
            Re-scan
          </Button>
        </div>
      </div>

      {/* Current Scores with Trends */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {scoreMetrics.map((metric) => {
          const trend = trends[metric.key as keyof typeof trends]
          const currentValue = latestScore[metric.key as keyof typeof latestScore]
          return (
            <Card key={metric.key} className="bg-card border-border">
              <CardContent className="pt-4">
                <div className="flex items-center justify-between mb-2">
                  <metric.icon className="w-4 h-4 text-muted-foreground" />
                  <div className={`flex items-center gap-1 text-xs ${trend.color}`}>
                    <trend.icon className="w-3 h-3" />
                    {trend.value > 0 && `+${trend.value}`}
                  </div>
                </div>
                <div className="text-2xl font-bold" style={{ color: metric.color }}>
                  {currentValue}
                </div>
                <div className="text-xs text-muted-foreground">{metric.label}</div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Main Chart */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-base">Score History - {company.name}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={historicalScores}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis
                  dataKey="date"
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                  tickFormatter={(value) =>
                    new Date(value).toLocaleDateString("en-US", { month: "short", day: "numeric" })
                  }
                />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} domain={[0, 100]} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                  labelStyle={{ color: "hsl(var(--foreground))" }}
                />
                <Legend />
                <Line type="monotone" dataKey="overall" stroke="#4F46E5" strokeWidth={2} dot={false} name="Overall" />
                <Line type="monotone" dataKey="threat" stroke="#6366F1" strokeWidth={1.5} dot={false} name="Threat" />
                <Line type="monotone" dataKey="vuln" stroke="#2563EB" strokeWidth={1.5} dot={false} name="Vuln" />
                <Line
                  type="monotone"
                  dataKey="darkWeb"
                  stroke="#06B6D4"
                  strokeWidth={1.5}
                  dot={false}
                  name="Dark Web"
                />
                <Line
                  type="monotone"
                  dataKey="thirdParty"
                  stroke="#38BDF8"
                  strokeWidth={1.5}
                  dot={false}
                  name="3rd Party"
                />
                <Line
                  type="monotone"
                  dataKey="reputation"
                  stroke="#10B981"
                  strokeWidth={1.5}
                  dot={false}
                  name="Reputation"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Score Change Summary */}
      <div className="grid lg:grid-cols-2 gap-6">
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-base">Score Change Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {scoreMetrics.map((metric) => {
                const trend = trends[metric.key as keyof typeof trends]
                const current = latestScore[metric.key as keyof typeof latestScore]
                const previous = previousScore[metric.key as keyof typeof previousScore]
                return (
                  <div key={metric.key} className="flex items-center justify-between p-3 rounded-lg bg-secondary/50">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: metric.color }} />
                      <span className="text-sm text-foreground">{metric.label}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-sm text-muted-foreground">{previous}</span>
                      <span className="text-muted-foreground">-</span>
                      <span className="text-sm font-medium text-foreground">{current}</span>
                      <Badge
                        className={`${trend.direction === "up" ? "bg-emerald-500/10 text-emerald-500" : trend.direction === "down" ? "bg-destructive/10 text-destructive" : "bg-secondary text-secondary-foreground"}`}
                      >
                        {trend.direction === "up" ? "+" : trend.direction === "down" ? "-" : ""}
                        {trend.value}
                      </Badge>
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-base">Scan History</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {historicalScores
                .slice()
                .reverse()
                .map((scan, i) => (
                  <div key={scan.date} className="flex items-center justify-between p-3 rounded-lg bg-secondary/50">
                    <div>
                      <div className="text-sm font-medium text-foreground">
                        {new Date(scan.date).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {i === 0 ? "Latest scan" : `${i * 15} days ago`}
                      </div>
                    </div>
                    <div className="text-xl font-bold text-[#4F46E5]">{scan.overall}</div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
