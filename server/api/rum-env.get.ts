/**
 * Konfigurasi RUM untuk klien browser. Dengan `ssr: false`, env pod tidak ikut ke bundle JS;
 * baca dari runtime server (Secret + env) lalu konsumsi lewat plugin client.
 *
 * Mendukung key Secret `NUXT_PUBLIC_RUM_*` dan fallback nama lama `NUXT_PUBLIC_TRUEWATCH_RUM_*`.
 */
export default defineEventHandler(() => {
  const {
    public: { rum }
  } = useRuntimeConfig()

  const pick = (...candidates: Array<string | undefined | number | boolean>): string => {
    for (const c of candidates) {
      if (c === undefined || c === null) continue
      const t = String(c).trim()
      if (t !== '') return t
    }
    return ''
  }

  return {
    enabled: rum.enabled,
    applicationId: pick(
      rum.applicationId as string,
      process.env.NUXT_PUBLIC_RUM_APPLICATION_ID,
      process.env.NUXT_PUBLIC_TRUEWATCH_RUM_APPLICATION_ID
    ),
    clientToken: pick(
      rum.clientToken as string,
      process.env.NUXT_PUBLIC_RUM_CLIENT_TOKEN,
      process.env.NUXT_PUBLIC_TRUEWATCH_RUM_CLIENT_TOKEN
    ),
    site: pick(
      rum.site as string,
      process.env.NUXT_PUBLIC_RUM_SITE,
      process.env.NUXT_PUBLIC_TRUEWATCH_RUM_SITE
    ),
    datakitOrigin: pick(
      rum.datakitOrigin as string,
      process.env.NUXT_PUBLIC_RUM_DATAKIT_ORIGIN,
      process.env.NUXT_PUBLIC_TRUEWATCH_RUM_DATAKIT_ORIGIN
    ),
    env: pick(rum.env as string, process.env.NUXT_PUBLIC_RUM_ENV),
    version: pick(rum.version as string, process.env.NUXT_PUBLIC_RUM_VERSION),
    service: pick(rum.service as string, process.env.NUXT_PUBLIC_RUM_SERVICE),
    sessionSampleRate: rum.sessionSampleRate,
    sessionReplaySampleRate: rum.sessionReplaySampleRate
  }
})
