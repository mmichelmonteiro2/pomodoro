const { contextBridge } = require("electron");

const {
  createUser,
  listUsers,
  updateUserTimers
} = require('../src/database/repositories/users-repository')

const { 
  createPomodoro,
  deleteAllPomodoros,
  endPomodoro: stopPomodoro,
  listPomodoros
} = require('../src/database/repositories/pomodoros-repository');

// Importa todas as manipulações no banco de dados para as entidades "users" e
// "pomodoros", as declara em arrow functions e prepara sua execução

const getUsers = async () => await listUsers();
const insertUser = async (name, focusTime, restTime) => await createUser(name, focusTime, restTime);
const updateTimer = async (focusTime, restTime) => await updateUserTimers(1, focusTime, restTime);

const startPomodoro = async (userId) => await createPomodoro(userId);
const endPomodoro = async (focusTime, restTime, finishedCount) => await stopPomodoro(focusTime, restTime, finishedCount);
const getHistory = async () => await listPomodoros();
const clearHistory = async () => await deleteAllPomodoros();

// Guarda todas as arrow functions neste objeto
const api = {
  getUsers,
  insertUser,
  updateTimer,
  startPomodoro,
  endPomodoro,
  getHistory,
  clearHistory
};

// Expõe todas as chamadas a cima para a aplicação
// Isso é necessário, pois, por mais que o código da aplicação esteja no mesmo
// projeto, a parte de banco de dados não se comunica nativamente com a parte
// visual do projeto por razões de segurança.
// Dessa forma, devemos expôr manualmente chamada por chamada para a parte visual
contextBridge.exposeInMainWorld("api", api);
