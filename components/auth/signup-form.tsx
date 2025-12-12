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

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match")
      return
    }

    if (!acceptedTerms || !acceptedPrivacy) {
      alert("Please accept the terms and conditions and privacy policy")
      return
    }

    setIsLoading(true)

    // Simulate API call and automatic scan initiation
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Redirect to dashboard with scanning in progress
    router.push("/dashboard/scan?autostart=true&url=" + encodeURIComponent(formData.websiteUrl))
  }

  return (
    <Card className="border-gray-200 shadow-lg">
      <CardHeader>
        <CardTitle>Sign Up</CardTitle>
        <CardDescription>Create your account and start your first security scan</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
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
