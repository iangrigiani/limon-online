import { useState, useCallback, useRef } from 'react';
import { gameService } from '../services/gameService';

export function useGame() {
    // Estados básicos
    const [nodes, setNodes] = useState([]);
    const [connections, setConnections] = useState([]);
    const [nodeColors, setNodeColors] = useState({});
    const [selectedNode, setSelectedNode] = useState(null);
    const [isLevelComplete, setIsLevelComplete] = useState(false);
    const [currentLevel, setCurrentLevel] = useState(1);
    const [conflictNodes, setConflictNodes] = useState(new Set());
    const [showNameInput, setShowNameInput] = useState(false);
    const [highScores, setHighScores] = useState([]);
    
    // Referencias
    const svgRef = useRef(null);
    const timerInterval = useRef(null);
    const pendingScore = useRef(null);
    
    // Timer states
    const [timerStarted, setTimerStarted] = useState(false);
    const [time, setTime] = useState(0);

    // Colores disponibles
    const colors = ['#FF0000', '#00FF00', '#0000FF', '#FFD700'];

    // Funciones básicas
    const getAdjacentNodes = useCallback((nodeId) => {
        return connections
            .filter(conn => conn.from === nodeId || conn.to === nodeId)
            .map(conn => conn.from === nodeId ? conn.to : conn.from);
    }, [connections]);

    const getNodeClass = useCallback((nodeId) => {
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
    }, [nodeColors, selectedNode, getAdjacentNodes, conflictNodes, isLevelComplete]);

    const getConnectionClass = useCallback((fromId, toId) => {
        const classes = ['connection'];
        
        if (selectedNode && (fromId === selectedNode || toId === selectedNode)) {
            classes.push('connected-to-selected');
        }
        
        return classes.join(' ');
    }, [selectedNode]);

    // High Scores
    const loadHighScores = useCallback(async (levelNumber) => {
        try {
            const scores = await gameService.getHighScores(levelNumber);
            setHighScores(scores);
        } catch (error) {
            console.error('Error loading high scores:', error);
        }
    }, []);

    const handleHighScore = useCallback(async (playerName) => {
        if (!pendingScore.current) return;
        
        try {
            await gameService.saveHighScore(
                currentLevel,
                playerName,
                pendingScore.current
            );
            window.dispatchEvent(new Event('highscoreUpdate'));
            setShowNameInput(false);
            pendingScore.current = null;
        } catch (error) {
            console.error('Error saving high score:', error);
        }
    }, [currentLevel]);

    const skipHighScore = useCallback(() => {
        setShowNameInput(false);
        pendingScore.current = null;
    }, []);

    // Level management
    const levelComplete = useCallback(async () => {
        setIsLevelComplete(true);
        if (timerInterval.current) {
            clearInterval(timerInterval.current);
            timerInterval.current = null;
        }

        try {
            const { isHighScore } = await gameService.checkHighScore(currentLevel, time);
            if (isHighScore) {
                pendingScore.current = time;
                setShowNameInput(true);
            }
        } catch (error) {
            console.error('Error checking high score:', error);
        }
    }, [currentLevel, time]);

    const loadLevel = useCallback(async (level) => {
        try {
            // Limpiar el intervalo existente si hay uno
            if (timerInterval.current) {
                clearInterval(timerInterval.current);
                timerInterval.current = null;
            }

            const data = await gameService.loadLevel(level);
            setNodes(data.nodes);
            setConnections(data.connections);
            setCurrentLevel(level);
            setNodeColors({});
            setSelectedNode(null);
            setConflictNodes(new Set());
            setIsLevelComplete(false);
            setTime(0);
            setTimerStarted(false);
        } catch (error) {
            console.error('Error loading level:', error);
        }
    }, []);

    // Colorear nodo
    const colorNode = useCallback((nodeId, color) => {
        // Solo iniciar el timer si es la primera vez que se colorea un nodo
        if (Object.keys(nodeColors).length === 0) {
            if (timerInterval.current) {
                clearInterval(timerInterval.current);
            }
            setTimerStarted(true);
            timerInterval.current = setInterval(() => {
                setTime(prev => prev + 10);
            }, 10);
        }

        setNodeColors(prev => {
            const newColors = { ...prev, [nodeId]: color };
            
            // Verificar conflictos solo para nodos coloreados
            const newConflicts = new Set();
            nodes.forEach(node => {
                if (newColors[node.id]) {
                    const nodeAdjacents = getAdjacentNodes(node.id);
                    nodeAdjacents.forEach(adjId => {
                        if (newColors[adjId] && newColors[adjId] === newColors[node.id]) {
                            newConflicts.add(node.id);
                            newConflicts.add(adjId);
                        }
                    });
                }
            });
            
            setConflictNodes(newConflicts);
            
            // Verificar si el nivel está completo
            if (Object.keys(newColors).length === nodes.length && newConflicts.size === 0) {
                levelComplete();
            }
            
            return newColors;
        });
    }, [nodes, nodeColors, getAdjacentNodes, levelComplete]);

    // Manejar click en nodo
    const handleNodeClick = useCallback((nodeId) => {
        setSelectedNode(prevSelected => {
            // Si el nodo clickeado es el mismo que ya estaba seleccionado,
            // deseleccionamos el nodo
            if (prevSelected === nodeId) {
                return null;
            }
            return nodeId;
        });
    }, []);

    // Formatear tiempo
    const formatTime = useCallback((ms) => {
        const minutes = Math.floor(ms / 60000);
        const seconds = Math.floor((ms % 60000) / 1000);
        const centiseconds = Math.floor((ms % 1000) / 10);
        return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${centiseconds.toString().padStart(2, '0')}`;
    }, []);

    return {
        nodes,
        connections,
        nodeColors,
        selectedNode,
        isLevelComplete,
        currentLevel,
        colors,
        time,
        timerStarted,
        conflictNodes,
        showNameInput,
        highScores,
        svgRef,
        loadLevel,
        colorNode,
        handleNodeClick,
        formatTime,
        getNodeClass,
        getConnectionClass,
        handleHighScore,
        skipHighScore
    };
} 