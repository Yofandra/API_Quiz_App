import sql from "./connection.js";

const Room = function (room) {
  this.name_room = room.name_room;
  this.user_id = room.user_id;
};

Room.create = (newRoom, result) => {
  sql.query("INSERT INTO private_room SET ?", newRoom, (err, res) => {
    if (err) {
      result(err, null);
    }
    result(null, { id: res.insertId, newRoom });
  });
};

Room.getAll = (result) => {
  sql.query("SELECT * FROM private_room", (err, res) => {
    if (err) {
      result(err, null);
    }
    result(null, res);
  });
};

Room.getById = (id, result) => {
  sql.query(`SELECT * FROM private_room WHERE id = ${id}`, (err, res) => {
    if (err) {
      result(err, null);
      return;
    }
    if (res.length) {
      result(null, res[0]);
      return;
    }
    result({ type: "not_found" }, null);
  });
};

Room.getByName = (name_room, result) => {
  sql.query(`SELECT * FROM private_room WHERE name_room = ?`,name_room, (err, res) => {
    if (err) {
      result(err, null);
      return;
    }
    if (res.length) {
      result(null, res[0]);
      return;
    }
    result({ type: "not_found" }, null);
  });
};

Room.getUserId = (id, result) => {
  sql.query(`SELECT user_id FROM private_room WHERE id = ?`, id, (err, res) => {
    if (err) {
      result(err, null);
      return;
    }
    if (res.length === 0) {
      result({ type: "not_found" }, null);
      return;
    }
    const user_id = res[0].user_id; 
    result(null, user_id); 
  });
};

Room.update = (id, data, result) => {
  sql.query("UPDATE private_room SET name_room = ? WHERE id = ?",
    [data.name_room, id],(err, res) => {
      if (err) {
        result(err, null);
        return;
      }
      if (res.affectedRows == 0) {
        result({ type: "not_found" }, null);
        return;
      }
      result(null, { id: id, data });
    }
  );
};

Room.delete = (id, result) => {
  sql.query("DELETE FROM private_room WHERE id = ?", id, (err,res) =>{
    if (err) {
      result(err, null);
      return;
    }
    if (res.affectedRows == 0) {
      result({ type: "not_found" }, null);
      return;
    }
    result(null, res);
  })
}

export default Room;
