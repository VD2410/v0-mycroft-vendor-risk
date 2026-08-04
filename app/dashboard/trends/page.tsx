'use client'
import dynamic from 'next/dynamic'
const TrendsClient = dynamic(() => import('./TrendsClient'), { ssr: false })
export default function Page() { return <TrendsClient /> }
