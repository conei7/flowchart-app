import { useState } from 'react';
import { Circle, Square, Diamond, StopCircle, Layers, ChevronLeft, ChevronRight } from 'lucide-react';
import './Sidebar.css';

interface NodeTypeConfig {
    type: 'start' | 'end' | 'execution' | 'condition';
    label: string;
    icon: React.ReactNode;
    color: string;
}

interface SidebarProps {
    onAutoLayout?: () => void;
    onNodeAdd?: (nodeType: string, label: string) => void;
}

const nodeTypes: NodeTypeConfig[] = [
    {
        type: 'start',
        label: 'Start',
        icon: <Circle size={20} />,
        color: '#10b981',
    },
    {
        type: 'end',
        label: 'End',
        icon: <StopCircle size={20} />,
        color: '#ef4444',
    },
    {
        type: 'execution',
        label: 'Process',
        icon: <Square size={20} />,
        color: '#3b82f6',
    },
    {
        type: 'condition',
        label: 'Decision',
        icon: <Diamond size={20} />,
        color: '#f59e0b',
    },
];

export const Sidebar = ({ onAutoLayout, onNodeAdd }: SidebarProps) => {
    const [isCollapsed, setIsCollapsed] = useState(false);

    const onDragStart = (event: React.DragEvent, nodeType: string, label: string) => {
        event.dataTransfer.setData('application/reactflow', nodeType);
        event.dataTransfer.setData('label', label);
        event.dataTransfer.effectAllowed = 'move';
    };

    // Handle tap to add (for mobile)
    const handleNodeClick = (nodeType: string, label: string) => {
        if (onNodeAdd) {
            onNodeAdd(nodeType, label);
        }
    };

    return (
        <>
            <aside className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>
                <button
                    className="sidebar-toggle"
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    title={isCollapsed ? 'Expand' : 'Collapse'}
                >
                    {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
                </button>

                {!isCollapsed && (
                    <>
                        <div className="sidebar-header">
                            <h2 className="sidebar-title gradient-text">Nodes</h2>
                            <p className="sidebar-subtitle">Drag or tap to add</p>
                        </div>

                        <div className="node-list">
                            {nodeTypes.map((node) => (
                                <div
                                    key={node.type}
                                    className="node-item"
                                    draggable
                                    onDragStart={(e) => onDragStart(e, node.type, node.label)}
                                    onClick={() => handleNodeClick(node.type, node.label)}
                                    style={{
                                        '--node-color': node.color,
                                    } as React.CSSProperties}
                                >
                                    <div className="node-item-icon" style={{ color: node.color }}>
                                        {node.icon}
                                    </div>
                                    <span className="node-item-label">{node.label}</span>
                                    <div className="node-item-drag-hint">
                                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                            <circle cx="4" cy="4" r="1.5" fill="currentColor" opacity="0.5" />
                                            <circle cx="12" cy="4" r="1.5" fill="currentColor" opacity="0.5" />
                                            <circle cx="4" cy="8" r="1.5" fill="currentColor" opacity="0.5" />
                                            <circle cx="12" cy="8" r="1.5" fill="currentColor" opacity="0.5" />
                                            <circle cx="4" cy="12" r="1.5" fill="currentColor" opacity="0.5" />
                                            <circle cx="12" cy="12" r="1.5" fill="currentColor" opacity="0.5" />
                                        </svg>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="sidebar-footer">
                            <button className="auto-layout-button" onClick={onAutoLayout}>
                                <Layers size={18} />
                                <span>Auto Layout</span>
                            </button>
                        </div>
                    </>
                )}

                {isCollapsed && (
                    <div className="collapsed-icons">
                        <div className="collapsed-nodes">
                            {nodeTypes.map((node) => (
                                <div
                                    key={node.type}
                                    className="collapsed-node-item"
                                    draggable
                                    onDragStart={(e) => onDragStart(e, node.type, node.label)}
                                    onClick={() => handleNodeClick(node.type, node.label)}
                                    title={node.label}
                                    style={{ color: node.color }}
                                >
                                    {node.icon}
                                </div>
                            ))}
                        </div>
                        <div className="collapsed-footer">
                            <div className="collapsed-divider" />
                            <button
                                className="collapsed-auto-layout"
                                onClick={onAutoLayout}
                                title="Auto Layout"
                            >
                                <Layers size={20} />
                            </button>
                        </div>
                    </div>
                )}
            </aside>

            {/* Mobile floating Auto Layout button */}
            <button
                className="mobile-auto-layout"
                onClick={onAutoLayout}
                title="Auto Layout"
            >
                <Layers size={24} />
            </button>
        </>
    );
};
