import type { ClientStatus } from '~/types/client'

type BadgeColor = 'primary' | 'secondary' | 'success' | 'info' | 'warning' | 'error' | 'neutral'

export const CLIENT_STATUS_OPTIONS: Array<{
  label: string
  value: ClientStatus
}> = [
  { label: 'New', value: 'new' },
  { label: 'Active', value: 'active' },
  { label: 'In Progress', value: 'in_progress' },
  { label: 'Placed', value: 'placed' },
  { label: 'Inactive', value: 'inactive' },
  { label: 'Rejected', value: 'rejected' },
]

export const GENDER_OPTIONS = [
  { label: 'Male', value: 'male' },
  { label: 'Female', value: 'female' },
  { label: 'Other', value: 'other' },
]

export const ACCOUNT_STATUS_OPTIONS = [
  { label: 'All accounts', value: 'all' },
  { label: 'Has account', value: 'has' },
  { label: 'No account', value: 'none' },
  { label: 'Active account', value: 'active' },
  { label: 'Inactive account', value: 'inactive' },
]

export function clientStatusLabel(status: string): string {
  return (
    CLIENT_STATUS_OPTIONS.find((item) => item.value === status)?.label ?? status
  )
}

export function clientStatusColor(status: string): BadgeColor {
  const colors: Record<string, BadgeColor> = {
    new: 'info',
    active: 'success',
    in_progress: 'warning',
    placed: 'primary',
    inactive: 'neutral',
    rejected: 'error',
  }
  return colors[status] ?? 'neutral'
}

export function genderLabel(gender?: string | null): string {
  if (!gender) return '-'
  return GENDER_OPTIONS.find((item) => item.value === gender)?.label ?? gender
}

export function accountStatusLabel(isActive: boolean): string {
  return isActive ? 'Active' : 'Inactive'
}

export function accountStatusColor(isActive: boolean): BadgeColor {
  return isActive ? 'success' : 'warning'
}

export function maskEmail(value?: string | null): string {
  if (!value) return '-'
  const [local, domain] = value.split('@')
  if (!local || !domain) return value
  const visible = local.slice(0, 1)
  return `${visible}${'*'.repeat(Math.max(local.length - 1, 2))}@${domain}`
}
