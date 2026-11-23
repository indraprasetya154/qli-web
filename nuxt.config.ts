import { defineNuxtConfig } from 'nuxt/config'

const apiBase = process.env.NUXT_PUBLIC_API_BASE || '/api'
const gtagId = process.env.NUXT_PUBLIC_GTAG_ID || ''
const localApiOrigin = /^http:\/\//.test(apiBase)
  ? apiBase.replace(/\/$/, '')
  : ''

export default defineNuxtConfig({
  ssr: false,
  typescript: {
    strict: true,
    typeCheck: false
  },
  app: {
    pageTransition: { name: 'page', mode: 'out-in' },
    head: {
      htmlAttrs: { lang: 'id' },
      title: 'Qatar Loker Info',
      titleTemplate: '%s · Qatar Loker Info',
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        {
          name: 'description',
          content:
            'Platform konsultasi dan pendampingan persiapan kerja ke Qatar: informasi, layanan, paket, dan portal klien.'
        },
        { property: 'og:title', content: 'Qatar Loker Info' },
        {
          property: 'og:description',
          content:
            'Persiapkan karier impianmu di Qatar bersama Qatar Loker Info.'
        },
        { property: 'og:type', content: 'website' }
      ],
      link: []
    }
  },
  css: ['~/assets/css/tailwind.css'],
  components: true,
  modules: ['@nuxt/ui', 'nuxt-gtag'],
  colorMode: {
    preference: 'light',
    fallback: 'light'
  },
  ui: {
    // Cast to any to satisfy slightly outdated type definitions
    icons: ['heroicons']
  } as any,
  gtag: {
    id: gtagId || 'G-XXXXXXXXXX',
    enabled: Boolean(gtagId),
    debug: false
  } as any,
  nitro: {
    preset: 'node-server',
    routeRules: {
      '/**': {
        headers: {
          'X-Frame-Options': 'DENY',
          'X-Content-Type-Options': 'nosniff',
          'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
          'Referrer-Policy': 'strict-origin-when-cross-origin',
          'Permissions-Policy': 'camera=(self), microphone=()',
          // CSP dasar; sesuaikan bila menambahkan layanan eksternal.
          'Content-Security-Policy': [
            "default-src 'self'",
            "base-uri 'self'",
            "object-src 'none'",
            "frame-ancestors 'none'",
            // Nuxt SPA membutuhkan inline style; script inline dipakai sebagian runtime/komponen.
            "script-src 'self' 'unsafe-inline' https://www.googletagmanager.com",
            "style-src 'self' 'unsafe-inline'",
            "img-src 'self' data: https: blob: https://www.googletagmanager.com https://*.google-analytics.com",
            "font-src 'self' data: https:",
            `connect-src 'self' https: wss: https://*.google-analytics.com https://*.analytics.google.com https://www.googletagmanager.com${localApiOrigin ? ` ${localApiOrigin}` : ''}`,
            "worker-src 'self' blob:",
            "manifest-src 'self'",
          ].join('; ')
        }
      }
    }
  },
  runtimeConfig: {
    public: {
      /** Base URL backend untuk `$fetch` / integrasi API. */
      apiBase,
      /** Nama produk di sidebar & layar aplikasi. */
      appName: process.env.NUXT_PUBLIC_APP_NAME || 'Qatar Loker Info',
      /** TrueWatch RUM (browser), opsional. */
      rum: {
        enabled: false,
        applicationId: '',
        clientToken: '',
        site: '',
        datakitOrigin: '',
        env: '',
        version: '',
        service: '',
        sessionSampleRate: 100,
        sessionReplaySampleRate: 0
      }
    }
  }
})
