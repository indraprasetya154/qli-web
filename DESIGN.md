# DESIGN.md

# Qatar Loker Info — Design System & UI Guidelines

**Version:** 1.0  
**Product:** Qatar Loker Info  
**Design Direction:** Modern, Professional, Trustworthy, International  
**Primary Language:** Bahasa Indonesia

---

# 1. Design Philosophy

## 1.1 Brand Identity

Qatar Loker Info merupakan platform konsultasi dan pendampingan persiapan kerja ke Qatar.

Identitas visual harus merepresentasikan:

- **Trustworthy:** Memberikan rasa aman dan kepercayaan kepada calon klien.
- **Professional:** Menampilkan layanan secara profesional dan terstruktur.
- **International:** Memiliki nuansa karier internasional dan Timur Tengah.
- **Accessible:** Mudah digunakan oleh berbagai kalangan pengguna.
- **Modern:** Menggunakan desain modern, minimalis, dan tidak berlebihan.

## 1.2 Design Concept

**Qatar Identity meets Modern Career Platform.**

Menggunakan inspirasi warna khas Qatar, terutama warna maroon pada bendera Qatar, dikombinasikan dengan warna putih, beige, dan gold. Palet dan styling publik mengacu pada Visit Qatar (visitqatar.com): maroon #7D002A, krem #FAF8F4, teal #00627B untuk tautan, dan gold #CDB97E sebagai aksen.

Visual website harus terasa premium, tetapi tidak terlalu eksklusif atau formal.

Hindari:

- Penggunaan warna terlalu banyak.
- Gradient berlebihan.
- Glassmorphism yang tidak diperlukan.
- Terlalu banyak animasi.
- Layout yang terlalu padat.
- Elemen dekoratif yang mengganggu keterbacaan.

---

# 2. Brand Color System

## 2.1 Primary Colors

| Token | Hex | Usage |
| --- | --- | --- |
| Qatar Maroon | #7D002A | Primary brand |
| Maroon Hover | #5F0020 | Hover state |
| Maroon Light | #F4E5EA | Background accent |
| White | #FFFFFF | Main background |

Qatar Maroon merupakan warna identitas utama dan harus menjadi warna paling mudah dikenali pada website.

## 2.2 Secondary Colors

| Token | Hex | Usage |
| --- | --- | --- |
| Desert Sand | #E2E0DC | Section background |
| Warm Beige | #FAF8F4 | Alternative background |
| Muted Gold | #CDB97E | Decorative accent |
| Deep Teal | #005870 | Secondary accent, teal text/link di atas latar terang |
| Charcoal | #1A1919 | Main typography |
| Muted Gray | #575654 | Secondary typography |

## 2.3 Semantic Colors

| Token | Hex | Usage |
| --- | --- | --- |
| Success | #27845B | Success status |
| Warning | #D99A31 | Warning status |
| Danger | #C43D48 | Error status |
| Info | #3577A8 | Information status |

## 2.4 Alinyemen Visual Visit Qatar

Acuan gaya publik: visitqatar.com. Yang diadopsi, beserta alasannya:

- **Dasar krem, bukan putih penuh.** Body memakai #FAF8F4 dan kartu memakai putih, sehingga konten tetap menonjol tanpa garis tebal.
- **Tipografi medium di ukuran besar.** H1–H4 memakai weight 500 dengan line-height 1.3 dan letter-spacing normal, mengikuti h1 Visit Qatar (3.5rem/500), bukan bold rapat.
- **Radius kecil.** Tombol 6px, kartu 8px, mengikuti radius dominan Visit Qatar (6px).
- **Tautan teal #00627B, aksi utama maroon.** Teal menandai navigasi dan tautan sekunder, maroon hanya untuk aksi utama.
- **Tanpa label uppercase bertracking lebar.** Label section memakai kalimat biasa, karena Visit Qatar hampir tidak memakai uppercase dekoratif.
- **Shadow hanya untuk elevasi.** Kartu datar memakai garis tipis; hanya kartu yang perlu menonjol (paket unggulan) memakai shadow.

## 2.5 Color Usage Ratio

Recommended distribution:

- White: 45%
- Warm Beige: 20%
- Qatar Maroon: 20%
- Charcoal: 10%
- Gold: 5%

Gold hanya digunakan sebagai accent, bukan warna utama tombol atau teks panjang.

## 2.6 CSS Variables

```css
:root {
  /* Primary */
  --color-primary: #7D002A;
  --color-primary-hover: #5F0020;
  --color-primary-light: #F4E5EA;

  /* Neutral */
  --color-white: #FFFFFF;
  --color-background: #FAF8F4;
  --color-sand: #E2E0DC;
  --color-charcoal: #1A1919;
  --color-muted: #575654;

  /* Accent */
  --color-gold: #CDB97E;
  --color-teal-deep: #005870;

  /* Semantic */
  --color-success: #27845B;
  --color-warning: #D99A31;
  --color-danger: #C43D48;
  --color-info: #3577A8;

  /* Border */
  --color-border: #E2E0DC;

  /* Surface */
  --color-surface: #FFFFFF;
  --color-surface-secondary: #FAF8F4;
}
```

---

# 3. Typography

## 3.1 Font Family

Recommended font: **Plus Jakarta Sans**

Alternative: Inter.

Karakteristik:

- Modern.
- Professional.
- Readable.
- Suitable for corporate and technology products.

```css
font-family: 'Plus Jakarta Sans', sans-serif;
```

## 3.2 Typography Scale

| Element | Desktop | Mobile | Weight |
| --- | ---: | ---: | --- |
| Display | 56px | 38px | 500 |
| H1 | 48px | 34px | 500 |
| H2 | 36px | 28px | 500 |
| H3 | 28px | 24px | 500 |
| H4 | 22px | 20px | 500 |
| Body Large | 18px | 17px | 400 |
| Body | 16px | 15px | 400 |
| Caption | 14px | 13px | 400 |
| Small | 12px | 12px | 400 |

Guidelines:

- Heading menggunakan font weight 500 di ukuran besar, mengikuti Visit Qatar; teks lebih ringan dan lapang.
- Body menggunakan font weight 400.
- Gunakan line-height 1.5–1.7 untuk paragraf.
- Hindari penggunaan terlalu banyak variasi font size dalam satu section.

---

# 4. Layout System

## 4.1 Container

| Property | Value |
| --- | --- |
| Max Width | 1200px |
| Desktop Padding | 32px |
| Tablet Padding | 24px |
| Mobile Padding | 20px |
| Section Spacing | 80–120px |
| Card Gap | 24px |

## 4.2 Grid

Desktop:

- 12-column grid.
- Maximum container width 1200px.
- Gap 24px.

Tablet:

- 8-column grid.
- Gap 20px.

Mobile:

- 4-column grid.
- Gap 16px.

## 4.3 Border Radius

| Component | Radius |
| --- | --- |
| Button | 6px |
| Input | 6px |
| Card | 8px |
| Modal | 8px |
| Image | 8px |
| Badge | 999px |

## 4.4 Shadow

Gunakan shadow secara subtle.

```css
--shadow-sm: 0 2px 8px rgba(37, 37, 37, 0.04);
--shadow-md: 0 8px 24px rgba(37, 37, 37, 0.08);
--shadow-lg: 0 16px 40px rgba(37, 37, 37, 0.12);
```

---

# 5. Component Design System

## 5.1 Buttons

### Primary Button

- Background: Qatar Maroon.
- Text: White.
- Border radius: 10px.
- Font weight: 600.

### Secondary Button

- Background: White.
- Text: Qatar Maroon.
- Border: 1px solid Qatar Maroon.

### Ghost Button

- Background: Transparent.
- Text: Charcoal.

### Button Sizes

| Size | Height |
| --- | ---: |
| Small | 36px |
| Medium | 44px |
| Large | 52px |

Primary CTA harus memiliki kontras yang jelas dan label yang berorientasi tindakan.

Contoh:

- Mulai Konsultasi
- Daftar Sekarang
- Hubungi Customer Service

## 5.2 Cards

Gunakan:

- White background.
- 1px subtle border.
- 16px border radius.
- Subtle shadow jika diperlukan.
- Padding 24px.

Card harus memiliki struktur:

1. Icon atau image.
2. Title.
3. Description.
4. Optional metadata.
5. Optional CTA.

## 5.3 Form Inputs

Input harus memiliki:

- Label.
- Placeholder.
- Helper text jika diperlukan.
- Error message.
- Focus state.
- Disabled state.

Height:

- Standard input: 48px.
- Textarea: minimum 120px.

## 5.4 Badges

Contoh status:

| Status | Style |
| --- | --- |
| Pending | Yellow |
| Paid | Green |
| Rejected | Red |
| Processing | Blue |
| Completed | Green |
| Inactive | Gray |

Gunakan badge untuk status yang benar-benar membutuhkan identifikasi cepat.

## 5.5 Navigation

Public Navbar:

- Logo Qatar Loker Info.
- Beranda.
- Tentang Kami.
- Informasi Lowongan.
- Layanan.
- FAQ.
- Login.
- CTA Mulai Konsultasi.

Navbar:

- White background.
- Sticky positioning.
- Height sekitar 76px.
- Subtle bottom border.

Mobile:

- Logo di kiri.
- Hamburger menu di kanan.
- Navigation menggunakan drawer.

---

# 6. Public Website Design

## 6.1 Homepage

Homepage harus berorientasi pada konversi pengunjung menjadi calon klien.

Urutan section:

1. Navigation.
2. Hero Section.
3. About Qatar Loker Info (judul besar, center).
4. Core Value (tiga nilai: informasi terstruktur, pendampingan personal, proses transparan).
5. Our Services (satu section; paket dan layanan adalah hal yang sama, satu kartu per layanan dari CMS).
6. How It Works.
7. Latest Job Information.
8. Testimonials.
9. FAQ.
10. CTA Section.
11. Footer.
12. Floating WhatsApp & CS Bot.

### Hero Section

Layout:

- Two-column layout.
- Left: Headline, description, CTA.
- Right: Qatar-related photography.
- Background: White atau Warm Beige.
- Optional maroon decorative element.

Headline:

"Persiapkan Karier Impianmu di Qatar."

Description:

"Temukan informasi dan persiapkan langkah karier internasionalmu bersama Qatar Loker Info melalui layanan konsultasi dan pendampingan yang terstruktur."

Primary CTA:
"Mulai Konsultasi"

Secondary CTA:
"Lihat Layanan"

Visual direction:

- Doha skyline.
- Professional working environment.
- International career imagery.
- Natural photography.
- Avoid generic stock imagery that feels artificial.

### Core Value

Tiga nilai, bukan statistik:

- Informasi terstruktur.
- Pendampingan personal.
- Proses transparan.

Ikut section About, setelah paragraf dan visi/misi. Jangan menampilkan angka fiktif.

### About Section

Menjelaskan:

- Siapa Qatar Loker Info.
- Tujuan layanan.
- Pendekatan konsultasi.
- Keunggulan.

### Why Choose Us

Gunakan 3–4 cards:

- Informasi Terstruktur.
- Pendampingan Personal.
- Persiapan Lebih Terarah.
- Proses Transparan.

### Our Services

Layanan dan paket adalah hal yang sama: satu penawaran. Karena itu
hanya ada satu section dan satu daftar kartu, bukan dua section terpisah.

Satu kartu = satu layanan, diambil dari CMS (`/v1/package/public`).

Card berisi:

- Nama layanan.
- Deskripsi singkat.
- Daftar cakupan layanan.
- CTA Lihat Detail.

Harga tidak ditampilkan di halaman layanan publik. Paket disiapkan setelah CV
client direview, jadi tidak ada pemesanan paket langsung dari halaman publik.

Kartu unggulan (`is_featured`) memakai border maroon dan satu-satunya shadow di
section ini, sebagai penanda pilihan utama.

Jika CMS belum mengembalikan data, tampilkan empty state dengan alasan dan satu
tindakan (hubungi Customer Service), bukan daftar layanan statis.

Jangan membuat klaim hasil pekerjaan atau jaminan diterima.

### How It Works

Gunakan horizontal stepper pada desktop dan vertical stepper pada mobile.

1. Pilih Layanan.
2. Buat Akun.
3. Lakukan Pembayaran.
4. Mulai Pendampingan.

### Job Information

Tampilan menggunakan card/list.

Setiap informasi lowongan:

- Job title.
- Company.
- Location.
- Published date.
- Source.
- Status informasi.

Informasi lowongan harus dapat diverifikasi dan memiliki sumber yang jelas.

### Testimonials

Gunakan testimonial cards.

Informasi:

- Nama klien sesuai persetujuan.
- Foto opsional.
- Isi testimoni.
- Layanan yang digunakan.

Jangan membuat testimoni fiktif.

### FAQ

Gunakan accordion.

FAQ dapat dikelompokkan berdasarkan kategori.

### CTA Section

Background: Qatar Maroon.

Headline:

"Langkah Pertamamu Menuju Karier Internasional Dimulai di Sini."

CTA:
"Hubungi Kami Sekarang"

### Footer

Isi:

- Logo.
- Deskripsi singkat.
- Quick links.
- Services.
- Instagram.
- WhatsApp.
- Contact information.
- Privacy Policy.
- Terms & Conditions.

---

# 7. Client Portal Design

Client Portal menggunakan identitas warna yang sama dengan public website, tetapi layout lebih berorientasi produktivitas.

## 7.1 Layout

Desktop:

- Sidebar navigation.
- Topbar.
- Main content.
- Notification area.

Mobile:

- Compact header.
- Mobile navigation.
- Responsive content cards.

## 7.2 Sidebar

Menu:

- Dashboard.
- Profil Saya.
- Paket Saya.
- Pesanan.
- Pembayaran.
- Dokumen.
- Progres Pendampingan.
- Notifikasi.
- Bantuan.

## 7.3 Dashboard

Komponen:

### Welcome Section

"Halo, [Nama Client]"

Subtitle:
"Selamat datang di dashboard Qatar Loker Info."

### Active Package

Menampilkan:

- Nama paket.
- Tanggal pembelian.
- Status order.
- Detail layanan.

### Payment Summary

Menampilkan:

- Invoice number.
- Total pembayaran.
- Payment status.
- Payment date.

### Document Status

Menampilkan:

- Jumlah dokumen.
- Dokumen yang sudah disetujui.
- Dokumen yang perlu direvisi.

### Preparation Progress

Gunakan vertical stepper atau progress timeline.

### Recent Notifications

Menampilkan aktivitas terbaru.

---

# 8. Admin CMS Design

Admin CMS menggunakan layout dashboard profesional dan konsisten.

## 8.1 Layout

- Sidebar navigation.
- Topbar.
- Breadcrumb.
- Main content.
- Data table.
- Filter dan search.
- Modal / drawer untuk form.

## 8.2 Dashboard Overview

Statistik utama:

- Total Clients.
- New Registrations.
- Pending Payments.
- Verified Payments.
- Active Orders.
- Documents Awaiting Review.

## 8.3 Data Table

Standar tabel:

- Search.
- Filter.
- Sorting.
- Pagination.
- Action menu.
- Status badge.

## 8.4 CRUD Forms

Gunakan form terstruktur dengan:

- Label jelas.
- Required indicators.
- Input validation.
- Save / Cancel buttons.
- Confirmation dialog untuk tindakan destruktif.

## 8.5 CMS Modules

- Dashboard.
- User Management.
- Client Management.
- Company Profile.
- Services.
- Packages.
- Job Information.
- Orders.
- Payments.
- Documents.
- Preparation Progress.
- FAQ.
- Testimonials.
- Chatbot Knowledge.
- Notifications.
- Settings.

---

# 9. Chatbot Design

CS Bot menggunakan floating button pada kanan bawah website.

Visual:

- Maroon floating button.
- White chatbot panel.
- Rounded corners.
- Clear conversation hierarchy.

Chatbot states:

- Welcome.
- Suggested Questions.
- User Message.
- Bot Response.
- No Answer.
- Contact Human Support.

Welcome message:

"Halo! Selamat datang di Qatar Loker Info. Ada yang bisa kami bantu terkait persiapan kerja di Qatar?"

Suggested questions:

- Apa itu Qatar Loker Info?
- Apa saja layanan yang tersedia?
- Berapa harga paket konsultasi?
- Apa saja dokumen yang dibutuhkan?
- Bagaimana proses pendaftaran?

Jika pertanyaan tidak dapat dijawab, tampilkan CTA menuju WhatsApp Customer Service.

---

# 10. Iconography & Imagery

## 10.1 Icon

Recommended icon library:

- Lucide Icons.

Style:

- Outline.
- Consistent stroke width.
- Avoid mixing icon styles.

## 10.2 Image Direction

Gunakan foto berkualitas tinggi dengan tema:

- Doha skyline.
- Qatar architecture.
- Professional office.
- Career preparation.
- Resume and interview.
- International workplace.

Hindari:

- Foto yang terlalu generik.
- Foto dengan watermark.
- Penggunaan ilustrasi kartun yang tidak konsisten.
- Foto yang memberi kesan bahwa semua pekerjaan atau fasilitas sudah dijamin.

---

# 11. Responsive Design

## Breakpoints

| Device | Width |
| --- | --- |
| Mobile | < 640px |
| Tablet | 640–1023px |
| Desktop | ≥ 1024px |
| Wide Desktop | ≥ 1440px |

## Mobile Guidelines

- Mobile-first.
- Hero menjadi satu kolom.
- CTA menggunakan full width jika diperlukan.
- Service cards menjadi vertical stack.
- Package cards menjadi vertical stack.
- Navigation menggunakan drawer.
- Tables menggunakan responsive layout.
- Dashboard menggunakan single-column cards.
- Form input menggunakan full width.

Tidak boleh ada horizontal overflow.

---

# 12. Interaction & Animation

Gunakan animasi ringan dan fungsional.

Recommended:

- Button hover transition.
- Card hover elevation.
- Accordion expand/collapse.
- Modal fade.
- Drawer slide.
- Subtle scroll reveal.

Animation duration:

- 150–250ms untuk micro interactions.
- 250–350ms untuk modal dan drawer.

Hindari:

- Animasi berulang yang mengganggu.
- Parallax berlebihan.
- Scroll hijacking.
- Animasi yang memperlambat interaksi.

---

# 13. Accessibility

- Kontras warna memenuhi WCAG AA.
- Semua form memiliki label.
- Semua tombol memiliki accessible name.
- Navigation dapat digunakan melalui keyboard.
- Focus state terlihat jelas.
- Image memiliki alt text.
- Error message mudah dipahami.
- Status tidak hanya dibedakan berdasarkan warna.

Perhatikan bahwa teks putih pada gold tidak boleh digunakan jika kontrasnya tidak memenuhi standar.

---

# 14. Frontend Implementation Guidelines

## Recommended Stack

- Tailwind CSS.
- Lucide Icons.
- Reusable Components.
- Responsive Layout.
- Component-based architecture.

## Component Structure

```text
components/
├── layout/
│   ├── PublicNavbar
│   ├── PublicFooter
│   ├── AdminSidebar
│   ├── AdminTopbar
│   └── ClientSidebar
│
├── ui/
│   ├── Button
│   ├── Input
│   ├── Select
│   ├── Badge
│   ├── Card
│   ├── Modal
│   ├── Dropdown
│   ├── DataTable
│   └── Pagination
│
├── public/
│   ├── HeroSection
│   ├── AboutSection
│   ├── ServiceCard
│   ├── PackageCard
│   ├── JobCard
│   ├── TestimonialCard
│   ├── FAQAccordion
│   └── CTASection
│
├── client/
│   ├── WelcomeCard
│   ├── PackageSummary
│   ├── PaymentSummary
│   ├── DocumentStatus
│   ├── ProgressTimeline
│   └── NotificationList
│
└── shared/
    ├── ChatbotWidget
    ├── WhatsAppButton
    ├── EmptyState
    ├── LoadingState
    └── ErrorState
```

## Implementation Rules

1. Gunakan design tokens sebagai sumber warna dan spacing.
2. Hindari hardcoded warna pada setiap komponen.
3. Semua komponen UI harus reusable.
4. Pisahkan public website, admin CMS, dan client portal.
5. Gunakan typography yang konsisten.
6. Gunakan semantic HTML.
7. Pastikan seluruh halaman responsive.
8. Gunakan loading, empty, error, dan success states.
9. Gunakan data aktual dari backend untuk informasi bisnis.
10. Jangan membuat klaim bisnis atau statistik yang tidak terverifikasi.

---

# 15. Design Quality Checklist

## Brand

- [ ] Qatar Maroon digunakan sebagai primary color.
- [ ] Warna konsisten di semua halaman.
- [ ] Typography konsisten.
- [ ] Logo memiliki clear space yang cukup.

## Public Website

- [ ] Hero memiliki headline dan CTA yang jelas.
- [ ] Informasi layanan mudah dipahami.
- [ ] Paket memiliki harga dan detail yang transparan.
- [ ] Informasi lowongan memiliki sumber.
- [ ] FAQ mudah digunakan.
- [ ] CTA WhatsApp berfungsi.

## Client Portal

- [ ] Dashboard mudah dipahami.
- [ ] Status pembayaran terlihat.
- [ ] Dokumen mudah dikelola.
- [ ] Progres pendampingan mudah dipahami.
- [ ] Navigasi responsif.

## Admin CMS

- [ ] Layout konsisten.
- [ ] Data table mudah digunakan.
- [ ] Form memiliki validasi.
- [ ] Status menggunakan semantic colors.
- [ ] Role-based access diterapkan.

## Responsive & Accessibility

- [ ] Mobile layout optimal.
- [ ] Tidak ada horizontal overflow.
- [ ] Contrast memenuhi WCAG AA.
- [ ] Keyboard navigation berfungsi.
- [ ] Form memiliki label.

---

# 16. Final Design Principles

Seluruh pengembangan desain Qatar Loker Info wajib mengikuti prinsip berikut:

1. **Brand Consistency:** Qatar Maroon merupakan identitas visual utama.
2. **Clarity First:** Informasi harus lebih diutamakan daripada dekorasi.
3. **Trust by Design:** Tampilkan informasi, harga, proses, dan persyaratan secara transparan.
4. **Conversion Oriented:** Setiap halaman publik memiliki tujuan dan CTA yang jelas.
5. **User Friendly:** Pengguna harus mudah memahami alur tanpa membutuhkan bantuan CS untuk hal-hal dasar.
6. **Consistency Across Platforms:** Public Website, Admin CMS, dan Client Portal menggunakan design system yang sama.
7. **Mobile First:** Semua halaman harus optimal di perangkat mobile.

**Final Design Direction:**

Qatar Loker Info harus tampil sebagai platform konsultasi karier internasional yang modern, profesional, terpercaya, dan memiliki identitas khas Qatar melalui kombinasi Qatar Maroon, White, Desert Sand, dan Muted Gold.

**END OF DESIGN SYSTEM**
