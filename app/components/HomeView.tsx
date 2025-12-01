
import React, { forwardRef } from "react";
import { Gallery } from "../types";

interface HomeViewProps {
    galleries: Gallery[];
    onOpenGallery: (g: Gallery) => void;
}

const HomeView = forwardRef<HTMLDivElement, HomeViewProps>(({ galleries, onOpenGallery }, ref) => {
    return (
        <div ref={ref} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8 p-0 md:p-6 max-w-[2000px] mx-auto perspective-1000">
            {/* Hero Block */}
            <div className="hero-block group relative aspect-square w-full bg-white overflow-hidden shadow-sm hover:shadow-2xl transition-shadow duration-500">
                <div className="absolute inset-0 w-full h-full overflow-hidden">
                    <img 
                        src="https://cdn.diena.lv/media/2020/02/4/large/46c5ac25f2ac.jpg" 
                        alt="Zane Balode" 
                        className="w-full h-full object-cover transition-transform duration-[1.2s] ease-[cubic-bezier(0.2,1,0.3,1)] group-hover:scale-110 opacity-90 group-hover:opacity-100" 
                    />
                    <div className="absolute inset-0 bg-white/10 group-hover:bg-transparent transition-colors duration-500" />
                </div>
                
                <div className="gallery-card-content absolute bottom-0 left-0 w-full p-6 md:p-12 z-20 pointer-events-none">
                    <div className="overflow-hidden relative h-24 md:h-32 mb-2 md:mb-4">
                        <span className="block text-7xl md:text-[10rem] font-display font-bold text-transparent stroke-text opacity-40 absolute -bottom-6 md:-bottom-10 -left-2 md:-left-4 transition-transform duration-700 ease-out group-hover:-translate-y-4">
                            2024
                        </span>
                    </div>
                    <div className="relative pl-2 border-l-2 border-[#3A3D55]/20 group-hover:border-white transition-colors duration-500">
                        <h2 className="text-3xl md:text-7xl font-display uppercase tracking-tighter mb-2 text-white group-hover:translate-x-2 transition-transform duration-500 drop-shadow-md">
                            Zane Balode
                        </h2>
                        <div className="flex items-center gap-4 text-xs md:text-sm tracking-[0.2em] text-gray-200 uppercase group-hover:text-white transition-colors drop-shadow-sm">
                            <span>Visual Artist</span>
                        </div>
                    </div>
                </div>
            </div>
            
            {galleries.map((g) => (
                <div 
                    key={g.id} 
                    onClick={() => onOpenGallery(g)}
                    data-cursor="text"
                    data-cursor-text="OPEN"
                    className="gallery-card group relative aspect-square w-full bg-white md:cursor-none cursor-pointer overflow-hidden shadow-sm hover:shadow-2xl transition-shadow duration-500"
                >
                    {/* 
                      Flip Container: This div is what GSAP Flip tracks.
                      It matches the structure of the Hero container in GalleryView.
                    */}
                    <div className="absolute inset-0 w-full h-full overflow-hidden" data-flip-id={`cover-${g.id}`}>
                        <img 
                            src={g.coverImage} 
                            alt={g.title} 
                            className="w-full h-full object-cover transition-transform duration-[1.2s] ease-[cubic-bezier(0.2,1,0.3,1)] group-hover:scale-110 opacity-90 group-hover:opacity-100" 
                        />
                         <div className="absolute inset-0 bg-white/10 group-hover:bg-transparent transition-colors duration-500" />
                    </div>
                    
                    <div className="gallery-card-content absolute bottom-0 left-0 w-full p-6 md:p-12 z-20 pointer-events-none">
                        <div className="overflow-hidden relative h-24 md:h-32 mb-2 md:mb-4">
                            <span className="block text-7xl md:text-[10rem] font-display font-bold text-transparent stroke-text opacity-40 absolute -bottom-6 md:-bottom-10 -left-2 md:-left-4 transition-transform duration-700 ease-out group-hover:-translate-y-4">
                                {g.year}
                            </span>
                        </div>
                        <div className="relative pl-2 border-l-2 border-[#3A3D55]/20 group-hover:border-white transition-colors duration-500">
                            <h2 className="text-3xl md:text-7xl font-display uppercase tracking-tighter mb-2 text-white group-hover:translate-x-2 transition-transform duration-500 drop-shadow-md">
                                {g.title}
                            </h2>
                            <div className="flex items-center gap-4 text-xs md:text-sm tracking-[0.2em] text-gray-200 uppercase group-hover:text-white transition-colors drop-shadow-sm">
                                <span>{g.artworks.length} Works</span>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
});

export default HomeView;
