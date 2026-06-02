const { Router } = require('express');
const { listEnrollments, enroll, unenroll } = require('../controllers/enrollmentController');
const { auth } = require('../middleware/auth');

const router = Router();

router.get('/', auth, listEnrollments);
router.post('/courses/:courseId', auth, enroll);
router.delete('/:id', auth, unenroll);

module.exports = router;
