// renderer/components/TitleBar.jsx
"use client";

import { useEffect, useState } from 'react';
import { Minus, X, Square, Maximize2 } from 'lucide-react';

export default function TitleBar() {
  const [isMaximized, setIsMaximized] = useState(false);
  
  useEffect(() => {
    // Initialize maximized state
    if (window.electron) {
      window.electron.isWindowMaximized().then(setIsMaximized);
      
      // Listen for changes to maximized state
      const cleanup = window.electron.onWindowMaximizedChange((maximized) => {
        setIsMaximized(maximized);
      });
      
      return cleanup;
    }
  }, []);
  
  const handleMinimize = () => {
    if (window.electron) {
      window.electron.minimizeWindow();
    }
  };
  
  const handleMaximize = () => {
    if (window.electron) {
      window.electron.maximizeWindow().then(setIsMaximized);
    }
  };
  
  const handleClose = () => {
    if (window.electron) {
      window.electron.closeWindow();
    }
  };
  
  return (
    <div className="flex items-center h-9 bg-[#201C1C] border-b border-gray-600/20 draggable">
      {/* App Icon and Title */}
      <div className="flex items-center pl-3 flex-1 draggable">
        <div className="w-4 h-4 bg-[#73DC8C] rounded-sm mr-2"></div>
        <span className="text-white/70 text-xs font-medium">APIONIX</span>
      </div>
      
      {/* Window Controls */}
      <div className="flex items-center no-drag">
        <button 
          onClick={handleMinimize}
          className="h-9 w-12 flex items-center justify-center text-white/50 hover:bg-white/10 transition-colors"
        >
          <Minus size={16} />
        </button>
        
        <button 
          onClick={handleMaximize}
          className="h-9 w-12 flex items-center justify-center text-white/50 hover:bg-white/10 transition-colors"
        >
          {isMaximized ? <Square size={14} /> : <Maximize2 size={14} />}
        </button>
        
        <button 
          onClick={handleClose}
          className="h-9 w-12 flex items-center justify-center text-white/50 hover:bg-red-500/80 transition-colors"
        >
          <X size={18} />
        </button>
      </div>
    </div>
  );
}