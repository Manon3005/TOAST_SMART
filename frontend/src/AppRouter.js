
import './styles/App.css';
import { HashRouter as Router, Routes, Route} from 'react-router-dom';
import { Start } from './pages/start';
import { Explanation } from './pages/explanation';
import { Support } from './pages/support';
import { NavBar } from './components/molecules/NavBar';
import Preprocessing from './pages/preprocessing';
import End from './pages/end'


function AppRouter() {

  return (
    <Router>
      <NavBar/>
      <Routes>
        <Route path='/' element={<Start />}/>
        <Route path='/end' element={<End />}/>
        <Route path='/preprocessing' element={<Preprocessing />}/>
        <Route path='/explanation' element={<Explanation />}/>
        <Route path='/support' element={<Support />}/>
      </Routes>
    </Router>
  );
};


export default AppRouter;



