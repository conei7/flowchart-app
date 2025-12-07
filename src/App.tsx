import { useState, useEffect } from 'react';
import { FlowchartBuilder } from './components/FlowchartBuilder';
import { Sun, Moon } from 'lucide-react';
import './App.css';

function App() {
    const [isDarkMode, setIsDarkMode] = useState(() => {
        const saved = localStorage.getItem('theme');
        return saved ? saved === 'dark' : true; // Default to dark mode
    });

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', isDarkMode ? 'dark' : 'light');
        localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
    }, [isDarkMode]);

    const toggleTheme = () => {
        setIsDarkMode(!isDarkMode);
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
                <button
                    className="theme-toggle-btn"
                    onClick={toggleTheme}
                    title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                >
                    {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
                </button>
            </header>
            <main className="app-main">
                <FlowchartBuilder />
            </main>
        </>
    );
}

export default App;
