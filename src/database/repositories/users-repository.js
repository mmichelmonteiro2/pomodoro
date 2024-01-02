const { users } = require("../models");

async function createUser(name, focusTime, restTime) {
   try {
      await users.create({ name, rest_time: restTime, focus_time: focusTime });
   }
   catch (err) {
      console.error(err);
   }
}
 
async function listUsers() {
   try {
      const listUser = await users.findAll();
      return listUser.map((user) => user.dataValues);
   }
   catch (err) {
      console.error(err);
   }
}

async function updateUserTimers(userId, focusTime, restTime) {
   try { 
      await users.update({ rest_time: restTime, focus_time: focusTime }, {
         where: {
           id: userId
         }
       });
   } catch (err) {
      console.error(err);
   }
}

module.exports = {
   createUser,
   listUsers,
   updateUserTimers
 };