import React, { useState, useEffect } from 'react';
import AdminDashboard from './AdminDashboard'; 
import { Lock, ShieldCheck, Loader2 } from 'lucide-react';

const Management = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

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

    setTimeout(() => {
        const rawEnvPass = import.meta.env.VITE_ADMIN_PASSWORD;
        const envPass = (rawEnvPass || "").trim();
        const inputPass = (password || "").trim();

        if (inputPass && inputPass === envPass) {
            setIsAuthenticated(true);
            sessionStorage.setItem('kanem_admin_session', 'true');
            setPassword(''); // <--- 1. CLEAR PASSWORD ON SUCCESS
        } else {
            if (!envPass) {
                console.error("CRITICAL: VITE_ADMIN_PASSWORD is missing!");
                setError('System Error: Configuration Missing');
            } else {
                setError('Access Denied: Invalid Credentials');
            }
        }
        setIsLoading(false);
    }, 800);
  };

  const handleLogout = () => {
    sessionStorage.removeItem('kanem_admin_session');
    setIsAuthenticated(false);
    setPassword(''); // <--- 2. CLEAR PASSWORD ON LOGOUT
  };

  // --- IF LOGGED IN: SHOW DASHBOARD ---
  if (isAuthenticated) {
    return <AdminDashboard onLogout={handleLogout} />;
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