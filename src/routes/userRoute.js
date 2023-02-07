import express from "express";
import UserController from "../controllers/UserController.js";
import authUser from "../middlewares/auth/checkToken.js";

const router = express.Router();

router
  .get('/user/:id', authUser.checkToken, UserController.getUser)
  .get('/user', authUser.checkToken, UserController.getAllUsers)
  .delete('/user/:id', authUser.checkToken, UserController.deleteUser)

export default router;