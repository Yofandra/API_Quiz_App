import sql from "./connection.js";

const Score = function(scores){
  this.score = scores.score
  this.quiz_id = scores.quiz_id
  this.user_id = scores.user_id
}

Score.storeScore = (newScore, result) => {
  sql.query("INSERT INTO scores SET ?", newScore, (err, res) => {
    if (err) {
      result(err, null);
    }
    result(null, { id: res.insertId, newScore });
  });
};

Score.getAll = (result) => {
  sql.query("SELECT * FROM scores", (err, res) => {
    if (err) {
      result(err, null);
    }
    result(null, res);
  });
};

Score.getByIdQuiz = (quiz_id, result) => {
  sql.query(
    `SELECT * FROM scores WHERE quiz_id = ${quiz_id}`,
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

Score.getQuizId = (id, result) => {
  sql.query(`SELECT quiz_id FROM scores WHERE id = ?`, id, (err, res) => {
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

Score.getRank = (quiz_id, result) => {
  sql.query(
    `SELECT score, user_id FROM scores WHERE quiz_id = ${quiz_id}`,
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

Score.getByIdUser = (user_id, result) => {
  sql.query(
    `SELECT * FROM scores WHERE user_id = ${user_id}`,
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

Score.delete = (id, result) => {
  sql.query("DELETE FROM scores WHERE id = ?", id, (err, res) => {
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

export default Score