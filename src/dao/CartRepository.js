const Cart = require('../models/CartModel');

class CartRepository {
  async findById(cartId) {
    return Cart.findById(cartId).populate('products.product');
  }

  async updateCart(cartId, updatedProducts) {
    return Cart.findByIdAndUpdate(cartId, { products: updatedProducts }, { new: true });
  }

  // Adicione outros métodos conforme necessário...
}

module.exports = new CartRepository();
