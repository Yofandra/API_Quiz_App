import { Router } from "express";
import { create, destroy, findByIdQuiz, findOne, update } from "../controllers/questionController.js";
import authJwt from "../middlewares/authJwt.js";
const questionRoute = Router()

questionRoute.use(authJwt)
questionRoute.post("/", create)
questionRoute.get("/quiz/:id", findByIdQuiz)
questionRoute.get("/:id", findOne)
questionRoute.put("/:id", update)
questionRoute.delete("/:id", destroy)

export default questionRoute