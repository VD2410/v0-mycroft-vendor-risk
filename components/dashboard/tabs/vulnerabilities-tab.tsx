"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Bug, ShieldCheck, AlertTriangle } from "lucide-react"

interface Vulnerability {
  cve_id?: string
  title?: string
  severity?: string
  cvss_score?: number
  description?: string
  published_date?: string
  patch_available?: boolean
}

interface VulnerabilitiesTabProps {
  vulnerabilities: Vulnerability[]
  score?: number
  reasoning?: string
}

export function VulnerabilitiesTab({ vulnerabilities, score, reasoning }: VulnerabilitiesTabProps) {
  const displayScore = score ?? 0

  const getRiskColor = (s: number) => {
    if (s >= 80) return "text-emerald-600"
    if (s >= 60) return "text-cyan-600"
    if (s >= 40) return "text-amber-600"
    return "text-red-600"
  }

  const getSeverityBadge = (severity?: string) => {
    const s = (severity || '').toLowerCase()
    if (s === 'critical') return "bg-red-100 text-red-700 border-red-200"
    if (s === 'high') return "bg-orange-100 text-orange-700 border-orange-200"
    if (s === 'medium') return "bg-amber-100 text-amber-700 border-amber-200"
    return "bg-green-100 text-green-700 border-green-200"
  }

  const criticalCount = vulnerabilities.filter(v => (v.severity || '').toLowerCase() === 'critical').length
  const highCount = vulnerabilities.filter(v => (v.severity || '').toLowerCase() === 'high').length
  const mediumCount = vulnerabilities.filter(v => (v.severity || '').toLowerCase() === 'medium').length
  const lowCount = vulnerabilities.filter(v => !['critical', 'high', 'medium'].includes((v.severity || '').toLowerCase())).length

  return (
    <div className="space-y-6">
      {/* Score Card */}
      <Card className="glass">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold text-foreground">Vulnerability Score</h3>
              <p className="text-sm text-muted-foreground">Based on CVE analysis and patch status</p>
            </div>
            <div className={`text-4xl font-bold ${getRiskColor(displayScore)}`}>{displayScore}<span className="text-lg text-muted-foreground">/100</span></div>
          </div>
          <Progress value={displayScore} className="h-2" />
        </CardContent>
      </Card>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="glass">
          <CardContent className="pt-4 text-center">
            <div className="text-2xl font-bold text-red-600">{criticalCount}</div>
            <div className="text-xs text-muted-foreground">Critical</div>
          </CardContent>
        </Card>
        <Card className="glass">
          <CardContent className="pt-4 text-center">
            <div className="text-2xl font-bold text-orange-600">{highCount}</div>
            <div className="text-xs text-muted-foreground">High</div>
          </CardContent>
        </Card>
        <Card className="glass">
          <CardContent className="pt-4 text-center">
            <div className="text-2xl font-bold text-amber-600">{mediumCount}</div>
            <div className="text-xs text-muted-foreground">Medium</div>
          </CardContent>
        </Card>
        <Card className="glass">
          <CardContent className="pt-4 text-center">
            <div className="text-2xl font-bold text-green-600">{lowCount}</div>
            <div className="text-xs text-muted-foreground">Low</div>
          </CardContent>
        </Card>
      </div>

      {/* Vulnerabilities List */}
      {vulnerabilities.length === 0 ? (
        <Card className="glass">
          <CardContent className="pt-6 text-center">
            <ShieldCheck className="w-12 h-12 text-emerald-500 mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-foreground mb-1">No Known Vulnerabilities</h3>
            <p className="text-sm text-muted-foreground">No CVEs or known vulnerabilities were detected for this company&apos;s infrastructure.</p>
          </CardContent>
        </Card>
      ) : (
        <Card className="glass">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Bug className="w-4 h-4" />
              Detected Vulnerabilities ({vulnerabilities.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {vulnerabilities.map((vuln, idx) => (
                <div key={idx} className="p-3 rounded-lg border border-border/50 bg-secondary/30">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        {vuln.cve_id && (
                          <Badge variant="outline" className="text-xs font-mono">{vuln.cve_id}</Badge>
                        )}
                        <Badge className={`text-xs ${getSeverityBadge(vuln.severity)}`}>
                          {vuln.severity || 'Unknown'}
                        </Badge>
                        {vuln.patch_available && (
                          <Badge variant="outline" className="text-xs bg-emerald-50 text-emerald-700 border-emerald-200">Patch Available</Badge>
                        )}
                      </div>
                      <p className="text-sm font-medium text-foreground">{vuln.title || vuln.cve_id || 'Vulnerability'}</p>
                      {vuln.description && (
                        <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{vuln.description}</p>
                      )}
                    </div>
                    {vuln.cvss_score && (
                      <div className="text-right">
                        <div className={`text-lg font-bold ${vuln.cvss_score >= 9 ? 'text-red-600' : vuln.cvss_score >= 7 ? 'text-orange-600' : 'text-amber-600'}`}>
                          {vuln.cvss_score}
                        </div>
                        <div className="text-xs text-muted-foreground">CVSS</div>
                      </div>
                    )}
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
