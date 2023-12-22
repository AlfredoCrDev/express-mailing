const express = require('express');
const router = express.Router();
const UserController = require('../controllers/userController.js');
const utils = require("../utils.js")
const userController = new UserController();

// APIs
router.get('/', userController.getAllUsers);
router.get('/userinfo', utils.authToken, userController.getUserInfo);
router.get("/byid/:uid", userController.getUserById)
router.get('/email/:email', userController.getUserByEmail);
router.post('/register', userController.createUser);
router.post('/login', userController.loginUser);
router.put('/:id', userController.updateUser);
router.delete('/:id', userController.deleteUser);
router.get("/logout", userController.logoutUser)
router.post("/forgot-password", userController.forgotPassword)


module.exports = router;