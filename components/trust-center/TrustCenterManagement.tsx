"use client"
import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import {
  Shield, Settings, Users, FileText, BarChart3, Eye, EyeOff,
  ExternalLink, Copy, Check, Plus, Trash2, CheckCircle, XCircle,
  Clock, Download, MessageSquare, Upload
} from "lucide-react"
import { cn } from "@/lib/utils"
import { getApiBaseUrl } from "@/lib/api"
import { supabase } from "@/lib/supabase"

const tabs = [
  { id: "settings", label: "Settings", icon: Settings },
  { id: "visitors", label: "Visitors", icon: Users },
  { id: "documents", label: "Documents", icon: FileText },
  { id: "analytics", label: "Analytics", icon: BarChart3 },
]

interface TrustCenterSettings {
  enabled: boolean
  score_visible: boolean
  unlock_policy: string
  nda_text: string
  chat_enabled: boolean
  questionnaire_enabled: boolean
  company_description: string
  logo_url: string
}

interface Visitor {
  id: number
  full_name: string
  email: string
  company_name: string
  status: string
  created_at: string
}

interface TrustDocument {
  id: number
  title: string
  description: string
  document_type: string
  access_level: string
  visible: boolean
  created_at: string
}

interface Analytics {
  total_views: number
  total_unlocks: number
  total_downloads: number
  total_chats: number
  total_questionnaires: number
  recent_events: Array<{ event_type: string; created_at: string; metadata: any }>
}

export default function TrustCenterManagement() {
  const [activeTab, setActiveTab] = useState("settings")
  const [settings, setSettings] = useState<TrustCenterSettings>({
    enabled: false,
    score_visible: true,
    unlock_policy: "auto",
    nda_text: "",
    chat_enabled: true,
    questionnaire_enabled: true,
    company_description: "",
    logo_url: "",
  })
  const [visitors, setVisitors] = useState<Visitor[]>([])
  const [documents, setDocuments] = useState<TrustDocument[]>([])
  const [analytics, setAnalytics] = useState<Analytics | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [copied, setCopied] = useState(false)
  const [trustCenterUrl, setTrustCenterUrl] = useState("")

  const getAuthHeaders = async () => {
    const { data: { session } } = await supabase.auth.getSession()
    return {
      'Authorization': `Bearer ${session?.access_token}`,
      'Content-Type': 'application/json',
    }
  }

  useEffect(() => {
    loadSettings()
  }, [])

  useEffect(() => {
    if (activeTab === "visitors") loadVisitors()
    if (activeTab === "documents") loadDocuments()
    if (activeTab === "analytics") loadAnalytics()
  }, [activeTab])

  const loadSettings = async () => {
    try {
      const headers = await getAuthHeaders()
      const companyId = localStorage.getItem('wisr_company_id')
      const url = companyId
        ? `${getApiBaseUrl()}/api/trust-center-settings?company_id=${companyId}`
        : `${getApiBaseUrl()}/api/trust-center-settings`
      const res = await fetch(url, { headers })
      if (res.ok) {
        const data = await res.json()
        setSettings(data.settings || data)
        if (data.slug) {
          setTrustCenterUrl(`${window.location.origin}/trust/${data.slug}`)
        }
      }
    } catch (err) {
      console.error("Failed to load trust center settings:", err)
    } finally {
      setLoading(false)
    }
  }

  const saveSettings = async () => {
    setSaving(true)
    try {
      const headers = await getAuthHeaders()
      const companyId = localStorage.getItem('wisr_company_id')
      const res = await fetch(`${getApiBaseUrl()}/api/trust-center-settings`, {
        method: 'PUT',
        headers,
        body: JSON.stringify({ ...settings, ...(companyId ? { company_id: parseInt(companyId) } : {}) }),
      })
      if (res.ok) {
        const data = await res.json()
        if (data.slug) {
          setTrustCenterUrl(`${window.location.origin}/trust/${data.slug}`)
        }
      }
    } catch (err) {
      console.error("Failed to save settings:", err)
    } finally {
      setSaving(false)
    }
  }

  const loadVisitors = async () => {
    try {
      const headers = await getAuthHeaders()
      const res = await fetch(`${getApiBaseUrl()}/api/trust-center-visitors`, { headers })
      if (res.ok) {
        const data = await res.json()
        setVisitors(data.visitors || [])
      }
    } catch (err) {
      console.error("Failed to load visitors:", err)
    }
  }

  const updateVisitorStatus = async (visitorId: number, status: string) => {
    try {
      const headers = await getAuthHeaders()
      await fetch(`${getApiBaseUrl()}/api/trust-center-visitors/${visitorId}/status`, {
        method: 'PUT',
        headers,
        body: JSON.stringify({ status }),
      })
      loadVisitors()
    } catch (err) {
      console.error("Failed to update visitor:", err)
    }
  }

  const loadDocuments = async () => {
    try {
      const headers = await getAuthHeaders()
      const res = await fetch(`${getApiBaseUrl()}/api/trust-center-documents`, { headers })
      if (res.ok) {
        const data = await res.json()
        setDocuments(data.documents || [])
      }
    } catch (err) {
      console.error("Failed to load documents:", err)
    }
  }

  const loadAnalytics = async () => {
    try {
      const headers = await getAuthHeaders()
      const res = await fetch(`${getApiBaseUrl()}/api/trust-center-analytics`, { headers })
      if (res.ok) {
        const data = await res.json()
        setAnalytics(data)
      }
    } catch (err) {
      console.error("Failed to load analytics:", err)
    }
  }

  const copyUrl = () => {
    navigator.clipboard.writeText(trustCenterUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (loading) {
    return (
      <div className="space-y-6 max-w-5xl">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-48" />
          <div className="h-4 bg-muted rounded w-96" />
          <div className="h-64 bg-muted rounded" />
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Shield className="w-6 h-6 text-primary" />
            Trust Center
          </h1>
          <p className="text-muted-foreground">
            Manage your public-facing security trust page
          </p>
        </div>
        {settings.enabled && trustCenterUrl && (
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={copyUrl}>
              {copied ? <Check className="w-4 h-4 mr-1" /> : <Copy className="w-4 h-4 mr-1" />}
              {copied ? "Copied" : "Copy Link"}
            </Button>
            <Button variant="outline" size="sm" asChild>
              <a href={trustCenterUrl} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="w-4 h-4 mr-1" />
                View Live
              </a>
            </Button>
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-border pb-3">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors",
              activeTab === tab.id
                ? "bg-primary/10 text-primary"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            )}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === "settings" && (
        <SettingsTab
          settings={settings}
          setSettings={setSettings}
          saveSettings={saveSettings}
          saving={saving}
          trustCenterUrl={trustCenterUrl}
        />
      )}
      {activeTab === "visitors" && (
        <VisitorsTab visitors={visitors} updateVisitorStatus={updateVisitorStatus} />
      )}
      {activeTab === "documents" && (
        <DocumentsTab documents={documents} loadDocuments={loadDocuments} getAuthHeaders={getAuthHeaders} />
      )}
      {activeTab === "analytics" && (
        <AnalyticsTab analytics={analytics} />
      )}
    </div>
  )
}

// Settings Tab
function SettingsTab({ settings, setSettings, saveSettings, saving, trustCenterUrl }: {
  settings: TrustCenterSettings
  setSettings: (s: TrustCenterSettings) => void
  saveSettings: () => void
  saving: boolean
  trustCenterUrl: string
}) {
  return (
    <div className="space-y-6">
      {/* Enable/Disable */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Trust Center Status</CardTitle>
          <CardDescription>Enable or disable your public trust center page</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-sm font-medium">Enable Trust Center</Label>
              <p className="text-xs text-muted-foreground">Make your trust center publicly accessible</p>
            </div>
            <Switch
              checked={settings.enabled}
              onCheckedChange={(checked) => setSettings({ ...settings, enabled: checked })}
            />
          </div>
          {settings.enabled && trustCenterUrl && (
            <div className="p-3 bg-muted rounded-lg flex items-center gap-2">
              <ExternalLink className="w-4 h-4 text-muted-foreground shrink-0" />
              <code className="text-sm text-foreground flex-1 truncate">{trustCenterUrl}</code>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Visibility & Access */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Visibility & Access</CardTitle>
          <CardDescription>Control what visitors can see and how they gain access</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-sm font-medium">Show RiskAssure Score</Label>
              <p className="text-xs text-muted-foreground">Display your security score on the trust center</p>
            </div>
            <Switch
              checked={settings.score_visible}
              onCheckedChange={(checked) => setSettings({ ...settings, score_visible: checked })}
            />
          </div>
          <div className="space-y-2">
            <Label className="text-sm font-medium">Unlock Policy</Label>
            <p className="text-xs text-muted-foreground">How visitors gain access to gated content</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-2">
              {[
                { value: "auto", label: "Auto-Unlock", desc: "Immediate access after identification" },
                { value: "approval", label: "Approval Required", desc: "You approve each request manually" },
                { value: "nda", label: "NDA Required", desc: "Visitor must accept NDA first" },
              ].map((policy) => (
                <button
                  key={policy.value}
                  onClick={() => setSettings({ ...settings, unlock_policy: policy.value })}
                  className={cn(
                    "p-3 rounded-lg border text-left transition-colors",
                    settings.unlock_policy === policy.value
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/50"
                  )}
                >
                  <div className="font-medium text-sm">{policy.label}</div>
                  <div className="text-xs text-muted-foreground mt-1">{policy.desc}</div>
                </button>
              ))}
            </div>
          </div>
          {settings.unlock_policy === "nda" && (
            <div className="space-y-2">
              <Label className="text-sm font-medium">NDA Text</Label>
              <textarea
                className="w-full min-h-[120px] p-3 rounded-lg border border-border bg-background text-sm resize-y"
                placeholder="Enter your NDA or confidentiality agreement text..."
                value={settings.nda_text}
                onChange={(e) => setSettings({ ...settings, nda_text: e.target.value })}
              />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Features */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Features</CardTitle>
          <CardDescription>Enable or disable trust center features</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-sm font-medium">AI Chat</Label>
              <p className="text-xs text-muted-foreground">Allow visitors to ask questions about your security posture</p>
            </div>
            <Switch
              checked={settings.chat_enabled}
              onCheckedChange={(checked) => setSettings({ ...settings, chat_enabled: checked })}
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-sm font-medium">Questionnaire Upload</Label>
              <p className="text-xs text-muted-foreground">Allow visitors to upload security questionnaires</p>
            </div>
            <Switch
              checked={settings.questionnaire_enabled}
              onCheckedChange={(checked) => setSettings({ ...settings, questionnaire_enabled: checked })}
            />
          </div>
        </CardContent>
      </Card>

      {/* Company Info */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Company Information</CardTitle>
          <CardDescription>Customize how your company appears on the trust center</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label className="text-sm font-medium">Company Description</Label>
            <textarea
              className="w-full min-h-[80px] p-3 rounded-lg border border-border bg-background text-sm resize-y"
              placeholder="Brief description of your company's security commitment..."
              value={settings.company_description}
              onChange={(e) => setSettings({ ...settings, company_description: e.target.value })}
            />
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button onClick={saveSettings} disabled={saving}>
          {saving ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </div>
  )
}

// Visitors Tab
function VisitorsTab({ visitors, updateVisitorStatus }: {
  visitors: Visitor[]
  updateVisitorStatus: (id: number, status: string) => void
}) {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "auto_approved":
      case "approved":
      case "nda_accepted":
        return <Badge className="bg-green-100 text-green-800 border-green-200"><CheckCircle className="w-3 h-3 mr-1" />Approved</Badge>
      case "denied":
        return <Badge className="bg-red-100 text-red-800 border-red-200"><XCircle className="w-3 h-3 mr-1" />Denied</Badge>
      default:
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200"><Clock className="w-3 h-3 mr-1" />Pending</Badge>
    }
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Visitor Access Requests</CardTitle>
          <CardDescription>
            {visitors.length} total visitor{visitors.length !== 1 ? "s" : ""} have requested access
          </CardDescription>
        </CardHeader>
        <CardContent>
          {visitors.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Users className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>No visitors yet. Share your trust center link to get started.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {visitors.map((visitor) => (
                <div key={visitor.id} className="flex items-center justify-between p-3 rounded-lg border border-border">
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm truncate">{visitor.full_name}</div>
                    <div className="text-xs text-muted-foreground">{visitor.email}</div>
                    {visitor.company_name && (
                      <div className="text-xs text-muted-foreground">{visitor.company_name}</div>
                    )}
                    <div className="text-xs text-muted-foreground mt-1">
                      {new Date(visitor.created_at).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    {getStatusBadge(visitor.status)}
                    {visitor.status === "pending" && (
                      <div className="flex gap-1">
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-7 text-xs text-green-600 border-green-200 hover:bg-green-50"
                          onClick={() => updateVisitorStatus(visitor.id, "approved")}
                        >
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-7 text-xs text-red-600 border-red-200 hover:bg-red-50"
                          onClick={() => updateVisitorStatus(visitor.id, "denied")}
                        >
                          Deny
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

// Documents Tab
function DocumentsTab({ documents, loadDocuments, getAuthHeaders }: {
  documents: TrustDocument[]
  loadDocuments: () => void
  getAuthHeaders: () => Promise<Record<string, string>>
}) {
  const [uploading, setUploading] = useState(false)
  const [newDoc, setNewDoc] = useState({ title: "", description: "", document_type: "report", access_level: "gated" })

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    try {
      const headers = await getAuthHeaders()
      const formData = new FormData()
      formData.append("file", file)
      formData.append("title", newDoc.title || file.name)
      formData.append("description", newDoc.description)
      formData.append("document_type", newDoc.document_type)
      formData.append("access_level", newDoc.access_level)

      const res = await fetch(`${getApiBaseUrl()}/api/trust-center-documents`, {
        method: 'POST',
        headers: { 'Authorization': headers.Authorization },
        body: formData,
      })
      if (res.ok) {
        setNewDoc({ title: "", description: "", document_type: "report", access_level: "gated" })
        loadDocuments()
      }
    } catch (err) {
      console.error("Upload failed:", err)
    } finally {
      setUploading(false)
    }
  }

  const deleteDocument = async (docId: number) => {
    try {
      const headers = await getAuthHeaders()
      await fetch(`${getApiBaseUrl()}/api/trust-center-documents/${docId}`, {
        method: 'DELETE',
        headers,
      })
      loadDocuments()
    } catch (err) {
      console.error("Delete failed:", err)
    }
  }

  return (
    <div className="space-y-4">
      {/* Upload New Document */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Upload Document</CardTitle>
          <CardDescription>Add security reports, certifications, or policies to your trust center</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-sm">Title</Label>
              <Input
                placeholder="e.g., SOC 2 Type II Report"
                value={newDoc.title}
                onChange={(e) => setNewDoc({ ...newDoc, title: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label className="text-sm">Type</Label>
              <select
                className="w-full h-9 px-3 rounded-md border border-input bg-background text-sm"
                value={newDoc.document_type}
                onChange={(e) => setNewDoc({ ...newDoc, document_type: e.target.value })}
              >
                <option value="report">Report</option>
                <option value="certification">Certification</option>
                <option value="policy">Policy</option>
                <option value="questionnaire">Questionnaire</option>
              </select>
            </div>
          </div>
          <div className="space-y-2">
            <Label className="text-sm">Description</Label>
            <Input
              placeholder="Brief description of the document"
              value={newDoc.description}
              onChange={(e) => setNewDoc({ ...newDoc, description: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label className="text-sm">Access Level</Label>
            <div className="flex gap-3">
              <button
                onClick={() => setNewDoc({ ...newDoc, access_level: "public" })}
                className={cn(
                  "px-3 py-1.5 rounded-md text-sm border transition-colors",
                  newDoc.access_level === "public" ? "border-primary bg-primary/5 text-primary" : "border-border"
                )}
              >
                <Eye className="w-3 h-3 inline mr-1" />Public
              </button>
              <button
                onClick={() => setNewDoc({ ...newDoc, access_level: "gated" })}
                className={cn(
                  "px-3 py-1.5 rounded-md text-sm border transition-colors",
                  newDoc.access_level === "gated" ? "border-primary bg-primary/5 text-primary" : "border-border"
                )}
              >
                <EyeOff className="w-3 h-3 inline mr-1" />Gated (requires unlock)
              </button>
            </div>
          </div>
          <div>
            <label className="cursor-pointer">
              <input type="file" className="hidden" onChange={handleUpload} accept=".pdf,.doc,.docx" />
              <div className="flex items-center gap-2 px-4 py-2 border border-dashed border-border rounded-lg hover:border-primary/50 transition-colors">
                <Upload className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  {uploading ? "Uploading..." : "Click to upload document (PDF, DOC)"}
                </span>
              </div>
            </label>
          </div>
        </CardContent>
      </Card>

      {/* Document List */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Published Documents</CardTitle>
          <CardDescription>{documents.length} document{documents.length !== 1 ? "s" : ""} available</CardDescription>
        </CardHeader>
        <CardContent>
          {documents.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <FileText className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>No documents uploaded yet.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {documents.map((doc) => (
                <div key={doc.id} className="flex items-center justify-between p-3 rounded-lg border border-border">
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm flex items-center gap-2">
                      {doc.title}
                      <Badge variant="outline" className="text-xs">
                        {doc.document_type}
                      </Badge>
                    </div>
                    {doc.description && (
                      <div className="text-xs text-muted-foreground mt-1">{doc.description}</div>
                    )}
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    <Badge className={doc.access_level === "public" ? "bg-green-100 text-green-800" : "bg-blue-100 text-blue-800"}>
                      {doc.access_level === "public" ? "Public" : "Gated"}
                    </Badge>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-7 w-7 p-0 text-destructive"
                      onClick={() => deleteDocument(doc.id)}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

// Analytics Tab
function AnalyticsTab({ analytics }: { analytics: Analytics | null }) {
  if (!analytics) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <BarChart3 className="w-12 h-12 mx-auto mb-3 opacity-50" />
        <p>Loading analytics...</p>
      </div>
    )
  }

  const stats = [
    { label: "Page Views", value: analytics.total_views, icon: Eye, color: "text-blue-600" },
    { label: "Unlocks", value: analytics.total_unlocks, icon: Users, color: "text-green-600" },
    { label: "Downloads", value: analytics.total_downloads, icon: Download, color: "text-purple-600" },
    { label: "Chat Messages", value: analytics.total_chats, icon: MessageSquare, color: "text-cyan-600" },
    { label: "Questionnaires", value: analytics.total_questionnaires, icon: Upload, color: "text-orange-600" },
  ]

  return (
    <div className="space-y-4">
      {/* Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardContent className="p-4 text-center">
              <stat.icon className={cn("w-5 h-5 mx-auto mb-2", stat.color)} />
              <div className="text-2xl font-bold">{stat.value}</div>
              <div className="text-xs text-muted-foreground">{stat.label}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          {analytics.recent_events.length === 0 ? (
            <p className="text-center py-4 text-muted-foreground">No activity yet</p>
          ) : (
            <div className="space-y-2">
              {analytics.recent_events.slice(0, 20).map((event, i) => (
                <div key={i} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">{event.event_type.replace(/_/g, " ")}</Badge>
                    {event.metadata?.visitor_name && (
                      <span className="text-sm text-muted-foreground">{event.metadata.visitor_name}</span>
                    )}
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {new Date(event.created_at).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
