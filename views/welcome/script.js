var activeFormPosition = 0;

const userSettings = {
  name: null,
  focusTime: 0,
  restTime: 0
}

const focusTimeElement = document.getElementById('focus-time');
const restTimeElement = document.getElementById('rest-time');
const userNameElement = document.getElementById('name');
const steps = document.querySelectorAll('div.step-container');

function handleStep(formPosition) {
  const shouldStopSteps = formPosition === steps.length - 1;

  if (shouldStopSteps) return;

  steps[formPosition].style.display = 'none';
  activeFormPosition = formPosition + 1;
  steps[activeFormPosition].style.display = 'block';
}

function handleSetName() {
  userSettings.name = userNameElement.value;
}

function handleSetFocusTime() {
  userSettings.focusTime = Number(focusTimeElement.value);

  let restTime = Math.ceil((userSettings.focusTime * 5) / 25);
  userSettings.restTime = restTime;
  restTimeElement.value = restTime;
}

function finishSetup() {
  const { name, focusTime, restTime } = userSettings;
  window.api.insertUser(name, focusTime, restTime);
  
  window.location.href = '../main/index.html';
}

focusTimeElement.addEventListener('input', handleSetFocusTime);
