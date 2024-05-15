import Quiz from "../models/Quiz.js";
import Room from "../models/Room.js";
import User from "../models/User.js";
import Quiz_Permission from "../models/Quiz_Permission.js";
import errorHandler from "../middlewares/errorHandler.js";

const handleAuthQuiz = (req, res, reqParams, callback) => {
  Quiz.getUserId(reqParams, (err, user_id) => {
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
};

const handlePublicRoom = (req, res, reqParams, callback) => {
  Quiz.getRoomId(reqParams, (err, room_id) => {
    if (err) {
      if (err.type === "not_found") {
        const error = new Error("Not_Found");
        return errorHandler(error, req, res);
      } else {
        const error = new Error(err.message);
        return errorHandler(error, req, res);
      }
    } else {
      if (room_id === 1) {
        const error = new Error("Not_Req_Permission");
        return errorHandler(error, req, res);
      }
      callback(room_id);
    }
  });
};

export const create = async (req, res) => {
  handleAuthQuiz(req, res, req.body.quiz_id, async (user_id) => {
    handlePublicRoom(req, res, req.body.quiz_id, async (room_id) => {
      const newQuizPermission = new Quiz_Permission({
        quiz_id: req.body.quiz_id,
        user_id: req.body.user_id,
      });
      Quiz_Permission.create(newQuizPermission, (err, data) => {
        if (err) {
          const error = new Error(err.message);
          return errorHandler(error, req, res);
        }
        res.send(data);
      });
    });
  });
};

export const findAll = (req, res) => {
  User.getUserRole(req.userId, (err, role) => {
    if (err) {
      const error = new Error(err.message);
      return errorHandler(error, req, res);
    } else {
      if (role === "user") {
        const error = new Error("Unauthorized");
        return errorHandler(error, req, res);
      } else {
        Quiz_Permission.getAll((err, data) => {
          if (err) {
            const error = new Error(err.message);
            return errorHandler(error, req, res);
          }
          res.send(data);
        });
      }
    }
  });
};

export const findByIdQuiz = async (req, res) => {
  handleAuthQuiz(req, res, req.params.id, async (user_id) => {
    Quiz_Permission.getByIdQuiz(req.params.id, (err, data) => {
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
  Quiz_Permission.getQuizId(req.params.id, (err, quiz_id) => {
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
    Quiz_Permission.getById(req.params.id, (err, data) => {
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
  handleAuthQuiz(req, res, req.body.quiz_id, async (user_id) => {
    handlePublicRoom(req, res, req.body.quiz_id, async (user_id) => {
      const quizPermissionData = new Quiz_Permission(req.body);
      Quiz_Permission.update(req.params.id, quizPermissionData, (err, data) => {
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
  });
};

export const destroy = (req, res) => {
  handleAuthorization(req, res, async (user_id) => {
    Quiz_Permission.delete(req.params.id, (err, data) => {
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
