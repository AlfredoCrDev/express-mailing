const ProductRepository = require('../repositories/productRepository');
const utils = require("../utils")
const productRepository = new ProductRepository();

// Función para obtener todos los productos
async function getAllProducts( {limit, page, sort, status, category} ) {
  try {
    const result = await productRepository.getAllProducts( {limit, page, sort, status, category} );
    return result;
  } catch (error) {
    console.log('Error en ProductService.getAllProducts:', error);
    throw error;
  }
}

// Función para obtener los productos por nombre
async function findProductsByName(productName) {
  return productRepository.findProductsByName(productName);
}

async function getProductByCode(codeProduct) {
  return productRepository.getProductByCode(codeProduct);
}

// Función para crear un nuevo producto
async function createProduct({ title, description, price, stock, category, code }) {
  try {
    const newProduct = {
      title,
      description,
      price,
      stock,
      category,
      code,
    };
    const product = productRepository.createProduct(newProduct); 
    return product
  } catch (error) {
    throw new Error(`Error in ProductService.createProduct: ${error.message}`);
  }
}

// Función para actualizar un producto
async function updateProduct(productId, productData) {
  try {
    if (productData.stock === 0) {
      productData.status = false;
    } else {
      productData.status = true;
    }
    return await productRepository.updateProduct(productId, productData)
  } catch (error) {
    throw new Error(`Error in ProductService.updateProduct: ${error.message}`);
  }
}

// Función para eliminar un producto
async function deleteProduct(productId) {
  try {
    const result = await productRepository.deleteProduct(productId);
    return result
  } catch (error) {
    // Manejar otros errores
    throw new Error(`Error en ProductService.deleteProduct: ${error.message}`);
  }
}

async function updateStock(productId, newStock){
  try {
    return await productRepository.updateStock(productId, newStock)
  } catch (error) {
    throw new Error(`Error en ProductService.updateStock: ${error.message}`);
  }
}

module.exports = {
  getAllProducts,
  findProductsByName,
  createProduct,
  getProductByCode,
  updateProduct,
  deleteProduct
};
