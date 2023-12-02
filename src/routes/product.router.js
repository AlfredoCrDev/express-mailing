const express = require('express');
const router = express.Router();
const ProductController = require('../controllers/productController');

const productController = new ProductController();

// APIs
router.get('/', productController.getAllProducts);
router.post('/search', productController.findProductsByName);
router.post('/addProduct', productController.createProduct);
router.put('/update/:pid', productController.updateProduct);
router.delete('/:id', productController.deleteProduct);


module.exports = router;