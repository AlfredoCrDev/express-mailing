const cartModel = require("../models/carts.model.js")

class CarRepository {
  async addNewCart(){
    try {
      const carrito = new cartModel({products: []})
      await carrito.save()
      return carrito;
      console.log("Carrito creado con éxito", carrito);
    } catch (error) {
      console.log("Error al tratar de crear el carrito", error);
    }
  }
}

module.exports = CarRepository