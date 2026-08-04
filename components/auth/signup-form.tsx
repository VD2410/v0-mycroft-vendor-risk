"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Eye, EyeOff, Upload, CheckCircle2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { fetchPresignedUrl } from "@/lib/presigned-url"
import { saveFile } from "@/lib/indexed-db"

export function SignUpForm() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    companyName: "",
    email: "",
    password: "",
    confirmPassword: "",
    websiteUrl: "",
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [acceptedTerms, setAcceptedTerms] = useState(false)
  const [acceptedPrivacy, setAcceptedPrivacy] = useState(false)
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setUploadedFiles(Array.from(e.target.files))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match")
      return
    }

    if (!acceptedTerms || !acceptedPrivacy) {
      setError("Please accept the terms and conditions and privacy policy")
      return
    }

    setIsLoading(true)

    try {
      // Step 1: Sign up with Supabase to get UID
      console.log("Step 1: Creating Supabase account...")
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            company_name: formData.companyName,
            website_url: formData.websiteUrl,
          },
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      })

      if (signUpError) {
        setError(signUpError.message)
        setIsLoading(false)
        return
      }

      if (!data.user) {
        setError("Signup failed. Please try again.")
        setIsLoading(false)
        return
      }

      const uid = data.user.id
      console.log("User created with UID:", uid)

      // Check if email confirmation is required
      if (!data.session?.access_token) {
        console.log("Email confirmation required. Waiting for user to confirm...")

        // Store signup metadata in localStorage (without file)
        const signupPayload = {
          companyName: formData.companyName,
          websiteUrl: formData.websiteUrl,
          tncAccepted: acceptedTerms.toString(),
          ppAccepted: acceptedPrivacy.toString(),
          userId: uid
        }

        // If there's a file, store it in IndexedDB
        if (uploadedFiles.length > 0) {
          const file = uploadedFiles[0]
          try {
            await saveFile(uid, file)
            console.log('File stored in IndexedDB for user:', uid)
          } catch (fileError) {
            console.error('Error storing file in IndexedDB:', fileError)
          }
        }

        localStorage.setItem("pending_signup_data", JSON.stringify(signupPayload))
        console.log("Signup data stored in localStorage")

        setError("Please check your email and click the confirmation link to continue. You can close this tab.")
        setIsLoading(false)
        return
      }

      // If we have a session, proceed immediately
      await continueSignupFlow(uid, data.session.access_token)

    } catch (err) {
      console.error("Signup error:", err)
      setError("An unexpected error occurred. Please try again.")
      setIsLoading(false)
    }
  }

  // Separate function to continue signup flow after email confirmation
  const continueSignupFlow = async (uid: string, accessToken: string) => {
    try {
      setIsLoading(true)
      setError("")

      // Step 2: Open WebSocket connection and get connection ID
      console.log("Step 2: Connecting to WebSocket...")
      let connectionId: string | null = null

      console.log("Access token available, connecting WebSocket...")
      try {
        connectionId = await new Promise<string>((resolve, reject) => {
          const ws = new WebSocket('wss://bnvxpvma1e.execute-api.ca-central-1.amazonaws.com/dev')

          ws.onopen = async () => {
            console.log('WebSocket connected')
            ws.send(JSON.stringify({
              action: 'register',
              token: accessToken
            }))
            console.log('WebSocket registration sent')
          }

          ws.onmessage = (event) => {
            try {
              const message = JSON.parse(event.data)
              console.log('WebSocket message received:', message)
              if (message.action === 'connected' && message.payload?.connectionId) {
                const connId = message.payload.connectionId
                console.log('Connection ID received:', connId)
                resolve(connId)
              }
            } catch (error) {
              console.error('Error parsing WebSocket message:', error)
            }
          }

          ws.onerror = (error) => {
            console.error('WebSocket error:', error)
            reject(error)
          }

          setTimeout(() => {
            reject(new Error('WebSocket connection timeout'))
          }, 10000)
        })
        console.log("WebSocket connection established with ID:", connectionId)
      } catch (wsError) {
        console.error('WebSocket connection failed:', wsError)
        setError("Failed to establish WebSocket connection. Please try again.")
        setIsLoading(false)
        return
      }

      // Step 3: Get presigned URL and upload files to S3
      let uploadedFileUrl = "https://dummy-url.com/soc2-report.pdf"

      if (connectionId && uploadedFiles.length > 0) {
        console.log("Step 3: Uploading files to S3...")
        const file = uploadedFiles[0] // Upload first file only

        try {
          console.log("Getting presigned URL for:", file.name)
          const presignedData = await fetchPresignedUrl(
            uid,
            file.name,
            connectionId,
            file.type || 'application/pdf',
            accessToken
          )
          console.log("Presigned URL obtained:", presignedData.url)

          // Step 4: Upload the file to S3 using the presigned URL
          console.log("Step 4: Uploading file to S3...")
          const uploadResponse = await fetch(presignedData.url, {
            method: 'PUT',
            headers: {
              'Content-Type': file.type || 'application/pdf',
            },
            body: file,
          })

          if (uploadResponse.ok) {
            // Store the S3 URL (without query params)
            uploadedFileUrl = presignedData.url.split('?')[0]
            console.log("File uploaded successfully to:", uploadedFileUrl)
          } else {
            console.error("Failed to upload file:", await uploadResponse.text())
          }
        } catch (uploadError) {
          console.error("Error uploading file:", uploadError)
        }
      }

      // Step 5: Send onboarding data to backend API
      console.log("Step 5: Calling onboarding API...")
      try {
        const onboardingResponse = await fetch(
          "https://4zg47io536.execute-api.ca-central-1.amazonaws.com/dev/dev/api/v1/company/onboarding",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              companyName: formData.companyName,
              uid: uid,
              companyWebsite: formData.websiteUrl,
              emailId: formData.email,
              soc2DocUrl: uploadedFileUrl,
              tncAccepted: acceptedTerms.toString(),
              ppAccepted: acceptedPrivacy.toString(),
            }),
          }
        )

        if (onboardingResponse.ok) {
          const onboardingResult = await onboardingResponse.json()
          console.log("Onboarding data saved successfully:", onboardingResult)

          // Store the onboarding response for later use
          if (onboardingResult.status && onboardingResult.body) {
            localStorage.setItem("company_onboarding", JSON.stringify(onboardingResult.body))

            // Step 5.5: Trigger datapipeline API
            const companyId = onboardingResult.body.id
            const companyName = onboardingResult.body.companyName

            console.log("Step 5.5: Calling datapipeline API...")
            try {
              const datapipelineResponse = await fetch(
                `/api/company/${companyId}/datapipeline`,
                {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({
                    name: companyName,
                  }),
                }
              )

              if (datapipelineResponse.ok) {
                console.log("Datapipeline triggered successfully")
              } else {
                console.error("Failed to trigger datapipeline:", await datapipelineResponse.text())
              }
            } catch (datapipelineError) {
              console.error("Error calling datapipeline API:", datapipelineError)
            }
          }
        } else {
          console.error("Failed to save onboarding data:", await onboardingResponse.text())
        }
      } catch (apiError) {
        console.error("Error calling onboarding API:", apiError)
      }

      // Step 6: Redirect to dashboard
      console.log("Step 6: Redirecting to dashboard...")
      router.push("/dashboard")
    } catch (err) {
      console.error("Signup error:", err)
      setError("An unexpected error occurred. Please try again.")
      setIsLoading(false)
    }
  }

  return (
    <Card className="border-gray-200 shadow-lg">
      <CardHeader>
        <CardTitle>Sign Up</CardTitle>
        <CardDescription>Create your account and start your first security scan</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          {/* Company Information */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-gray-900">Company Information</h3>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="companyName">Company Name</Label>
                <Input
                  id="companyName"
                  name="companyName"
                  placeholder="Acme Corp"
                  value={formData.companyName}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="websiteUrl">Website URL</Label>
                <Input
                  id="websiteUrl"
                  name="websiteUrl"
                  type="url"
                  placeholder="https://example.com"
                  value={formData.websiteUrl}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
          </div>

          {/* Account Credentials */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-gray-900">Account Credentials</h3>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="you@company.com"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Compliance Documents Upload */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-gray-900">Compliance Documents</h3>
            <p className="text-sm text-gray-600">
              Upload your compliance documents (SOC 2, ISO 27001, etc.) for faster assessment
            </p>

            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-primary transition-colors">
              <input
                type="file"
                id="compliance-docs"
                multiple
                accept=".pdf,.doc,.docx"
                onChange={handleFileUpload}
                className="hidden"
              />
              <label htmlFor="compliance-docs" className="cursor-pointer">
                <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                <p className="text-sm text-gray-600">Click to upload or drag and drop</p>
                <p className="text-xs text-gray-500 mt-1">PDF, DOC, DOCX (Max 10MB each)</p>
              </label>
            </div>

            {uploadedFiles.length > 0 && (
              <div className="space-y-2">
                {uploadedFiles.map((file, index) => (
                  <div key={index} className="flex items-center gap-2 text-sm text-gray-700 bg-green-50 p-2 rounded">
                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                    <span>{file.name}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Legal Agreements */}
          <div className="space-y-4 pt-4 border-t border-gray-200">
            <div className="flex items-start space-x-3">
              <Checkbox
                id="terms"
                checked={acceptedTerms}
                onCheckedChange={(checked) => setAcceptedTerms(checked as boolean)}
              />
              <Label htmlFor="terms" className="text-sm font-normal cursor-pointer leading-relaxed">
                I accept the{" "}
                <a href="/terms" target="_blank" className="text-primary hover:underline" rel="noreferrer">
                  Terms and Conditions
                </a>
              </Label>
            </div>

            <div className="flex items-start space-x-3">
              <Checkbox
                id="privacy"
                checked={acceptedPrivacy}
                onCheckedChange={(checked) => setAcceptedPrivacy(checked as boolean)}
              />
              <Label htmlFor="privacy" className="text-sm font-normal cursor-pointer leading-relaxed">
                I accept the{" "}
                <a href="/privacy" target="_blank" className="text-primary hover:underline" rel="noreferrer">
                  Privacy Policy
                </a>
              </Label>
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={isLoading || !acceptedTerms || !acceptedPrivacy}>
            {isLoading ? "Creating Account & Starting Scan..." : "Create Account & Start Scan"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
