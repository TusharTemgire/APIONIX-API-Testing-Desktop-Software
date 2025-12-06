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
            <div className="flex items-center pl-1 flex-1 draggable">
                {/* <Image 
                    src="/netflix-icon.png" 
                    alt="APIONIX Icon" 
                    width={20} 
                    height={20} 
                    className="mr-2 shadow-sm"
                /> */}
                <div className="mr-1 px-1 py-0.5 border border-green-400/30 rounded-md shadow-sm">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <g clipPath="url(#clip0_4418_6503)">
                            <path opacity="0.4" d="M16.1599 10C16.1599 10 16.0099 11 12.9099 15C9.9999 18.77 14.2099 21.64 14.7099 21.97C14.7399 21.99 14.7699 21.99 14.8099 21.97C15.4899 21.55 23.0599 16.68 16.1599 10Z" stroke="#fff" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M13.7598 7.79006C13.7598 5.49006 12.8598 3.39006 11.9598 2.19006C11.6598 1.89006 11.1598 1.99006 11.0598 2.39006C10.6598 3.89006 9.45977 7.09006 6.55977 10.8901C2.85977 15.6901 6.25978 20.8901 9.75978 21.8901C11.6598 22.3901 9.25979 20.8901 8.95979 17.7901C8.65979 13.8901 13.7598 10.9901 13.7598 7.79006Z" stroke="#fff" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
                        </g>
                        <defs>
                            <clipPath id="clip0_4418_6503">
                                <rect width="24" height="24" fill="white" />
                            </clipPath>
                        </defs>
                    </svg>
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