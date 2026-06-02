const path = require('path');
const fs = require('fs');

let db = null;
let SQL = null;

function getDbPath() {
  const p = process.env.DB_PATH || './data/virtual-campus.db';
  if (path.isAbsolute(p)) return p;
  const dir = path.dirname(require.main?.filename || __dirname);
  return path.resolve(dir, '..', p);
}

function saveDb() {
  if (!db) return;
  const data = db.export();
  const buffer = Buffer.from(data);
  const dbPath = getDbPath();
  const dbDir = path.dirname(dbPath);
  if (!fs.existsSync(dbDir)) fs.mkdirSync(dbDir, { recursive: true });
  fs.writeFileSync(dbPath, buffer);
}

async function initSqlJs() {
  if (SQL) return SQL;
  const init = require('sql.js');
  SQL = await init();
  return SQL;
}

function stmtGet(stmt, ...params) {
  if (params.length) stmt.bind(params);
  if (stmt.step()) {
    const row = stmt.getAsObject();
    stmt.free();
    return row;
  }
  stmt.free();
  return undefined;
}

function stmtAll(stmt, ...params) {
  const rows = [];
  if (params.length) stmt.bind(params);
  while (stmt.step()) {
    rows.push(stmt.getAsObject());
  }
  stmt.free();
  return rows;
}

function stmtRun(stmt, ...params) {
  if (params.length) stmt.bind(params);
  stmt.step();
  stmt.free();
  const result = db.exec("SELECT last_insert_rowid() as id");
  const lastInsertRowid = result?.[0]?.values?.[0]?.[0];
  return { lastInsertRowid };
}

function getDb() {
  if (!db) throw new Error('Database belum diinisialisasi, panggil initDb() terlebih dahulu');
  return api;
}

async function initDb() {
  const sqlJs = await initSqlJs();
  const dbPath = getDbPath();
  if (fs.existsSync(dbPath)) {
    const buffer = fs.readFileSync(dbPath);
    db = new sqlJs.Database(buffer);
  } else {
    const dbDir = path.dirname(dbPath);
    if (!fs.existsSync(dbDir)) fs.mkdirSync(dbDir, { recursive: true });
    db = new sqlJs.Database();
  }
  db.run('PRAGMA foreign_keys = ON');
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id          INTEGER PRIMARY KEY AUTOINCREMENT,
      name        TEXT    NOT NULL,
      email       TEXT    NOT NULL UNIQUE,
      password    TEXT    NOT NULL,
      avatar      TEXT    DEFAULT NULL,
      created_at  TEXT    DEFAULT (datetime('now')),
      updated_at  TEXT    DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS courses (
      id            INTEGER PRIMARY KEY AUTOINCREMENT,
      title         TEXT    NOT NULL,
      icon          TEXT    DEFAULT '📚',
      instructor    TEXT    NOT NULL,
      participants  INTEGER DEFAULT 0,
      duration      TEXT    DEFAULT '90 menit',
      room          TEXT    DEFAULT '',
      description   TEXT    DEFAULT '',
      status        TEXT    DEFAULT 'upcoming' CHECK(status IN ('live','upcoming','idle')),
      schedule      TEXT    DEFAULT '',
      created_at    TEXT    DEFAULT (datetime('now')),
      updated_at    TEXT    DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS enrollments (
      id          INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id     INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      course_id   INTEGER NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
      role        TEXT    DEFAULT 'student' CHECK(role IN ('student','instructor')),
      joined_at   TEXT    DEFAULT (datetime('now')),
      UNIQUE(user_id, course_id)
    );

    CREATE TABLE IF NOT EXISTS meetings (
      id          INTEGER PRIMARY KEY AUTOINCREMENT,
      code        TEXT    NOT NULL UNIQUE,
      title       TEXT    NOT NULL,
      host_id     INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      status      TEXT    DEFAULT 'active' CHECK(status IN ('active','ended')),
      created_at  TEXT    DEFAULT (datetime('now')),
      ended_at    TEXT    DEFAULT NULL
    );
  `);
  saveDb();
  return api;
}

const api = {
  prepare(sql) {
    return {
      get: (...params) => stmtGet(db.prepare(sql), ...params),
      all: (...params) => stmtAll(db.prepare(sql), ...params),
      run: (...params) => stmtRun(db.prepare(sql), ...params)
    };
  },
  transaction(fn) {
    return (...args) => {
      db.run('BEGIN');
      try {
        const result = fn(...args);
        db.run('COMMIT');
        saveDb();
        return result;
      } catch (err) {
        db.run('ROLLBACK');
        throw err;
      }
    };
  },
  exec(sql) {
    return db.exec(sql);
  }
};

module.exports = { getDb, initDb, saveDb };
