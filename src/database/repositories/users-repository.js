const { v4 } = require("uuid");

const { saveToFile, listFileContents, updateToFile } = require("../crud");

function createUser(name, focusTime, restTime) {
   // Cria um objeto user contendo um ID gerado utilizando UUID
   const user = {
      id: v4(),                 // Gera um ID aleatório usando o uuid
      name,                     // Define o nome que o usuário digitou
      focus_time: focusTime,    // Define o tempo de foco que o usuário digitou
      rest_time: restTime,      // Define o tempo de descanso que o usuário digitou
      pomodoros: []             // Inicializa com zero pomodoros realizados (por ser um usuário novo)
   }

    // Atualiza o arquivo storage.json com o novo usuario
   saveToFile(user);
}
 
function listUsers() {
   // Acessa o arquivo storage.json e retorna todos os usuários
   return listFileContents();
}

function updateUserTimers(userId, focusTime, restTime) {
   // Acessa o arquivo storage.json e retorna todos os usuários
   const users = listFileContents();

   // Busca o usuário que será atualizado pelo id
   const index = users.findIndex(user => user.id === userId);

   // Atualiza as propriedades
   users[index].focus_time = focusTime;
   users[index].rest_time = restTime;
  
   // Atualiza no arquivo settings.json
   updateToFile(users);
}

module.exports = { createUser, listUsers, updateUserTimers };