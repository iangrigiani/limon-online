const express = require('express');
const cors = require('cors');
const gameRoutes = require('./routes/game.routes');
const highscoresRoutes = require('./routes/highscores.routes');
require('dotenv').config();

const app = express();

console.log("App starting...");
app.use(cors({
    origin: process.env.CORS_ORIGIN,
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type']
}));

app.use(express.json());

// Rutas
app.use('/api/game', gameRoutes);
app.use('/api/highscores', highscoresRoutes);

/*
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
}); */