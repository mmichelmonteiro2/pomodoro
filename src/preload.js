// All of the Node.js APIs are available in the preload process.

const { contextBridge } = require("electron");
const usersmgr = require("./database/usersmgr");

const getUsers = () => {
  return usersmgr.getUsers();
};

const insertUser = (name, focusTime, restTime) => {
  return usersmgr.insertUser(name, focusTime, restTime);
}

const updateTimer = (focusTime, restTime) => {
  return usersmgr.updateTimer(focusTime, restTime);
}

contextBridge.exposeInMainWorld("api", {
  getUsers: getUsers,
  insertUser: insertUser,
  updateTimer: updateTimer
});
