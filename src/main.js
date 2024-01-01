const { app, BrowserWindow } = require("electron");

const { getUsers } = require("./database/dao/users.dao");
const { removePomodoroUncompleted } = require("./database/dao/pomodoros.dao")

const path = require("path");

function createWindow() {
  // Cria a janela da aplicação com 600 de altura para 800 de largura
  const mainWindow = new BrowserWindow({
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
    width: 800,
    resizable: false
  });

  // Verifica se o usuário já possui uma conta na aplicação
  const userIsRegistered = getUsers().length !== 0;

  // Carrega o arquivo de boas-vindas ou de pomodoro para a janela da aplicação
  // caso o usuário já esteja cadastrado, é renderizado a tela de pomodoro, mas
  // se o usuário não estiver cadastrado, ele é redirecionado para a tela de cadastro
  mainWindow.loadFile(
    path.join(
      __dirname, userIsRegistered ? "./views/main/index.html" : '/views/welcome/index.html'
    )
  );

  mainWindow.webContents.openDevTools();
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
  removePomodoroUncompleted();
  
  // Verifica se o usuário está executando a aplicação no macOS,
  // pois, para este caso, ele fecha a aplicação da maneira correta
  // (o macOS, por padrão, minimiza a janela ao fechar e não a fecha realmente)
  if (process.platform !== "darwin") {
    app.quit();
  }
});