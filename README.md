# Frontend Boilerplate — Nuxt 4 + Nuxt UI

Boilerplate frontend **Nuxt 4** dengan **Nuxt UI**, Tailwind CSS, dan TypeScript sebagai acuan menambahkan fitur baru.

## Stack teknis

- [Nuxt 4](https://nuxt.com/) (mode SPA: `ssr: false`)
- [Nuxt UI 4](https://ui.nuxt.com/) + Tailwind CSS 4
- TypeScript (strict) + ESLint + Prettier
- Vitest (unit test)
- Google Analytics (`nuxt-gtag`) dan TrueWatch RUM (opsional)

## Prasyarat

- Node.js **≥ 20.19** (cek dengan `node -v`)
- npm

## Instalasi & skrip

```bash
npm install
npm run dev
```

| Perintah | Keterangan |
|----------|------------|
| `npm run dev` | Server pengembangan |
| `npm run build` | Build produksi |
| `npm run preview` | Pratinjau build lokal |
| `npm run generate` | Static generate (jika diperlukan) |
| `npm run lint` | Linting codebase (ESLint) |
| `npm run typecheck` | Pemeriksaan tipe TypeScript |
| `npm run test` | Menjalankan unit test (Vitest) |
| `npm run ci:check` | Quality gate lokal (lint + typecheck + test + build) |
| `npm run format:check` | Validasi format kode (Prettier) |

## Konfigurasi

Salin `.env.example` → `.env` lalu sesuaikan:

- `NUXT_PUBLIC_API_BASE` — base URL backend (default `/api`).
- `NUXT_PUBLIC_APP_NAME` — nama aplikasi di sidebar/header.
- Variabel `NUXT_PUBLIC_RUM_*` — opsional untuk TrueWatch RUM.

Judul tab browser memakai `titleTemplate` `%s · Qatar Loker Info - Admin Panel`.

## Client Management

- `/clients` - daftar client dengan statistik, pencarian, filter status/akun, sorting, pagination, dan aksi CRUD.
- `/clients/create` - form client dengan bagian personal, professional, application, dan akun CMS opsional.
- `/clients/[id]` - detail client dengan tab Overview, Application Information, Account, dan Notes.
- `/clients/[id]/edit` - edit profil client.
- `/client` - halaman profil untuk user dengan role client.
- `/client/orders` - riwayat pesanan client.
- `/client/orders/[id]` - detail pesanan milik client (backend memfilter berdasarkan user login).

Role diambil dari `user_type` pada respons login. Admin diarahkan ke `/dashboard`, client ke `/client`. Middleware `admin` dan `client` mencegah akses lintas role. Reset password dan pembuatan akun menampilkan password sementara satu kali.

## Paket, Penawaran, dan Pembayaran Manual

- `/packages` - daftar paket aktif dari `GET /v1/package/public`. Tanpa harga; CTA ke `/register` atau `/client/offers`.
- `/packages/[id]` - detail paket aktif. Tanpa harga dan tanpa checkout.
- `/client/cv` - upload CV sekali per akun, status review, catatan, dan masukan admin. Catatan penuh terbuka setelah ada pesanan `PAID`.
- `/client/offers` - penawaran paket milik client (`GET /v1/package-offer/me`). Checkout hanya untuk status `OFFERED` dan belum expired.
- `/checkout/[offerId]` - form data client + rekening aktif + voucher, lalu `POST /v1/order` dengan `offer_id`. Butuh login (`middleware: ['client']`).
- `/order/[orderNumber]` - instruksi transfer, status pesanan, dan upload bukti. Akses memakai nomor pesanan + email pemesan.
- `/atur-password?token=...` - aktivasi akun lama atau akun buatan admin.

Alur: daftar membuat akun client, client upload CV, admin review dan membuat penawaran dengan harga manual, client membuat pesanan dari penawaran, transfer manual, admin verifikasi. Harga hanya ada di `package_offers.price`; backend menghitung ulang total dan diskon voucher. Halaman publik memakai `sessionStorage` untuk mengingat email pemesan per nomor pesanan.

## Auth

- `/login` — masuk dengan username atau email + password.
- `/register` — pendaftaran akun baru (username, email, no. telepon, password).
- `composables/useAuth.ts` — simpan token di cookie, login, register, restore sesi, logout.
- `composables/useApi.ts` — otomatis mengirim `Authorization: Bearer <token>`.
- `middleware/auth.ts` dan `middleware/guest.ts` — proteksi rute.

Endpoint backend yang dipakai: `POST /v1/auth/login`, `POST /v1/auth/register`, `GET /v1/auth/me`.

Cookie auth bernama `qli_auth_token`, dipakai bersama web dan cms — mengganti namanya akan melogout semua pengguna.

## Struktur ringkas

```
assets/          # CSS global & gambar
components/      # Komponen UI reusable
composables/     # useApi (HTTP helper), useAppLayout (breadcrumb)
layouts/         # default, app-sidebar
pages/           # Rute aplikasi
plugins/         # Plugin client (RUM)
server/          # API routes Nitro
types/           # Tipe data domain
utils/           # Helper format & UI
```

## Menambah modul baru

1. Buat tipe data di `types/<nama-modul>.ts`.
2. Buat halaman daftar di `pages/<nama-modul>/index.vue`.
3. Buat halaman detail di `pages/<nama-modul>/[code].vue` (opsional).
4. Daftarkan menu di `layouts/app-sidebar.vue` pada array `navSections`.
5. Tambahkan shortcut di `pages/dashboard.vue` pada array `featureShortcuts` (opsional).

## Pola CRUD

```ts
const { apiFetch, apiPost, apiPatch, apiDelete } = useApi()

const data = await apiFetch<PaginatedResponse<MyRow>>('/v1/my-resource/?page=1')
await apiPost('/v1/my-resource/', { name: 'Nama Baru' })
await apiPatch('/v1/my-resource/CODE', { name: 'Nama Diperbarui' })
await apiDelete('/v1/my-resource/CODE')
```

## Deployment

Proyek ini menyertakan `Dockerfile` multi-stage:

```bash
docker build -t nuxt-boilerplate-web:latest .
docker run --rm -p 3000:3000 nuxt-boilerplate-web:latest
```

Nilai `NUXT_PUBLIC_*` ikut terbundel ke klien; set lewat `.env` atau `--build-arg` sebelum build.
