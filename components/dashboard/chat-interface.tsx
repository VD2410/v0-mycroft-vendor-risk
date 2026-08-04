"use client"

import { cn } from "@/lib/utils"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Send, Bot, User, Copy, Check } from "lucide-react"
import { DocumentSelector } from "./document-selector"
import { supabase } from "@/lib/supabase"
import { getApiBaseUrl } from "@/lib/api"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
}

// Helper function to format assistant messages
const formatAssistantMessage = (content: string) => {
  return { text: content, citations: null }
}

// Component to render formatted message
const FormattedMessage = ({ content }: { content: string }) => {
  const { text } = formatAssistantMessage(content)

  const formattedText = text
    .split('\n')
    .map((line, i) => {
      const parts = line.split(/\*\*(.*?)\*\*/g)
      return (
        <p key={i} className={cn("mb-2 last:mb-0", line.trim() === '' && 'mb-1')}>
          {parts.map((part, j) =>
            j % 2 === 1 ? <strong key={j} className="font-semibold">{part}</strong> : part
          )}
        </p>
      )
    })

  return (
    <div className="space-y-1">{formattedText}</div>
  )
}

interface Document {
  document_id: number
  user_id: string
  name: string
  pdfname: string
  s3_key: string
  created_at: string
}

export function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content: "Hello! I'm your RiskAssure AI assistant. I can help you analyze your uploaded security documents, answer questions about vendor risk assessments, SOC 2 reports, security policies, and more. Select a document and ask me anything about it.",
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [documents, setDocuments] = useState<Document[]>([])
  const [selectedDocument, setSelectedDocument] = useState<number | null>(null)
  const [isLoadingDocuments, setIsLoadingDocuments] = useState(false)
  const [copiedId, setCopiedId] = useState<string | null>(null)

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const hasLoadedDocuments = useRef(false)
  const abortControllerRef = useRef<AbortController | null>(null)

  // Fetch user documents
  const fetchUserDocuments = async () => {
    try {
      setIsLoadingDocuments(true)

      const { data: { session } } = await supabase.auth.getSession()

      if (!session?.access_token) {
        console.error("No access token available")
        return
      }

      const response = await fetch(`${getApiBaseUrl()}/api/documents`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error(`Failed to fetch documents: ${response.status}`)
      }

      const result = await response.json()

      // Handle multiple response formats from the backend
      let docs: Document[] = []
      if (result.status && result.body?.data) {
        docs = result.body.data
      } else if (result.body?.status && result.body?.data) {
        docs = result.body.data
      } else if (result.documents) {
        docs = result.documents
      } else if (Array.isArray(result)) {
        docs = result
      }

      setDocuments(docs)

      // Auto-select first document if available
      if (docs.length > 0 && !selectedDocument) {
        setSelectedDocument(docs[0].document_id)
      }
    } catch (error) {
      console.error("Error fetching documents:", error)
    } finally {
      setIsLoadingDocuments(false)
    }
  }

  // Fetch documents on mount
  useEffect(() => {
    if (!hasLoadedDocuments.current) {
      hasLoadedDocuments.current = true
      fetchUserDocuments()
    }
  }, [])

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Copy message to clipboard
  const copyToClipboard = async (text: string, messageId: string) => {
    try {
      const { text: cleanText } = formatAssistantMessage(text)
      await navigator.clipboard.writeText(cleanText)
      setCopiedId(messageId)
      setTimeout(() => setCopiedId(null), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  // Send message using HTTP POST /api/chat/stream (SSE) for reliable, high-quality responses
  const handleSend = async () => {
    if (!input.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input.trim(),
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    const currentInput = input.trim()
    setInput("")
    setIsLoading(true)

    const streamingMessageId = (Date.now() + 1).toString()
    const emptyAssistantMessage: Message = {
      id: streamingMessageId,
      content: "",
      role: "assistant",
      timestamp: new Date(),
    }
    setMessages((prev) => [...prev, emptyAssistantMessage])

    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session?.access_token) {
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === streamingMessageId
              ? { ...msg, content: "⚠️ Please sign in to use the AI assistant." }
              : msg
          )
        )
        setIsLoading(false)
        return
      }

      // Get company ID from localStorage
      const companyId = localStorage.getItem('wisr_company_id')

      // Build conversation history for context (last 10 messages)
      const conversationHistory = messages
        .filter(m => m.id !== "1") // exclude initial greeting
        .slice(-10)
        .map(m => ({ role: m.role, content: m.content }))

      // Create abort controller for cancellation
      const abortController = new AbortController()
      abortControllerRef.current = abortController

      // Use streaming endpoint for real-time response
      const response = await fetch(`${getApiBaseUrl()}/api/chat/stream`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: currentInput,
          companyId: companyId ? parseInt(companyId) : null,
          documentId: selectedDocument,
          conversationHistory,
        }),
        signal: abortController.signal,
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || `Request failed with status ${response.status}`)
      }

      // Handle SSE streaming response
      const reader = response.body?.getReader()
      if (!reader) {
        throw new Error('No response body')
      }

      const decoder = new TextDecoder()
      let accumulatedContent = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        const chunk = decoder.decode(value, { stream: true })
        const lines = chunk.split('\n')

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6)
            if (data === '[DONE]') {
              break
            }
            try {
              const parsed = JSON.parse(data)
              if (parsed.content) {
                accumulatedContent += parsed.content
                setMessages((prev) =>
                  prev.map((msg) =>
                    msg.id === streamingMessageId
                      ? { ...msg, content: accumulatedContent, timestamp: new Date() }
                      : msg
                  )
                )
              }
              if (parsed.error) {
                throw new Error(parsed.error)
              }
            } catch (parseErr: any) {
              // If it's not valid JSON and not a parse error we threw, treat as raw text
              if (parseErr.message && !parseErr.message.includes('Request failed')) {
                if (data && data !== '[DONE]' && !data.startsWith('{')) {
                  accumulatedContent += data
                  setMessages((prev) =>
                    prev.map((msg) =>
                      msg.id === streamingMessageId
                        ? { ...msg, content: accumulatedContent, timestamp: new Date() }
                        : msg
                    )
                  )
                }
              } else {
                throw parseErr
              }
            }
          }
        }
      }

      // If no content was streamed, try non-streaming fallback
      if (!accumulatedContent) {
        const fallbackResponse = await fetch(`${getApiBaseUrl()}/api/chat`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${session.access_token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            message: currentInput,
            companyId: companyId ? parseInt(companyId) : null,
            documentId: selectedDocument,
            conversationHistory,
          }),
        })
        if (fallbackResponse.ok) {
          const fallbackData = await fallbackResponse.json()
          accumulatedContent = fallbackData.reply || fallbackData.message || 'No response received.'
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === streamingMessageId
                ? { ...msg, content: accumulatedContent, timestamp: new Date() }
                : msg
            )
          )
        } else {
          throw new Error('Failed to get response from AI assistant')
        }
      }

    } catch (error: any) {
      if (error.name === 'AbortError') {
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === streamingMessageId
              ? { ...msg, content: "Response cancelled." }
              : msg
          )
        )
      } else {
        console.error('Chat error:', error)
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === streamingMessageId
              ? { ...msg, content: `⚠️ ${error.message || 'An error occurred. Please try again.'}` }
              : msg
          )
        )
      }
    } finally {
      setIsLoading(false)
      abortControllerRef.current = null
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="h-[calc(100vh-10rem)] flex flex-col">
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">AI Assistant</h1>
            <p className="text-gray-600 mt-2">Ask questions about your security assessments and vendor risks</p>
          </div>
          <DocumentSelector
            documents={documents}
            selectedDocument={selectedDocument}
            onDocumentChange={setSelectedDocument}
            isLoading={isLoadingDocuments}
          />
        </div>
      </div>

      <Card className="flex-1 flex flex-col border-gray-200 shadow-sm">
        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={cn("flex gap-3", message.role === "user" ? "justify-end" : "justify-start")}
            >
              {message.role === "assistant" && (
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <Bot className="w-5 h-5 text-primary" />
                </div>
              )}

              <div className="max-w-[75%] flex flex-col gap-1">
                <div
                  className={cn(
                    "rounded-lg px-4 py-3 shadow-sm",
                    message.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-white border border-gray-200",
                  )}
                >
                  {message.role === "assistant" ? (
                    <div className="text-sm leading-relaxed text-gray-800">
                      <FormattedMessage content={message.content} />
                    </div>
                  ) : (
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
                  )}
                </div>
                <div className="flex items-center justify-between px-2">
                  <p
                    className={cn(
                      "text-xs",
                      message.role === "user" ? "text-gray-500" : "text-gray-400",
                    )}
                  >
                    {message.timestamp.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                  {message.role === "assistant" && !message.content.includes("⚠️") && message.content.length > 0 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 px-2 text-xs"
                      onClick={() => copyToClipboard(message.content, message.id)}
                    >
                      {copiedId === message.id ? (
                        <><Check className="w-3 h-3 mr-1" /> Copied</>
                      ) : (
                        <><Copy className="w-3 h-3 mr-1" /> Copy</>
                      )}
                    </Button>
                  )}
                </div>
              </div>

              {message.role === "user" && (
                <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center shrink-0">
                  <User className="w-5 h-5 text-gray-600" />
                </div>
              )}
            </div>
          ))}
          <div ref={messagesEndRef} />

          {isLoading && (
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <Bot className="w-5 h-5 text-primary" />
              </div>
              <div className="bg-gray-100 rounded-lg px-4 py-3">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                  <div
                    className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                    style={{ animationDelay: "150ms" }}
                  />
                  <div
                    className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                    style={{ animationDelay: "300ms" }}
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="border-t border-gray-200 p-4">
          <div className="flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={selectedDocument ? "Ask about this document..." : "Select a document above, then ask a question..."}
              className="flex-1"
              disabled={isLoading}
            />
            <Button onClick={handleSend} disabled={isLoading || !input.trim()}>
              <Send className="w-4 h-4" />
            </Button>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            {selectedDocument
              ? "Press Enter to send. AI will analyze your selected document to answer."
              : "Select a document from the dropdown above to ask questions about it."}
          </p>
        </div>
      </Card>
    </div>
  )
}
