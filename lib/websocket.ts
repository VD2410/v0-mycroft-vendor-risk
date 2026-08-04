import { supabase } from './supabase'

const WS_URL = 'wss://bnvxpvma1e.execute-api.ca-central-1.amazonaws.com/dev'

export interface WebSocketMessage {
    action: string
    payload?: {
        connectionId?: string
        [key: string]: any
    }
}

export const connectWebSocket = (): Promise<string> => {
    return new Promise((resolve, reject) => {
        const ws = new WebSocket(WS_URL)

        ws.onopen = async () => {
            try {
                // Get JWT token from Supabase
                const { data: { session } } = await supabase.auth.getSession()

                if (!session?.access_token) {
                    ws.close()
                    reject(new Error('No access token available'))
                    return
                }

                // Send register message
                ws.send(JSON.stringify({
                    action: 'register',
                    token: session.access_token
                }))
            } catch (error) {
                ws.close()
                reject(error)
            }
        }

        ws.onmessage = (event) => {
            try {
                const message: WebSocketMessage = JSON.parse(event.data)

                if (message.action === 'connected' && message.payload?.connectionId) {
                    const connectionId = message.payload.connectionId
                    console.log(`WebSocket Connection ID: ${connectionId}`)
                    resolve(connectionId)
                    // Keep the connection open for future messages
                }
            } catch (error) {
                console.error('Error parsing WebSocket message:', error)
            }
        }

        ws.onerror = (error) => {
            console.error('WebSocket error:', error)
            reject(error)
        }

        ws.onclose = () => {
            console.log('WebSocket connection closed')
        }

        // Timeout after 10 seconds
        setTimeout(() => {
            if (ws.readyState !== WebSocket.OPEN) {
                ws.close()
                reject(new Error('WebSocket connection timeout'))
            }
        }, 10000)
    })
}
