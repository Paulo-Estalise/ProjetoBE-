const express = require('express');
const router = express.Router();
const Product = require('../models/productModel');
const productController = require('../controllers/productController');

router.get('/', productController.getAllProducts);    // Rota para listar todos os produtos com paginação, filtros e ordenação
router.get('/:pid', productController.getProductById); // Rota para listar um produto específico
router.post('/', productController.createProduct);   // Rota para criar um novo produto
router.put('/:pid', productController.updateProduct); // Rota para atualizar um produto existente
router.delete('/:pid', productController.deleteProduct); // Rota para deletar um produto

module.exports = router;
