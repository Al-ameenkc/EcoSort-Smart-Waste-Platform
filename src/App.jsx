import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import AboutUs from './pages/AboutUs';
import BookPickup from './pages/BookPickup'; // <--- Import here

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-white text-primary font-sans selection:bg-[#C3F53C] selection:text-black overflow-x-hidden">
        
        {/* Navbar */}
        <Navbar />

        {/* Routes */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/book-pickup" element={<BookPickup />} /> {/* <--- Add Route */}
        </Routes>

        {/* Footer */}
        <Footer />

      </div>
    </Router>
  );
}

export default App;