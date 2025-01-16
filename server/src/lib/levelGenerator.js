class LevelGenerator {
    // Configuración general
    static CONFIG = {
        // Dimensiones del área de juego
        CANVAS_SIZE: 800,
        MARGIN: 100,
        
        // Configuración de nodos
        MIN_NODES: 6,
        MAX_NODES: 40,
        MIN_NODE_DISTANCE: 100,
        NODE_POSITION_MAX_ATTEMPTS: 150,
        
        // Configuración de conexiones
        BASE_MIN_EDGES: 2,
        BASE_MAX_EDGES: 3,
        MAX_MIN_EDGES: 4,
        MAX_MAX_EDGES: 7,
        EDGES_MIN_LEVEL_STEP: 25,  // Cada cuántos niveles aumenta minEdges
        EDGES_MAX_LEVEL_STEP: 20   // Cada cuántos niveles aumenta maxEdges
    };

    static generateLevel(levelNumber) {
        const config = this.getLevelConfig(levelNumber);
        const nodes = this.generateNodes(config);
        const connections = this.generateConnections(nodes, config);
        
        // En lugar de generar XML, retornamos directamente el objeto
        return {
            nodes,
            connections
        };
    }

    static getLevelConfig(levelNumber) {
        const { CONFIG } = this;
        return {
            nodeCount: Math.round(CONFIG.MIN_NODES + 
                ((CONFIG.MAX_NODES - CONFIG.MIN_NODES) * (levelNumber - 1) / 99)),
            minEdgesPerNode: Math.min(CONFIG.BASE_MIN_EDGES + 
                Math.floor(levelNumber / CONFIG.EDGES_MIN_LEVEL_STEP), CONFIG.MAX_MIN_EDGES),
            maxEdgesPerNode: Math.min(CONFIG.BASE_MAX_EDGES + 
                Math.floor(levelNumber / CONFIG.EDGES_MAX_LEVEL_STEP), CONFIG.MAX_MAX_EDGES),
            pattern: this.getPatternForLevel(levelNumber)
        };
    }

    static getPatternForLevel(levelNumber) {
        // Ahora usaremos patrones aleatorios para más variedad
        if (levelNumber <= 3) {
            // Niveles iniciales: mezcla de patrones simples
            return ['simple-random', 'simple-circular', 'simple-scattered'][Math.floor(Math.random() * 3)];
        } else if (levelNumber <= 8) {
            // Niveles intermedios: más variedad de patrones
            return ['scattered', 'asymmetric', 'clustered'][Math.floor(Math.random() * 3)];
        } else {
            // Niveles avanzados: patrones complejos y aleatorios
            return ['complex-random', 'multi-cluster', 'dynamic'][Math.floor(Math.random() * 3)];
        }
    }

    static generateNodes(config) {
        const nodes = [];
        const { nodeCount, pattern } = config;
        const { CANVAS_SIZE, MARGIN } = this.CONFIG;
        const centerX = CANVAS_SIZE / 2;
        const centerY = CANVAS_SIZE / 2;

        switch (pattern) {
            case 'simple-random':
                // Distribución aleatoria usando todo el espacio
                for (let i = 0; i < nodeCount; i++) {
                    nodes.push({
                        id: `n${i + 1}`,
                        x: Math.round(MARGIN + Math.random() * (CANVAS_SIZE - 2 * MARGIN)),
                        y: Math.round(MARGIN + Math.random() * (CANVAS_SIZE - 2 * MARGIN))
                    });
                }
                break;

            case 'simple-circular':
                // Distribución circular usando más espacio
                const radius = Math.min(CANVAS_SIZE - 2 * MARGIN) * 0.4; // 40% del espacio disponible
                for (let i = 0; i < nodeCount; i++) {
                    const baseAngle = (i * Math.PI * 2) / nodeCount;
                    const angleVar = (Math.random() - 0.5) * Math.PI / 6;
                    const r = radius + (Math.random() - 0.5) * radius * 0.3;
                    nodes.push({
                        id: `n${i + 1}`,
                        x: Math.round(centerX + r * Math.cos(baseAngle + angleVar)),
                        y: Math.round(centerY + r * Math.sin(baseAngle + angleVar))
                    });
                }
                break;

            case 'scattered':
                // Distribución en clusters espaciados
                const clusterCount = Math.floor(nodeCount / 3);
                const clusterCenters = [];
                
                // Generar centros de clusters bien distribuidos
                for (let i = 0; i < clusterCount; i++) {
                    clusterCenters.push({
                        x: MARGIN + ((CANVAS_SIZE - 2 * MARGIN) * (i + 1)) / (clusterCount + 1),
                        y: MARGIN + Math.random() * (CANVAS_SIZE - 2 * MARGIN)
                    });
                }

                for (let i = 0; i < nodeCount; i++) {
                    if (i < clusterCount * 2) {
                        const cluster = clusterCenters[i % clusterCount];
                        const offset = 120; // Reducido para evitar salirse del tablero
                        nodes.push({
                            id: `n${i + 1}`,
                            x: Math.round(Math.max(MARGIN, Math.min(CANVAS_SIZE - MARGIN, 
                                cluster.x + (Math.random() - 0.5) * offset))),
                            y: Math.round(Math.max(MARGIN, Math.min(CANVAS_SIZE - MARGIN, 
                                cluster.y + (Math.random() - 0.5) * offset)))
                        });
                    } else {
                        nodes.push({
                            id: `n${i + 1}`,
                            x: Math.round(MARGIN + Math.random() * (CANVAS_SIZE - 2 * MARGIN)),
                            y: Math.round(MARGIN + Math.random() * (CANVAS_SIZE - 2 * MARGIN))
                        });
                    }
                }
                break;

            case 'asymmetric':
                // Distribución asimétrica usando todo el espacio
                const quadrants = [[1,1], [1,-1], [-1,1], [-1,-1]];
                const maxRadius = Math.min(CANVAS_SIZE - 2 * MARGIN) * 0.4;
                for (let i = 0; i < nodeCount; i++) {
                    const quad = quadrants[i % quadrants.length];
                    const r = Math.random() * maxRadius + maxRadius * 0.2;
                    const angle = Math.random() * Math.PI / 2;
                    nodes.push({
                        id: `n${i + 1}`,
                        x: Math.round(Math.max(MARGIN, Math.min(CANVAS_SIZE - MARGIN,
                            centerX + quad[0] * r * Math.cos(angle)))),
                        y: Math.round(Math.max(MARGIN, Math.min(CANVAS_SIZE - MARGIN,
                            centerY + quad[1] * r * Math.sin(angle))))
                    });
                }
                break;

            case 'complex-random':
                // Distribución compleja usando todo el espacio disponible
                for (let i = 0; i < nodeCount; i++) {
                    let x, y;
                    if (i % 3 === 0) {
                        const angle = (i * 137.5 * Math.PI) / 180;
                        const r = Math.sqrt(i) * ((CANVAS_SIZE - 2 * MARGIN) * 0.15);
                        x = centerX + r * Math.cos(angle);
                        y = centerY + r * Math.sin(angle);
                    } else if (i % 3 === 1) {
                        x = MARGIN + (i * (CANVAS_SIZE - 2 * MARGIN) / nodeCount);
                        y = MARGIN + (i * (CANVAS_SIZE - 2 * MARGIN) / nodeCount);
                    } else {
                        x = MARGIN + Math.random() * (CANVAS_SIZE - 2 * MARGIN);
                        y = MARGIN + Math.random() * (CANVAS_SIZE - 2 * MARGIN);
                    }
                    nodes.push({
                        id: `n${i + 1}`,
                        x: Math.round(Math.max(MARGIN, Math.min(CANVAS_SIZE - MARGIN, x))),
                        y: Math.round(Math.max(MARGIN, Math.min(CANVAS_SIZE - MARGIN, y)))
                    });
                }
                break;

            default:
                // Distribución aleatoria mejorada para otros casos
                const sectors = Math.ceil(Math.sqrt(nodeCount));
                const sectorWidth = (CANVAS_SIZE - 2 * MARGIN) / sectors;
                const sectorHeight = (CANVAS_SIZE - 2 * MARGIN) / sectors;

                for (let i = 0; i < nodeCount; i++) {
                    const sectorX = i % sectors;
                    const sectorY = Math.floor(i / sectors);
                    nodes.push({
                        id: `n${i + 1}`,
                        x: Math.round(MARGIN + sectorX * sectorWidth + Math.random() * sectorWidth),
                        y: Math.round(MARGIN + sectorY * sectorHeight + Math.random() * sectorHeight)
                    });
                }
                break;
        }

        return this.adjustNodePositions(nodes);
    }

    static adjustNodePositions(nodes) {
        const { MIN_NODE_DISTANCE, NODE_POSITION_MAX_ATTEMPTS, MARGIN, CANVAS_SIZE } = this.CONFIG;
        const maxX = CANVAS_SIZE - MARGIN;
        const maxY = CANVAS_SIZE - MARGIN;
        const centerX = CANVAS_SIZE / 2;
        const centerY = CANVAS_SIZE / 2;
        
        // Ajustar posiciones para evitar solapamientos
        for (let attempt = 0; attempt < NODE_POSITION_MAX_ATTEMPTS; attempt++) {
            let overlapping = false;
            
            for (let i = 0; i < nodes.length; i++) {
                for (let j = i + 1; j < nodes.length; j++) {
                    const dx = nodes[j].x - nodes[i].x;
                    const dy = nodes[j].y - nodes[i].y;
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    
                    if (distance < MIN_NODE_DISTANCE) {
                        overlapping = true;
                        const angle = Math.atan2(dy, dx);
                        const adjustment = (MIN_NODE_DISTANCE - distance) / 2;
                        
                        nodes[i].x = Math.round(Math.max(MARGIN, Math.min(maxX, nodes[i].x - Math.cos(angle) * adjustment)));
                        nodes[i].y = Math.round(Math.max(MARGIN, Math.min(maxY, nodes[i].y - Math.sin(angle) * adjustment)));
                        nodes[j].x = Math.round(Math.max(MARGIN, Math.min(maxX, nodes[j].x + Math.cos(angle) * adjustment)));
                        nodes[j].y = Math.round(Math.max(MARGIN, Math.min(maxY, nodes[j].y + Math.sin(angle) * adjustment)));
                    }
                }
            }
            
            if (!overlapping) break;
        }

        return nodes;
    }

    static generateConnections(nodes, config) {
        const connections = [];
        const { minEdgesPerNode, maxEdgesPerNode } = config;
        
        // Mantener registro de conexiones por nodo
        const nodeConnections = {};
        nodes.forEach(node => nodeConnections[node.id] = 0);

        // Procesar cada nodo
        nodes.forEach((node, i) => {
            // Si el nodo ya tiene el mínimo de conexiones requeridas, saltarlo
            if (nodeConnections[node.id] >= minEdgesPerNode) {
                return;
            }

            // Determinar cuántas conexiones necesita este nodo
            const neededConnections = minEdgesPerNode - nodeConnections[node.id];
            
            // Encontrar nodos disponibles que no excedan maxEdgesPerNode
            const availableNodes = nodes.filter((n, index) => 
                index !== i && 
                nodeConnections[n.id] < maxEdgesPerNode &&
                !connections.some(c => 
                    (c.from === node.id && c.to === n.id) ||
                    (c.from === n.id && c.to === node.id)
                )
            );

            // Conectar con nodos disponibles
            for (let j = 0; j < Math.min(neededConnections, availableNodes.length); j++) {
                const targetIndex = Math.floor(Math.random() * availableNodes.length);
                const targetNode = availableNodes[targetIndex];
                
                connections.push({
                    from: node.id,
                    to: targetNode.id
                });
                
                // Actualizar contadores
                nodeConnections[node.id]++;
                nodeConnections[targetNode.id]++;
                
                availableNodes.splice(targetIndex, 1);
            }
        });

        // Segunda pasada para agregar conexiones adicionales hasta maxEdgesPerNode donde sea posible
        nodes.forEach((node, i) => {
            if (nodeConnections[node.id] >= maxEdgesPerNode) {
                return;
            }

            const availableNodes = nodes.filter((n, index) => 
                index !== i && 
                nodeConnections[n.id] < maxEdgesPerNode &&
                !connections.some(c => 
                    (c.from === node.id && c.to === n.id) ||
                    (c.from === n.id && c.to === node.id)
                )
            );

            const additionalConnections = Math.min(
                Math.floor(Math.random() * (maxEdgesPerNode - nodeConnections[node.id] + 1)),
                availableNodes.length
            );

            for (let j = 0; j < additionalConnections; j++) {
                const targetIndex = Math.floor(Math.random() * availableNodes.length);
                const targetNode = availableNodes[targetIndex];
                
                connections.push({
                    from: node.id,
                    to: targetNode.id
                });
                
                nodeConnections[node.id]++;
                nodeConnections[targetNode.id]++;
                
                availableNodes.splice(targetIndex, 1);
            }
        });

        return connections;
    }
}


// Cambiar export por module.exports
module.exports = { LevelGenerator };
