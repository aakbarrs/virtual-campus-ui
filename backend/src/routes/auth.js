const { Router } = require('express');
const { register, login, me, updateProfile } = require('../controllers/authController');
const { auth } = require('../middleware/auth');

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.get('/me', auth, me);
router.put('/me', auth, updateProfile);

module.exports = router;
