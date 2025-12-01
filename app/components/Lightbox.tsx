import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, X, Loader2 } from "lucide-react";
import { Artwork } from "../types";

interface LightboxProps {
    artworks: Artwork[];
    initialIndex: number;
    onClose: () => void;
}

const Lightbox = ({ artworks, initialIndex, onClose }: LightboxProps) => {
    const [currentIndex, setCurrentIndex] = useState(initialIndex);
    const [isLoaded, setIsLoaded] = useState(false);
    
    const currentArt = artworks[currentIndex];

    // Reset loading state when index changes
    useEffect(() => {
        setIsLoaded(false);
    }, [currentIndex]);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "ArrowRight") handleNext();
            if (e.key === "ArrowLeft") handlePrev();
            if (e.key === "Escape") onClose();
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, []); // eslint-disable-line

    const handleNext = (e?: React.MouseEvent) => {
        e?.stopPropagation();
        setCurrentIndex((prev) => (prev + 1) % artworks.length);
    };

    const handlePrev = (e?: React.MouseEvent) => {
        e?.stopPropagation();
        setCurrentIndex((prev) => (prev - 1 + artworks.length) % artworks.length);
    };

    return (
        <div className="fixed inset-0 z-[150] bg-black/95 flex items-center justify-center backdrop-blur-md">
            
            {/* Top Bar */}
            <div className="absolute top-0 left-0 w-full p-6 flex justify-between items-start z-30">
                 <div className="text-white/80">
                     <h3 className="text-xl font-display uppercase tracking-wider">{currentArt.title}</h3>
                     <p className="text-xs font-mono text-white/40 mt-1">
                         {currentIndex + 1} / {artworks.length}
                     </p>
                 </div>
                 <button 
                    onClick={onClose}
                    className="p-2 hover:rotate-90 transition-transform duration-300 text-white"
                    data-cursor="hover"
                 >
                    <X size={32} />
                 </button>
            </div>

            {/* Navigation Buttons */}
            <button 
                onClick={handlePrev}
                className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 p-4 z-20 text-white/30 hover:text-white transition-colors hidden md:block"
                data-cursor="hover"
            >
                <ChevronLeft size={48} />
            </button>

            <button 
                onClick={handleNext}
                className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 p-4 z-20 text-white/30 hover:text-white transition-colors hidden md:block"
                data-cursor="hover"
            >
                <ChevronRight size={48} />
            </button>

            {/* Mobile Touch Areas */}
            <div className="md:hidden absolute left-0 top-0 bottom-0 w-1/4 z-10" onClick={handlePrev} />
            <div className="md:hidden absolute right-0 top-0 bottom-0 w-1/4 z-10" onClick={handleNext} />

            {/* Image Container */}
            <div className="w-full h-full flex items-center justify-center p-4 md:p-20 pointer-events-none relative">
                 
                 {/* Loading Indicator */}
                 {!isLoaded && (
                     <div className="absolute inset-0 flex items-center justify-center z-0">
                         <Loader2 className="w-8 h-8 text-white/40 animate-spin" />
                     </div>
                 )}

                 <img 
                    key={currentArt.id} // Force remount on change to reset visual state
                    src={currentArt.src} 
                    alt={currentArt.title} 
                    onLoad={() => setIsLoaded(true)}
                    className={`
                        max-w-full max-h-[85vh] object-contain shadow-2xl pointer-events-auto select-none 
                        transition-all duration-700 ease-out z-10
                        ${isLoaded ? 'opacity-100 scale-100 blur-0' : 'opacity-0 scale-95 blur-sm'}
                    `}
                 />
            </div>
        </div>
    );
};

export default Lightbox;