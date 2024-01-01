// Objeto de configuração inicial do tempo de pomodoro que o usuário definiu em sua
// primeira configuração
const { 
  focus_time: focusTime,
  rest_time: restTime
} = window.api.getUsers()[0];

const timerSettings = {
  focusTime,
  restTime
};

// Captura os elementos visuais de tempo de foco e tempo de descanso
const focusTimeElement = document.getElementById('focus-time');
const restTimeElement = document.getElementById('rest-time');

focusTimeElement.addEventListener('input', function(event) {
  let inputValue = event.target.value;

  // Permite apenas números entre 00 e 59
  const isValidInput = 
    /^\d{0,2}$/.test(inputValue) && Number(inputValue) >= 0 && Number(inputValue) < 60;

  if (!isValidInput) {
    // Remove caracteres não numéricos
    inputValue = inputValue.replace(/\D/g, '');
    
    // Limita apenas a dois dígitos
    inputValue = inputValue.slice(0, 2);

    // Atualiza o valor do input
    event.target.value = inputValue;
  }
});

// Função para calcular proporcionalmente o tempo de foco para o tempo de descanso
// na escala de 5:1
function handleSetFocusTime() {
  // Captura o tempo de foco que o usuário definiu e armazena no objeto de configurações
  timerSettings.focusTime = Number(focusTimeElement.value);

  // Com base nesse valor, define o valor proporcional para o tempo de descanso
  // e realiza a mesma operação acima
  let restTime = Math.ceil((timerSettings.focusTime * 5) / 25);
  timerSettings.restTime = restTime;
  restTimeElement.value = restTime;
}

// Termina a configuração
function finishSetup() {
  const { focusTime, restTime } = timerSettings;

  // Salva no banco de dados as novas configurações de tempo do usuário
  window.api.updateTimer(focusTime, restTime);
  // Retorna para a tela principal do timer
  window.location.href = '../main/index.html';
}

// Função para fazer com que o usuário volte para a tela do timer
function goBack() {
  window.location.href = '../main/index.html';
}

focusTimeElement.addEventListener('input', handleSetFocusTime);
