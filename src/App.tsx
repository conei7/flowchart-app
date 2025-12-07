import { useState, useEffect } from 'react';
import { FlowchartBuilder } from './components/FlowchartBuilder';
import { Sun, Moon, HelpCircle } from 'lucide-react';
import './App.css';

function App() {
    const [isDarkMode, setIsDarkMode] = useState(() => {
        const saved = localStorage.getItem('theme');
        return saved ? saved === 'dark' : true; // Default to dark mode
    });
    const [showHelp, setShowHelp] = useState(false);

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', isDarkMode ? 'dark' : 'light');
        localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
    }, [isDarkMode]);

    const toggleTheme = () => {
        setIsDarkMode(!isDarkMode);
    };

    const toggleHelp = () => {
        setShowHelp(!showHelp);
    };

    return (
        <>
            <header className="app-header">
                <div className="header-content">
                    <h1 className="app-title">
                        <span className="gradient-text">Flowchart Builder</span>
                    </h1>
                    <p className="app-subtitle">Create beautiful flowcharts with ease</p>
                </div>
                <div className="header-actions">
                    <button
                        className="header-action-btn"
                        onClick={toggleHelp}
                        title="Keyboard Shortcuts (Press ?)"
                    >
                        <HelpCircle size={18} />
                    </button>
                    <button
                        className="header-action-btn"
                        onClick={toggleTheme}
                        title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                    >
                        {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
                    </button>
                </div>
            </header>
            <main className="app-main">
                <FlowchartBuilder
                    externalShowHelp={showHelp}
                    onHelpClose={() => setShowHelp(false)}
                />
            </main>
        </>
    );
}

export default App;
