import express from "express";
import UserController from "../controllers/UserController.js";
import authUser from "../middlewares/auth/checkToken.js";

const router = express.Router();

router
  .get('/users/:id', authUser.checkToken, UserController.getUser)
  .get('/users', authUser.checkToken, UserController.getAllUsers)
  .post('/users/register', authUser.checkToken, authUser.rolePermissions, UserController.register)
  .put('/users/:id', authUser.checkToken, UserController.updateUser)
  .delete('/users/:id', authUser.checkToken, authUser.rolePermissions, UserController.deleteUser)

export default router;