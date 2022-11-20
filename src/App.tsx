import React from 'react';
import Writer from './Writer';
import Simulator from './machine-run/Simulator.jsx';
import './App.css';

function App() {
    return (
        <div className="App">
            <header className="App-header">
                <Writer />
                <Simulator />
            </header>
        </div>
    );
}

export default App;
