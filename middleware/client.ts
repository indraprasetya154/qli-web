export default defineNuxtRouteMiddleware(async () => {
  const { isLoggedIn, restoreSession, isClient } = useAuth()

  if (!isLoggedIn.value) {
    return navigateTo('/login')
  }

  const valid = await restoreSession()
  if (!valid) {
    return navigateTo('/login')
  }

  if (!isClient.value) {
    return navigateTo('/dashboard')
  }
})
