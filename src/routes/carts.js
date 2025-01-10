const express = require("express");
const CartManagerMongo = require("../dao/CartManagerMongo");
const authorization = require("../middleware/authorization");

const router = express.Router();
const cartManager = new CartManagerMongo();

// Rota para finalizar a compra do carrinho
router.post("/:cid/purchase", authorization("user"), async (req, res) => {
  try {
    const { cid } = req.params;
    const { ticket, unavailableProducts } = await cartManager.purchaseCart(cid);
    
    if (unavailableProducts.length > 0) {
      return res.status(400).json({
        message: "Some products are out of stock.",
        unavailableProducts,
      });
    }
    
    res.status(200).json({ message: "Purchase completed.", ticket });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;