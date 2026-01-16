import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { X, Bot, Send, User, Sparkles } from 'lucide-react';

const EcoBotSidebar = ({ isOpen, onClose }) => {
  // --- ANIMATION STATE ---
  // isRendered: Controls if the component is present in the DOM
  // isVisible: Controls the CSS opacity/transform classes
  const [isRendered, setIsRendered] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsRendered(true);
      // Small delay to allow the DOM to mount before starting the transition (Entry Animation)
      const timer = setTimeout(() => setIsVisible(true), 10);
      return () => clearTimeout(timer);
    } else {
      setIsVisible(false); // Start Exit Animation
      // Wait for animation (500ms) to finish before unmounting
      const timer = setTimeout(() => setIsRendered(false), 500);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // --- TYPEWRITER & CHAT STATE ---
  const words = ["Recycling", "KanemWaste", "Sustainability", "Environment", "Plastic"];
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [currentText, setCurrentText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [messages, setMessages] = useState([
    { id: 1, type: 'bot', text: "Hello! I'm Eco-Ai. I can help you identify recyclable materials or answer questions about our mission. How can I help you today?" }
  ]);
  const [inputValue, setInputValue] = useState("");
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  useEffect(() => scrollToBottom(), [messages, isOpen]);

  // --- TYPEWRITER LOGIC ---
  useEffect(() => {
    if (!isOpen) return;
    const typeSpeed = isDeleting ? 50 : 100;
    const deleteDelay = 2000; 
    const nextWordDelay = 500; 
    const handleType = () => {
      const fullWord = words[currentWordIndex];
      if (isDeleting) {
        setCurrentText(prev => prev.substring(0, prev.length - 1));
        if (currentText === "") { setIsDeleting(false); setCurrentWordIndex(prev => (prev + 1) % words.length); }
      } else {
        setCurrentText(fullWord.substring(0, currentText.length + 1));
        if (currentText === fullWord) { setTimeout(() => setIsDeleting(true), deleteDelay); return; }
      }
    };
    const timer = setTimeout(handleType, typeSpeed);
    return () => clearTimeout(timer);
  }, [currentText, isDeleting, currentWordIndex, isOpen]);

  // --- HANDLER ---
  const handleSend = (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;
    const newUserMsg = { id: Date.now(), type: 'user', text: inputValue };
    setMessages(prev => [...prev, newUserMsg]);
    setInputValue("");
    setTimeout(() => {
        const botResponses = ["That's a great question about recycling!", "I'm still learning, but I believe sustainability is key.", "You can book a pickup for that item on our 'Book Pickup' page.", "Plastic bottles (PET) are highly recyclable. Make sure to rinse them first!", "KanemWaste is dedicated to a cleaner future."];
        const randomResponse = botResponses[Math.floor(Math.random() * botResponses.length)];
        setMessages(prev => [...prev, { id: Date.now() + 1, type: 'bot', text: randomResponse }]);
    }, 1000);
  };

  // Only render if we are mounting or fading out
  if (!isRendered) return null;

  return createPortal(
    <div className="fixed inset-0 z-[100] flex justify-end">
      
      {/* Backdrop: Fades In/Out */}
      <div 
        className={`
            absolute inset-0 bg-black/20 backdrop-blur-sm 
            transition-opacity duration-500 ease-out
            ${isVisible ? 'opacity-100' : 'opacity-0'}
        `}
        onClick={onClose}
      ></div>

      {/* Sidebar: Slides In/Out */}
      <div 
        className={`
            relative z-10 w-full md:w-[400px] bg-white h-full shadow-2xl flex flex-col 
            transform transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]
            ${isVisible ? 'translate-x-0' : 'translate-x-full'}
        `}
      >
        
        {/* HEADER */}
        <div className="p-6 bg-[#1a4032] text-white flex items-center justify-between shadow-md">
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-md border border-white/20">
                    <Bot size={20} className="text-[#C3F53C]" />
                </div>
                <div>
                    <h3 className="font-bold text-lg leading-tight">Eco-Ai</h3>
                    <div className="flex items-center gap-1.5 opacity-80">
                        <span className="w-2 h-2 rounded-full bg-[#C3F53C] animate-pulse"></span>
                        <span className="text-xs font-medium">Online</span>
                    </div>
                </div>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors text-white/70 hover:text-white">
                <X size={20} />
            </button>
        </div>

        {/* WELCOME */}
        <div className="bg-slate-50 border-b border-slate-100 p-4 text-center">
            <p className="text-slate-500 text-sm font-medium">
                Ask me anything about <br/>
                <span className="text-[#1a4032] font-bold text-lg block mt-1 min-h-[1.75rem]">
                    {currentText}
                </span>
            </p>
        </div>

        {/* CHAT MESSAGES */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-white scroll-smooth">
            {messages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                    {msg.type === 'bot' && (
                        <div className="w-8 h-8 bg-[#F1FCC2] rounded-full flex items-center justify-center mr-2 mt-1 shrink-0">
                            <Bot size={14} className="text-[#1a4032]" />
                        </div>
                    )}
                    <div className={`max-w-[80%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${msg.type === 'user' ? 'bg-[#1a4032] text-white rounded-tr-none' : 'bg-slate-100 text-slate-800 rounded-tl-none border border-slate-200'}`}>
                        {msg.text}
                    </div>
                    {msg.type === 'user' && (
                        <div className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center ml-2 mt-1 shrink-0">
                            <User size={14} className="text-slate-500" />
                        </div>
                    )}
                </div>
            ))}
            <div ref={messagesEndRef} />
        </div>

        {/* INPUT */}
        <div className="p-4 border-t border-slate-100 bg-white">
            <form onSubmit={handleSend} className="relative flex items-center gap-2">
                <input type="text" value={inputValue} onChange={(e) => setInputValue(e.target.value)} placeholder="Type your question..." className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-full pl-5 pr-14 py-3 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-all" />
                <button type="submit" className="absolute right-1.5 w-10 h-10 flex items-center justify-center bg-[#C3F53C] hover:bg-[#b2e32b] rounded-full text-[#1a4032] transition-colors shadow-sm disabled:opacity-50" disabled={!inputValue.trim()}>
                    <Send size={18} className="ml-0.5" />
                </button>
            </form>
            <div className="flex justify-center mt-2 gap-2">
                <span className="text-[10px] text-slate-400 flex items-center gap-1"><Sparkles size={10} /> AI powered</span>
            </div>
        </div>

      </div>
    </div>,
    document.body
  );
};

export default EcoBotSidebar;