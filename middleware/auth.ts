export default defineNuxtRouteMiddleware(async () => {
  const { isLoggedIn, restoreSession } = useAuth()

  if (!isLoggedIn.value) {
    return navigateTo('/login')
  }

  const valid = await restoreSession()
  if (!valid) {
    return navigateTo('/login')
  }
})
