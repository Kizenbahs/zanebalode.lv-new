
import React from "react";
import { ArrowLeft } from "lucide-react";

interface NavigationProps {
    view: "HOME" | "GALLERY";
    onBack: () => void;
}

const Navigation = ({ view, onBack }: NavigationProps) => {
    return (
        <div className="fixed top-0 left-0 w-full z-40 flex justify-center pointer-events-none">
            <nav className="w-full bg-transparent px-5 py-5 md:px-8 md:py-8 flex justify-between items-center pointer-events-auto">
                <div className="flex-1 flex justify-between items-center">
                    <div 
                        className="cursor-pointer md:cursor-none group flex items-center gap-4 text-[#3A3D55] hover:text-black transition-colors" 
                        onClick={() => view === "GALLERY" && onBack()}
                        data-cursor="hover"
                    >
                    </div>
                    
                    <div className="flex items-center gap-4 md:gap-6">
                        {view === "GALLERY" && (
                            <button onClick={onBack} data-cursor="hover" className="group flex items-center gap-3 text-xs md:text-sm uppercase tracking-widest text-[#6B7090] hover:text-[#3A3D55] transition-colors">
                                <div className="p-2 border border-[#6B7090]/30 rounded-full group-hover:bg-[#3A3D55] group-hover:text-white transition-all duration-300">
                                    <ArrowLeft size={14} />
                                </div>
                                <span className="hidden md:inline">Back to Collections</span>
                            </button>
                        )}
                    </div>
                </div>
            </nav>
        </div>
    );
};

export default Navigation;
