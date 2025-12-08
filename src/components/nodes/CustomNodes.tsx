import { memo, useState, useCallback, useEffect } from 'react';
import { Handle, Position, NodeProps, NodeResizer, useEdges, Node } from '@xyflow/react';

// Custom node data interface
interface CustomNodeData extends Record<string, unknown> {
    label: string;
    color?: string;
    description?: string;
    onChange?: (id: string, newLabel: string) => void;
    onOpenSettings?: (id: string) => void;
}

// Custom node type with our data
type CustomNode = Node<CustomNodeData>;

// Helper function to generate gradient from color
const getGradient = (color: string) => {
    // Darken the color for gradient end
    const darkenColor = (hex: string, percent: number) => {
        const num = parseInt(hex.replace('#', ''), 16);
        const amt = Math.round(2.55 * percent);
        const R = Math.max(0, (num >> 16) - amt);
        const G = Math.max(0, ((num >> 8) & 0x00FF) - amt);
        const B = Math.max(0, (num & 0x0000FF) - amt);
        return `#${(0x1000000 + R * 0x10000 + G * 0x100 + B).toString(16).slice(1)}`;
    };
    return `linear-gradient(135deg, ${color}, ${darkenColor(color, 15)})`;
};

// Start Node - Oval shape, editable, resizable
export const StartNode = memo(({ data, selected, id }: NodeProps<CustomNode>) => {
    const [text, setText] = useState(data.label || 'Start');
    const [isEditing, setIsEditing] = useState(false);
    const nodeColor = (data.color as string) || '#10b981';

    // Sync with external data.label changes (from inspector)
    useEffect(() => {
        setText(data.label || 'Start');
    }, [data.label]);

    const handleTextChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setText(e.target.value);
        if (data.onChange) {
            data.onChange(id, e.target.value);
        }
    }, [id, data]);

    const handleContextMenu = useCallback((e: React.MouseEvent) => {
        e.preventDefault();
        if (data.onOpenSettings) {
            data.onOpenSettings(id);
        }
    }, [id, data]);

    return (
        <>
            <NodeResizer
                color={nodeColor}
                isVisible={selected}
                minWidth={80}
                minHeight={80}
                keepAspectRatio={true}
            />
            <div
                className={`start-node ${selected ? 'selected' : ''}`}
                style={{
                    background: getGradient(nodeColor),
                    border: selected ? `2px solid ${nodeColor}` : `2px solid ${nodeColor}`,
                    borderRadius: '50%',
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontWeight: '600',
                    fontSize: '16px',
                    boxShadow: selected
                        ? `0 0 20px ${nodeColor}80, 0 4px 16px rgba(0, 0, 0, 0.4)`
                        : '0 4px 16px rgba(0, 0, 0, 0.4)',
                    transition: 'box-shadow 250ms cubic-bezier(0.4, 0, 0.2, 1)',
                    cursor: 'grab',
                }}
                onDoubleClick={() => setIsEditing(true)}
                onContextMenu={handleContextMenu}
                title={data.description ? `${data.description}` : '右クリックで設定'}
            >
                <Handle
                    type="source"
                    position={Position.Bottom}
                    id="start-bottom"
                    style={{
                        background: nodeColor,
                        width: '16px',
                        height: '16px',
                        border: '2px solid white',
                    }}
                />
                {isEditing ? (
                    <input
                        type="text"
                        value={text}
                        onChange={handleTextChange}
                        onBlur={() => setIsEditing(false)}
                        onKeyDown={(e) => e.key === 'Enter' && setIsEditing(false)}
                        autoFocus
                        style={{
                            background: 'transparent',
                            border: 'none',
                            color: 'white',
                            fontWeight: '600',
                            fontSize: '16px',
                            textAlign: 'center',
                            width: '90%',
                            outline: 'none',
                        }}
                    />
                ) : (
                    <span style={{ position: 'relative', zIndex: 1 }}>{text}</span>
                )}
            </div>
        </>
    );
});

StartNode.displayName = 'StartNode';

// End Node - Oval shape, editable, resizable
export const EndNode = memo(({ data, selected, id }: NodeProps<CustomNode>) => {
    const [text, setText] = useState(data.label || 'End');
    const [isEditing, setIsEditing] = useState(false);
    const nodeColor = (data.color as string) || '#ef4444';

    // Sync with external data.label changes (from inspector)
    useEffect(() => {
        setText(data.label || 'End');
    }, [data.label]);

    const handleTextChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setText(e.target.value);
        if (data.onChange) {
            data.onChange(id, e.target.value);
        }
    }, [id, data]);

    const handleContextMenu = useCallback((e: React.MouseEvent) => {
        e.preventDefault();
        if (data.onOpenSettings) {
            data.onOpenSettings(id);
        }
    }, [id, data]);

    return (
        <>
            <NodeResizer
                color={nodeColor}
                isVisible={selected}
                minWidth={80}
                minHeight={80}
                keepAspectRatio={true}
            />
            <div
                className={`end-node ${selected ? 'selected' : ''}`}
                style={{
                    background: getGradient(nodeColor),
                    border: selected ? `2px solid ${nodeColor}` : `2px solid ${nodeColor}`,
                    borderRadius: '50%',
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontWeight: '600',
                    fontSize: '16px',
                    boxShadow: selected
                        ? `0 0 20px ${nodeColor}80, 0 4px 16px rgba(0, 0, 0, 0.4)`
                        : '0 4px 16px rgba(0, 0, 0, 0.4)',
                    transition: 'box-shadow 250ms cubic-bezier(0.4, 0, 0.2, 1)',
                    cursor: 'grab',
                }}
                onDoubleClick={() => setIsEditing(true)}
                onContextMenu={handleContextMenu}
                title={data.description ? `${data.description}` : '右クリックで設定'}
            >
                <Handle
                    type="target"
                    position={Position.Top}
                    id="end-top"
                    style={{
                        background: '#0ea5e9',
                        width: '16px',
                        height: '16px',
                        border: '2px solid white',
                    }}
                />
                {isEditing ? (
                    <input
                        type="text"
                        value={text}
                        onChange={handleTextChange}
                        onBlur={() => setIsEditing(false)}
                        onKeyDown={(e) => e.key === 'Enter' && setIsEditing(false)}
                        autoFocus
                        style={{
                            background: 'transparent',
                            border: 'none',
                            color: 'white',
                            fontWeight: '600',
                            fontSize: '16px',
                            textAlign: 'center',
                            width: '90%',
                            outline: 'none',
                        }}
                    />
                ) : (
                    <span style={{ position: 'relative', zIndex: 1 }}>{text}</span>
                )}
            </div>
        </>
    );
});

EndNode.displayName = 'EndNode';

// Execution Node - Rectangle, resizable, editable
export const ExecutionNode = memo(({ data, selected, id }: NodeProps<CustomNode>) => {
    const [text, setText] = useState(data.label || 'Process');
    const [isEditing, setIsEditing] = useState(false);
    const nodeColor = (data.color as string) || '#3b82f6';

    // Sync with external data.label changes (from inspector)
    useEffect(() => {
        setText(data.label || 'Process');
    }, [data.label]);

    const handleTextChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setText(e.target.value);
        if (data.onChange) {
            data.onChange(id, e.target.value);
        }
    }, [id, data]);

    const handleTextAreaMouseDown = useCallback((e: React.MouseEvent) => {
        e.stopPropagation();
    }, []);

    const handleContextMenu = useCallback((e: React.MouseEvent) => {
        e.preventDefault();
        if (data.onOpenSettings) {
            data.onOpenSettings(id);
        }
    }, [id, data]);

    return (
        <div
            className={`execution-node ${selected ? 'selected' : ''}`}
            style={{
                position: 'relative',
                width: '100%',
                height: '100%',
                background: getGradient(nodeColor),
                border: selected ? `2px solid ${nodeColor}` : `2px solid ${nodeColor}`,
                borderRadius: '8px',
                padding: '12px 16px',
                color: 'white',
                fontWeight: '500',
                minWidth: '150px',
                minHeight: '80px',
                boxSizing: 'border-box',
                boxShadow: selected
                    ? `0 0 20px ${nodeColor}80, 0 4px 16px rgba(0, 0, 0, 0.4), 0 0 0 10px transparent`
                    : '0 4px 16px rgba(0, 0, 0, 0.4), 0 0 0 10px transparent',
                transition: 'all 250ms cubic-bezier(0.4, 0, 0.2, 1)',
                cursor: isEditing ? 'text' : 'grab',
            }}
            onDoubleClick={() => setIsEditing(true)}
            onContextMenu={handleContextMenu}
            title={data.description ? `${data.description}` : '右クリックで設定'}
        >
            <NodeResizer
                isVisible={selected}
                minWidth={150}
                minHeight={80}
                handleStyle={{
                    width: '10px',
                    height: '10px',
                    borderRadius: '50%',
                    background: nodeColor,
                }}
            />
            {/* Top handle - input only */}
            <Handle
                type="target"
                position={Position.Top}
                id="execution-top"
                style={{
                    background: '#0ea5e9',
                    width: '16px',
                    height: '16px',
                    border: '2px solid white',
                }}
            />
            {isEditing ? (
                <textarea
                    value={text}
                    onChange={handleTextChange}
                    onBlur={() => setIsEditing(false)}
                    onMouseDown={handleTextAreaMouseDown}
                    autoFocus
                    className="nodrag"
                    style={{
                        width: '100%',
                        height: '100%',
                        background: 'rgba(0, 0, 0, 0.2)',
                        color: 'white',
                        border: 'none',
                        outline: 'none',
                        resize: 'none',
                        fontWeight: '500',
                        fontSize: '14px',
                        cursor: 'text',
                    }}
                />
            ) : (
                <div
                    style={{
                        width: '100%',
                        height: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        textAlign: 'center',
                        wordBreak: 'break-word',
                        whiteSpace: 'pre-wrap',
                        cursor: 'grab',
                    }}
                >
                    {text}
                </div>
            )}
            {/* Bottom handle - output only */}
            <Handle
                type="source"
                position={Position.Bottom}
                id="execution-bottom"
                style={{
                    background: '#22c55e',
                    width: '16px',
                    height: '16px',
                    border: '2px solid white',
                }}
            />
        </div>
    );
});

ExecutionNode.displayName = 'ExecutionNode';

// Condition Node - Diamond shape, resizable, editable
export const ConditionNode = memo(({ data, selected, id }: NodeProps<CustomNode>) => {
    const [text, setText] = useState(data.label || 'Condition?');
    const [isEditing, setIsEditing] = useState(false);
    const edges = useEdges();
    const nodeColor = (data.color as string) || '#f59e0b';

    // Sync with external data.label changes (from inspector)
    useEffect(() => {
        setText(data.label || 'Condition?');
    }, [data.label]);

    const handleTextChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setText(e.target.value);
        if (data.onChange) {
            data.onChange(id, e.target.value);
        }
    }, [id, data]);

    const handleTextAreaMouseDown = useCallback((e: React.MouseEvent) => {
        e.stopPropagation();
    }, []);

    const handleContextMenu = useCallback((e: React.MouseEvent) => {
        e.preventDefault();
        if (data.onOpenSettings) {
            data.onOpenSettings(id);
        }
    }, [id, data]);

    const leftFalseUsed = edges.some(e => e.source === id && e.sourceHandle === 'condition-left-false');
    const rightFalseUsed = edges.some(e => e.source === id && e.sourceHandle === 'condition-right-false');

    return (
        <div
            className={`condition-node ${selected ? 'selected' : ''}`}
            style={{
                position: 'relative',
                width: '100%',
                height: '100%',
                boxSizing: 'border-box',
                cursor: isEditing ? 'text' : 'grab',
            }}
            onDoubleClick={() => setIsEditing(true)}
            onContextMenu={handleContextMenu}
            title={data.description ? `${data.description}` : '右クリックで設定'}
        >
            <NodeResizer
                isVisible={selected}
                minWidth={120}
                minHeight={120}
                handleStyle={{
                    width: '10px',
                    height: '10px',
                    borderRadius: '50%',
                    background: nodeColor,
                }}
            />
            <div
                style={{
                    position: 'absolute',
                    width: '100%',
                    height: '100%',
                    background: getGradient(nodeColor),
                    clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)',
                    boxShadow: selected
                        ? `0 0 20px ${nodeColor}80, 0 4px 16px rgba(0, 0, 0, 0.4)`
                        : '0 4px 16px rgba(0, 0, 0, 0.4)',
                    transition: 'box-shadow 250ms cubic-bezier(0.4, 0, 0.2, 1)',
                }}
            />
            {/* SVG Border - always visible like other node types */}
            <svg
                style={{
                    position: 'absolute',
                    width: '100%',
                    height: '100%',
                    pointerEvents: 'none',
                }}
                viewBox="0 0 100 100"
                preserveAspectRatio="none"
            >
                <path
                    d="M50,0 L100,50 L50,100 L0,50 Z"
                    fill="none"
                    stroke={nodeColor}
                    strokeWidth="2"
                    vectorEffect="non-scaling-stroke"
                />
            </svg>
            <div
                style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: '60%',
                    height: '60%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontWeight: '500',
                    textAlign: 'center',
                    wordBreak: 'break-word',
                    padding: '8px',
                    zIndex: 1,
                    cursor: isEditing ? 'text' : 'grab',
                }}
            >
                {isEditing ? (
                    <textarea
                        value={text}
                        onChange={handleTextChange}
                        onBlur={() => setIsEditing(false)}
                        onMouseDown={handleTextAreaMouseDown}
                        autoFocus
                        className="nodrag"
                        style={{
                            width: '100%',
                            height: '100%',
                            background: 'rgba(0, 0, 0, 0.2)',
                            color: 'white',
                            border: 'none',
                            outline: 'none',
                            resize: 'none',
                            fontWeight: '500',
                            fontSize: '14px',
                            textAlign: 'center',
                            cursor: 'text',
                        }}
                    />
                ) : (
                    <div style={{ fontSize: '14px', whiteSpace: 'pre-wrap', cursor: 'grab' }}>{text}</div>
                )}
            </div>
            <Handle
                type="target"
                position={Position.Top}
                id="condition-top"
                style={{
                    background: '#0ea5e9',
                    width: '16px',
                    height: '16px',
                    border: '2px solid white',
                    top: '-8px',
                }}
            />
            <Handle
                type="source"
                position={Position.Bottom}
                id="condition-bottom-true"
                style={{
                    background: '#22c55e',
                    width: '16px',
                    height: '16px',
                    border: '2px solid white',
                    bottom: '-8px',
                }}
            />
            {!rightFalseUsed && (
                <Handle
                    type="source"
                    position={Position.Left}
                    id="condition-left-false"
                    style={{
                        background: '#ef4444',
                        width: '16px',
                        height: '16px',
                        border: '2px solid white',
                        left: '-8px',
                    }}
                />
            )}
            {!leftFalseUsed && (
                <Handle
                    type="source"
                    position={Position.Right}
                    id="condition-right-false"
                    style={{
                        background: '#ef4444',
                        width: '16px',
                        height: '16px',
                        border: '2px solid white',
                        right: '-8px',
                    }}
                />
            )}
        </div>
    );
});

ConditionNode.displayName = 'ConditionNode';

export const nodeTypes = {
    start: StartNode,
    end: EndNode,
    execution: ExecutionNode,
    condition: ConditionNode,
};
