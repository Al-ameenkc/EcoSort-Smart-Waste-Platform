import React, { useState, useEffect } from 'react';
import AdminDashboard from './AdminDashboard'; // Assuming your dashboard is here
import { Lock, ShieldCheck, Loader2 } from 'lucide-react';

const Management = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Check if user is already logged in (saved in browser)
  useEffect(() => {
    const session = sessionStorage.getItem('kanem_admin_session');
    if (session === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Simulate a short delay for security feel
    setTimeout(() => {
        // CHECK THE PASSWORD AGAINST .ENV VARIABLE
        if (password === import.meta.env.VITE_ADMIN_PASSWORD) {
            setIsAuthenticated(true);
            sessionStorage.setItem('kanem_admin_session', 'true'); // Save session
        } else {
            setError('Access Denied: Invalid Credentials');
        }
        setIsLoading(false);
    }, 800);
  };

  const handleLogout = () => {
    sessionStorage.removeItem('kanem_admin_session');
    setIsAuthenticated(false);
  };

  // --- IF LOGGED IN: SHOW DASHBOARD ---
  if (isAuthenticated) {
    return (
        <div className="relative">
            {/* Logout Button Overlay */}
            <button 
                onClick={handleLogout}
                className="fixed top-4 right-4 z-[60] bg-red-600 text-white px-4 py-2 rounded-lg text-xs font-bold shadow-lg hover:bg-red-700 transition-colors"
            >
                Log Out
            </button>
            <AdminDashboard />
        </div>
    );
  }

  // --- IF NOT LOGGED IN: SHOW LOCK SCREEN ---
  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
        <div className="bg-slate-800 p-8 rounded-2xl shadow-2xl w-full max-w-md border border-slate-700">
            <div className="flex justify-center mb-6">
                <div className="w-16 h-16 bg-slate-700 rounded-full flex items-center justify-center">
                    <ShieldCheck size={32} className="text-green-500" />
                </div>
            </div>
            
            <h2 className="text-2xl font-bold text-white text-center mb-2">Restricted Area</h2>
            <p className="text-slate-400 text-center text-sm mb-8">Authorized Management Personnel Only</p>

            <form onSubmit={handleLogin} className="space-y-4">
                <div className="relative">
                    <Lock size={18} className="absolute left-4 top-3.5 text-slate-500" />
                    <input 
                        type="password" 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter Access Key"
                        className="w-full pl-12 pr-4 py-3 bg-slate-900 border border-slate-600 rounded-xl text-white focus:outline-none focus:border-green-500 transition-colors placeholder:text-slate-600"
                    />
                </div>

                {error && <p className="text-red-400 text-xs text-center font-bold animate-pulse">{error}</p>}

                <button 
                    type="submit" 
                    disabled={!password || isLoading}
                    className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isLoading ? <Loader2 className="animate-spin" size={18} /> : "Unlock Dashboard"}
                </button>
            </form>
        </div>
    </div>
  );
};

export default Management;