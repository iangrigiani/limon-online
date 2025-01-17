const dbConfig = require('../config/database');
const SQLiteRepository = require('./sqlite-repository');
const PostgresRepository = require('./postgres-repository');

class DatabaseFactory {
    static createRepository() {
        switch(dbConfig.type) {
            case 'sqlite':
                return new SQLiteRepository();
            case 'postgres':
                return new PostgresRepository();
            default:
                throw new Error(`Database type ${dbConfig.type} not supported`);
        }
    }
}

module.exports = DatabaseFactory.createRepository(); 