const mongoose = require("mongoose");
const CartModel = require("../models/CartModel");
const ProductModel = require("../models/productModel");

class CartManagerMongo {
  constructor() {
    this.cartModel = CartModel;
    this.productModel = ProductModel;
  }

  async getCartById(cid) {
    try {
      return await this.cartModel.findById(cid).populate("products.product");
    } catch (error) {
      throw new Error("Cart not found.");
    }
  }

  async addProductToCart(cid, productId, quantity) {
    try {
      const cart = await this.getCartById(cid);
      const product = await this.productModel.findById(productId);
      if (product.stock >= quantity) {
        cart.products.push({ product: productId, quantity });
        await cart.save();
        return cart;
      } else {
        throw new Error("Insufficient stock.");
      }
    } catch (error) {
      throw new Error("Error adding product to cart.");
    }
  }

  async purchaseCart(cid) {
    try {
      const cart = await this.getCartById(cid);
      const unavailableProducts = [];
      let totalAmount = 0;

      for (const item of cart.products) {
        const product = await this.productModel.findById(item.product);
        if (product.stock >= item.quantity) {
          product.stock -= item.quantity;
          await product.save();
          totalAmount += product.price * item.quantity;
        } else {
          unavailableProducts.push(item.product);
        }
      }

      const ticket = await this.createTicket(cart, totalAmount);
      return { ticket, unavailableProducts };
    } catch (error) {
      throw new Error("Error processing purchase.");
    }
  }

  async createTicket(cart, amount) {
    const ticket = new Ticket({
      code: "TICKET-" + new Date().getTime(),
      purchase_datetime: new Date(),
      amount,
      purchaser: cart.userEmail,
    });
    await ticket.save();
    return ticket;
  }
}

module.exports = CartManagerMongo;
