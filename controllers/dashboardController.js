import Score from "../models/Score.js";
import Quiz from "../models/Quiz.js";
import errorHandler from "../middlewares/errorHandler.js";

export const findQuizScore = (req, res) => {
  Quiz.getQuizScore(req.userId, (err, data) => {
    if (err) {
      if (err.type === "not_found") {
        const error = new Error("Not_Found");
        return errorHandler(error, req, res);
      } else {
        const error = new Error(err.message);
        return errorHandler(error, req, res);
      }
    } else {
      res.send(data);
    }
  });
};
