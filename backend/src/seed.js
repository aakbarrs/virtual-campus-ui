require('dotenv').config();
const bcrypt = require('bcryptjs');
const mysql = require('mysql2/promise');
const { getConfig } = require('./config/database');

async function seed() {
  const config = getConfig();

  // First connect without database to create it if needed
  const initConn = await mysql.createConnection({
    host: config.host,
    port: config.port,
    user: config.user,
    password: config.password
  });
  await initConn.execute(`CREATE DATABASE IF NOT EXISTS \`${config.database}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`);
  await initConn.end();

  const conn = await mysql.createConnection({
    host: config.host,
    port: config.port,
    user: config.user,
    password: config.password,
    database: config.database,
    multipleStatements: true
  });

  // Create tables if they don't exist
  await conn.execute(`
    CREATE TABLE IF NOT EXISTS users (
      id          INT AUTO_INCREMENT PRIMARY KEY,
      name        VARCHAR(255) NOT NULL,
      email       VARCHAR(255) NOT NULL UNIQUE,
      password    VARCHAR(255) NOT NULL,
      avatar      VARCHAR(10) DEFAULT NULL,
      reset_token VARCHAR(255) DEFAULT NULL,
      reset_token_expires DATETIME DEFAULT NULL,
      created_at  DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at  DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `);
  await conn.execute(`
    CREATE TABLE IF NOT EXISTS courses (
      id            INT AUTO_INCREMENT PRIMARY KEY,
      title         VARCHAR(255) NOT NULL,
      icon          VARCHAR(10) DEFAULT '📚',
      instructor    VARCHAR(255) NOT NULL,
      participants  INT DEFAULT 0,
      duration      VARCHAR(50) DEFAULT '90 menit',
      room          VARCHAR(100) DEFAULT '',
      description   TEXT DEFAULT NULL,
      status        ENUM('live','upcoming','idle') DEFAULT 'upcoming',
      schedule      VARCHAR(255) DEFAULT '',
      created_at    DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at    DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `);
  await conn.execute(`
    CREATE TABLE IF NOT EXISTS enrollments (
      id          INT AUTO_INCREMENT PRIMARY KEY,
      user_id     INT NOT NULL,
      course_id   INT NOT NULL,
      role        ENUM('student','instructor') DEFAULT 'student',
      joined_at   DATETIME DEFAULT CURRENT_TIMESTAMP,
      UNIQUE KEY unique_enrollment (user_id, course_id),
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `);
  await conn.execute(`
    CREATE TABLE IF NOT EXISTS meetings (
      id          INT AUTO_INCREMENT PRIMARY KEY,
      code        VARCHAR(10) NOT NULL UNIQUE,
      title       VARCHAR(255) NOT NULL,
      host_id     INT NOT NULL,
      status      ENUM('active','ended') DEFAULT 'active',
      created_at  DATETIME DEFAULT CURRENT_TIMESTAMP,
      ended_at    DATETIME DEFAULT NULL,
      FOREIGN KEY (host_id) REFERENCES users(id) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `);

  // Check if users already exist
  const [rows] = await conn.execute('SELECT COUNT(*) AS c FROM users');
  if (rows[0].c > 0) {
    console.log('Database sudah memiliki data, seed dilewati.');
    await conn.end();
    return;
  }

  const hash = await bcrypt.hash('password123', 10);

  await conn.beginTransaction();
  try {
    await conn.execute(
      'INSERT INTO users (name, email, password, avatar) VALUES (?, ?, ?, ?)',
      ['Akbar Saputra', 'akbar@example.com', hash, 'A']
    );
    await conn.execute(
      'INSERT INTO users (name, email, password, avatar) VALUES (?, ?, ?, ?)',
      ['Sari Wulandari', 'sari@example.com', hash, 'S']
    );
    await conn.execute(
      'INSERT INTO users (name, email, password, avatar) VALUES (?, ?, ?, ?)',
      ['Adi Nugroho', 'adi@example.com', hash, 'A']
    );

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

    for (const c of courses) {
      await conn.execute(
        `INSERT INTO courses (title, icon, instructor, participants, duration, room, description, status, schedule)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`, c
      );
    }

    await conn.commit();
    console.log('Database berhasil diisi dengan data demo.');
    console.log('Email: akbar@example.com / Password: password123');
  } catch (err) {
    await conn.rollback();
    throw err;
  } finally {
    await conn.end();
  }
}

seed().catch(err => {
  console.error('Seed error:', err);
  process.exit(1);
});
