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

const getUsers = () => listUsers();
const insertUser =  (name, focusTime, restTime) => createUser(name, focusTime, restTime);
const updateTimer = (userId, focusTime, restTime) => updateUserTimers(userId, focusTime, restTime);

const startPomodoro = () => createPomodoro();
const endPomodoro = (focusTime, restTime, finishedCount) => stopPomodoro(focusTime, restTime, finishedCount);
const getHistory = () => listPomodoros();
const clearHistory = () => deleteAllPomodoros();

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
