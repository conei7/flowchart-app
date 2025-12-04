import { useCallback, useRef, useState } from 'react';
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
    Node,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { Download, FileJson, FileText, Copy, Trash2, CheckCircle, Layers, Upload } from 'lucide-react';

import { Sidebar } from './Sidebar';
import { nodeTypes } from './nodes/CustomNodes';
import { exportAsImage, exportAsJSON, exportAsText, copyMermaidToClipboard } from '../utils/export';
import './FlowchartBuilder.css';

const APP_VERSION = 'v1.0.7';

let nodeId = 0;
const getNodeId = () => `node_${nodeId++}`;

export const FlowchartBuilder = () => {
    const reactFlowWrapper = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [nodes, setNodes, onNodesChange] = useNodesState([]);
    const [edges, setEdges, onEdgesChange] = useEdgesState([]);
    const [reactFlowInstance, setReactFlowInstance] = useState<any>(null);
    const [copySuccess, setCopySuccess] = useState(false);

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
                    fontWeight: 600,
                    fontSize: 12,
                },
                labelBgStyle: {
                    fill: 'var(--bg-tertiary)',
                    fillOpacity: 0.9,
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

    const handleExportImage = useCallback(() => {
        exportAsImage('flowchart-canvas', 'flowchart.png');
    }, []);

    const handleExportJSON = useCallback(() => {
        exportAsJSON(nodes, edges, 'flowchart.json');
    }, [nodes, edges]);

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

    const handleClearAll = useCallback(() => {
        if (window.confirm('Are you sure you want to clear the entire flowchart?')) {
            setNodes([]);
            setEdges([]);
            nodeId = 0;
        }
    }, [setNodes, setEdges]);

    const handleAutoLayout = useCallback(() => {
        if (!reactFlowInstance) return;

        const startNodes = nodes.filter(n => n.type === 'start');
        const processedNodes = new Set<string>();
        const levelMap = new Map<string, number>();
        const columnMap = new Map<number, string[]>();

        const calculateLevel = (nodeId: string, level: number) => {
            if (processedNodes.has(nodeId)) return;
            processedNodes.add(nodeId);
            levelMap.set(nodeId, Math.max(levelMap.get(nodeId) || 0, level));

            const outgoingEdges = edges.filter(e => e.source === nodeId);
            outgoingEdges.forEach(edge => {
                calculateLevel(edge.target, level + 1);
            });
        };

        startNodes.forEach(node => calculateLevel(node.id, 0));

        nodes.forEach(node => {
            const level = levelMap.get(node.id) || 0;
            if (!columnMap.has(level)) {
                columnMap.set(level, []);
            }
            columnMap.get(level)!.push(node.id);
        });

        const updatedNodes = nodes.map((node) => {
            const level = levelMap.get(node.id) || 0;
            const column = columnMap.get(level)!;
            const positionInColumn = column.indexOf(node.id);
            const columnWidth = column.length;

            return {
                ...node,
                position: {
                    x: (positionInColumn - columnWidth / 2) * 300 + 400,
                    y: level * 200 + 50,
                },
            };
        });

        setNodes(updatedNodes);
        setTimeout(() => reactFlowInstance.fitView({ padding: 0.2 }), 0);
    }, [nodes, edges, reactFlowInstance, setNodes]);

    const handleImport = useCallback(() => {
        fileInputRef.current?.click();
    }, []);

    const handleFileChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const json = JSON.parse(e.target?.result as string);

                if (json.nodes && json.edges) {
                    const maxId = Math.max(
                        ...json.nodes.map((n: Node) => {
                            const match = n.id.match(/node_(\d+)/);
                            return match ? parseInt(match[1]) : 0;
                        }),
                        nodeId - 1
                    );
                    nodeId = maxId + 1;

                    const importedNodes = json.nodes.map((n: Node) => ({
                        ...n,
                        data: {
                            ...n.data,
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
                    }));

                    setNodes(importedNodes);
                    setEdges(json.edges);

                    setTimeout(() => {
                        if (reactFlowInstance) {
                            reactFlowInstance.fitView({ padding: 0.2 });
                        }
                    }, 0);
                } else {
                    alert('Invalid flowchart file format.');
                }
            } catch (error) {
                console.error('Error importing flowchart:', error);
                alert('Failed to import flowchart. Please check the file format.');
            }
        };
        reader.readAsText(file);

        event.target.value = '';
    }, [setNodes, setEdges, reactFlowInstance]);

    return (
        <div className="flowchart-builder">
            <Sidebar />
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

                    <Panel position="top-right" className="control-panel">
                        <div className="control-panel-header">
                            <h3 className="gradient-text">Controls</h3>
                        </div>
                        <div className="control-buttons">
                            <button
                                className="control-button"
                                onClick={handleAutoLayout}
                                title="Auto Layout"
                            >
                                <Layers size={18} />
                                <span>Auto Layout</span>
                            </button>
                            <button
                                className="control-button"
                                onClick={handleImport}
                                title="Import JSON"
                            >
                                <Upload size={18} />
                                <span>Import</span>
                            </button>
                            <div className="button-divider"></div>
                            <button
                                className="control-button primary"
                                onClick={handleExportImage}
                                title="Export as PNG"
                            >
                                <Download size={18} />
                                <span>PNG</span>
                            </button>
                            <button
                                className="control-button"
                                onClick={handleExportJSON}
                                title="Export as JSON"
                            >
                                <FileJson size={18} />
                                <span>JSON</span>
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
                            <div className="button-divider"></div>
                            <button
                                className="control-button danger"
                                onClick={handleClearAll}
                                title="Clear All"
                            >
                                <Trash2 size={18} />
                                <span>Clear</span>
                            </button>
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
                    ref={fileInputRef}
                    type="file"
                    accept=".json"
                    style={{ display: 'none' }}
                    onChange={handleFileChange}
                />
            </div>
        </div>
    );
};
