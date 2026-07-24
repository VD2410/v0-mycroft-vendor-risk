// Use local API route to avoid CORS issues
const PRESIGNED_URL_API = '/api/presigned-url'

export interface PresignedUrlRequest {
    key: string
    operation: 'upload' | 'download'
    contentType: string
    expiresIn: number
    metadata: {
        'connection-id': string
        [key: string]: any
    }
}

export interface PresignedUrlResponse {
    url: string
    key: string
    // Add other response fields as needed
}

export const fetchPresignedUrl = async (
    uid: string,
    filename: string,
    connectionId: string,
    contentType: string = 'application/pdf',
    accessToken?: string
): Promise<PresignedUrlResponse> => {
    const timestamp = Date.now()
    const key = `documents/${uid}/${timestamp}_${filename}`

    const requestBody: PresignedUrlRequest = {
        key,
        operation: 'upload',
        contentType,
        expiresIn: 3600,
        metadata: {
            'connection-id': connectionId
        }
    }

    const headers: HeadersInit = {
        'Content-Type': 'application/json',
    }

    if (accessToken) {
        headers['Authorization'] = `Bearer ${accessToken}`
    }

    const response = await fetch(PRESIGNED_URL_API, {
        method: 'POST',
        headers,
        body: JSON.stringify(requestBody),
    })

    if (!response.ok) {
        const errorText = await response.text()
        console.error('Presigned URL API error response:', errorText)
        throw new Error(`Failed to fetch presigned URL: ${errorText}`)
    }

    const data = await response.json()
    console.log('Presigned URL API response:', data)

    return data
}
