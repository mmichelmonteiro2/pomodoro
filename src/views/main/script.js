// Utiliza o JS DOM para armazenar todos os elementos que serão dinâmicos nesta
// aplicação
const minutesLabel = document.getElementById('minutes');
const secondsLabel = document.getElementById('seconds');
const quoteLabel = document.getElementById('quote');
const startButton = document.querySelector('.button.start-countdown');
const pauseButton = document.querySelector('.button.pause-countdown');
const stopButton = document.querySelector('.button.stop-countdown');
const greetingsDiv = document.getElementById('greetings');
const focusDiv = document.getElementById('focus');
const restDiv = document.getElementById('rest');
const usernameSpan = document.querySelectorAll('.username');
const actionsDiv = document.querySelector('.actions');

// Inicializa objetos e variáveis de configurações do pomodoro
const timerSettings = {};
let timerInterval;
let quoteInterval;

// Busca o nome do usuário no banco de dados
let userName;

// Atribui o nome do usuário (oriundo do banco de dados) para cada elemento onde
// o nome dele deve aparecer em tela
window.api.getUsers().then(data => { 
  userName = data[0].name;  
  usernameSpan.forEach((span) => {
    span.innerText = userName;
  })
}).catch(error => console.error(error));

// Função para acessar o banco de dados e listar todos os usuários cadastrados
async function getUsersSettings() {
  const users = await window.api.getUsers();
  return users[0];
}

// Inicializa as configurações para o timer iniciar de forma adequada
async function timerSetup() {
  // Captura quanto tempo o usuário definiu de foco e descanso
  const { focus_time, rest_time } = await getUsersSettings();

  // Inicializa o objeto timerSettings com propriedades fundamentais para execução
  // do pomodoro
  timerSettings.isPaused    =  false;            // Não está pausado
  timerSettings.isRestTime  =  false;            // Está em tempo de foco
  timerSettings.focusTime   =  focus_time * 60;  // Atribui o tempo de foco em minutos
  timerSettings.restTime    =  rest_time * 60;   // Atribui o tempo de descanso em minutos

  // Esconde os botões de pausar e parar o pomodo e deixa apenas visível
  // o botão de iniciar. Por fim, esconde as citações.
  startButton.style.display = 'inline';
  pauseButton.style.display = 'none';
  stopButton.style.display = 'none';
  quoteLabel.style.display = 'none';
  greetingsDiv.style.display = 'block';
  focusDiv.style.display = 'none';
  restDiv.style.display = 'none';

  // Caso a aplicação não esteja armazenando o tempo de foco, tempo de descanso
  // e quantidade total de ciclos do pomodoro, ele inicializa este armazenamento
  // inicialmente com o valor 0.
  if (!localStorage.getItem("focus_time_total"))
    localStorage.setItem("focus_time_total", 0);
  if (!localStorage.getItem("rest_time_total"))
    localStorage.setItem("rest_time_total", 0);
  if (!localStorage.getItem("cycles_total"))
    localStorage.setItem("cycles_total", 0);

  // Atualiza o display com os minutos atuais do pomodoro de acordo com o que o
  // usuário definiu no banco de dados
  updateDisplay(timerSettings.focusTime);
}

// Inicializa a configuração inicial do timer.
timerSetup();

// Função para iniciar o pomdoro
function startPomodoro() {
  // Faz um registro no banco de dados que um pomodoro acabou de ser iniciado
  window.api.startPomodoro(1).then(() => {
    // Impedir que o usuário acesse painel de configurações e métricas enquanto um
    // pomodoro estiver em execução
    actionsDiv.style.display = 'none';

    // Inicia o timer
    startTimer();
  }).catch((error) => console.log(error));  
}

// Função para finalizar o pomodoro
async function endPomodoro() {
  // Captura o tempo total de foco, descanso e a quantidade total de ciclos
  // de pomodoro e converte para número.
  const totalFocusTime = Number(localStorage.getItem("focus_time_total"));
  const totalRestTime = Number(localStorage.getItem("rest_time_total"));
  const totalCycles = Number(localStorage.getItem("cycles_total"));

  // Atualiza o pomodoro que estava em andamento para finalizado e salva as
  // estatísticas citadas no comentário acima neste pomodoro finalizado.
  await window.api.endPomodoro(totalFocusTime, totalRestTime, totalCycles);

  // Redefine as métricas para 0 com intuito de não impactar outros pomodoros futuros.
  localStorage.setItem("focus_time_total", 0)
  localStorage.setItem("rest_time_total", 0)
  localStorage.setItem("cycles_total", 0)

  // Retornar acesso ao painel de configurações e métricas
  actionsDiv.style.display = 'block';
  
  // Para o timer.
  stopTimer();
}

// Inicia o relógio (timer)
function startTimer() {
  // Mostra uma notificação no computador
  dispatchNotification(`${userName}, esteja focado 🧠`, `O seu tempo de foco acaba de começar!`);
  // Mostra a frase de foco e esconde a frase de início de pomodoro
  greetingsDiv.style.display = 'none';
  focusDiv.style.display = 'block';

  // Esconde o botão de iniciar e deixa apenas disponível os botões de parar e pausar
  startButton.style.display = 'none';
  pauseButton.style.display = 'inline';
  stopButton.style.display = 'inline';

  // Armazena os segundos restantes para o término do tempo de foco em uma variável
  let secondsRemaining = timerSettings.focusTime;
  // Define qual tipo de métrica vai alterar (tempo total de descanso ou tempo total de foco)
  let localStorageTimer = "focus_time_total";
  
  // Atualiza o display com os segundos restantes do tempo de foco
  updateDisplay(secondsRemaining);
  // Dispara função para mostrar frases aleatórias de motivação para o usuário
  showRandomQuote();

  // Inicializa uma função de intervalo que rodará de um em um segundo.
  timerInterval = setInterval(() => {
    // Apenas executa o timer se ele não estiver pausado
    if (!timerSettings.isPaused) {
      // Subtrai um segundo do tempo restante do timer
      secondsRemaining -= 1;
  
      // Atualiza no display que o tempo acaba de ser subtraído por um
      updateDisplay(secondsRemaining);

      // Armazena na métrica que um segundo já se passou
      localStorage.setItem(
        localStorageTimer,
        Number(localStorage.getItem(localStorageTimer)) + 1
      );

      // Se a contagem de segundos restantes chegou a zero e ele já passou pelo tempo
      // de descanso, então reinicia um ciclo (inicia novamente o tempo de foco)
      if (secondsRemaining === 0 && timerSettings.isRestTime) {
        restartTimer();
      }
      // Se a contagem de segundos chegou a zero e ele ainda não entrou no tempo de descanso,
      // então ele inicia a contagem dos segundos de descanso
      else if (secondsRemaining === 0 && !timerSettings.isRestTime) {
        // Mostra uma notificação no computador
        dispatchNotification(`${userName}, que tal descansar agora? 🤩`, `O seu tempo de foco acabou, aproveite o tempo de descanso para retornar com as energias renovadas.`);
        timerSettings.isRestTime = true;                   // Altera o estado para tempo de descanso
        localStorageTimer        = "rest_time_total";      // Atualiza as métricas de descanso (ao invés de foco)
        secondsRemaining         = timerSettings.restTime; // Atualiza os segundos restantes de 0 para a quantidade tempo de descanso
        restDiv.style.display    = 'block';                // Mostra o texto de descanso informando que o usuário pode descansar
        focusDiv.style.display   = 'none';                 // Remove o texto de foco
      }
    }
  }, 1000);

  // Atualiza a citação motivacional de 5 em 5 segundos
  quoteInterval = setInterval(() => {
    if (!timerSettings.isPaused) {
      showRandomQuote();
    }
  }, 5000);
}

// Pausa o relógio (timer)
function pauseTimer() {
  // Pausa (ou despausa) o timer
  timerSettings.isPaused = !timerSettings.isPaused;

  // Se ele já estiver pausado, altera o texto do botão para 'Retomar Ciclo'
  if (timerSettings.isPaused) pauseButton.innerText = 'Retomar Ciclo';
  // Caso contrário, o texto do botão é definido para 'Pausar Ciclo'
  else pauseButton.innerText = 'Pausar Ciclo';
}

// Reinicia o ciclo do relógio (timer)
function restartTimer() {
  // Conta um ciclo de pomodoro realizado
  localStorage.setItem(
    "cycles_total",
    Number(localStorage.getItem("cycles_total")) + 1
  );
  
  // Limpa os intervalos do timer e das citações
  clearTimeout(timerInterval);
  clearTimeout(quoteInterval);

  // Reconfigura o timer
  timerSetup();
  // Inicia o timer
  startTimer();
}

// Para o relógio (timer)
function stopTimer() {
  clearTimeout(timerInterval);
  clearTimeout(quoteInterval);
  timerSetup();
}

// Função para atualizar os valores no display
function updateDisplay(secondsRemaining) {
  const seconds = secondsRemaining % 60;
  const minutes = Math.floor(secondsRemaining / 60);

  minutesLabel.innerText = String(minutes).padStart(2, '0');
  secondsLabel.innerText = String(seconds).padStart(2, '0');
}

// Função para mostrar as citações
function showRandomQuote() {
  // Mostra o elemento de citação
  quoteLabel.style.display = 'inline';

  // Array com as citações motivacionais
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

  // Seleciona um índice aleatório deste array e retorna o seu valor (citação)
  const randomQuote = quotes[(Math.random() * quotes.length) | 0]
  // Atualiza em tela para visualização do usuário
  quoteLabel.innerText = randomQuote;
}

// Função para mostrar uma notificação no computador
function dispatchNotification(title, message) {
  new window.Notification(title, { body: message });
}