import type {
  AuthResult,
  AuthUser,
  LoginPayload,
  RegisterPayload,
} from '~/types/auth'
import { apiErrorHttpStatus } from '~/utils/apiFormat'
import { AUTH_TOKEN_COOKIE, useApi } from './useApi'

const TOKEN_MAX_AGE = 60 * 60 * 24 * 7

export function useAuth() {
  const { apiFetch, apiPost } = useApi()
  const token = useCookie<string | null>(AUTH_TOKEN_COOKIE, {
    default: () => null,
    maxAge: TOKEN_MAX_AGE,
    sameSite: 'lax',
    path: '/',
  })
  const user = useState<AuthUser | null>('auth-user', () => null)

  const isLoggedIn = computed(() => Boolean(token.value))
  const isAdmin = computed(() => user.value?.user_type === 'admin')
  const isClient = computed(() => user.value?.user_type === 'client')
  const displayName = computed(
    () => user.value?.name || user.value?.username || user.value?.email || 'Pengguna'
  )
  const initials = computed(() => displayName.value.slice(0, 2).toUpperCase())
  const homePath = computed(() => (isAdmin.value ? '/dashboard' : '/client'))

  function applySession(result: AuthResult) {
    token.value = result.access_token
    user.value = result.user
  }

  function clearSession() {
    token.value = null
    user.value = null
  }

  async function login(payload: LoginPayload): Promise<AuthResult> {
    const response = await apiPost<{ data: AuthResult }>('/v1/auth/login', {
      ...payload,
    })
    applySession(response.data)
    return response.data
  }

  async function register(payload: RegisterPayload): Promise<AuthResult> {
    const response = await apiPost<{ data: AuthResult }>('/v1/auth/register', {
      ...payload,
    })
    applySession(response.data)
    return response.data
  }

  async function restoreSession(): Promise<boolean> {
    if (!token.value) return false
    if (user.value) return true

    try {
      const response = await apiFetch<{ data: AuthUser }>('/v1/auth/me')
      user.value = response.data
      return true
    } catch (e) {
      if (apiErrorHttpStatus(e) === 401) {
        clearSession()
      }
      return false
    }
  }

  async function logout() {
    clearSession()
    await navigateTo('/login')
  }

  return {
    token,
    user,
    isLoggedIn,
    isAdmin,
    isClient,
    displayName,
    initials,
    homePath,
    login,
    register,
    restoreSession,
    logout,
    clearSession,
  }
}
