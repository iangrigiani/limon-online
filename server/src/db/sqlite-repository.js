const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const dbConfig = require('../config/database');

class SQLiteRepository {
    constructor() {
        const dbPath = path.join(__dirname, dbConfig.database);
        this.db = new sqlite3.Database(dbPath, (err) => {
            if (err) {
                console.error('Error connecting to SQLite database:', err);
            } else {
                console.log('Connected to SQLite database');
                this.initializeDatabase();
            }
        });
    }

    initializeDatabase() {
        this.db.run(`
            CREATE TABLE IF NOT EXISTS high_scores (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                level INTEGER NOT NULL,
                player_name TEXT NOT NULL,
                time INTEGER NOT NULL,
                date DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        `);
    }

    async getHighScores(level) {
        return new Promise((resolve, reject) => {
            this.db.all(
                'SELECT * FROM high_scores WHERE level = ? ORDER BY time ASC LIMIT 10',
                [level],
                (err, rows) => {
                    if (err) {
                        console.error('Error getting high scores:', err);
                        reject(err);
                    } else {
                        resolve(rows);
                    }
                }
            );
        });
    }

    async saveHighScore(level, playerName, time) {
        return new Promise((resolve, reject) => {
            this.db.run(
                'INSERT INTO high_scores (level, player_name, time) VALUES (?, ?, ?)',
                [level, playerName, time],
                function(err) {
                    if (err) {
                        console.error('Error saving high score:', err);
                        reject(err);
                    } else {
                        resolve(this.lastID);
                    }
                }
            );
        });
    }

    // Método para cerrar la conexión cuando sea necesario
    async close() {
        return new Promise((resolve, reject) => {
            this.db.close((err) => {
                if (err) {
                    console.error('Error closing database:', err);
                    reject(err);
                } else {
                    resolve();
                }
            });
        });
    }
}

module.exports = SQLiteRepository; 