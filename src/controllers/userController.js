const userService = require('../services/userService');
const utils = require("../utils")

class UserController {
  async getAllUsers(req, res) {
    try {
      const users = await userService.getAllUsers();
      res.json(users);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getUserByEmail(req, res) {
    const userEmail = req.params.id;
    try {
      const user = await userService.getUserByEmail(userEmail);
      res.json(user);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

async createUser(req, res) {
  const { first_name, last_name, email, age, password, rol } = req.body;
  
  try {
    // Verificar si el correo electrónico ya está en uso
    const emailExists = await userService.validEmail(email);
    
    if (emailExists) {
      return res.status(400).json({ status: "error", message: "El correo electrónico ya está en uso" });
    }

    // Crear el usuario si el correo electrónico no está en uso
    const user = await userService.createUser({ first_name, last_name, email, age, password, rol });
    
    let token = utils.generateToken(user);
    res.json({ status: "success", token });
    console.log("Este es el Token: ", token);
  } catch (error) {
    console.log("Error al crear al usuario: ", error);
    res.status(400).json({ status: "error", message: error.message });
  }
}


  async updateUser(req, res) {
    const userId = req.params.id;
    const userData = req.body;
    try {
      const updatedUser = await userService.updateUser(userId, userData);
      res.json(updatedUser);
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

module.exports = UserController;
