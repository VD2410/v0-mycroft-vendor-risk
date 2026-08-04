'use client'
import dynamic from 'next/dynamic'
const DocumentsClient = dynamic(() => import('./DocumentsClient'), { ssr: false })
export default function Page() { return <DocumentsClient /> }
