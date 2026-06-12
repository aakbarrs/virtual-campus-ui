const mysql = require('mysql2/promise');

let pool = null;

function getConfig() {
  return {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '3306', 10),
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'virtual_campus',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
  };
}

async function ensureDatabase() {
  const config = getConfig();
  const conn = await mysql.createConnection({
    host: config.host,
    port: config.port,
    user: config.user,
    password: config.password
  });
  await conn.query(`CREATE DATABASE IF NOT EXISTS \`${config.database}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`);
  await conn.end();
}

async function createPool() {
  await ensureDatabase();
  pool = mysql.createPool(getConfig());
}

let query = (sql, params) => pool.execute(sql, params);

function stmtGet(sql, params) {
  return query(sql, params).then(([rows]) => rows[0]);
}

function stmtAll(sql, params) {
  return query(sql, params).then(([rows]) => rows);
}

async function stmtRun(sql, params) {
  const [result] = await query(sql, params);
  return { lastInsertRowid: result.insertId };
}

function getDb() {
  if (!pool) throw new Error('Database belum diinisialisasi, panggil initDb() terlebih dahulu');
  return api;
}

async function initDb() {
  await createPool();

  await pool.execute(`
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

  await pool.execute(`
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

  await pool.execute(`
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

  await pool.execute(`
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

  return api;
}

const api = {
  prepare(sql) {
    return {
      get: (...params) => stmtGet(sql, params),
      all: (...params) => stmtAll(sql, params),
      run: (...params) => stmtRun(sql, params)
    };
  },
  transaction(fn) {
    return async (...args) => {
      const conn = await pool.getConnection();
      const origQuery = query;
      const origPoolExecute = pool.execute;
      query = (sql, params) => conn.execute(sql, params);
      pool.execute = conn.execute.bind(conn);
      try {
        await conn.beginTransaction();
        const result = await fn(...args);
        await conn.commit();
        return result;
      } catch (err) {
        await conn.rollback();
        throw err;
      } finally {
        query = origQuery;
        pool.execute = origPoolExecute;
        conn.release();
      }
    };
  },
  exec(sql) {
    return pool.execute(sql);
  }
};

module.exports = { getDb, initDb, getConfig };
