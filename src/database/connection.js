const path = require('path')
const sqlite = require("better-sqlite3-with-prebuilds");

// Procura onde o arquivo "database.db" se encontra
const dbPath = path.resolve(__dirname, "../../database.db");

// Cria uma nova instância de conexão com o banco de dados sqlite3
const connection = new sqlite(dbPath);

module.exports = { connection };