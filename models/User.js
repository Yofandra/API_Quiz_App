import sql from "./connection.js";

const User = function (user) {
  this.name = user.name;
  this.username = user.username;
  this.password = user.password;
};

User.create = (newUser, result) => {
  sql.query("INSERT INTO users SET ?", newUser, (err, res) => {
    if (err) {
      result(err, null);
    }
    result(null, { id: res.insertId, newUser });
  });
};

User.getAll = (result) => {
  sql.query("SELECT * FROM users", (err, res) => {
    if (err) {
      result(err, null);
    }
    result(null, res);
  });
};

User.getById = (id, result) => {
  sql.query(`SELECT * FROM users WHERE id = ${id}`, (err, res) => {
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

User.getByUsername = (username, result) => {
  sql.query(`SELECT * FROM users WHERE username = ?`,username, (err, res) => {
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

User.getUserRole = (id, result) => {
  sql.query(`SELECT role FROM users WHERE id = ?`, id, (err, res) => {
    if (err) {
      result(err, null);
      return;
    }
    const role = res[0].role; 
    result(null, role); 
  });
};

User.update = (id, data, result) => {
  sql.query("UPDATE users SET name = ?, username = ?, password = ? WHERE id = ?",
    [data.name, data.username, data.password, id],(err, res) => {
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

User.delete = (id, result) => {
  sql.query("DELETE FROM user WHERE id = ?", id, (err,res) =>{
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

export default User;
