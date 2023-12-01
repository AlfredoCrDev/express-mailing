const productService = require('../services/productService');
const utils = require("../utils")
const passport = require("passport")

class ProductController {
  async getAllProducts(req, res) {
    try {
      const products = await productService.getAllProducts();
      res.json(products);
    } catch (error) {
      res.status(500).json({ error: error.message });
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

    // Crear el producto si el código no está en uso
    const product = await productService.createProduct({ title, description, price, stock, category, code });    
    res.json({ status: "success", product });
  } catch (error) {
    console.log("Error al crear al el producto: ", error);
    res.status(400).json({ status: "error", message: error.message });
  }
}


  async updateproduct(req, res) {
    const productId = req.params.pid;
    const productData = req.body;
    try {
      const updatedProduct = await productService.updateproduct(productId, productData);
      res.json(updatedProduct);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async deleteUser(req, res) {
    const userEmail = req.params.id;
    try {
      const result = await userService.deleteUser(userEmail);
      res.json({ message: 'User deleted successfully', result });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = ProductController;
