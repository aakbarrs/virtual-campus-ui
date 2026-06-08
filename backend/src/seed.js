require('dotenv').config();
const bcrypt = require('bcryptjs');
const { initDb, getDb } = require('./config/database');

async function seed() {
  await initDb();
  const db = getDb();

  const row = db.prepare('SELECT COUNT(*) AS c FROM users').get();
  if (row && row.c > 0) {
    console.log('Database sudah memiliki data, seed dilewati.');
    return;
  }

  const hash = await bcrypt.hash('password123', 10);

  const insertUser = db.prepare('INSERT INTO users (name, email, password, avatar) VALUES (?, ?, ?, ?)');
  insertUser.run('Akbar Saputra', 'akbar@example.com', hash, 'A');
  insertUser.run('Sari Wulandari', 'sari@example.com', hash, 'S');
  insertUser.run('Adi Nugroho', 'adi@example.com', hash, 'A');

  const insertCourse = db.prepare(`
    INSERT INTO courses (title, icon, instructor, participants, duration, room, description, status, schedule)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const courses = [
    ['Dasar Kecerdasan Artifisial', '🧠', 'Bambang Subeno, S.T., M.Kom.', 24, '150 menit', 'Lab A-201',
      'Konsep dasar kecerdasan buatan, machine learning, dan aplikasinya.', 'upcoming', 'Kelas IF-48-11 • Senin 07:00'],
    ['Interaksi Manusia Komputer', '🖥️', 'Iwan Abadi, S.Kom., MM., MT., CSCU., CEI', 22, '90 menit', 'Ruang 203',
      'Perancangan antarmuka, usability, dan evaluasi sistem interaktif.', 'upcoming', 'Kelas IF-48-10 • Rabu 10:30'],
    ['Jaringan Komputer', '🌐', 'Ghifari Ramadhika Permana, S.Kom., M.Sc.', 20, '200 menit', 'Lab A-201',
      'Arsitektur jaringan, TCP/IP, routing, switching, dan keamanan jaringan.', 'live', 'Kelas IF-48-10 • Rabu 07:00'],
    ['Pemrograman Berorientasi Objek', '💻', 'Soni Yora, S.Kom., M.Kom.', 20, '200 menit', 'Lab B-101',
      'Konsep OOP, inheritance, polymorphism, encapsulation, dan design patterns.', 'upcoming', 'Kelas IF-48-10 • Selasa 07:00'],
    ['Strategi Algoritma', '📐', 'Fauzan Firdaus, S.Kom., M.T.', 18, '150 menit', 'Ruang 105',
      'Analisis dan perancangan algoritma, divide & conquer, greedy, dynamic programming.', 'idle', 'Kelas IF-48-04 • Kamis 07:00'],
    ['Wawasan Global TIK', '🌍', 'Ahmad Bintang Arif, S.Kom., M.Kom.', 16, '100 menit', 'Ruang 105',
      'Tren dan isu global dalam teknologi informasi dan komunikasi.', 'upcoming', 'Kelas IF-48-10 • Senin 09:40'],
  ];

  const insertMany = db.transaction(() => {
    courses.forEach(c => insertCourse.run(...c));
  });
  insertMany();

  console.log('Database berhasil diisi dengan data demo.');
  console.log('Email: akbar@example.com / Password: password123');
}

seed().catch(err => {
  console.error('Seed error:', err);
  process.exit(1);
});
