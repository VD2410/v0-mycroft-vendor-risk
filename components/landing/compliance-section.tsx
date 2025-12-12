import { Shield, Clock, Lock, Eye, CheckCircle } from "lucide-react"

const frameworks = [
  {
    name: "SOC 2 Type II",
    description:
      "Trust Service Criteria mapping for Security, Availability, Confidentiality, Privacy, and Processing Integrity.",
    icon: Shield,
  },
  {
    name: "NIST CSF",
    description: "Cybersecurity Framework alignment across Identify, Protect, Detect, Respond, and Recover functions.",
    icon: CheckCircle,
  },
  {
    name: "ISO 27001",
    description: "Information Security Management System controls mapped to Annex A requirements.",
    icon: Lock,
  },
]

const trustCategories = [
  { name: "Security", icon: Shield, description: "Protection against unauthorized access" },
  { name: "Availability", icon: Clock, description: "System uptime and reliability" },
  { name: "Confidentiality", icon: Lock, description: "Data protection and privacy" },
  { name: "Privacy", icon: Eye, description: "Personal data handling compliance" },
  { name: "Integrity", icon: CheckCircle, description: "Processing accuracy and completeness" },
]

export function ComplianceSection() {
  return (
    <section id="compliance" className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground">Compliance Intelligence</h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            Map risk findings directly to major compliance frameworks
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Framework cards */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground mb-4">Supported Frameworks</h3>
            {frameworks.map((framework) => (
              <div
                key={framework.name}
                className="bg-card rounded-xl p-5 flex items-start gap-4 border border-border shadow-sm"
              >
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <framework.icon className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h4 className="font-semibold text-foreground">{framework.name}</h4>
                  <p className="text-sm text-muted-foreground mt-1">{framework.description}</p>
                </div>
              </div>
            ))}
          </div>

          {/* SOC 2 categories */}
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-4">SOC 2 Trust Categories</h3>
            <div className="bg-card rounded-xl p-6 border border-border shadow-sm">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {trustCategories.map((category) => (
                  <div key={category.name} className="text-center p-4 rounded-lg bg-secondary/50">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-2">
                      <category.icon className="w-5 h-5 text-primary" />
                    </div>
                    <div className="text-sm font-medium text-foreground">{category.name}</div>
                    <div className="text-xs text-muted-foreground mt-1">{category.description}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
