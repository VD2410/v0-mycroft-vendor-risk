"use client"
import { useState, useEffect, useRef } from "react"

import {
  Shield, Lock, Unlock, FileText, MessageSquare, Upload, Send,
  CheckCircle, AlertCircle, Download, ExternalLink, Eye, Bot, User,
  ChevronRight, Award, Clock
} from "lucide-react"
import { getApiBaseUrl } from "@/lib/api"

const FREE_EMAIL_DOMAINS = [
  "gmail.com", "yahoo.com", "hotmail.com", "outlook.com", "aol.com",
  "icloud.com", "mail.com", "protonmail.com", "zoho.com", "yandex.com",
  "live.com", "msn.com", "me.com", "inbox.com", "gmx.com"
]

interface TrustCenterData {
  company_name: string
  company_description: string
  logo_url: string
  score_visible: boolean
  score_grade: string
  score_value: number
  unlock_policy: string
  nda_text: string
  chat_enabled: boolean
  questionnaire_enabled: boolean
  badges: Array<{ id: number; badge_name: string; badge_type: string; verified: boolean; icon_url: string }>
  documents: Array<{ id: number; title: string; description: string; document_type: string; access_level: string }>
}

interface ChatMessage {
  id: string
  role: "user" | "assistant"
  content: string
}

export default function TrustCenterPublic() {
  // Extract slug from URL path: /trust/company-slug
  const [slug, setSlug] = useState<string>("")
  useEffect(() => {
    const pathParts = window.location.pathname.split('/')
    const slugIndex = pathParts.indexOf('trust')
    if (slugIndex >= 0 && pathParts[slugIndex + 1]) {
      setSlug(pathParts[slugIndex + 1])
    }
  }, [])
  const [data, setData] = useState<TrustCenterData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [visitorToken, setVisitorToken] = useState<string | null>(null)
  const [unlocked, setUnlocked] = useState(false)
  const [showUnlockForm, setShowUnlockForm] = useState(false)
  const [unlockForm, setUnlockForm] = useState({ full_name: "", email: "", company_name: "" })
  const [unlockStatus, setUnlockStatus] = useState<"idle" | "submitting" | "pending" | "nda" | "success" | "error">("idle")
  const [unlockError, setUnlockError] = useState("")
  const [showNda, setShowNda] = useState(false)
  const [activeSection, setActiveSection] = useState<"overview" | "chat" | "questionnaire">("overview")
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([])
  const [chatInput, setChatInput] = useState("")
  const [chatLoading, setChatLoading] = useState(false)
  const chatEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (slug) {
      loadTrustCenter()
      // Check for existing visitor token
      const stored = localStorage.getItem(`tc_token_${slug}`)
      if (stored) {
        setVisitorToken(stored)
        setUnlocked(true)
      }
    }
  }, [slug])

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [chatMessages])

  const loadTrustCenter = async () => {
    try {
      const res = await fetch(`${getApiBaseUrl()}/api/trust-center/${slug}`)
      if (!res.ok) {
        if (res.status === 404) setError("Trust Center not found")
        else setError("Failed to load Trust Center")
        return
      }
      const result = await res.json()
      // Map nested API response to flat TrustCenterData
      const mapped: TrustCenterData = {
        company_name: result.company?.name || '',
        company_description: result.company?.description || '',
        logo_url: result.company?.logo_url || '',
        score_visible: result.settings?.score_visible ?? false,
        score_grade: result.score?.letterGrade || '',
        score_value: parseInt(result.score?.overall) || 0,
        unlock_policy: result.settings?.unlock_policy || 'auto',
        nda_text: result.settings?.nda_text || '',
        chat_enabled: result.settings?.chat_enabled ?? false,
        questionnaire_enabled: result.settings?.questionnaire_enabled ?? false,
        badges: result.compliance_badges || [],
        documents: result.documents || []
      }
      setData(mapped)
      // Track page view
      fetch(`${getApiBaseUrl()}/api/trust-center/${slug}/track`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ event_type: 'page_view' })
      }).catch(() => {})
    } catch (err) {
      setError("Failed to load Trust Center")
    } finally {
      setLoading(false)
    }
  }

  const handleUnlockSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setUnlockError("")

    // Validate work email
    const emailDomain = unlockForm.email.split("@")[1]?.toLowerCase()
    if (FREE_EMAIL_DOMAINS.includes(emailDomain)) {
      setUnlockError("Please use your work email address")
      return
    }

    setUnlockStatus("submitting")
    try {
      const res = await fetch(`${getApiBaseUrl()}/api/trust-center/${slug}/request-access`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(unlockForm),
      })
      const result = await res.json()

      if (!res.ok) {
        setUnlockError(result.error || "Request failed")
        setUnlockStatus("error")
        return
      }

      if (result.status === "auto_approved" || result.status === "approved") {
        setVisitorToken(result.token)
        localStorage.setItem(`tc_token_${slug}`, result.token)
        setUnlocked(true)
        setUnlockStatus("success")
        setShowUnlockForm(false)
      } else if (result.status === "nda_required") {
        setVisitorToken(result.token)
        setShowNda(true)
        setUnlockStatus("nda")
      } else if (result.status === "pending") {
        setUnlockStatus("pending")
      }
    } catch (err) {
      setUnlockError("Network error. Please try again.")
      setUnlockStatus("error")
    }
  }

  const handleNdaAccept = async () => {
    try {
      const res = await fetch(`${getApiBaseUrl()}/api/trust-center/${slug}/accept-nda`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-visitor-token': visitorToken || '',
        },
      })
      const result = await res.json()
      if (res.ok && result.token) {
        localStorage.setItem(`tc_token_${slug}`, result.token)
        setUnlocked(true)
        setShowNda(false)
        setUnlockStatus("success")
      }
    } catch (err) {
      setUnlockError("Failed to accept NDA")
    }
  }

  const sendChatMessage = async () => {
    if (!chatInput.trim() || chatLoading) return
    const userMsg: ChatMessage = { id: Date.now().toString(), role: "user", content: chatInput }
    setChatMessages((prev) => [...prev, userMsg])
    setChatInput("")
    setChatLoading(true)

    try {
      const res = await fetch(`${getApiBaseUrl()}/api/trust-center/${slug}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-visitor-token': visitorToken || '',
        },
        body: JSON.stringify({ message: chatInput }),
      })
      const result = await res.json()

      // An expired or revoked visitor token comes back as 401. Without this the
      // user just sees a generic apology and has no way to recover.
      if (res.status === 401 || res.status === 403) {
        localStorage.removeItem(`tc_token_${slug}`)
        setVisitorToken(null)
        setUnlocked(false)
        setShowUnlockForm(true)
        setChatMessages((prev) => [...prev, {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: "Your access session has expired. Please request access again to continue.",
        }])
        return
      }

      if (!res.ok) {
        setChatMessages((prev) => [...prev, {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: result.error || "Sorry, something went wrong answering that. Please try again.",
        }])
        return
      }

      const assistantMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: result.response || "I'm sorry, I couldn't process that request.",
      }
      setChatMessages((prev) => [...prev, assistantMsg])
    } catch (err) {
      setChatMessages((prev) => [...prev, {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "Sorry, there was an error processing your request.",
      }])
    } finally {
      setChatLoading(false)
    }
  }

  const handleQuestionnaireUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const formData = new FormData()
    formData.append("file", file)
    try {
      const res = await fetch(`${getApiBaseUrl()}/api/trust-center/${slug}/questionnaire`, {
        method: 'POST',
        headers: { 'x-visitor-token': visitorToken || '' },
        body: formData,
      })
      if (res.status === 401 || res.status === 403) {
        localStorage.removeItem(`tc_token_${slug}`)
        setVisitorToken(null)
        setUnlocked(false)
        setShowUnlockForm(true)
        alert("Your access session has expired. Please request access again, then re-upload.")
        return
      }
      if (!res.ok) {
        const result = await res.json().catch(() => ({}))
        alert(result.error || "Upload failed. Please try again.")
        return
      }
      alert("Questionnaire uploaded successfully! The team will review and respond.")
    } catch (err) {
      alert("Upload failed. Please try again.")
    } finally {
      e.target.value = ""
    }
  }

  const requestReportAccess = async (docId: number) => {
    try {
      await fetch(`${getApiBaseUrl()}/api/trust-center/${slug}/request-report`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-visitor-token': visitorToken || '',
        },
        body: JSON.stringify({ document_id: docId }),
      })
      alert("Access requested! You'll be notified when approved.")
    } catch (err) {
      alert("Request failed. Please try again.")
    }
  }

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="animate-pulse text-center">
          <Shield className="w-12 h-12 mx-auto mb-4 text-blue-500" />
          <p className="text-slate-600">Loading Trust Center...</p>
        </div>
      </div>
    )
  }

  // Error state
  if (error || !data) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 mx-auto mb-4 text-red-500" />
          <h1 className="text-xl font-bold text-slate-800 mb-2">Trust Center Not Found</h1>
          <p className="text-slate-600">{error || "This trust center does not exist or is not enabled."}</p>
        </div>
      </div>
    )
  }

  const getGradeColor = (grade: string) => {
    if (grade === "A+" || grade === "A") return "text-green-600 bg-green-50 border-green-200"
    if (grade === "B+" || grade === "B") return "text-blue-600 bg-blue-50 border-blue-200"
    if (grade === "C+" || grade === "C") return "text-yellow-600 bg-yellow-50 border-yellow-200"
    return "text-red-600 bg-red-50 border-red-200"
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {data.logo_url ? (
              <img src={data.logo_url} alt={data.company_name} className="h-8 w-auto" />
            ) : (
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                <Shield className="w-4 h-4 text-white" />
              </div>
            )}
            <div>
              <h1 className="text-lg font-semibold text-slate-900">{data.company_name}</h1>
              <p className="text-xs text-slate-500">Security Trust Center</p>
            </div>
          </div>
          {!unlocked && (
            <button
              onClick={() => setShowUnlockForm(true)}
              className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              Request Access
            </button>
          )}
          {unlocked && (
            <div className="flex items-center gap-2 text-sm text-green-600">
              <Unlock className="w-4 h-4" />
              <span className="font-medium">Access Granted</span>
            </div>
          )}
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8">
        {/* Hero Section */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row gap-6 items-start">
            <div className="flex-1">
              <h2 className="text-3xl font-bold text-slate-900 mb-3">
                Security & Compliance
              </h2>
              <p className="text-slate-600 text-lg leading-relaxed">
                {data.company_description || `${data.company_name} is committed to maintaining the highest standards of security and compliance. Explore our certifications, policies, and security posture below.`}
              </p>
            </div>
            {data.score_visible && data.score_grade && (
              <div className={`px-6 py-4 rounded-xl border-2 text-center ${getGradeColor(data.score_grade)}`}>
                <div className="text-xs font-medium uppercase tracking-wider opacity-75 mb-1">RiskAssure Score</div>
                <div className="text-4xl font-bold">{data.score_grade}</div>
                <div className="text-sm mt-1">{data.score_value}/100</div>
              </div>
            )}
          </div>
        </div>

        {/* Compliance Badges */}
        {data.badges && data.badges.length > 0 && (
          <section className="mb-8">
            <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <Award className="w-5 h-5 text-blue-600" />
              Certifications & Compliance
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {data.badges.map((badge) => (
                <div
                  key={badge.id}
                  className="flex items-center gap-3 p-3 rounded-lg border border-slate-200 bg-white"
                >
                  {badge.icon_url ? (
                    <img src={badge.icon_url} alt={badge.badge_name} className="w-8 h-8" />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                      <CheckCircle className="w-4 h-4 text-blue-600" />
                    </div>
                  )}
                  <div>
                    <div className="text-sm font-medium text-slate-900">{badge.badge_name}</div>
                    {badge.verified && (
                      <div className="text-xs text-green-600 flex items-center gap-1">
                        <CheckCircle className="w-3 h-3" />Verified
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Documents Section */}
        <section className="mb-8">
          <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-600" />
            Security Documents & Reports
          </h3>
          <div className="grid gap-3">
            {data.documents.map((doc) => (
              <div
                key={doc.id}
                className="flex items-center justify-between p-4 rounded-lg border border-slate-200 bg-white hover:border-blue-200 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center">
                    <FileText className="w-5 h-5 text-slate-600" />
                  </div>
                  <div>
                    <div className="font-medium text-slate-900">{doc.title}</div>
                    {doc.description && (
                      <div className="text-sm text-slate-500">{doc.description}</div>
                    )}
                    <div className="text-xs text-slate-400 mt-0.5 capitalize">{doc.document_type}</div>
                  </div>
                </div>
                <div>
                  {doc.access_level === "public" ? (
                    <a
                      href={`${getApiBaseUrl()}/api/trust-center/${slug}/documents/${doc.id}/download`}
                      className="flex items-center gap-1 px-3 py-1.5 text-sm text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                    >
                      <Download className="w-4 h-4" />
                      Download
                    </a>
                  ) : unlocked ? (
                    <button
                      onClick={() => requestReportAccess(doc.id)}
                      className="flex items-center gap-1 px-3 py-1.5 text-sm text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                    >
                      <ChevronRight className="w-4 h-4" />
                      Request Access
                    </button>
                  ) : (
                    <div className="flex items-center gap-1 text-sm text-slate-400">
                      <Lock className="w-4 h-4" />
                      Locked
                    </div>
                  )}
                </div>
              </div>
            ))}
            {data.documents.length === 0 && (
              <div className="text-center py-8 text-slate-500">
                <FileText className="w-10 h-10 mx-auto mb-2 opacity-50" />
                <p>No documents available yet.</p>
              </div>
            )}
          </div>
        </section>

        {/* Gated Content (post-unlock) */}
        {unlocked && (data.chat_enabled || data.questionnaire_enabled) && (
          <section className="mb-8">
            <div className="flex gap-2 mb-4 border-b border-slate-200 pb-3">
              <button
                onClick={() => setActiveSection("overview")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeSection === "overview" ? "bg-blue-100 text-blue-700" : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                Overview
              </button>
              {data.chat_enabled && (
                <button
                  onClick={() => setActiveSection("chat")}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1 ${
                    activeSection === "chat" ? "bg-blue-100 text-blue-700" : "text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  <MessageSquare className="w-4 h-4" />
                  Ask a Question
                </button>
              )}
              {data.questionnaire_enabled && (
                <button
                  onClick={() => setActiveSection("questionnaire")}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1 ${
                    activeSection === "questionnaire" ? "bg-blue-100 text-blue-700" : "text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  <Upload className="w-4 h-4" />
                  Upload Questionnaire
                </button>
              )}
            </div>

            {/* Chat Section */}
            {activeSection === "chat" && data.chat_enabled && (
              <div className="rounded-xl border border-slate-200 bg-white overflow-hidden">
                <div className="p-4 border-b border-slate-100 bg-slate-50">
                  <h4 className="font-medium text-slate-900 flex items-center gap-2">
                    <Bot className="w-4 h-4 text-blue-600" />
                    Security Q&A
                  </h4>
                  <p className="text-xs text-slate-500 mt-1">
                    Ask questions about {data.company_name}&apos;s security practices and policies
                  </p>
                </div>
                <div className="h-80 overflow-y-auto p-4 space-y-4">
                  {chatMessages.length === 0 && (
                    <div className="text-center py-8 text-slate-400">
                      <MessageSquare className="w-8 h-8 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">Ask a question about security policies, compliance, or practices</p>
                    </div>
                  )}
                  {chatMessages.map((msg) => (
                    <div key={msg.id} className={`flex gap-3 ${msg.role === "user" ? "justify-end" : ""}`}>
                      {msg.role === "assistant" && (
                        <div className="w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                          <Bot className="w-4 h-4 text-blue-600" />
                        </div>
                      )}
                      <div className={`max-w-[80%] px-4 py-2 rounded-lg text-sm ${
                        msg.role === "user"
                          ? "bg-blue-600 text-white"
                          : "bg-slate-100 text-slate-800"
                      }`}>
                        {msg.content}
                      </div>
                      {msg.role === "user" && (
                        <div className="w-7 h-7 rounded-full bg-slate-200 flex items-center justify-center shrink-0">
                          <User className="w-4 h-4 text-slate-600" />
                        </div>
                      )}
                    </div>
                  ))}
                  {chatLoading && (
                    <div className="flex gap-3">
                      <div className="w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                        <Bot className="w-4 h-4 text-blue-600" />
                      </div>
                      <div className="px-4 py-2 rounded-lg bg-slate-100">
                        <div className="flex gap-1">
                          <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" />
                          <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }} />
                          <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }} />
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={chatEndRef} />
                </div>
                <div className="p-3 border-t border-slate-100 flex gap-2">
                  <input
                    type="text"
                    className="flex-1 px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-300"
                    placeholder="Ask about security practices..."
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && sendChatMessage()}
                  />
                  <button
                    onClick={sendChatMessage}
                    disabled={chatLoading || !chatInput.trim()}
                    className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* Questionnaire Upload */}
            {activeSection === "questionnaire" && data.questionnaire_enabled && (
              <div className="rounded-xl border border-slate-200 bg-white p-6">
                <h4 className="font-medium text-slate-900 mb-2 flex items-center gap-2">
                  <Upload className="w-4 h-4 text-blue-600" />
                  Upload Security Questionnaire
                </h4>
                <p className="text-sm text-slate-500 mb-4">
                  Upload your security questionnaire and our team will review and respond with answers.
                </p>
                <label className="cursor-pointer block">
                  <input
                    type="file"
                    className="hidden"
                    onChange={handleQuestionnaireUpload}
                    accept=".pdf,.doc,.docx,.xlsx,.xls,.csv"
                  />
                  <div className="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors">
                    <Upload className="w-8 h-8 mx-auto mb-3 text-slate-400" />
                    <p className="text-sm font-medium text-slate-700">Click to upload questionnaire</p>
                    <p className="text-xs text-slate-400 mt-1">PDF, DOC, DOCX, XLSX, CSV</p>
                  </div>
                </label>
              </div>
            )}
          </section>
        )}

        {/* Unlock CTA (if not unlocked) */}
        {!unlocked && (data.chat_enabled || data.questionnaire_enabled) && (
          <section className="mb-8">
            <div className="rounded-xl border-2 border-dashed border-blue-200 bg-blue-50/50 p-8 text-center">
              <Lock className="w-10 h-10 mx-auto mb-3 text-blue-500" />
              <h3 className="text-lg font-semibold text-slate-900 mb-2">
                Unlock Full Access
              </h3>
              <p className="text-slate-600 mb-4 max-w-md mx-auto">
                Get access to AI-powered security Q&A, document downloads, and questionnaire submission.
              </p>
              <button
                onClick={() => setShowUnlockForm(true)}
                className="px-6 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
              >
                Request Access
              </button>
            </div>
          </section>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 py-6 mt-12">
        <div className="max-w-6xl mx-auto px-6 flex items-center justify-between">
          <p className="text-xs text-slate-400">
            Powered by{" "}
            <a href="https://getriskassure.com" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:text-blue-600">
              WISR RiskAssure
            </a>
          </p>
          <p className="text-xs text-slate-400">
            {new Date().getFullYear()} {data.company_name}
          </p>
        </div>
      </footer>

      {/* Unlock Modal */}
      {showUnlockForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6">
            <div className="text-center mb-6">
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-3">
                <Shield className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900">Request Access</h3>
              <p className="text-sm text-slate-500 mt-1">
                Provide your work email to access security documentation
              </p>
            </div>

            {unlockStatus === "pending" ? (
              <div className="text-center py-4">
                <Clock className="w-10 h-10 mx-auto mb-3 text-yellow-500" />
                <h4 className="font-medium text-slate-900">Request Submitted</h4>
                <p className="text-sm text-slate-500 mt-1">
                  Your request is pending approval. You&apos;ll receive an email when access is granted.
                </p>
                <button
                  onClick={() => { setShowUnlockForm(false); setUnlockStatus("idle") }}
                  className="mt-4 px-4 py-2 text-sm text-slate-600 hover:text-slate-800"
                >
                  Close
                </button>
              </div>
            ) : (
              <form onSubmit={handleUnlockSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-300"
                    placeholder="John Smith"
                    value={unlockForm.full_name}
                    onChange={(e) => setUnlockForm({ ...unlockForm, full_name: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Work Email *</label>
                  <input
                    type="email"
                    required
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-300"
                    placeholder="john@company.com"
                    value={unlockForm.email}
                    onChange={(e) => setUnlockForm({ ...unlockForm, email: e.target.value })}
                  />
                  <p className="text-xs text-slate-400 mt-1">Free email providers (Gmail, Yahoo, etc.) are not accepted</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Company Name</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-300"
                    placeholder="Acme Corp"
                    value={unlockForm.company_name}
                    onChange={(e) => setUnlockForm({ ...unlockForm, company_name: e.target.value })}
                  />
                </div>
                {unlockError && (
                  <div className="p-3 rounded-lg bg-red-50 text-red-600 text-sm flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    {unlockError}
                  </div>
                )}
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => { setShowUnlockForm(false); setUnlockStatus("idle"); setUnlockError("") }}
                    className="flex-1 px-4 py-2 text-sm text-slate-600 border border-slate-300 rounded-lg hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={unlockStatus === "submitting"}
                    className="flex-1 px-4 py-2 text-sm text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50"
                  >
                    {unlockStatus === "submitting" ? "Submitting..." : "Request Access"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* NDA Modal */}
      {showNda && data.nda_text && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full p-6 max-h-[80vh] overflow-y-auto">
            <h3 className="text-xl font-semibold text-slate-900 mb-4">Non-Disclosure Agreement</h3>
            <div className="prose prose-sm max-w-none mb-6 p-4 bg-slate-50 rounded-lg border border-slate-200 max-h-60 overflow-y-auto">
              <p className="whitespace-pre-wrap text-sm text-slate-700">{data.nda_text}</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => { setShowNda(false); setShowUnlockForm(false); setUnlockStatus("idle") }}
                className="flex-1 px-4 py-2 text-sm text-slate-600 border border-slate-300 rounded-lg hover:bg-slate-50"
              >
                Decline
              </button>
              <button
                onClick={handleNdaAccept}
                className="flex-1 px-4 py-2 text-sm text-white bg-blue-600 rounded-lg hover:bg-blue-700"
              >
                I Accept
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
