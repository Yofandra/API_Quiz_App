import sql from "./connection.js";

const Quiz = function (quiz) {
  this.quiz_name = quiz.quiz_name;
  this.user_id = quiz.user_id;
  this.room_id = quiz.room_id;
};

Quiz.create = (newQuiz, result) => {
  sql.query("INSERT INTO quiz SET ?", newQuiz, (err, res) => {
    if (err) {
      result(err, null);
    }
    result(null, { id: res.insertId, newQuiz });
  });
};

Quiz.getAll = (result) => {
  sql.query("SELECT * FROM quiz", (err, res) => {
    if (err) {
      result(err, null);
    }
    result(null, res);
  });
};

Quiz.getById = (id, result) => {
  sql.query(`SELECT * FROM quiz WHERE id = ${id}`, (err, res) => {
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

Quiz.getByIdRoom = (room_id, result) => {
  sql.query(`SELECT * FROM quiz WHERE room_id = ${room_id}`, (err, res) => {
    if (err) {
      result(err, null);
      return;
    }
    if (res.length) {
      result(null, res);
      return;
    }
    result({ type: "not_found" }, null);
  });
};

Quiz.getByName = (quiz_name, result) => {
  sql.query(`SELECT * FROM quiz WHERE quiz_name = ?`, quiz_name, (err, res) => {
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

Quiz.getUserId = (id, result) => {
  sql.query(`SELECT user_id FROM quiz WHERE id = ?`, id, (err, res) => {
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

Quiz.getRoomId = (id, result) => {
  sql.query(`SELECT room_id FROM quiz WHERE id = ?`, id, (err, res) => {
    if (err) {
      result(err, null);
      return;
    }
    if (res.length === 0) {
      result({ type: "not_found" }, null);
      return;
    }
    const room_id = res[0].room_id;
    result(null, room_id);
  });
};

Quiz.getQuizScore = (user_id, result) => {
  sql.query(
    `SELECT quiz.*, scores.* FROM quiz INNER JOIN scores ON quiz.id = scores.quiz_id WHERE scores.user_id = ${user_id}`,
    (err, res) => {
      if (err) {
        result(err, null);
        return;
      }
      if (res.length) {
        result(null, res[0]);
        return;
      }
      result({ type: "not_found" }, null);
    }
  );
};

Quiz.update = (id, data, result) => {
  sql.query(
    "UPDATE quiz SET quiz_name = ?, room_id = ? WHERE id = ?",
    [data.quiz_name, data.room_id, id],
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

Quiz.delete = (id, result) => {
  sql.query("DELETE FROM quiz WHERE id = ?", id, (err, res) => {
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

export default Quiz;
