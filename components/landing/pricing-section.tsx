import { Button } from "@/components/ui/button"
import { Check } from "lucide-react"
import Link from "next/link"

const plans = [
  {
    name: "Free Scan",
    price: "$0",
    description: "Try WISR with a single company assessment",
    features: ["1 company scan", "Basic risk scorecard", "Signal overview", "PDF export"],
    cta: "Start Free Scan",
    popular: false,
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
    cta: "Start Trial",
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
      "Priority support",
      "On-premise option",
    ],
    cta: "Contact Sales",
    popular: false,
  },
]

export function PricingSection() {
  return (
    <section id="pricing" className="py-20 px-4 sm:px-6 lg:px-8 bg-secondary/30">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground">Simple, Transparent Pricing</h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            Start with a free scan, upgrade as you grow
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`bg-card rounded-xl p-6 relative border border-border shadow-sm ${plan.popular ? "ring-2 ring-primary glow-blue" : ""}`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="bg-primary text-primary-foreground text-xs font-medium px-3 py-1 rounded-full">
                    Most Popular
                  </span>
                </div>
              )}
              <div className="text-center mb-6">
                <h3 className="text-lg font-semibold text-foreground">{plan.name}</h3>
                <div className="mt-2">
                  <span className="text-4xl font-bold text-foreground">{plan.price}</span>
                  {plan.period && <span className="text-muted-foreground">{plan.period}</span>}
                </div>
                <p className="text-sm text-muted-foreground mt-2">{plan.description}</p>
              </div>

              <ul className="space-y-3 mb-6">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2 text-sm text-foreground">
                    <Check className="w-4 h-4 text-primary shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>

              <Button
                className={`w-full ${plan.popular ? "bg-primary text-primary-foreground hover:bg-primary/90" : ""}`}
                variant={plan.popular ? "default" : "outline"}
                asChild
              >
                <Link href="/dashboard">{plan.cta}</Link>
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
