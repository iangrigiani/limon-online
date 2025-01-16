const { LevelGenerator } = require('./levelGenerator');

class LevelLoader {
    constructor() {
        this.levels = {};
        this.maxLevels = 100;
    }
    
    async loadLevel(levelNumber) {
        try {
            if (this.levels[levelNumber]) {
                return this.levels[levelNumber];
            }

            // Generar nivel directamente sin XML
            const levelData = LevelGenerator.generateLevel(levelNumber);
            this.levels[levelNumber] = levelData;
            return levelData;
        } catch (error) {
            console.error('Error al cargar el nivel:', error);
            throw error;
        }
    }
}

module.exports = { LevelLoader };
