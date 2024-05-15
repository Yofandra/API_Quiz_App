import sql from "./connection.js";

const Quiz_Permission = function(quiz_permission){
  this.quiz_id = quiz_permission.quiz_id
  this.user_id = quiz_permission.user_id
}

Quiz_Permission.create = (newQuizPermission, result) => {
  sql.query("INSERT INTO quiz_permission SET ?", newQuizPermission, (err, res) => {
    if (err) {
      result(err, null);
    }
    result(null, { id: res.insertId, newQuizPermission }); 
  });
};

Quiz_Permission.getAll = (result) => {
  sql.query("SELECT * FROM quiz_permission", (err, res) => {
    if (err) {
      result(err, null);
    }
    result(null, res);
  });
};

Quiz_Permission.getByIdQuiz = (quiz_id, result) => {
  sql.query(
    `SELECT * FROM quiz_permission WHERE quiz_id = ${quiz_id}`,
    (err, res) => {
      if (err) {
        result(err, null);
        return;
      }
      if (res.length) {
        result(null, res);
        return;
      }
      result({ type: "not_found" }, null);
    }
  );
};

Quiz_Permission.getById = (id, result) => {
  sql.query(`SELECT * FROM quiz_permission WHERE id = ${id}`, (err, res) => {
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

Quiz_Permission.getByUserIdAndQuizId = (user_id, quiz_id, result) => {
  sql.query(`SELECT * FROM quiz_permission WHERE user_id = ${user_id} AND quiz_id = ${quiz_id}`, (err, res) => {
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

Quiz_Permission.getQuizId = (id, result) => {
  sql.query(`SELECT quiz_id FROM quiz_permission WHERE id = ?`, id, (err, res) => {
    if (err) {
      result(err, null);
      return;
    }
    if (res.length === 0) {
      result({ type: "not_found" }, null);
      return;
    }
    const quiz_id = res[0].quiz_id; 
    result(null, quiz_id); 
  });
};

Quiz_Permission.getByIdUser = (user_id, result) => {
  sql.query(
    `SELECT * FROM quiz_permission WHERE user_id = ${user_id}`,
    (err, res) => {
      if (err) {
        result(err, null);
        return;
      }
      if (res.length) {
        result(null, res);
        return;
      }
      result({ type: "not_found" }, null);
    }
  );
};

Quiz_Permission.update = (id, data, result) => {
  sql.query(
    "UPDATE quiz_permission SET quiz_id = ?, user_id = ? WHERE id = ?",
    [data.quiz_id, data.user_id, id],
    (err, res) => {
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

Quiz_Permission.delete = (id, result) => {
  sql.query("DELETE FROM quiz_permission WHERE id = ?", id, (err, res) => {
    if (err) {
      result(err, null);
      return;
    }
    if (res.affectedRows == 0) {
      result({ type: "not_found" }, null);
      return;
    }
    result(null, res);
  });
};

export default Quiz_Permission