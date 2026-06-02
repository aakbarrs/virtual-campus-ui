const { Router } = require('express');
const { create, list, getByCode, end } = require('../controllers/meetingController');
const { auth } = require('../middleware/auth');

const router = Router();

router.get('/', list);
router.get('/:code', getByCode);
router.post('/', auth, create);
router.post('/:id/end', auth, end);

module.exports = router;
