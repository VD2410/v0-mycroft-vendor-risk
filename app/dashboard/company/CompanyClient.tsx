'use client'
import { useSearchParams } from "next/navigation"
import { Suspense } from "react"
import { CompanyScorecard } from "@/components/dashboard/company-scorecard"

function CompanyContent() {
  const searchParams = useSearchParams()
  const id = searchParams.get('id') || '1'
  return <CompanyScorecard companyId={id} />
}

export default function CompanyPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center h-screen"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>}>
      <CompanyContent />
    </Suspense>
  )
}
