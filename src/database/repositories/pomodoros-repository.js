const { pomodoros } = require("../models");

async function listPomodoros() {
    try {
       const listPomodoro = await pomodoros.findAll();
       return listPomodoro.map((pomodoro) => pomodoro.dataValues);
    }
    catch (err) {
       console.error(err);
    }
}

async function createPomodoro(userId) {
    await pomodoros.create({ started_at: new Date(), user_id: userId  });
}

async function endPomodoro(focusTime, restTime, finishedCount) {
    try {
        await pomodoros.update(
            { 
                ended_at: new Date(),
                rest_time: restTime,
                focus_time: focusTime,
                finished_count: finishedCount
            }, 
            {
                where: { ended_at: null }
            }
        );
     }
     catch (err) {
        console.error(err);
     }
}

async function deleteUncompletedPomodoros() {
    try {
        await pomodoros.destroy({ 
            where: {
                ended_at: null
            }
        });
    }
    catch (err) {
        console.error(err);
    }
}

async function deleteAllPomodoros() {
    try {
        await pomodoros.destroy({ truncate: true });
    }
    catch (err) {
        console.error(err);
    }
}


module.exports = {
    listPomodoros,
    createPomodoro,
    endPomodoro,
    deleteAllPomodoros,
    deleteUncompletedPomodoros
};