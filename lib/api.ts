/**
 * Returns the API base URL for making backend requests.
 * 
 * Uses CloudFront distribution (d2utdsd5p4hfb9.cloudfront.net) as HTTPS proxy
 * in front of the ALB. This ensures no mixed-content issues when the frontend
 * is served over HTTPS (Amplify).
 */
export function getApiBaseUrl(): string {
  return process.env.NEXT_PUBLIC_BACKEND_URL || 'https://d2utdsd5p4hfb9.cloudfront.net'
}
