class CartDTO {
    constructor(cart) {
      this.id = cart._id;
      this.userEmail = cart.userEmail;
      this.products = cart.products.map((item) => ({
        product: {
          id: item.product._id,
          title: item.product.title,
          price: item.product.price,
        },
        quantity: item.quantity,
      }));
    }
  }
  
  module.exports = CartDTO;