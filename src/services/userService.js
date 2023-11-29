const UserRepository = require('../repositories/userRepository');

class UserService {
  constructor() {
    this.userRepository = new UserRepository();
  }

  async getAllUsers() {
    return await this.userRepository.getAllUsers();
  }

  async getUserByEmail(userEmail) {
    return await this.userRepository.getUserByEmail(userEmail);
  }

  async createUser(userData) {
    return await this.userRepository.createUser(userData);
  }

  async updateUser(userEmail, userData) {
    if(userData.email){
      throw new Error("No se puede modificar el correo electrónico")
    }
    return await this.userRepository.updateUser(userEmail, userData);
  }

  async deleteUser(userEmail) {
    return await this.userRepository.deleteUser(userEmail);
  }
}

module.exports = UserService;
