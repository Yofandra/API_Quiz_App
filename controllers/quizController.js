import Quiz from "../models/Quiz.js";
import Room from "../models/Room.js";
import User from "../models/User.js";
import errorHandler from "../middlewares/errorHandler.js";

const handleAuthRoom = (req, res, reqParams, callback) => {
  Room.getUserId(reqParams, (err, user_id) => {
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
  handleAuthRoom(req, res, req.body.room_id, async (user_id) => {
    const userIdFromToken = req.userId;
    const newQuiz = new Quiz({
      quiz_name: req.body.quiz_name,
      room_id: req.body.room_id,
      user_id: userIdFromToken,
    });

    Quiz.create(newQuiz, (err, data) => {
      if (err) {
        const error = new Error(err.message);
        return errorHandler(error, req, res);
      }
      res.send(data);
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
        Quiz.getAll((err, data) => {
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

export const findByIdRoom = async (req, res) => {
  Room.getUserId(req.params.id, (err, user_id) => {
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
    }
  });
};

const handleAuthorization = (req, res, callback) => {
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
      callback(user_id);
    }
  });
};

export const findOne = (req, res) => {
  handleAuthorization(req, res, async (user_id) => {
    Quiz.getById(req.params.id, (err, data) => {
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
    handleAuthRoom(req, res, req.body.room_id, async (user_id) => {
      const quizData = new Quiz(req.body);
      Quiz.update(req.params.id, quizData, (err, data) => {
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
    Quiz.delete(req.params.id, (err, data) => {
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
