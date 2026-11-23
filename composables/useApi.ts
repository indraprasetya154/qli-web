import { apiErrorHttpStatus } from '~/utils/apiFormat'

export interface ApiListMeta {
  current_page: number | string
  last_page: number | string
  per_page: number | string
  from: number | string
  to: number | string
  total: number | string
  has_next: boolean
  has_prev: boolean
}

export interface PaginatedResponse<T> {
  meta: ApiListMeta
  data: T[]
}

export const AUTH_TOKEN_COOKIE = 'auth_token'

export function joinApiUrl(base: string, path: string): string {
  const trimmedBase = base.replace(/\/$/, '')
  const normalizedPath = path.startsWith('/') ? path : `/${path}`
  return `${trimmedBase}${normalizedPath}`
}

/**
 * Helper HTTP generik untuk berkomunikasi dengan backend.
 * Base URL diambil dari `NUXT_PUBLIC_API_BASE` (default: `/api`).
 * Token login otomatis dikirim lewat header `Authorization`.
 */
export function useApi() {
  const runtime = useRuntimeConfig()

  async function request<T>(
    path: string,
    options?: Record<string, unknown>
  ): Promise<T> {
    const base = (runtime.public.apiBase as string) || '/api'
    const token = useCookie<string | null>(AUTH_TOKEN_COOKIE)
    const headers: Record<string, string> = {
      ...((options?.headers as Record<string, string> | undefined) ?? {}),
    }
    if (token.value) {
      headers.Authorization = `Bearer ${token.value}`
    }

    try {
      const result = await $fetch<T>(joinApiUrl(base, path), {
        ...options,
        headers,
      })
      return result as T
    } catch (e) {
      if (apiErrorHttpStatus(e) === 401) {
        token.value = null
      }
      throw e
    }
  }

  function apiFetch<T>(path: string, options?: Record<string, unknown>): Promise<T> {
    return request<T>(path, options)
  }

  function apiPost<T>(
    path: string,
    body?: Record<string, unknown> | unknown[]
  ): Promise<T> {
    return request<T>(path, { method: 'POST', body })
  }

  function apiPatch<T>(
    path: string,
    body?: Record<string, unknown> | unknown[]
  ): Promise<T> {
    return request<T>(path, { method: 'PATCH', body })
  }

  function apiDelete<T>(path: string): Promise<T> {
    return request<T>(path, { method: 'DELETE' })
  }

  return { apiFetch, apiPost, apiPatch, apiDelete, joinApiUrl }
}
