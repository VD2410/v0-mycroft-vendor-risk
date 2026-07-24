import { NextRequest, NextResponse } from 'next/server'

// Backend URL - the production backend ALB
const BACKEND_URL = process.env.BACKEND_URL || 'http://wisr-alb-1548153603.ca-central-1.elb.amazonaws.com'

export async function GET(request: NextRequest) {
  return proxyRequest(request, 'GET')
}

export async function POST(request: NextRequest) {
  return proxyRequest(request, 'POST')
}

export async function PUT(request: NextRequest) {
  return proxyRequest(request, 'PUT')
}

export async function DELETE(request: NextRequest) {
  return proxyRequest(request, 'DELETE')
}

export async function PATCH(request: NextRequest) {
  return proxyRequest(request, 'PATCH')
}

async function proxyRequest(request: NextRequest, method: string) {
  try {
    const url = new URL(request.url)
    const path = url.pathname
    const search = url.search

    const backendUrl = `${BACKEND_URL}${path}${search}`

    const headers: Record<string, string> = {}
    request.headers.forEach((value, key) => {
      if (key.toLowerCase() !== 'host' && key.toLowerCase() !== 'connection') {
        headers[key] = value
      }
    })

    const fetchOptions: RequestInit = {
      method,
      headers,
    }

    if (method !== 'GET' && method !== 'HEAD') {
      const contentType = request.headers.get('content-type') || ''
      if (contentType.includes('multipart/form-data')) {
        fetchOptions.body = await request.arrayBuffer()
      } else {
        try {
          const body = await request.text()
          if (body) {
            fetchOptions.body = body
          }
        } catch {
          // No body
        }
      }
    }

    const response = await fetch(backendUrl, fetchOptions)

    const responseHeaders = new Headers()
    response.headers.forEach((value, key) => {
      if (key.toLowerCase() !== 'transfer-encoding') {
        responseHeaders.set(key, value)
      }
    })

    const responseBody = await response.arrayBuffer()

    return new NextResponse(responseBody, {
      status: response.status,
      statusText: response.statusText,
      headers: responseHeaders,
    })
  } catch (error) {
    console.error('Proxy error:', error)
    return NextResponse.json(
      { error: 'Backend service unavailable' },
      { status: 502 }
    )
  }
}
