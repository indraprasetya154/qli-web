import { describe, expect, it } from 'vitest'
import {
  clientStatusColor,
  clientStatusLabel,
  maskEmail,
} from '../../utils/client'

describe('client status helpers', () => {
  it('returns labels for known statuses', () => {
    expect(clientStatusLabel('in_progress')).toBe('In Progress')
    expect(clientStatusLabel('placed')).toBe('Placed')
  })

  it('returns badge colors for known statuses', () => {
    expect(clientStatusColor('active')).toBe('success')
    expect(clientStatusColor('rejected')).toBe('error')
  })
})

describe('maskEmail', () => {
  it('masks the local part of an email', () => {
    expect(maskEmail('budi@example.com')).toBe('b***@example.com')
  })

  it('returns a dash for empty values', () => {
    expect(maskEmail(null)).toBe('-')
  })
})
