const path = require('path')
const sqlite = require("better-sqlite3-with-prebuilds");

const dbPath = path.resolve(__dirname, "../../database.db");
const db = new sqlite(dbPath);

exports.db = db;