'use client'
import dynamic from 'next/dynamic'
const TrustCenterManagement = dynamic(() => import('@/components/trust-center/TrustCenterManagement'), { ssr: false })
export default function Page() { return <TrustCenterManagement /> }
