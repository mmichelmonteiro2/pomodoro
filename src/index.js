const { app, BrowserWindow } = require("electron");

const { listUsers } = require('../src/database/repositories/users-repository');
const { deleteUncompletedPomodoros } = require('../src/database/repositories/pomodoros-repository');

const path = require("path");

async function createWindow() {
  // Cria a janela da aplicação com 600 de altura para 800 de largura
  const mainWindow = new BrowserWindow({
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      devTools: true,
    },
    width: 800,
    height: 600
  });

  // Verifica se o usuário já possui uma conta na aplicação
  const userIsRegistered = await listUsers().length !== 0;

  // Carrega o arquivo de boas-vindas ou de pomodoro para a janela da aplicação
  // caso o usuário já esteja cadastrado, é renderizado a tela de pomodoro, mas
  // se o usuário não estiver cadastrado, ele é redirecionado para a tela de cadastro
  mainWindow.loadFile(
    path.join(
      __dirname, userIsRegistered ? "./views/main/index.html" : '/views/welcome/index.html'
    )
  );
}

// Assim que a aplicação estiver pronta, ela chamará a função createWindow()
// para iniciar uma janela da aplicação
app.whenReady().then(() => {
  createWindow();

  app.on("activate", function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

// Quando o usuário fechar a janela, ele executa a ação de fechar a janela
app.on("window-all-closed", () => {
  // Apaga todos os pomodoros que não foram finalizados corretamente.
  deleteUncompletedPomodoros();
  
  // Verifica se o usuário está executando a aplicação no macOS,
  // pois, para este caso, ele fecha a aplicação da maneira correta
  // (o macOS, por padrão, minimiza a janela ao fechar e não a fecha realmente)
  if (process.platform !== "darwin") {
    app.quit();
  }
});