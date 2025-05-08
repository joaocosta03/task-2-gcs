const express = require('express');
const router = express.Router();
const tarefaController = require('../controllers/tarefaController');

router.get('/', tarefaController.getTarefas);
router.post('/', tarefaController.createTarefa);    
router.put('/:id', tarefaController.updateTarefa);
router.delete('/:id', tarefaController.deleteTarefa);
router.get('/:id', tarefaController.getTarefaById);


module.exports = router;