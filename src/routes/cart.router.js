const express = require("express")
const router = express.Router()
const CartController = require("../controllers/cartController.js")

const cartController = new CartController()

router.post("/", cartController.addnewCart)
router.get("/", cartController.getAllCarts)
router.get("/:cid", cartController.getCartById)
router.post("/addProduct", cartController.addProductToCart)
router.delete('/:cid/:pid', cartController.removeProductFromCart);
router.delete('/:cid', cartController.deleteCart);
router.put('/updateQuantity', cartController.updateCartItemQuantity);


module.exports = router