const { v4 } = require("uuid");

const { listFileContents, updateToFile } = require("../crud");

// Lista todos os pomodoros salvos no arquivo storage.json
function listPomodoros() {
    const users = listFileContents();
    const user = users[0];
    
    return user.pomodoros;
}

// Cria um novo pomodoro no arquivo storage.json
function createPomodoro() {
    // Cria um objeto pomodoro contendo um ID gerado utilizando UUID
    // Define que o pomodoro acabou de iniciar no started_at
    // Define todos os outros como null, pois o pomodoro não foi terminado
    const pomodoro = {
        id: v4(),
        started_at: new Date(),
        ended_at: null,
        rest_time: null,
        focus_time: null,
        finished_count: null
    }

    // Abre o arquivo storage.json
    const users = listFileContents();
    const user = users[0];
    // Adiciona o novo pomodoro no arquivo storage.json
    user.pomodoros.push(pomodoro);

    // Atualiza o arquivo storage.json com o novo pomodoro
    updateToFile(users);
}

function endPomodoro(focusTime, restTime, finishedCount) {
    // Abre o arquivo storage.json
    const users = listFileContents();
    const user = users[0];
    // Seleciona os pomodoros salvos
    const pomodoros = user.pomodoros;

    // Para todos que ainda não foram terminados, ele termina
    const pomodorosUpdated = pomodoros.map(pomodoro => {
        if (!pomodoro.ended_at) {
            pomodoro.ended_at = new Date();             // Define uma data de término
            pomodoro.rest_time = restTime;              // Define quantos segundos de descanso
            pomodoro.focus_time = focusTime;            // Define quantos segundos de foco
            pomodoro.finished_count = finishedCount;    // Define a quantidade de ciclos realizados

            return pomodoro;
        }

        return pomodoro;
    });

    // Atualiza o array de pomodoros no arquivo storage.json
    users[0].pomodoros = pomodorosUpdated;

    // Atualiza no arquivo
    updateToFile(users);
}

function deleteUncompletedPomodoros() {
    // Abre o arquivo storage.json
    const users = listFileContents();
    const user = users[0];
    // Seleciona os pomodoros salvos
    const pomodoros = user.pomodoros;

    // Filtra todos os pomodoros que não foram completados
    const pomodorosCompleted = pomodoros.filter((pomodoro) => {
        if (pomodoro.ended_at) return pomodoro;
    });

    // Remove do array
    users[0].pomodoros = pomodorosCompleted;

    // Atualiza no arquivo settings.json
    updateToFile(users);
}

function deleteAllPomodoros() {
    // Abre o arquivo storage.json
    const users = listFileContents();
    // Atualiza o array de pomodoros para vazio no arquivo storage.json
    users[0].pomodoros = [];
    // Atualiza no arquivo settings.json
    updateToFile(users);
}


module.exports = {
    listPomodoros,
    createPomodoro,
    endPomodoro,
    deleteAllPomodoros,
    deleteUncompletedPomodoros
};