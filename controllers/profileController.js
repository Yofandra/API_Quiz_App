import User from "../models/User.js";
import bcrypt from "bcrypt";
import errorHandler from "../middlewares/errorHandler.js";

export const findAll = (req, res) => {
  User.getAll((err, data) => {
    if (err) {
      const error = new Error(err.message);
        return errorHandler(error, req, res);
    }
    res.send(data);
  });
};

export const findOne = (req, res) => {
  User.getById(req.params.id, (err, data) => {
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

export const update = async (req, res) => {
  const userIdFromToken = req.userId.toString();
  if (userIdFromToken !== req.params.id) {
    const error = new Error("Unauthorized");
    return errorHandler(error, req, res);
  }

  const userExist = await new Promise((resolve, reject) => {
    User.getByUsername(req.body.username, (err, data) => {
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

  if (userExist) {
    const error = new Error("Already_Exist");
    return errorHandler(error, req, res);
  }

  const encryptedPassword = await bcrypt.hash(req.body.password, 10);

  const userData = {
    name: req.body.name,
    username: req.body.username,
    password: encryptedPassword,
  };

  User.update(req.params.id, userData, (err, data) => {
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
