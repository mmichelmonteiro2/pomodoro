const { connection } = require("../connection");

// Seleciona todos os pomodoros feitos pelo usuário na aplicação
function getHistory() {
  // Especifica a query SQL
  const sql = 'SELECT * FROM pomodoros';

  // Realiza a preparação dessa query para execução
  const statement = connection.prepare(sql);

  // Executa a query e retorna todos os resultados dessa busca
  const result = statement.all();
  return result;
}

// Inicia um registro de pomodoro no banco de dados
function startPomodoro() {
  // Define que a data em que o usuário iniciou o pomodoro
  const date = new Date();
  const sql = `INSERT INTO pomodoros(started_at,user_id) VALUES('${date}',1)`;

  // Prepara a execução da query e, em seguida, a executa
  const statement = connection.prepare(sql);
  statement.run();
}

// Termina um pomodoro
function endPomodoro(focusTime, restTime, finishedCount) {
  // Define a data em que o usuário terminou o pomodoro
  const date = new Date();
  const sql = `UPDATE pomodoros SET ended_at='${date}',focus_time=${focusTime},rest_time=${restTime},finished_count=${finishedCount} WHERE ended_at IS NULL`;
  
  // Atualiza o pomodo com o tempo total de foco, descaso e a quantidade de ciclos realizadas
  // entre a data de início de de fim do pomodoro
  const statement = connection.prepare(sql);
  statement.run();
}

// Apaga todo o histórico de pomodoros no banco de dados
function clearHistory() {
  // Cria uma query SQL de deleção, prepara e a executa
  const sql = `DELETE FROM pomodoros`;
  const statement = connection.prepare(sql);
  statement.run();
}

function removePomodoroUncompleted() {
  const sql = `DELETE FROM pomodoros WHERE ended_at IS NULL`;
  const statement = connection.prepare(sql);
  statement.run();
}

module.exports = {
  getHistory,
  startPomodoro,
  clearHistory,
  endPomodoro,
  removePomodoroUncompleted
};