import { useCallback, useRef, useState, useEffect } from 'react';
import {
    ReactFlow,
    Background,
    Controls,
    MiniMap,
    addEdge,
    useNodesState,
    useEdgesState,
    Connection,
    Panel,
    BackgroundVariant,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { Download, Save, FolderOpen, FileText, Copy, CheckCircle, ChevronDown } from 'lucide-react';

import { Sidebar } from './Sidebar';
import { nodeTypes } from './nodes/CustomNodes';
import { exportAsImage, exportAsText, copyMermaidToClipboard, saveProject, loadProject } from '../utils/export';
import './FlowchartBuilder.css';

const APP_VERSION = 'v1.1.5';
const STORAGE_KEY = 'flowchart-autosave';

let nodeId = 0;
const getNodeId = () => `node_${nodeId++}`;

export const FlowchartBuilder = () => {
    const reactFlowWrapper = useRef<HTMLDivElement>(null);
    const projectFileInputRef = useRef<HTMLInputElement>(null);
    const [nodes, setNodes, onNodesChange] = useNodesState([]);
    const [edges, setEdges, onEdgesChange] = useEdgesState([]);
    const [reactFlowInstance, setReactFlowInstance] = useState<any>(null);
    const [copySuccess, setCopySuccess] = useState(false);
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
    const [isInitialLoad, setIsInitialLoad] = useState(true);
    const [isControlsOpen, setIsControlsOpen] = useState(false);

    // Load from localStorage on mount
    useEffect(() => {
        const savedData = localStorage.getItem(STORAGE_KEY);
        if (savedData) {
            try {
                const { nodes: savedNodes, edges: savedEdges, nodeIdCounter } = JSON.parse(savedData);

                if (savedNodes && savedNodes.length > 0) {
                    // Restore nodes with onChange handler
                    const restoredNodes = savedNodes.map((n: any) => ({
                        ...n,
                        data: {
                            ...n.data,
                            onChange: (id: string, newLabel: string) => {
                                setNodes((nds: any) =>
                                    nds.map((node: any) =>
                                        node.id === id
                                            ? { ...node, data: { ...node.data, label: newLabel } }
                                            : node
                                    )
                                );
                            },
                        },
                    }));

                    setNodes(restoredNodes);
                    setEdges(savedEdges || []);
                    nodeId = nodeIdCounter || 0;
                }
            } catch (error) {
                console.error('Error loading autosave:', error);
            }
        }
        setIsInitialLoad(false);
    }, [setNodes, setEdges]);

    // Auto-save to localStorage when nodes or edges change
    useEffect(() => {
        if (isInitialLoad) return;

        const saveData = {
            nodes: nodes.map((n: any) => ({
                ...n,
                data: { label: n.data?.label || '' }
            })),
            edges,
            nodeIdCounter: nodeId,
            savedAt: new Date().toISOString()
        };

        localStorage.setItem(STORAGE_KEY, JSON.stringify(saveData));

        if (nodes.length > 0 || edges.length > 0) {
            setHasUnsavedChanges(true);
        }
    }, [nodes, edges, isInitialLoad]);

    // Warn before closing if there are unsaved changes
    useEffect(() => {
        const handleBeforeUnload = (e: BeforeUnloadEvent) => {
            if (hasUnsavedChanges && (nodes.length > 0 || edges.length > 0)) {
                e.preventDefault();
                e.returnValue = '保存していない変更があります。ページを離れますか？';
                return e.returnValue;
            }
        };

        window.addEventListener('beforeunload', handleBeforeUnload);
        return () => window.removeEventListener('beforeunload', handleBeforeUnload);
    }, [hasUnsavedChanges, nodes.length, edges.length]);

    const isValidConnection = useCallback((connection: Connection) => {
        // 自己接続を防ぐ（同じノードへのループ）
        if (connection.source === connection.target) {
            return false;
        }

        // 既存の接続チェック（同じハンドルから複数の接続を防ぐ）
        const hasExistingEdge = edges.some(
            edge => edge.source === connection.source && edge.sourceHandle === connection.sourceHandle
        );

        if (hasExistingEdge) {
            return false;
        }

        // Executionノードの制御：出力は1つのみ、入力は複数OK
        const sourceNode = nodes.find(n => n.id === connection.source);

        // 接続元がExecutionノードの場合
        if (sourceNode?.type === 'execution') {
            // このノードから既に出力があるかチェック
            const hasExistingOutput = edges.some(e =>
                e.source === connection.source &&
                e.sourceHandle === 'execution-bottom'
            );

            if (hasExistingOutput) {
                return false;
            }
        }

        return true;
    }, [edges, nodes]);

    const onConnect = useCallback(
        (params: Connection) => {
            if (!isValidConnection(params)) {
                return;
            }

            const sourceNode = nodes.find(n => n.id === params.source);
            let edgeLabel = '';

            if (sourceNode?.type === 'condition') {
                if (params.sourceHandle === 'condition-bottom-true') {
                    edgeLabel = 'True';
                } else if (params.sourceHandle === 'condition-left-false' || params.sourceHandle === 'condition-right-false') {
                    edgeLabel = 'False';
                }
            }

            // Set edge color based on label
            const getEdgeColor = () => {
                if (edgeLabel === 'True') return '#10b981';
                if (edgeLabel === 'False') return '#ef4444';
                return '#7c3aed'; // Violet-600 - deeper purple
            };

            const newEdge = {
                ...params,
                label: edgeLabel,
                type: 'default',
                animated: true,
                style: {
                    strokeWidth: 2,
                    stroke: getEdgeColor(),
                },
                labelStyle: {
                    fill: getEdgeColor(),
                    fontWeight: 700,
                    fontSize: 13,
                    textShadow: '0 0 4px rgba(0,0,0,0.8), 0 0 8px rgba(0,0,0,0.6)',
                },
                labelBgStyle: {
                    fill: 'transparent',
                    fillOpacity: 0,
                },
            };

            setEdges((eds) => addEdge(newEdge, eds));
        },
        [setEdges, isValidConnection, nodes]
    );

    const onDragOver = useCallback((event: React.DragEvent) => {
        event.preventDefault();
        event.dataTransfer.dropEffect = 'move';
    }, []);

    const onDrop = useCallback(
        (event: React.DragEvent) => {
            event.preventDefault();

            if (!reactFlowWrapper.current || !reactFlowInstance) return;

            const type = event.dataTransfer.getData('application/reactflow');
            const label = event.dataTransfer.getData('label');

            if (!type) return;

            const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();

            // Get the position in flow coordinates
            const dropPosition = reactFlowInstance.screenToFlowPosition({
                x: event.clientX,
                y: event.clientY,
            });

            // Set initial size based on node type and calculate centered position
            const getNodeSize = (nodeType: string) => {
                switch (nodeType) {
                    case 'condition':
                        return { width: 150, height: 150 };
                    case 'execution':
                        return { width: 150, height: 80 };
                    case 'start':
                    case 'end':
                        return { width: 120, height: 120 };
                    default:
                        return { width: 100, height: 100 };
                }
            };

            const nodeSize = getNodeSize(type);

            // Center the node at the drop position
            const position = {
                x: dropPosition.x - nodeSize.width / 2,
                y: dropPosition.y - nodeSize.height / 2,
            };

            const getInitialStyle = (nodeType: string) => {
                switch (nodeType) {
                    case 'condition':
                        return { width: 150, height: 150 };
                    case 'execution':
                        return { width: 150, height: 80 };
                    case 'start':
                    case 'end':
                        return { width: 120, height: 120 };
                    default:
                        return undefined;
                }
            };

            // Warn if adding a second Start node
            if (type === 'start') {
                const existingStart = nodes.find((n: any) => n.type === 'start');
                if (existingStart) {
                    alert('⚠️ Warning: A Start node already exists. Multiple Start nodes may cause confusion.');
                }
            }

            const newNode = {
                id: getNodeId(),
                type,
                position,
                style: getInitialStyle(type),
                data: {
                    label,
                    onChange: (nodeId: string, newLabel: string) => {
                        setNodes((nds) =>
                            nds.map((node) =>
                                node.id === nodeId
                                    ? { ...node, data: { ...node.data, label: newLabel } }
                                    : node
                            )
                        );
                    },
                },
            };

            setNodes((nds) => nds.concat(newNode));
        },
        [reactFlowInstance, setNodes, nodes]
    );

    const handleExportImage = useCallback(async () => {
        if (!reactFlowInstance) return;

        // Fit view to show all nodes before exporting
        reactFlowInstance.fitView({ padding: 0.2 });

        // Wait for the view to update
        await new Promise(resolve => setTimeout(resolve, 100));

        exportAsImage('flowchart-canvas', 'flowchart.png');
    }, [reactFlowInstance]);

    const handleExportText = useCallback(() => {
        exportAsText(nodes, edges, 'flowchart.txt');
    }, [nodes, edges]);

    const handleCopyMermaid = useCallback(async () => {
        const success = await copyMermaidToClipboard(nodes, edges);
        if (success) {
            setCopySuccess(true);
            setTimeout(() => setCopySuccess(false), 2000);
        }
    }, [nodes, edges]);

    // Project save handler
    const handleSaveProject = useCallback(() => {
        saveProject(nodes, edges);
        setHasUnsavedChanges(false);
    }, [nodes, edges]);

    // Project load handlers
    const handleLoadProject = useCallback(() => {
        projectFileInputRef.current?.click();
    }, []);

    const handleProjectFileChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            const content = e.target?.result as string;
            const project = loadProject(content);

            if (project) {
                // Convert project nodes to ReactFlow nodes
                const newNodes = project.nodes.map(node => ({
                    id: node.id,
                    type: node.type,
                    position: node.position,
                    style: node.size ? { width: node.size.width, height: node.size.height } : undefined,
                    data: {
                        label: node.data.label,
                        onChange: (nodeId: string, newLabel: string) => {
                            setNodes((nds: any) =>
                                nds.map((n: any) =>
                                    n.id === nodeId
                                        ? { ...n, data: { ...n.data, label: newLabel } }
                                        : n
                                )
                            );
                        },
                    },
                }));

                // Convert project edges to ReactFlow edges
                const getEdgeColor = (sourceHandle: string | undefined) => {
                    if (sourceHandle?.includes('true')) return '#22c55e';
                    if (sourceHandle?.includes('false')) return '#ef4444';
                    return '#818cf8';
                };

                const newEdges = project.edges.map(edge => ({
                    id: edge.id,
                    source: edge.source,
                    target: edge.target,
                    sourceHandle: edge.sourceHandle,
                    targetHandle: edge.targetHandle,
                    label: edge.label,
                    type: 'default',
                    animated: true,
                    style: {
                        strokeWidth: 2,
                        stroke: getEdgeColor(edge.sourceHandle),
                    },
                    labelStyle: {
                        fill: getEdgeColor(edge.sourceHandle),
                        fontWeight: 700,
                        fontSize: 13,
                    },
                    labelBgStyle: {
                        fill: 'transparent',
                        fillOpacity: 0,
                    },
                }));

                // Update node ID counter
                const maxId = Math.max(...project.nodes.map(n => {
                    const match = n.id.match(/node_(\d+)/);
                    return match ? parseInt(match[1], 10) : 0;
                }), 0);
                nodeId = maxId + 1;

                setNodes(newNodes as any);
                setEdges(newEdges as any);

                // Fit view after loading
                setTimeout(() => {
                    reactFlowInstance?.fitView({ padding: 0.2 });
                }, 100);
            } else {
                alert('Failed to load project file. Please check the file format.');
            }
        };
        reader.readAsText(file);

        // Reset file input
        event.target.value = '';
    }, [setNodes, setEdges, reactFlowInstance]);

    const handleAutoLayout = useCallback(() => {
        if (!reactFlowInstance || nodes.length === 0) return;

        const HORIZONTAL_SPACING = 250;
        const VERTICAL_SPACING = 200;

        // Find start nodes (entry points)
        const startNodes = nodes.filter((n: any) => n.type === 'start');
        if (startNodes.length === 0) {
            // If no start node, just arrange in a grid
            const updatedNodes = nodes.map((node: any, index: number) => ({
                ...node,
                position: {
                    x: (index % 4) * HORIZONTAL_SPACING + 100,
                    y: Math.floor(index / 4) * VERTICAL_SPACING + 50,
                },
            }));
            setNodes(updatedNodes);
            setTimeout(() => reactFlowInstance.fitView({ padding: 0.2 }), 0);
            return;
        }

        // Build adjacency map with handle info
        const childrenMap = new Map<string, { nodeId: string; handleType: string }[]>();

        edges.forEach((edge: any) => {
            if (!childrenMap.has(edge.source)) {
                childrenMap.set(edge.source, []);
            }
            childrenMap.get(edge.source)!.push({
                nodeId: edge.target,
                handleType: edge.sourceHandle || 'default',
            });
        });

        // BFS with position tracking - tracking CENTER positions
        const centerPositions = new Map<string, { x: number; y: number }>();
        const visited = new Set<string>();
        const queue: { nodeId: string; centerX: number; y: number; isBranch: boolean }[] = [];

        // Helper to get node dimensions (checks multiple possible locations)
        const getNodeSize = (node: any) => {
            // Check direct width/height (measured by ReactFlow)
            if (node?.width && node?.height) {
                return { width: node.width, height: node.height };
            }
            // Check measured dimensions
            if (node?.measured?.width && node?.measured?.height) {
                return { width: node.measured.width, height: node.measured.height };
            }
            // Check style dimensions
            if (node?.style?.width && node?.style?.height) {
                return { width: node.style.width, height: node.style.height };
            }
            // Default sizes based on type
            switch (node?.type) {
                case 'condition':
                    return { width: 150, height: 150 };
                case 'execution':
                    return { width: 150, height: 80 };
                case 'start':
                case 'end':
                    return { width: 120, height: 120 };
                default:
                    return { width: 100, height: 100 };
            }
        };

        // Main flow center X
        const mainCenterX = 400;

        // Start from start nodes
        startNodes.forEach((startNode: any, idx: number) => {
            queue.push({
                nodeId: startNode.id,
                centerX: mainCenterX + idx * HORIZONTAL_SPACING * 3,
                y: 50,
                isBranch: false,
            });
        });

        while (queue.length > 0) {
            const { nodeId, centerX, y, isBranch } = queue.shift()!;

            if (visited.has(nodeId)) continue;
            visited.add(nodeId);

            // Store the CENTER position (will convert to top-left later)
            centerPositions.set(nodeId, { x: centerX, y });

            const children = childrenMap.get(nodeId) || [];
            const node = nodes.find((n: any) => n.id === nodeId);
            const isCondition = node?.type === 'condition';
            const nodeSize = getNodeSize(node);

            // Calculate next Y based on current node's height
            const nextY = y + nodeSize.height + 50; // 50px gap between nodes

            if (isCondition && children.length > 0) {
                // For condition nodes
                const trueChild = children.find(c => c.handleType.includes('true'));
                const falseChild = children.find(c =>
                    c.handleType.includes('left-false') || c.handleType.includes('right-false')
                );

                // True goes down - stays on center line
                if (trueChild && !visited.has(trueChild.nodeId)) {
                    queue.push({
                        nodeId: trueChild.nodeId,
                        centerX: centerX, // Same center X as parent
                        y: nextY,
                        isBranch: false,
                    });
                }

                // False goes to the side based on handle direction
                if (falseChild && !visited.has(falseChild.nodeId)) {
                    let falseCenterX = centerX + HORIZONTAL_SPACING; // Default: right
                    if (falseChild.handleType.includes('left')) {
                        falseCenterX = centerX - HORIZONTAL_SPACING; // Left
                    }
                    queue.push({
                        nodeId: falseChild.nodeId,
                        centerX: falseCenterX,
                        y: y, // Same Y level
                        isBranch: true,
                    });
                }

                // Handle other children
                children.forEach((child, idx) => {
                    if (child !== trueChild && child !== falseChild && !visited.has(child.nodeId)) {
                        queue.push({
                            nodeId: child.nodeId,
                            centerX: centerX + (idx + 1) * HORIZONTAL_SPACING,
                            y: nextY,
                            isBranch: true,
                        });
                    }
                });
            } else {
                // For non-condition nodes, children go down
                children.forEach((child, idx) => {
                    if (!visited.has(child.nodeId)) {
                        let childCenterX = centerX;
                        if (children.length > 1) {
                            childCenterX = centerX + (idx - (children.length - 1) / 2) * HORIZONTAL_SPACING;
                        }
                        queue.push({
                            nodeId: child.nodeId,
                            centerX: childCenterX,
                            y: nextY,
                            isBranch: isBranch,
                        });
                    }
                });
            }
        }

        // Handle unvisited nodes (not connected to start)
        let unvisitedY = 50;
        let unvisitedCenterX = mainCenterX + HORIZONTAL_SPACING * 3;
        nodes.forEach((node: any) => {
            if (!visited.has(node.id)) {
                centerPositions.set(node.id, { x: unvisitedCenterX, y: unvisitedY });
                unvisitedY += VERTICAL_SPACING;
                if (unvisitedY > 600) {
                    unvisitedY = 50;
                    unvisitedCenterX += HORIZONTAL_SPACING;
                }
            }
        });

        // Convert center positions to top-left positions and apply
        const updatedNodes = nodes.map((node: any) => {
            const centerPos = centerPositions.get(node.id);
            if (!centerPos) return node;

            const nodeSize = getNodeSize(node);
            return {
                ...node,
                position: {
                    x: centerPos.x - nodeSize.width / 2,
                    y: centerPos.y,
                },
            };
        });

        setNodes(updatedNodes);
        setTimeout(() => reactFlowInstance.fitView({ padding: 0.2 }), 0);
    }, [nodes, edges, reactFlowInstance, setNodes]);

    return (
        <div className="flowchart-builder">
            <Sidebar onAutoLayout={handleAutoLayout} />
            <div className="flowchart-container" ref={reactFlowWrapper}>
                <ReactFlow
                    nodes={nodes}
                    edges={edges}
                    onNodesChange={onNodesChange}
                    onEdgesChange={onEdgesChange}
                    onConnect={onConnect}
                    onInit={setReactFlowInstance}
                    onDrop={onDrop}
                    onDragOver={onDragOver}
                    nodeTypes={nodeTypes}
                    fitView
                    id="flowchart-canvas"
                    deleteKeyCode="Delete"
                    connectionLineStyle={{ stroke: '#60a5fa', strokeWidth: 2 }}
                    defaultEdgeOptions={{
                        animated: true,
                        style: { strokeWidth: 2, stroke: '#60a5fa' },
                    }}
                >
                    <Background
                        variant={BackgroundVariant.Dots}
                        gap={20}
                        size={1}
                        color="rgba(255, 255, 255, 0.1)"
                    />
                    <Controls
                        className="custom-controls"
                        showInteractive={false}
                    />
                    <MiniMap
                        className="custom-minimap"
                        nodeColor={(node) => {
                            switch (node.type) {
                                case 'start': return '#10b981';
                                case 'end': return '#ef4444';
                                case 'execution': return '#3b82f6';
                                case 'condition': return '#f59e0b';
                                default: return '#6b7280';
                            }
                        }}
                        maskColor="rgba(0, 0, 0, 0.6)"
                    />

                    <Panel position="top-right" className={`control-panel ${isControlsOpen ? 'open' : ''}`}>
                        <div className="control-panel-header" onClick={() => setIsControlsOpen(!isControlsOpen)}>
                            <h3 className="gradient-text">Controls</h3>
                            <ChevronDown size={18} className={`chevron-icon ${isControlsOpen ? 'rotated' : ''}`} />
                        </div>
                        <div className={`control-buttons-wrapper ${isControlsOpen ? 'open' : ''}`}>
                            <div className="control-buttons">
                                <button
                                    className="control-button primary"
                                    onClick={handleSaveProject}
                                    title="Save Project (.fchart)"
                                >
                                    <Save size={18} />
                                    <span>Save</span>
                                </button>
                                <button
                                    className="control-button primary"
                                    onClick={handleLoadProject}
                                    title="Open Project (.fchart)"
                                >
                                    <FolderOpen size={18} />
                                    <span>Open</span>
                                </button>
                                <div className="button-divider"></div>
                                <button
                                    className="control-button"
                                    onClick={handleExportImage}
                                    title="Export as PNG"
                                >
                                    <Download size={18} />
                                    <span>PNG</span>
                                </button>
                                <button
                                    className="control-button"
                                    onClick={handleExportText}
                                    title="Export as Text"
                                >
                                    <FileText size={18} />
                                    <span>Text</span>
                                </button>
                                <button
                                    className={`control-button ${copySuccess ? 'success' : ''}`}
                                    onClick={handleCopyMermaid}
                                    title="Copy Mermaid Diagram"
                                >
                                    {copySuccess ? <CheckCircle size={18} /> : <Copy size={18} />}
                                    <span>{copySuccess ? 'Copied!' : 'Mermaid'}</span>
                                </button>
                            </div>
                        </div>
                    </Panel>

                    <Panel position="top-left" style={{
                        padding: '6px 10px',
                        background: 'rgba(0, 0, 0, 0.5)',
                        borderRadius: '6px',
                        fontSize: '11px',
                        color: 'rgba(255, 255, 255, 0.7)',
                        fontWeight: '600',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                    }}>
                        {APP_VERSION}
                    </Panel>
                </ReactFlow>
                <input
                    ref={projectFileInputRef}
                    type="file"
                    accept=".fchart,.json"
                    style={{ display: 'none' }}
                    onChange={handleProjectFileChange}
                />
            </div>
        </div>
    );
};
