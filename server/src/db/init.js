const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const db = new sqlite3.Database(path.join(__dirname, 'highscores.db'));

db.serialize(() => {
    db.run(`
        CREATE TABLE IF NOT EXISTS high_scores (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            level INTEGER NOT NULL,
            player_name TEXT NOT NULL,
            time INTEGER NOT NULL,
            date DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `);
});

module.exports = db; 