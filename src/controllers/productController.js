const productService = require('../services/productService');
// const logger = require("../logger.js")

class ProductController {
  async getAllProducts(req, res) {
    try {
      const { limit = 10 , page = 1 , sort, status, category } = req.query;
      const result = await productService.getAllProducts( {limit, page, sort, status, category} );
      res.json(result);
    } catch (error) {
      req.logger.error('Error en ProductController.getProducts:', error);
      res.status(500).json({ status: 'error', message: 'Error interno del servidor' });
    }
  }

  async findProductsByName(req, res) {
    const productName = req.body.name
    try {
      const products = await productService.findProductsByName(productName)
      if (!products || !products.length){
        req.logger.warn(`No existe producto con el nombre ${productName}`)
        return res.status(404).json({message:'No se encontraron productos con ese nombre.'})
        }
      req.logger.info("Producto encontrado con éxito")
      res.json({ status: 'success', products});
    } catch (error) {
      req.logger.error(`Error al buscar el producto por nombre ${productName}:`, error);
      res.status(500).json({ error: error.message });
    }
  }

async createProduct(req, res) {
  const { title, description, price, stock, category, code } = req.body;  
  try {
    // Verificar si el producto existe
    const productExists = await productService.getProductByCode(code);
    if (productExists) {
      req.logger.warn(`El codigo ${code} ya esta siendo utilizado`)
      return res.status(400).json({ status: "error", message: `El código ${code} ya esta siendo utilizado` });
    }
    const product = await productService.createProduct({ title, description, price, stock, category, code }); 
    if(!product){
      req.logger.warn("Faltan datos para crear el producto")
      throw new Error('Faltan datos para crear un producto')
    }
    req.logger.info("Producto creado con éxito")
    res.status(200).json({ status: "success", product });
  } catch (error) {
    req.logger.error("Error al crear al el producto: ", error);
    res.status(400).json({ status: "error", message: error.message });
  }
}

  async updateProduct(req, res) {
    try {
      const productId = req.params.pid;
      const productData = req.body;
      const updatedProduct = await productService.updateProduct(productId, productData);
      if (!updatedProduct) {
        req.logger.warn(`No se ha podido actualizar el producto con id "${productId}"`);
        return res.status(404).json({ message: "No se ha encontrado el producto" });
        }
      req.logger.info(`Se ha actualizado correctamente el producto con id "${productId}"`);
      res.json(updatedProduct);
    } catch (error) {
      req.logger.error(`Error al actualizar el producto con id "${productId}": `, error);
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
        req.logger.warn("Error al tratar de eliminar el producto")
        res.status(400).json({ status: "error", message: "Error al eliminar el porducto"})
      }
    } catch (error) {
      req.logger.error("Error al eliminar el producto: ", error);
      res.status(500).json({ status: 'error', message: 'Error interno del servidor' });
    }
  }
}

module.exports = ProductController;
