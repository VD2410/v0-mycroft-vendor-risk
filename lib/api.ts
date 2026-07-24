/**
 * Returns the API base URL for making backend requests.
 * 
 * On the client side, returns empty string so requests go through
 * the Next.js API proxy routes (which forward to the backend ALB).
 * 
 * On the server side (SSR), returns the direct backend URL.
 */
export function getApiBaseUrl(): string {
  // Client-side: use relative URLs (proxied through Next.js API routes)
  if (typeof window !== 'undefined') {
    return ''
  }
  // Server-side: use direct backend URL
  return process.env.BACKEND_URL || 'http://wisr-alb-1548153603.ca-central-1.elb.amazonaws.com'
}
