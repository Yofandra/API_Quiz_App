import { Router } from "express";
import { create, findAll, findOne, update, destroy } from "../controllers/roomController.js";
import authJwt from "../middlewares/authJwt.js";
const roomRoute = Router()

roomRoute.use(authJwt)
roomRoute.post("/", create)
roomRoute.get("/", findAll)
roomRoute.get("/:id", findOne)
roomRoute.put("/:id", update)
roomRoute.delete("/:id", destroy)

export default roomRoute