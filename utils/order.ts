import type { OrderStatus, PaymentStatus } from '~/types/order'

export const ORDER_STATUS_LABEL: Record<OrderStatus, string> = {
  PENDING_PAYMENT: 'Menunggu Pembayaran',
  WAITING_VERIFICATION: 'Menunggu Verifikasi',
  PAID: 'Lunas',
  CANCELLED: 'Dibatalkan',
  EXPIRED: 'Kedaluwarsa',
}

export const PAYMENT_STATUS_LABEL: Record<PaymentStatus, string> = {
  PENDING: 'Belum Dibayar',
  WAITING_VERIFICATION: 'Menunggu Verifikasi',
  PAID: 'Terverifikasi',
  REJECTED: 'Ditolak',
}

export function orderStatusColor(
  status: OrderStatus
): 'warning' | 'info' | 'success' | 'neutral' | 'error' {
  switch (status) {
    case 'PENDING_PAYMENT':
      return 'warning'
    case 'WAITING_VERIFICATION':
      return 'info'
    case 'PAID':
      return 'success'
    case 'CANCELLED':
      return 'error'
    default:
      return 'neutral'
  }
}

export function paymentStatusColor(
  status: PaymentStatus
): 'warning' | 'info' | 'success' | 'error' | 'neutral' {
  switch (status) {
    case 'PENDING':
      return 'warning'
    case 'WAITING_VERIFICATION':
      return 'info'
    case 'PAID':
      return 'success'
    case 'REJECTED':
      return 'error'
    default:
      return 'neutral'
  }
}

export function formatRupiah(value: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(Number(value ?? 0))
}

export function orderAccessKey(orderNumber: string): string {
  return `qli-order-email:${orderNumber}`
}

export function rememberOrderEmail(orderNumber: string, email: string) {
  if (typeof window === 'undefined') return
  window.sessionStorage.setItem(orderAccessKey(orderNumber), email)
}

export function recallOrderEmail(orderNumber: string): string {
  if (typeof window === 'undefined') return ''
  return window.sessionStorage.getItem(orderAccessKey(orderNumber)) ?? ''
}
