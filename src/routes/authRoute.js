import express from "express";
import AuthController from "../controllers/AuthController.js";

const router = express.Router();

router
  .post('/auth/register', AuthController.register)
  .post('/auth/login', AuthController.login)
  .post('/auth/forgot_password', AuthController.forgot_password)
  .post('/auth/reset_password', AuthController.reset_password)

export default router;