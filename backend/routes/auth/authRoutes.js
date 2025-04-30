const express = require('express');
const router = express.Router();
const authController = require('../../controllers/auth/authController');

// Rota de login
router.post('/login', authController.login);

// Rota para validar token
router.get('/validate', authController.validateToken);

// Rota para registro de usuário (opcional, pode ser restrita a admins)
router.post('/register', authController.register);

module.exports = router;
