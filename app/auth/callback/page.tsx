'use client'
import dynamic from 'next/dynamic'
const AuthCallbackClient = dynamic(() => import('./AuthCallbackClient'), { ssr: false })
export default function Page() { return <AuthCallbackClient /> }
