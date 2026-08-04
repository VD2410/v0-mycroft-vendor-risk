"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Users, Building2, AlertTriangle, ShieldCheck } from "lucide-react"

interface Vendor {
  name: string
  domain?: string
  industry?: string
  vendor_security_score?: number
  critical_tier?: string
}

interface VendorsTabProps {
  vendors: Vendor[]
  score?: number
  reasoning?: string
}

export function VendorsTab({ vendors, score, reasoning }: VendorsTabProps) {
  const displayScore = score ?? 0

  const getRiskColor = (s: number) => {
    if (s >= 80) return "text-emerald-600"
    if (s >= 60) return "text-cyan-600"
    if (s >= 40) return "text-amber-600"
    return "text-red-600"
  }

  const getVendorScoreColor = (s?: number) => {
    if (!s) return "text-muted-foreground"
    if (s >= 80) return "text-emerald-600"
    if (s >= 60) return "text-cyan-600"
    if (s >= 40) return "text-amber-600"
    return "text-red-600"
  }

  const getTierBadge = (tier?: string) => {
    const t = (tier || '').toLowerCase()
    if (t.includes('critical') || t === '1') return "bg-red-100 text-red-700 border-red-200"
    if (t.includes('high') || t === '2') return "bg-orange-100 text-orange-700 border-orange-200"
    if (t.includes('medium') || t === '3') return "bg-amber-100 text-amber-700 border-amber-200"
    return "bg-green-100 text-green-700 border-green-200"
  }

  const criticalVendors = vendors.filter(v => v.vendor_security_score !== undefined && v.vendor_security_score < 50)
  const avgScore = vendors.length > 0
    ? Math.round(vendors.reduce((sum, v) => sum + (v.vendor_security_score || 0), 0) / vendors.filter(v => v.vendor_security_score).length)
    : 0

  return (
    <div className="space-y-6">
      {/* Score Card */}
      <Card className="glass">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold text-foreground">Third-Party Risk Score</h3>
              <p className="text-sm text-muted-foreground">Based on vendor security posture analysis</p>
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
            <div className="text-2xl font-bold text-foreground">{vendors.length}</div>
            <div className="text-xs text-muted-foreground">Total Vendors</div>
          </CardContent>
        </Card>
        <Card className="glass">
          <CardContent className="pt-4 text-center">
            <div className="text-2xl font-bold text-red-600">{criticalVendors.length}</div>
            <div className="text-xs text-muted-foreground">High Risk</div>
          </CardContent>
        </Card>
        <Card className="glass">
          <CardContent className="pt-4 text-center">
            <div className={`text-2xl font-bold ${getVendorScoreColor(avgScore)}`}>{avgScore || 'N/A'}</div>
            <div className="text-xs text-muted-foreground">Avg Score</div>
          </CardContent>
        </Card>
        <Card className="glass">
          <CardContent className="pt-4 text-center">
            <div className="text-2xl font-bold text-foreground">{[...new Set(vendors.map(v => v.industry).filter(Boolean))].length}</div>
            <div className="text-xs text-muted-foreground">Industries</div>
          </CardContent>
        </Card>
      </div>

      {/* Vendors List */}
      {vendors.length === 0 ? (
        <Card className="glass">
          <CardContent className="pt-6 text-center">
            <ShieldCheck className="w-12 h-12 text-emerald-500 mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-foreground mb-1">No Vendor Data Available</h3>
            <p className="text-sm text-muted-foreground">Third-party vendor information has not been collected for this company yet.</p>
          </CardContent>
        </Card>
      ) : (
        <Card className="glass">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Users className="w-4 h-4" />
              Third-Party Vendors ({vendors.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {vendors.map((vendor, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 rounded-lg border border-border/50 bg-secondary/30 hover:bg-secondary/50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Building2 className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-foreground">{vendor.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {vendor.domain && <span>{vendor.domain}</span>}
                        {vendor.industry && <span> · {vendor.industry}</span>}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {vendor.critical_tier && (
                      <Badge className={`text-xs ${getTierBadge(vendor.critical_tier)}`}>
                        Tier {vendor.critical_tier}
                      </Badge>
                    )}
                    {vendor.vendor_security_score !== undefined && (
                      <div className={`text-lg font-bold ${getVendorScoreColor(vendor.vendor_security_score)}`}>
                        {vendor.vendor_security_score}
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
