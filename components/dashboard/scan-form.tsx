"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2, Search, Shield, Zap, Globe } from "lucide-react"
import { useRouter } from "next/navigation"

export function ScanForm() {
  const router = useRouter()
  const [isScanning, setIsScanning] = useState(false)
  const [companyName, setCompanyName] = useState("")
  const [domain, setDomain] = useState("")

  const handleScan = async () => {
    if (!companyName || !domain) return

    setIsScanning(true)
    // Simulate scanning
    await new Promise((resolve) => setTimeout(resolve, 3000))
    setIsScanning(false)
    router.push("/dashboard/company/mycroft")
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">New Company Scan</h1>
        <p className="text-muted-foreground mt-1">Enter company details to begin comprehensive risk assessment</p>
      </div>

      <Card className="glass">
        <CardHeader>
          <CardTitle>Company Information</CardTitle>
          <CardDescription>Provide the company name and primary domain for OSINT signal collection</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="company">Company Name</Label>
            <Input
              id="company"
              placeholder="e.g., Mycroft"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              className="bg-secondary border-border"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="domain">Primary Domain</Label>
            <Input
              id="domain"
              placeholder="e.g., mycroft.io"
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
              className="bg-secondary border-border"
            />
          </div>

          <Button
            onClick={handleScan}
            disabled={isScanning || !companyName || !domain}
            className="w-full bg-accent text-accent-foreground hover:bg-accent/90 glow-accent"
          >
            {isScanning ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Scanning...
              </>
            ) : (
              <>
                <Search className="w-4 h-4 mr-2" />
                Start Scan
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {isScanning && (
        <Card className="glass">
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center animate-pulse">
                  <Shield className="w-4 h-4 text-accent" />
                </div>
                <div className="flex-1">
                  <div className="text-sm font-medium text-foreground">Collecting firmographic data...</div>
                  <div className="h-1.5 bg-secondary rounded-full mt-2 overflow-hidden">
                    <div className="h-full bg-accent rounded-full animate-pulse" style={{ width: "60%" }} />
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-chart-4/20 flex items-center justify-center animate-pulse">
                  <Zap className="w-4 h-4 text-chart-4" />
                </div>
                <div className="flex-1">
                  <div className="text-sm font-medium text-foreground">Analyzing tech footprint...</div>
                  <div className="h-1.5 bg-secondary rounded-full mt-2 overflow-hidden">
                    <div className="h-full bg-chart-4 rounded-full animate-pulse" style={{ width: "40%" }} />
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-chart-1/20 flex items-center justify-center">
                  <Globe className="w-4 h-4 text-chart-1" />
                </div>
                <div className="flex-1">
                  <div className="text-sm font-medium text-muted-foreground">Querying dark web sources...</div>
                  <div className="h-1.5 bg-secondary rounded-full mt-2" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Card className="glass">
        <CardContent className="pt-6">
          <h3 className="font-semibold text-foreground mb-3">What We Analyze</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-accent" />
              Firmographic data from public sources
            </li>
            <li className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-accent" />
              Technology stack and integration surface
            </li>
            <li className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-accent" />
              CVE database and vulnerability intel
            </li>
            <li className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-accent" />
              Dark web and breach monitoring
            </li>
            <li className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-accent" />
              Third-party vendor exposure
            </li>
            <li className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-accent" />
              Reputation and sentiment analysis
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}
