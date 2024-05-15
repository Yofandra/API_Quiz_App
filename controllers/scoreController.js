import Score from "../models/Score.js";
import Quiz from "../models/Quiz.js";
import errorHandler from "../middlewares/errorHandler.js";

const handleAuthorization = (req, res, callback) => {
  Score.getQuizId(req.params.id, (err, quiz_id) => {
    if (err) {
      if (err.type === "not_found") {
        const error = new Error("Not_Found");
        return errorHandler(error, req, res);
      } else {
        const error = new Error(err.message);
        return errorHandler(error, req, res);
      }
    } else {
      Quiz.getUserId(quiz_id, (err, user_id) => {
        if (err) {
          if (err.type === "not_found") {
            const error = new Error("Not_Found");
            return errorHandler(error, req, res);
          } else {
            const error = new Error(err.message);
            return errorHandler(error, req, res);
          }
        } else {
          if (user_id !== req.userId) {
            const error = new Error("Unauthorized");
            return errorHandler(error, req, res);
          }
          callback(user_id);
        }
      });
    }
  });
};

export const findRankByIdQuiz = async (req, res) => {
  Quiz.getUserId(req.params.id, (err, user_id) => {
    if (err) {
      if (err.type === "not_found") {
        const error = new Error("Not_Found");
        return errorHandler(error, req, res);
      } else {
        const error = new Error(err.message);
        return errorHandler(error, req, res);
      }
    } else {
      if (user_id !== req.userId) {
        const error = new Error("Unauthorized");
        return errorHandler(error, req, res);
      }
      Score.getRank(req.params.id, (err, data) => {
        if (err) {
          if (err.type === "not_found") {
            const error = new Error("Not_Found");
            return errorHandler(error, req, res);
          } else {
            const error = new Error(err.message);
            return errorHandler(error, req, res);
          }
        } else {
          const sortedData = data.sort((a, b) => b.score - a.score);
          res.send(sortedData);
        }
      });
    }
  });
};

export const destroy = (req, res) => {
  handleAuthorization(req, res, async (user_id) => {
    Score.delete(req.params.id, (err, data) => {
      if (err) {
        if (err.type === "not_found") {
          const error = new Error("Not_Found");
          return errorHandler(error, req, res);
        } else {
          const error = new Error(err.message);
          return errorHandler(error, req, res);
        }
      } else {
        res.send({ msg: "Data berhasil dihapus" });
      }
    });
  });
};
