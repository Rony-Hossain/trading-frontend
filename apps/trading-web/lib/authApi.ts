'use client'

export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  avatar?: string
  createdAt: Date
  isVerified: boolean
  role: 'user' | 'admin'
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface SignUpCredentials {
  email: string
  password: string
  firstName: string
  lastName: string
}

export interface AuthResponse {
  user: User
  token: string
  refreshToken: string
}

class AuthAPI {
  private baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      // Mock authentication for now - in production, this would call your auth service
      await new Promise(resolve => setTimeout(resolve, 1000)) // Simulate API delay
      
      if (credentials.email === 'demo@example.com' && credentials.password === 'password') {
        const mockUser: User = {
          id: '1',
          email: credentials.email,
          firstName: 'Demo',
          lastName: 'User',
          avatar: 'https://ui-avatars.com/api/?name=Demo+User&background=3B82F6&color=fff',
          createdAt: new Date(),
          isVerified: true,
          role: 'user'
        }
        
        const mockResponse: AuthResponse = {
          user: mockUser,
          token: 'mock-jwt-token-' + Date.now(),
          refreshToken: 'mock-refresh-token-' + Date.now()
        }
        
        // Store in localStorage
        localStorage.setItem('auth_token', mockResponse.token)
        localStorage.setItem('refresh_token', mockResponse.refreshToken)
        localStorage.setItem('user', JSON.stringify(mockResponse.user))
        
        return mockResponse
      }
      
      throw new Error('Invalid email or password')
    } catch (error) {
      console.error('Login error:', error)
      throw error
    }
  }

  async signUp(credentials: SignUpCredentials): Promise<AuthResponse> {
    try {
      // Mock sign up - in production, this would call your auth service
      await new Promise(resolve => setTimeout(resolve, 1200)) // Simulate API delay
      
      const mockUser: User = {
        id: Date.now().toString(),
        email: credentials.email,
        firstName: credentials.firstName,
        lastName: credentials.lastName,
        avatar: `https://ui-avatars.com/api/?name=${credentials.firstName}+${credentials.lastName}&background=3B82F6&color=fff`,
        createdAt: new Date(),
        isVerified: false,
        role: 'user'
      }
      
      const mockResponse: AuthResponse = {
        user: mockUser,
        token: 'mock-jwt-token-' + Date.now(),
        refreshToken: 'mock-refresh-token-' + Date.now()
      }
      
      // Store in localStorage
      localStorage.setItem('auth_token', mockResponse.token)
      localStorage.setItem('refresh_token', mockResponse.refreshToken)
      localStorage.setItem('user', JSON.stringify(mockResponse.user))
      
      return mockResponse
    } catch (error) {
      console.error('Sign up error:', error)
      throw error
    }
  }

  async logout(): Promise<void> {
    try {
      // Clear local storage
      localStorage.removeItem('auth_token')
      localStorage.removeItem('refresh_token')
      localStorage.removeItem('user')
    } catch (error) {
      console.error('Logout error:', error)
      throw error
    }
  }

  async getCurrentUser(): Promise<User | null> {
    try {
      const token = localStorage.getItem('auth_token')
      const userStr = localStorage.getItem('user')
      
      if (!token || !userStr) {
        return null
      }
      
      return JSON.parse(userStr) as User
    } catch (error) {
      console.error('Get current user error:', error)
      return null
    }
  }

  async refreshToken(): Promise<string | null> {
    try {
      const refreshToken = localStorage.getItem('refresh_token')
      
      if (!refreshToken) {
        return null
      }
      
      // Mock token refresh - in production, this would call your auth service
      const newToken = 'mock-jwt-token-refreshed-' + Date.now()
      localStorage.setItem('auth_token', newToken)
      
      return newToken
    } catch (error) {
      console.error('Refresh token error:', error)
      return null
    }
  }

  getToken(): string | null {
    return localStorage.getItem('auth_token')
  }

  isAuthenticated(): boolean {
    const token = this.getToken()
    return !!token
  }
}

export const authAPI = new AuthAPI()