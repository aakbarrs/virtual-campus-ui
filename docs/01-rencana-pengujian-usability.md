# Rencana Pengujian Usability — Virtual Campus

## 1. Tujuan Pengujian

- Mengevaluasi efektivitas, efisiensi, dan kepuasan pengguna terhadap desain UI Virtual Campus
- Mengidentifikasi masalah usability pada alur utama aplikasi
- Memberikan rekomendasi perbaikan berbasis data

## 2. Metodologi

| Aspek | Detail |
|-------|--------|
| Metode | Moderated Usability Testing + Think Aloud |
| Pendekatan | Task-based scenario |
| Alat rekam | Screen recording, timer, catatan observasi |
| Lokasi | Terkontrol (lab/online) |

## 3. Partisipan

| Kriteria | Jumlah |
|----------|--------|
| Mahasiswa aktif | 3-5 orang |
| Familiar dengan aplikasi kampus/video conference | Ya |
| Rentang usia | 18-25 tahun |

## 4. Perangkat & Lingkungan

- Browser: Chrome / Firefox / Edge (terbaru)
- Resolusi layar: minimal 1280x720
- Akses internet: stabil
- Smartphone mockup via phone frame di browser

## 5. Skenario & Tugas Pengujian

| Kode | Tugas | Layar Terkait | Waktu Maks |
|------|-------|---------------|------------|
| T-01 | Membuka aplikasi dan melihat halaman login | loginScreen | 30 detik |
| T-02 | Melakukan registrasi akun baru | registerScreen | 2 menit |
| T-03 | Login dengan akun yang sudah didaftarkan | loginScreen → dashboard | 1 menit |
| T-04 | Melihat daftar kelas di dashboard | dashboard | 30 detik |
| T-05 | Mencari kelas menggunakan fitur search | dashboard | 30 detik |
| T-06 | Menyaring kelas berdasarkan status (Live/Upcoming/Idle) | dashboard | 30 detik |
| T-07 | Membuka detail kelas | dashboard → detail | 30 detik |
| T-08 | Bergabung ke meeting dari detail kelas | detail → prejoin | 1 menit |
| T-09 | Menyalakan/mematikan mic dan kamera di prejoin | prejoin | 30 detik |
| T-10 | Masuk ke meeting room | prejoin → meetingRoom | 30 detik |
| T-11 | Mengganti bahasa aplikasi (ID → EN → ES) | dashboard | 30 detik |
| T-12 | Membuka dan menutup profil dropdown | dashboard | 15 detik |
| T-13 | Logout dari aplikasi | dashboard → loginScreen | 30 detik |
| T-14 | Membuat meeting baru | dashboard → meetingLobby | 1 menit |
| T-15 | Menggabungkan meeting dengan kode | meetingLobby → meetingRoom | 1 menit |

## 6. Metrik Evaluasi

| Metrik | Definisi | Target |
|--------|----------|--------|
| **Task Success Rate** | Persentase tugas selesai tanpa bantuan | ≥ 90% |
| **Time on Task** | Waktu rata-rata menyelesaikan tiap tugas | Bervariasi per tugas |
| **Error Rate** | Jumlah kesalahan per tugas | ≤ 2 error/tugas |
| **SUS Score** | System Usability Scale (akhir sesi) | ≥ 70 |
| **SEQ Score** | Single Ease Question per tugas | ≥ 4/7 |
| ** satisfaction** | Rating kepuasan subjektif (1-5) | ≥ 4 |

## 7. Instrumen

- Post-task: Single Ease Question (SEQ) setelah tiap tugas
- Post-test: System Usability Scale (SUS) 10 pertanyaan
- Post-test: Wawancara singkat (3 pertanyaan terbuka)

## 8. Heuristics (Nielsen's 10)

1. Visibility of system status
2. Match between system and real world
3. User control and freedom
4. Consistency and standards
5. Error prevention
6. Recognition rather than recall
7. Flexibility and efficiency of use
8. Aesthetic and minimalist design
9. Help users recognize, diagnose, recover from errors
10. Help and documentation

## 9. Skala Severity

| Rating | Deskripsi |
|--------|-----------|
| 0 | Bukan masalah usability |
| 1 | Masalah kosmetik — perbaikan opsional |
| 2 | Masalah minor — prioritas rendah |
| 3 | Masalah mayor — prioritas tinggi |
| 4 | Masalah kritikal — harus diperbaiki segera |
