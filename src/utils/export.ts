import { toPng } from 'html-to-image';
import { Node, Edge } from '@xyflow/react';

/**
 * Export flowchart as PNG image
 */
export const exportAsImage = async (elementId: string, fileName: string = 'flowchart.png') => {
    const element = document.getElementById(elementId);
    if (!element) {
        console.error('Element not found');
        return;
    }

    try {
        const dataUrl = await toPng(element, {
            backgroundColor: '#0a0a0f',
            pixelRatio: 2,
        });

        const link = document.createElement('a');
        link.download = fileName;
        link.href = dataUrl;
        link.click();
    } catch (error) {
        console.error('Error exporting image:', error);
    }
};

/**
 * Export flowchart as JSON
 */
export const exportAsJSON = (nodes: Node[], edges: Edge[], fileName: string = 'flowchart.json') => {
    const flowchartData = {
        nodes: nodes.map(node => ({
            id: node.id,
            type: node.type,
            position: node.position,
            data: node.data,
        })),
        edges: edges.map(edge => ({
            id: edge.id,
            source: edge.source,
            target: edge.target,
        })),
    };

    const jsonString = JSON.stringify(flowchartData, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.download = fileName;
    link.href = url;
    link.click();

    URL.revokeObjectURL(url);
};

/**
 * Project file format version
 */
const PROJECT_VERSION = '1.0';

/**
 * Project file interface
 */
export interface FlowchartProject {
    version: string;
    createdAt: string;
    modifiedAt: string;
    nodes: Array<{
        id: string;
        type: string;
        position: { x: number; y: number };
        size?: { width: number; height: number };
        style?: Record<string, any>;
        data: { label: string };
    }>;
    edges: Array<{
        id: string;
        source: string;
        target: string;
        sourceHandle?: string;
        targetHandle?: string;
        label?: string;
    }>;
}

/**
 * Save flowchart project to .fchart file (complete save with all positions and sizes)
 */
export const saveProject = (nodes: Node[], edges: Edge[], fileName: string = 'flowchart.fchart') => {
    const project: FlowchartProject = {
        version: PROJECT_VERSION,
        createdAt: new Date().toISOString(),
        modifiedAt: new Date().toISOString(),
        nodes: nodes.map(node => ({
            id: node.id,
            type: node.type || 'execution',
            position: node.position,
            size: {
                width: (node as any).width || (node as any).measured?.width || (node.style as any)?.width || getDefaultSize(node.type).width,
                height: (node as any).height || (node as any).measured?.height || (node.style as any)?.height || getDefaultSize(node.type).height,
            },
            style: node.style as Record<string, any>,
            data: { label: (node.data as any)?.label || '' },
        })),
        edges: edges.map(edge => ({
            id: edge.id,
            source: edge.source,
            target: edge.target,
            sourceHandle: edge.sourceHandle || undefined,
            targetHandle: edge.targetHandle || undefined,
            label: edge.label as string || undefined,
        })),
    };

    const jsonString = JSON.stringify(project, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.download = fileName;
    link.href = url;
    link.click();

    URL.revokeObjectURL(url);
};

/**
 * Get default node size based on type
 */
const getDefaultSize = (type: string | undefined) => {
    switch (type) {
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

/**
 * Load flowchart project from .fchart file
 */
export const loadProject = (fileContent: string): FlowchartProject | null => {
    try {
        const project = JSON.parse(fileContent) as FlowchartProject;

        // Validate project structure
        if (!project.nodes || !project.edges) {
            throw new Error('Invalid project file: missing nodes or edges');
        }

        return project;
    } catch (error) {
        console.error('Failed to load project:', error);
        return null;
    }
};

/**
 * Export flowchart as Mermaid-like string representation
 */
export const exportAsMermaid = (nodes: Node[], edges: Edge[]): string => {
    let mermaidString = 'flowchart TD\n';

    // Add nodes
    nodes.forEach(node => {
        const label = node.data.label || node.type || 'Node';
        const cleanLabel = label.replace(/"/g, '\\"');

        switch (node.type) {
            case 'start':
                mermaidString += `  ${node.id}(["${cleanLabel}"])\n`;
                break;
            case 'end':
                mermaidString += `  ${node.id}(["${cleanLabel}"])\n`;
                break;
            case 'execution':
                mermaidString += `  ${node.id}["${cleanLabel}"]\n`;
                break;
            case 'condition':
                mermaidString += `  ${node.id}{"${cleanLabel}"}\n`;
                break;
            default:
                mermaidString += `  ${node.id}["${cleanLabel}"]\n`;
        }
    });

    // Add edges
    edges.forEach(edge => {
        mermaidString += `  ${edge.source} --> ${edge.target}\n`;
    });

    return mermaidString;
};

/**
 * Export flowchart as descriptive text
 */
export const exportAsText = (nodes: Node[], edges: Edge[], fileName: string = 'flowchart.txt'): void => {
    let textContent = '=== FLOWCHART DESCRIPTION ===\n\n';

    textContent += 'NODES:\n';
    nodes.forEach((node, index) => {
        const label = node.data.label || node.type || 'Node';
        textContent += `${index + 1}. [${node.type?.toUpperCase()}] ${node.id}: "${label}"\n`;
        textContent += `   Position: (${Math.round(node.position.x)}, ${Math.round(node.position.y)})\n\n`;
    });

    textContent += '\nCONNECTIONS:\n';
    edges.forEach((edge, index) => {
        const sourceNode = nodes.find(n => n.id === edge.source);
        const targetNode = nodes.find(n => n.id === edge.target);
        const sourceLabel = sourceNode?.data.label || edge.source;
        const targetLabel = targetNode?.data.label || edge.target;

        textContent += `${index + 1}. "${sourceLabel}" → "${targetLabel}"\n`;
    });

    textContent += '\n\nMERMAID DIAGRAM:\n';
    textContent += exportAsMermaid(nodes, edges);

    const blob = new Blob([textContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.download = fileName;
    link.href = url;
    link.click();

    URL.revokeObjectURL(url);
};

/**
 * Copy Mermaid diagram to clipboard
 */
export const copyMermaidToClipboard = async (nodes: Node[], edges: Edge[]): Promise<boolean> => {
    const mermaidString = exportAsMermaid(nodes, edges);

    try {
        await navigator.clipboard.writeText(mermaidString);
        return true;
    } catch (error) {
        console.error('Failed to copy to clipboard:', error);
        return false;
    }
};
