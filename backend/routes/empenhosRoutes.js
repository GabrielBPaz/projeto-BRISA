const express = require('express');
const router = express.Router();
const empenhoController = require('../controllers/empenhoController');

router.post('/', empenhoController.cadastrar); // UC05
router.get('/licitacao/:licitacao_id', empenhoController.listarPorLicitacao); // UC07
// router.patch("/:id/status", empenhoController.atualizarStatus); // UC08 - Comentado pois o controller está comentado

module.exports = router;
