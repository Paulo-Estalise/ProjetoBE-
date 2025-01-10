const Cart = require('../models/CartModel');
const cartController = {
    createCart: async (req, res) => {
        try {
            const newCart = new Cart({ products: [] });
            await newCart.save();
            res.status(201).json({ message: 'Cart created', cart: newCart });
        } catch (error) {
            res.status(500).json({ message: 'Error creating cart', error });
        }
    },

    getCartById: async (req, res) => {
        // Implementação da lógica de busca do carrinho por ID
    },

    addProductToCart: async (req, res) => {
        // Implementação da lógica de adicionar produto ao carrinho
    },
};

module.exports = cartController;

const Product = require('../models/productModel');
const Ticket = require('../models/TicketModel');

exports.finalizePurchase = async (req, res) => {
  try {
    const { cid } = req.params;
    const cart = await Cart.findById(cid).populate('products.product');
    
    if (!cart) return res.status(404).send({ status: 'error', message: 'Cart not found' });

    let total = 0;
    const outOfStock = [];

    for (const item of cart.products) {
      const product = item.product;

      if (product.stock >= item.quantity) {
        product.stock -= item.quantity;
        total += product.price * item.quantity;
        await product.save();
      } else {
        outOfStock.push({ product: product._id, available: product.stock });
      }
    }

    cart.products = cart.products.filter(item => !outOfStock.find(p => p.product.equals(item.product._id)));
    await cart.save();

    const ticket = await Ticket.create({
      cartId: cid,
      amount: total,
      purchaser: req.user?.email || 'guest',
      createdAt: new Date(),
    });

    res.status(200).send({
      status: 'success',
      ticket,
      notPurchased: outOfStock,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({ status: 'error', message: 'Internal Server Error' });
  }
};
