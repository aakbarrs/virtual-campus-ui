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
    ['Praktikum IMK', '🎨', 'Ibu Sari Wulandari', 24, '90 menit', 'Virtual A-201',
      'Praktikum Interaksi Manusia dan Komputer - membahas user experience dan usability testing.', 'live', 'Rapat mingguan • 10:00 — 11:30'],
    ['Praktikum PBO', '💻', 'Bapak Adi Nugroho', 22, '90 menit', 'Virtual B-101',
      'Praktikum Pemrograman Berorientasi Objek - Java inheritance, polymorphism, dan design patterns.', 'idle', ''],
    ['Algoritma Pemrograman', '🧠', 'Ibu Dewi Lestari', 18, '120 menit', 'Virtual A-301',
      'Mata kuliah Algoritma Pemrograman - struktur data dasar, sorting, searching.', 'upcoming', 'Meeting pukul 13:00'],
    ['Basis Data', '🗂️', 'Bapak Rudi Hartono', 20, '90 menit', 'Virtual A-401',
      'Perancangan basis data relasional, SQL, normalisasi, dan transaction management.', 'upcoming', 'Meeting pukul 15:30'],
    ['Jaringan Komputer', '🌐', 'Bapak Dimas Pratama', 16, '100 menit', 'Virtual C-101',
      'Konsep jaringan komputer, TCP/IP, routing, dan network security.', 'idle', ''],
    ['Kecerdasan Buatan', '🤖', 'Ibu Rina Fitriani', 15, '110 menit', 'Virtual C-201',
      'Pengantar kecerdasan buatan, machine learning, neural networks.', 'upcoming', 'Meeting pukul 08:00'],
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
