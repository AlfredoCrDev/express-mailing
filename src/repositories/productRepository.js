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

  async updateProduct(productId, productData) {
    try {
      const updateData = await productModel.updateOne({_id: productId}, productData);
      if (updateData.modifiedCount > 0) {
        return {
          success: true,
          message: "Producto modificado correctamente",
        };
      } else {
        return {
          success: false,
          message: `No se encontró un producto con el ID: ${productId}`,
        };
      }
    } catch (error) {
      throw new Error(`Error en ProductRepository.updateProduct: ${error.message}`);
    }
  }

  async deleteProduct(productId) {
    try {
      const result = await productModel.deleteOne({_id: productId});
      return result;
    } catch (error) {
      throw new Error(`Error en ProductRepository.deleteProduct: ${error.message}`);
    }
  }
}

module.exports = ProductRepository;