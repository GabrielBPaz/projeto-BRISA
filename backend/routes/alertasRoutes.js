const express = require('express');
const router = express.Router();
const controller = require('../controllers/alertaController');

router.post('/', controller.cadastrar);
router.get('/', controller.listar);
router.patch('/:id/visualizar', controller.visualizar);

module.exports = router;
