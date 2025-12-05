# Flowchart Builder

A modern, visual flowchart creation application built with React and ReactFlow.

## ✨ Features

### Core Features
- **Drag & Drop Interface**: Create flowcharts by dragging nodes from the sidebar
- **Node Types**: Start, End, Process, and Decision nodes
- **Smart Connections**: Connect nodes with directional arrows
- **Editable Labels**: Double-click nodes to edit text
- **Resizable Nodes**: Process and Decision nodes can be resized
- **Auto Layout**: Automatic vertical arrangement of nodes

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
- **Dark Theme**: Modern glassmorphism design

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

- **v1.1.4** - Collapsible Controls panel with dropdown animation
- **v1.1.3** - Auto-save to localStorage, unsaved changes warning
- **v1.1.2** - UI reorganization, Auto Layout moved to bottom-left
- **v1.1.1** - Icon improvements, Text/Mermaid export restored
- **v1.1.0** - Project save/load feature (.fchart format)
- **v1.0.8** - Full view PNG export
- **v1.0.0** - Initial release

## 📄 License

MIT License
