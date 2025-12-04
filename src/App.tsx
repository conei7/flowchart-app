import { FlowchartBuilder } from './components/FlowchartBuilder';
import './App.css';

function App() {
    return (
        <>
            <header className="app-header">
                <div className="header-content">
                    <h1 className="app-title">
                        <span className="gradient-text">Flowchart Builder</span>
                    </h1>
                    <p className="app-subtitle">Create beautiful flowcharts with ease</p>
                </div>
            </header>
            <main className="app-main">
                <FlowchartBuilder />
            </main>
        </>
    );
}

export default App;
