const ProductRepository = require('../repositories/productRepository');
const utils = require("../utils")
const productRepository = new ProductRepository();

// Función para obtener todos los productos
async function getAllProducts() {
  return productRepository.getAllProducts();
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

// Función para actualizar un usuario
async function updateUser(userEmail, userData) {
  if (userData.email) {
    throw new Error("No se puede modificar el correo electrónico");
  }

  return productRepository.updateUser(userEmail, userData);
}

// Función para eliminar un usuario
async function deleteUser(userEmail) {
  return productRepository.deleteUser(userEmail);
}

module.exports = {
  getAllProducts,
  findProductsByName,
  createProduct,
  getProductByCode,
  updateUser,
  deleteUser
};
