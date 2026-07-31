'use client'
import dynamic from 'next/dynamic'
const SigninClient = dynamic(() => import('./SigninClient'), { ssr: false })
export default function Page() { return <SigninClient /> }
