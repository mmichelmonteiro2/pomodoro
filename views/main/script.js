const minutesLabel = document.getElementById('minutes');
const secondsLabel = document.getElementById('seconds');
const quoteLabel = document.getElementById('quote');

const startButton = document.querySelector('.button.start-countdown');
const pauseButton = document.querySelector('.button.pause-countdown');
const stopButton = document.querySelector('.button.stop-countdown');

const timerSettings = {};
let timerInterval;

function getUsersSettings() {
  const users = window.api.getUsers();
  return users[0];
}

function timerSetup() {
  const { focus_time, rest_time } = getUsersSettings();

  timerSettings.isPaused = false;
  timerSettings.isRestTime = false;
  timerSettings.focusTime = focus_time * 60;
  timerSettings.restTime = rest_time * 60;

  startButton.style.display = 'inline';
  pauseButton.style.display = 'none';
  stopButton.style.display = 'none';
  quoteLabel.style.display = 'none';

  updateDisplay(timerSettings.focusTime);
}

timerSetup();

function startTimer() {
  startButton.style.display = 'none';
  pauseButton.style.display = 'inline';
  stopButton.style.display = 'inline';

  let secondsRemaining = timerSettings.focusTime;

  updateDisplay(secondsRemaining);
  showRandomQuote();

  timerInterval = setInterval(() => {
    if (!timerSettings.isPaused) {
      secondsRemaining -= 1;

      showRandomQuote();
  
      updateDisplay(secondsRemaining);
  
      if (secondsRemaining === 0 && timerSettings.isRestTime) {
        stopTimer();
      }
      else if (secondsRemaining === 0 && !timerSettings.isRestTime) {
        timerSettings.isRestTime = true;
        secondsRemaining = timerSettings.restTime;
      }
    }
  }, 1000);
}

function pauseTimer() {
  timerSettings.isPaused = !timerSettings.isPaused;
  if (timerSettings.isPaused) pauseButton.innerText = 'Retomar Ciclo';
  else pauseButton.innerText = 'Pausar Ciclo';
}

function stopTimer() {
  clearTimeout(timerInterval);
  timerSetup();
}

function updateDisplay(secondsRemaining) {
  const seconds = secondsRemaining % 60;
  const minutes = Math.floor(secondsRemaining / 60);

  minutesLabel.innerText = String(minutes).padStart(2, '0');
  secondsLabel.innerText = String(seconds).padStart(2, '0');
}

function showRandomQuote() {
  quoteLabel.style.display = 'inline';

  const quotes = [
    "Todos os dias são uma oportunidade para recomeçar e para planejar um novo caminho. Siga com fé e acredite em você.",
    "A palavra “impossível” foi inventada para ser desafiada.",
    "Somos capazes de fazer muito mais do que imaginamos!",
    "Nós somos como o clima: feitos de dias de chuva e de sol!",
    "Há ainda tanta coisa linda na vida para se descobrir.",
    "Que todos os nossos passos nos levem para o que nos faz feliz de verdade.",
    "Abra os olhos e aventure-se nessa jornada chamada vida!",
    "Há tantas pessoas que torcem por você na vida.",
    "Os dias difíceis são a forma mais rápida de aprendermos a apreciar os bons.",
    "Siga sempre confiante do seu potencial!",
    "Hoje é um novo dia. Não fique pensando no ontem.",
    "Os sonhos são a melhor forma de termos uma direção na vida e um motivo para caminhar.",
    "Receita para uma boa semana: acredite em você e trate o seu corpo com carinho.",
    "Quando tudo parecer impossível, é sinal de que está precisando de uns bons dias de descanso para aliviar a pressão e liberar a sua mente. Depois, verá que os problemas nem eram tão grandes assim.",
    "Não se torture quando as coisas não ocorrerem como você planejou. Os planos nos ajudam a traçar o caminho, mas é normal que tenhamos que mudá-los depois!",
    "Não há a necessidade de caminhar rápido. Apenas siga caminhando.",
    "Se aquela meta antiga já não te faz mais feliz, elimine-a sem dó!",
    "Não precisamos conquistar o mundo todos os dias!",
    "Dias complicados fazem parte. O bom é que passam e depois aparecem dias bons.",
    "A vida é como uma montanha: tem altos e baixos, exige caminhada e tem paisagens para se observar durante todo o caminho.",
    "Respeite seu corpo e trate com carinho a sua mente.",
    "Em meio ao caos, respire fundo.",
    "Os nossos sonhos são umas das melhores coisas que moram dentro de nós.",
    "Você é forte, você consegue.",
    "Se hoje fosse a primeira página do seu livro da vida, como você gostaria de começar com ela?",
    "Não existem batalhas impossíveis para quem está disposto a nunca desistir.",
    "Algumas coisas ruins acontecem para aprendermos a ficar mais fortes.",
    "Nunca é tarde para fazer o que ainda movimenta os seus sonhos.",
    "Os nossos maiores medos também podem ser nossos maiores impulsos para novas conquistas.",
    "Não desista de algo quando falarem que você não é capaz. Levante-se e mostre que estão enganados.",
    "Mudar é bom! Aprenda a se redescobrir.",
    "Há tanta coisa incrível para descobrir sobre você. Desafie-se e permita-se conhecer diferentes lados de você.",
    "Algumas caminhadas precisam ser iniciadas sem ninguém ao lado. Ao longo do caminho, algumas pessoas vão se juntar a você. Fique tranquilo.",
    "Seja um borboleta e passe por uma bela metamorfose!",
    "A primavera virá dentro de você. Aguente firme.",
    "Você já fez uma caminhada tão bonita até agora. Parabenize-se.",
    "Hoje a meta do dia é ter gratidão pela vida e se parabenizar por tudo o que você já fez.",
    "Um dia você estará olhando para trás e pensando em todas as conquistas que já fez.",
    "Não coloque metas muito pesadas no seu caminho. Ninguém merece sofrer com um peso desnecessário nas costas!",
    "Faça as pazes com a vida e ande de mãos dadas com ela.",
    "Ter sucesso é estar em paz com as nossas escolhas.",
    "O coração tem um espaço limitado. Então, vamos deixar só o amor entrar e jogar fora o rancor.",
    "Algumas pessoas ficam pelo caminho, mas outras maravilhosas também entram ao longo do trajeto.",
    "A vida é como um trem: pessoas entram e saem, paisagens novas aparecem, estações oferecem pausas.",
    "Não tenha medo de desistir do que já não te faz bem.",
    "Às vezes, precisamos de um pouco mais de coragem e de amor próprio.",
    "Não aceite nada que imponha limites ao que faz parte da sua essência.",
    "Valorize seus amigos e enfrente batalhas com eles! Eles são o time que você escolheu para jogar na vida.",
    "Se sentir medo, é sinal de que está bem próximo do desafio. Enfrente-o e descubra do que você é capaz.",
    "Já sentiu o cheiro das flores hoje? Já escutou o canto dos passarinhos? A vida preparou isto tudo para você também. Aproveite!",
    "Cada esquina da vida nos reserva uma surpresa. Descubra o que a próxima esquina reservou para você!",
    "Algumas coisas dão errado porque a vida planejou algo melhor.",
    "A vida sabe o que faz. Dê mais crédito a ela.",
    "Lições da vida: escute-as.",
    "Há uma vida inteira diante de você. Vamos fazer uma linda história com ela?",
    "A motivação é o tipo de coisa que precisa ser reforçada todos os dias. Como? Alimentando a sua alma de boas energias e deixando o seu coração nutrido de carinho.",
    "Ninguém conquista o mundo sem uma boa noite de sono! Tire os problemas do seu travesseiro.",
    "Quantas coisas boas já aconteceram depois que tudo fugiu do controle? Os planos da vida são tão bons.",
    "A fé e a esperança são os melhores combustíveis do motor do corpo.",
    "Quando cansar, descanse, recupere energias e siga!",
    "Aquela força que você busca está dentro de você.",
    "Seja a pessoa que mais acredita em você!",
    "Nem todas as batalhas são feitas de vitória, mas todas elas são feitas de esforços, de aprendizagens e de recompensas."
  ];

  const randomQuote = quotes[(Math.random() * quotes.length) | 0]
  quoteLabel.innerText = randomQuote;
}