
import './App.css';

import React, { useState } from 'react';

function App() {
  const [count, setCount] = useState(0);

  return (
    <div style={{ padding: 20 }}>
      <h1>Mon App Electron + React</h1>
      <button onClick={() => setCount(count + 1)}>
        Clique-moi ! ({count})
      </button>
    </div>
  );
}

export default App;



