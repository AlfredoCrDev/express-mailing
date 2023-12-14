const express = require('express');
const router = express.Router();
const utils = require("../utils");
const ProductRepository = require("../repositories/productRepository");
const productRepository = new ProductRepository();
const cartService = require("../services/cartService")

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

// const allowedRoles = ["usuario", "admin"];
router.get("/products", utils.passportCall("jwt"), utils.isUser, async(req, res) => {
  try {
    const user = req.user.user;
    if(!user){
      console.log("No esta autorizado");
      return res.redirect("/")
    }
    const { limit = 10 , page = 1 } = req.query;
    // const limit = 10
    // const page = 1
    const products = await productRepository.getAllProducts(limit, page)
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

router.get("/email", utils.passportCall("jwt"), utils.isUser, async(req, res) => {
  try {
    
    res.render("sendEmail", { title: "Envio de Correo" })
  } catch (error) {
    console.log("Error al tratar de mostrar los productos", error);
    res.status(500).send("Error interno del servidor");
  }
})

router.get("/createProducts", utils.passportCall("jwt"), utils.isAdmin, async(req, res) => {
  try {
    const productos = await productController.getAllProducts({limit:100})
    res.render("realTimeProducts", { title: "Registro de Productos", productos })
  } catch (error) {
    console.log("Error al tratar de mostrar los productos", error);
    res.status(500).send("Error interno del servidor");
  }
})


router.get("/carrito/:cid", async (req, res) => {
  const cartId = req.params.cid;
  try {
    const productsInTheCart = await cartService.getCartById(cartId)
    
    res.render("cartView", { productsInTheCart })
  } catch (error) {
    console.error("Error al obtener el carrito", error);
    res.status(500).send({ message: "Error al obtener el carrito" });
  }
});




module.exports = router;