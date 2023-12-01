const productModel = require('../models/products.model');

class ProductRepository {
  // Función para buscar todos los productos
  async getAllProducts() {
    try {
      const products = await productModel.find();
      return { result: "success", payload: products };
    } catch (error) {
      throw new Error(`Error en ProductRepository.getAllProducts: ${error.message}`);
    }
  }

  // Función para buscar productos por nombre
async findProductsByName(productName) {
  try {
    const products = await productModel.find({ title: { $regex: productName, $options: "i" } });
    return products;
  } catch (error) {
    throw new Error(`Error in findProductsByName: ${error.message}`);
  }
}

  async getProductByCode(codeProduct) {
    try {
      const product = await productModel.findOne({code: codeProduct});
      return product || null
    } catch (error) {
      throw new Error(`Error en ProductRepository.getProductByCode: ${error.message}`);
    }
  }


  async createProduct(productData) {
    try {
      const newProduct = new productModel(productData);
      await newProduct.save();
      return newProduct;
    } catch (error) {
      throw new Error(`Error en ProductRepository.createProduct: ${error.message}`);
    }
  }

  async updateUser(userEmail, userData) {
    try {
      const updatedUser = await productModel.updateOne({email: userEmail}, userData);
      return updatedUser;
    } catch (error) {
      throw new Error(`Error en ProductRepository.updateUser: ${error.message}`);
    }
  }

  async deleteUser(userEmail) {
    try {
      const result = await productModel.deleteOne({email: userEmail});
      return result;
    } catch (error) {
      throw new Error(`Error en ProductRepository.deleteUser: ${error.message}`);
    }
  }
}

module.exports = ProductRepository;
