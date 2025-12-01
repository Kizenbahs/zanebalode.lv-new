
import React, { useRef, useLayoutEffect } from "react";
import { X, ArrowUpRight } from "lucide-react";

interface AboutOverlayProps {
    isOpen: boolean;
    onClose: () => void;
}

const ContactItem = ({ label, value, href }: { label: string, value: string, href: string }) => (
    <a 
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="contact-item group flex items-baseline justify-between border-b border-gray-300 py-4 hover:pl-2 transition-all duration-300 cursor-pointer"
        data-cursor="hover"
    >
        <span className="text-xs font-bold uppercase tracking-widest text-gray-500 group-hover:text-[#8FA3D5] transition-colors">{label}</span>
        <div className="flex items-center gap-2">
            <span className="text-lg md:text-xl font-medium text-[#3A3D55] group-hover:text-black transition-colors">{value}</span>
            <ArrowUpRight size={16} className="text-gray-400 group-hover:text-[#8FA3D5] group-hover:-translate-y-1 group-hover:translate-x-1 transition-all duration-300" />
        </div>
    </a>
);

const AboutOverlay = ({ isOpen, onClose }: AboutOverlayProps) => {
    const overlayRef = useRef<HTMLDivElement>(null);
    const leftPanelRef = useRef<HTMLDivElement>(null);
    const rightPanelRef = useRef<HTMLDivElement>(null);
    const imageRef = useRef<HTMLImageElement>(null);
    
    useLayoutEffect(() => {
        const gsap = (window as any).gsap;
        const overlay = overlayRef.current;
        const leftPanel = leftPanelRef.current;
        const rightPanel = rightPanelRef.current;
        const image = imageRef.current;

        if (!overlay || !leftPanel || !rightPanel || !image) return;

        // ANIMATION LOGIC:
        // We use fromTo logic extensively to ensure that no matter what state the element
        // was in (mid-animation, closed, open), it always animates from a specific state
        // to the desired state. This is more robust than .to() calls which rely on current computed styles.
        
        if (isOpen) {
            // --- OPEN ---
            
            // 1. Ensure container is visible
            gsap.set(overlay, { zIndex: 200, autoAlpha: 1 });
            
            // 2. Animate Panels IN
            gsap.fromTo(leftPanel, 
                { yPercent: -100 }, 
                { yPercent: 0, duration: 1.2, ease: "power4.inOut" }
            );
            
            gsap.fromTo(rightPanel, 
                { yPercent: 100 }, 
                { yPercent: 0, duration: 1.2, ease: "power4.inOut" }
            );

            // 3. Image Reveal
            gsap.fromTo(image,
                { scale: 1.4, filter: "grayscale(100%)" },
                { scale: 1.1, filter: "grayscale(0%)", duration: 1.5, delay: 0.4, ease: "power2.out" }
            );

            // 4. Close Button
            gsap.fromTo(".close-btn", 
                { scale: 0, rotation: -90, opacity: 0 },
                { scale: 1, rotation: 0, opacity: 1, duration: 0.8, delay: 0.8, ease: "back.out(1.7)" }
            );

            // 5. Content
            gsap.fromTo(".content-stagger", 
                { y: 40, opacity: 0 }, 
                { y: 0, opacity: 1, duration: 0.8, stagger: 0.08, delay: 0.8, ease: "power2.out" }
            );

            // 6. Contact
            gsap.fromTo(".contact-item",
                { x: -20, opacity: 0 },
                { x: 0, opacity: 1, duration: 0.6, stagger: 0.1, delay: 1.2, ease: "power2.out" }
            );

        } else {
            // --- CLOSE ---
            // Only animate out if currently visible (prevents firing on initial mount)
            if (gsap.getProperty(overlay, "opacity") > 0) {
                
                // Animate Panels OUT
                gsap.to(leftPanel, { yPercent: -100, duration: 0.8, ease: "power4.inOut" });
                gsap.to(rightPanel, { yPercent: 100, duration: 0.8, ease: "power4.inOut" });
                
                // Fade out container at the end
                gsap.to(overlay, { autoAlpha: 0, duration: 0.1, delay: 0.7 });
            } else {
                gsap.set(overlay, { autoAlpha: 0 });
            }
        }

        // We do NOT revert context on cleanup here because switching 'isOpen' triggers cleanup,
        // which would instantly revert the 'Close' animation we just started.
        // Instead, we rely on the next 'useEffect' run to override animations with new .fromTo() calls.

    }, [isOpen]);

    return (
        <div 
            ref={overlayRef} 
            className="fixed inset-0 w-full h-full flex flex-col md:flex-row opacity-0 invisible"
        >
            <button 
                onClick={onClose} 
                className="close-btn fixed top-5 right-5 md:top-8 md:right-8 z-[220] text-[#3A3D55] hover:rotate-90 transition-transform duration-500 origin-center md:w-12 md:h-12 flex items-center justify-center"
                data-cursor="hover"
            >
                <X size={80} strokeWidth={1.5} />
            </button>

            {/* Left Panel - Image */}
            <div 
                ref={leftPanelRef} 
                className="w-full md:w-[45%] h-[40vh] md:h-full bg-[#E0E6F6] relative overflow-hidden"
            >
                <img 
                    ref={imageRef}
                    src="https://vetomagazine.wordpress.com/wp-content/uploads/2012/04/zane.jpg" 
                    alt="Zane Balode" 
                    className="bio-image w-full h-full object-cover opacity-90"
                />
                <div className="absolute inset-0 bg-[#3A3D55]/10 mix-blend-overlay" />
                <div className="content-stagger absolute bottom-8 left-8 text-white/80 font-mono text-xs tracking-widest hidden md:block mix-blend-difference">
                    EST. 1994 — RIGA
                </div>
            </div>

            {/* Right Panel - Content */}
            <div 
                ref={rightPanelRef} 
                className="w-full md:w-[55%] h-[60vh] md:h-full bg-white text-[#3A3D55] relative overflow-hidden flex flex-col"
            >
                {/* Scrollable container */}
                <div className="flex-1 overflow-y-auto hide-scrollbar">
                    <div className="p-8 md:p-20 lg:p-24 flex flex-col min-h-full justify-center">
                        
                        {/* Huge Typography Name */}
                        <div className="mb-12 md:mb-16 relative">
                            <h1 className="content-stagger text-[12vw] md:text-[7vw] leading-[0.85] font-display font-bold uppercase tracking-tighter text-[#3A3D55]">
                                Zane
                            </h1>
                            <h1 className="content-stagger text-[12vw] md:text-[7vw] leading-[0.85] font-display font-bold uppercase tracking-tighter text-[#B6BCE0]">
                                Balode
                            </h1>
                        </div>

                        <div className="md:grid md:grid-cols-12 gap-12">
                            {/* Main Narrative */}
                            <div className="col-span-12 lg:col-span-8 space-y-10">
                                <blockquote className="content-stagger text-xl md:text-2xl font-serif italic leading-relaxed text-[#2D3047]">
                                    "I paint to capture the silence between thoughts. The texture of a memory fading into the white noise of time."
                                </blockquote>
                                
                                <div className="content-stagger text-sm md:text-base font-light text-[#6B7090] space-y-6 leading-relaxed">
                                    <p>
                                        Zane Balode creates large-scale abstract works that operate on the boundary between chaos and control. Using a unique blend of oil, cold wax, and organic pigments, she builds architectural layers of color only to scrape them away, revealing the history of the canvas.
                                    </p>
                                    <p>
                                        Her studio, located in the deep woodlands of Northern Europe, serves as the primary inspiration for her "Roots" and "Silence" series. The harsh winters and vibrant springs dictate the tempo of her work.
                                    </p>
                                </div>
                            </div>

                            {/* Contact Section */}
                            <div className="col-span-12 lg:col-span-8 mt-12 pt-12 border-t border-gray-100">
                                <div className="flex flex-col gap-2">
                                    <ContactItem label="Phone" value="+371 29 123 456" href="tel:+37129123456" />
                                    <ContactItem label="Email" value="studio@zanebalode.com" href="mailto:studio@zanebalode.com" />
                                    <ContactItem label="Facebook" value="Zane Balode Art" href="https://facebook.com" />
                                    <ContactItem label="Instagram" value="@zanebalode" href="https://instagram.com" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AboutOverlay;
