const ProductRepository = require('../repositories/productRepository');
const utils = require("../utils")
const productRepository = new ProductRepository();

// Función para obtener todos los productos
async function getAllProducts() {
  try {
    const result = await productRepository.getAllProducts();
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
  const newProduct = {
    title,
    description,
    price,
    stock,
    category,
    code,
  };
  return productRepository.createProduct(newProduct);
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
  return productRepository.deleteProduct(productId);
}

module.exports = {
  getAllProducts,
  findProductsByName,
  createProduct,
  getProductByCode,
  updateProduct,
  deleteProduct
};
