// All of the Node.js APIs are available in the preload process.

const { contextBridge } = require("electron");
const usersmgr = require("./database/usersmgr");
const pomodorosmgr = require("./database/pomodorosmgr");

const getUsers = () => {
  return usersmgr.getUsers();
};

const insertUser = (name, focusTime, restTime) => {
  return usersmgr.insertUser(name, focusTime, restTime);
}

const updateTimer = (focusTime, restTime) => {
  return usersmgr.updateTimer(focusTime, restTime);
}

const startPomodoro = () => {
  return pomodorosmgr.startPomodoro();
}

const endPomodoro = (focusTime, restTime, finishedCount) => {
  return pomodorosmgr.endPomodoro(focusTime, restTime, finishedCount);
}

const getHistory = () => {
  return pomodorosmgr.getHistory();
}

const clearHistory = () => {
  return pomodorosmgr.clearHistory();
}

contextBridge.exposeInMainWorld("api", {
  getUsers: getUsers,
  insertUser: insertUser,
  updateTimer: updateTimer,
  startPomodoro: startPomodoro,
  endPomodoro: endPomodoro,
  getHistory: getHistory,
  clearHistory: clearHistory
});
