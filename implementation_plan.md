# Flowchart App Implementation Plan

## Goal Description
Create a web-based flowchart application allowing users to place Start, End, Execution, and Condition nodes. Users can connect nodes with arrows, resize nodes, and edit text within them. The app will support exporting the flowchart as an image and two string formats.

## Proposed Changes

### Project Structure
- Initialize a React + TypeScript project using Vite.
- Directory: `h:/その他のパソコン/ryzen7_pc/python/flowchart-app` (Note: User's workspace is `.../python`, creating a subfolder there).

### Core Dependencies
- `react`: UI Library
- `@xyflow/react` (formerly React Flow): Flowchart engine
- `html-to-image`: For image export
- `lucide-react`: Icons

### Components

#### [NEW] `src/components/FlowchartBuilder.tsx`
- Main component containing the React Flow canvas and Sidebar.
- Manages state for nodes and edges.
- Handles drag-and-drop logic.

#### [NEW] `src/components/Sidebar.tsx`
- Draggable items for Start, End, Execution, and Condition nodes.

#### [NEW] `src/components/nodes/CustomNodes.tsx`
- **Start/End Node**: Simple circular/capsule shape.
- **Execution Node**: Rectangular, resizable, with `textarea` for text.
- **Condition Node**: Diamond shape, resizable, with `textarea` for text.

#### [NEW] `src/utils/export.ts`
- Functions to convert flow state to JSON.
- Functions to convert flow state to a descriptive string (e.g., Mermaid-like).
- Function to capture canvas as image.

### Styling
- Use CSS Modules or standard CSS.
- Theme: Modern, premium feel (dark mode/glassmorphism elements as requested).

## Verification Plan

### Automated Tests
- Build test: `npm run build`

### Manual Verification
- Verify dragging nodes from sidebar works.
- Verify connecting nodes creates arrows.
- Verify resizing Execution and Condition nodes.
- Verify text editing in nodes.
- Verify image export downloads a valid image.
- Verify string exports produce expected output.
