
import './App.css';
import React, { useState } from 'react';
import { HashRouter as Router, Routes, Route} from 'react-router-dom';
import { Home } from './pages/home';
import { Explanation } from './pages/explanation';


//import { Button } from './components/Button';

function App() {

  return React.createElement(
    Router, null, React.createElement(Routes, null,
      React.createElement(Route, { path: '/', element: React.createElement(Home) }),
      React.createElement(Route, { path: '/explanation', element: React.createElement(Explanation) })
    )
  );
}


export default App;



