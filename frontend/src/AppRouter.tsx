
import './styles/App.css';
import { HashRouter as Router, Routes, Route} from 'react-router-dom';
import { Start } from './pages/Start';
import { Explanation } from './pages/Explanation';
import { Support } from './pages/Support';
import { NavBar } from './components/molecules/NavBar';
import Preprocessing from './pages/Preprocessing';
import End from './pages/End'
import Conflicts from './pages/Conflicts'


function AppRouter() {

  return (
    <Router>
      <NavBar/>
      <Routes>
        <Route path='/' element={<Start />}/>
        <Route path='/end' element={<End />}/>
        <Route path='/conflicts' element={<Conflicts />}/>
        <Route path='/preprocessing' element={<Preprocessing />}/>
        <Route path='/explanation' element={<Explanation />}/>
        <Route path='/support' element={<Support />}/>
      </Routes>
    </Router>
  );
};


export default AppRouter;



