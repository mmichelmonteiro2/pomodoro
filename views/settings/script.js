var activeFormPosition = 0;

const timerSettings = {
  focusTime: 0,
  restTime: 0
}

const focusTimeElement = document.getElementById('focus-time');
const restTimeElement = document.getElementById('rest-time');

function handleSetFocusTime() {
  timerSettings.focusTime = Number(focusTimeElement.value);

  let restTime = Math.ceil((timerSettings.focusTime * 5) / 25);
  timerSettings.restTime = restTime;
  restTimeElement.value = restTime;
}

function finishSetup() {
  const { focusTime, restTime } = timerSettings;
  window.api.updateTimer(focusTime, restTime);
  
  window.location.href = '../main/index.html';
}

focusTimeElement.addEventListener('input', handleSetFocusTime);
