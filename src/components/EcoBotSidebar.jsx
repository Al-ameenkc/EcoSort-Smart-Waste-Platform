import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { X, Bot, Send, User, Sparkles, Loader2, Camera, Truck, Info, ExternalLink } from 'lucide-react';
import ReactMarkdown from 'react-markdown'; 
import { chatAboutWaste } from '../services/aiService';
import { useNavigate } from 'react-router-dom'; // <--- Critical Import for SPA Navigation

const EcoBotSidebar = ({ isOpen, onClose }) => {
  const navigate = useNavigate(); // Hook for internal navigation
  
  // --- ANIMATION STATE ---
  const [isRendered, setIsRendered] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsRendered(true);
      const timer = setTimeout(() => setIsVisible(true), 10);
      return () => clearTimeout(timer);
    } else {
      setIsVisible(false);
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
    { id: 1, type: 'bot', text: "Hello! I'm Eco-AI. How can I help you recycle today?" }
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  useEffect(() => scrollToBottom(), [messages, isTyping, isOpen]);

  // --- TYPEWRITER LOGIC ---
  useEffect(() => {
    if (!isOpen) return;
    const typeSpeed = isDeleting ? 50 : 100;
    const handleType = () => {
      const fullWord = words[currentWordIndex];
      if (isDeleting) {
        setCurrentText(prev => prev.substring(0, prev.length - 1));
        if (currentText === "") { setIsDeleting(false); setCurrentWordIndex(prev => (prev + 1) % words.length); }
      } else {
        setCurrentText(fullWord.substring(0, currentText.length + 1));
        if (currentText === fullWord) { setTimeout(() => setIsDeleting(true), 2000); return; }
      }
    };
    const timer = setTimeout(handleType, typeSpeed);
    return () => clearTimeout(timer);
  }, [currentText, isDeleting, currentWordIndex, isOpen]);

  // --- ACTION HANDLER (The Engine) ---
  const handleActionClick = (action) => {
    console.log("Action Triggered:", action);
    
    // 1. Close the Chat (so user sees the new page)
    onClose();

    // 2. Perform Navigation
    switch (action) {
        case 'open-scanner':
            // Small delay to let chat close first, then open scanner
            setTimeout(() => window.dispatchEvent(new Event('open-snapsort')), 300);
            break;
        case 'book-pickup':
            navigate('/book-pickup'); // Internal Router Navigation
            break;
        case 'about-us':
            navigate('/about'); // Internal Router Navigation
            break;
        default:
            console.warn("Unknown action:", action);
    }
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;
    const userText = inputValue;
    setInputValue(""); 
    setMessages(prev => [...prev, { id: Date.now(), type: 'user', text: userText }]);
    setIsTyping(true);

    try {
        const response = await chatAboutWaste(userText, { itemName: "General Query" });
        setMessages(prev => [...prev, { id: Date.now() + 1, type: 'bot', text: response }]);
    } catch (error) {
        setMessages(prev => [...prev, { id: Date.now() + 1, type: 'bot', text: "I'm having trouble connecting." }]);
    } finally {
        setIsTyping(false);
    }
  };

  // --- CUSTOM MARKDOWN RENDERER ---
  const MarkdownComponents = {
    // Override the <a> tag
    a: ({ href, children }) => {
        // Check if it's our special "Action Link"
        if (href && href.startsWith('action:')) {
            const action = href.replace('action:', '');
            
            // Determine Icon based on action
            let Icon = ExternalLink;
            if (action === 'open-scanner') Icon = Camera;
            if (action === 'book-pickup') Icon = Truck;
            if (action === 'about-us') Icon = Info;

            return (
                <button 
                    onClick={() => handleActionClick(action)}
                    className="
                        flex items-center gap-2 px-5 py-2.5 mt-3 rounded-xl text-sm font-bold shadow-md transform transition-all 
                        bg-[#1a4032] text-white hover:bg-[#143328] hover:scale-105 active:scale-95 w-fit
                    "
                >
                    <Icon size={16} className="text-[#C3F53C]" />
                    {/* Remove the "BUTTON:" prefix from text if it exists */}
                    {String(children).replace('BUTTON: ', '')}
                </button>
            );
        }
        
        // Regular Links (Socials, External)
        return (
            <a 
                href={href} 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 font-bold text-green-700 hover:text-green-800 hover:underline decoration-2 underline-offset-2 transition-colors ml-1"
            >
                {children}
                <ExternalLink size={12} className="inline-block mb-1 opacity-70" />
            </a>
        );
    },
    p: ({node, ...props}) => <p className="mb-2 last:mb-0 leading-relaxed" {...props} />,
    ul: ({node, ...props}) => <ul className="list-disc pl-4 space-y-1 mt-1 mb-2" {...props} />,
    ol: ({node, ...props}) => <ol className="list-decimal pl-4 space-y-1 mt-1 mb-2" {...props} />,
    li: ({node, ...props}) => <li className="pl-1" {...props} />,
    strong: ({node, ...props}) => <span className="font-bold text-slate-900" {...props} />
  };

  if (!isRendered) return null;

  return createPortal(
    <div className="fixed inset-0 z-[100] flex justify-end font-sans">
      <div className={`absolute inset-0 bg-black/20 backdrop-blur-sm transition-opacity duration-500 ease-out ${isVisible ? 'opacity-100' : 'opacity-0'}`} onClick={onClose}></div>

      <div className={`relative z-10 w-full md:w-[400px] bg-white h-full shadow-2xl flex flex-col transform transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${isVisible ? 'translate-x-0' : 'translate-x-full'}`}>
        
        {/* Header */}
        <div className="p-6 bg-[#1a4032] text-white flex items-center justify-between shadow-md">
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-md border border-white/20">
                    <Bot size={20} className="text-[#C3F53C]" />
                </div>
                <div><h3 className="font-bold text-lg leading-tight">Eco-AI</h3><div className="flex items-center gap-1.5 opacity-80"><span className="w-2 h-2 rounded-full bg-[#C3F53C] animate-pulse"></span><span className="text-xs font-medium">Online</span></div></div>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors text-white/70 hover:text-white"><X size={20} /></button>
        </div>

        {/* Welcome */}
        <div className="bg-slate-50 border-b border-slate-100 p-4 text-center">
            <p className="text-slate-500 text-sm font-medium">Ask me anything about <br/><span className="text-[#1a4032] font-bold text-lg block mt-1 min-h-[1.75rem]">{currentText}</span></p>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-white scroll-smooth">
            {messages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2`}>
                    {msg.type === 'bot' && <div className="w-8 h-8 bg-[#F1FCC2] rounded-full flex items-center justify-center mr-2 mt-1 shrink-0"><Bot size={14} className="text-[#1a4032]" /></div>}
                    
                    <div className={`max-w-[85%] px-4 py-3 rounded-2xl text-sm leading-relaxed shadow-sm ${msg.type === 'user' ? 'bg-[#1a4032] text-white rounded-tr-none' : 'bg-slate-50 text-slate-800 rounded-tl-none border border-slate-200'}`}>
                        <ReactMarkdown components={MarkdownComponents}>
                            {msg.text}
                        </ReactMarkdown>
                    </div>

                    {msg.type === 'user' && <div className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center ml-2 mt-1 shrink-0"><User size={14} className="text-slate-500" /></div>}
                </div>
            ))}
            {isTyping && <div className="flex justify-start animate-in fade-in"><div className="w-8 h-8 bg-[#F1FCC2] rounded-full flex items-center justify-center mr-2 mt-1 shrink-0"><Bot size={14} className="text-[#1a4032]" /></div><div className="bg-slate-50 px-4 py-3 rounded-2xl rounded-tl-none border border-slate-200 flex items-center gap-2"><Loader2 size={14} className="animate-spin text-slate-400" /><span className="text-xs text-slate-400 font-medium">Thinking...</span></div></div>}
            <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-4 border-t border-slate-100 bg-white sticky bottom-0">
            <form onSubmit={handleSend} className="relative flex items-center gap-2">
                <input type="text" value={inputValue} onChange={(e) => setInputValue(e.target.value)} placeholder="Type your question..." disabled={isTyping} className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-full pl-5 pr-14 py-3 focus:outline-none focus:border-[#1a4032] focus:ring-1 focus:ring-[#1a4032] transition-all disabled:opacity-60" />
                <button type="submit" className="absolute right-1.5 w-10 h-10 flex items-center justify-center bg-[#C3F53C] hover:bg-[#b2e32b] rounded-full text-[#1a4032] transition-colors shadow-sm disabled:opacity-50 disabled:scale-95" disabled={!inputValue.trim() || isTyping}><Send size={18} className="ml-0.5" /></button>
            </form>
            <div className="flex justify-center mt-2 gap-2"><span className="text-[10px] text-slate-400 flex items-center gap-1"><Sparkles size={10} /> AI powered by Gemini</span></div>
        </div>

      </div>
    </div>,
    document.body
  );
};

export default EcoBotSidebar;