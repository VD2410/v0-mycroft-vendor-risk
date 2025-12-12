"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Check, CreditCard, Zap } from "lucide-react"

const plans = [
  {
    name: "Free Scan",
    price: "$0",
    description: "Try RiskAssure with a single company assessment",
    features: ["1 company scan", "Basic risk scorecard", "Signal overview", "PDF export"],
    current: false,
  },
  {
    name: "Professional",
    price: "$199",
    period: "/month",
    description: "For security teams managing vendor risk",
    features: [
      "10 scans per month",
      "Full risk intelligence",
      "Historical trending",
      "Compliance mapping",
      "API access",
      "Priority support",
    ],
    current: true,
    popular: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    description: "Unlimited assessments for large organizations",
    features: [
      "Unlimited scans",
      "White-label reports",
      "Custom integrations",
      "Dedicated CSM",
      "SLA guarantees",
      "On-premise option",
    ],
    current: false,
  },
]

const invoices = [
  { id: "INV-001", date: "Dec 1, 2025", amount: "$199.00", status: "Paid" },
  { id: "INV-002", date: "Nov 1, 2025", amount: "$199.00", status: "Paid" },
  { id: "INV-003", date: "Oct 1, 2025", amount: "$199.00", status: "Paid" },
]

export function BillingPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Billing & Subscription</h1>
        <p className="text-muted-foreground">Manage your plan and payment methods</p>
      </div>

      {/* Current Plan */}
      <Card className="glass glow-accent">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Current Plan: Professional</CardTitle>
              <CardDescription>Your subscription renews on January 1, 2026</CardDescription>
            </div>
            <Badge className="bg-accent text-accent-foreground">Active</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="text-3xl font-bold text-foreground">
                $199<span className="text-lg text-muted-foreground">/month</span>
              </div>
              <div className="text-sm text-muted-foreground">
                <span className="text-accent font-medium">7/10</span> scans used this month
              </div>
            </div>
            <Button variant="outline">Manage Subscription</Button>
          </div>
        </CardContent>
      </Card>

      {/* Plans */}
      <div className="grid md:grid-cols-3 gap-6">
        {plans.map((plan) => (
          <Card key={plan.name} className={`glass ${plan.current ? "ring-2 ring-accent" : ""}`}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{plan.name}</CardTitle>
                {plan.popular && <Badge className="bg-accent text-accent-foreground">Popular</Badge>}
              </div>
              <div className="mt-2">
                <span className="text-3xl font-bold text-foreground">{plan.price}</span>
                {plan.period && <span className="text-muted-foreground">{plan.period}</span>}
              </div>
              <CardDescription>{plan.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 mb-6">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2 text-sm text-foreground">
                    <Check className="w-4 h-4 text-accent" />
                    {feature}
                  </li>
                ))}
              </ul>
              <Button
                className={`w-full ${plan.current ? "" : "bg-accent text-accent-foreground hover:bg-accent/90"}`}
                variant={plan.current ? "outline" : "default"}
                disabled={plan.current}
              >
                {plan.current ? "Current Plan" : "Upgrade"}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Payment Method */}
      <Card className="glass">
        <CardHeader>
          <CardTitle className="text-base">Payment Method</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between p-4 rounded-lg bg-secondary/50">
            <div className="flex items-center gap-3">
              <div className="w-12 h-8 rounded bg-gradient-to-r from-blue-600 to-blue-400 flex items-center justify-center">
                <CreditCard className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="font-medium text-foreground">•••• •••• •••• 4242</div>
                <div className="text-sm text-muted-foreground">Expires 12/2027</div>
              </div>
            </div>
            <Button variant="outline" size="sm">
              Update
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Invoices */}
      <Card className="glass">
        <CardHeader>
          <CardTitle className="text-base">Invoice History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {invoices.map((invoice) => (
              <div key={invoice.id} className="flex items-center justify-between p-3 rounded-lg bg-secondary/50">
                <div className="flex items-center gap-4">
                  <Zap className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <div className="text-sm font-medium text-foreground">{invoice.id}</div>
                    <div className="text-xs text-muted-foreground">{invoice.date}</div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-sm font-medium text-foreground">{invoice.amount}</span>
                  <Badge className="bg-chart-1/20 text-chart-1 border-chart-1/30">{invoice.status}</Badge>
                  <Button variant="ghost" size="sm">
                    Download
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
