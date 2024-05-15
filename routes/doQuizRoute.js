import { Router } from "express";
import authJwt from "../middlewares/authJwt.js";
import { findQuestion, findQuiz, findRoom, saveScore } from "../controllers/doQuizController.js";
const doQuizRoute = Router()

doQuizRoute.use(authJwt)
doQuizRoute.get("/room", findRoom)
doQuizRoute.get("/room/:id", findQuiz)
doQuizRoute.get("/quiz/:id", findQuestion)
doQuizRoute.post("/quiz/:id", saveScore)

export default doQuizRoute