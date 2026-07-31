'use client'
import dynamic from 'next/dynamic'
const BillingClient = dynamic(() => import('./BillingClient'), { ssr: false })
export default function Page() { return <BillingClient /> }
