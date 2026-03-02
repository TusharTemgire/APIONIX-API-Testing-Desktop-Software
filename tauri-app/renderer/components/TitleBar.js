// renderer/components/TitleBar.js
"use client";

import { useEffect, useState } from 'react';
import { Minus, X, Square, Maximize2 } from 'lucide-react';
import { getCurrentWindow } from '@tauri-apps/api/window';

export default function TitleBar() {
    const [isMaximized, setIsMaximized] = useState(false);

    useEffect(() => {
        const appWindow = getCurrentWindow();
        appWindow.isMaximized().then(setIsMaximized);

        let unlisten;
        appWindow.onResized(() => {
            appWindow.isMaximized().then(setIsMaximized);
        }).then(u => unlisten = u);

        return () => {
            if (unlisten) unlisten();
        };
    }, []);

    const handleMinimize = () => {
        getCurrentWindow().minimize();
    };

    const handleMaximize = () => {
        getCurrentWindow().toggleMaximize();
    };

    const handleClose = () => {
        getCurrentWindow().close();
    };

    return (
        <div data-tauri-drag-region className="flex items-center w-full h-8 bg-[#201C1C] rounded-md select-none">
            {/* App Icon and Title */}
            <div data-tauri-drag-region className="flex items-center pl-1 flex-1 select-none pointer-events-none">
                {/* <Image 
                    src="/netflix-icon.png" 
                    alt="APIONIX Icon" 
                    width={20} 
                    height={20} 
                    className="mr-2 shadow-sm"
                /> */}
                <div className="mr-1 px-0.5 py-0.5 border border-green-400/20 rounded-md shadow-sm">
                    <img src="/tronix-icon.png" alt="APIONIX Icon" className="w-[20px] h-[20px] rounded-sm object-contain" />
                </div>
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