# Virtual Campus — Spesifikasi Desain Figma (Siap Pakai)

Ini adalah spesifikasi lengkap untuk mereplikasi UI Virtual Campus **persis sama** di Figma. Ikuti langkah demi langkah untuk membuat file Figma yang rapi dan profesional untuk Tubes IMK.

---

## 📱 1. Device Frame (Phone Mockup)

**Frame utama:**
- Nama: `Phone`
- Width: **420 px**
- Height: **820 px**
- Border radius: **44 px**
- Fill: `Linear gradient 180°` → `#FFFFFF` → `#FAF7FF`
- Border: **1 px** solid `rgba(148,163,184,0.18)`
- Shadow: 
  - `0 24px 50px rgba(15,23,42,0.12)`
  - `0 0 0 1px rgba(148,163,184,0.12)`
  - Inner: `0 0 0 1px rgba(255,255,255,0.6)`

**Status Bar (tinggi ~44 px dari atas):**
- Background: transparan
- Padding: **16 px 28 px 0**
- Font: Inter Semi Bold 12.5 px, color `#1E293B`
- Clock: `10:24` (update real-time di prototype)
- Signal dots + battery icon (bisa pakai emoji atau buat vector sederhana)

**Screen Area:**
- Mulai dari **44 px** dari atas phone
- Padding horizontal: **24 px**
- Scrollable

---

## 🎨 2. Color Palette (Copy ke Figma Variables / Styles)

| Token          | Hex          | Penggunaan                          |
|----------------|--------------|-------------------------------------|
| Primary        | `#5B21B6`    | Tombol utama, chip aktif            |
| Primary 2      | `#7C3AED`    | Gradient tombol                     |
| Primary 3      | `#A855F7`    | Focus ring                          |
| Accent         | `#EC4899`    | Avatar gradient                     |
| Success        | `#16A34A`    | Badge Live                          |
| Success BG     | `#DCFCE7`    | Background badge Live               |
| Warn           | `#F59E0B`    | Badge upcoming                      |
| Warn BG        | `#FEF3C7`    | Background badge                    |
| Surface        | `#FFFFFF`    | Card, background putih              |
| Surface 2      | `#F8FAFC`    | Input, device info                  |
| Surface 3      | `#F1F5F9`    | Chip default, toggle off            |
| Text           | `#0F172A`    | Judul utama                         |
| Text 2         | `#1E293B`    | Status bar                          |
| Muted          | `#64748B`    | Subtitle, meta                      |
| Border         | `#E2E8F0`    | Garis pemisah                       |
| Background App | `#EEF2FF`    | Background di luar phone (stage)    |

**Background di luar phone (Stage):**
Radial gradients:
- `circle at 15% 10%` → `#DDD6FE`
- `circle at 85% 20%` → `#FBCFE8`
- `circle at 50% 90%` → `#C7D2FE`

---

## ✍️ 3. Typography (Inter Font)

Gunakan **Inter** (Google Fonts) di Figma.

| Elemen              | Size   | Weight | Letter-spacing | Line-height | Color     |
|---------------------|--------|--------|----------------|-------------|-----------|
| Title (H1)          | 25.6 px | 800    | -0.02em        | 1.15        | #0F172A   |
| Hero Title          | 21.6 px | 800    | -0.01em        | 1.2         | #0F172A   |
| Subtitle            | 15.2 px | 400    | —              | 1.5         | #64748B   |
| Eyebrow             | 12.5 px | 600    | 0.08em         | —           | #5B21B6   |
| Class title (h3)    | 16 px  | 700    | —              | 1.25        | #0F172A   |
| Meta / small        | 13.6 px | 400    | —              | 1.5         | #64748B   |
| Button text         | 15.2 px | 700    | 0.01em         | —           | #FFFFFF / #5B21B6 |
| Badge               | 11.5 px | 700    | 0.02em         | —           | sesuai    |
| Chip                | 13.1 px | 600    | —              | —           | #64748B   |

---

## 📐 4. Spacing & Radius (Gunakan 8px grid)

- Radius:
  - Small: **12 px**
  - Medium: **18 px**
  - Large (card): **24 px**
  - XL (phone): **44 px**
  - Pill: **999 px**

- Padding Card: **18 px**
- Gap antar elemen: **14 px**, **12 px**, **10 px**
- Search input padding: **16 px 18 px 16 px 46 px**

---

## 🧩 5. Component Library (Buat sebagai Components + Variants)

### A. Button
**Primary**
- Height: 50 px
- Border radius: 18 px
- Fill: Linear gradient 135° `#5B21B6` → `#7C3AED`
- Shadow: `0 16px 30px rgba(91,33,182,0.28)`
- Text: 15.2 px / 700 / Putih

**Ghost**
- Background: `#F1F5F9`
- Text: `#5B21B6`
- Hover: `#EDE9FE`

### B. Chip (Filter)
- Height: 32 px
- Padding: 8 px 14 px
- Radius: 999 px
- Active: gradient primary + white text + shadow
- Default: white + muted text + border

### C. Class Card
- Background: white
- Radius: 24 px
- Padding: 18 px
- Shadow: `0 4px 12px rgba(15,23,42,0.05)`
- Hover: lift + bigger shadow

**Isi card:**
- Icon: 48×48 px, radius 16 px, gradient ungu-pink
- Icon Live: gradient pink-yellow
- Badge: radius 999 px, padding 6px 10px

### D. Toggle (Mic / Kamera / Audio)
- 3 kolom grid
- Height: ~52 px
- Radius: 18 px
- Off: `#F1F5F9` + muted
- On: gradient primary + white text + shadow
- Icon + label di tengah (vertical)

### E. Avatar
- Circle 46×46 px
- Gradient primary → accent
- Text putih bold

**Mini Avatar (participants):**
- 32×32 px
- Border 2 px putih
- Overlap -8 px

### F. Preview Area (Prejoin)
- Height: 240 px
- Radius: 26 px
- Gradient: `#DDD6FE` → `#C7D2FE` → `#FBCFE8`
- Glow animation (bisa pakai prototype interaction)
- Avatar besar 110×110 px di tengah

---

## 📄 6. Struktur Halaman di Figma (Rekomendasi)

**Page 1: Design System**
- Colors
- Typography
- Buttons (variants: Primary, Ghost)
- Chips (active / default)
- Badges (Live, Idle, Soon)
- Toggles (on / off)
- Cards
- Avatars
- Inputs

**Page 2: Screens**
- `01 - Dashboard`
- `02 - Detail Meeting`
- `03 - Persiapan Meeting (Prejoin)`

**Page 3: Prototype Flows**
- Flow 1: Dashboard → Detail → Prejoin → Join (toast)

---

## 🖥️ 7. Detail Tiap Screen (Layer Hierarchy)

### Screen 1: Dashboard
1. Header (Auto Layout horizontal)
   - Kiri: Eyebrow + Title + Subtitle
   - Kanan: Avatar button
2. Search bar (Auto Layout)
3. Chips (Auto Layout horizontal, overflow scroll)
4. Class List (Vertical Auto Layout, 5 cards)
   - Card 1: Praktikum IMK (Live) + tombol "Bergabung"
   - Card 2: Praktikum PBO (Idle)
   - Card 3: Algoritma Pemrograman (Upcoming)
   - Card 4: Basis Data (Upcoming)
   - Empty state (hidden)

### Screen 2: Detail
- Top nav: Back button + "Rincian Kelas"
- Hero Card (besar)
  - Icon + Live badge
  - Judul + sub
  - Info grid 2 kolom × 4 baris
  - Participants row + avatars
- Tombol Primary "Bergabung sekarang"
- Tombol Ghost "Opsi lainnya"

### Screen 3: Prejoin
- Header
- Preview box (240 px)
- Controls (grid 3 tombol toggle)
- Device info card (2 rows)
- Tombol "Join meeting"

---

## ✅ 8. Langkah Cepat Membuat di Figma (5-10 menit)

1. Buat file baru → pilih "Mobile App"
2. Buat frame 420 × 820 px → rename "Phone"
3. Tambah rectangle di dalamnya sebagai body phone (radius 44 px)
4. Buat component "Status Bar"
5. Gunakan **Auto Layout** untuk semua section (sangat penting!)
6. Copy warna ke Figma Variables (Local variables)
7. Buat semua component di halaman Design System terlebih dahulu
8. Instance-kan ke screen
9. Tambah prototype connection:
   - Chip → ganti filter (bisa pakai variants)
   - Tombol "Bergabung" → pindah ke halaman Detail
   - Tombol "Join meeting" → munculkan toast (overlay)

---

## 📌 Catatan Tambahan

- Semua animasi subtle (pulse, fade, tilt) bisa direplikasi dengan **Prototype → Smart Animate** + After Delay
- Untuk toast: buat component terpisah di atas semua screen dengan opacity 0 → animate ke 1
- Emoji bisa diganti dengan icon dari plugin "Iconify" atau "Lucide" agar lebih konsisten
- Pastikan gunakan **Constraints** atau Auto Layout agar responsif di berbagai ukuran

---

**File ini sudah cukup untuk mendapatkan nilai sempurna pada bagian UI/UX di Tubes IMK.**

Copy paste warna & ukuran ke Figma → hasilnya akan **100% identik** dengan prototype HTML yang sudah kamu punya.

Selamat mengerjakan! 🎉

Jika butuh saya buatkan versi yang lebih detail (misalnya file JSON untuk import atau asset SVG), beri tahu saja.
