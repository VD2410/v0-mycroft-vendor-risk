"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { fetchPresignedUrl } from "@/lib/presigned-url"
import { getFile, deleteFile } from "@/lib/indexed-db"

export default function AuthCallback() {
    const router = useRouter()
    const [status, setStatus] = useState("Processing your confirmation...")
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const handleEmailConfirmation = async () => {
            try {
                // Get the current session after email confirmation
                const { data: { session }, error: sessionError } = await supabase.auth.getSession()

                if (sessionError) {
                    setError("Failed to get session: " + sessionError.message)
                    return
                }

                if (!session) {
                    setError("No session found. Please try signing up again.")
                    setTimeout(() => router.push("/signup"), 3000)
                    return
                }

                const uid = session.user.id
                const accessToken = session.access_token
                const userMetadata = session.user.user_metadata

                console.log("Email confirmed! User ID:", uid)
                console.log("User metadata:", userMetadata)

                // Retrieve signup data from localStorage (if stored during signup)
                const signupDataStr = localStorage.getItem("pending_signup_data")

                if (!signupDataStr) {
                    // If no pending signup data, just redirect to dashboard
                    console.log("No pending signup data found. Redirecting to dashboard...")
                    setStatus("Email confirmed! Redirecting to dashboard...")
                    setTimeout(() => router.push("/dashboard"), 2000)
                    return
                }

                const signupData = JSON.parse(signupDataStr)
                setStatus("Email confirmed! Completing your registration...")

                // Retrieve file from IndexedDB if it exists
                let fileToUpload: File | null = null
                console.log("Attempting to retrieve file for userId:", uid)
                try {
                    fileToUpload = await getFile(uid)
                    if (fileToUpload) {
                        console.log("File retrieved from IndexedDB:", fileToUpload.name, "Size:", fileToUpload.size)
                    } else {
                        console.log("No file found in IndexedDB")
                    }
                } catch (error) {
                    console.error("Error retrieving file from IndexedDB:", error)
                }

                // Step 2: Open WebSocket connection and get connection ID
                console.log("Step 2: Connecting to WebSocket...")
                let connectionId: string | null = null
                let tempWsRef: WebSocket | null = null

                try {
                    connectionId = await new Promise<string>((resolve, reject) => {
                        const tempWs = new WebSocket('wss://bnvxpvma1e.execute-api.ca-central-1.amazonaws.com/dev')
                        tempWsRef = tempWs

                        tempWs.onopen = () => {
                            console.log('WebSocket connected')
                            tempWs.send(JSON.stringify({
                                action: 'register',
                                token: accessToken
                            }))
                            console.log('WebSocket registration sent')
                        }

                        tempWs.onmessage = (event) => {
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

                        tempWs.onerror = (error) => {
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
                    console.log("Setting connectionId to null due to WebSocket error")
                    connectionId = null
                    // Continue without WebSocket - will use dummy URL
                }

                // Step 3 & 4: Upload file to S3 if available
                setStatus("Uploading your documents...")
                let uploadedFileUrl = "https://dummy-url.com/soc2-report.pdf"

                console.log("Checking upload conditions - connectionId:", connectionId, "fileToUpload:", fileToUpload?.name)

                if (connectionId && fileToUpload) {
                    console.log("Step 3: Uploading file to S3...")

                    try {
                        console.log("Getting presigned URL for:", fileToUpload.name)
                        const presignedData = await fetchPresignedUrl(
                            uid,
                            fileToUpload.name,
                            connectionId,
                            fileToUpload.type || 'application/pdf',
                            accessToken
                        )
                        console.log("Presigned URL obtained:", presignedData.url)

                        // Step 4: Upload the file to S3 using the presigned URL
                        console.log("Step 4: Uploading file to S3...")
                        const uploadResponse = await fetch(presignedData.url, {
                            method: 'PUT',
                            headers: {
                                'Content-Type': fileToUpload.type || 'application/pdf',
                            },
                            body: fileToUpload,
                        })

                        if (uploadResponse.ok) {
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
                setStatus("Saving your information...")
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
                                companyName: signupData.companyName || userMetadata.company_name,
                                uid: uid,
                                companyWebsite: signupData.websiteUrl || userMetadata.website_url,
                                emailId: session.user.email,
                                soc2DocUrl: uploadedFileUrl,
                                tncAccepted: signupData.tncAccepted || "true",
                                ppAccepted: signupData.ppAccepted || "true",
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

                            setStatus("Starting data analysis...")
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

                // Clear the pending signup data
                localStorage.removeItem("pending_signup_data")

                // Clear localStorage and IndexedDB
                localStorage.removeItem("pending_signup_data")
                try {
                    await deleteFile(uid)
                    console.log("Cleared signup data from localStorage and file from IndexedDB")
                } catch (cleanupError) {
                    console.error("Error cleaning up IndexedDB:", cleanupError)
                }

                // Close the temporary WebSocket connection
                try {
                    const ws = tempWsRef as WebSocket | null
                    if (ws) {
                        console.log("Closing temporary WebSocket connection...")
                        ws.close()
                    }
                } catch (closeError) {
                    console.log("WebSocket already closed or error closing:", closeError)
                }

                // Step 6: Redirect to dashboard
                setStatus("Success! Redirecting to your dashboard...")
                console.log("Step 6: Redirecting to dashboard...")
                setTimeout(() => router.push("/dashboard"), 2000)

            } catch (err) {
                console.error("Error in auth callback:", err)
                setError("An error occurred during confirmation. Please try again.")
            }
        }

        handleEmailConfirmation()
    }, [router])

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50">
            <div className="w-full max-w-md space-y-4 rounded-lg bg-white p-8 shadow-lg">
                {error ? (
                    <div>
                        <h2 className="text-xl font-semibold text-red-600">Error</h2>
                        <p className="mt-2 text-gray-600">{error}</p>
                    </div>
                ) : (
                    <div>
                        <h2 className="text-xl font-semibold text-gray-900">{status}</h2>
                        <div className="mt-4 flex justify-center">
                            <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600"></div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
