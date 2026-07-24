"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { companies, mycroftScores, signalData } from "@/lib/mock-data"
import { Search, Filter, Download, Eye, ChevronLeft, ChevronRight } from "lucide-react"
import Link from "next/link"

const severityColors: Record<string, string> = {
  Low: "bg-emerald-500/10 text-emerald-500 border-emerald-500/30",
  Medium: "bg-[#06B6D4]/10 text-[#06B6D4] border-[#06B6D4]/30",
  High: "bg-amber-500/10 text-amber-500 border-amber-500/30",
  Critical: "bg-destructive/10 text-destructive border-destructive/30",
  Info: "bg-secondary text-secondary-foreground",
}

const confidenceColors: Record<string, string> = {
  High: "text-emerald-500",
  Medium: "text-[#06B6D4]",
  "Low-Medium": "text-[#38BDF8]",
  Low: "text-muted-foreground",
}

export function ReportsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [categoryFilter, setCategoryFilter] = useState<string>("all")
  const [severityFilter, setSeverityFilter] = useState<string>("all")
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 5

  const filteredSignals = signalData.filter((signal) => {
    const matchesSearch =
      signal.finding.toLowerCase().includes(searchQuery.toLowerCase()) ||
      signal.source.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = categoryFilter === "all" || signal.category === categoryFilter
    const matchesSeverity = severityFilter === "all" || signal.severity === severityFilter
    return matchesSearch && matchesCategory && matchesSeverity
  })

  const totalPages = Math.ceil(filteredSignals.length / itemsPerPage)
  const paginatedSignals = filteredSignals.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  const categories = [...new Set(signalData.map((s) => s.category))]
  const severities = [...new Set(signalData.map((s) => s.severity))]

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Signal Evidence Reports</h1>
          <p className="text-muted-foreground">Detailed OSINT findings with source provenance</p>
        </div>
        <Button variant="outline">
          <Download className="w-4 h-4 mr-2" />
          Export All
        </Button>
      </div>

      {/* Filters */}
      <Card className="bg-card border-border">
        <CardContent className="pt-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search signals..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-secondary border-border"
              />
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full sm:w-48 bg-secondary border-border">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={severityFilter} onValueChange={setSeverityFilter}>
              <SelectTrigger className="w-full sm:w-48 bg-secondary border-border">
                <SelectValue placeholder="Severity" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Severities</SelectItem>
                {severities.map((sev) => (
                  <SelectItem key={sev} value={sev}>
                    {sev}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Signal Table */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-base">Signal Collection Table ({filteredSignals.length} signals)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Category</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Source</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Finding</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Severity</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Confidence</th>
                </tr>
              </thead>
              <tbody>
                {paginatedSignals.map((signal) => (
                  <tr key={signal.id} className="border-b border-border/50 hover:bg-secondary/30">
                    <td className="py-3 px-4">
                      <Badge variant="outline" className="text-xs">
                        {signal.category}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-sm text-muted-foreground max-w-[200px] truncate">{signal.source}</td>
                    <td className="py-3 px-4 text-sm text-foreground max-w-md">{signal.finding}</td>
                    <td className="py-3 px-4">
                      <Badge className={severityColors[signal.severity] || "bg-secondary"}>{signal.severity}</Badge>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`text-sm font-medium ${confidenceColors[signal.confidence] || ""}`}>
                        {signal.confidence}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
            <div className="text-sm text-muted-foreground">
              Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
              {Math.min(currentPage * itemsPerPage, filteredSignals.length)} of {filteredSignals.length}
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <span className="text-sm text-foreground">
                Page {currentPage} of {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Company Reports */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-base">Company Reports</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {companies.map((company) => (
              <div key={company.id} className="flex items-center justify-between p-4 rounded-lg bg-secondary/50">
                <div>
                  <div className="font-medium text-foreground">{company.name}</div>
                  <div className="text-sm text-muted-foreground">{company.domain}</div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <div className="text-xl font-bold text-[#06B6D4]">{mycroftScores.overallScore}</div>
                    <div className="text-xs text-muted-foreground">Last: {company.lastScan}</div>
                  </div>
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/dashboard/company/${company.id}`}>
                      <Eye className="w-4 h-4 mr-1" />
                      View
                    </Link>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
