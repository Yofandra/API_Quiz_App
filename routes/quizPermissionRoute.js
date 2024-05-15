import { Router } from "express";
import { create, findAll, findByIdQuiz, findOne, update, destroy } from "../controllers/quizPermissionController.js";
import authJwt from "../middlewares/authJwt.js";
const quizPermissionRoute = Router();

quizPermissionRoute.use(authJwt);
quizPermissionRoute.post("/", create);
quizPermissionRoute.get("/", findAll)
quizPermissionRoute.get("/quiz/:id", findByIdQuiz)
quizPermissionRoute.get("/:id", findOne)
quizPermissionRoute.put("/:id", update)
quizPermissionRoute.delete("/:id", destroy)

export default quizPermissionRoute;
