/**
 * Returns the API base URL for making backend requests.
 * 
 * All requests go directly to the backend ALB with CORS enabled.
 * This avoids the need for Next.js API proxy routes which don't work
 * in static/SSG deployments on Amplify.
 */
export function getApiBaseUrl(): string {
  return process.env.NEXT_PUBLIC_BACKEND_URL || 'http://wisr-alb-1548153603.ca-central-1.elb.amazonaws.com'
}
