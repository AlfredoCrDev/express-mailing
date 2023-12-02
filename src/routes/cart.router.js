const express = require("express")
const router = express.Router()
const CartController = require("../controllers/cartController.js")

const cartController = new CartController()

router.post("/", cartController.addnewCart)

module.exports = router