const { connection } = require("../connection");

// Seleciona todos os usuários da aplicação
function getUsers() {
  // Especifica a query SQL
  const sql = 'SELECT * FROM users'

  // Realiza a preparação dessa query para execução
  const statement = connection.prepare(sql);

  // Executa a query e retorna todos os resultados dessa busca
  const result = statement.all();
  return result;
}

// Cria um novo usuário no sistema com suas preferências de pomodoro
function insertUser(name, focusTime, restTime) {
  const sql = `INSERT INTO users(name,focus_time,rest_time) VALUES('${name}',${focusTime},${restTime})`;
  const statement = connection.prepare(sql);
  statement.run();
}

// Atualiza as preferências de tempo de pomodoro (descanso e foco)
function updateTimer(focusTime, restTime) {
  const sql = `UPDATE users SET focus_time = ${focusTime}, rest_time = ${restTime}`;
  const statement = connection.prepare(sql);
  statement.run();
}

module.exports = {
  getUsers,
  insertUser,
  updateTimer
};