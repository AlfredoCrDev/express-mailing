const productService = require('../services/productService');
const utils = require("../utils")
const passport = require("passport")

class ProductController {
  async getAllProducts(req, res) {
    const { limit, page, sort, status, category } = req.query
    try {
      const result = await productService.getAllProducts( {limit, page, sort, status, category} );
      res.json(result);
    } catch (error) {
      console.log('Error en ProductController.getProducts:', error);
      res.status(500).json({ status: 'error', message: 'Error interno del servidor' });
    }
  }

  async findProductsByName(req, res) {
    const productName = req.body.name
    try {
      const products = await productService.findProductsByName(productName)
      res.json({ status: 'success', products});
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

async createProduct(req, res) {
  const { title, description, price, stock, category, code } = req.body;  
  try {
    // Verificar si el producto existe
    const productExists = await productService.getProductByCode(code);
    if (productExists) {
      return res.status(400).json({ status: "error", message: `El código ${code} ya esta siendo utilizado` });
    }
    const product = await productService.createProduct({ title, description, price, stock, category, code });    
    res.status(200).json({ status: "success", product });
  } catch (error) {
    console.log("Error al crear al el producto: ", error);
    res.status(400).json({ status: "error", message: error.message });
  }
}


  async updateProduct(req, res) {
    try {
      const productId = req.params.pid;
      const productData = req.body;
      const updatedProduct = await productService.updateProduct(productId, productData);
      res.json(updatedProduct);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async deleteProduct(req, res) {
    const productId = req.params.pid;
    try {

      const deletedProduct = await productService.deleteProduct(productId);
      if(deletedProduct.deletedCount > 0){
        res.status(200).json({ status: "success", deletedProduct });
      } else {
        res.status(400).json({ status: "error", message: "Error al eliminar el porducto"})
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ status: 'error', message: 'Error interno del servidor' });
    }
  }
}

module.exports = ProductController;
