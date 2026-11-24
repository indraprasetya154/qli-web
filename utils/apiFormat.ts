/** Normalisasi angka pagination dari API (kadang dikirim sebagai string). */
export function apiNumeric(value: number | string): number {
  const n = typeof value === 'string' ? Number(value) : value
  return Number.isFinite(n) ? n : 0
}

function getErrorPayload(err: unknown): Record<string, unknown> | null {
  if (!err || typeof err !== 'object') return null
  const e = err as {
    data?: unknown
    response?: { _data?: unknown }
  }
  if (e.data && typeof e.data === 'object') {
    return e.data as Record<string, unknown>
  }
  const raw = e.response?._data
  if (raw && typeof raw === 'object') {
    return raw as Record<string, unknown>
  }
  return null
}

function stringifyValidationErrors(errors: unknown): string | null {
  if (!errors || typeof errors !== 'object') return null
  const parts: string[] = []
  for (const [field, val] of Object.entries(errors as Record<string, unknown>)) {
    if (Array.isArray(val)) {
      for (const item of val) {
        if (typeof item === 'string' && item.trim()) {
          parts.push(`${field}: ${item.trim()}`)
        }
      }
    } else if (typeof val === 'string' && val.trim()) {
      parts.push(`${field}: ${val.trim()}`)
    }
  }
  return parts.length > 0 ? parts.join(' · ') : null
}

/** Status HTTP dari error `ofetch` / `$fetch` (403, 404, …). */
export function apiErrorHttpStatus(err: unknown): number | null {
  if (!err || typeof err !== 'object') return null
  const e = err as {
    statusCode?: number
    status?: number
    response?: { status?: number }
  }
  const n = e.statusCode ?? e.status ?? e.response?.status
  return typeof n === 'number' && Number.isFinite(n) ? n : null
}

/** HTTP 409 atau `code: 409` di body respons (konflik / duplikat). */
export function apiIsConflictError(err: unknown): boolean {
  if (apiErrorHttpStatus(err) === 409) return true
  const data = getErrorPayload(err)
  if (!data) return false
  const c = data.code
  return c === 409 || c === '409'
}

/** HTTP 403 atau `code: 403` di body respons (akses ditolak). */
export function apiIsForbiddenError(err: unknown): boolean {
  if (apiErrorHttpStatus(err) === 403) return true
  const data = getErrorPayload(err)
  if (!data) return false
  const c = data.code
  return c === 403 || c === '403'
}

export function apiFetchErrorMessage(err: unknown): string {
  if (!err) return ''

  const e = err as {
    statusCode?: number
    status?: number
    message?: string
    statusMessage?: string
    data?: Record<string, unknown>
    response?: { status?: number; _data?: unknown }
  }

  const status = apiErrorHttpStatus(err)
  if (status === 403) {
    return 'Anda tidak memiliki akses.'
  }

  let candidate = ''

  const data = getErrorPayload(err)
  if (data) {
    const fromErrors = stringifyValidationErrors(data.errors)
    if (fromErrors) {
      candidate = fromErrors
    } else if (typeof data.message === 'string' && data.message.trim()) {
      candidate = data.message.trim()
    } else if (typeof data.error === 'string' && data.error.trim()) {
      candidate = data.error.trim()
    } else if (typeof data.detail === 'string' && data.detail.trim()) {
      candidate = data.detail.trim()
    }
  }

  if (!candidate && typeof e.statusMessage === 'string' && e.statusMessage.trim()) {
    candidate = e.statusMessage.trim()
  }
  if (!candidate && typeof e.message === 'string' && e.message.trim()) {
    candidate = e.message.trim()
  }
  if (!candidate) {
    candidate = 'Gagal memuat data.'
  }

  return candidate
}
