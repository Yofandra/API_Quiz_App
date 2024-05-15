import { Router } from "express";
import { findAll, findOne, update } from "../controllers/profileController.js";
import authJwt from "../middlewares/authJwt.js";
const profileRoute = Router();

profileRoute.use(authJwt)
profileRoute.get("/:id", findOne);
profileRoute.get("/", findAll);
profileRoute.put("/:id", update);

export default profileRoute;
