declare module 'nuxt/schema' {
  interface PublicRuntimeConfig {
    rum: {
      enabled: string | boolean
      applicationId: string
      clientToken: string
      site: string
      datakitOrigin: string
      env: string
      version: string
      /** Nama service di TrueWatch (mis. web). */
      service: string
      sessionSampleRate: string | number
      sessionReplaySampleRate: string | number
    }
  }
}

export {}
