// Mock data based on real Mycroft assessment
export const companies = [
  {
    id: "mycroft",
    name: "Mycroft",
    domain: "mycroft.io",
    industry: "Cybersecurity SaaS",
    location: "Toronto, Canada",
    founded: "2024",
    employees: "10-50",
    funding: "~$3.5M USD",
    lastScan: "2025-12-08",
    isFavorite: true,
  },
]

export const mycroftScores = {
  companyId: "mycroft",
  overallScore: 66,
  riskLevel: "Moderate",
  scores: {
    cyberThreat: {
      score: 60,
      label: "Cyber Threat Score",
      justification:
        "Security vendors are high-value targets by definition. Mycroft centralizes cloud, device, and GRC operations, so compromise could provide wide access to customer environments. However, it is still relatively small and young, potentially drawing less attention than hyperscale peers. No public breach or compromise disclosed so far.",
    },
    vulnerability: {
      score: 65,
      label: "Vulnerability Score",
      justification:
        "No platform-specific CVEs identified. Agentic AI and heavy automation can both reduce and introduce risk depending on control design. Historical CVEs for 'Mycroft AI mycroft-core' are unrelated products and should not be treated as vendor findings.",
    },
    darkWeb: {
      score: 75,
      label: "Dark Web Score",
      justification:
        "No OSINT-visible evidence of credentials or Mycroft-specific data circulating; no breach reports mentioning them as victims. This is a weak positive only—dark-web coverage requires specialized feeds.",
    },
    thirdParty: {
      score: 58,
      label: "Third-Party Risk Score",
      justification:
        "Mycroft's value comes from deep integration into cloud, SCM, identity, HRIS, and ticketing systems (150–250+ integrations, API-driven). This creates significant blast radius if their platform is compromised, similar to Vanta/Drata but with less historical proof of secure operation.",
    },
    reputation: {
      score: 83,
      label: "Reputation Score",
      justification:
        "Backed by reputable Canadian and fintech-focused VCs (Luge, Brightspark, Graphite) with repeated positive coverage in SecurityWeek, BetaKit, and others. Listed in Canadian cyber directories and VC portfolios as a core security asset. No negative media.",
    },
  },
  weights: {
    cyberThreat: 25,
    vulnerability: 25,
    darkWeb: 20,
    thirdParty: 20,
    reputation: 10,
  },
}

export const signalData = [
  {
    id: 1,
    category: "Firmographic",
    source: "Brightspark, Luge, Graphite, BetaKit, G2",
    finding:
      "Founded 2024, HQ Toronto, Canada; seed + extension ≈ USD 3.5M; early-stage, cybersecurity/compliance SaaS for B2B startups/SMBs.",
    severity: "Info",
    confidence: "High",
  },
  {
    id: 2,
    category: "Tech Footprint",
    source: "Product, Integrations, Blog (mycroft.io)",
    finding:
      "AI-native platform with agentic automation; integrates with AWS, Azure, GCP, GitHub, GitLab, Bitbucket and ~150–250+ tools; performs cloud config checks, device management, codebase and infra scans.",
    severity: "Medium",
    confidence: "High",
  },
  {
    id: 3,
    category: "Tech Footprint (Infra)",
    source: "status.mycroft.io",
    finding:
      "SaaS with Core API and monitoring; status page shows high uptime (≈99.89%), no major public outages or incidents disclosed.",
    severity: "Low",
    confidence: "Medium",
  },
  {
    id: 4,
    category: "Vulnerabilities",
    source: "NVD / CVE entries",
    finding:
      "CVEs exist for the legacy Mycroft open-source voice assistant, not this company. No public platform-specific CVEs for mycroft.io identified.",
    severity: "Low",
    confidence: "Medium",
  },
  {
    id: 5,
    category: "Dark Web / Breach Intel",
    source: "SecurityWeek, security media",
    finding:
      "No public reporting of breaches at Mycroft (as victim) found. Some coverage mentions Mycroft as vendor in context of security posture, not breach.",
    severity: "Low",
    confidence: "Low-Medium",
  },
  {
    id: 6,
    category: "Third-Party Exposure",
    source: "Integrations page, SOC 2 blog",
    finding:
      "150–250+ integrations across cloud, identity, SCM, ticketing, etc. This is a strong value prop but also significant vendor graph exposure and data-flow complexity.",
    severity: "High",
    confidence: "High",
  },
  {
    id: 7,
    category: "Reputation",
    source: "Brightspark, Luge, SecurityWeek, BetaKit",
    finding:
      "Strongly positive: recent funding, thought-leadership, portfolio listings, and 'trusted by' messaging. No public negative coverage.",
    severity: "Low",
    confidence: "High",
  },
  {
    id: 8,
    category: "Risk Peers",
    source: "Vanta, Drata, Thoropass, Scrut",
    finding:
      "Peers operate similar GRC/automation platforms at larger scale. Vanta disclosed a cross-tenant data exposure bug in 2025; no comparable public incidents for others surfaced.",
    severity: "Medium",
    confidence: "High",
  },
]

export const recommendedActions = [
  {
    priority: 1,
    title: "Require Scoped Integration Design",
    description:
      "Require Mycroft to use least-privilege scopes for all integrations – cloud, IdP, SCM, ticketing. Enforce strict separation of read-only monitoring vs. write/remediation permissions.",
    framework: "SOC 2 CC6, CC7",
  },
  {
    priority: 2,
    title: "Request Tenant Isolation Documentation",
    description:
      "Request architectural documentation on multi-tenant data isolation (per-tenant keys, logical vs. physical segregation, access control enforcement).",
    framework: "ISO 27001 A.9",
  },
  {
    priority: 3,
    title: "Validate Compliance Roadmap",
    description:
      "Require roadmap and timelines for Mycroft's own SOC 2 Type II / ISO 27001 attestations; review any existing internal/external audits.",
    framework: "NIST CSF PR.IP",
  },
]

export const historicalScores = [
  { date: "2025-10-01", overall: 62, threat: 55, vuln: 60, darkWeb: 70, thirdParty: 55, reputation: 80 },
  { date: "2025-10-15", overall: 63, threat: 56, vuln: 62, darkWeb: 72, thirdParty: 56, reputation: 81 },
  { date: "2025-11-01", overall: 64, threat: 58, vuln: 63, darkWeb: 73, thirdParty: 57, reputation: 82 },
  { date: "2025-11-15", overall: 65, threat: 59, vuln: 64, darkWeb: 74, thirdParty: 57, reputation: 82 },
  { date: "2025-12-01", overall: 65, threat: 59, vuln: 65, darkWeb: 74, thirdParty: 58, reputation: 83 },
  { date: "2025-12-08", overall: 66, threat: 60, vuln: 65, darkWeb: 75, thirdParty: 58, reputation: 83 },
]
