# PRODUCT REQUIREMENTS DOCUMENT (PRD)

# Qatar Loker Info

**Career Preparation & Consulting Platform**

| Document Information | Value |
| --- | --- |
| Product | Qatar Loker Info |
| Version | 1.0 – Final |
| Date | 6 November 2026 |
| Language | Bahasa Indonesia |
| Platform | Responsive Web Application |
| Product Type | Career Consulting & Preparation |
| Status | Approved Product Scope |

---

## 1. Product Overview

### 1.1 Latar Belakang

Qatar Loker Info merupakan layanan konsultasi dan pendampingan bagi masyarakat Indonesia yang memiliki keinginan untuk bekerja di Qatar.

Saat ini, informasi mengenai peluang kerja, persyaratan, layanan konsultasi, dan proses persiapan kerja banyak disampaikan melalui Instagram dan komunikasi personal.

Kondisi tersebut menimbulkan beberapa permasalahan:

1. Informasi yang sama harus dijelaskan berulang kali oleh Customer Service.
2. Calon klien kesulitan memahami jenis layanan dan paket yang tersedia.
3. Belum terdapat pusat informasi terstruktur mengenai persiapan kerja ke Qatar.
4. Proses pendaftaran dan administrasi calon klien belum terintegrasi.
5. Pembayaran dan konfirmasi transaksi masih membutuhkan proses komunikasi manual.
6. Progres pendampingan klien belum dapat dipantau melalui satu platform.

Untuk mengatasi permasalahan tersebut, dibutuhkan sebuah platform digital yang mengintegrasikan informasi, konsultasi, pendaftaran, pembayaran, serta pengelolaan klien.

### 1.2 Product Vision

Menjadi platform konsultasi dan pendampingan persiapan kerja ke Qatar yang informatif, transparan, mudah diakses, dan membantu masyarakat Indonesia mempersiapkan karier internasional secara lebih terstruktur.

### 1.3 Product Goals

- Menyediakan pusat informasi resmi Qatar Loker Info.
- Mempermudah calon klien memahami layanan dan paket konsultasi.
- Mengurangi pertanyaan repetitif melalui FAQ dan CS Bot.
- Mempermudah proses pendaftaran dan pembayaran.
- Menyediakan portal bagi klien untuk mengakses layanan.
- Membantu administrator mengelola seluruh aktivitas bisnis melalui CMS.

### 1.4 Product Positioning

Qatar Loker Info merupakan platform konsultasi dan pendampingan persiapan kerja, bukan job marketplace dan bukan platform yang menjamin penempatan atau penerimaan kerja.

Informasi lowongan yang ditampilkan berfungsi sebagai informasi dan edukasi. Pengambilan keputusan serta proses lamaran tetap mengikuti persyaratan perusahaan pemberi kerja dan ketentuan resmi yang berlaku.

---

## 2. Target Users

### 2.1 Job Seeker / Visitor

Pengunjung yang ingin mendapatkan informasi mengenai peluang kerja dan persiapan bekerja di Qatar.

Kebutuhan:

- Informasi pekerjaan dan negara tujuan.
- Informasi persyaratan kerja.
- Panduan dokumen.
- Informasi layanan konsultasi.
- Akses komunikasi dengan Customer Service.

### 2.2 Prospective Client

Pengunjung yang memiliki ketertarikan untuk menggunakan layanan Qatar Loker Info.

Kebutuhan:

- Memahami layanan dan paket.
- Melakukan konsultasi.
- Mendaftar sebagai klien.
- Memilih paket.
- Melakukan pembayaran.
- Memantau status pendaftaran.

### 2.3 Registered Client

Klien yang telah memiliki akun dan menggunakan layanan.

Kebutuhan:

- Mengakses dashboard pribadi.
- Mengelola profil.
- Mengunggah dokumen.
- Melihat status pembayaran.
- Memantau progres pendampingan.
- Menerima notifikasi.
- Menghubungi Customer Service.

### 2.4 Administrator

Pengelola utama platform.

Kebutuhan:

- Mengelola konten website.
- Mengelola layanan dan paket.
- Mengelola klien.
- Memverifikasi pembayaran.
- Mengelola dokumen.
- Memperbarui progres pendampingan.
- Mengelola FAQ dan chatbot.

### 2.5 Customer Service

Petugas yang bertanggung jawab terhadap komunikasi dan pendampingan klien.

Kebutuhan:

- Melihat informasi calon klien.
- Mengakses data klien.
- Melihat riwayat pendaftaran.
- Menangani pertanyaan.
- Memperbarui progres sesuai kewenangan.

---

## 3. Product Scope

Pengembangan produk dibagi menjadi tiga bagian utama yang seluruhnya termasuk MVP.

### 3.1 Public Website

Website yang dapat diakses tanpa login.

Fungsi:

- Brand awareness.
- Informasi perusahaan.
- Informasi layanan.
- Informasi paket.
- Informasi lowongan.
- Edukasi dan FAQ.
- Lead generation.
- Registrasi calon klien.

### 3.2 Admin CMS

Dashboard internal untuk pengelolaan website dan operasional.

Fungsi:

- Content management.
- Service management.
- Package management.
- Client management.
- Payment management.
- Document management.
- Application progress management.
- FAQ dan chatbot management.

### 3.3 Client Portal

Dashboard pribadi yang dapat diakses setelah login.

Fungsi:

- Profile management.
- Package information.
- Order history.
- Manual payment.
- Document submission.
- Preparation progress.
- Notification.
- Customer support.

---

## 4. Sitemap

### 4.1 Public Website

```text
Qatar Loker Info
│
├── Home
│   ├── Hero Section
│   ├── Introduction
│   ├── Why Choose Us
│   ├── Our Services
│   ├── Our Packages
│   ├── How It Works
│   ├── Latest Job Information
│   ├── Testimonials
│   ├── FAQ
│   └── Call to Action
│
├── About Us
│   ├── Company Profile
│   ├── Vision & Mission
│   └── Why Choose Us
│
├── Job Information
│   ├── Job Information List
│   └── Job Information Detail
│
├── Services
│   ├── CV Review
│   ├── Interview Preparation
│   └── Application Assistance
│
├── Packages
│   ├── Package List
│   └── Package Detail
│
├── FAQ
│
├── Testimonials
│
├── Contact
│
├── Authentication
│   ├── Register
│   ├── Login
│   ├── Forgot Password
│   └── Reset Password
│
└── Client Portal
    ├── Dashboard
    ├── My Profile
    ├── My Packages
    ├── My Orders
    ├── Payments
    │   ├── Payment Instructions
    │   └── Upload Payment Proof
    ├── My Documents
    ├── Preparation Progress
    ├── Notifications
    └── Help & Support
```

### 4.2 Admin CMS

```text
Admin CMS
│
├── Dashboard
│
├── User Management
│   ├── Admin Users
│   ├── Customer Service Users
│   └── Clients
│
├── Content Management
│   ├── Company Profile
│   ├── Website Settings
│   ├── Services
│   ├── Packages
│   ├── Job Information
│   ├── FAQ
│   └── Testimonials
│
├── Client Management
│   ├── Client List
│   ├── Client Detail
│   └── Client History
│
├── Order Management
│   ├── Orders
│   ├── Order Detail
│   └── Vouchers
│
├── Payment Management
│   ├── Payment List
│   ├── Payment Verification
│   └── Payment History
│
├── Document Management
│   ├── Document List
│   └── Document Verification
│
├── Preparation Management
│   ├── Progress Tracking
│   ├── CV Review
│   ├── Interview Preparation
│   └── Application Assistance
│
├── Customer Support
│   ├── FAQ
│   ├── Chatbot Knowledge
│   └── Support Links
│
├── Notification Management
│
└── System Settings
    ├── Roles & Permissions
    ├── Payment Settings
    └── General Settings
```

---

## 5. Functional Requirements

### 5.1 Referral & Traffic Acquisition

| ID | Requirement | Priority |
| --- | --- | --- |
| FR-001 | Website menyediakan integrasi Instagram. | High |
| FR-002 | Website menyediakan CTA WhatsApp. | High |
| FR-003 | Sistem dapat menyimpan sumber referral ketika pengguna mendaftar. | Medium |
| FR-004 | Sistem mendukung UTM campaign tracking. | Medium |
| FR-005 | Website memiliki SEO metadata. | High |

### 5.2 Company Profile

| ID | Requirement | Priority |
| --- | --- | --- |
| FR-006 | Menampilkan profil Qatar Loker Info. | High |
| FR-007 | Menampilkan visi dan misi. | Medium |
| FR-008 | Menampilkan keunggulan layanan. | High |
| FR-009 | Administrator dapat mengubah konten melalui CMS. | High |

### 5.3 Job Information

Fitur ini hanya menyediakan informasi lowongan kerja dan edukasi, bukan sistem rekrutmen.

| ID | Requirement | Priority |
| --- | --- | --- |
| FR-010 | Menampilkan daftar informasi lowongan. | High |
| FR-011 | Menampilkan detail informasi lowongan. | High |
| FR-012 | Menyediakan kategori pekerjaan. | Medium |
| FR-013 | Menampilkan lokasi dan informasi perusahaan apabila tersedia dan terverifikasi. | High |
| FR-014 | Menampilkan sumber informasi dan tanggal publikasi. | High |
| FR-015 | Menampilkan tanggal kedaluwarsa informasi apabila tersedia. | Medium |
| FR-016 | Administrator dapat membuat, mengubah, dan menghapus informasi lowongan. | High |
| FR-017 | Informasi dapat diarsipkan jika sudah tidak berlaku. | High |

Informasi minimal:

- Job title.
- Company name.
- Location.
- Job description.
- Requirements.
- Salary (optional, jika terverifikasi).
- Source.
- Published date.
- Expiry date (optional).
- Status.

CTA diarahkan ke informasi konsultasi atau sumber lowongan asli, bukan klaim bahwa Qatar Loker Info merupakan pemberi kerja.

### 5.4 Services Management

Tiga layanan utama:

**A. CV Review**

- Pemeriksaan struktur CV.
- Evaluasi isi dan pengalaman.
- Rekomendasi perbaikan.
- Revisi CV sesuai ruang lingkup paket.

**B. Interview Preparation**

- Simulasi interview.
- Persiapan pertanyaan.
- Evaluasi jawaban.
- Pemeriksaan kemampuan bahasa Inggris sesuai layanan yang dipilih.

**C. Application Assistance**

- Konsultasi persyaratan aplikasi.
- Checklist dokumen.
- Pendampingan persiapan aplikasi.
- Panduan proses pengiriman lamaran.

| ID | Requirement | Priority |
| --- | --- | --- |
| FR-018 | Menampilkan daftar layanan. | High |
| FR-019 | Menampilkan detail layanan. | High |
| FR-020 | Administrator dapat mengelola layanan. | High |
| FR-021 | Layanan dapat dihubungkan dengan paket. | High |

### 5.5 Package Management

| ID | Requirement | Priority |
| --- | --- | --- |
| FR-022 | Menampilkan daftar paket konsultasi. | High |
| FR-023 | Menampilkan harga paket. | High |
| FR-024 | Menampilkan layanan yang termasuk dalam paket. | High |
| FR-025 | Administrator dapat membuat dan mengubah paket. | High |
| FR-026 | Paket dapat memiliki status aktif/nonaktif. | High |
| FR-027 | Paket dapat memiliki periode atau masa berlaku. | Medium |
| FR-028 | Sistem menyimpan harga paket saat transaksi dibuat. | High |

Harga dan layanan yang ditampilkan harus berasal dari konfigurasi CMS.

### 5.6 Registration & Authentication

| ID | Requirement | Priority |
| --- | --- | --- |
| FR-029 | Pengunjung dapat membuat akun. | High |
| FR-030 | Pengguna dapat login dan logout. | High |
| FR-031 | Pengguna dapat melakukan reset password. | High |
| FR-032 | Sistem membedakan role admin, CS, dan client. | High |
| FR-033 | Client hanya dapat mengakses data miliknya. | High |
| FR-034 | Sistem dapat memvalidasi data registrasi. | High |

Data registrasi minimal:

- Nama lengkap.
- Email.
- Nomor WhatsApp.
- Password.
- Persetujuan kebijakan privasi.

### 5.7 Order & Payment

Metode pembayaran menggunakan transfer manual.

Alur:

1. Client memilih paket.
2. Client mengisi data diri pada checkout. Akun belum dibuat pada tahap ini.
3. Sistem membuat order dan payment dengan status awal.
4. Sistem menampilkan instruksi pembayaran dari rekening admin yang aktif.
5. Client melakukan transfer.
6. Client mengunggah bukti transfer.
7. Admin memverifikasi pembayaran.
8. Sistem memperbarui status pembayaran dan order.
9. Sistem membuat akun client secara otomatis setelah pembayaran dikonfirmasi.
10. Client menerima tautan aktivasi untuk mengatur password.
11. Client masuk ke Client Portal.

Status order:

- Pending Payment.
- Waiting Verification.
- Paid.
- Cancelled.
- Expired (bila batas waktu pembayaran diaktifkan).

Status payment:

- Pending.
- Waiting Verification.
- Paid.
- Rejected.

Rekening tujuan dikelola admin melalui CMS pada menu **Pengaturan Pembayaran > Rekening Bank**. Hanya rekening aktif yang ditampilkan pada checkout. Setiap payment menyimpan snapshot nama bank, nomor rekening, dan nama pemilik agar riwayat tidak berubah ketika data rekening diperbarui atau dinonaktifkan.

| ID | Requirement | Priority |
| --- | --- | --- |
| FR-035 | Client dapat membuat order tanpa membuat akun terlebih dahulu. | High |
| FR-036 | Sistem membuat nomor order unik. | High |
| FR-037 | Sistem menampilkan instruksi transfer dari rekening aktif. | High |
| FR-038 | Client dapat mengunggah bukti pembayaran. | High |
| FR-039 | Admin dapat memverifikasi pembayaran. | High |
| FR-040 | Admin dapat menolak bukti pembayaran dengan alasan. | High |
| FR-041 | Sistem mencatat waktu dan petugas verifikasi. | High |
| FR-042 | Sistem mengirim notifikasi perubahan status. | High |
| FR-043 | Riwayat transaksi dapat diakses oleh client. | High |
| FR-053 | Sistem membuat akun client otomatis setelah pembayaran dikonfirmasi. | High |
| FR-054 | Sistem mengirim tautan aktivasi password sekali pakai. | High |
| FR-055 | Admin dapat mengelola rekening tujuan transfer manual. | High |

Tidak ada integrasi payment gateway dalam MVP. Nominal akhir selalu dihitung di backend dan harga paket disimpan sebagai snapshot pada order.

Voucher diskon dikelola admin melalui CMS. Customer dapat memasukkan kode voucher pada checkout. Backend memvalidasi status aktif, periode berlaku, minimal belanja, dan batas kuota, lalu menghitung diskon. Diskon yang tersimpan pada order adalah hasil hitung backend, bukan nilai dari frontend.

| ID | Requirement | Priority |
| --- | --- | --- |
| FR-056 | Admin dapat membuat, mengubah, menonaktifkan, dan menghapus voucher. | High |
| FR-057 | Voucher mendukung diskon nominal tetap dan persentase dengan batas maksimal. | High |
| FR-058 | Voucher memiliki periode berlaku, minimal belanja, dan batas kuota opsional. | High |
| FR-059 | Backend memvalidasi dan menghitung diskon voucher saat checkout. | High |
| FR-060 | Kode dan nominal diskon disimpan sebagai snapshot pada order. | High |

### 5.8 Client Portal

| ID | Requirement | Priority |
| --- | --- | --- |
| FR-044 | Client dapat melihat dashboard. | High |
| FR-045 | Client dapat mengubah informasi profil. | High |
| FR-046 | Client dapat melihat paket yang dibeli. | High |
| FR-047 | Client dapat melihat riwayat order. | High |
| FR-048 | Client dapat melihat status pembayaran. | High |
| FR-049 | Client dapat mengunggah dokumen. | High |
| FR-050 | Client dapat melihat progres pendampingan. | High |
| FR-051 | Client dapat menerima notifikasi. | High |
| FR-052 | Client dapat menghubungi Customer Service. | High |

### 5.9 Document Management

Jenis dokumen:

- Curriculum Vitae.
- Passport (jika diperlukan).
- Certificate.
- Education Documents.
- Supporting Documents.

Status dokumen:

- Not Submitted.
- Submitted.
- Under Review.
- Revision Required.
- Approved.

Persyaratan:

- Upload file PDF, JPG, dan PNG.
- Validasi ukuran dan tipe file.
- File hanya dapat diakses oleh pihak berwenang.
- Client dapat melihat status dokumen.
- Admin/CS dapat memberikan catatan revisi.

### 5.10 Preparation Progress

Progres merupakan status pendampingan internal, bukan status seleksi resmi perusahaan.

Status:

1. Registered.
2. Waiting Payment.
3. Payment Confirmed.
4. Document Preparation.
5. CV Review.
6. Interview Preparation.
7. Application Assistance.
8. Completed.

Admin atau CS dapat:

- Memperbarui status.
- Menambahkan catatan progres.
- Menentukan tanggal pembaruan.
- Memberikan informasi kepada client.

### 5.11 FAQ & CS Bot

FAQ menjadi sumber informasi utama chatbot.

Kategori:

- General Information.
- Working in Qatar.
- Requirements & Documents.
- CV & Interview.
- English Preparation.
- Services & Packages.
- Payment.
- Client Portal.

Persyaratan:

- Admin dapat mengelola FAQ.
- FAQ dapat dicari.
- Chatbot tersedia di website.
- Chatbot menyediakan pertanyaan umum.
- Chatbot hanya menjawab berdasarkan knowledge base yang disediakan.
- Bot dapat mengarahkan pengguna ke CS personal.
- Bot harus memberikan fallback jika tidak menemukan jawaban.

MVP menggunakan chatbot berbasis FAQ/rule-based atau retrieval sederhana. Implementasi AI RAG tidak menjadi persyaratan wajib.

### 5.12 Notification

Notifikasi untuk:

- Registrasi berhasil.
- Order berhasil dibuat.
- Bukti pembayaran diterima.
- Pembayaran diverifikasi.
- Pembayaran ditolak.
- Dokumen perlu direvisi.
- Progres pendampingan berubah.
- Layanan selesai.

Channel MVP:

- Notification di Client Portal.
- Email apabila layanan email telah dikonfigurasi.
- WhatsApp melalui komunikasi CS atau integrasi yang tersedia.

Catatan implementasi: layanan email belum dikonfigurasi. Tautan aktivasi password dibuat oleh admin melalui CMS dan ditampilkan satu kali, serta dicatat melalui titik integrasi notifikasi. Konfigurasi SMTP atau penyedia email diperlukan untuk pengiriman otomatis.

---

## 6. User Flow

### 6.1 Visitor to Client

```text
Instagram / Referral / Google
          |
          v
     Public Website
          |
          v
    Explore Services
          |
          v
    View Packages
          |
          v
   Select a Package
          |
          v
   Fill Checkout Data
   (name, email, phone)
          |
          v
   Create Order
   (no account yet)
          |
          v
   Payment Instructions
          |
          v
    Manual Transfer
          |
          v
 Upload Payment Proof
          |
          v
   Admin Verification
          |
          v
    Payment Confirmed
          |
          v
  Account Auto-Provisioned
          |
          v
  Password Setup Link
          |
          v
     Client Login
          |
          v
     Client Portal
```

### 6.2 Manual Payment Flow

```text
Visitor
  |
  v
Fill Customer Data
  |
  v
Create Order
  |
  v
Generate Order Number
  |
  v
Show Active Bank Account
  |
  v
Transfer Payment
  |
  v
Upload Payment Proof
  |
  v
Admin Reviews Payment
  |
  +---- Rejected
  |       |
  |       v
  |   Provide Reason
  |       |
  |       v
  |   Client Re-uploads
  |
  +---- Verified
          |
          v
    Order Status = Paid
          |
          v
    Provision Client Account
          |
          v
    Send Password Setup Link
          |
          v
    Notify Customer
```

### 6.3 Document Submission Flow

```text
Client Login
    |
    v
Open My Documents
    |
    v
Select Document Type
    |
    v
Upload Document
    |
    v
Admin / CS Review
    |
    +---- Revision Required
    |          |
    |          v
    |     Client Revises
    |          |
    |          v
    |       Re-upload
    |
    +---- Approved
               |
               v
        Document Completed
```

### 6.4 Preparation Progress Flow

```text
Payment Confirmed
       |
       v
Document Preparation
       |
       v
     CV Review
       |
       v
Interview Preparation
       |
       v
Application Assistance
       |
       v
    Completed
```

Administrator dapat memperbarui progres sesuai layanan yang dibeli. Tahapan yang tidak termasuk dalam paket tidak harus dijalankan.

### 6.5 CS Bot Flow

```text
Visitor
   |
   v
Open CS Bot
   |
   v
Select / Type Question
   |
   v
Search FAQ Knowledge Base
   |
   +---- Answer Found
   |         |
   |         v
   |    Show Answer
   |
   +---- No Answer
             |
             v
       Offer WhatsApp
             |
             v
       Human Support
```

---

## 7. Admin Roles & Permissions

| Module | Super Admin | Admin | CS | Finance |
| --- | --- | --- | --- | --- |
| Dashboard | Full | View | View | View |
| User Management | Full | Manage | View | - |
| Company Profile | Full | Manage | - | - |
| Services | Full | Manage | View | - |
| Packages | Full | Manage | View | - |
| Job Information | Full | Manage | - | - |
| FAQ | Full | Manage | View | - |
| Clients | Full | Manage | Manage | View |
| Orders | Full | Manage | View | View |
| Payments | Full | View | View | Manage |
| Documents | Full | Manage | Manage | - |
| Progress | Full | Manage | Manage | - |
| Notifications | Full | Manage | View | View |
| Settings | Full | Limited | - | - |

Semua tindakan yang bersifat sensitif harus dibatasi berdasarkan permission dan dicatat melalui audit log.

---

## 8. High-Level Database Design

### 8.1 Core Entities

| Table | Purpose |
| --- | --- |
| users | Akun autentikasi |
| roles | Definisi role |
| permissions | Definisi permission |
| user_roles | Relasi user dan role |
| clients | Profil tambahan klien |
| services | Master layanan |
| packages | Master paket |
| package_services | Relasi paket dan layanan |
| job_information | Informasi lowongan |
| job_categories | Kategori informasi pekerjaan |
| faqs | Pertanyaan umum |
| testimonials | Testimoni |
| leads | Calon klien |
| orders | Pesanan layanan |
| order_items | Detail layanan/paket pesanan |
| payments | Pembayaran |
| payment_accounts | Rekening bank tujuan transfer manual |
| vouchers | Kode diskon untuk checkout |
| documents | Dokumen klien |
| preparation_progress | Progres pendampingan |
| progress_logs | Riwayat perubahan progres |
| notifications | Notifikasi |
| chatbot_knowledge | Knowledge base chatbot |
| referrals | Sumber referral |
| audit_logs | Catatan aktivitas penting |

### 8.2 Important Relationships

- User memiliki satu profil client jika role-nya client.
- User dapat memiliki lebih dari satu role sesuai kebutuhan.
- Package memiliki banyak Service melalui package_services.
- Client dapat memiliki banyak Order.
- Order memiliki satu atau lebih Order Items.
- Order dapat memiliki beberapa catatan pembayaran jika terjadi pengajuan ulang.
- Client dapat memiliki banyak Document.
- Order dapat memiliki banyak Progress Logs.
- User dapat memiliki banyak Notifications.

### 8.3 Important Data Rules

1. Harga dan nama paket harus disimpan sebagai snapshot ketika order dibuat.
2. Perubahan harga paket tidak boleh mengubah transaksi lama.
3. Bukti pembayaran harus menyimpan referensi file yang aman.
4. Setiap verifikasi pembayaran harus mencatat admin, waktu, dan hasilnya.
5. Dokumen pribadi harus memiliki kontrol akses.
6. Semua perubahan status order dan progress harus memiliki riwayat.
7. Order menyimpan data pelanggan secara terpisah dari akun user.
8. `orders.user_id` boleh kosong sampai pembayaran dikonfirmasi dan akun dibuat.
9. Payment menyimpan snapshot rekening tujuan agar riwayat tetap utuh ketika rekening diubah atau dinonaktifkan.
10. Pembuatan akun harus idempoten. Konfirmasi pembayaran berulang tidak boleh membuat akun atau profil client ganda.
11. Status provisioning akun dicatat terpisah dari status pembayaran agar kegagalan pembuatan akun tidak membatalkan pembayaran yang sudah sah.
12. Nominal pembayaran tidak pernah dipercaya dari frontend; backend menghitung ulang dari harga paket.
13. Voucher harus divalidasi ulang di backend saat order dibuat, termasuk kuota pemakaian.
14. Kode voucher dan nominal diskon disimpan pada order sebagai snapshot riwayat.

---

## 9. Non-Functional Requirements

| Category | Requirement |
| --- | --- |
| Responsive | Mobile-first, tablet, desktop |
| Performance | Target LCP ≤ 2,5 detik |
| Security | HTTPS, secure password hashing |
| Authorization | Role-based access control |
| Privacy | Perlindungan data pribadi |
| File Security | Validasi MIME, ukuran, dan akses dokumen |
| SEO | Sitemap, metadata, structured data |
| Availability | Monitoring dan backup |
| Maintainability | CMS-based content management |
| Auditability | Audit log untuk aktivitas sensitif |
| Accessibility | Navigasi keyboard dan kontras yang memadai |

### Data Protection

Data seperti KTP, paspor, CV, dan dokumen pendukung termasuk data yang membutuhkan perlindungan khusus.

Ketentuan:

- Data hanya dikumpulkan sesuai kebutuhan layanan.
- Pengguna harus menyetujui kebijakan privasi.
- Dokumen tidak boleh tersedia melalui URL publik.
- Akses dokumen harus melalui otorisasi.
- Retensi dan penghapusan dokumen harus memiliki kebijakan yang jelas.

---

## 10. UI/UX Design Direction

### 10.1 Design Concept

**Professional, Trustworthy, Modern, International.**

Website harus terlihat profesional dan terpercaya, tetapi tetap mudah dipahami oleh pengguna umum.

### 10.2 Color Palette

| Color | Hex | Usage |
| --- | --- | --- |
| Navy | #10243A | Primary |
| Gold | #C9A45C | Accent |
| White | #FFFFFF | Background |
| Off White | #F7F6F2 | Secondary Background |
| Dark | #1C2733 | Text |

### 10.3 Homepage Structure

Urutan section:

1. Navbar dan Hero.
2. Trust Indicators.
3. About Qatar Loker Info.
4. Why Choose Us.
5. Our Services.
6. Our Packages.
7. How It Works.
8. Latest Job Information.
9. Testimonials.
10. FAQ.
11. CTA.
12. Footer.
13. Floating WhatsApp / CS Bot.

### 10.4 Client Portal Design

Dashboard harus fokus pada aktivitas klien.

Komponen utama:

- Greeting dan profile summary.
- Active package.
- Payment status.
- Document completion.
- Preparation progress.
- Latest notifications.
- Contact support.

### 10.5 Admin CMS Design

Dashboard harus fokus pada operasional.

Komponen utama:

- Total clients.
- New registrations.
- Pending payments.
- Verified payments.
- Active orders.
- Documents awaiting review.
- Recent activities.

---

## 11. Development Priority & Roadmap

### Phase 1 — MVP

Seluruh fitur berikut merupakan scope wajib peluncuran pertama.

| Module | Scope | Priority |
| --- | --- | --- |
| Public Website | Homepage, About, Services, Packages, Contact | Must Have |
| Job Information | Listing dan detail informasi lowongan | Must Have |
| CMS | Content dan master data management | Must Have |
| Authentication | Login, register, reset password | Must Have |
| Client Portal | Dashboard dan profil klien | Must Have |
| Orders | Pemilihan paket dan invoice | Must Have |
| Payment | Transfer manual dan verifikasi | Must Have |
| Documents | Upload dan review dokumen | Must Have |
| Progress | Status pendampingan | Must Have |
| FAQ | FAQ management dan public FAQ | Must Have |
| CS Bot | FAQ-based chatbot | Should Have |
| Notifications | In-app notifications | Must Have |
| SEO | Basic technical SEO | Must Have |

### Phase 2 — Enhancement

- AI chatbot berbasis RAG.
- Payment gateway.
- WhatsApp Business API.
- Advanced analytics.
- Automated email campaigns.
- Advanced referral tracking.
- Document version history.
- Appointment scheduling.
- Client support ticket system.

### Phase 3 — Expansion

- Job listing integration.
- Employer/company partnerships.
- Advanced career preparation tools.
- Multi-country expansion.
- Advanced business intelligence.

---

## 12. Success Metrics (KPI)

| Metric | Definition |
| --- | --- |
| Website Visitors | Jumlah pengunjung website |
| Registration Conversion | Registrasi dibanding pengunjung |
| Order Conversion | Order dibanding registrasi |
| Payment Conversion | Order yang berhasil dibayar |
| FAQ Resolution | Pertanyaan yang dijawab FAQ/bot |
| CS Escalation Rate | Pertanyaan yang dialihkan ke CS |
| Document Completion | Kelengkapan dokumen klien |
| Service Completion | Layanan yang selesai diproses |

Target numerik ditentukan setelah memperoleh baseline dari penggunaan website.

---

## 13. Business Rules

1. Pengunjung dapat mengakses seluruh informasi publik tanpa login.
2. Pengunjung dapat membuat pesanan paket tanpa membuat akun terlebih dahulu.
3. Akun client dibuat otomatis setelah pembayaran diverifikasi admin.
4. Setiap order memiliki nomor order unik.
5. Pembayaran dilakukan melalui transfer manual ke rekening yang dikelola admin.
6. Pembayaran baru dianggap sah setelah diverifikasi oleh petugas berwenang.
7. Client dapat melihat status pembayaran dan riwayat order.
8. Client hanya dapat melihat dan mengelola dokumen miliknya.
9. Admin dan CS hanya dapat mengakses modul sesuai permission.
10. Progres pendampingan mengikuti layanan yang dibeli.
11. Informasi lowongan harus memiliki sumber yang dapat diverifikasi.
12. Informasi lowongan yang kedaluwarsa harus diarsipkan.
13. Pembelian layanan tidak menjamin diterima bekerja atau memperoleh visa kerja.
14. Layanan konsultasi tidak boleh dipresentasikan sebagai layanan penempatan resmi apabila tidak memiliki kewenangan atau perizinan yang diperlukan.
15. Email yang sudah terdaftar tidak boleh ditautkan otomatis ke order tanpa verifikasi admin.

---

## 14. Acceptance Criteria (MVP)

Produk dinyatakan siap diluncurkan apabila:

### Public Website

- [ ] Seluruh halaman publik dapat diakses.
- [ ] Website responsif pada perangkat mobile.
- [ ] Informasi perusahaan dan layanan dapat dikelola melalui CMS.
- [ ] Informasi lowongan memiliki sumber dan tanggal publikasi.
- [ ] FAQ dapat ditampilkan dan dicari.
- [ ] CTA WhatsApp berfungsi.

### CMS

- [ ] Admin dapat login.
- [ ] Role dan permission berjalan.
- [ ] Admin dapat mengelola layanan dan paket.
- [ ] Admin dapat mengelola klien.
- [ ] Admin dapat mengelola order.
- [ ] Finance dapat memverifikasi pembayaran.
- [ ] Admin/CS dapat memproses dokumen dan progres.

### Client Portal

- [ ] Client dapat register dan login.
- [ ] Client dapat melihat dashboard.
- [ ] Client dapat melihat pesanan yang terhubung dengan akunnya.
- [ ] Client dapat melihat instruksi pembayaran dan status pembayaran.
- [ ] Client dapat mengunggah bukti transfer.
- [ ] Client dapat mengunggah dokumen.
- [ ] Client dapat memantau progres.
- [ ] Client menerima notifikasi.

### Order & Account Provisioning

- [ ] Pesanan dapat dibuat tanpa akun.
- [ ] Admin dapat mengelola rekening bank.
- [ ] Admin dapat memverifikasi atau menolak bukti pembayaran.
- [ ] Akun client dibuat otomatis setelah pembayaran dikonfirmasi.
- [ ] Tautan aktivasi password sekali pakai dapat dibuat dan dikirim.
- [ ] Konfirmasi pembayaran berulang tidak membuat akun ganda.
- [ ] Email yang sudah terdaftar tidak ditautkan otomatis tanpa verifikasi admin.

### Security

- [ ] Client tidak dapat mengakses data klien lain.
- [ ] File pribadi tidak dapat diakses secara publik.
- [ ] Hak akses admin berjalan sesuai role.
- [ ] Perubahan pembayaran memiliki audit log.
- [ ] Validasi input dan upload file berjalan.

---

## 15. Product Constraints & Assumptions

1. Website hanya menggunakan Bahasa Indonesia untuk MVP.
2. Tidak ada job application engine.
3. Tidak ada employer portal.
4. Tidak ada integrasi payment gateway.
5. Pembayaran menggunakan transfer manual.
6. Informasi lowongan dikelola oleh administrator.
7. Client Portal merupakan bagian dari MVP.
8. CS Bot menggunakan FAQ/knowledge base sebagai sumber jawaban.
9. Pengelolaan konsultasi dan pendampingan dilakukan oleh tim internal.
10. Integrasi WhatsApp otomatis dan AI RAG merupakan pengembangan berikutnya.

---

## 16. Reference & Compliance

### Product References

- Instagram: <https://www.instagram.com/qatarlokerinfo/>
- SMART-PMI: <https://smart-pmi.kp2mi.go.id/>
- SISKOP2MI: <https://siskop2mi.bp2mi.go.id/>

### Regulatory Considerations

Pengembangan dan operasional platform perlu memperhatikan:

- Undang-Undang Nomor 18 Tahun 2017 tentang Pelindungan Pekerja Migran Indonesia beserta perubahannya dan aturan pelaksanaannya.
- Undang-Undang Nomor 27 Tahun 2022 tentang Pelindungan Data Pribadi.
- Ketentuan perizinan dan kewenangan penyelenggaraan layanan penempatan pekerja migran.
- Ketentuan perlindungan konsumen dan transparansi biaya layanan.

Model konsultasi harus dipisahkan secara jelas dari aktivitas perekrutan dan penempatan tenaga kerja. Jika kegiatan bisnis berkembang menjadi penempatan, aspek perizinan dan legalitas perlu ditinjau terlebih dahulu.

---

## 17. Final Product Definition

Qatar Loker Info MVP terdiri dari tiga aplikasi yang terintegrasi:

| Application | Purpose |
| --- | --- |
| Public Website | Informasi, edukasi, dan lead generation |
| Admin CMS | Pengelolaan konten dan operasional bisnis |
| Client Portal | Pendaftaran, pembayaran, dokumen, dan progres layanan |

**Core User Journey:**

Visitor → Explore Information → Choose Package → Register → Create Order → Manual Payment → Payment Verification → Document Submission → Preparation Process → Service Completed.

**Product Success Definition:**

Qatar Loker Info berhasil mencapai tujuan MVP ketika calon klien dapat menemukan informasi, memahami layanan, melakukan pendaftaran, menyelesaikan pembayaran, dan memantau proses pendampingan secara mandiri melalui satu platform, sementara tim internal dapat mengelola seluruh aktivitas tersebut melalui CMS.

**END OF DOCUMENT**
