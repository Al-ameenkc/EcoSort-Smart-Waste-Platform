import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import AboutUs from './pages/AboutUs';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-white text-primary font-sans selection:bg-[#C3F53C] selection:text-black overflow-x-hidden">
        
        {/* Navbar appears on all pages */}
        <Navbar />

        {/* Page Content determined by the URL */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<AboutUs />} />
        </Routes>

        {/* Footer appears on all pages */}
        <Footer />

      </div>
    </Router>
  );
}

export default App;