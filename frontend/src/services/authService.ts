import { apiClient } from '../lib/apiClient'

export interface AuthUser {
  id: string
  name: string
  email: string
  role: 'admin' | 'member' | 'viewer'
  status?: 'active' | 'disabled'
  avatar_url?: string | null
  created_at?: string
  updated_at?: string
  last_login_at?: string | null
}

export interface AuthResponse {
  token: string
  user: AuthUser
}

export interface LoginPayload {
  email: string
  password: string
}

export function login(payload: LoginPayload) {
  return apiClient.post<AuthResponse>('/auth/login', payload)
}

export function getCurrentUser() {
  return apiClient.get<AuthUser>('/auth/me')
}
