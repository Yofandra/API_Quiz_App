import { Router } from "express";
import authJwt from "../middlewares/authJwt.js";
import { findRankByIdQuiz, destroy } from "../controllers/scoreController.js";
const scoreRoute = Router()

scoreRoute.use(authJwt)
scoreRoute.get("/quiz/:id", findRankByIdQuiz)
scoreRoute.delete("/:id", destroy)

export default scoreRoute