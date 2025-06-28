import React from 'react';
import ImportHistory from './pages/ImportHistory';
import './App.css'; // Optional: Add styling

function App() {
  return (
    <div className="App">
      <header>
        <h1>Job Importer Admin Panel</h1>
      </header>
      <main>
        <ImportHistory />
      </main>
    </div>
  );
}

export default App;
