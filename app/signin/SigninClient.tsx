import { SignInForm } from "@/components/auth/signin-form"
import { WisrLogo } from "@/components/wisr-logo"
import Link from "next/link"

export default function SignInPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-cyan-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-block mb-6">
            <WisrLogo size="md" />
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h1>
          <p className="text-gray-600">Sign in to access your RiskAssure dashboard</p>
        </div>

        <SignInForm />

        <p className="text-center mt-6 text-sm text-gray-600">
          Don't have an account?{" "}
          <Link href="/signup" className="text-primary font-medium hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  )
}
