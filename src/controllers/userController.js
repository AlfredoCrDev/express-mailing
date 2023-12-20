const userService = require('../services/userService');
const utils = require("../utils")
const passport = require("passport")
const logger = require("../logger")

class UserController {
  async getAllUsers(req, res) {
    try {
      const users = await userService.getAllUsers();
      logger.info("Lista de usuarios")
      res.json(users);
    } catch (error) {
      logger.error(`Error al obtener la lista de usuarios: ${error}`)
      res.status(500).json({ error: error.message });
    }
  }

  async loginUser(req, res) {
    try {
      passport.authenticate('login', { session: false }, (err, user, info) => {
        if (err) {
          console.error('Error en autenticación:', err);
          return res.status(500).json({ status: 'error', message: 'Error interno del servidor' });
        }
        if (!user) {
          return res.status(401).json({ status: 'error', message: 'Credenciales incorrectas' });
        }
        const token = utils.generateToken(user);
        res.cookie('token', token, { httpOnly: true, maxAge: 60 * 60 * 1000 });
        res.json({ status: 'success', user, token });
      })(req, res);
    } catch (error) {
      logger.error('Error al tratar de hacer login:', error);
      res.status(500).json({ status: 'error', message: 'Se ha producido un error inesperado' });
    }
  }

  async getUserByEmail(req, res) {
    const userEmail = req.params.email;
    try {
      const user = await userService.getUserByEmail(userEmail);
      if (!user) {
        logger.warn("Usuario no encontrado")
        return res.status(404).json({ status: "error", message: `Usuario con email "${userEmail}" no
        encontrado`});
      }
      logger.info(`Información del usuario "${user.name}"`)
      res.status(200).json({status: "success", message: "Usuario encontrado con éxito"});
    } catch (error) {
      logger.error(`Error al buscar el usuario por su email: ${error}`);
      res.status(500).json({ error: error.message });
    }
  }

  async getUserById(req, res) {
    const userId = req.params.uid;
    try {
      const user = await userService.getUserById(userId);
      if(!user){
        logger.warn("El usuario solicitado no existe");
        return res.status(404).send();
        }
      logger.info(`Mostrando información del usuario con id "${userId}":`, user);
      res.json({status: "success", message: "Usuario encontrado"});
    } catch (error) {
      logger.error(`Ocurrió un error al obtener el usuario por su ID: ${error}`);
      res.status(500).json({ error: error.message });
    }
  }

async createUser(req, res) {
  const { first_name, last_name, email, age, password, rol } = req.body;
  try {
    const emailExists = await userService.getUserByEmail(email);
    if (emailExists) {
      logger.warn(`Ya hay un usuario registrado con el correo electrónico "${email}"`);
      return res.status(400).json({ status: "error", message: "El correo electrónico ya está en uso" });
    }

    // Crear el usuario si el correo electrónico no está en uso
    const user = await userService.createUser({ first_name, last_name, email, age, password, rol });    
    let token = utils.generateToken(user);
    logger.info(`Creó el usuario "${user.first_name} ${user.last_name}" con exito.`);
    res.status(200).json({ status: "success", token, redirect: "/" });
  } catch (error) {
    logger.error("Error al crear al usuario en el controlador: ", error);
    res.status(400).json({ status: "error", message: error.message });
  }
}

  async updateUser(req, res) {
    const userId = req.params.id;
    const userData = req.body;
    try {
      const updatedUser = await userService.updateUser(userId, userData);
      logger.info("Usuario actualizado con éxito")
      res.json(updatedUser);
    } catch (error) {
      logger.error(`Error al actualizar el usuario con id "${userId}": `, error);
      res.status(500).json({ error: error.message });
    }
  }

  async deleteUser(req, res) {
    const userEmail = req.params.id;
    try {
      const result = await userService.deleteUser(userEmail);
      if (!result) throw new Error('No se pudo eliminar el usuario');
      logger.info(`Se ha eliminado correctamente al usuario con la dirección de correo "${userEmail}"`);
      res.json({ status:"success", message: 'User deleted successfully', result });
    } catch (error) {
      logger.error(`Error al intentar borrar el usuario con la dirección de correo "${userEmail}".`, error);
      res.status(500).json({ error: error.message });
    }
  }

  async getUserInfo(req, res) {
    res.send({status:"success", payload:req.user})
  }

  async logoutUser(req, res) {
    res.clearCookie('token'); // No funciona buscar manera de eliminar la cookie
    res.redirect('/');
  };
}

module.exports = UserController;
