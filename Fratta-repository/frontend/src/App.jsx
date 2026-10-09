import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { Home } from './pages/Home';
import { Timeline } from './pages/Timeline';
import { Gallery } from './pages/Gallery';
import { Testimonials } from './pages/Testimonials';
import { CozyArea } from './pages/CozyArea';
import { Poems } from './pages/Poems'; // Importando a página de poesias
import { Login } from './pages/admin/Login';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Dashboard } from './pages/admin/AdminDashboard';

function App() {
  return (
    <Router>
      <div className='app'>
        <div className='navarea'>
          <Navbar />
        </div>
        
        <Routes>
          {/* Rotas Públicas */}
          <Route path='/' element={<Home/>}/>
          <Route path='/timeline' element={<Timeline/>}/>
          <Route path='/gallery' element={<Gallery/>}/>
          <Route path='/CozyArea' element={<CozyArea/>}/>
          <Route path='/testimonials' element={<Testimonials/>}/>
          <Route path='/poems' element={<Poems/>}/> {/* Rota para a página de Poesias */}

          {/* Rota de Login do ADM */}
          <Route path='/login' element={<Login />} />

          {/* Rota Protegida do Painel Administrativo */}
          <Route 
            path='/admin/dashboard' 
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } 
          />
        </Routes>
        
        <Footer/>
      </div>
    </Router>
  );
}

export default App;