import express from "express";
const app = express();
import dotenv from "dotenv";
import questionRoute from "./routes/questionRoute.js";
import authRoute from "./routes/authRoute.js";
import profileRoute from "./routes/profileRoute.js";
import connection from "./models/connection.js";
import loggingMiddleware from "./middlewares/loggingMiddleware.js";
import errorHandler from "./middlewares/errorHandler.js";
import roomRoute from "./routes/roomRoute.js";
import quizRoute from "./routes/quizRoute.js";
import doQuizRoute from "./routes/doQuizRoute.js";
import scoreRoute from "./routes/scoreRoute.js";
import dashboardRoute from "./routes/dashboardRoute.js";
import quizPermissionRoute from "./routes/quizPermissionRoute.js";
dotenv.config();

const PORT = process.env.PORT;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(loggingMiddleware);
app.get("/", (req, res) => res.json({ msg: "Hello World" }));
app.use("/question", questionRoute);
app.use("/auth", authRoute);
app.use("/profile", profileRoute);
app.use("/room", roomRoute);
app.use("/quiz", quizRoute);
app.use("/doQuiz", doQuizRoute);
app.use("/score", scoreRoute);
app.use("/dashboard", dashboardRoute);
app.use("/quizPermission", quizPermissionRoute);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

connection.getConnection((err) => {
  if (err) {
    console.log("Error connecting to mysql :", err);
    server.close();
  } else {
    console.log("Connect to mysql successfully");
  }
});
