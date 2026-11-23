import { describe, expect, it } from 'vitest'
import {
  formatDateDmy,
  formatDateTimeDmyHm,
  formatDateTimeDmyHms,
} from '../../utils/dateFormat'

describe('dateFormat utilities', () => {
  it('formats yyyy-mm-dd date into dd-mm-yyyy', () => {
    expect(formatDateDmy('2026-04-29')).toBe('29-04-2026')
  })

  it('returns fallback for masked dates', () => {
    expect(formatDateDmy('****-**-**')).toBe('-')
  })

  it('formats datetime with hour and minute', () => {
    expect(formatDateTimeDmyHm('2026-04-29T07:45:00Z')).toContain('29:04:2026')
  })

  it('formats datetime as dd-mm-yyyy hh:mm:ss (local)', () => {
    const s = formatDateTimeDmyHms('2026-05-09T14:30:05')
    expect(s).toMatch(/^\d{2}-\d{2}-\d{4} \d{2}:\d{2}:\d{2}$/)
    expect(s.startsWith('09-05-2026')).toBe(true)
    expect(s).toContain('14:30:05')
  })
})
