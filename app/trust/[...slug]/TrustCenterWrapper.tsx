'use client'
import dynamic from 'next/dynamic'
const TrustCenterPublic = dynamic(() => import('@/components/trust-center/TrustCenterPublic'), { ssr: false })
export default function TrustCenterWrapper() { return <TrustCenterPublic /> }
