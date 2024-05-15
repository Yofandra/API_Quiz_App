import { Router } from "express";
import authJwt from "../middlewares/authJwt.js";
import {findQuizScore } from "../controllers/dashboardController.js";
const dashboardRoute = Router()

dashboardRoute.use(authJwt)
dashboardRoute.get("/", findQuizScore)

export default dashboardRoute