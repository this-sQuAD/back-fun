import express from "express";
import AuthController from "../controllers/AuthController.js";

const router = express.Router();

router
  .post('/auth/register', AuthController.register)
  .post('/auth/login', AuthController.login)

export default router;