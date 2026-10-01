import { useState } from 'react';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import './App.css';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { Home } from './pages/Home';
import { TimeLine } from './pages/Timeline';
import { Gallery } from './pages/Gallery';
import { Testimonials } from './pages/Testimonials';
import { CozyArea } from './pages/CozyArea';

function App() {
  return (
    <Router>
      <div className='app'>
        <div className='navarea'>
          <Navbar />
        </div>
        
        <Routes>
          <Route path='/' element={<Home/>}/>
          <Route path='/timeline' element={<TimeLine/>}/>
          <Route path='/gallery' element={<Gallery/>}/>
          <Route path='/cozy' element={<CozyArea/>}/>
          <Route path='/testimonials' element={<Testimonials/>}/>
        </Routes>
        <Footer/>
      </div>
    </Router>
  )
}

export default App
