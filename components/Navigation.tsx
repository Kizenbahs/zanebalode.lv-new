
import React, { useRef, useLayoutEffect } from "react";
import { ArrowLeft, Menu } from "lucide-react";

interface NavigationProps {
    view: "HOME" | "GALLERY";
    onBack: () => void;
    onOpenAbout: () => void;
}

const Navigation = ({ view, onBack, onOpenAbout }: NavigationProps) => {
    const navRef = useRef<HTMLDivElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);

    useLayoutEffect(() => {
        const w = window as any;
        if (!w.gsap || !w.ScrollTrigger || !navRef.current || !contentRef.current) return;

        const gsap = w.gsap;
        const ScrollTrigger = w.ScrollTrigger;
        
        // Initial State
        const nav = navRef.current;
        
        const ctx = gsap.context(() => {
            
            // 1. Morphing Animation (Full width -> Floating Pill)
            // We use a timeline linked to the first 100px of scroll
            const morphTl = gsap.timeline({
                scrollTrigger: {
                    trigger: document.body,
                    start: "top top",
                    end: "100 top",
                    scrub: true,
                }
            });

            morphTl.to(nav, {
                width: "92%",
                marginTop: "1.5rem",
                borderRadius: "9999px",
                backgroundColor: "#FFFFFF", // Solid non-transparent white
                backdropFilter: "none", // Remove blur since it is solid
                boxShadow: "0 10px 30px -10px rgba(58, 61, 85, 0.15)",
                paddingLeft: "2rem",
                paddingRight: "2rem",
                paddingTop: "0.75rem",
                paddingBottom: "0.75rem",
                duration: 0.1
            });

            // 2. Elastic Hide/Show on Scroll Direction
            let lastScrollY = 0;
            let isHidden = false;

            ScrollTrigger.create({
                trigger: document.body,
                start: "100 top", // Start logic after the morph
                end: "bottom bottom",
                onUpdate: (self: any) => {
                    const currentScrollY = self.scroll();
                    const direction = currentScrollY > lastScrollY ? 1 : -1;
                    
                    // IF Scrolling Down AND not hidden -> Hide
                    if (direction === 1 && !isHidden && currentScrollY > 100) {
                        gsap.to(nav, {
                            yPercent: -200,
                            duration: 0.6,
                            ease: "power3.inOut"
                        });
                        isHidden = true;
                    } 
                    // IF Scrolling Up AND hidden -> Show Elastically
                    else if (direction === -1 && isHidden) {
                        gsap.to(nav, {
                            yPercent: 0,
                            duration: 1.2,
                            ease: "elastic.out(1, 0.75)" // The "Cool Elastic" bounce
                        });
                        isHidden = false;
                    }

                    lastScrollY = currentScrollY;
                }
            });

        }, navRef);

        return () => ctx.revert();
    }, []);

    return (
        <div className="fixed top-0 left-0 w-full z-40 flex justify-center pointer-events-none transition-none">
            {/* 
                Animated Container 
                Starts: Full width, transparent, p-8
                Morphs to: Max-w, solid, rounded, p-3
            */}
            <nav 
                ref={navRef}
                className="w-full bg-transparent px-5 py-5 md:px-8 md:py-8 flex justify-between items-center pointer-events-auto will-change-transform"
            >
                <div 
                    ref={contentRef}
                    className="flex-1 flex justify-between items-center"
                >
                    <div 
                        className="cursor-pointer md:cursor-none group flex items-center gap-4 text-[#3A3D55] hover:text-black transition-colors" 
                        onClick={() => view === "GALLERY" && onBack()}
                        data-cursor="hover"
                    >
                        <div className="flex flex-col">
                            <h1 className="text-xl md:text-2xl font-bold tracking-tighter font-display">
                                ZANE BALODE
                            </h1>
                        </div>
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
                        <button 
                            onClick={onOpenAbout} 
                            data-cursor="hover"
                            className="group flex items-center justify-center text-[#3A3D55] hover:text-black transition-transform hover:scale-110 active:scale-95 duration-300"
                            aria-label="Menu"
                        >
                            <Menu size={40} strokeWidth={1.5} className="md:w-12 md:h-12" />
                        </button>
                    </div>
                </div>
            </nav>
        </div>
    );
};

export default Navigation;
