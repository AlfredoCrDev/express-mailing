const userModel = require('../models/user.model.js');

class UserRepository {
  async getAllUsers() {
    try {
      const users = await userModel.find();
      return { result: "success", payload: users };
    } catch (error) {
      throw new Error(`Error en UserRepository.getAllUsers: ${error.message}`);
    }
  }

  async getUserByEmail(userEmail) {
    try {
      const user = await userModel.findOne({email: userEmail});
      return user || null
    } catch (error) {
      throw new Error(`Error en UserRepository.getUserByEmail: ${error.message}`);
    }
  }

  async validEmail(userEmail) {
    try {
      const user = await userModel.findOne({ email: userEmail });
      return !!user; 
    } catch (error) {
      throw new Error(`Error en UserRepository.validEmail: ${error.message}`);
    }
  }
  

  async createUser(userData) {
    try {
      const newUser = new userModel(userData);
      await newUser.save();
      return newUser;
    } catch (error) {
      throw new Error(`Error en UserRepository.createUser: ${error.message}`);
    }
  }

  async updateUser(userEmail, userData) {
    try {
      const updatedUser = await userModel.updateOne({email: userEmail}, userData);
      return updatedUser;
    } catch (error) {
      throw new Error(`Error en UserRepository.updateUser: ${error.message}`);
    }
  }

  async deleteUser(userEmail) {
    try {
      const result = await userModel.deleteOne({email: userEmail});
      return result;
    } catch (error) {
      throw new Error(`Error en UserRepository.deleteUser: ${error.message}`);
    }
  }
}

module.exports = UserRepository;
