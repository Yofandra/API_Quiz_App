import Question from "../models/Question.js";
import Quiz from "../models/Quiz.js";
import errorHandler from "../middlewares/errorHandler.js";

const handleAuthQuiz = (req, res, requestParams, callback) => {
  Quiz.getUserId(requestParams, (err, user_id) => {
    if (err) {
      if (err.type === "not_found") {
        const error = new Error("Not_Found");
        return errorHandler(error, req, res);
      } else {
        const error = new Error(err.message);
        return errorHandler(error, req, res);
      }
    } else {
      if (user_id !== req.userId && user_id !== null) {
        const error = new Error("Unauthorized");
        return errorHandler(error, req, res);
      }
      callback(user_id);
    }
  });
};

export const create = async (req, res) => {
  handleAuthQuiz(req, res, req.body.quiz_id, async (user_id) => {
    const newQuestion = new Question({
      question_text: req.body.question_text,
      option_a: req.body.option_a,
      option_b: req.body.option_b,
      option_c: req.body.option_c,
      answer: req.body.answer,
      quiz_id: req.body.quiz_id,
    });

    Question.create(newQuestion, (err, data) => {
      if (err) {
        const error = new Error(err.message);
        return errorHandler(error, req, res);
      }
      res.send(data);
    });
  });
};

export const findByIdQuiz = (req, res) => {
  handleAuthQuiz(req, res, req.params.id, async (user_id) => {
    Question.getByIdQuiz(req.params.id, (err, data) => {
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

const handleAuthorization = (req, res, callback) => {
  Question.getQuizId(req.params.id, (err, quiz_id) => {
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

export const findOne = (req, res) => {
  handleAuthorization(req, res, async (user_id) => {
    Question.getById(req.params.id, (err, data) => {
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

export const update = async (req, res) => {
  handleAuthorization(req, res, async (user_id) => {
    const questionData = new Question(req.body);
    Question.update(req.params.id, questionData, (err, data) => {
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

export const destroy = (req, res) => {
  handleAuthorization(req, res, async (user_id) => {
    Question.delete(req.params.id, (err, data) => {
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
