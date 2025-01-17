const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

export const gameService = {
    async loadLevel(levelNumber) {
        console.log("ENV: " + process.env.NEXT_PUBLIC_API_URL);
        try {
            const response = await fetch(`${API_URL}/game/level/${levelNumber}`);
            if (!response.ok) {
                throw new Error('Error loading level');
            }
            return await response.json();
        } catch (error) {
            console.error('Error:', error);
            throw error;
        }
    },

    async validateSolution(nodes, connections, colors) {
        try {
            const response = await fetch(`${API_URL}/validate`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ nodes, connections, colors }),
            });
            if (!response.ok) {
                throw new Error('Error validating solution');
            }
            return await response.json();
        } catch (error) {
            console.error('Error:', error);
            throw error;
        }
    },

    async getHighScores(levelNumber) {
        try {
            const response = await fetch(`${API_URL}/highscores/${levelNumber}`);
            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || 'Error loading high scores');
            }
            return await response.json();
        } catch (error) {
            console.error('Error loading high scores:', error);
            return []; // Retornar array vacío en caso de error
        }
    },

    async checkHighScore(levelNumber, time) {
        try {
            const response = await fetch(`${API_URL}/highscores/${levelNumber}/check/${time}`);
            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || 'Error checking high score');
            }
            return await response.json();
        } catch (error) {
            console.error('Error checking high score:', error);
            return { isHighScore: false };
        }
    },

    async saveHighScore(levelNumber, playerName, time) {
        try {
            const response = await fetch(`${API_URL}/highscores`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    level: levelNumber,
                    playerName,
                    time
                }),
            });
            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || 'Error saving high score');
            }
            return await response.json();
        } catch (error) {
            console.error('Error saving high score:', error);
            throw error;
        }
    }
}; 
