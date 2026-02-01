import React from 'react';
import { Pill, Rocket } from '@phosphor-icons/react';

const Header = () => {
    return (
        <header className="flex flex-col items-center mb-12 relative px-4 pt-8">
            <div className="flex flex-col items-center gap-4 relative z-10">
                <div className="bg-white p-6 rounded-[2rem] shadow-2xl border border-slate-100 flex items-center justify-center transform hover:rotate-3 transition-transform duration-500">
                    <div className="text-[#0d9488]">
                        {/* Using 100px instead of 110px and adding a safety check if Pill fails */}
                        {Pill ? <Pill size={100} weight="duotone" /> : "💊"}
                    </div>
                </div>

                <div className="text-center">
                    <h1 className="text-5xl md:text-7xl font-black text-[#0f172a] tracking-tight mb-2 font-['Playfair_Display']">
                        Arogyam
                    </h1>
                    <div className="flex items-center justify-center gap-2">
                        <span className="w-2.5 h-2.5 bg-[#4ade80] rounded-full animate-pulse"></span>
                        <span className="text-[#64748b] text-xl font-medium flex items-center gap-2">
                            {Rocket ? <Rocket size={24} weight="fill" className="text-pink-400" /> : "🚀"}
                            Connected Care
                        </span>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
