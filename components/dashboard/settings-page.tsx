"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { User, Building, Bell, Shield, Key, CreditCard, Check, Zap } from "lucide-react"
import { cn } from "@/lib/utils"

const tabs = [
  { id: "profile", label: "Profile", icon: User },
  { id: "organization", label: "Organization", icon: Building },
  { id: "billing", label: "Billing", icon: CreditCard },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "security", label: "Security", icon: Shield },
  { id: "api-keys", label: "API Keys", icon: Key },
]

const plans = [
  { name: "Free Scan", price: "$0", description: "Try RiskAssure with a single company assessment", features: ["1 company scan", "Basic risk scorecard", "Signal overview", "PDF export"], current: false },
  { name: "Professional", price: "$199", period: "/month", description: "For security teams managing vendor risk", features: ["10 scans per month", "Full risk intelligence", "Historical trending", "Compliance mapping", "API access", "Priority support"], current: true, popular: true },
  { name: "Enterprise", price: "Custom", description: "Unlimited assessments for large organizations", features: ["Unlimited scans", "White-label reports", "Custom integrations", "Dedicated CSM", "SLA guarantees", "On-premise option"], current: false },
]

const invoices = [
  { id: "INV-001", date: "Dec 1, 2025", amount: "$199.00", status: "Paid" },
  { id: "INV-002", date: "Nov 1, 2025", amount: "$199.00", status: "Paid" },
  { id: "INV-003", date: "Oct 1, 2025", amount: "$199.00", status: "Paid" },
]

export function SettingsPage() {
  const [activeTab, setActiveTab] = useState("profile")

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Settings</h1>
        <p className="text-muted-foreground">Manage your account and organization settings</p>
      </div>

      <div className="flex flex-wrap gap-2 border-b border-border pb-3">
        {tabs.map((tab) => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={cn("flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors", activeTab === tab.id ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted hover:text-foreground")}>
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === "profile" && (
        <Card className="glass"><CardHeader><div className="flex items-center gap-2"><User className="w-5 h-5 text-accent" /><CardTitle className="text-base">Profile</CardTitle></div></CardHeader><CardContent className="space-y-4"><div className="grid sm:grid-cols-2 gap-4"><div className="space-y-2"><Label htmlFor="name">Full Name</Label><Input id="name" defaultValue="Admin User" className="bg-secondary border-border" /></div><div className="space-y-2"><Label htmlFor="email">Email</Label><Input id="email" type="email" defaultValue="admin@company.com" className="bg-secondary border-border" /></div></div><Button>Save Changes</Button></CardContent></Card>
      )}

      {activeTab === "organization" && (
        <Card className="glass"><CardHeader><div className="flex items-center gap-2"><Building className="w-5 h-5 text-accent" /><CardTitle className="text-base">Organization</CardTitle></div><CardDescription>Manage your workspace settings</CardDescription></CardHeader><CardContent className="space-y-4"><div className="grid sm:grid-cols-2 gap-4"><div className="space-y-2"><Label htmlFor="org">Organization Name</Label><Input id="org" defaultValue="Acme Corp" className="bg-secondary border-border" /></div><div className="space-y-2"><Label htmlFor="domain">Domain</Label><Input id="domain" defaultValue="acme.com" className="bg-secondary border-border" /></div></div><Button>Update Organization</Button></CardContent></Card>
      )}

      {activeTab === "billing" && (
        <div className="space-y-6">
          <Card className="glass glow-accent"><CardHeader><div className="flex items-center justify-between"><div><CardTitle>Current Plan: Professional</CardTitle><CardDescription>Your subscription renews on January 1, 2026</CardDescription></div><Badge className="bg-accent text-accent-foreground">Active</Badge></div></CardHeader><CardContent><div className="flex items-center justify-between"><div className="flex items-center gap-4"><div className="text-3xl font-bold text-foreground">$199<span className="text-lg text-muted-foreground">/month</span></div><div className="text-sm text-muted-foreground"><span className="text-accent font-medium">7/10</span> scans used this month</div></div><Button variant="outline">Manage Subscription</Button></div></CardContent></Card>
          <div className="grid md:grid-cols-3 gap-6">{plans.map((plan) => (<Card key={plan.name} className={`glass ${plan.current ? "ring-2 ring-accent" : ""}`}><CardHeader><div className="flex items-center justify-between"><CardTitle className="text-lg">{plan.name}</CardTitle>{plan.popular && <Badge className="bg-accent text-accent-foreground">Popular</Badge>}</div><div className="mt-2"><span className="text-3xl font-bold text-foreground">{plan.price}</span>{plan.period && <span className="text-muted-foreground">{plan.period}</span>}</div><CardDescription>{plan.description}</CardDescription></CardHeader><CardContent><ul className="space-y-2 mb-6">{plan.features.map((feature) => (<li key={feature} className="flex items-center gap-2 text-sm text-foreground"><Check className="w-4 h-4 text-accent" />{feature}</li>))}</ul><Button className={`w-full ${plan.current ? "" : "bg-accent text-accent-foreground hover:bg-accent/90"}`} variant={plan.current ? "outline" : "default"} disabled={plan.current}>{plan.current ? "Current Plan" : "Upgrade"}</Button></CardContent></Card>))}</div>
          <Card className="glass"><CardHeader><CardTitle className="text-base">Payment Method</CardTitle></CardHeader><CardContent><div className="flex items-center justify-between p-4 rounded-lg bg-secondary/50"><div className="flex items-center gap-3"><div className="w-12 h-8 rounded bg-gradient-to-r from-blue-600 to-blue-400 flex items-center justify-center"><CreditCard className="w-5 h-5 text-white" /></div><div><div className="font-medium text-foreground">•••• •••• •••• 4242</div><div className="text-sm text-muted-foreground">Expires 12/2027</div></div></div><Button variant="outline" size="sm">Update</Button></div></CardContent></Card>
          <Card className="glass"><CardHeader><CardTitle className="text-base">Invoice History</CardTitle></CardHeader><CardContent><div className="space-y-2">{invoices.map((invoice) => (<div key={invoice.id} className="flex items-center justify-between p-3 rounded-lg bg-secondary/50"><div className="flex items-center gap-4"><Zap className="w-4 h-4 text-muted-foreground" /><div><div className="text-sm font-medium text-foreground">{invoice.id}</div><div className="text-xs text-muted-foreground">{invoice.date}</div></div></div><div className="flex items-center gap-4"><span className="text-sm font-medium text-foreground">{invoice.amount}</span><Badge className="bg-chart-1/20 text-chart-1 border-chart-1/30">{invoice.status}</Badge><Button variant="ghost" size="sm">Download</Button></div></div>))}</div></CardContent></Card>
        </div>
      )}

      {activeTab === "notifications" && (
        <Card className="glass"><CardHeader><div className="flex items-center gap-2"><Bell className="w-5 h-5 text-accent" /><CardTitle className="text-base">Notifications</CardTitle></div></CardHeader><CardContent className="space-y-4"><div className="flex items-center justify-between"><div><div className="font-medium text-foreground">Email Notifications</div><div className="text-sm text-muted-foreground">Receive scan completion alerts</div></div><Switch defaultChecked /></div><div className="flex items-center justify-between"><div><div className="font-medium text-foreground">Risk Score Alerts</div><div className="text-sm text-muted-foreground">Get notified when scores change significantly</div></div><Switch defaultChecked /></div><div className="flex items-center justify-between"><div><div className="font-medium text-foreground">Weekly Digest</div><div className="text-sm text-muted-foreground">Summary of all monitored companies</div></div><Switch /></div></CardContent></Card>
      )}

      {activeTab === "security" && (
        <Card className="glass"><CardHeader><div className="flex items-center gap-2"><Shield className="w-5 h-5 text-accent" /><CardTitle className="text-base">Security</CardTitle></div></CardHeader><CardContent className="space-y-4"><div className="flex items-center justify-between"><div><div className="font-medium text-foreground">Two-Factor Authentication</div><div className="text-sm text-muted-foreground">Add an extra layer of security</div></div><Button variant="outline" size="sm">Enable</Button></div><div className="flex items-center justify-between"><div><div className="font-medium text-foreground">Change Password</div><div className="text-sm text-muted-foreground">Update your account password</div></div><Button variant="outline" size="sm">Update</Button></div></CardContent></Card>
      )}

      {activeTab === "api-keys" && (
        <Card className="glass"><CardHeader><div className="flex items-center gap-2"><Key className="w-5 h-5 text-accent" /><CardTitle className="text-base">API Keys</CardTitle></div><CardDescription>Manage API access for integrations</CardDescription></CardHeader><CardContent className="space-y-4"><div className="p-4 rounded-lg bg-secondary/50"><div className="flex items-center justify-between"><div><div className="font-mono text-sm text-foreground">ra_live_****************************</div><div className="text-xs text-muted-foreground">Created Dec 1, 2025</div></div><Button variant="outline" size="sm">Revoke</Button></div></div><Button>Generate New Key</Button></CardContent></Card>
      )}
    </div>
  )
}
