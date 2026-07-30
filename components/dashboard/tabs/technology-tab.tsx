"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Cpu, Server, Shield, Globe } from "lucide-react"

interface TechItem {
  name: string
  category?: string
  source?: string
  confidence?: string
}

interface TechnologyTabProps {
  techStack?: {
    stack?: TechItem[]
  }
  score?: number
}

const categoryIcons: Record<string, any> = {
  "Web Framework": Globe,
  "Programming Language": Cpu,
  "Server": Server,
  "Security": Shield,
  "CDN": Globe,
  "CMS": Globe,
  "Analytics": Cpu,
  "JavaScript Framework": Cpu,
}

const categoryColors: Record<string, string> = {
  "Web Framework": "bg-blue-100 text-blue-700 border-blue-200",
  "Programming Language": "bg-purple-100 text-purple-700 border-purple-200",
  "Server": "bg-green-100 text-green-700 border-green-200",
  "Security": "bg-emerald-100 text-emerald-700 border-emerald-200",
  "CDN": "bg-orange-100 text-orange-700 border-orange-200",
  "CMS": "bg-pink-100 text-pink-700 border-pink-200",
  "Analytics": "bg-cyan-100 text-cyan-700 border-cyan-200",
  "JavaScript Framework": "bg-yellow-100 text-yellow-700 border-yellow-200",
}

export function TechnologyTab({ techStack, score }: TechnologyTabProps) {
  const stack = techStack?.stack || []
  const displayScore = score ?? 0

  // Group technologies by category
  const grouped = stack.reduce((acc: Record<string, TechItem[]>, item) => {
    const cat = item.category || "Other"
    if (!acc[cat]) acc[cat] = []
    acc[cat].push(item)
    return acc
  }, {})

  const getRiskColor = (s: number) => {
    if (s >= 80) return "text-emerald-600"
    if (s >= 60) return "text-cyan-600"
    if (s >= 40) return "text-amber-600"
    return "text-red-600"
  }

  return (
    <div className="space-y-6">
      {/* Score Card */}
      <Card className="glass">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold text-foreground">Technology Security Score</h3>
              <p className="text-sm text-muted-foreground">Based on detected technology stack analysis</p>
            </div>
            <div className={`text-4xl font-bold ${getRiskColor(displayScore)}`}>{displayScore}<span className="text-lg text-muted-foreground">/100</span></div>
          </div>
          <Progress value={displayScore} className="h-2" />
        </CardContent>
      </Card>

      {/* Technology Stack */}
      {stack.length === 0 ? (
        <Card className="glass">
          <CardContent className="pt-6 text-center">
            <Cpu className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-foreground mb-1">No Technology Data Available</h3>
            <p className="text-sm text-muted-foreground">Technology stack information has not been collected for this company yet.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {Object.entries(grouped).map(([category, items]) => {
            const IconComponent = categoryIcons[category] || Cpu
            const colorClass = categoryColors[category] || "bg-gray-100 text-gray-700 border-gray-200"
            return (
              <Card key={category} className="glass">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <IconComponent className="w-4 h-4" />
                    {category}
                    <Badge variant="outline" className="ml-auto text-xs">{items.length}</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {items.map((tech, idx) => (
                    <div key={idx} className="flex items-center justify-between py-1.5 border-b border-border/50 last:border-0">
                      <span className="text-sm font-medium text-foreground">{tech.name}</span>
                      <div className="flex items-center gap-2">
                        {tech.confidence && (
                          <Badge variant="outline" className={`text-xs ${colorClass}`}>
                            {tech.confidence}
                          </Badge>
                        )}
                        {tech.source && (
                          <span className="text-xs text-muted-foreground">{tech.source}</span>
                        )}
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}

      {/* Summary */}
      <Card className="glass">
        <CardHeader>
          <CardTitle className="text-base">Technology Assessment</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-foreground">{stack.length}</div>
              <div className="text-sm text-muted-foreground">Technologies Detected</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-foreground">{Object.keys(grouped).length}</div>
              <div className="text-sm text-muted-foreground">Categories</div>
            </div>
            <div>
              <div className={`text-2xl font-bold ${getRiskColor(displayScore)}`}>{displayScore >= 80 ? 'Low' : displayScore >= 60 ? 'Moderate' : displayScore >= 40 ? 'High' : 'Critical'}</div>
              <div className="text-sm text-muted-foreground">Risk Level</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
