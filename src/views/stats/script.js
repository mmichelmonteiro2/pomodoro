// Busca, no banco de dados, todos os pomodoros realizados pelo usuário
const history = window.api.getHistory();

// Captura o elemento da tabela
const tableContentElement = document.getElementsByTagName('tbody')[0];

// Captura os elementos das métricas (tempo total de foco, tempo total de descanso
// e quantidade total de ciclos)
const totalFocusTimeElement = document.getElementById("total-focus-time");
const totalRestTimeElement = document.getElementById("total-rest-time");
const totalCycleTimeElement = document.getElementById("total-cycle-time");

// Contabiliza a quantidade total de cada métrica a cima realizando uma operação
// de acumulação
const total = history.reduce((accumulator, currentValue) => {
  accumulator.focusTime += currentValue.focus_time;
  accumulator.restTime += currentValue.rest_time;
  accumulator.cycleCount += currentValue.finished_count;
  return accumulator;
}, { focusTime: 0, restTime: 0, cycleCount: 0 });

// Mostra em tela os dados acima
totalFocusTimeElement.innerText = `${total.focusTime} minutos`;
totalRestTimeElement.innerText = `${total.restTime} minutos`;
totalCycleTimeElement.innerText = `${total.cycleCount} minutos`;

// Para cada pomodoro realizado, adiciona os valores de
//  - quando foi iniciado
//  - quando foi terminado
//  - quantos minutos de foco foram despendidos em cada pomodoro
//  - quantos minutos de descanso foram despendidos em cada pomodoro
//  - quantos ciclos de pomodoro foram realizados em cada pomodoro
// Depois, mostra todos esses valores como linhas na coluna
history.forEach((cycle) => {
  const { started_at, ended_at, focus_time, rest_time, finished_count } = cycle;

  const tableRow = document.createElement('tr');

  const startedAt = document.createElement('td');
  const endedAt = document.createElement('td');
  const focusTime = document.createElement('td');
  const restTime = document.createElement('td');
  const finishedCount = document.createElement('td');

  startedAt.innerText = formatDate(started_at);
  endedAt.innerText = formatDate(ended_at);
  focusTime.innerText = secondsToMinutes(Number(focus_time));
  restTime.innerText = secondsToMinutes(Number(focus_time));
  finishedCount.innerText = finished_count;

  tableRow.appendChild(startedAt);
  tableRow.appendChild(endedAt);
  tableRow.appendChild(focusTime);
  tableRow.appendChild(restTime);
  tableRow.appendChild(finishedCount);

  tableContentElement.appendChild(tableRow);
});

// Função para converter segundos em minutos e arredondar
function secondsToMinutes(seconds) {
  return Math.round(seconds / 60);
}

// Função para formatar a data do banco de dados e deixar mais legível ao usuário
function formatDate(date) {
  const formattedDate = new Date(date);

  const day = formattedDate.getDate().toString().padStart(2, '0');
  const month = (formattedDate.getMonth() + 1).toString().padStart(2, '0');
  const year = formattedDate.getFullYear();
  const hours = formattedDate.getHours().toString().padStart(2, '0');
  const minutes = formattedDate.getMinutes().toString().padStart(2, '0');
  const seconds = formattedDate.getSeconds().toString().padStart(2, '0');

  return `${day}/${month}/${year} às ${hours}:${minutes}:${seconds}`;
}

// Quando o usuário quiser limpar o histórico, essa função é chamada e uma
// operação de DELETE é realizada no banco de dados. Em seguida, ele é retornado
// para a tela do timer
function clearHistory() {
  window.api.clearHistory();
  location.href = '../main/index.html'
}

// Função para fazer com que o usuário volte para a tela do timer
function goBack() {
  window.location.href = '../main/index.html';
}