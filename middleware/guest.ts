export default defineNuxtRouteMiddleware(async () => {
  const { isLoggedIn, restoreSession, homePath } = useAuth()

  if (!isLoggedIn.value) return

  const valid = await restoreSession()
  if (valid) {
    return navigateTo(homePath.value)
  }
})
