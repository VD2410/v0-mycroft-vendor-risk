"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Globe, ShieldCheck, AlertTriangle, Eye } from "lucide-react"

interface DataLeak {
  source?: string
  date?: string
  description?: string
  severity?: string
  breach_name?: string
  data_classes?: string[]
  records_exposed?: number
}

interface DarkWebTabProps {
  dataLeaks: DataLeak[]
  score?: number
  reasoning?: string
}

export function DarkWebTab({ dataLeaks, score, reasoning }: DarkWebTabProps) {
  const displayScore = score ?? 0

  const getRiskColor = (s: number) => {
    if (s >= 80) return "text-emerald-600"
    if (s >= 60) return "text-cyan-600"
    if (s >= 40) return "text-amber-600"
    return "text-red-600"
  }

  const getSeverityBadge = (severity?: string) => {
    const s = (severity || '').toLowerCase()
    if (s === 'critical' || s === 'high') return "bg-red-100 text-red-700 border-red-200"
    if (s === 'medium') return "bg-amber-100 text-amber-700 border-amber-200"
    return "bg-green-100 text-green-700 border-green-200"
  }

  return (
    <div className="space-y-6">
      {/* Score Card */}
      <Card className="glass">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold text-foreground">Dark Web & Breach Score</h3>
              <p className="text-sm text-muted-foreground">Based on breach databases and dark web monitoring</p>
            </div>
            <div className={`text-4xl font-bold ${getRiskColor(displayScore)}`}>{displayScore}<span className="text-lg text-muted-foreground">/100</span></div>
          </div>
          <Progress value={displayScore} className="h-2" />
        </CardContent>
      </Card>

      {/* Data Leaks */}
      {dataLeaks.length === 0 ? (
        <Card className="glass">
          <CardContent className="pt-6 text-center">
            <ShieldCheck className="w-12 h-12 text-emerald-500 mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-foreground mb-1">No Dark Web Exposure Detected</h3>
            <p className="text-sm text-muted-foreground">No data leaks, breaches, or dark web mentions were found for this organization.</p>
          </CardContent>
        </Card>
      ) : (
        <Card className="glass">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Eye className="w-4 h-4" />
              Data Leaks & Breaches ({dataLeaks.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {dataLeaks.map((leak, idx) => (
                <div key={idx} className="p-3 rounded-lg border border-border/50 bg-secondary/30">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Globe className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm font-medium text-foreground">{leak.breach_name || leak.source || 'Unknown Source'}</span>
                        {leak.severity && (
                          <Badge className={`text-xs ${getSeverityBadge(leak.severity)}`}>
                            {leak.severity}
                          </Badge>
                        )}
                      </div>
                      {leak.description && (
                        <p className="text-xs text-muted-foreground mt-1">{leak.description}</p>
                      )}
                      {leak.data_classes && leak.data_classes.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {leak.data_classes.map((dc, i) => (
                            <Badge key={i} variant="outline" className="text-xs">{dc}</Badge>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="text-right">
                      {leak.date && <div className="text-xs text-muted-foreground">{leak.date}</div>}
                      {leak.records_exposed && (
                        <div className="text-sm font-bold text-red-600 mt-1">{leak.records_exposed.toLocaleString()} records</div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Reasoning */}
      {reasoning && (
        <Card className="glass">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" />
              Analysis & Reasoning
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground leading-relaxed">{reasoning}</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
