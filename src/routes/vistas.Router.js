const express = require('express');
const router = express.Router();
const utils = require("../utils");
const ProductController = require('../repositories/productRepository');
const productController = new ProductController();

// VISTAS

router.get("/register", async(req, res) => {
  try {
    
    res.render("register", { title: "Registro de Usuario" })
  } catch (error) {
    console.log("Error al tratar de mostrar los productos", error);
    res.status(500).send("Error interno del servidor");
  }
})

router.get("/profile", utils.passportCall("jwt"), utils.isAdmin, async(req, res) => {
  try {
    const user = req.user.user;
    if(!user){
      console.log("No esta autorizado");
      return res.redirect("/")
    }
      const sessionData = {
        email: user.email,
        nombre: user.first_name,
        apellido: user.last_name,
        age: user.age || "No especifica",
        rol: user.rol,
      }
      res.render("profile", { title: "Perfil de Usuario", sessionData });
  } catch (error) {
    console.log("Error al tratar de mostrar el perfil de usuario", error);
  }
})

const allowedRoles = ["usuario", "admin"];
router.get("/products", utils.passportCall("jwt"), utils.authorization(allowedRoles), async(req, res) => {
  try {
    const user = req.user.user;
    if(!user){
      console.log("No esta autorizado");
      return res.redirect("/")
    }
    const { limit = 10 , page = 1} = req.query;

    const products = await productController.getAllProducts(limit, page,)
    const cartId = user.cart

    res.render("productos", { 
      title: "Lista de productos",
      products: products,
      email : user.email,
      rol: user.rol,
      cart: cartId
    })
  } catch (error) {
    console.log("Error al tratar de mostrar los productos", error);
  }
})


module.exports = router;