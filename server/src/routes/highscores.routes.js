const express = require('express');
const router = express.Router();
const db = require('../db');

// GET /api/highscores/:level
router.get('/:level', async (req, res) => {
    try {
        const level = parseInt(req.params.level);
        const scores = await db.getHighScores(level);
        res.json(scores);
    } catch (error) {
        console.error('Error getting high scores:', error);
        res.status(500).json({ error: 'Error retrieving high scores' });
    }
});

// GET /api/highscores/:level/check/:time
router.get('/:level/check/:time', async (req, res) => {
    try {
        const level = parseInt(req.params.level);
        const time = parseInt(req.params.time);
        const scores = await db.getHighScores(level);
        
        // Si hay menos de 10 scores, es automáticamente un high score
        if (scores.length < 10) {
            return res.json({ isHighScore: true });
        }
        
        // Si el tiempo es menor que el peor tiempo de los top 10, es un high score
        const isHighScore = time < scores[scores.length - 1].time;
        res.json({ isHighScore });
    } catch (error) {
        console.error('Error checking high score:', error);
        res.status(500).json({ error: 'Error checking high score' });
    }
});

// POST /api/highscores
router.post('/', async (req, res) => {
    try {
        const { level, playerName, time } = req.body;
        const id = await db.saveHighScore(level, playerName, time);
        res.json({ id });
    } catch (error) {
        console.error('Error saving high score:', error);
        res.status(500).json({ error: 'Error saving high score' });
    }
});

module.exports = router; 