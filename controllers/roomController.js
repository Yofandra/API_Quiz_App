import Room from "../models/Room.js";
import errorHandler from "../middlewares/errorHandler.js";

export const create = (req, res) => {
  const userIdFromToken = req.userId;
  const newRoom = new Room({
    name_room: req.body.name_room,
    user_id: userIdFromToken,
  });

  Room.create(newRoom, (err, data) => {
    if (err) {
      const error = new Error(err.message);
      return errorHandler(error, req, res);
    }
    res.send(data);
  });
};

export const findAll = (req, res) => {
  Room.getAll((err, data) => {
    if (err) {
      const error = new Error(err.message);
      return errorHandler(error, req, res);
    }
    res.send(data);
  });
};

export const findOne = (req, res) => {
  Room.getById(req.params.id, (err, data) => {
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

const handleAuthorization = (req, res, callback) => {
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
      if (user_id !== req.userId) {
        const error = new Error("Unauthorized");
        return errorHandler(error, req, res);
      }
      callback(user_id);
    }
  });
};

export const update = async (req, res) => {
  handleAuthorization(req, res, async (user_id) => {
    const roomData = new Room(req.body);
    Room.update(req.params.id, roomData, (err, data) => {
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
    Room.delete(req.params.id, (err, data) => {
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
