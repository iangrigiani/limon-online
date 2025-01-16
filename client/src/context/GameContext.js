'use client';

import { createContext, useContext } from 'react';
import { useGame } from '../hooks/useGame';

const GameContext = createContext(null);

export function GameProvider({ children }) {
    const gameState = useGame();
    
    return (
        <GameContext.Provider value={gameState}>
            {children}
        </GameContext.Provider>
    );
}

export function useGameContext() {
    const context = useContext(GameContext);
    if (!context) {
        throw new Error('useGameContext must be used within a GameProvider');
    }
    return context;
} 