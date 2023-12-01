const express = require('express');
const router = express.Router();
const UserController = require('../controllers/userController.js');

const userController = new UserController();

// APIs
router.get('/', userController.getAllUsers);
router.get('/:id', userController.getUserByEmail);
router.post('/register', userController.createUser);
router.post('/login', userController.loginUser);
router.put('/:id', userController.updateUser);
router.delete('/:id', userController.deleteUser);


module.exports = router;