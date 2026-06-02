const { getDb } = require('../config/database');

function listEnrollments(req, res, next) {
  try {
    const db = getDb();
    const enrollments = db.prepare(`
      SELECT e.*, c.title AS course_title, c.icon AS course_icon, c.instructor, c.status
      FROM enrollments e
      JOIN courses c ON e.course_id = c.id
      WHERE e.user_id = ?
      ORDER BY e.joined_at DESC
    `).all(req.user.id);
    res.json({ enrollments });
  } catch (err) {
    next(err);
  }
}

function enroll(req, res, next) {
  try {
    const db = getDb();
    const course = db.prepare('SELECT * FROM courses WHERE id = ?').get(req.params.courseId);
    if (!course) return res.status(404).json({ error: 'Kelas tidak ditemukan' });

    const existing = db.prepare('SELECT id FROM enrollments WHERE user_id = ? AND course_id = ?')
      .get(req.user.id, req.params.courseId);
    if (existing) return res.status(409).json({ error: 'Sudah terdaftar di kelas ini' });

    const result = db.prepare('INSERT INTO enrollments (user_id, course_id) VALUES (?, ?)')
      .run(req.user.id, req.params.courseId);
    db.prepare('UPDATE courses SET participants = participants + 1 WHERE id = ?').run(req.params.courseId);

    const enrollment = db.prepare(`
      SELECT e.*, c.title AS course_title, c.icon AS course_icon
      FROM enrollments e JOIN courses c ON e.course_id = c.id
      WHERE e.id = ?
    `).get(result.lastInsertRowid);
    res.status(201).json({ enrollment });
  } catch (err) {
    next(err);
  }
}

function unenroll(req, res, next) {
  try {
    const db = getDb();
    const enrollment = db.prepare('SELECT * FROM enrollments WHERE id = ? AND user_id = ?')
      .get(req.params.id, req.user.id);
    if (!enrollment) return res.status(404).json({ error: 'Enrollment tidak ditemukan' });

    db.prepare('DELETE FROM enrollments WHERE id = ?').run(req.params.id);
    db.prepare('UPDATE courses SET participants = MAX(0, participants - 1) WHERE id = ?').run(enrollment.course_id);
    res.json({ message: 'Berhasil keluar dari kelas' });
  } catch (err) {
    next(err);
  }
}

module.exports = { listEnrollments, enroll, unenroll };
