const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { getDb } = require('../config/database');

const JWT_SECRET = process.env.JWT_SECRET || 'default-secret';
const JWT_EXPIRES = '7d';

async function register(req, res, next) {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Nama, email, dan password wajib diisi' });
    }
    if (password.length < 6) {
      return res.status(400).json({ error: 'Password minimal 6 karakter' });
    }
    const db = getDb();
    const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(email);
    if (existing) {
      return res.status(409).json({ error: 'Email sudah terdaftar' });
    }
    const hash = await bcrypt.hash(password, 10);
    const result = db.prepare('INSERT INTO users (name, email, password) VALUES (?, ?, ?)').run(name, email, hash);
    const token = jwt.sign({ id: result.lastInsertRowid, email, name }, JWT_SECRET, { expiresIn: JWT_EXPIRES });
    res.status(201).json({
      token,
      user: { id: result.lastInsertRowid, name, email, avatar: null }
    });
  } catch (err) {
    next(err);
  }
}

async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email dan password wajib diisi' });
    }
    const db = getDb();
    const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
    if (!user) {
      return res.status(401).json({ error: 'Email atau password salah' });
    }
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ error: 'Email atau password salah' });
    }
    const token = jwt.sign({ id: user.id, email: user.email, name: user.name }, JWT_SECRET, { expiresIn: JWT_EXPIRES });
    res.json({
      token,
      user: { id: user.id, name: user.name, email: user.email, avatar: user.avatar }
    });
  } catch (err) {
    next(err);
  }
}

function me(req, res, next) {
  try {
    const db = getDb();
    const user = db.prepare('SELECT id, name, email, avatar, created_at FROM users WHERE id = ?').get(req.user.id);
    if (!user) return res.status(404).json({ error: 'User tidak ditemukan' });
    res.json({ user });
  } catch (err) {
    next(err);
  }
}

async function updateProfile(req, res, next) {
  try {
    const { name, avatar } = req.body;
    const db = getDb();
    if (name) {
      db.prepare('UPDATE users SET name = ?, updated_at = datetime("now") WHERE id = ?').run(name, req.user.id);
    }
    if (avatar !== undefined) {
      db.prepare('UPDATE users SET avatar = ?, updated_at = datetime("now") WHERE id = ?').run(avatar, req.user.id);
    }
    const user = db.prepare('SELECT id, name, email, avatar, created_at FROM users WHERE id = ?').get(req.user.id);
    res.json({ user });
  } catch (err) {
    next(err);
  }
}

async function forgotPassword(req, res, next) {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ error: 'Email wajib diisi' });
    }
    const db = getDb();
    const user = db.prepare('SELECT id FROM users WHERE email = ?').get(email);
    // Always return success (security best practice — don't reveal if email exists)
    if (user) {
      const token = crypto.randomBytes(32).toString('hex');
      const expires = new Date(Date.now() + 3600000).toISOString(); // 1 hour
      db.prepare('UPDATE users SET reset_token = ?, reset_token_expires = ?, updated_at = datetime("now") WHERE id = ?')
        .run(token, expires, user.id);
    }
    res.json({ message: 'Jika email terdaftar, link reset password telah dikirim' });
  } catch (err) {
    next(err);
  }
}

async function resetPassword(req, res, next) {
  try {
    const { email, token, password } = req.body;
    if (!email || !token || !password) {
      return res.status(400).json({ error: 'Email, token, dan password baru wajib diisi' });
    }
    if (password.length < 6) {
      return res.status(400).json({ error: 'Password minimal 6 karakter' });
    }
    const db = getDb();
    const user = db.prepare('SELECT * FROM users WHERE email = ? AND reset_token = ?').get(email, token);
    if (!user) {
      return res.status(400).json({ error: 'Token reset tidak valid' });
    }
    if (new Date(user.reset_token_expires) < new Date()) {
      return res.status(400).json({ error: 'Token reset sudah kedaluwarsa' });
    }
    const hash = await bcrypt.hash(password, 10);
    db.prepare('UPDATE users SET password = ?, reset_token = NULL, reset_token_expires = NULL, updated_at = datetime("now") WHERE id = ?')
      .run(hash, user.id);
    res.json({ message: 'Password berhasil direset. Silakan masuk.' });
  } catch (err) {
    next(err);
  }
}

module.exports = { register, login, me, updateProfile, forgotPassword, resetPassword };
