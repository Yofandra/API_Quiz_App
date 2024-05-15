import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import errorHandler from "../middlewares/errorHandler.js";

export const login = (req, res) => {
  const { username, password } = req.body;

  User.getByUsername(username, async (err, user) => {
    if (err) {
      if (err.type === "not_found") {
        const error = new Error("User_not_Registered");
        return errorHandler(error, req, res);
      } else {
        const error = new Error(err.message);
        return errorHandler(error, req, res);
      }
    }

    const userPassword = user.password;
    const isValidPassword = await bcrypt.compare(password, userPassword);
    if (!isValidPassword) {
      const error = new Error("Invalid_Password");
      return errorHandler(error, req, res);
    }

    const token = jwt.sign(
      { userId: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
    res.json({ token });
  });
};

export const register = async (req, res) => {
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

  const newUser = new User({
    name: req.body.name,
    username: req.body.username,
    password: encryptedPassword,
  });

  User.create(newUser, (err, data) => {
    if (err) {
      const error = new Error(err.message);
      return errorHandler(error, req, res);
    }
    res.send(data);
  });
};
