import { CompanyScorecard } from "@/components/dashboard/company-scorecard"

export default async function CompanyPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  return <CompanyScorecard companyId={id} />
}
