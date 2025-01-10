const express = require('express');
const cartController = require('../controllers/cartController');
const router = express.Router();

router.post('/:cid/purchase', cartController.finalizePurchase);

module.exports = router;
