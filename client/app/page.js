'use client';

import { GameProvider } from '../src/context/GameContext';
import Layout from '../src/components/Layout/Layout';
import GameBoard from '../src/components/Game/GameBoard';
import ColorPanel from '../src/components/Game/ColorPanel';
import LevelSelector from '../src/components/Game/LevelSelector';
import Timer from '../src/components/Game/Timer';
import HighScores from '../src/components/Game/HighScores';
import NameInput from '../src/components/Game/NameInput';
import { useGameContext } from '../src/context/GameContext';
import styles from '../src/styles/Game.module.css';

// Separar los componentes que necesitan el contexto
function GameControls() {
    return (
        <div className={styles.controls}>
            <LevelSelector />
            <Timer />
            <ColorPanel />
        </div>
    );
}

function GameArea({ currentLevel }) {
    return (
        <div className={styles.gameArea}>
            <GameBoard />
            <HighScores level={currentLevel} />
        </div>
    );
}

function NameInputWrapper({ onSubmit, onSkip, show }) {
    if (!show) return null;
    return <NameInput onSubmit={onSubmit} onSkip={onSkip} />;
}

function Game() {
    const { 
        currentLevel, 
        showNameInput, 
        handleHighScore, 
        skipHighScore 
    } = useGameContext();

    return (
        <Layout>
            <h1 className={styles.title}>Juego de los Cuatro Colores</h1>
            <GameControls />
            <GameArea currentLevel={currentLevel} />
            <NameInputWrapper 
                show={showNameInput}
                onSubmit={handleHighScore}
                onSkip={skipHighScore}
            />
        </Layout>
    );
}

export default function Home() {
    return (
        <GameProvider>
            <Game />
        </GameProvider>
    );
}