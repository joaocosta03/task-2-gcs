const express = require('express');
const router = express.Router();
const tarefaController = require('../controllers/tarefaController');
const authMiddleware = require('../middlewares/authMiddleware');

router.get('/', tarefaController.getTarefas);
router.post('/', authMiddleware, tarefaController.createTarefa);    
router.put('/:id', tarefaController.updateTarefa);
router.delete('/:id', tarefaController.deleteTarefa);
router.get('/:id', tarefaController.getTarefaById);

module.exports = router;