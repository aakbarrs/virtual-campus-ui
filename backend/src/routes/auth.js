const { Router } = require('express');
const { register, login, me, updateProfile, forgotPassword, resetPassword } = require('../controllers/authController');
const { auth } = require('../middleware/auth');

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.get('/me', auth, me);
router.put('/me', auth, updateProfile);

module.exports = router;
