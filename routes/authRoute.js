import { Router } from "express";
import { login, register } from "../controllers/authController.js";
const authRoute = Router();

authRoute.post("/login", login);
authRoute.post("/register", register);

export default authRoute;
