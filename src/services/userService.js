const UserRepository = require('../repositories/userRepository');
const CartRepository = require('../repositories/cartRepository');
const utils = require("../utils")

// Instanciando clases
const userRepository = new UserRepository();
const cartRepository = new CartRepository()

// Función para obtener todos los usuarios
async function getAllUsers() {
  return userRepository.getAllUsers();
}

// Función para obtener un usuario por correo electrónico
async function getUserByEmail(userEmail) {
  return userRepository.getUserByEmail(userEmail);
}

// Función para crear un nuevo usuario
async function createUser({ first_name, last_name, email, age, password, rol }) {
  const newUser = {
    first_name,
    last_name,
    email,
    age,
    password: utils.createHash(password),
    rol,
  };

  return userRepository.createUser(newUser);
}

// Función para actualizar un usuario
async function updateUser(userEmail, userData) {
  if (userData.email) {
    throw new Error("No se puede modificar el correo electrónico");
  }

  return userRepository.updateUser(userEmail, userData);
}

// Función para eliminar un usuario
async function deleteUser(userEmail) {
  return userRepository.deleteUser(userEmail);
}

module.exports = {
  getAllUsers,
  getUserByEmail,
  createUser,
  updateUser,
  deleteUser
};
