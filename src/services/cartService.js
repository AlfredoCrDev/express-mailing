const CartRepository = require("../repositories/cartRepository.js")
const cartRepository = new  CartRepository();

async function addNewCart() {
  try {
    return await cartRepository.addNewCart()
  } catch (error) {
    throw new Error(`Error in CartRepository.addNewCart: ${error.message}`);
  }
}

module.exports = {
  addNewCart
}