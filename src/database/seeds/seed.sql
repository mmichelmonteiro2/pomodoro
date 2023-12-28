CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    focus_time INTEGER NOT NULL,
    rest_time INTEGER NOT NULL
);

CREATE TABLE pomodoros (
   id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
   started_at DATE,
   ended_at DATE,
   focus_time INTEGER,
   rest_time INTEGER,
   finished_count INTEGER,
   user_id INTEGER,
   FOREIGN KEY(user_id) REFERENCES users(id)
);