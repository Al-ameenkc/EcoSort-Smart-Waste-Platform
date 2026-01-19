import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import AboutUs from './pages/AboutUs';
import BookPickup from './pages/BookPickup';
import EcoBotSidebar from './components/EcoBotSidebar';
import Management from './pages/Management';

// --- 1. THE PUBLIC LAYOUT ---
// This wrapper contains the Navbar, Footer, and Chatbot.
// Only "Public" pages will be wrapped inside this.
const PublicLayout = () => {
  const [isEcoAiOpen, setIsEcoAiOpen] = useState(false);

  // Listen for custom open events
  useEffect(() => {
    const handleOpen = () => setIsEcoAiOpen(true);
    window.addEventListener('open-eco-ai', handleOpen);
    return () => window.removeEventListener('open-eco-ai', handleOpen);
  }, []);

  return (
    <>
      <Navbar onOpenEcoAi={() => setIsEcoAiOpen(true)} />
      
      {/* <Outlet /> renders the child page (Home, About, etc.) here */}
      <Outlet />
      
      <Footer />
      
      <EcoBotSidebar 
        isOpen={isEcoAiOpen} 
        onClose={() => setIsEcoAiOpen(false)} 
      />
    </>
  );
};

// --- 2. THE MAIN APP ---
function App() {
  return (
    <Router>
      <div className="min-h-screen bg-white text-primary font-sans selection:bg-[#C3F53C] selection:text-black overflow-x-hidden">
        <Routes>

          {/* === GROUP 1: HIDDEN PAGES (No Navbar, No Footer) === */}
          {/* These are OUTSIDE the PublicLayout, so they are blank. */}
          
          <Route path="/management" element={<Management />} />
          
          <Route path="/admin" element={
             <div className="flex items-center justify-center h-screen bg-white">
               <h1 className="text-4xl font-bold text-gray-300">404 - Not Found</h1>
             </div>
          } />


          {/* === GROUP 2: PUBLIC PAGES (With Navbar & Footer) === */}
          {/* Everything inside this "element" gets the Layout automatically */}
          
          <Route element={<PublicLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<AboutUs />} />
            <Route path="/book-pickup" element={<BookPickup />} />
            
            {/* Catch-all 404 for regular users (Keeps Navbar) */}
            <Route path="*" element={
                <div className="py-32 text-center">
                    <h1 className="text-4xl font-bold text-slate-900">Page Not Found</h1>
                </div>
            } />
          </Route>

        </Routes>
      </div>
    </Router>
  );
}

export default App;