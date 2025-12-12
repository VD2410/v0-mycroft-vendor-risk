"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, AlertTriangle, Shield, Clock } from "lucide-react"

interface ActionsTabProps {
  actions: Array<{
    priority: number
    title: string
    description: string
    framework: string
  }>
}

const allActions = [
  {
    priority: 1,
    title: "Require Scoped Integration Design",
    description:
      "Require Mycroft to use least-privilege scopes for all integrations – cloud, IdP, SCM, ticketing. Enforce strict separation of read-only monitoring vs. write/remediation permissions and require change-control for any privilege escalation.",
    framework: "SOC 2 CC6, CC7 | NIST PR.AC, PR.DS",
    category: "Technical",
  },
  {
    priority: 2,
    title: "Request Tenant Isolation Documentation",
    description:
      "Request architectural documentation on multi-tenant data isolation (per-tenant keys, logical vs. physical segregation, access control enforcement). Require evidence that cross-tenant access is tested.",
    framework: "ISO 27001 A.8, A.9 | SOC 2 CC6",
    category: "Technical",
  },
  {
    priority: 3,
    title: "Validate Compliance Roadmap",
    description:
      "Require roadmap and timelines for Mycroft's own SOC 2 Type II / ISO 27001 attestations; review any existing internal/external audits. Make provision of annual audit reports a contractual obligation.",
    framework: "NIST CSF PR.IP | SOC 2 CC1",
    category: "Procedural",
  },
  {
    priority: 4,
    title: "Define Incident Response SLAs",
    description:
      "Contractually define notification SLAs, required detail (root cause, blast radius, data types affected, compensating controls), and cooperation during forensic investigations.",
    framework: "NIST RS.RP, RS.CO | SOC 2 CC7",
    category: "Contractual",
  },
  {
    priority: 5,
    title: "Verify Secure SDLC Practices",
    description:
      "Confirm they operate: protected main branches, mandatory review, SAST/DAST, SBOM, and dependency-vulnerability scanning before release. Include mandatory annual third-party pentest + fix SLAs in contract.",
    framework: "NIST PR.DS-4 | ISO 27001 A.12",
    category: "Technical",
  },
  {
    priority: 6,
    title: "Enforce Access & Identity Controls",
    description:
      "Enforce SSO + MFA requirement for administrative dashboards. Confirm strict RBAC for Mycroft's internal support/ops staff with activity logging, JIT elevation, and periodic access reviews.",
    framework: "SOC 2 CC6 | NIST PR.AC",
    category: "Technical",
  },
]

export function ActionsTab({ actions }: ActionsTabProps) {
  return (
    <div className="space-y-6">
      {/* Priority Actions */}
      <Card className="glass glow-accent">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-accent" />
            Top 3 Priority Actions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {allActions.slice(0, 3).map((action) => (
              <div key={action.priority} className="p-4 rounded-lg bg-accent/10 border border-accent/20">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center shrink-0">
                    <span className="text-sm font-bold text-accent">{action.priority}</span>
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-foreground">{action.title}</div>
                    <p className="text-sm text-muted-foreground mt-1">{action.description}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant="outline" className="text-xs">
                        {action.category}
                      </Badge>
                      <span className="text-xs text-muted-foreground">{action.framework}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* All Actions */}
      <Card className="glass">
        <CardHeader>
          <CardTitle className="text-base">Complete Action List</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {allActions.map((action) => (
              <div key={action.priority} className="flex items-start gap-3 p-3 rounded-lg bg-secondary/50">
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${
                    action.priority <= 3 ? "bg-accent/20 text-accent" : "bg-secondary text-muted-foreground"
                  }`}
                >
                  <span className="text-xs font-bold">{action.priority}</span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-foreground">{action.title}</span>
                    <Badge variant="outline" className="text-xs">
                      {action.category}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{action.description}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Framework Mapping */}
      <Card className="glass">
        <CardHeader>
          <CardTitle className="text-base">Compliance Framework Mapping</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-lg bg-secondary/50 text-center">
              <Shield className="w-8 h-8 text-accent mx-auto mb-2" />
              <div className="font-medium text-foreground">SOC 2</div>
              <div className="text-xs text-muted-foreground mt-1">CC3, CC6, CC7, A1, C1, P1-P6, PI1</div>
            </div>
            <div className="p-4 rounded-lg bg-secondary/50 text-center">
              <CheckCircle className="w-8 h-8 text-accent mx-auto mb-2" />
              <div className="font-medium text-foreground">NIST CSF</div>
              <div className="text-xs text-muted-foreground mt-1">ID.AM, PR.AC, PR.DS, DE.CM, RS.RP, RS.CO</div>
            </div>
            <div className="p-4 rounded-lg bg-secondary/50 text-center">
              <Clock className="w-8 h-8 text-accent mx-auto mb-2" />
              <div className="font-medium text-foreground">ISO 27001</div>
              <div className="text-xs text-muted-foreground mt-1">A.8, A.9, A.12, A.13</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
