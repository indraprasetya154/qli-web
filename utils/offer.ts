import type { PackageOfferStatus } from '~/types/offer'

export const OFFER_STATUS_LABEL: Record<PackageOfferStatus, string> = {
  OFFERED: 'Ditawarkan',
  ACCEPTED: 'Sudah Dipesan',
  CANCELLED: 'Dibatalkan',
  EXPIRED: 'Kedaluwarsa',
}

export function offerStatusColor(
  status: PackageOfferStatus
): 'info' | 'success' | 'error' | 'neutral' {
  switch (status) {
    case 'OFFERED':
      return 'info'
    case 'ACCEPTED':
      return 'success'
    case 'CANCELLED':
      return 'error'
    default:
      return 'neutral'
  }
}

/** Hanya penawaran aktif dan belum kedaluwarsa yang bisa dipesan. */
export function isOfferOrderable(offer: {
  status: PackageOfferStatus
  is_expired: boolean
  expires_at?: string | null
}): boolean {
  if (offer.status !== 'OFFERED' || offer.is_expired) return false
  if (!offer.expires_at) return true
  const expiresAt = new Date(offer.expires_at).getTime()
  return !Number.isFinite(expiresAt) || expiresAt >= Date.now()
}
