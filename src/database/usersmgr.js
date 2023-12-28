const dbmgr = require("./dbmgr");

exports.getUsers = () => {
  const sql = 'SELECT * FROM users';
  const statement = dbmgr.db.prepare(sql);
  const result = statement.all();

  return result;
};

exports.insertUser = (name, focusTime, restTime) => {
  const sql = `INSERT INTO users(name,focus_time,rest_time) VALUES('${name}',${focusTime},${restTime})`;
  const statement = dbmgr.db.prepare(sql);
  statement.run();
}

exports.updateTimer = (focusTime, restTime) => {
  const sql = `UPDATE users SET focus_time = ${focusTime}, rest_time = ${restTime}`;
  const statement = dbmgr.db.prepare(sql);
  statement.run();
}
