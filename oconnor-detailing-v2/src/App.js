import React from 'react';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import Navbar from './Components/Navbar';
import Home from './Pages/Home';
import Pricing from './Pages/Pricing';
import Gallery from './Pages/Gallery';
import Contact from './Pages/Contact';
import Admin from './Pages/Admin';
import ProjectDetail from './Pages/ProjectDetail';
import './Components/theme.css';

function App() {
  return (
    <Router>
      <Navbar />
      <div className='page-container'>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/gallery/:id" element={<ProjectDetail />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/Admin" element={<Admin />} />
      </Routes>
      </div>
    </Router>
  );
}

export default App;
