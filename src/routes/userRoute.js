import express from "express";
import UserController from "../controllers/UserController.js";
import authUser from "../middlewares/auth/checkToken.js";

const router = express.Router();

router
  .get('/users/:id', authUser.checkToken, UserController.getUser)
  .get('/users', authUser.checkToken, UserController.getAllUsers)
  .delete('/users/:id', authUser.checkToken, UserController.deleteUser)

export default router;