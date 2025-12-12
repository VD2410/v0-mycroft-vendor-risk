import { Search, Cpu, FileText, Shield } from "lucide-react"

const steps = [
  {
    icon: Search,
    title: "Enter Company Details",
    description:
      "Input the company name and domain you want to assess. Our system begins comprehensive signal collection.",
  },
  {
    icon: Cpu,
    title: "AI Signal Analysis",
    description:
      "Our AI processes 150+ OSINT sources including CVE databases, dark web monitoring, and reputation feeds.",
  },
  {
    icon: FileText,
    title: "Multi-Factor Scoring",
    description:
      "Receive detailed risk scores across 6 categories with full evidence and justification for each finding.",
  },
  {
    icon: Shield,
    title: "Actionable Intelligence",
    description: "Get prioritized remediation steps mapped to SOC 2, NIST, and ISO 27001 compliance frameworks.",
  },
]

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-20 px-4 sm:px-6 lg:px-8 bg-secondary/30">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground">How It Works</h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            From company name to comprehensive risk intelligence in under 2 minutes
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div key={step.title} className="relative">
              <div className="bg-card rounded-xl p-6 h-full border border-border shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <step.icon className="w-5 h-5 text-primary" />
                  </div>
                  <span className="text-sm font-mono text-muted-foreground">0{index + 1}</span>
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">{step.title}</h3>
                <p className="text-sm text-muted-foreground">{step.description}</p>
              </div>
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-1/2 -right-4 w-8 h-0.5 bg-border" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
