# syntax=docker/dockerfile:1
# Build image produksi Nuxt (Nitro node-server). Output: satu proses Node melayani SPA + API routes Nitro.

# Nuxt 4.x meminta Node ^20.19.0 atau >=22.12.0; tag `node:20-alpine` di registry biasanya sudah patch terbaru.
FROM node:20-alpine AS builder

WORKDIR /app

# Variabel public (dibundel saat build klien). Sesuaikan saat `docker build` dengan --build-arg.
ARG NUXT_PUBLIC_API_BASE=/api
ARG NUXT_PUBLIC_APP_NAME="Nuxt Boilerplate"

ENV NUXT_PUBLIC_API_BASE=${NUXT_PUBLIC_API_BASE}
ENV NUXT_PUBLIC_APP_NAME=${NUXT_PUBLIC_APP_NAME}
# Build Nuxt/Vite bisa memakan memori besar pada proyek besar
ENV NODE_OPTIONS=--max-old-space-size=8192

# Jangan set NODE_ENV=production sebelum npm ci — npm akan skip devDependencies;
# toolchain build (Tailwind, TypeScript, dll.) ada di devDependencies.
# --include=dev: aman jika agent/BuildKit menginjeksi NODE_ENV=production.
# --ignore-scripts: hindari `postinstall` → `nuxt prepare` sebelum `COPY .` (butuh sumber proyek);
# jalankan `nuxt prepare` eksplisit setelah kode ada di image.
COPY package.json package-lock.json ./
RUN npm ci --include=dev --ignore-scripts

COPY . .
ENV NODE_ENV=production
RUN npx nuxt prepare && npm run build

# --- Runtime: hanya isi .output (Nitro menyertakan dependensi server yang diperlukan)
FROM node:20-alpine AS runner

# Samakan dengan builder: Nitro bisa override runtimeConfig dari process.env; printenv di pod pun terisi.
ARG NUXT_PUBLIC_API_BASE=/api
ARG NUXT_PUBLIC_APP_NAME="Nuxt Boilerplate"

ENV NUXT_PUBLIC_API_BASE=${NUXT_PUBLIC_API_BASE}
ENV NUXT_PUBLIC_APP_NAME=${NUXT_PUBLIC_APP_NAME}

WORKDIR /app

ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT=3000
ENV NITRO_HOST=0.0.0.0
ENV NITRO_PORT=3000

RUN addgroup --system --gid 1001 nodejs \
  && adduser --system --uid 1001 nuxt

COPY --from=builder --chown=nuxt:nodejs /app/.output ./

USER nuxt

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=5s --start-period=15s --retries=3 \
  CMD wget -qO- http://127.0.0.1:3000/ > /dev/null || exit 1

CMD ["node", "server/index.mjs"]
