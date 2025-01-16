'use client';

import { useGameContext } from '../../context/GameContext';
import styles from './GameBoard.module.css';

export default function GameBoard() {
    const {
        nodes,
        connections,
        nodeColors,
        selectedNode,
        handleNodeClick,
        svgRef,
        getAdjacentNodes,
        colorNode,
        conflictNodes,
        isLevelComplete
    } = useGameContext();

    const getNodeClass = (nodeId) => {
        const classes = ['node'];
        
        if (nodeColors[nodeId]) {
            classes.push('colored');
        } else {
            classes.push('uncolored');
        }
        
        if (selectedNode === nodeId) {
            classes.push('selected');
        }
        
        if (selectedNode && getAdjacentNodes(selectedNode).includes(nodeId)) {
            classes.push('connected-to-selected');
        }

        if (conflictNodes.has(nodeId)) {
            classes.push('conflict');
        }

        if (isLevelComplete) {
            classes.push('correct');
        }
        
        return classes.join(' ');
    };

    const getConnectionClass = (fromId, toId) => {
        const classes = ['connection'];
        
        if (selectedNode && (fromId === selectedNode || toId === selectedNode)) {
            classes.push('connected-to-selected');
        }
        
        return classes.join(' ');
    };

    const handleDragOver = (e, nodeId) => {
        e.preventDefault();
        // Resaltar el nodo actual
        const node = e.target;
        node.style.stroke = '#00ffff';
        node.style.strokeWidth = '4';
    };

    const handleDragLeave = (e) => {
        // Restaurar el estilo original
        const node = e.target;
        node.style.stroke = '';
        node.style.strokeWidth = '';
    };

    const handleDrop = (e, nodeId) => {
        e.preventDefault();
        const color = e.dataTransfer.getData('text/plain');
        // Restaurar el estilo original
        const node = e.target;
        node.style.stroke = '';
        node.style.strokeWidth = '';
        if (color) {
            colorNode(nodeId, color);
        }
    };

    return (
        <svg 
            ref={svgRef}
            className={styles.gameBoard}
            width="800" 
            height="800" 
            viewBox="0 0 800 800"
        >
            {/* Dibujar conexiones */}
            {connections.map((conn, index) => {
                const fromNode = nodes.find(n => n.id === conn.from);
                const toNode = nodes.find(n => n.id === conn.to);
                return (
                    <line
                        key={`conn-${index}`}
                        x1={fromNode.x}
                        y1={fromNode.y}
                        x2={toNode.x}
                        y2={toNode.y}
                        className={getConnectionClass(conn.from, conn.to)}
                    />
                );
            })}

            {/* Dibujar nodos */}
            {nodes.map((node) => (
                <circle
                    key={node.id}
                    cx={node.x}
                    cy={node.y}
                    r="20"
                    fill={nodeColors[node.id] || '#333333'}
                    data-id={node.id}
                    className={getNodeClass(node.id)}
                    onClick={() => handleNodeClick(node.id)}
                    onDragOver={(e) => handleDragOver(e, node.id)}
                    onDragLeave={handleDragLeave}
                    onDrop={(e) => handleDrop(e, node.id)}
                />
            ))}
        </svg>
    );
}