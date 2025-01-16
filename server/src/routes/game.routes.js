const express = require('express');
const router = express.Router();
const { LevelGenerator } = require('../lib/levelGenerator');
const { LevelLoader } = require('../lib/levelLoader');

const levelLoader = new LevelLoader();

// GET /api/game/level/:levelNumber
router.get('/level/:levelNumber', async (req, res) => {
    try {
        const levelNumber = parseInt(req.params.levelNumber);
        const levelData = await levelLoader.loadLevel(levelNumber);
        res.json(levelData);
    } catch (error) {
        res.status(500).json({ error: 'Error loading level' });
    }
});

// POST /api/game/validate
router.post('/validate', (req, res) => {
    const { nodes, connections, colors } = req.body;
    
    // Validar si la solución es correcta
    const isValid = nodes.every(node => {
        const adjacentNodes = connections
            .filter(conn => conn.from === node.id || conn.to === node.id)
            .map(conn => conn.from === node.id ? conn.to : conn.from);

        return !adjacentNodes.some(adjId => colors[adjId] === colors[node.id]);
    });

    res.json({ isValid });
});

module.exports = router; 