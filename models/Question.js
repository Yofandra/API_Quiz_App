import sql from "./connection.js";

const Question = function (questions) {
  this.question_text = questions.question_text;
  this.option_a = questions.option_a;
  this.option_b = questions.option_b;
  this.option_c = questions.option_c;
  this.answer = questions.answer;
  this.quiz_id = questions.quiz_id;
};

Question.create = (newQuestion, result) => {
  sql.query("INSERT INTO questions SET ?", newQuestion, (err, res) => {
    if (err) {
      result(err, null);
    }
    result(null, { id: res.insertId, newQuestion });
  });
};

Question.getAll = (result) => {
  sql.query("SELECT * FROM questions", (err, res) => {
    if (err) {
      result(err, null);
    }
    result(null, res);
  });
};

Question.getById = (id, result) => {
  sql.query(`SELECT * FROM questions WHERE id = ${id}`, (err, res) => {
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

Question.getByIdQuiz = (quiz_id, result) => {
  sql.query(`SELECT * FROM questions WHERE quiz_id = ${quiz_id}`, (err, res) => {
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

Question.getQuizId = (id, result) => {
  sql.query(`SELECT quiz_id FROM questions WHERE id = ?`, id, (err, res) => {
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

Question.getQuestion = (quiz_id, result) => {
  sql.query(`SELECT question_text, option_a, option_b, option_c FROM questions WHERE quiz_id = ${quiz_id}`, (err, res) => {
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

Question.getAnswer = (quiz_id, result) => {
  sql.query(`SELECT answer FROM questions WHERE quiz_id = ${quiz_id}`, (err, res) => {
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

Question.update = (id, data, result) => {
  sql.query(
    "UPDATE questions SET question_text = ?, option_a = ?, option_b = ?, option_c = ?, answer = ? WHERE id = ?",
    [data.question_text, data.option_a, data.option_b, data.option_c, data.answer, id],
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

Question.delete = (id, result) => {
  sql.query("DELETE FROM questions WHERE id = ?", id, (err, res) => {
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

export default Question;
