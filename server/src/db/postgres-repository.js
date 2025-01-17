const { Pool } = require('pg');
const dbConfig = require('../config/database');

class PostgresRepository {
    constructor() {
        this.pool = new Pool({
            host: dbConfig.host,
            port: dbConfig.port,
            database: dbConfig.database,
            user: dbConfig.user,
            password: dbConfig.password,
            ssl: dbConfig.ssl
        });

        this.initializeDatabase();
    }

    async initializeDatabase() {
        try {
            await this.pool.query(`
                CREATE TABLE IF NOT EXISTS high_scores (
                    id SERIAL PRIMARY KEY,
                    level INTEGER NOT NULL,
                    player_name TEXT NOT NULL,
                    time INTEGER NOT NULL,
                    date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                )
            `);
        } catch (error) {
            console.error('Error initializing Postgres database:', error);
        }
    }

    async getHighScores(level) {
        const result = await this.pool.query(
            'SELECT * FROM high_scores WHERE level = $1 ORDER BY time ASC LIMIT 10',
            [level]
        );
        return result.rows;
    }

    async saveHighScore(level, playerName, time) {
        const result = await this.pool.query(
            'INSERT INTO high_scores (level, player_name, time) VALUES ($1, $2, $3) RETURNING id',
            [level, playerName, time]
        );
        return result.rows[0].id;
    }
}

module.exports = PostgresRepository; 