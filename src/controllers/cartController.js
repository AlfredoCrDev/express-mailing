const cartService = require('../services/cartService.js');

class CartController {

  async addnewCart(req, res) {
    try {
      const newCart = req.body
      const cart = await cartService.addNewCart(newCart)
      res.status(200).send({message: "Nuevo carrito creado", cart})
      console.log("Carrito creado con éxito");
    } catch (error) {
      console.log("Error al enviar productos al carrito", error);
      res.status(500).send({message: "Error al crear un nuevo carrito"})    
    }
  }

  async getAllCarts(req, res){
    try {
      const carts = await cartService.getAllCarts()
      res.status(200).send({ message: "Lista de carritos obtenida", carts})
    } catch (error) {
      res.status(500).send({message: "Error al obtener los carritos"})    
    }
  }

  async getCartById(req, res){
    const cartId = req.params.cid
    try {
      const result = await cartService.getCartById(cartId);
      if (result.success) {
        return res.status(200).json(result);
      }  else {
        return res.status(404).json(result);
      }
    } catch (error) {
      res.status(500).send({message: "Error al obtener el carrtio por ID"})    
    }
  }

  async addProductToCart(req, res) {
    const { quantity } = req.query;
    const cartId = req.params.cid
    const productId = req.params.pid
    try {
      const result = await cartService.addProductToCart(cartId, productId, quantity);
  
      if (result.success) {
        res.status(200).json(result);
      } else {
        res.status(400).json(result);
      }
    } catch (error) {
      res.status(500).json({ success: false, message: "Error al agregar producto al carrito" });
    }
  }

async removeProductFromCart(req, res) {
  const cartId = req.params.cid;
  const productId = req.params.pid;

  try {
    const result = await cartService.removeProductFromCart(cartId, productId);

    if (result.success) {
      res.status(200).json(result);
    } else {
      res.status(400).json(result);
    }
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar el producto del carrito" });
  }
}

async deleteCart(req, res){
  const cartId = req.params.cid
  try {
    const result = await cartService.deleteCart(cartId);
    if (result.success) {
      return res.status(200).json({message: "Cart deleted successfully"});
    }  else {
      return res.status(404).json(result);
    }
  } catch (error) {
    res.status(500).send({message: "Error al eliminar el carrtio por ID"})    
  }
}

async updateCartItemQuantity(req, res) {
  const { cartId, productId, newQuantity } = req.body;

  try {
    const result = await cartService.updateCartItemQuantity(cartId, productId, newQuantity);

    if (result.success) {
      res.status(200).json(result);
    } else {
      res.status(404).json(result);
    }
  } catch (error) {
    res.status(500).json({ message: "Error al actualizar la cantidad del producto en el carrito" });
  }
}

//   async getAllProducts(req, res) {
//     try {
//       const products = await productService.getAllProducts();
//       res.json(products);
//     } catch (error) {
//       res.status(500).json({ error: error.message });
//     }
//   }

//   async findProductsByName(req, res) {
//     const productName = req.body.name
//     try {
//       const products = await productService.findProductsByName(productName)
//       res.json({ status: 'success', products});
//     } catch (error) {
//       res.status(500).json({ error: error.message });
//     }
//   }

// async createProduct(req, res) {
//   const { title, description, price, stock, category, code } = req.body;
  
//   try {
//     // Verificar si el producto existe
//     const productExists = await productService.getProductByCode(code);
    
//     if (productExists) {
//       return res.status(400).json({ status: "error", message: `El código ${code} ya esta siendo utilizado` });
//     }

//     // Crear el producto si el código no está en uso
//     const product = await productService.createProduct({ title, description, price, stock, category, code });    
//     res.json({ status: "success", product });
//   } catch (error) {
//     console.log("Error al crear al el producto: ", error);
//     res.status(400).json({ status: "error", message: error.message });
//   }
// }


//   async updateProduct(req, res) {
//     try {
//       const productId = req.params.pid;
//       const productData = req.body;
//       const updatedProduct = await productService.updateProduct(productId, productData);
//       res.json(updatedProduct);
//     } catch (error) {
//       res.status(500).json({ error: error.message });
//     }
//   }

//   async deleteProduct(req, res) {
//     const productId = req.params.id;
//     try {
//       const product = await productService.deleteProduct(productId);
//       res.json({ message: 'Product deleted successfully', product });
//     } catch (error) {
//       res.status(500).json({ error: error.message });
//     }
//   }
}

module.exports = CartController;