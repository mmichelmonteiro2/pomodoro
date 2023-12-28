const dbmgr = require("./dbmgr");

exports.getHistory = () => {
  const sql = 'SELECT * FROM pomodoros';
  const statement = dbmgr.db.prepare(sql);
  const result = statement.all();

  return result;
}

exports.startPomodoro = () => {
  const date = new Date();
  const sql = `INSERT INTO pomodoros(started_at,user_id) VALUES('${date}',1)`;
  const statement = dbmgr.db.prepare(sql);
  statement.run();
}

exports.clearHistory = () => {
  const sql = `DELETE FROM pomodoros`;
  const statement = dbmgr.db.prepare(sql);
  statement.run();
}

exports.endPomodoro = (focusTime, restTime, finishedCount) => {
  const date = new Date();
  const sql = `UPDATE pomodoros SET ended_at='${date}',focus_time=${focusTime},rest_time=${restTime},finished_count=${finishedCount} WHERE ended_at IS NULL`;
  const statement = dbmgr.db.prepare(sql);
  statement.run();
}