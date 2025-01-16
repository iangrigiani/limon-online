'use client';

import { useGameContext } from '../../context/GameContext';
import styles from './Timer.module.css';

export default function Timer() {
    const { time, formatTime, isLevelComplete } = useGameContext();

    return (
        <div className={styles.timer}>
            {isLevelComplete ? (
                <span className={styles.complete}>
                    ¡Felicitaciones! Has completado el nivel en {formatTime(time)}
                </span>
            ) : (
                <span>
                    Tiempo: {formatTime(time)}
                </span>
            )}
        </div>
    );
} 