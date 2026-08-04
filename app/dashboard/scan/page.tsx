'use client'
import dynamic from 'next/dynamic'
const ScanClient = dynamic(() => import('./ScanClient'), { ssr: false })
export default function Page() { return <ScanClient /> }
