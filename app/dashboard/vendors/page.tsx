'use client'
import dynamic from 'next/dynamic'
const VendorsClient = dynamic(() => import('./VendorsClient'), { ssr: false })
export default function Page() { return <VendorsClient /> }
