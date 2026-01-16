import React from 'react';

const PageWrapper = ({ children }) => {
  return (
    <div className="animate-page-enter w-full">
      <style>{`
        @keyframes pageEnter {
          from { 
            opacity: 0; 
            transform: translateY(20px); 
            filter: blur(4px);
          }
          to { 
            opacity: 1; 
            transform: translateY(0); 
            filter: blur(0);
          }
        }
        .animate-page-enter {
          animation: pageEnter 0.7s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>
      {children}
    </div>
  );
};

export default PageWrapper;