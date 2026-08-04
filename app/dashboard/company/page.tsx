'use client'
import dynamic from 'next/dynamic'
const CompanyClient = dynamic(() => import('./CompanyClient'), { ssr: false })
export default function Page() { return <CompanyClient /> }
