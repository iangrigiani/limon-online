'use client';

import { useGameContext } from '../../context/GameContext';
import styles from './ColorPanel.module.css';

export default function ColorPanel() {
    const { colors, selectedNode, colorNode } = useGameContext();

    const handleDragStart = (e, color) => {
        e.dataTransfer.setData('text/plain', color);
        
        // Crear el elemento fantasma personalizado
        const ghost = document.createElement('div');
        ghost.style.width = '40px';
        ghost.style.height = '40px';
        ghost.style.backgroundColor = color;
        ghost.style.borderRadius = '50%';
        ghost.style.position = 'absolute';
        ghost.style.top = '-1000px';
        document.body.appendChild(ghost);
        
        e.dataTransfer.setDragImage(ghost, 20, 20);
        
        // Eliminar el elemento fantasma después
        setTimeout(() => {
            document.body.removeChild(ghost);
        }, 0);
    };

    return (
        <div className={styles.colorPanel}>
            {colors.map((color, index) => (
                <div
                    key={index}
                    className={styles.colorButton}
                    style={{ backgroundColor: color }}
                    data-color={color}
                    onClick={() => selectedNode && colorNode(selectedNode, color)}
                    draggable="true"
                    onDragStart={(e) => handleDragStart(e, color)}
                />
            ))}
        </div>
    );
} 