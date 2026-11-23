import { describe, expect, it } from 'vitest'
import {
  ORDER_STATUS_LABEL,
  PAYMENT_STATUS_LABEL,
  formatRupiah,
  orderAccessKey,
} from '../../utils/order'

describe('order status labels', () => {
  it('maps every order status to Indonesian copy', () => {
    expect(ORDER_STATUS_LABEL.PENDING_PAYMENT).toBe('Menunggu Pembayaran')
    expect(ORDER_STATUS_LABEL.WAITING_VERIFICATION).toBe('Menunggu Verifikasi')
    expect(ORDER_STATUS_LABEL.PAID).toBe('Lunas')
    expect(ORDER_STATUS_LABEL.CANCELLED).toBe('Dibatalkan')
    expect(ORDER_STATUS_LABEL.EXPIRED).toBe('Kedaluwarsa')
  })

  it('maps every payment status to Indonesian copy', () => {
    expect(PAYMENT_STATUS_LABEL.PENDING).toBe('Belum Dibayar')
    expect(PAYMENT_STATUS_LABEL.WAITING_VERIFICATION).toBe('Menunggu Verifikasi')
    expect(PAYMENT_STATUS_LABEL.PAID).toBe('Terverifikasi')
    expect(PAYMENT_STATUS_LABEL.REJECTED).toBe('Ditolak')
  })
})

describe('order helpers', () => {
  it('formats rupiah without decimals', () => {
    expect(formatRupiah(750000)).toContain('750.000')
  })

  it('builds a unique session key per order number', () => {
    expect(orderAccessKey('ORD-1')).not.toBe(orderAccessKey('ORD-2'))
    expect(orderAccessKey('ORD-1')).toContain('ORD-1')
  })
})
