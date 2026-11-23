const ADMIN_PATHS = ['/dashboard', '/clients', '/reference']
const PUBLIC_BYPASS = ['/atur-password', '/login', '/register']

export default defineNuxtRouteMiddleware(async (to) => {
  const { isLoggedIn, isAdmin, restoreSession } = useAuth()

  if (!isLoggedIn.value) return
  if (PUBLIC_BYPASS.includes(to.path)) return

  const inCms = ADMIN_PATHS.some(
    (path) => to.path === path || to.path.startsWith(`${path}/`)
  )
  if (inCms) return

  const valid = await restoreSession()
  if (!valid || !isAdmin.value) return

  return navigateTo('/dashboard')
})
