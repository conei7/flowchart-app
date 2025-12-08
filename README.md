# Flowchart Builder

A modern, visual flowchart creation application built with React and ReactFlow.

**[🚀 Live Demo](https://conei7.github.io/flowchart-app/)**

## ✨ Features

### Core Features
- **Drag & Drop Interface**: Create flowcharts by dragging nodes from the sidebar
- **Node Types**: Start, End, Process, and Decision nodes
- **Smart Connections**: Connect nodes with directional arrows
- **Editable Labels**: Double-click nodes to edit text
- **Resizable Nodes**: All node types can be resized
- **Auto Layout**: Automatic vertical arrangement of nodes
- **Undo/Redo**: Full undo/redo support (Ctrl+Z/Ctrl+Y)
- **Node Duplication**: Duplicate selected nodes (Ctrl+D)
- **Node Deletion**: Delete nodes with Backspace/Delete key or inspector button
- **Keyboard Shortcuts**: Press ? to view all shortcuts

### File Operations
- **Save Project** (.fchart format): Save your flowchart for later editing
- **Open Project**: Load previously saved flowcharts
- **Export PNG**: Export the entire flowchart as an image
- **Export Text**: Export as a text representation
- **Copy Mermaid**: Copy Mermaid diagram syntax to clipboard

### User Experience
- **Auto-save**: Automatically saves to browser storage on every change
- **Restore on Reload**: Your work is preserved when you refresh the page
- **Unsaved Changes Warning**: Warns before closing if you have unsaved work
- **Collapsible Controls**: Clean UI with dropdown controls panel
- **Dark/Light Theme**: Toggle between dark and light modes
- **Node Inspector**: Unity-style inspector panel with custom colors and descriptions

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm

### Installation

```bash
# Clone the repository
git clone https://github.com/conei7/flowchart-app.git
cd flowchart-app

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Build for Production

```bash
npm run build
```

## 🎨 Usage

1. **Add Nodes**: Drag nodes from the left sidebar onto the canvas
2. **Connect Nodes**: Drag from a node's handle to another node
3. **Edit Labels**: Double-click a node to edit its text
4. **Resize Nodes**: Use the resize handles on Process/Decision nodes
5. **Auto Layout**: Click "Auto Layout" button (bottom-left) to arrange nodes
6. **Save/Export**: Use the Controls panel (top-right) for file operations

## 📁 Project Structure

```
src/
├── components/
│   ├── FlowchartBuilder.tsx    # Main flowchart component
│   ├── FlowchartBuilder.css    # Styling
│   ├── Sidebar.tsx             # Node selection sidebar
│   └── nodes/
│       └── CustomNodes.tsx     # Custom node definitions
├── utils/
│   └── export.ts               # Export functions
└── App.tsx                     # Root component
```

## 🔧 Technology Stack

- **React** - UI framework
- **TypeScript** - Type safety
- **ReactFlow** - Flowchart library
- **Vite** - Build tool
- **Lucide React** - Icons
- **html-to-image** - PNG export

## 📝 Version History

- **v1.2.13** - Inspector collapsible sections (Label/Color/Notes), improved selection highlight persistence
- **v1.2.12** - Bug fixes: Improved node drag performance, fixed condition node border visibility
- **v1.2.11** - Node deletion feature (Backspace key, inspector delete button)
- **v1.2.10** - Node resize undo/redo support
- **v1.2.9** - History management performance improvements (debounce, drag skip)
- **v1.2.8** - Unified selection styles with drop-shadow, edge selection color preservation
- **v1.2.7** - Condition node selection style fix, Fit View considers inspector
- **v1.2.6** - Condition node selection style, light mode Controls button fix
- **v1.2.5** - Help button in header, sidebar scroll fix, toggle button fix
- **v1.2.4** - Light mode color improvements, sidebar title resize, help display
- **v1.2.3** - Dark/Light mode toggle button (top-right)
- **v1.2.2** - Header size reduction, inspector header consideration, Controls panel responsive
- **v1.2.1** - UI language unified to English, keyboard shortcuts help improvement
- **v1.2.0** - Node inspector panel (Unity-style, custom colors, descriptions)
- **v1.1.12** - Keyboard shortcuts help modal (? key)
- **v1.1.11** - Node duplication feature (Ctrl+D)
- **v1.1.10** - Undo/Redo feature (Ctrl+Z/Ctrl+Y)
- **v1.1.9** - Keyboard shortcuts (Ctrl+S/E/A, Escape)
- **v1.1.8** - Node/edge selection pulse animation and glow effects
- **v1.1.7** - Viewport position restore after PNG export
- **v1.1.6** - TypeScript type error fixes
- **v1.1.5** - Start/End nodes text editing and resizing, Auto Layout moved to sidebar
- **v1.1.4** - Collapsible Controls panel with dropdown animation
- **v1.1.3** - Auto-save to localStorage, unsaved changes warning
- **v1.1.2** - UI reorganization, Auto Layout moved to bottom-left
- **v1.1.1** - Icon improvements, Text/Mermaid export restored
- **v1.1.0** - Project save/load feature (.fchart format)
- **v1.0.8** - Full view PNG export
- **v1.0.0** - Initial release

## 📄 License

MIT License
