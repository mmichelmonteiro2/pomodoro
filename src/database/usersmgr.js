const dbmgr = require("./dbmgr");

// function find(id) {
//   const sql = `SELECT * FROM users WHERE id ilike '${id}'`;
//   const statement = connection.db.prepare(sql);
//   const result = statement.all();

//   return result || null;
// }

// function update(old, _new) {
//   throw new Error("Method not implemented.");
// }

// function remove(user) {
//   const sql = `DELETE FROM users WHERE id ilike '${user.getId()}'`;
//   const statement = connection.db.prepare(sql);
//   statement.all();
// }

exports.getUsers = () => {
  const sql = 'SELECT * FROM users';
  const statement = dbmgr.db.prepare(sql);
  const result = statement.all();

  return result;
};
// exports.getUser = find;
// exports.updateUser = update;
// exports.removeUser = remove;
