// Custom auth client that replaces Supabase with direct backend API calls
// This mimics the Supabase client API surface so existing code doesn't need changes

import { getApiBaseUrl } from './api'

const STORAGE_KEY = 'sb-ytvidsvbaymukrzzfnab-auth-token'

interface User {
  id: string
  email: string
  user_metadata: {
    first_name?: string
    last_name?: string
    company_name?: string
    company_domain?: string | null
  }
  role: string
  created_at: string
}

interface Session {
  access_token: string
  token_type: string
  expires_in: number
  user: User
}

interface AuthResponse {
  data: { user: User | null; session: Session | null }
  error: { message: string } | null
}

class AuthClient {
  private session: Session | null = null

  constructor() {
    // Load session from localStorage on init
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem(STORAGE_KEY)
        if (stored) {
          this.session = JSON.parse(stored)
        }
      } catch (e) {
        console.error('Failed to load session from storage:', e)
      }
    }
  }

  async signInWithPassword({ email, password }: { email: string; password: string }): Promise<AuthResponse> {
    try {
      const response = await fetch(`${getApiBaseUrl()}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (!response.ok || data.error) {
        return {
          data: { user: null, session: null },
          error: { message: data.error || 'Invalid email or password' },
        }
      }

      const session: Session = {
        access_token: data.access_token,
        token_type: data.token_type,
        expires_in: data.expires_in,
        user: data.user,
      }

      this.session = session
      if (typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(session))
      }

      return {
        data: { user: data.user, session },
        error: null,
      }
    } catch (err) {
      return {
        data: { user: null, session: null },
        error: { message: 'Network error. Please try again.' },
      }
    }
  }

  async signUp({ email, password, options }: { 
    email: string; 
    password: string; 
    options?: { data?: Record<string, any> } 
  }): Promise<AuthResponse> {
    try {
      const body: any = { email, password }
      if (options?.data) {
        body.firstName = options.data.first_name || options.data.firstName || ''
        body.lastName = options.data.last_name || options.data.lastName || ''
        body.companyName = options.data.company_name || options.data.companyName || ''
        body.companyDomain = options.data.company_domain || options.data.companyDomain || options.data.website_url || ''
      }

      const response = await fetch(`${getApiBaseUrl()}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })

      const data = await response.json()

      if (!response.ok || data.error) {
        return {
          data: { user: null, session: null },
          error: { message: data.error || 'Signup failed' },
        }
      }

      // Auto-login after signup
      if (data.access_token) {
        const session: Session = {
          access_token: data.access_token,
          token_type: data.token_type || 'bearer',
          expires_in: data.expires_in || 604800,
          user: data.user,
        }

        this.session = session
        if (typeof window !== 'undefined') {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(session))
        }

        return { data: { user: data.user, session }, error: null }
      }

      return { data: { user: data.user, session: null }, error: null }
    } catch (err) {
      return {
        data: { user: null, session: null },
        error: { message: 'Network error. Please try again.' },
      }
    }
  }

  async getSession(): Promise<{ data: { session: Session | null }; error: null }> {
    if (typeof window !== 'undefined' && !this.session) {
      try {
        const stored = localStorage.getItem(STORAGE_KEY)
        if (stored) {
          this.session = JSON.parse(stored)
        }
      } catch (e) {
        // ignore
      }
    }

    // Validate token is not expired
    if (this.session?.access_token) {
      try {
        const payload = JSON.parse(atob(this.session.access_token.split('.')[1]))
        if (payload.exp && payload.exp * 1000 < Date.now()) {
          // Token expired, clear session
          this.session = null
          if (typeof window !== 'undefined') {
            localStorage.removeItem(STORAGE_KEY)
          }
        }
      } catch (e) {
        // If we can't decode the token, keep the session
      }
    }

    return { data: { session: this.session }, error: null }
  }

  async getUser(): Promise<{ data: { user: User | null }; error: null }> {
    const { data: { session } } = await this.getSession()
    return { data: { user: session?.user || null }, error: null }
  }

  async signOut(): Promise<{ error: null }> {
    this.session = null
    if (typeof window !== 'undefined') {
      localStorage.removeItem(STORAGE_KEY)
    }
    return { error: null }
  }

  onAuthStateChange(callback: (event: string, session: Session | null) => void) {
    // Call immediately with current state
    if (this.session) {
      callback('SIGNED_IN', this.session)
    }

    // Listen for storage changes (for multi-tab support)
    if (typeof window !== 'undefined') {
      const handler = (e: StorageEvent) => {
        if (e.key === STORAGE_KEY) {
          if (e.newValue) {
            this.session = JSON.parse(e.newValue)
            callback('SIGNED_IN', this.session)
          } else {
            this.session = null
            callback('SIGNED_OUT', null)
          }
        }
      }
      window.addEventListener('storage', handler)
      return { data: { subscription: { unsubscribe: () => window.removeEventListener('storage', handler) } } }
    }

    return { data: { subscription: { unsubscribe: () => {} } } }
  }
}

class SupabaseClient {
  auth: AuthClient

  constructor() {
    this.auth = new AuthClient()
  }
}

export const supabase = new SupabaseClient()
