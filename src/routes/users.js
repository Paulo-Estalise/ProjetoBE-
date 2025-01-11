const express = require('express');
const router = express.Router();
const UserController = require('../controllers/userController');

// Rota para obter todos os usuários
router.get('/', UserController.getAllUsers);

module.exports = router;

// Rota para excluir usuários inativos
router.delete('/', UserController.deleteInactiveUsers);

module.exports = router;

// Rota para exibir os dados de um único usuário
router.get('/:id', UserController.getUserById);

// Rota para editar o usuário
router.put('/:id', UserController.updateUser);

module.exports = router;