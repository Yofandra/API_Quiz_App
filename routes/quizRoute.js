import { Router } from "express";
import { create, findAll, findByIdRoom, update, destroy, findOne } from "../controllers/quizController.js";
import authJwt from "../middlewares/authJwt.js";
const quizRoute = Router()

quizRoute.use(authJwt)
quizRoute.post("/", create)
quizRoute.get("/", findAll)
quizRoute.get("/room/:id", findByIdRoom)
quizRoute.get("/:id", findOne)
quizRoute.put("/:id", update)
quizRoute.delete("/:id", destroy)

export default quizRoute