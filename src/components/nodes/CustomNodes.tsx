import { memo, useState, useCallback } from 'react';
import { Handle, Position, NodeProps, NodeResizer, useEdges } from '@xyflow/react';

// Start Node - Oval shape
export const StartNode = memo(({ data, selected }: NodeProps) => {
    return (
        <div
            className={`start-node ${selected ? 'selected' : ''}`}
            style={{
                background: 'linear-gradient(135deg, #10b981, #059669)',
                border: selected ? '2px solid #34d399' : '2px solid #10b981',
                borderRadius: '50%',
                width: '120px',
                height: '120px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontWeight: '600',
                fontSize: '16px',
                boxShadow: selected
                    ? '0 0 20px rgba(16, 185, 129, 0.5), 0 4px 16px rgba(0, 0, 0, 0.4)'
                    : '0 4px 16px rgba(0, 0, 0, 0.4)',
                transition: 'all 250ms cubic-bezier(0.4, 0, 0.2, 1)',
                cursor: 'grab',
            }}
        >
            <Handle
                type="source"
                position={Position.Bottom}
                id="start-bottom"
                style={{
                    background: '#34d399',
                    width: '16px',
                    height: '16px',
                    border: '2px solid white',
                }}
            />
            <span style={{ position: 'relative', zIndex: 1 }}>{data.label || 'Start'}</span>
        </div>
    );
});

StartNode.displayName = 'StartNode';

// End Node - Oval shape
export const EndNode = memo(({ data, selected }: NodeProps) => {
    return (
        <div
            className={`end-node ${selected ? 'selected' : ''}`}
            style={{
                background: 'linear-gradient(135deg, #ef4444, #dc2626)',
                border: selected ? '2px solid #f87171' : '2px solid #ef4444',
                borderRadius: '50%',
                width: '120px',
                height: '120px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontWeight: '600',
                fontSize: '16px',
                boxShadow: selected
                    ? '0 0 20px rgba(239, 68, 68, 0.5), 0 4px 16px rgba(0, 0, 0, 0.4)'
                    : '0 4px 16px rgba(0, 0, 0, 0.4)',
                transition: 'all 250ms cubic-bezier(0.4, 0, 0.2, 1)',
                cursor: 'grab',
            }}
        >
            <Handle
                type="target"
                position={Position.Top}
                id="end-top"
                style={{
                    background: '#f87171',
                    width: '16px',
                    height: '16px',
                    border: '2px solid white',
                }}
            />
            <span style={{ position: 'relative', zIndex: 1 }}>{data.label || 'End'}</span>
        </div>
    );
});

EndNode.displayName = 'EndNode';

// Execution Node - Rectangle, resizable, editable
export const ExecutionNode = memo(({ data, selected, id }: NodeProps) => {
    const [text, setText] = useState(data.label || 'Process');
    const [isEditing, setIsEditing] = useState(false);

    const handleTextChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setText(e.target.value);
        if (data.onChange) {
            data.onChange(id, e.target.value);
        }
    }, [id, data]);

    const handleTextAreaMouseDown = useCallback((e: React.MouseEvent) => {
        e.stopPropagation();
    }, []);

    return (
        <div
            className={`execution-node ${selected ? 'selected' : ''}`}
            style={{
                position: 'relative',
                width: '100%',
                height: '100%',
                background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
                border: selected ? '2px solid #60a5fa' : '2px solid #3b82f6',
                borderRadius: '8px',
                padding: '12px 16px',
                color: 'white',
                fontWeight: '500',
                minWidth: '150px',
                minHeight: '80px',
                boxSizing: 'border-box',
                boxShadow: selected
                    ? '0 0 20px rgba(59, 130, 246, 0.5), 0 4px 16px rgba(0, 0, 0, 0.4), 0 0 0 10px transparent'
                    : '0 4px 16px rgba(0, 0, 0, 0.4), 0 0 0 10px transparent',
                transition: 'all 250ms cubic-bezier(0.4, 0, 0.2, 1)',
                cursor: isEditing ? 'text' : 'grab',
            }}
            onDoubleClick={() => setIsEditing(true)}
        >
            <NodeResizer
                isVisible={selected}
                minWidth={150}
                minHeight={80}
                handleStyle={{
                    width: '10px',
                    height: '10px',
                    borderRadius: '50%',
                    background: '#60a5fa',
                }}
            />
            {/* Top handle - input only */}
            <Handle
                type="target"
                position={Position.Top}
                id="execution-top"
                style={{
                    background: '#60a5fa',
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
                    background: '#60a5fa',
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
export const ConditionNode = memo(({ data, selected, id }: NodeProps) => {
    const [text, setText] = useState(data.label || 'Condition?');
    const [isEditing, setIsEditing] = useState(false);
    const edges = useEdges();

    const handleTextChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setText(e.target.value);
        if (data.onChange) {
            data.onChange(id, e.target.value);
        }
    }, [id, data]);

    const handleTextAreaMouseDown = useCallback((e: React.MouseEvent) => {
        e.stopPropagation();
    }, []);

    const leftFalseUsed = edges.some(e => e.source === id && e.sourceHandle === 'condition-left-false');
    const rightFalseUsed = edges.some(e => e.source === id && e.sourceHandle === 'condition-right-false');

    return (
        <div
            style={{
                position: 'relative',
                width: '100%',
                height: '100%',
                boxSizing: 'border-box',
                cursor: isEditing ? 'text' : 'grab',
            }}
            onDoubleClick={() => setIsEditing(true)}
        >
            <NodeResizer
                isVisible={selected}
                minWidth={120}
                minHeight={120}
                handleStyle={{
                    width: '10px',
                    height: '10px',
                    borderRadius: '50%',
                    background: '#fbbf24',
                }}
            />
            <div
                style={{
                    position: 'absolute',
                    width: '100%',
                    height: '100%',
                    background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                    transform: 'rotate(45deg)',
                    border: selected ? '2px solid #fbbf24' : '2px solid #f59e0b',
                    boxShadow: selected
                        ? '0 0 20px rgba(245, 158, 11, 0.5), 0 4px 16px rgba(0, 0, 0, 0.4)'
                        : '0 4px 16px rgba(0, 0, 0, 0.4)',
                    transition: 'all 250ms cubic-bezier(0.4, 0, 0.2, 1)',
                }}
            />
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
                    background: '#fbbf24',
                    width: '18px',
                    height: '18px',
                    border: '2px solid white',
                    top: '-9px',
                }}
            />
            <Handle
                type="source"
                position={Position.Bottom}
                id="condition-bottom-true"
                style={{
                    background: '#10b981',
                    width: '18px',
                    height: '18px',
                    border: '2px solid white',
                    bottom: '-9px',
                }}
            />
            {!rightFalseUsed && (
                <Handle
                    type="source"
                    position={Position.Left}
                    id="condition-left-false"
                    style={{
                        background: '#ef4444',
                        width: '18px',
                        height: '18px',
                        border: '2px solid white',
                        left: '-9px',
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
                        width: '18px',
                        height: '18px',
                        border: '2px solid white',
                        right: '-9px',
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
