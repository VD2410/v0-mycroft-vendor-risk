"use client"
import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Shield, Bug, Globe, Users, Download, RefreshCw, Clock, FileText, Loader2, AlertCircle } from "lucide-react"
import { OverviewTab } from "./tabs/overview-tab"
import { TechnologyTab } from "./tabs/technology-tab"
import { VulnerabilitiesTab } from "./tabs/vulnerabilities-tab"
import { VendorsTab } from "./tabs/vendors-tab"
import { DarkWebTab } from "./tabs/darkweb-tab"
import { SentimentTab } from "./tabs/sentiment-tab"
import { ActionsTab } from "./tabs/actions-tab"
import { getApiBaseUrl } from "@/lib/api"

const getBackendUrl = () => getApiBaseUrl();

interface CompanyScorecardProps {
  companyId: string
}

export function CompanyScorecard({ companyId }: CompanyScorecardProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [company, setCompany] = useState<any>(null)
  const [scores, setScores] = useState<any>(null)
  const [detailData, setDetailData] = useState<any>(null)

  const parseScore = (val: any): number => {
    const num = Number(val)
    return isNaN(num) ? 0 : num
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)
        setError(null)

        const response = await fetch(`${getBackendUrl()}/api/dashboard/${companyId}`)
        if (!response.ok) {
          throw new Error(`Failed to load company data (${response.status})`)
        }

        const data = await response.json()

        // Set company info
        setCompany({
          id: companyId,
          name: data.company?.name || 'Unknown',
          domain: data.company?.domain || '',
          industry: data.company?.industry || '',
          location: data.company?.location || '',
          founded: data.company?.year_founded ? String(data.company.year_founded) : 'N/A',
          employees: data.company?.employee_count ? data.company.employee_count.toLocaleString() : 'N/A',
          funding: 'N/A',
          lastScan: data.scores?.updated_at ? new Date(data.scores.updated_at).toLocaleDateString() : 'Recently',
        })

        // Set scores
        const scoreData = data.scores || {}
        setScores({
          overallScore: parseScore(scoreData.overall_score),
          scores: {
            cyberThreat: {
              score: parseScore(scoreData.firmographic),
              label: "Cyber Threat Score",
              justification: scoreData.firmographic_risk_reasoning || "No data available",
            },
            vulnerability: {
              score: parseScore(scoreData.vulnerability),
              label: "Vulnerability Score",
              justification: scoreData.vulnerability_risk_reasoning || "No data available",
            },
            darkWeb: {
              score: parseScore(scoreData.dark_web_and_political),
              label: "Dark Web Score",
              justification: scoreData.dark_web_risk_reasoning || "No data available",
            },
            thirdParty: {
              score: parseScore(scoreData.third_party_risk),
              label: "Third-Party Risk Score",
              justification: scoreData.vendor_risk_reasoning || "No data available",
            },
            reputation: {
              score: parseScore(scoreData.sentiment),
              label: "Reputation Score",
              justification: scoreData.sentiment_risk_reasoning || "No data available",
            },
          },
        })

        // Set detail data for tabs
        setDetailData({
          vendors: data.vendors || [],
          articles: data.articles || [],
          techStack: data.techStack || {},
          dataLeaks: data.dataLeaks || [],
          vulnerabilities: data.vulnerabilities || [],
          actionItems: scoreData.action_items || [],
        })
      } catch (err) {
        console.error("Error fetching company scorecard data:", err)
        setError(err instanceof Error ? err.message : "Failed to load data")
      } finally {
        setIsLoading(false)
      }
    }

    if (companyId) {
      fetchData()
    }
  }, [companyId])

  // PDF Export handler
  const handleExportPDF = () => {
    if (!company || !scores) return
    const printContent = generatePrintContent()
    const printWindow = window.open('', '_blank')
    if (printWindow) {
      printWindow.document.write(printContent)
      printWindow.document.close()
      printWindow.onload = () => {
        printWindow.print()
      }
    }
  }

  // CSV Export handler
  const handleExportCSV = () => {
    if (!company || !scores || !detailData) return
    const csvRows: string[] = []
    csvRows.push('Category,Item,Details,Score/Status')
    csvRows.push(`Company,${company.name},${company.domain},${scores.overallScore}`)
    csvRows.push(`Industry,${company.industry || 'N/A'},,`)
    csvRows.push(`Location,${company.location || 'N/A'},,`)
    csvRows.push(`Employees,${company.employees || 'N/A'},,`)
    csvRows.push('')
    csvRows.push('Score Category,Score,Risk Level,Reasoning')
    Object.entries(scores.scores).forEach(([key, data]: [string, any]) => {
      csvRows.push(`"${data.label}",${data.score},${getRiskBadge(data.score).label},"${(data.justification || '').replace(/"/g, '""')}"`)
    })
    csvRows.push('')
    csvRows.push('Vendor Name,Domain,Industry,Security Score,Tier')
    detailData.vendors.forEach((v: any) => {
      csvRows.push(`"${v.name}","${v.domain || ''}","${v.industry || ''}",${v.vendor_security_score || 'N/A'},"${v.critical_tier || ''}"`)
    })
    csvRows.push('')
    const stackItems = detailData.techStack?.stack || []
    csvRows.push('Technology,Category,Source,Confidence')
    stackItems.forEach((t: any) => {
      csvRows.push(`"${t.name}","${t.category || ''}","${t.source || ''}","${t.confidence || ''}"`)
    })
    csvRows.push('')
    csvRows.push('Article Title,Source,Sentiment,Date')
    detailData.articles.forEach((a: any) => {
      csvRows.push(`"${(a.title || '').replace(/"/g, '""')}","${a.source || ''}","${a.sentiment || ''}","${a.article_published_date || ''}"`)
    })

    const csvContent = csvRows.join('\n')
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `${company.name.replace(/\s+/g, '_')}_RiskAssure_Report.csv`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  const generatePrintContent = () => {
    const riskBadge = getRiskBadge(scores.overallScore)
    const vendorRows = (detailData?.vendors || []).map((v: any) =>
      `<tr><td>${v.name}</td><td>${v.domain || ''}</td><td>${v.vendor_security_score || 'N/A'}</td><td>${v.critical_tier || ''}</td></tr>`
    ).join('')
    const techItems = (detailData?.techStack?.stack || []).map((t: any) =>
      `<tr><td>${t.name}</td><td>${t.category || ''}</td><td>${t.confidence || ''}</td></tr>`
    ).join('')
    const articleRows = (detailData?.articles || []).map((a: any) =>
      `<tr><td>${a.title || ''}</td><td>${a.source || ''}</td><td>${a.sentiment || ''}</td></tr>`
    ).join('')

    return `<!DOCTYPE html><html><head><title>${company?.name} - RiskAssure Report</title>
    <style>
      body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; padding: 40px; color: #1a1a2e; }
      h1 { color: #0f3460; border-bottom: 2px solid #0f3460; padding-bottom: 10px; }
      h2 { color: #16213e; margin-top: 30px; }
      table { width: 100%; border-collapse: collapse; margin: 10px 0 20px; }
      th, td { border: 1px solid #ddd; padding: 8px; text-align: left; font-size: 13px; }
      th { background: #f0f4f8; font-weight: 600; }
      .meta { color: #666; font-size: 13px; }
      @media print { body { padding: 20px; } }
    </style></head><body>
    <h1>RiskAssure Report: ${company?.name}</h1>
    <p class="meta">Domain: ${company?.domain} | Industry: ${company?.industry || 'N/A'} | Generated: ${new Date().toLocaleDateString()}</p>
    <h2>Risk Scores</h2>
    <table><tr><th>Category</th><th>Score</th><th>Risk Level</th><th>Reasoning</th></tr>
    <tr><td><strong>Overall</strong></td><td><strong>${scores.overallScore}</strong></td><td>${riskBadge.label}</td><td></td></tr>
    ${Object.entries(scores.scores).map(([, data]: [string, any]) => `<tr><td>${data.label}</td><td>${data.score}</td><td>${getRiskBadge(data.score).label}</td><td style="font-size:11px">${data.justification || ''}</td></tr>`).join('')}
    </table>
    <h2>Third-Party Vendors (${(detailData?.vendors || []).length})</h2>
    <table><tr><th>Name</th><th>Domain</th><th>Security Score</th><th>Tier</th></tr>${vendorRows}</table>
    <h2>Technology Stack</h2>
    <table><tr><th>Technology</th><th>Category</th><th>Confidence</th></tr>${techItems}</table>
    <h2>News & Articles (${(detailData?.articles || []).length})</h2>
    <table><tr><th>Title</th><th>Source</th><th>Sentiment</th></tr>${articleRows}</table>
    ${(detailData?.vulnerabilities || []).length > 0 ? `<h2>Vulnerabilities (${detailData?.vulnerabilities.length})</h2><p>CVE details available in full report.</p>` : '<h2>Vulnerabilities</h2><p>No known vulnerabilities detected.</p>'}
    ${(detailData?.dataLeaks || []).length > 0 ? `<h2>Data Leaks (${detailData?.dataLeaks.length})</h2><p>Dark web exposure details available in full report.</p>` : '<h2>Data Leaks</h2><p>No data leaks detected.</p>'}
    </body></html>`
  }

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

  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Card className="max-w-md w-full">
          <CardContent className="pt-6 flex items-center justify-center gap-3">
            <Loader2 className="w-5 h-5 animate-spin text-primary" />
            <p className="text-muted-foreground">Loading company data...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Error state
  if (error || !scores || !company) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Card className="max-w-md w-full">
          <CardContent className="pt-6 text-center">
            <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-8 h-8 text-red-600" />
            </div>
            <h2 className="text-xl font-semibold text-foreground mb-2">Error Loading Data</h2>
            <p className="text-muted-foreground mb-4">{error || 'Could not load company data.'}</p>
            <Button onClick={() => window.location.reload()}>Try Again</Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const riskBadge = getRiskBadge(scores.overallScore)

  // Build signals from detail data for OverviewTab
  const signals = [
    ...(detailData?.vendors || []).slice(0, 3).map((v: any, i: number) => ({
      id: i + 1,
      category: "Third-Party",
      source: v.domain || v.name,
      finding: `${v.name} (${v.industry || 'vendor'}) - Security Score: ${v.vendor_security_score || 'N/A'}`,
      severity: v.vendor_security_score && v.vendor_security_score < 50 ? "High" : "Medium",
      confidence: "High",
    })),
    ...(detailData?.articles || []).filter((a: any) => a.sentiment === 'negative').slice(0, 2).map((a: any, i: number) => ({
      id: 100 + i,
      category: "Reputation",
      source: a.source || 'News',
      finding: a.title || 'Negative article detected',
      severity: "Medium",
      confidence: "High",
    })),
    ...(detailData?.vulnerabilities || []).slice(0, 2).map((v: any, i: number) => ({
      id: 200 + i,
      category: "Vulnerability",
      source: "CVE Database",
      finding: v.cve_id || v.title || 'Vulnerability detected',
      severity: "High",
      confidence: "High",
    })),
  ]

  // Build recommended actions from detail data
  const recommendedActions = (detailData?.actionItems || []).map((a: any, i: number) => ({
    priority: i + 1,
    title: a.title || 'Action Item',
    description: a.description || '',
    framework: a.category || 'General',
  }))

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-xl bg-primary/10 flex items-center justify-center">
            <Shield className="w-8 h-8 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">{company.name}</h1>
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <span>{company.domain}</span>
              {company.industry && <><span>-</span><span>{company.industry}</span></>}
              {company.location && <><span>-</span><span>{company.location}</span></>}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => window.location.reload()}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Re-scan
          </Button>
          <Button variant="outline" size="sm" onClick={handleExportPDF}>
            <Download className="w-4 h-4 mr-2" />
            PDF
          </Button>
          <Button variant="outline" size="sm" onClick={handleExportCSV}>
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
          <TabsTrigger value="overview" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Overview</TabsTrigger>
          <TabsTrigger value="technology" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Technology</TabsTrigger>
          <TabsTrigger value="vulnerabilities" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Vulnerabilities</TabsTrigger>
          <TabsTrigger value="vendors" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Third-Party</TabsTrigger>
          <TabsTrigger value="darkweb" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Dark Web</TabsTrigger>
          <TabsTrigger value="sentiment" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Sentiment</TabsTrigger>
          <TabsTrigger value="actions" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Actions</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <OverviewTab company={company} scores={scores} signals={signals} />
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
