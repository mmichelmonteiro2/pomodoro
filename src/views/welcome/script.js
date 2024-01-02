// Variável de controle para definir em qual passo do formulário o usuário se encontra
let activeFormPosition = 0;

// Objeto de configurações iniciais de um novo usuário
const userSettings = {
  name: null,
  focusTime: 0,
  restTime: 0
}

// Inputs de tempo de foco, tempo de descanso e nome do usuário são capturados
const focusTimeElement = document.getElementById('focus-time');
const restTimeElement = document.getElementById('rest-time');
const userNameElement = document.getElementById('name');

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

// Elemento pai de todos os passos de cadastro do usuário
const steps = document.querySelectorAll('div.step-container');

// Função para avançar de passo no cadastro
function handleStep(formPosition) {
  // Verifica se o usuário já está no último passo do cadastro
  const shouldStopSteps = formPosition === steps.length - 1;

  // Se estiver, o sistema não avança mais um passo (para não ocasionar um erro)
  if (shouldStopSteps) return;

  // Caso existam outros passos de cadastro pro usuário, o passo anterior é escondido,
  // o novo passo é mostrado em tela e a variável de controle de passos é incrementada
  // em +1
  steps[formPosition].style.display = 'none';
  activeFormPosition = formPosition + 1;
  steps[activeFormPosition].style.display = 'block';
}

// Atualiza o nome do usuário no objeto de acordo com o que ele digitou
function handleSetName() {
  userSettings.name = userNameElement.value;
}

// Função para calcular proporcionalmente o tempo de foco para o tempo de descanso
// na escala de 5:1
function handleSetFocusTime() {
  // Captura o tempo de foco que o usuário definiu e armazena no objeto de configurações
  userSettings.focusTime = Number(focusTimeElement.value);

  // Com base nesse valor, define o valor proporcional para o tempo de descanso
  // e realiza a mesma operação acima
  let restTime = Math.ceil((userSettings.focusTime * 5) / 25);
  userSettings.restTime = restTime;
  restTimeElement.value = restTime;
}

// Termina a configuração
async function finishSetup() {
  const { name, focusTime, restTime } = userSettings;
  // Salva no banco de dados o usuário
  await window.api.insertUser(name, focusTime, restTime);
  
  // Retorna para a tela principal do timer
  window.location.href = '../main/index.html';
}

focusTimeElement.addEventListener('input', handleSetFocusTime);
