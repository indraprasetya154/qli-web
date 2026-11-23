function isMaskedDateValue(value: string): boolean {
  // Anggap nilai masking jika memuat karakter masker umum.
  return /[*xX•#]/.test(value);
}

function parseDateValue(value?: string | null): Date | null {
  if (!value) return null;
  const trimmed = value.trim();
  if (!trimmed) return null;
  if (isMaskedDateValue(trimmed)) return null;
  const date = new Date(trimmed);
  if (Number.isNaN(date.getTime())) return null;
  return date;
}

export function formatDateDmy(
  value?: string | null,
  fallback = "-",
  separator = "-",
): string {
  const date = parseDateValue(value);
  if (!date) return fallback;
  const dd = String(date.getDate()).padStart(2, "0");
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const yyyy = String(date.getFullYear());
  return `${dd}${separator}${mm}${separator}${yyyy}`;
}

export function formatDateTimeDmyHm(
  value?: string | null,
  fallback = "-",
  dateSeparator = ":",
): string {
  const date = parseDateValue(value);
  if (!date) return fallback;
  const dd = String(date.getDate()).padStart(2, "0");
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const yyyy = String(date.getFullYear());
  const hh = String(date.getHours()).padStart(2, "0");
  const min = String(date.getMinutes()).padStart(2, "0");
  return `${dd}${dateSeparator}${mm}${dateSeparator}${yyyy} - ${hh}:${min}`;
}

/** Tanggal-waktu lokal: `dd-mm-yyyy hh:mm:ss` (konvensi mirip PHP `d-m-Y H:i:s`). */
export function formatDateTimeDmyHms(
  value?: string | null,
  fallback = "-",
): string {
  const date = parseDateValue(value);
  if (!date) return fallback;
  const dd = String(date.getDate()).padStart(2, "0");
  const mo = String(date.getMonth() + 1).padStart(2, "0");
  const yyyy = String(date.getFullYear());
  const hh = String(date.getHours()).padStart(2, "0");
  const ii = String(date.getMinutes()).padStart(2, "0");
  const ss = String(date.getSeconds()).padStart(2, "0");
  return `${dd}-${mo}-${yyyy} ${hh}:${ii}:${ss}`;
}

/** Tanggal panjang bahasa Indonesia (WIB): `Jumat, 9 Mei 2026`. */
export function formatDateIdLongWib(value?: string | null, fallback = "-"): string {
  const date = parseDateValue(value);
  if (!date) return fallback;
  return new Intl.DateTimeFormat("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "Asia/Jakarta",
  }).format(date);
}

/** Jam WIB: `08:47:36 WIB`. */
export function formatTimeHmsWib(value?: string | null, fallback = "-"): string {
  const date = parseDateValue(value);
  if (!date) return fallback;
  const hms = new Intl.DateTimeFormat("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
    timeZone: "Asia/Jakarta",
  }).format(date);
  return `${hms} WIB`;
}

/** Tanggal ringkas bahasa Indonesia (WIB): `09 Mei 2026`. */
export function formatDateIdDmyLongMonthWib(
  value?: string | null,
  fallback = "-",
): string {
  const date = parseDateValue(value);
  if (!date) return fallback;
  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    timeZone: "Asia/Jakarta",
  }).format(date);
}

/** Jam WIB tanpa suffix: `08:47:36`. */
export function formatTimeHmsWibPlain(
  value?: string | null,
  fallback = "-",
): string {
  const date = parseDateValue(value);
  if (!date) return fallback;
  return new Intl.DateTimeFormat("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
    timeZone: "Asia/Jakarta",
  }).format(date);
}

/** Relative time bahasa Indonesia: `2 menit lalu`, `3 jam lalu`, dst. */
export function formatRelativeTimeId(
  value?: string | null,
  fallback = "-",
): string {
  const date = parseDateValue(value);
  if (!date) return fallback;
  const diffMs = Date.now() - date.getTime();
  if (!Number.isFinite(diffMs)) return fallback;

  const diffSec = Math.floor(diffMs / 1000);
  if (diffSec < 10) return "baru saja";
  if (diffSec < 60) return `${diffSec} detik lalu`;

  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `${diffMin} menit lalu`;

  const diffHour = Math.floor(diffMin / 60);
  if (diffHour < 24) return `${diffHour} jam lalu`;

  const diffDay = Math.floor(diffHour / 24);
  if (diffDay < 7) return `${diffDay} hari lalu`;

  const diffWeek = Math.floor(diffDay / 7);
  if (diffWeek < 4) return `${diffWeek} minggu lalu`;

  const diffMonth = Math.floor(diffDay / 30);
  if (diffMonth < 12) return `${diffMonth} bulan lalu`;

  const diffYear = Math.floor(diffDay / 365);
  return `${diffYear} tahun lalu`;
}
