import { SignUpForm } from "@/components/auth/signup-form"
import { WisrLogo } from "@/components/wisr-logo"
import Link from "next/link"

export default function SignUpPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-cyan-50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-8">
          <Link href="/" className="inline-block mb-6">
            <WisrLogo size="md" />
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Create Your Account</h1>
          <p className="text-gray-600">Get started with RiskAssure in minutes</p>
        </div>

        <SignUpForm />

        <p className="text-center mt-6 text-sm text-gray-600">
          Already have an account?{" "}
          <Link href="/signin" className="text-primary font-medium hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}
