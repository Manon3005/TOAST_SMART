
import './styles/AppRouter.css';
import React from 'react';
import { HashRouter as Router, Routes, Route} from 'react-router-dom';
import { Start } from './pages/start';
import { Home } from './pages/home';
import { Explanation } from './pages/explanation';
import { Support } from './pages/support';
import { NavBar } from './components/navBar';


function AppRouter() {

  return (
    <Router>
      <NavBar/>
      <Routes>
        <Route path='/' element={<Start />}/>
        <Route path='/home' element={<Home />}/>
        <Route path='/explanation' element={<Explanation />}/>
        <Route path='/support' element={<Support />}/>
      </Routes>
    </Router>
  );
};


export default AppRouter;



