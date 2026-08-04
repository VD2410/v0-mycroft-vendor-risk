"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Bell, User, ChevronDown, Building2, Check } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { getApiBaseUrl } from "@/lib/api"
import { toast } from "sonner"
import Link from "next/link"

interface UserInfo {
  id: string
  name: string
  email: string
  initials: string
}

interface CompanyAccess {
  company_id: number
  company_name: string
  company_domain: string
  role: string
  is_primary: boolean
  overall_score: number | null
  risk_level: string | null
}

function getRiskColor(score: number | null): string {
  if (score === null || score === undefined) return "text-muted-foreground"
  if (score >= 80) return "text-green-500"
  if (score >= 60) return "text-yellow-500"
  if (score >= 40) return "text-orange-500"
  return "text-red-500"
}

function getRiskBadgeVariant(riskLevel: string | null): "default" | "secondary" | "destructive" | "outline" {
  if (!riskLevel) return "outline"
  const level = riskLevel.toLowerCase()
  if (level === "low") return "secondary"
  if (level === "medium") return "default"
  return "destructive"
}

export function DashboardHeader() {
  const router = useRouter()
  const [userInfo, setUserInfo] = useState<UserInfo>({
    id: "",
    name: "Loading...",
    email: "",
    initials: "?"
  })
  const [companies, setCompanies] = useState<CompanyAccess[]>([])
  const [activeCompany, setActiveCompany] = useState<CompanyAccess | null>(null)
  const [loadingCompanies, setLoadingCompanies] = useState(true)
  const companiesFetchedRef = useRef(false)
  const urlCompanyIdRef = useRef<string | null>(typeof window !== 'undefined' ? new URLSearchParams(window.location.search).get('company') : null)

  const fetchCompanies = useCallback(async (uid: string, retryCount = 0) => {
    try {
      setLoadingCompanies(true)
      const { data: { session } } = await supabase.auth.getSession()
      const response = await fetch(`${getApiBaseUrl()}/api/v1/user/${uid}/companies`, {
        headers: session?.access_token ? { Authorization: `Bearer ${session.access_token}` } : {},
      })
      if (response.ok) {
        const data = await response.json()
        if (data.status && data.body?.length > 0) {
          setCompanies(data.body)
          companiesFetchedRef.current = true
          // Find the active company: URL param (captured once) > localStorage > primary > first
          const urlCompanyId = urlCompanyIdRef.current
          const storedId = urlCompanyId || localStorage.getItem('wisr_company_id')
          
          // If company ID came from URL, update localStorage immediately
          if (urlCompanyId) {
            localStorage.setItem('wisr_company_id', urlCompanyId)
            localStorage.setItem('wisr_company_name', '')
            localStorage.setItem('wisr_company_domain', '')
            console.log(`[Header] Company ID from URL ref: ${urlCompanyId}, updated localStorage`)
            // Clean URL without reload (only once)
            window.history.replaceState({}, '', window.location.pathname)
            // Clear the ref so subsequent calls use localStorage
            urlCompanyIdRef.current = null
          }
          
          let active: CompanyAccess | undefined
          if (storedId) {
            active = data.body.find((c: CompanyAccess) => c.company_id === parseInt(storedId))
            if (!active && retryCount < 5) {
              // The stored company might not be linked yet (scan still running)
              // Retry after a delay
              console.log(`[Header] Stored company ${storedId} not found in list, retrying (${retryCount + 1}/5)...`)
              setLoadingCompanies(false)
              setTimeout(() => fetchCompanies(uid, retryCount + 1), 3000)
              return
            }
          }
          if (!active) {
            active = data.body.find((c: CompanyAccess) => c.is_primary) || data.body[0]
          }
          console.log(`Resolved company from user_company_access: ${active?.company_name} ${active?.company_id}`)
          // Always sync localStorage with the resolved company to prevent stale data
          if (active) {
            localStorage.setItem('wisr_company_id', active.company_id.toString())
            localStorage.setItem('wisr_company_name', active.company_name)
            localStorage.setItem('wisr_company_domain', active.company_domain)
            console.log(`[Header] Synced localStorage: id=${active.company_id}, name=${active.company_name}`)
          }
          setActiveCompany(active || null)
        }
      }
    } catch (error) {
      console.error("Error fetching companies:", error)
    } finally {
      setLoadingCompanies(false)
    }
  }, [])

  const switchCompany = async (company: CompanyAccess) => {
    if (company.company_id === activeCompany?.company_id) return

    // Update localStorage
    localStorage.setItem('wisr_company_id', company.company_id.toString())
    localStorage.setItem('wisr_company_name', company.company_name)
    localStorage.setItem('wisr_company_domain', company.company_domain)

    // Set primary on backend
    try {
      const { data: { session } } = await supabase.auth.getSession()
      await fetch(`${getApiBaseUrl()}/api/v1/user/${userInfo.id}/companies/${company.company_id}/set-primary`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(session?.access_token ? { Authorization: `Bearer ${session.access_token}` } : {}),
        },
        body: JSON.stringify({})
      })
    } catch (e) {
      console.error("Failed to set primary company:", e)
    }

    setActiveCompany(company)

    // Force full page reload to re-fetch all dashboard data for the new company
    window.location.href = '/dashboard'
  }

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        
        if (session?.user) {
          const email = session.user.email || ""
          const uid = session.user.id
          const metadata = session.user.user_metadata || {}
          
          let name = metadata.full_name || metadata.name || ""
          if (!name && email) {
            const emailName = email.split("@")[0]
            name = emailName
              .split(/[._-]/)
              .map((part: string) => part.charAt(0).toUpperCase() + part.slice(1))
              .join(" ")
          }
          
          const initials = name
            .split(" ")
            .map((part: string) => part.charAt(0).toUpperCase())
            .slice(0, 2)
            .join("") || email.charAt(0).toUpperCase()
          
          setUserInfo({
            id: uid,
            name: name || "User",
            email: email,
            initials: initials
          })

          // Fetch user's companies
          fetchCompanies(uid)
        }
      } catch (error) {
        console.error("Error fetching user info:", error)
      }
    }

    fetchUserInfo()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        const email = session.user.email || ""
        const uid = session.user.id
        const metadata = session.user.user_metadata || {}
        
        let name = metadata.full_name || metadata.name || ""
        if (!name && email) {
          const emailName = email.split("@")[0]
          name = emailName
            .split(/[._-]/)
            .map((part: string) => part.charAt(0).toUpperCase() + part.slice(1))
            .join(" ")
        }
        
        const initials = name
          .split(" ")
          .map((part: string) => part.charAt(0).toUpperCase())
          .slice(0, 2)
          .join("") || email.charAt(0).toUpperCase()
        
        setUserInfo({
          id: uid,
          name: name || "User",
          email: email,
          initials: initials
        })

        // Companies are fetched by fetchUserInfo above, don't duplicate here
        // to avoid race conditions with localStorage and URL params
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [fetchCompanies])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push("/signin")
  }

  return (
    <header className="h-16 border-b border-border bg-card px-6 flex items-center justify-between">
      {/* Company Switcher (left side) */}
      <div className="flex items-center gap-4">
        {companies.length > 0 ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center gap-2 px-3 h-10 max-w-[280px]">
                <Building2 className="w-4 h-4 text-primary shrink-0" />
                <span className="font-semibold truncate">
                  {activeCompany?.company_name || "Select Company"}
                </span>
                {activeCompany?.overall_score !== null && activeCompany?.overall_score !== undefined && (
                  <span className={`text-sm font-medium ${getRiskColor(activeCompany.overall_score)}`}>
                    {activeCompany.overall_score}
                  </span>
                )}
                <ChevronDown className="w-4 h-4 text-muted-foreground shrink-0" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-[320px]">
              <DropdownMenuLabel className="text-xs text-muted-foreground uppercase tracking-wider">
                Your Companies
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              {companies.map((company) => (
                <DropdownMenuItem
                  key={company.company_id}
                  onClick={() => switchCompany(company)}
                  className="flex items-center justify-between py-3 cursor-pointer"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    {company.company_id === activeCompany?.company_id && (
                      <Check className="w-4 h-4 text-primary shrink-0" />
                    )}
                    {company.company_id !== activeCompany?.company_id && (
                      <div className="w-4 h-4 shrink-0" />
                    )}
                    <div className="min-w-0">
                      <div className="font-medium truncate">{company.company_name}</div>
                      <div className="text-xs text-muted-foreground truncate">{company.company_domain}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0 ml-2">
                    {company.overall_score !== null && company.overall_score !== undefined && (
                      <span className={`text-sm font-semibold ${getRiskColor(company.overall_score)}`}>
                        {company.overall_score}
                      </span>
                    )}
                    {company.risk_level && (
                      <Badge variant={getRiskBadgeVariant(company.risk_level)} className="text-[10px] px-1.5 py-0">
                        {company.risk_level}
                      </Badge>
                    )}
                  </div>
                </DropdownMenuItem>
              ))}

            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <div className="flex items-center gap-2 px-3">
            <Building2 className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">
              {loadingCompanies ? "Loading..." : "No companies"}
            </span>
          </div>
        )}
      </div>

      {/* Right side: notifications + user menu */}
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" className="relative" onClick={() => { toast.info('No new notifications'); }}>
          <Bell className="w-5 h-5" />
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center">
                <span className="text-sm font-medium text-accent">{userInfo.initials}</span>
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>
              <div className="flex flex-col">
                <span>{userInfo.name}</span>
                <span className="text-xs text-muted-foreground font-normal">{userInfo.email}</span>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/dashboard/settings">Profile</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/dashboard/settings">Settings</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/dashboard/billing">Billing</Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleSignOut} className="text-destructive">Sign Out</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
