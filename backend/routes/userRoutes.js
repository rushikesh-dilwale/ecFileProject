// backend/routes/userRoutes.js
const express = require('express');
const multer = require('multer');
const userController = require('../controllers/userControllers') // Check this path

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

router.post('/signup', upload.single('file'), userController.signup);
router.post('/verify', userController.verifyEmail);
router.post('/login', userController.login);
router.get('/admin', userController.getAllUsers);

module.exports = router;

