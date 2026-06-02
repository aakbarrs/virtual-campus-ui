const { getDb } = require('../config/database');

function list(req, res, next) {
  try {
    const db = getDb();
    const { filter, search } = req.query;
    let sql = 'SELECT * FROM courses';
    const params = [];
    const conditions = [];

    if (filter && filter !== 'all') {
      conditions.push('status = ?');
      params.push(filter);
    }
    if (search && search.trim()) {
      conditions.push('title LIKE ?');
      params.push(`%${search.trim()}%`);
    }

    if (conditions.length) {
      sql += ' WHERE ' + conditions.join(' AND ');
    }
    sql += ' ORDER BY id ASC';

    const courses = db.prepare(sql).all(...params);
    res.json({ courses });
  } catch (err) {
    next(err);
  }
}

function getById(req, res, next) {
  try {
    const db = getDb();
    const course = db.prepare('SELECT * FROM courses WHERE id = ?').get(req.params.id);
    if (!course) return res.status(404).json({ error: 'Kelas tidak ditemukan' });
    res.json({ course });
  } catch (err) {
    next(err);
  }
}

function create(req, res, next) {
  try {
    const { title, icon, instructor, participants, duration, room, description, status, schedule } = req.body;
    if (!title || !instructor) {
      return res.status(400).json({ error: 'Title dan instructor wajib diisi' });
    }
    const db = getDb();
    const result = db.prepare(`
      INSERT INTO courses (title, icon, instructor, participants, duration, room, description, status, schedule)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      title, icon || '📚', instructor,
      participants || 0, duration || '90 menit',
      room || '', description || '',
      status || 'upcoming', schedule || ''
    );
    const course = db.prepare('SELECT * FROM courses WHERE id = ?').get(result.lastInsertRowid);
    res.status(201).json({ course });
  } catch (err) {
    next(err);
  }
}

function update(req, res, next) {
  try {
    const db = getDb();
    const existing = db.prepare('SELECT * FROM courses WHERE id = ?').get(req.params.id);
    if (!existing) return res.status(404).json({ error: 'Kelas tidak ditemukan' });

    const fields = ['title', 'icon', 'instructor', 'participants', 'duration', 'room', 'description', 'status', 'schedule'];
    const updates = [];
    const params = [];

    fields.forEach(f => {
      if (req.body[f] !== undefined) {
        updates.push(`${f} = ?`);
        params.push(req.body[f]);
      }
    });

    if (!updates.length) {
      return res.status(400).json({ error: 'Tidak ada field yang diupdate' });
    }

    updates.push('updated_at = datetime("now")');
    params.push(req.params.id);
    db.prepare(`UPDATE courses SET ${updates.join(', ')} WHERE id = ?`).run(...params);
    const course = db.prepare('SELECT * FROM courses WHERE id = ?').get(req.params.id);
    res.json({ course });
  } catch (err) {
    next(err);
  }
}

function remove(req, res, next) {
  try {
    const db = getDb();
    const existing = db.prepare('SELECT * FROM courses WHERE id = ?').get(req.params.id);
    if (!existing) return res.status(404).json({ error: 'Kelas tidak ditemukan' });
    db.prepare('DELETE FROM courses WHERE id = ?').run(req.params.id);
    res.json({ message: 'Kelas berhasil dihapus' });
  } catch (err) {
    next(err);
  }
}

module.exports = { list, getById, create, update, remove };
