export type PackageOfferStatus = 'OFFERED' | 'ACCEPTED' | 'CANCELLED' | 'EXPIRED'

export interface OfferPackage {
  id: string
  name: string
  description: string | null
  period: string | null
  duration_months: number
  features: string[]
  is_featured?: boolean
}

export interface PackageOffer {
  id: string
  user_id: string
  package_id: string
  price: number
  status: PackageOfferStatus
  notes: string | null
  expires_at: string | null
  offered_at: string | null
  created_at: string | null
  is_expired: boolean
  package?: OfferPackage | null
}
