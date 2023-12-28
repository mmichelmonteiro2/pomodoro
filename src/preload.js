const { contextBridge } = require("electron");

const { 
  getUsers: getUsersDAO,
  insertUser: insertUserDAO,
  updateTimer: updateTimerDAO
} = require("./database/dao/users.dao");
const {
  startPomodoro: startPomodoroDAO,
  endPomodoro: endPomodoroDAO,
  getHistory: getHistoryDAO,
  clearHistory: clearHistoryDAO
} = require("./database/dao/pomodoros.dao");

// Importa todas as manipulações no banco de dados para as entidades "users" e
// "pomodoros", as declara em arrow functions e prepara sua execução

const getUsers = () => getUsersDAO();
const insertUser = (name, focusTime, restTime) => insertUserDAO(name, focusTime, restTime);
const updateTimer = (focusTime, restTime) => updateTimerDAO(focusTime, restTime);

const startPomodoro = () => startPomodoroDAO();
const endPomodoro = (focusTime, restTime, finishedCount) => endPomodoroDAO(focusTime, restTime, finishedCount);
const getHistory = () => getHistoryDAO();
const clearHistory = () => clearHistoryDAO();

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
