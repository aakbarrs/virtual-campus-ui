const { getDb } = require('../config/database');
const { v4: uuidv4 } = require('uuid');

function generateCode() {
  return uuidv4().slice(0, 8).toUpperCase();
}

async function create(req, res, next) {
  try {
    const { title } = req.body;
    if (!title || !title.trim()) {
      return res.status(400).json({ error: 'Judul meeting wajib diisi' });
    }
    const db = getDb();
    let code;
    do {
      code = generateCode();
    } while (await db.prepare('SELECT id FROM meetings WHERE code = ?').get(code));
    const result = await db.prepare(
      'INSERT INTO meetings (code, title, host_id) VALUES (?, ?, ?)'
    ).run(code, title.trim(), req.user.id);
    const meeting = await db.prepare('SELECT * FROM meetings WHERE id = ?').get(result.lastInsertRowid);
    res.status(201).json({ meeting });
  } catch (err) {
    next(err);
  }
}

async function list(req, res, next) {
  try {
    const db = getDb();
    const meetings = await db.prepare(
      `SELECT m.*, u.name as host_name FROM meetings m
       JOIN users u ON u.id = m.host_id
       WHERE m.status = 'active'
       ORDER BY m.created_at DESC`
    ).all();
    res.json({ meetings });
  } catch (err) {
    next(err);
  }
}

async function getByCode(req, res, next) {
  try {
    const db = getDb();
    const meeting = await db.prepare(
      `SELECT m.*, u.name as host_name FROM meetings m
       JOIN users u ON u.id = m.host_id
       WHERE m.code = ?`
    ).get(req.params.code);
    if (!meeting) return res.status(404).json({ error: 'Meeting tidak ditemukan' });
    if (meeting.status === 'ended') return res.status(410).json({ error: 'Meeting sudah berakhir' });
    res.json({ meeting });
  } catch (err) {
    next(err);
  }
}

async function end(req, res, next) {
  try {
    const db = getDb();
    const meeting = await db.prepare('SELECT * FROM meetings WHERE id = ?').get(req.params.id);
    if (!meeting) return res.status(404).json({ error: 'Meeting tidak ditemukan' });
    if (meeting.host_id !== req.user.id) {
      return res.status(403).json({ error: 'Hanya host yang bisa mengakhiri meeting' });
    }
    await db.prepare(
      `UPDATE meetings SET status = 'ended', ended_at = NOW() WHERE id = ?`
    ).run(req.params.id);
    res.json({ message: 'Meeting diakhiri' });
  } catch (err) {
    next(err);
  }
}

module.exports = { create, list, getByCode, end };
