const express = require('express');
const router = express.Router();

// VISTAS
router.get("/", async(req, res) => {
  try {
    
    res.render("login", { title: "Inicio de Sesion" })
  } catch (error) {
    console.log("Error al tratar de mostrar el login", error);
    res.status(500).send("Error interno del servidor");
  }
})

router.get("/register", async(req, res) => {
  try {
    
    res.render("register", { title: "Registro de Usuario" })
  } catch (error) {
    console.log("Error al tratar de mostrar los productos", error);
    res.status(500).send("Error interno del servidor");
  }
})

module.exports = router;