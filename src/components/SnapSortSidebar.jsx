import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom'; 
import { X, Bot, CheckCircle, AlertTriangle, Loader2, Send, RefreshCw, User } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { identifyWaste, chatAboutWaste } from '../services/aiService';
import imageCompression from 'browser-image-compression'; // <--- 1. IMPORT THIS

const SnapSortSidebar = ({ isOpen, onClose, image, onScanAgain }) => {
  const [currentImage, setCurrentImage] = useState(image);
  
  // "messages" now holds EVERYTHING (Images, Results, Chats)
  const [messages, setMessages] = useState([]); 
  
  // We keep "analysis" state just for the AI Context (so it knows what to answer)
  const [latestAnalysis, setLatestAnalysis] = useState(null);
  
  const [isScanning, setIsScanning] = useState(false);
  const [input, setInput] = useState("");
  const [isChatting, setIsChatting] = useState(false);
  
  const scrollRef = useRef(null);
  const fileInputRef = useRef(null); 
  const hasScannedRef = useRef(false); 
  const lastImageRef = useRef(null);

  // Sync prop image
  useEffect(() => {
    if (isOpen && image) setCurrentImage(image);
  }, [isOpen, image]);

  // Auto-scroll
  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, isScanning, isChatting]);

  // --- MAIN ANALYSIS EFFECT ---
  useEffect(() => {
    if (isOpen && currentImage) {
      // Prevent re-scanning the exact same image content
      if (hasScannedRef.current && lastImageRef.current === currentImage) return; 

      const runAnalysis = async () => {
        setIsScanning(true);
        
        hasScannedRef.current = true;
        lastImageRef.current = currentImage;

        try {
          const result = await identifyWaste(currentImage);
          setLatestAnalysis(result); // Update context for chat
          
          // PUSH THE RESULT AS A MESSAGE INTO HISTORY
          setMessages(prev => [
            ...prev, 
            { 
              role: 'scan_result', 
              image: currentImage, // Store the specific image for this result
              data: result 
            }
          ]);
          
        } catch (error) {
          console.error("Analysis failed:", error);
          // Unlock on error so they can try again
          hasScannedRef.current = false;
          lastImageRef.current = null;
          
          // Show error bubble
          setMessages(prev => [...prev, { role: 'error', text: "Could not analyze image. It might be too large or the server is busy." }]);
        } finally {
            setIsScanning(false);
        }
      };

      runAnalysis();
    }
  }, [isOpen, currentImage]);

  // --- HANDLERS ---
  const handleScanNewClick = () => {
    if (fileInputRef.current) fileInputRef.current.click();
  };

  // --- 2. UPDATED FILE HANDLER WITH COMPRESSION ---
  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
        try {
            // Compress the file BEFORE setting it to state
            const options = {
                maxSizeMB: 0.2,          // Compress to ~200KB
                maxWidthOrHeight: 800,   // Resize to max 800px
                useWebWorker: true,
            };
            
            const compressedFile = await imageCompression(file, options);

            // Convert Compressed file to Base64 to display and send
            const reader = new FileReader();
            reader.onloadend = () => {
                setCurrentImage(reader.result); // This triggers the useEffect above
            };
            reader.readAsDataURL(compressedFile);

        } catch (error) {
            console.error("Compression Error:", error);
            // Fallback: If compression fails, try the original file
            const reader = new FileReader();
            reader.onloadend = () => setCurrentImage(reader.result);
            reader.readAsDataURL(file);
        }
    }
    event.target.value = ''; // Reset input so same file can be selected again
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || !latestAnalysis) return;
    const q = input;
    setInput(""); 
    setMessages(prev => [...prev, { role: 'user', text: q }]);
    setIsChatting(true);
    const ans = await chatAboutWaste(q, latestAnalysis);
    setMessages(prev => [...prev, { role: 'bot', text: ans }]);
    setIsChatting(false);
  };

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-[100] flex justify-end font-sans">
      <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
      <div className="absolute inset-0 bg-black/20 backdrop-blur-sm animate-in fade-in duration-300" onClick={onClose}></div>
      <div className="relative z-10 w-full md:w-[450px] bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-500">
        
        {/* HEADER */}
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-white/90 backdrop-blur-md sticky top-0 z-20">
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#1a4032] flex items-center justify-center text-[#C3F53C] shadow-sm"><Bot size={20} /></div>
                <div><h3 className="font-bold text-slate-900">Snap-Sort AI</h3><p className="text-[10px] text-green-600 font-bold uppercase tracking-wider flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>Online</p></div>
            </div>
            <div className="flex items-center gap-2">
                <button onClick={handleScanNewClick} className="flex items-center gap-2 px-4 py-2 bg-[#1a4032] hover:bg-[#143026] text-[#C3F53C] rounded-full text-xs font-bold transition-all shadow-sm hover:shadow-md active:scale-95"><RefreshCw size={14} /><span>Scan New</span></button>
                <button onClick={onClose} className="p-2 hover:bg-red-50 hover:text-red-500 rounded-full transition-colors text-slate-400"><X size={20} /></button>
            </div>
        </div>

        {/* FEED (Timeline) */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-5 space-y-6 bg-slate-50/50 scroll-smooth">
            
            {messages.map((msg, index) => {
                
                // 1. SCAN RESULT (Image + Card)
                if (msg.role === 'scan_result') {
                    const analysis = msg.data;
                    return (
                        <div key={index} className="flex flex-col gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500 mb-6">
                            {/* The Image */}
                            <div className="flex flex-col items-end gap-2">
                                <div className="w-[70%] bg-white p-1.5 rounded-2xl rounded-tr-none shadow-sm border border-slate-200">
                                    <img src={msg.image} alt="Scanned" className="w-full h-auto rounded-xl" />
                                </div>
                                <span className="text-[10px] text-slate-400 font-medium mr-2">You • Scanned Image</span>
                            </div>

                            {/* The Result Card */}
                            <div className="flex flex-col items-start gap-2">
                                <div className="w-8 h-8 rounded-full bg-[#1a4032] flex items-center justify-center text-[#C3F53C] mb-1"><Bot size={16} /></div>
                                <div className="w-[95%] bg-white rounded-2xl rounded-tl-none shadow-lg overflow-hidden border border-slate-100 ring-1 ring-slate-100">
                                    <div className={`px-5 py-4 border-b flex items-center gap-3 ${analysis.isRecyclable ? 'bg-green-50/80 border-green-100' : 'bg-orange-50/80 border-orange-100'}`}>
                                        {analysis.isRecyclable ? <CheckCircle className="text-green-600 shrink-0" size={22} /> : <AlertTriangle className="text-orange-600 shrink-0" size={22} />}
                                        <div><h4 className={`font-bold text-sm ${analysis.isRecyclable ? 'text-green-900' : 'text-orange-900'}`}>{analysis.itemName}</h4><p className={`text-[10px] font-medium uppercase tracking-wide ${analysis.isRecyclable ? 'text-green-700' : 'text-orange-700'}`}>{analysis.isRecyclable ? "Recyclable" : "Non-Recyclable"} • {analysis.confidence}% Match</p></div>
                                    </div>
                                    <div className="p-5 space-y-4"><p className="text-sm text-slate-600 leading-relaxed">{analysis.reasoning}</p>{analysis.handlingTips?.length > 0 && <div className="bg-slate-50 rounded-xl p-4 border border-slate-100"><h5 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-3">Recycling Guidelines</h5><ul className="space-y-2">{analysis.handlingTips.map((tip, idx) => <li key={idx} className="flex items-start gap-2 text-xs text-slate-600"><div className="min-w-[4px] h-[4px] rounded-full bg-green-500 mt-1.5"></div><span>{tip}</span></li>)}</ul></div>}</div>
                                </div>
                            </div>
                        </div>
                    );
                }

                // 2. ERROR MESSAGE
                if (msg.role === 'error') {
                    return (
                        <div key={index} className="flex flex-col items-start gap-2 animate-in fade-in">
                            <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center text-red-600 mb-1"><AlertTriangle size={16} /></div>
                            <div className="bg-white px-5 py-4 rounded-2xl rounded-tl-none shadow-sm border border-red-100 text-red-600 text-sm">{msg.text}</div>
                        </div>
                    );
                }

                // 3. NORMAL CHAT (User/Bot)
                return (
                    <div key={index} className={`flex gap-2 ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2`}>
                        {msg.role === 'bot' && <div className="w-8 h-8 rounded-full bg-[#1a4032] flex items-center justify-center text-[#C3F53C] shrink-0"><Bot size={16} /></div>}
                        <div className={`max-w-[80%] px-4 py-3 rounded-2xl text-sm leading-relaxed shadow-sm ${msg.role === 'user' ? 'bg-[#1a4032] text-white rounded-tr-none' : 'bg-white border border-slate-200 text-slate-700 rounded-tl-none'}`}>
                            <ReactMarkdown components={{ ul: ({node, ...props}) => <ul className="list-disc pl-4 space-y-1 mt-2" {...props} />, ol: ({node, ...props}) => <ol className="list-decimal pl-4 space-y-1 mt-2" {...props} />, li: ({node, ...props}) => <li className="pl-1" {...props} />, p: ({node, ...props}) => <p className="mb-1 last:mb-0" {...props} />, strong: ({node, ...props}) => <span className="font-bold" {...props} /> }}>
                                {msg.text}
                            </ReactMarkdown>
                        </div>
                        {msg.role === 'user' && <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 shrink-0"><User size={16} /></div>}
                    </div>
                );
            })}

            {/* LOADING STATES */}
            {isScanning && (
                 <div className="flex flex-col items-start gap-2 animate-in fade-in mt-6">
                    <div className="w-8 h-8 rounded-full bg-[#1a4032] flex items-center justify-center text-[#C3F53C] mb-1"><Bot size={16} /></div>
                    <div className="bg-white px-5 py-4 rounded-2xl rounded-tl-none shadow-sm border border-slate-100 text-slate-600 text-sm flex items-center gap-3">
                         <Loader2 className="animate-spin text-green-600" size={18} />
                         <span>Identifying object...</span>
                    </div>
                </div>
            )}
            
            {isChatting && (
                <div className="flex gap-2 animate-in fade-in">
                    <div className="w-8 h-8 rounded-full bg-[#1a4032] flex items-center justify-center text-[#C3F53C]"><Bot size={16} /></div>
                    <div className="bg-slate-100 px-4 py-2 rounded-full border border-slate-200"><Loader2 className="animate-spin text-slate-400" size={16} /></div>
                </div>
            )}
            
            <div className="h-4"></div>
        </div>

        {/* FOOTER */}
        <form onSubmit={handleSend} className="p-4 border-t border-slate-100 bg-white sticky bottom-0">
             <div className="relative flex items-center shadow-sm rounded-xl">
                <input type="text" value={input} onChange={(e) => setInput(e.target.value)} placeholder={latestAnalysis ? "Ask a follow-up question..." : "Waiting for result..."} disabled={!latestAnalysis || isChatting || isScanning} className="w-full pl-4 pr-12 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#1a4032] focus:border-transparent transition-all disabled:opacity-60 placeholder:text-slate-400" />
                <button type="submit" disabled={!input.trim() || !latestAnalysis || isChatting || isScanning} className="absolute right-2 p-2 bg-[#1a4032] text-white rounded-lg hover:bg-[#143026] disabled:opacity-0 disabled:scale-90 transition-all shadow-sm"><Send size={16} /></button>
             </div>
        </form>
      </div>
    </div>,
    document.body
  );
};

export default SnapSortSidebar;