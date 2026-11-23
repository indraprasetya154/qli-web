import { describe, expect, it } from 'vitest'
import { isOfferOrderable } from '../../utils/offer'

describe('isOfferOrderable', () => {
  it('allows an OFFERED offer that has not expired', () => {
    expect(isOfferOrderable({ status: 'OFFERED', is_expired: false })).toBe(true)
  })

  it('rejects an OFFERED offer that has expired', () => {
    expect(isOfferOrderable({ status: 'OFFERED', is_expired: true })).toBe(false)
    expect(
      isOfferOrderable({
        status: 'OFFERED',
        is_expired: false,
        expires_at: '2020-01-01T00:00:00.000Z',
      })
    ).toBe(false)
  })

  it('rejects offers that are not OFFERED', () => {
    for (const status of ['ACCEPTED', 'CANCELLED', 'EXPIRED'] as const) {
      expect(isOfferOrderable({ status, is_expired: false })).toBe(false)
    }
  })

  it('treats a missing expiry as not expired', () => {
    expect(isOfferOrderable({ status: 'OFFERED', is_expired: false, expires_at: null })).toBe(true)
  })
})
