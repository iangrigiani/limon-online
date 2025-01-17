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