export type ClientStatus =
  | 'new'
  | 'active'
  | 'in_progress'
  | 'placed'
  | 'inactive'
  | 'rejected'

export type ClientAccountSummary = {
  email: string
  is_active: boolean
  last_login_at?: string | null
}

export type ClientUserAccount = {
  id: string
  name: string
  email: string
  user_type: string
  is_active: boolean
  last_login_at?: string | null
  created_at?: string | null
}

export type ClientListRow = {
  id: string
  client_code: string
  full_name: string
  personal_email: string
  phone_number: string
  education?: string | null
  application_email?: string | null
  status: ClientStatus
  created_at?: string | null
  updated_at?: string | null
  account: ClientAccountSummary | null
}

export type ClientDetail = {
  id: string
  user_id?: string | null
  client_code: string
  full_name: string
  phone_number: string
  personal_email: string
  application_email?: string | null
  recovery_email?: string | null
  recovery_phone?: string | null
  date_of_birth?: string | null
  gender?: string | null
  address?: string | null
  education?: string | null
  experience?: string | null
  skills?: string | null
  status: ClientStatus
  notes?: string | null
  created_at?: string | null
  updated_at?: string | null
  user?: ClientUserAccount | null
}

export type ClientStats = {
  total: number
  active: number
  with_account: number
}

export type ClientFormPayload = {
  full_name: string
  phone_number: string
  personal_email: string
  application_email: string
  recovery_email: string
  recovery_phone: string
  date_of_birth: string
  gender: string
  address: string
  education: string
  experience: string
  skills: string
  status: ClientStatus
  notes: string
  create_account?: boolean
  account_email?: string
  account_password?: string
}
