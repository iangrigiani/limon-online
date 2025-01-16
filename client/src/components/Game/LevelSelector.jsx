'use client';

import { useEffect } from 'react';
import { useGameContext } from '../../context/GameContext';
import styles from './LevelSelector.module.css';

export default function LevelSelector() {
    const { currentLevel, loadLevel } = useGameContext();

    console.log('cargando el componente');
    // Cargar nivel inicial solo una vez al montar el componente
    useEffect(() => {
        loadLevel(1);
    }, []); // Sin dependencias

    const handleLevelChange = (e) => {
        const level = parseInt(e.target.value);
        loadLevel(level);
    };

    return (
        <div className={styles.levelSelector}>
            <select 
                value={currentLevel}
                onChange={handleLevelChange}
                className={styles.select}
            >
                {[...Array(100)].map((_, i) => (
                    <option key={i + 1} value={i + 1}>
                        Nivel {i + 1}
                    </option>
                ))}
            </select>
        </div>
    );
} 