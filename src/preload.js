// All of the Node.js APIs are available in the preload process.

const { contextBridge } = require("electron");
const usersmgr = require("./database/usersmgr");

const getUsers = () => {
  return usersmgr.getUsers();
};

contextBridge.exposeInMainWorld("api", {
  getUsers: getUsers,
});
