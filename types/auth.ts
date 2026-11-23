export type UserType = 'admin' | 'client'

export interface AuthUser {
  id: string
  name: string
  username: string | null
  email: string
  phone_number: string | null
  user_type: UserType
  email_verified_at?: string | null
  is_active: boolean
  last_login_at?: string | null
  created_at?: string | null
  updated_at?: string | null
}

export interface AuthResult {
  user: AuthUser
  access_token: string
  token_type: string
}

export interface LoginPayload {
  identifier: string
  password: string
}

export interface RegisterPayload {
  full_name: string
  username: string
  email: string
  phone_number: string
  password: string
}
