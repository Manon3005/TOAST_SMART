
import './App.css';
import React, { useState } from 'react';
import { HashRouter as Router, Routes, Route} from 'react-router-dom';
import { Start } from './pages/start';
import { Home } from './pages/home';
import { Explanation } from './pages/explanation';
import { Support } from './pages/support';
import { NavBar } from './components/navBar';


function App() {

  return React.createElement(
    Router, null, 
      React.createElement(NavBar, null),
      React.createElement(Routes, null,
        React.createElement(Route, { path: '/', element: React.createElement(Start) }),
        React.createElement(Route, { path: '/home', element: React.createElement(Home) }),
        React.createElement(Route, { path: '/explanation', element: React.createElement(Explanation) }),
        React.createElement(Route, { path: '/support', element: React.createElement(Support) }),
    )
  );
}


export default App;



