
const express = require('express');
const multer = require('multer');
const userController = require('../controllers/userControllers');

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

router.post('/signup', upload.single('file'), userController.signup);

router.post('/verify/:token', userController.verifyEmail);

router.post('/login', userController.login);
router.get('/admin', userController.getAllUsers);

module.exports = router;
