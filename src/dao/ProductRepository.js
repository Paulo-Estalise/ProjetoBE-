const Product = require('../models/ProductModel');

class ProductRepository {
  async findById(productId) {
    return Product.findById(productId);
  }

  async updateStock(productId, newStock) {
    return Product.findByIdAndUpdate(productId, { stock: newStock }, { new: true });
  }

  // Adicione outros métodos conforme necessário...
}

module.exports = new ProductRepository();
