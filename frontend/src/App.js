
import './App.css';

import React, { useState } from 'react';

function App() {
  const loadFile = async () => {
    const path = await window.electronAPI.pickFile();
    if (path) {
      console.log('Fichier sélectionné :', path);
    }
  };

  return (
    <div className="app-container">
      <h1> 🍞 TOAST 🍞</h1>
      <p>Tous à sa table</p>
      <button onClick={loadFile}>📁 Charger un fichier</button>
    </div>
  );
}

export default App;



