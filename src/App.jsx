import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import AboutUs from './pages/AboutUs';
import BookPickup from './pages/BookPickup';
import EcoBotSidebar from './components/EcoBotSidebar'; // <--- Import Sidebar
import AdminDashboard from './pages/AdminDashboard';

function App() {
  // State for the Global Eco-AI Sidebar
  const [isEcoAiOpen, setIsEcoAiOpen] = useState(false);

  // Listen for the custom 'open-eco-ai' event (triggered by Footer)
  useEffect(() => {
    const handleOpen = () => setIsEcoAiOpen(true);
    window.addEventListener('open-eco-ai', handleOpen);
    return () => window.removeEventListener('open-eco-ai', handleOpen);
  }, []);

  return (
    <Router>
      <div className="min-h-screen bg-white text-primary font-sans selection:bg-[#C3F53C] selection:text-black overflow-x-hidden">
        
        {/* Navbar */}
        <Navbar />

        {/* Routes */}
        <Routes>
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/book-pickup" element={<BookPickup />} />
        </Routes>

        {/* Footer */}
        <Footer />

        {/* Global Eco-AI Sidebar 
            Placed here so it exists on every page and sits on top via Portal 
        */}
        <EcoBotSidebar 
          isOpen={isEcoAiOpen} 
          onClose={() => setIsEcoAiOpen(false)} 
        />

      </div>
    </Router>
  );
}

export default App;