const history = window.api.getHistory();

const tableContentElement = document.getElementsByTagName('tbody')[0];

const totalFocusTimeElement = document.getElementById("total-focus-time");
const totalRestTimeElement = document.getElementById("total-rest-time");
const totalCycleTimeElement = document.getElementById("total-cycle-time");

const total = history.reduce((accumulator, currentValue) => {
  accumulator.focusTime += currentValue.focus_time;
  accumulator.restTime += currentValue.rest_time;
  accumulator.cycleCount += currentValue.finished_count;
  return accumulator;
}, { focusTime: 0, restTime: 0, cycleCount: 0 });

totalFocusTimeElement.innerText = `${total.focusTime} minutos`;
totalRestTimeElement.innerText = `${total.restTime} minutos`;
totalCycleTimeElement.innerText = `${total.cycleCount} minutos`;

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
  focusTime.innerText = focus_time;
  restTime.innerText = rest_time;
  finishedCount.innerText = finished_count;

  tableRow.appendChild(startedAt);
  tableRow.appendChild(endedAt);
  tableRow.appendChild(focusTime);
  tableRow.appendChild(restTime);
  tableRow.appendChild(finishedCount);

  tableContentElement.appendChild(tableRow);
});

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

function clearHistory() {
  window.api.clearHistory();
  location.href = '../main/index.html'
}