"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Shield, Bug, Globe, Users, Eye, Clock, Loader2, AlertCircle, RefreshCw, Server, Newspaper, Lock, ExternalLink, Download, FileText, ChevronDown, ChevronUp } from "lucide-react"
import Link from "next/link"
import { supabase } from "@/lib/supabase"
import { getApiBaseUrl } from "@/lib/api"

// Use proxy to avoid mixed content issues (HTTPS page calling HTTP backend)
const getBackendUrl = () => getApiBaseUrl();

/**
 * Auth headers for backend data calls. These endpoints are being moved behind
 * real authentication; sending the token now is harmless while the backend
 * still accepts anonymous reads, and means the enforcing release needs no
 * coordinated frontend change.
 */
async function authHeaders(): Promise<Record<string, string>> {
  try {
    const { data: { session } } = await supabase.auth.getSession()
    return session?.access_token ? { Authorization: `Bearer ${session.access_token}` } : {}
  } catch {
    return {}
  }
}


// Capture URL company param at module load time (before any replaceState)
const initialUrlCompanyId = typeof window !== 'undefined' ? new URLSearchParams(window.location.search).get('company') : null;

const scoreCards = [
  { key: "cyberThreat", label: "Firmographic", icon: Shield, color: "text-[#4F46E5]", bgColor: "bg-[#4F46E5]/10" },
  { key: "vulnerability", label: "Vulnerability", icon: Bug, color: "text-[#2563EB]", bgColor: "bg-[#2563EB]/10" },
  { key: "darkWeb", label: "Dark Web", icon: Globe, color: "text-[#06B6D4]", bgColor: "bg-[#06B6D4]/10" },
  { key: "thirdParty", label: "Third-Party", icon: Users, color: "text-[#38BDF8]", bgColor: "bg-[#38BDF8]/10" },
  { key: "reputation", label: "Reputation", icon: Eye, color: "text-primary", bgColor: "bg-primary/10" },
]

function getRiskColor(score: number) {
  if (score >= 85) return "text-emerald-600"
  if (score >= 70) return "text-[#0891B2]"
  if (score >= 50) return "text-amber-600"
  return "text-red-600"
}

function getRiskBadge(score: number) {
  if (score >= 85)
    return {
      label: "Low Risk",
      variant: "default" as const,
      className: "bg-emerald-100 text-emerald-700 border-emerald-200",
    }
  if (score >= 70)
    return {
      label: "Moderate Risk",
      variant: "secondary" as const,
      className: "bg-cyan-100 text-cyan-700 border-cyan-200",
    }
  if (score >= 50)
    return {
      label: "High Risk",
      variant: "secondary" as const,
      className: "bg-amber-100 text-amber-700 border-amber-200",
    }
  return { label: "Critical", variant: "destructive" as const, className: "bg-red-100 text-red-700 border-red-200" }
}

function getVendorScoreColor(score: number | null) {
  if (score === null) return "text-muted-foreground"
  if (score >= 80) return "text-emerald-600"
  if (score >= 60) return "text-cyan-600"
  if (score >= 40) return "text-amber-600"
  return "text-red-600"
}

function getSentimentColor(sentiment: string) {
  if (sentiment === 'positive') return "bg-emerald-100 text-emerald-700"
  if (sentiment === 'negative') return "bg-red-100 text-red-700"
  return "bg-gray-100 text-gray-700"
}

interface CompanyData {
  companyId: number
  companyName: string
  companyDomain: string
  industry?: string
  companyLocation?: string
  employeeCount?: number
  scores?: {
    overall?: number | string
    darkWebAndPolitical?: number | string
    breachPrediction?: number | string
    vulnerability?: number | string
    thirdPartyRisk?: number | string
    firmographic?: number | string
    sentiment?: number | string
  }
  reasoning?: {
    overall?: string
    firmographic?: string
    vendor?: string
    vulnerability?: string
    sentiment?: string
    darkWeb?: string
  }
  scoreUpdatedAt?: string
}

interface DashboardDetailData {
  vendors: any[]
  articles: any[]
  techStack: any
  dataLeaks: any[]
  vulnerabilities: any[]
  actionItems: any[]
}

export function DashboardHome() {
  const [companyData, setCompanyData] = useState<CompanyData | null>(null)
  const [detailData, setDetailData] = useState<DashboardDetailData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [noCompanyFound, setNoCompanyFound] = useState(false)
  const [isRescanning, setIsRescanning] = useState(false)
  const [expandedSection, setExpandedSection] = useState<string | null>("vendors")
  const urlCompanyIdRef = useRef<string | null>(initialUrlCompanyId)

  // Build scores object from API data
  const parseScore = (val: any): number => {
    const num = Number(val)
    return isNaN(num) ? 0 : num
  }

  const scores = companyData?.scores ? {
    overallScore: parseScore(companyData.scores.overall),
    scores: {
      // This card was labelled "Cyber Threat" while showing the firmographic
      // score — company size and industry profile, not threat exposure. On a
      // cyber-risk product that is the most misleading label on the screen.
      cyberThreat: {
        score: parseScore(companyData.scores.firmographic),
        label: "Firmographic Score",
        justification: companyData.reasoning?.firmographic || "No data available",
      },
      vulnerability: {
        score: parseScore(companyData.scores.vulnerability),
        label: "Vulnerability Score",
        justification: companyData.reasoning?.vulnerability || "No data available",
      },
      darkWeb: {
        score: parseScore(companyData.scores.darkWebAndPolitical),
        label: "Dark Web Score",
        justification: companyData.reasoning?.darkWeb || "No data available",
      },
      thirdParty: {
        score: parseScore(companyData.scores.thirdPartyRisk),
        label: "Third-Party Risk Score",
        justification: companyData.reasoning?.vendor || "No data available",
      },
      reputation: {
        score: parseScore(companyData.scores.sentiment),
        label: "Reputation Score",
        justification: companyData.reasoning?.sentiment || "No data available",
      },
    },
  } : { overallScore: 0, scores: { cyberThreat: { score: 0, label: "Firmographic Score", justification: "" }, vulnerability: { score: 0, label: "Vulnerability Score", justification: "" }, darkWeb: { score: 0, label: "Dark Web Score", justification: "" }, thirdParty: { score: 0, label: "Third-Party Risk Score", justification: "" }, reputation: { score: 0, label: "Reputation Score", justification: "" } } }

  const riskBadge = getRiskBadge(scores.overallScore)

  /**
   * How much evidence sits behind each sub-score. Derived from the data the
   * dashboard already loads, so no schema change is needed. Returns null for
   * dimensions whose evidence we don't surface on this page.
   */
  const evidenceFor = (key: string): { count: number; noun: string } | null => {
    if (!detailData) return null
    switch (key) {
      case "vulnerability":
        return { count: detailData.vulnerabilities?.length ?? 0, noun: "CVEs or exposed services" }
      case "darkWeb":
        return { count: detailData.dataLeaks?.length ?? 0, noun: "breach or credential-leak records" }
      case "reputation":
        return { count: detailData.articles?.length ?? 0, noun: "news coverage" }
      case "thirdParty":
        return { count: detailData.vendors?.length ?? 0, noun: "third-party vendors" }
      default:
        return null
    }
  }

  // PDF Export handler
  const handleExportPDF = () => {
    if (!companyData) return
    // Use browser print with a styled view
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
    if (!companyData || !detailData) return
    const csvRows: string[] = []
    // Header
    csvRows.push('Category,Item,Details,Score/Status')
    // Company info
    csvRows.push(`Company,${companyData.companyName},${companyData.companyDomain},${scores.overallScore}`)
    csvRows.push(`Industry,${companyData.industry || 'N/A'},,`)
    csvRows.push(`Location,${companyData.companyLocation || 'N/A'},,`)
    csvRows.push(`Employees,${companyData.employeeCount || 'N/A'},,`)
    csvRows.push('')
    // Scores
    csvRows.push('Score Category,Score,Risk Level,Reasoning')
    csvRows.push(`Overall,${scores.overallScore},${riskBadge.label},`)
    Object.entries(scores.scores).forEach(([key, data]) => {
      csvRows.push(`"${data.label}",${data.score},${getRiskBadge(data.score).label},"${(data.justification || '').replace(/"/g, '""')}"`)
    })
    csvRows.push('')
    // Vendors
    csvRows.push('Vendor Name,Domain,Industry,Security Score,Tier')
    detailData.vendors.forEach((v: any) => {
      csvRows.push(`"${v.name}","${v.domain || ''}","${v.industry || ''}",${v.vendor_security_score || 'N/A'},"${v.critical_tier || ''}"`)
    })
    csvRows.push('')
    // Tech Stack
    const stackItems = detailData.techStack?.stack || []
    csvRows.push('Technology,Category,Source,Confidence')
    stackItems.forEach((t: any) => {
      csvRows.push(`"${t.name}","${t.category || ''}","${t.source || ''}","${t.confidence || ''}"`)
    })
    csvRows.push('')
    // Articles
    csvRows.push('Article Title,Source,Sentiment,Date')
    detailData.articles.forEach((a: any) => {
      csvRows.push(`"${(a.title || '').replace(/"/g, '""')}","${a.source || ''}","${a.sentiment || ''}","${a.article_published_date || ''}"`)
    })
    // Download
    const csvContent = csvRows.join('\n')
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `${companyData.companyName.replace(/\s+/g, '_')}_RiskAssure_Report.csv`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  // Generate print-friendly HTML for PDF export
  const generatePrintContent = () => {
    const vendorRows = (detailData?.vendors || []).map((v: any) =>
      `<tr><td>${v.name}</td><td>${v.domain || ''}</td><td>${v.vendor_security_score || 'N/A'}</td><td>${v.critical_tier || ''}</td></tr>`
    ).join('')
    const techItems = (detailData?.techStack?.stack || []).map((t: any) =>
      `<tr><td>${t.name}</td><td>${t.category || ''}</td><td>${t.confidence || ''}</td></tr>`
    ).join('')
    const articleRows = (detailData?.articles || []).map((a: any) =>
      `<tr><td>${a.title || ''}</td><td>${a.source || ''}</td><td>${a.sentiment || ''}</td></tr>`
    ).join('')

    return `<!DOCTYPE html><html><head><title>${companyData?.companyName} - RiskAssure Report</title>
    <style>
      body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; padding: 40px; color: #1a1a2e; }
      h1 { color: #0f3460; border-bottom: 2px solid #0f3460; padding-bottom: 10px; }
      h2 { color: #16213e; margin-top: 30px; }
      table { width: 100%; border-collapse: collapse; margin: 10px 0 20px; }
      th, td { border: 1px solid #ddd; padding: 8px; text-align: left; font-size: 13px; }
      th { background: #f0f4f8; font-weight: 600; }
      .score-box { display: inline-block; padding: 4px 12px; border-radius: 4px; font-weight: bold; margin: 4px; }
      .meta { color: #666; font-size: 13px; }
      @media print { body { padding: 20px; } }
    </style></head><body>
    <h1>RiskAssure Report: ${companyData?.companyName}</h1>
    <p class="meta">Domain: ${companyData?.companyDomain} | Industry: ${companyData?.industry || 'N/A'} | Generated: ${new Date().toLocaleDateString()}</p>
    <h2>Risk Scores</h2>
    <table><tr><th>Category</th><th>Score</th><th>Risk Level</th><th>Reasoning</th></tr>
    <tr><td><strong>Overall</strong></td><td><strong>${scores.overallScore}</strong></td><td>${riskBadge.label}</td><td></td></tr>
    ${Object.entries(scores.scores).map(([, data]) => `<tr><td>${data.label}</td><td>${data.score}</td><td>${getRiskBadge(data.score).label}</td><td style="font-size:11px">${data.justification || ''}</td></tr>`).join('')}
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

  // Rescan handler
  const handleRescan = async () => {
    if (!companyData?.companyName || !companyData?.companyDomain) return
    setIsRescanning(true)
    try {
      const response = await fetch(`${getBackendUrl()}/api/scan`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          companyName: companyData.companyName,
          domain: companyData.companyDomain,
        }),
      })
      if (response.ok) {
        setTimeout(() => {
          window.location.reload()
        }, 3000)
      } else {
        const errData = await response.json().catch(() => ({}))
        setError(errData.error || 'Rescan failed. Please try again.')
        setIsRescanning(false)
      }
    } catch (err) {
      setError('Rescan failed. Please try again.')
      setIsRescanning(false)
    }
  }

  // Toggle section expansion
  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section)
  }

  useEffect(() => {
    const fetchCompanyData = async () => {
      try {
        setIsLoading(true)
        setError(null)
        setNoCompanyFound(false)

        // Get current session
        const { data: { session } } = await supabase.auth.getSession()

        if (!session?.user?.id) {
          console.log("No user session found")
          setNoCompanyFound(true)
          setIsLoading(false)
          return
        }

        const uid = session.user.id
        console.log("User UID:", uid)

        // Step 1: Try user_company_access first (supports multi-company, used by header dropdown)
        try {
          const companiesResponse = await fetch(`${getBackendUrl()}/api/v1/user/${uid}/companies`, { headers: await authHeaders() })
          if (companiesResponse.ok) {
            const companiesResult = await companiesResponse.json()
            if (companiesResult.status && companiesResult.body?.length > 0) {
              // Use URL param (captured at module load) > localStorage > primary > first
              const urlCompanyId = urlCompanyIdRef.current
              if (urlCompanyId) {
                localStorage.setItem('wisr_company_id', urlCompanyId)
                urlCompanyIdRef.current = null // consume it
              }
              const storedId = urlCompanyId || localStorage.getItem('wisr_company_id')
              const storedMatch = storedId ? companiesResult.body.find((c: any) => c.company_id === parseInt(storedId)) : null
              const activeCompany = storedMatch || companiesResult.body.find((c: any) => c.is_primary) || companiesResult.body[0]
              
              console.log(`[DashboardHome] storedId=${storedId}, storedMatch=${storedMatch?.company_name}, activeCompany=${activeCompany?.company_name} ${activeCompany?.company_id}`)
              
              if (activeCompany?.company_id) {
                // Only update localStorage if we had to fallback (stored company not found)
                if (!storedMatch) {
                  localStorage.setItem('wisr_company_id', String(activeCompany.company_id))
                  localStorage.setItem('wisr_company_name', activeCompany.company_name || '')
                  localStorage.setItem('wisr_company_domain', activeCompany.company_domain || '')
                  console.log(`[DashboardHome] Updated localStorage to ${activeCompany.company_name} ${activeCompany.company_id}`)
                }
                
                // Fetch full company data using the company ID
                const lookupResponse = await fetch(`${getBackendUrl()}/api/v1/company/by-domain/${encodeURIComponent(activeCompany.company_domain)}`, { headers: await authHeaders() })
                if (lookupResponse.ok) {
                  const lookupResult = await lookupResponse.json()
                  if (lookupResult.status && lookupResult.body) {
                    setCompanyData({
                      companyId: lookupResult.body.companyId,
                      companyName: lookupResult.body.companyName,
                      companyDomain: lookupResult.body.domain,
                      industry: lookupResult.body.industry,
                      companyLocation: lookupResult.body.location,
                      employeeCount: lookupResult.body.employeeCount,
                      scores: lookupResult.body.scores,
                      reasoning: lookupResult.body.reasoning,
                      scoreUpdatedAt: lookupResult.body.scoreUpdatedAt,
                    })
                    
                    // Fetch detailed dashboard data
                    fetchDetailData(lookupResult.body.companyId)
                    setIsLoading(false)
                    return
                  }
                }
              }
            }
          }
        } catch (companiesError) {
          console.log("Could not fetch user companies, falling back to onboarding:", companiesError)
        }

        // Step 2: Fallback to onboarding data if no user_company_access entries
        try {
          const onboardingResponse = await fetch(`${getBackendUrl()}/api/v1/company/onboarding/${uid}`, { headers: await authHeaders() })
          
          if (!onboardingResponse.ok) {
            console.log("No onboarding data found for user")
            setNoCompanyFound(true)
            setIsLoading(false)
            return
          }

          const onboardingResult = await onboardingResponse.json()
          console.log("Onboarding data:", onboardingResult)

          if (!onboardingResult.status || !onboardingResult.body) {
            setNoCompanyFound(true)
            setIsLoading(false)
            return
          }

          const onboardingData = onboardingResult.body
          const domain = onboardingData.companyWebsite?.replace(/^https?:\/\//, '').replace(/\/$/, '')

          if (!domain) {
            setNoCompanyFound(true)
            setIsLoading(false)
            return
          }

          // Look up company by domain
          const lookupResponse = await fetch(`${getBackendUrl()}/api/v1/company/by-domain/${encodeURIComponent(domain)}`, { headers: await authHeaders() })
          
          if (!lookupResponse.ok) {
            setCompanyData({
              companyId: 0,
              companyName: onboardingData.companyName,
              companyDomain: domain,
            })
            setIsLoading(false)
            return
          }

          const lookupResult = await lookupResponse.json()
          console.log("Company lookup result:", lookupResult)

          if (lookupResult.status && lookupResult.body) {
            localStorage.setItem('wisr_company_id', String(lookupResult.body.companyId))
            localStorage.setItem('wisr_company_name', lookupResult.body.companyName || '')
            localStorage.setItem('wisr_company_domain', lookupResult.body.domain || '')
            
            setCompanyData({
              companyId: lookupResult.body.companyId,
              companyName: lookupResult.body.companyName,
              companyDomain: lookupResult.body.domain,
              industry: lookupResult.body.industry,
              companyLocation: lookupResult.body.location,
              employeeCount: lookupResult.body.employeeCount,
              scores: lookupResult.body.scores,
              reasoning: lookupResult.body.reasoning,
              scoreUpdatedAt: lookupResult.body.scoreUpdatedAt,
            })
            
            // Fetch detailed dashboard data
            fetchDetailData(lookupResult.body.companyId)
          }
        } catch (apiError) {
          console.error("Error fetching company data:", apiError)
          setError("Failed to load company data")
        }
      } catch (err) {
        console.error("Error in fetchCompanyData:", err)
        setError(err instanceof Error ? err.message : "An error occurred")
      } finally {
        setIsLoading(false)
      }
    }

    fetchCompanyData()
  }, [])

  // Fetch detailed data from /api/dashboard/:companyId
  const fetchDetailData = async (companyId: number) => {
    try {
      const response = await fetch(`${getBackendUrl()}/api/dashboard/${companyId}`, { headers: await authHeaders() })
      if (response.ok) {
        const data = await response.json()
        setDetailData({
          vendors: data.vendors || [],
          articles: data.articles || [],
          techStack: data.techStack || {},
          dataLeaks: data.dataLeaks || [],
          vulnerabilities: data.vulnerabilities || [],
          actionItems: data.scores?.action_items || [],
        })
      }
    } catch (err) {
      console.error("Error fetching dashboard details:", err)
    }
  }

  // Show "No Company Found" state
  if (noCompanyFound && !isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Card className="max-w-md w-full">
          <CardContent className="pt-6 text-center">
            <div className="w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-8 h-8 text-amber-600" />
            </div>
            <h2 className="text-xl font-semibold text-foreground mb-2">No Company Found</h2>
            <p className="text-muted-foreground mb-6">
              You need to sign up and scan your company to view the dashboard
            </p>
            <div className="space-y-3">
              <Button className="w-full" asChild>
                <Link href="/signup">Sign Up & Scan Your Company</Link>
              </Button>
              <Button variant="outline" className="w-full" asChild>
                <Link href="/signin">Sign In to Existing Account</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Loading State */}
      {isLoading && (
        <Card className="bg-card border-border">
          <CardContent className="pt-6 flex items-center justify-center gap-3">
            <Loader2 className="w-5 h-5 animate-spin text-primary" />
            <p className="text-muted-foreground">Loading company data...</p>
          </CardContent>
        </Card>
      )}

      {/* Error State */}
      {error && !isLoading && (
        <Card className="bg-red-50 border-red-200">
          <CardContent className="pt-6">
            <p className="text-red-700">{error}</p>
          </CardContent>
        </Card>
      )}

      {/* Company Info Display with Rescan + Export Buttons */}
      {companyData && !isLoading && (
        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div className="flex items-center gap-4">
                <Shield className="w-8 h-8 text-primary" />
                <div>
                  <h2 className="text-lg font-semibold text-foreground">{companyData.companyName}</h2>
                  <p className="text-sm text-muted-foreground">{companyData.companyDomain}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                {companyData.industry && (
                  <Badge variant="outline" className="text-xs">
                    {companyData.industry}
                  </Badge>
                )}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleExportPDF}
                  className="gap-1"
                >
                  <Download className="w-3.5 h-3.5" />
                  PDF
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleExportCSV}
                  className="gap-1"
                >
                  <FileText className="w-3.5 h-3.5" />
                  CSV
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleRescan}
                  disabled={isRescanning}
                  className="gap-1"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isRescanning ? 'animate-spin' : ''}`} />
                  {isRescanning ? 'Scanning...' : 'Rescan'}
                </Button>
              </div>
            </div>
            <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground flex-wrap">
              {companyData.companyLocation && companyData.companyLocation !== 'null' && companyData.companyLocation !== 'undefined' && (
                <span>📍 {companyData.companyLocation}</span>
              )}
              {companyData.employeeCount && (
                <span>👥 {companyData.employeeCount.toLocaleString()} employees</span>
              )}
              {companyData.scoreUpdatedAt && (
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  Last scanned: {new Date(companyData.scoreUpdatedAt).toLocaleDateString()}
                </span>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Overall Score & Quick Stats */}
      <div className="grid lg:grid-cols-4 gap-6">
        {/* Main Score Card */}
        <Card className="lg:col-span-1 bg-card border-border shadow-md">
          <CardContent className="pt-6 text-center">
            <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <Shield className="w-10 h-10 text-primary" />
            </div>
            <div className={`text-5xl font-bold ${getRiskColor(scores.overallScore)}`}>{scores.overallScore}</div>
            <div className="text-lg font-semibold text-foreground mt-1">RiskAssure Index</div>
            <Badge className={`mt-3 ${riskBadge.className}`}>{riskBadge.label}</Badge>
            <div className="mt-4 pt-4 border-t border-border text-sm text-muted-foreground">
              Weighted: Vulnerability 22%, Security Posture 18%, Dark Web 18%, Third-Party 15%,
              Breach Prediction 10%, Reputation 8%, Firmographic 5%, IP Reputation 4%
            </div>
          </CardContent>
        </Card>

        {/* Score Cards */}
        <div className="lg:col-span-3 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {scoreCards.map((card) => {
            const scoreData = scores.scores[card.key as keyof typeof scores.scores]
            const ev = evidenceFor(card.key)
            // A dimension with no evidence behind it produces the scorer's
            // default (vulnerability 92, dark web 78). Showing that as a
            // confident number is the single most misleading thing this
            // dashboard can do, so say plainly when nothing was found.
            const thin = ev !== null && ev.count === 0
            return (
              <Card key={card.key} className="bg-card border-border shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="pt-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className={`w-8 h-8 rounded-lg ${card.bgColor} flex items-center justify-center`}>
                        <card.icon className={`w-4 h-4 ${card.color}`} />
                      </div>
                      <span className="text-sm font-medium text-foreground">{card.label}</span>
                    </div>
                    <span className={`text-2xl font-bold ${thin ? "text-muted-foreground" : card.color}`}>
                      {scoreData.score}
                    </span>
                  </div>
                  <Progress value={scoreData.score} className="h-1.5" />
                  {thin && (
                    <div className="mt-2 flex items-start gap-1.5 text-xs text-amber-600">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-px" />
                      <span>Limited data — no {ev.noun} found for this company, so this score reflects the absence of findings rather than a measurement.</span>
                    </div>
                  )}
                  <p className="text-xs text-muted-foreground mt-2 line-clamp-2">{scoreData.justification}</p>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>

      {/* Detailed Data Panels */}
      {detailData && (
        <div className="space-y-4">
          {/* Vendors Panel */}
          <Card className="bg-card border-border shadow-sm">
            <CardHeader className="cursor-pointer py-4" onClick={() => toggleSection('vendors')}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#38BDF8]/10 flex items-center justify-center">
                    <Users className="w-4 h-4 text-[#38BDF8]" />
                  </div>
                  <CardTitle className="text-base">Third-Party Vendors</CardTitle>
                  <Badge variant="secondary" className="text-xs">{detailData.vendors.length}</Badge>
                </div>
                {expandedSection === 'vendors' ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
              </div>
            </CardHeader>
            {expandedSection === 'vendors' && (
              <CardContent className="pt-0">
                {detailData.vendors.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No vendors detected.</p>
                ) : (
                  <div className="space-y-2">
                    {detailData.vendors.map((vendor: any, idx: number) => (
                      <div key={idx} className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded bg-background border flex items-center justify-center text-xs font-bold text-muted-foreground">
                            {(vendor.name || '?')[0]}
                          </div>
                          <div>
                            <div className="font-medium text-sm text-foreground">{vendor.name}</div>
                            <div className="text-xs text-muted-foreground">{vendor.domain || vendor.industry || ''}</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Badge variant="outline" className="text-xs capitalize">{vendor.critical_tier || 'standard'}</Badge>
                          {vendor.vendor_security_score !== null && vendor.vendor_security_score !== undefined && (
                            <span className={`text-sm font-bold ${getVendorScoreColor(vendor.vendor_security_score)}`}>
                              {vendor.vendor_security_score}
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                {companyData?.companyId && (
                  <div className="mt-3 pt-3 border-t border-border">
                    <Link href={`/dashboard/company?id=${companyData.companyId}`} className="text-xs text-primary hover:underline flex items-center gap-1">
                      View full vendor details <ExternalLink className="w-3 h-3" />
                    </Link>
                  </div>
                )}
              </CardContent>
            )}
          </Card>

          {/* Tech Stack Panel */}
          <Card className="bg-card border-border shadow-sm">
            <CardHeader className="cursor-pointer py-4" onClick={() => toggleSection('techStack')}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#4F46E5]/10 flex items-center justify-center">
                    <Server className="w-4 h-4 text-[#4F46E5]" />
                  </div>
                  <CardTitle className="text-base">Technology Stack</CardTitle>
                  <Badge variant="secondary" className="text-xs">{(detailData.techStack?.stack || []).length}</Badge>
                </div>
                {expandedSection === 'techStack' ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
              </div>
            </CardHeader>
            {expandedSection === 'techStack' && (
              <CardContent className="pt-0">
                {(detailData.techStack?.stack || []).length === 0 ? (
                  <p className="text-sm text-muted-foreground">No technology stack data available.</p>
                ) : (
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2">
                    {(detailData.techStack?.stack || []).map((tech: any, idx: number) => (
                      <div key={idx} className="flex items-center gap-2 p-2 rounded-lg bg-muted/50">
                        <Server className="w-3.5 h-3.5 text-muted-foreground" />
                        <div className="min-w-0">
                          <div className="text-sm font-medium text-foreground truncate">{tech.name}</div>
                          <div className="text-xs text-muted-foreground">{tech.category || 'General'} · {tech.confidence || 'medium'}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            )}
          </Card>

          {/* News & Articles Panel */}
          <Card className="bg-card border-border shadow-sm">
            <CardHeader className="cursor-pointer py-4" onClick={() => toggleSection('articles')}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Newspaper className="w-4 h-4 text-primary" />
                  </div>
                  <CardTitle className="text-base">News & Articles</CardTitle>
                  <Badge variant="secondary" className="text-xs">{detailData.articles.length}</Badge>
                </div>
                {expandedSection === 'articles' ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
              </div>
            </CardHeader>
            {expandedSection === 'articles' && (
              <CardContent className="pt-0">
                {detailData.articles.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No articles found.</p>
                ) : (
                  <div className="space-y-2">
                    {detailData.articles.slice(0, 8).map((article: any, idx: number) => (
                      <div key={idx} className="flex items-start justify-between gap-3 p-3 rounded-lg bg-muted/50">
                        <div className="min-w-0 flex-1">
                          <div className="text-sm font-medium text-foreground line-clamp-1">{article.title}</div>
                          <div className="text-xs text-muted-foreground mt-0.5">
                            {article.source} {article.article_published_date ? `· ${new Date(article.article_published_date).toLocaleDateString()}` : ''}
                          </div>
                        </div>
                        <Badge className={`text-xs shrink-0 ${getSentimentColor(article.sentiment)}`}>
                          {article.sentiment || 'neutral'}
                        </Badge>
                      </div>
                    ))}
                    {detailData.articles.length > 8 && (
                      <p className="text-xs text-muted-foreground text-center pt-2">
                        +{detailData.articles.length - 8} more articles
                      </p>
                    )}
                  </div>
                )}
              </CardContent>
            )}
          </Card>

          {/* Vulnerabilities Panel */}
          <Card className="bg-card border-border shadow-sm">
            <CardHeader className="cursor-pointer py-4" onClick={() => toggleSection('vulnerabilities')}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#2563EB]/10 flex items-center justify-center">
                    <Bug className="w-4 h-4 text-[#2563EB]" />
                  </div>
                  <CardTitle className="text-base">Vulnerabilities</CardTitle>
                  <Badge variant={detailData.vulnerabilities.length > 0 ? "destructive" : "secondary"} className="text-xs">
                    {detailData.vulnerabilities.length}
                  </Badge>
                </div>
                {expandedSection === 'vulnerabilities' ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
              </div>
            </CardHeader>
            {expandedSection === 'vulnerabilities' && (
              <CardContent className="pt-0">
                {detailData.vulnerabilities.length === 0 ? (
                  <div className="flex items-center gap-2 p-3 rounded-lg bg-emerald-50 border border-emerald-200">
                    <Shield className="w-4 h-4 text-emerald-600" />
                    <p className="text-sm text-emerald-700">No known vulnerabilities (CVEs) detected for this company.</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {detailData.vulnerabilities.slice(0, 5).map((vuln: any, idx: number) => (
                      <div key={idx} className="p-3 rounded-lg bg-muted/50">
                        <div className="text-sm font-medium text-foreground">{vuln.cve_id || vuln.title || 'Unknown'}</div>
                        <div className="text-xs text-muted-foreground mt-1">{vuln.description || vuln.summary || ''}</div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            )}
          </Card>

          {/* Data Leaks Panel */}
          <Card className="bg-card border-border shadow-sm">
            <CardHeader className="cursor-pointer py-4" onClick={() => toggleSection('dataLeaks')}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#06B6D4]/10 flex items-center justify-center">
                    <Lock className="w-4 h-4 text-[#06B6D4]" />
                  </div>
                  <CardTitle className="text-base">Dark Web & Data Leaks</CardTitle>
                  <Badge variant={detailData.dataLeaks.length > 0 ? "destructive" : "secondary"} className="text-xs">
                    {detailData.dataLeaks.length}
                  </Badge>
                </div>
                {expandedSection === 'dataLeaks' ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
              </div>
            </CardHeader>
            {expandedSection === 'dataLeaks' && (
              <CardContent className="pt-0">
                {detailData.dataLeaks.length === 0 ? (
                  <div className="flex items-center gap-2 p-3 rounded-lg bg-emerald-50 border border-emerald-200">
                    <Shield className="w-4 h-4 text-emerald-600" />
                    <p className="text-sm text-emerald-700">No data leaks or dark web exposure detected.</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {detailData.dataLeaks.slice(0, 5).map((leak: any, idx: number) => (
                      <div key={idx} className="p-3 rounded-lg bg-red-50 border border-red-200">
                        <div className="text-sm font-medium text-red-800">{leak.title || leak.breach_name || 'Data Leak'}</div>
                        <div className="text-xs text-red-600 mt-1">{leak.description || leak.details || ''}</div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            )}
          </Card>

          {/* Action Items Panel */}
          {detailData.actionItems && detailData.actionItems.length > 0 && (
            <Card className="bg-card border-border shadow-sm">
              <CardHeader className="cursor-pointer py-4" onClick={() => toggleSection('actions')}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center">
                      <AlertCircle className="w-4 h-4 text-amber-600" />
                    </div>
                    <CardTitle className="text-base">Recommended Actions</CardTitle>
                    <Badge variant="secondary" className="text-xs">{detailData.actionItems.length}</Badge>
                  </div>
                  {expandedSection === 'actions' ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
                </div>
              </CardHeader>
              {expandedSection === 'actions' && (
                <CardContent className="pt-0">
                  <div className="space-y-2">
                    {detailData.actionItems.map((action: any, idx: number) => (
                      <div key={idx} className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                        <Badge variant="outline" className={`text-xs shrink-0 capitalize ${
                          action.priority === 'critical' ? 'border-red-300 text-red-700' :
                          action.priority === 'high' ? 'border-amber-300 text-amber-700' :
                          'border-gray-300 text-gray-700'
                        }`}>
                          {action.priority}
                        </Badge>
                        <div className="min-w-0">
                          <div className="text-sm font-medium text-foreground">{action.title}</div>
                          <div className="text-xs text-muted-foreground mt-0.5">{action.description}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              )}
            </Card>
          )}

          {/* View Full Report Link */}
          {companyData?.companyId && (
            <div className="text-center">
              <Button variant="outline" asChild>
                <Link href={`/dashboard/company?id=${companyData.companyId}`} className="gap-2">
                  View Full Company Report <ExternalLink className="w-4 h-4" />
                </Link>
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
