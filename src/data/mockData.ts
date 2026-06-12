import { Course, ScheduleItem, GradeSemester, Notification } from '../types';

export const mockCourses: Course[] = [
  { id: 1, title: 'Dasar Kecerdasan Artifisial', icon: '🧠', instructor: 'Bambang Subeno, S.T., M.Kom.', participants: 24, duration: '150 menit', room: 'Lab A-201', status: 'upcoming', schedule: 'IF-48-11 • Senin 07:00' },
  { id: 2, title: 'Interaksi Manusia Komputer', icon: '🖥️', instructor: 'Iwan Abadi, S.Kom., MM., MT., CSCU., CEI', participants: 22, duration: '90 menit', room: 'Ruang 203', status: 'upcoming', schedule: 'IF-48-10 • Rabu 10:30' },
  { id: 3, title: 'Jaringan Komputer', icon: '🌐', instructor: 'Ghifari Ramadhika Permana, S.Kom., M.Sc.', participants: 20, duration: '200 menit', room: 'Lab A-201', status: 'live', schedule: 'IF-48-10 • Rabu 07:00' },
  { id: 4, title: 'Pemrograman Berorientasi Objek', icon: '💻', instructor: 'Soni Yora, S.Kom., M.Kom.', participants: 20, duration: '200 menit', room: 'Lab B-101', status: 'upcoming', schedule: 'IF-48-10 • Selasa 07:00' },
  { id: 5, title: 'Strategi Algoritma', icon: '📐', instructor: 'Fauzan Firdaus, S.Kom., M.T.', participants: 18, duration: '150 menit', room: 'Ruang 105', status: 'idle', schedule: 'IF-48-04 • Kamis 07:00' },
  { id: 6, title: 'Wawasan Global TIK', icon: '🌍', instructor: 'Ahmad Bintang Arif, S.Kom., M.Kom. & Donni Richasdy, S.T., M.T.', participants: 16, duration: '100 menit', room: 'Ruang 105', status: 'upcoming', schedule: 'IF-48-10 • Senin 09:40' },
];

export const scheduleData: ScheduleItem[] = [
  { id: 1, day: 'senin', start: '07:00', end: '09:30', course: 'Dasar Kecerdasan Artifisial', room: 'Lab A-201', lecturer: 'Bambang Subeno, S.T., M.Kom.', color: '#6366f1' },
  { id: 2, day: 'senin', start: '09:40', end: '11:20', course: 'Wawasan Global TIK', room: 'Ruang 105', lecturer: 'Ahmad Bintang Arif, S.Kom., M.Kom.', color: '#10b981' },
  { id: 3, day: 'selasa', start: '07:00', end: '10:20', course: 'Pemrograman Berorientasi Objek', room: 'Lab B-101', lecturer: 'Soni Yora, S.Kom., M.Kom.', color: '#ec4899' },
  { id: 4, day: 'rabu', start: '07:00', end: '10:20', course: 'Jaringan Komputer', room: 'Lab A-201', lecturer: 'Ghifari Ramadhika Permana, S.Kom., M.Sc.', color: '#ef4444' },
  { id: 5, day: 'rabu', start: '10:30', end: '12:00', course: 'Interaksi Manusia Komputer', room: 'Ruang 203', lecturer: 'Iwan Abadi, S.Kom., MM., MT., CSCU., CEI', color: '#3b82c4' },
  { id: 6, day: 'kamis', start: '07:00', end: '09:30', course: 'Strategi Algoritma', room: 'Ruang 105', lecturer: 'Fauzan Firdaus, S.Kom., M.T.', color: '#f59e0b' },
];

export const gradesData: GradeSemester[] = [
  { name: 'Semester 1', gpa: 3.6, totalSks: 20, courses: [
    { name: 'Praktikum IMK', sks: 3, components: { tugas: 88, uts: 82, uas: 90, praktikum: 85 }, grade: 'A', passed: true },
    { name: 'Basis Data', sks: 3, components: { tugas: 78, uts: 75, uas: 80 }, grade: 'B+', passed: true },
    { name: 'Struktur Data', sks: 3, components: { tugas: 82, uts: 70, uas: 75 }, grade: 'B', passed: true },
    { name: 'Jaringan Komputer', sks: 3, components: { tugas: 90, uts: 85, uas: 88 }, grade: 'A', passed: true },
    { name: 'Sistem Operasi', sks: 3, components: { tugas: 65, uts: 70, uas: 60 }, grade: 'C+', passed: true },
    { name: 'Pemrograman Web', sks: 3, components: { tugas: 92, uts: 88, uas: 85 }, grade: 'A', passed: true },
    { name: 'Bahasa Inggris', sks: 2, components: { tugas: 80, uts: 78, uas: 82 }, grade: 'B+', passed: true },
  ]},
  { name: 'Semester 2', gpa: 3.4, totalSks: 22, courses: [
    { name: 'Manajemen Basis Data', sks: 3, components: { tugas: 80, uts: 78, uas: 85 }, grade: 'B+', passed: true },
    { name: 'Analisis Proses Bisnis', sks: 3, components: { tugas: 75, uts: 72, uas: 78 }, grade: 'B', passed: true },
    { name: 'Sistem Informasi', sks: 3, components: { tugas: 88, uts: 82, uas: 90 }, grade: 'A', passed: true },
    { name: 'Pemrograman Mobile', sks: 3, components: { tugas: 70, uts: 65, uas: 68 }, grade: 'C+', passed: true },
    { name: 'Interaksi Manusia Komputer', sks: 3, components: { tugas: 85, uts: 80, uas: 88, praktikum: 82 }, grade: 'A', passed: true },
    { name: 'Kecerdasan Buatan', sks: 3, components: { tugas: 72, uts: 68, uas: 74 }, grade: 'B', passed: true },
    { name: 'Data Warehouse', sks: 2, components: { tugas: 78, uts: 80, uas: 76 }, grade: 'B', passed: true },
    { name: 'Etika Profesi TI', sks: 2, components: { tugas: 90, uts: 88, uas: 92 }, grade: 'A', passed: true },
  ]},
  { name: 'Semester 3', gpa: 3.65, totalSks: 19, courses: [
    { name: 'Dasar Kecerdasan Artifisial', sks: 3, components: { tugas: 88, uts: 82, uas: 90 }, grade: 'A', passed: true },
    { name: 'Interaksi Manusia Komputer', sks: 3, components: { tugas: 85, uts: 80, uas: 88, praktikum: 82 }, grade: 'A', passed: true },
    { name: 'Jaringan Komputer', sks: 4, components: { tugas: 82, uts: 78, uas: 85, praktikum: 80 }, grade: 'B+', passed: true },
    { name: 'Pemrograman Berorientasi Objek', sks: 4, components: { tugas: 90, uts: 85, uas: 88, praktikum: 86 }, grade: 'A', passed: true },
    { name: 'Strategi Algoritma', sks: 3, components: { tugas: 78, uts: 72, uas: 80 }, grade: 'B', passed: true },
    { name: 'Wawasan Global TIK', sks: 2, components: { tugas: 92, uts: 88, uas: 90 }, grade: 'A', passed: true },
  ]},
];

export const mockNotifications: Notification[] = [
  { id: 1, icon: '📢', title: 'Pengumuman UAS', desc: 'Jadwal UAS Semester Genap 2025/2026 telah dirilis.', priority: 'urgent', role: 'all', time: new Date(Date.now() - 1000 * 60 * 15), read: false },
  { id: 2, icon: '📝', title: 'Tugas Akhir', desc: 'Batas submit proposal tugas akhir diperpanjang hingga 20 Juni.', priority: 'urgent', role: 'mahasiswa', time: new Date(Date.now() - 1000 * 60 * 60 * 2), read: false },
  { id: 3, icon: '📅', title: 'Rapat Dosen', desc: 'Rapat koordinasi dosen setiap hari Jumat pukul 13:00.', priority: 'important', role: 'dosen', time: new Date(Date.now() - 1000 * 60 * 60 * 5), read: false },
  { id: 4, icon: '✅', title: 'Nilai Diupload', desc: 'Nilai mata kuliah IMK sudah bisa dilihat di portal.', priority: 'important', role: 'mahasiswa', time: new Date(Date.now() - 1000 * 60 * 60 * 24), read: false },
  { id: 5, icon: '📚', title: 'Perubahan Ruang', desc: 'Kelas Praktikum IMK pindah ke Lab A-203.', priority: 'normal', role: 'all', time: new Date(Date.now() - 1000 * 60 * 60 * 48), read: false },
  { id: 6, icon: '🎓', title: 'Wisuda Periode II', desc: 'Pendaftaran wisuda dibuka hingga 30 Juni 2026.', priority: 'important', role: 'mahasiswa', time: new Date(Date.now() - 1000 * 60 * 60 * 72), read: true },
  { id: 7, icon: '🔔', title: 'Pengisian RPS', desc: 'Dosen diharapkan mengisi RPS sebelum perkuliahan dimulai.', priority: 'urgent', role: 'dosen', time: new Date(Date.now() - 1000 * 60 * 30), read: false },
  { id: 8, icon: '📋', title: 'Survey Kepuasan', desc: 'Mohon mengisi survey kepuasan pembelajaran semester ini.', priority: 'normal', role: 'all', time: new Date(Date.now() - 1000 * 60 * 60 * 12), read: false },
];

export const dayNames: Record<string, string> = { senin: 'Senin', selasa: 'Selasa', rabu: 'Rabu', kamis: 'Kamis', jumat: 'Jumat' };
export const dayKeys = ['senin', 'selasa', 'rabu', 'kamis', 'jumat'];
