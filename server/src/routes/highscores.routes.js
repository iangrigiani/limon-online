const express = require('express');
const router = express.Router();
const db = require('../db/init');

// GET /api/highscores/:levelNumber
router.get('/:levelNumber', (req, res) => {
    const levelNumber = parseInt(req.params.levelNumber);
    
    db.all(
        `SELECT player_name, time 
         FROM high_scores 
         WHERE level = ? 
         ORDER BY time ASC 
         LIMIT 10`,
        [levelNumber],
        (err, rows) => {
            if (err) {
                res.status(500).json({ error: 'Database error' });
                return;
            }
            res.json(rows);
        }
    );
});

// POST /api/highscores
router.post('/', (req, res) => {
    const { level, playerName, time } = req.body;
    
    db.run(
        `INSERT INTO high_scores (level, player_name, time) 
         VALUES (?, ?, ?)`,
        [level, playerName, time],
        function(err) {
            if (err) {
                res.status(500).json({ error: err.name + ' ' + err.message + ' ' + err.stack });
                return;
            }
            res.json({ id: this.lastID });
        }
    );
});

// GET /api/highscores/:levelNumber/check/:time
router.get('/:levelNumber/check/:time', (req, res) => {
    const levelNumber = parseInt(req.params.levelNumber);
    const time = parseInt(req.params.time);
    
    db.get(
        `SELECT COUNT(*) as count 
         FROM high_scores 
         WHERE level = ? AND time <= ? 
         ORDER BY time ASC`,
        [levelNumber, time],
        (err, row) => {
            if (err) {
                res.status(500).json({ error: 'Database error' });
                return;
            }
            const isHighScore = row.count < 10;
            res.json({ isHighScore });
        }
    );
});

module.exports = router; 