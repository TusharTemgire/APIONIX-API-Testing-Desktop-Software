// renderer/components/TitleBar.jsx
"use client";

import { useEffect, useState } from 'react';
import { Minus, X, Square, Maximize2 } from 'lucide-react';
import Image from 'next/image';

export default function TitleBar() {
    const [isMaximized, setIsMaximized] = useState(false);

    useEffect(() => {
        if (window.electron) {
            window.electron.isWindowMaximized().then(setIsMaximized);

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
        <div className="flex items-center w-full h-8 bg-[#201C1C] rounded-md draggable">
            {/* App Icon and Title */}
            <div className="flex items-center pl-4 flex-1 draggable">
                <Image 
                    src="/netflix-icon.png" 
                    alt="APIONIX Icon" 
                    width={20} 
                    height={20} 
                    className="mr-2 shadow-sm"
                />
                <span className="text-green-400 text-sm font-medium tracking-wide">APIONIX</span>
            </div>

            {/* Window Controls */}
            <div className="flex items-center no-drag">
                <button 
                    onClick={handleMinimize}
                    className="h-8 w-11 flex items-center justify-center text-gray-400 hover:text-white hover:bg-[#242424] transition-all duration-150"
                >
                    <Minus size={14} />
                </button>

                <button 
                    onClick={handleMaximize}
                    className="h-8 w-11 flex items-center justify-center text-gray-400 hover:text-white hover:bg-[#242424] transition-all duration-150"
                >
                    {isMaximized ? <Square size={12} /> : <Maximize2 size={12} />}
                </button>

                <button 
                    onClick={handleClose}
                    className="h-8 w-11 flex items-center justify-center text-gray-400 hover:text-white hover:bg-red-500 transition-all duration-150"
                >
                    <X size={14} />
                </button>
            </div>
        </div>
    );
}