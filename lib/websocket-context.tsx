"use client"

import React, { createContext, useContext, useEffect, useRef, useState } from 'react'
import { supabase } from '@/lib/supabase'

interface WebSocketContextType {
    socket: WebSocket | null
    connectionId: string | null
    isConnected: boolean
    sendMessage: (message: any) => void
}

const WebSocketContext = createContext<WebSocketContextType>({
    socket: null,
    connectionId: null,
    isConnected: false,
    sendMessage: () => { },
})

export const useWebSocket = () => useContext(WebSocketContext)

const WEBSOCKET_URL = "wss://bnvxpvma1e.execute-api.ca-central-1.amazonaws.com/dev"

// Global flag to track if WebSocket is already being initialized
let isInitializing = false
let globalSocket: WebSocket | null = null
let globalConnectionId: string | null = null

export function WebSocketProvider({ children }: { children: React.ReactNode }) {
    const [connectionId, setConnectionId] = useState<string | null>(null)
    const [isConnected, setIsConnected] = useState(false)
    const socketRef = useRef<WebSocket | null>(null)
    const hasInitialized = useRef(false)

    useEffect(() => {
        const initWebSocket = async () => {
            // Prevent duplicate initialization in React strict mode
            if (hasInitialized.current || isInitializing) {
                console.log("WebSocket already initialized or initializing")
                return
            }

            // If global socket already exists and is connected, reuse it
            if (globalSocket && globalSocket.readyState === WebSocket.OPEN) {
                console.log("Reusing existing WebSocket connection")
                socketRef.current = globalSocket
                setIsConnected(true)
                if (globalConnectionId) {
                    setConnectionId(globalConnectionId)
                }
                return
            }

            hasInitialized.current = true
            isInitializing = true

            // Get current session
            const { data: { session } } = await supabase.auth.getSession()
            if (!session?.access_token) {
                console.log("No session found, cannot establish WebSocket")
                isInitializing = false
                hasInitialized.current = false
                return
            }

            console.log("Initializing WebSocket connection...")

            const ws = new WebSocket(WEBSOCKET_URL)
            socketRef.current = ws
            globalSocket = ws

            ws.onopen = () => {
                console.log("WebSocket connected. Sending register message...")
                isInitializing = false
                ws.send(JSON.stringify({
                    action: "register",
                    token: session.access_token
                }))
            }

            ws.onmessage = (event) => {
                try {
                    const message = JSON.parse(event.data)
                    if (message.action === 'connected' && message.payload?.connectionId) {
                        const connId = message.payload.connectionId
                        console.log('WebSocket registered with Connection ID:', connId)
                        setConnectionId(connId)
                        globalConnectionId = connId
                        setIsConnected(true)
                    }
                } catch (e) {
                    // Not a JSON message or doesn't have connection ID
                }
            }

            ws.onerror = (error) => {
                console.error("WebSocket error:", error)
                setIsConnected(false)
            }

            ws.onclose = () => {
                console.log("WebSocket closed.")
                setConnectionId(null)
                globalConnectionId = null
                setIsConnected(false)
                socketRef.current = null
                globalSocket = null
                isInitializing = false
                hasInitialized.current = false
            }
        }

        initWebSocket()

        return () => {
            // Don't close on cleanup in strict mode - keep connection alive
            // Only close if component is truly unmounting
        }
    }, [])

    const sendMessage = (message: any) => {
        if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
            socketRef.current.send(JSON.stringify(message))
        } else {
            console.error("WebSocket is not connected. Cannot send message.")
        }
    }

    return (
        <WebSocketContext.Provider value={{
            socket: socketRef.current,
            connectionId,
            isConnected,
            sendMessage
        }}>
            {children}
        </WebSocketContext.Provider>
    )
}
