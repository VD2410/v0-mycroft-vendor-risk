"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, AlertTriangle, ArrowRight } from "lucide-react"

interface Action {
  priority: number
  title: string
  description: string
  framework?: string
}

interface ActionsTabProps {
  actions: Action[]
}

export function ActionsTab({ actions }: ActionsTabProps) {
  const getPriorityBadge = (priority: number) => {
    if (priority <= 2) return "bg-red-100 text-red-700 border-red-200"
    if (priority <= 4) return "bg-orange-100 text-orange-700 border-orange-200"
    if (priority <= 6) return "bg-amber-100 text-amber-700 border-amber-200"
    return "bg-green-100 text-green-700 border-green-200"
  }

  const getPriorityLabel = (priority: number) => {
    if (priority <= 2) return "Critical"
    if (priority <= 4) return "High"
    if (priority <= 6) return "Medium"
    return "Low"
  }

  return (
    <div className="space-y-6">
      {/* Summary */}
      <Card className="glass">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-foreground">Recommended Actions</h3>
              <p className="text-sm text-muted-foreground">Prioritized remediation steps based on risk assessment</p>
            </div>
            <Badge variant="outline" className="text-sm">{actions.length} items</Badge>
          </div>
        </CardContent>
      </Card>

      {/* Actions List */}
      {actions.length === 0 ? (
        <Card className="glass">
          <CardContent className="pt-6 text-center">
            <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-foreground mb-1">No Actions Required</h3>
            <p className="text-sm text-muted-foreground">No immediate remediation actions are recommended at this time.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {actions.map((action, idx) => (
            <Card key={idx} className="glass hover:shadow-md transition-shadow">
              <CardContent className="pt-4">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-sm font-bold text-primary">{action.priority}</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="text-sm font-semibold text-foreground">{action.title}</h4>
                      <Badge className={`text-xs ${getPriorityBadge(action.priority)}`}>
                        {getPriorityLabel(action.priority)}
                      </Badge>
                      {action.framework && (
                        <Badge variant="outline" className="text-xs">{action.framework}</Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">{action.description}</p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-muted-foreground flex-shrink-0 mt-1" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Framework Reference */}
      {actions.length > 0 && (
        <Card className="glass">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" />
              Remediation Priority Guide
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="p-2 rounded-lg bg-red-50 border border-red-200 text-center">
                <div className="text-xs font-medium text-red-700">Critical (1-2)</div>
                <div className="text-xs text-red-600">Immediate action</div>
              </div>
              <div className="p-2 rounded-lg bg-orange-50 border border-orange-200 text-center">
                <div className="text-xs font-medium text-orange-700">High (3-4)</div>
                <div className="text-xs text-orange-600">Within 7 days</div>
              </div>
              <div className="p-2 rounded-lg bg-amber-50 border border-amber-200 text-center">
                <div className="text-xs font-medium text-amber-700">Medium (5-6)</div>
                <div className="text-xs text-amber-600">Within 30 days</div>
              </div>
              <div className="p-2 rounded-lg bg-green-50 border border-green-200 text-center">
                <div className="text-xs font-medium text-green-700">Low (7+)</div>
                <div className="text-xs text-green-600">Within 90 days</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
