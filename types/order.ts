export type OrderStatus =
  | 'PENDING_PAYMENT'
  | 'WAITING_VERIFICATION'
  | 'PAID'
  | 'CANCELLED'
  | 'EXPIRED'

export type PaymentStatus = 'PENDING' | 'WAITING_VERIFICATION' | 'PAID' | 'REJECTED'

export interface PublicPaymentAccount {
  id: string
  bank_name: string
  account_number: string
  account_holder: string
}

export interface PublicOrder {
  id: string
  order_number: string
  package_name: string
  package_price: number
  voucher: number
  voucher_code: string | null
  grand_total: number
  status: OrderStatus
  payment_status: PaymentStatus
  expires_at: string | null
  payment_at: string | null
  created_at: string | null
  customer: {
    name: string
    email: string
    phone: string
  }
  package: {
    id: string
    name: string
    description: string | null
    period: string | null
    features: string[]
  } | null
  payment_account: {
    bank_name: string | null
    account_number: string | null
    account_holder: string | null
  } | null
  payment: {
    id: string
    status: PaymentStatus
    amount: number
    proof_of_payment: string | null
    rejection_reason: string | null
    submitted_at: string | null
    verified_at: string | null
  } | null
}

export interface PublicPackage {
  id: string
  name: string
  description: string | null
  period: string | null
  features: string[]
  is_featured: boolean
}
