/** TrueWatch / Guance RUM — env `NUXT_PUBLIC_RUM_*`. Dengan SPA (`ssr: false`), kredensial diambil dari server `/api/rum-env` agar nilai pod/Secret terpakai. */
export default defineNuxtPlugin({
  name: 'rum',
  enforce: 'pre',
  async setup() {
    type RumPayload = {
      enabled: string | boolean
      applicationId: string
      clientToken: string
      site: string
      datakitOrigin: string
      env: string
      version: string
      service: string
      sessionSampleRate: string | number
      sessionReplaySampleRate: string | number
    }

    let rum: RumPayload
    try {
      rum = await $fetch<RumPayload>('/api/rum-env')
    } catch {
      const { public: pub } = useRuntimeConfig()
      rum = pub.rum as RumPayload
    }

    const enabled =
      rum.enabled === true ||
      rum.enabled === 'true' ||
      String(rum.enabled).toLowerCase() === 'true'
    if (!enabled) {
      return
    }

    const applicationId = String(rum.applicationId ?? '').trim()
    if (!applicationId) {
      if (import.meta.dev) {
        console.warn('[RUM] enabled but applicationId is empty (Secret / NUXT_PUBLIC_RUM_APPLICATION_ID)')
      }
      return
    }

    const { datafluxRum } = await import('@cloudcare/browser-rum')

    const sessionSampleRate = Number(rum.sessionSampleRate)
    const sessionReplaySampleRate = Number(rum.sessionReplaySampleRate)
    const service = String(rum.service ?? '').trim()

    const base = {
      applicationId,
      env: rum.env || undefined,
      version: rum.version || undefined,
      service: service || undefined,
      sessionSampleRate: Number.isFinite(sessionSampleRate) ? sessionSampleRate : 100,
      sessionReplaySampleRate: Number.isFinite(sessionReplaySampleRate)
        ? sessionReplaySampleRate
        : 0,
      trackUserInteractions: true
    }

    const datakitOrigin = String(rum.datakitOrigin ?? '').trim()
    if (datakitOrigin !== '') {
      datafluxRum.init({
        ...base,
        datakitOrigin
      })
      return
    }

    const site = String(rum.site ?? '').trim()
    if (!site) {
      if (import.meta.dev) {
        console.warn('[RUM] set NUXT_PUBLIC_RUM_DATAKIT_ORIGIN atau NUXT_PUBLIC_RUM_SITE')
      }
      return
    }

    const clientToken = String(rum.clientToken ?? '').trim()
    datafluxRum.init({
      ...base,
      clientToken: clientToken || undefined,
      site
    })
  }
})
