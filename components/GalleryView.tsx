
import React, { forwardRef, useState, useEffect, useRef, useLayoutEffect } from "react";
import { Gallery, Artwork } from "../types";
import { ArrowDown, ArrowRight } from "lucide-react";

interface GalleryViewProps {
    gallery: Gallery;
    nextGallery: Gallery | null;
    onOpenLightbox: (index: number) => void;
    onOpenGallery: (g: Gallery) => void;
}

interface LazyArtworkProps {
    art: Artwork;
    onClick: () => void;
    index: number;
}

const LazyArtwork: React.FC<LazyArtworkProps> = ({ art, onClick, index }) => {
    const [isVisible, setIsVisible] = useState(false);
    const [isLoaded, setIsLoaded] = useState(false);
    const elementRef = useRef<HTMLDivElement>(null);
    const imgRef = useRef<HTMLImageElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    observer.disconnect();
                }
            },
            { rootMargin: "50%" } // Start loading when image is within 50% viewport height away
        );

        if (elementRef.current) {
            observer.observe(elementRef.current);
        }

        return () => observer.disconnect();
    }, []);

    // Parallax Effect
    useLayoutEffect(() => {
        if (!isVisible || !isLoaded || !elementRef.current || !imgRef.current) return;
        
        const w = window as any;
        if (!w.gsap || !w.ScrollTrigger) return;

        const ctx = w.gsap.context(() => {
            w.gsap.fromTo(imgRef.current, 
                { yPercent: -10 },
                {
                    yPercent: 10,
                    ease: "none",
                    scrollTrigger: {
                        trigger: elementRef.current,
                        start: "top bottom",
                        end: "bottom top",
                        scrub: true
                    }
                }
            );
        }, elementRef);

        return () => ctx.revert();
    }, [isVisible, isLoaded]);

    // Calculate inverse ratio for CSS aspect-ratio (width / height)
    // art.heightRatio is height / width
    const aspectRatio = 1 / art.heightRatio;

    return (
        <div 
            ref={elementRef}
            className="artwork-item break-inside-avoid relative mb-1 w-full md:cursor-none cursor-pointer group overflow-hidden bg-[#D8DCE8]"
            style={{ aspectRatio: aspectRatio }}
            onClick={onClick}
            data-cursor="text"
            data-cursor-text="VIEW"
        >
            {isVisible && (
                <>
                    <div className="absolute inset-0 w-full h-full overflow-hidden">
                        <img 
                            ref={imgRef}
                            src={art.thumbnail} 
                            alt={art.title} 
                            onLoad={() => setIsLoaded(true)}
                            className={`w-full h-[120%] -mt-[10%] object-cover transition-opacity duration-1000 ease-out 
                                ${isLoaded ? 'opacity-90 md:opacity-100' : 'opacity-0'}
                            `} 
                        />
                    </div>
                    <div className="hidden md:flex absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 items-center justify-center backdrop-blur-[1px]">
                        {/* Interaction handled by cursor overlay */}
                    </div>
                </>
            )}
        </div>
    );
};

const GalleryView = forwardRef<HTMLDivElement, GalleryViewProps>(({ gallery, nextGallery, onOpenLightbox, onOpenGallery }, ref) => {
    return (
        <div ref={ref} className="w-full">
            
            {/* HERO SECTION FOR FLIP TRANSITION */}
            <div className="relative w-full h-[60vh] md:h-[85vh] overflow-hidden mb-12 md:mb-20">
                {/* 
                   Target for Flip Transition.
                   Must match the 'absolute inset-0' structure of the source in HomeView 
                */}
                <div className="absolute inset-0 w-full h-full" data-flip-id={`cover-${gallery.id}`}>
                     <img 
                        src={gallery.coverImage} 
                        alt="Hero Cover" 
                        className="w-full h-full object-cover"
                     />
                     <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-[#E6E9F2]" />
                </div>

                {/* Header Content Overlay */}
                <div className="absolute bottom-0 left-0 w-full p-6 md:p-12 z-20 gallery-header-text max-w-[2000px] mx-auto left-0 right-0">
                     <div className="relative border-l-2 border-[#3A3D55]/40 pl-6 md:pl-10">
                        <h2 className="text-[8vw] md:text-[5vw] leading-[0.8] font-display font-bold text-[#3A3D55] mix-blend-multiply mb-4">
                            {gallery.title}
                        </h2>
                        <div className="gallery-header-meta flex flex-col md:flex-row md:items-center gap-4 md:gap-8 text-sm md:text-base tracking-widest uppercase text-[#6B7090]">
                            <span className="px-3 py-1 border border-[#6B7090]/30 rounded-full bg-white/40 backdrop-blur-sm">
                                {gallery.year} Collection
                            </span>
                            <span>{gallery.artworks.length} Artworks</span>
                        </div>
                     </div>
                </div>

                {/* Scroll Hint */}
                <div className="scroll-hint absolute bottom-8 left-1/2 -translate-x-1/2 z-20 text-[#3A3D55]/50 mix-blend-multiply opacity-0">
                    <ArrowDown className="animate-bounce" size={32} strokeWidth={1} />
                </div>
            </div>

            <div className="max-w-[2000px] mx-auto px-2 md:px-6">
                <div className="mb-16 md:mb-24 px-4 gallery-description">
                     <p className="max-w-2xl text-[#5A5E75] leading-relaxed text-sm md:text-lg font-light">
                        A curated selection of works from the {gallery.year} archive. 
                        Explorations in texture, light, and the ethereal void. Each piece represents a moment of clarity amidst the mist.
                    </p>
                </div>

                {/* Masonry Layout */}
                <div className="columns-1 md:columns-2 lg:columns-3 xl:columns-4 gap-1 space-y-1 mx-auto pb-20">
                    {gallery.artworks.map((art, index) => (
                        <LazyArtwork 
                            key={art.id}
                            art={art}
                            index={index}
                            onClick={() => onOpenLightbox(index)}
                        />
                    ))}
                </div>
            </div>

            {/* NEXT GALLERY NAVIGATOR */}
            {nextGallery && (
                <div 
                    onClick={() => onOpenGallery(nextGallery)}
                    className="w-full h-[50vh] md:h-[60vh] relative group cursor-pointer overflow-hidden border-t border-white/20"
                    data-cursor="text"
                    data-cursor-text="NEXT"
                >
                     {/* 
                       Transition Source: Adding data-flip-id here allows GSAP to seamlessly 
                       animate this image into the Hero position of the next page.
                     */}
                     <div className="absolute inset-0 w-full h-full" data-flip-id={`cover-${nextGallery.id}`}>
                        <img 
                            src={nextGallery.coverImage} 
                            alt="Next Gallery"
                            className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-all duration-1000 ease-in-out group-hover:scale-105" 
                        />
                        {/* Overlay to ensure text readability that fades out on hover */}
                        <div className="absolute inset-0 bg-[#E6E9F2]/70 group-hover:bg-[#E6E9F2]/20 transition-colors duration-1000" />
                     </div>
                     
                     <div className="absolute inset-0 flex flex-col items-center justify-center z-10 p-6 pointer-events-none">
                         <span className="text-xs font-mono tracking-[0.3em] text-[#6B7090] mb-4 group-hover:text-[#3A3D55] transition-colors duration-500">
                             NEXT COLLECTION
                         </span>
                         <h2 className="text-[6vw] font-display font-bold uppercase text-[#3A3D55] drop-shadow-sm group-hover:scale-105 transition-transform duration-700">
                             {nextGallery.title}
                         </h2>
                         <div className="mt-8 flex items-center gap-2 text-sm tracking-widest uppercase text-[#3A3D55] opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 duration-500">
                             <span>View Gallery</span>
                             <ArrowRight size={16} />
                         </div>
                     </div>
                </div>
            )}
        </div>
    );
});

export default GalleryView;
