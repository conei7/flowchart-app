# 🎨 Flowchart Builder

A modern, beautiful web-based flowchart application built with React, TypeScript, and React Flow.

## ✨ Features

- **Drag & Drop Interface**: Easily add nodes by dragging from the sidebar
- **Multiple Node Types**:
  - 🟢 **Start**: Oval-shaped node for flowchart beginning
  - 🔴 **End**: Oval-shaped node for flowchart ending
  - 🔵 **Process/Execution**: Rectangular, resizable node for processes
  - 🟡 **Decision/Condition**: Diamond-shaped, resizable node for conditions
- **Interactive Editing**:
  - Double-click nodes to edit text
  - Resize Process and Decision nodes
  - Connect nodes with directional arrows
- **Export Options**:
  - 📸 **PNG Image**: Export as high-quality image
  - 📄 **JSON**: Export flowchart data structure
  - 📝 **Text**: Export with descriptive text and Mermaid diagram
  - 📋 **Mermaid**: Copy Mermaid diagram to clipboard
- **Premium Design**:
  - Dark theme with glassmorphism effects
  - Smooth animations and transitions
  - Modern, vibrant color palette

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open your browser and navigate to the local development URL (typically `http://localhost:5173`)

### Building for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## 📖 How to Use

1. **Add Nodes**: Drag node types from the left sidebar onto the canvas
2. **Connect Nodes**: Click and drag from one node's handle to another
3. **Edit Text**: Double-click on Process or Decision nodes to edit text
4. **Resize Nodes**: Select a node and drag the resize handles
5. **Export**: Use the export panel in the top-right to save your flowchart

## 🎯 Keyboard Shortcuts

- **Delete**: Select nodes/edges and press Delete to remove them
- **Ctrl/Cmd + Scroll**: Zoom in/out
- **Space + Drag**: Pan the canvas

## 🛠️ Tech Stack

- **React 18**: UI library
- **TypeScript**: Type-safe development
- **Vite**: Fast build tool
- **@xyflow/react**: Flowchart engine
- **html-to-image**: Image export functionality
- **Lucide React**: Beautiful icons

## 📁 Project Structure

```
flowchart-app/
├── src/
│   ├── components/
│   │   ├── nodes/
│   │   │   └── CustomNodes.tsx    # Node type definitions
│   │   ├── FlowchartBuilder.tsx   # Main flowchart component
│   │   ├── FlowchartBuilder.css
│   │   ├── Sidebar.tsx            # Node palette
│   │   └── Sidebar.css
│   ├── utils/
│   │   └── export.ts              # Export utilities
│   ├── App.tsx                    # Main app component
│   ├── App.css
│   ├── main.tsx                   # Entry point
│   └── index.css                  # Global styles
├── index.html
├── package.json
├── tsconfig.json
└── vite.config.ts
```

## 📝 License

MIT

## 🙏 Acknowledgments

Built with ❤️ using modern web technologies
