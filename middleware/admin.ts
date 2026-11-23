export default defineNuxtRouteMiddleware(async () => {
  const { isLoggedIn, restoreSession, isAdmin } = useAuth()

  if (!isLoggedIn.value) {
    return navigateTo('/login')
  }

  const valid = await restoreSession()
  if (!valid) {
    return navigateTo('/login')
  }

  if (!isAdmin.value) {
    return navigateTo('/client')
  }
})
