import Question from "../models/Question.js";
import Quiz from "../models/Quiz.js";
import Score from "../models/Score.js";
import Room from "../models/Room.js";
import errorHandler from "../middlewares/errorHandler.js";
import Quiz_Permission from "../models/Quiz_Permission.js";

export const findRoom = async (req, res) => {
  Room.getAll((err, data) => {
    if (err) {
      const error = new Error(err.message);
      return errorHandler(error, req, res);
    }
    res.send(data);
  });
};

export const findQuiz = async (req, res) => {
  Quiz.getByIdRoom(req.params.id, (err, data) => {
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

export const findIdRoom = (req, res, callback) => {
  Quiz.getRoomId(req.params.id, (err, room_id) => {
    if (err) {
      if (err.type === "not_found") {
        const error = new Error("Not_Found");
        return errorHandler(error, req, res);
      } else {
        const error = new Error(err.message);
        return errorHandler(error, req, res);
      }
    } else {
      callback(room_id);
    }
  });
};

const checkPermission = async (userId, quizId) => {
  return new Promise((resolve, reject) => {
    Quiz_Permission.getByUserIdAndQuizId(userId, quizId, (err, data) => {
      if (err) {
        if (err.type === "not_found") {
          resolve(false);
        } else {
          reject(err);
        }
      } else {
        resolve(true);
      }
    });
  });
};

export const findQuestion = async (req, res) => {
  findIdRoom(req, res, async (room_id) => {
    if (room_id !== 1) {
      const permissionExist = await checkPermission(req.userId, req.params.id);
      if (!permissionExist) {
        const error = new Error("Unauthorized");
        return errorHandler(error, req, res);
      }
    }
    Question.getQuestion(req.params.id, (err, data) => {
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
  });
};

export const saveScore = async (req, res) => {
  findIdRoom(req, res, async (room_id) => {
    if (room_id !== 1) {
      const permissionExist = await checkPermission(req.userId, req.params.id);
      if (!permissionExist) {
        const error = new Error("Unauthorized");
        return errorHandler(error, req, res);
      }
    }
    const userAnswers = req.body;
    const alreadyDone = await new Promise((resolve, reject) => {
      Score.getByIdUser(req.userId, (err, data) => {
        if (err) {
          if (err.type === "not_found") {
            resolve(false);
          } else {
            reject(err);
          }
        } else {
          resolve(true);
        }
      });
    });

    if (alreadyDone) {
      const error = new Error("Score_Exist");
      return errorHandler(error, req, res);
    }
    Question.getAnswer(req.params.id, async (err, correctAnswers) => {
      if (err) {
        if (err.type === "not_found") {
          const error = new Error("Not_Found");
          return errorHandler(error, req, res);
        } else {
          const error = new Error(err.message);
          return errorHandler(error, req, res);
        }
      }
      let score = 0;
      for (let i = 0; i < correctAnswers.length; i++) {
        if (correctAnswers[i].answer === userAnswers[i].answer) {
          score++;
        }
      }
      const finalScore = (score / correctAnswers.length) * 100;
      const newScore = new Score({
        score: finalScore,
        quiz_id: req.params.id,
        user_id: req.userId,
      });
      Score.storeScore(newScore, (err, data) => {
        if (err) {
          const error = new Error(err.message);
          return errorHandler(error, req, res);
        }
        res.send(data);
      });
    });
  });
};
