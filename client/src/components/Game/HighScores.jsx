'use client';

import { useState, useEffect } from 'react';
import { useGameContext } from '../../context/GameContext';
import { gameService } from '../../services/gameService';
import styles from './HighScores.module.css';

export default function HighScores({ level }) {
    const [scores, setScores] = useState([]);
    const { formatTime } = useGameContext();

    const loadScores = async () => {
        try {
            const data = await gameService.getHighScores(level);
            setScores(data);
        } catch (error) {
            console.error('Error loading scores:', error);
        }
    };

    // Cargar scores cuando cambia el nivel
    useEffect(() => {
        loadScores();
    }, [level]);

    // Suscribirse a eventos de actualización de high scores
    useEffect(() => {
        const handleScoreUpdate = () => {
            loadScores();
        };

        window.addEventListener('highscoreUpdate', handleScoreUpdate);
        return () => {
            window.removeEventListener('highscoreUpdate', handleScoreUpdate);
        };
    }, [level]);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('es-ES', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        }).replace(/\//g, '/');
    };

    return (
        <div className={styles.highScores}>
            <h2>Mejores Tiempos</h2>
            <div className={styles.levelNumber}>Nivel {level}</div>
            <table>
                <thead>
                    <tr>
                        <th>Pos</th>
                        <th>Nombre</th>
                        <th>Tiempo</th>
                    </tr>
                </thead>
                <tbody>
                    {scores.map((score, index) => (
                        <tr key={index}>
                            <td>{index + 1}</td>
                            <td>{score.player_name}</td>
                            <td>{formatTime(score.time)}</td>
                        </tr>
                    ))}
                    {scores.length === 0 && (
                        <tr>
                            <td colSpan="4" className={styles.noScores}>
                                No hay registros
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}