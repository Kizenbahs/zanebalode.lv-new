
import React, { useState, useRef, useLayoutEffect, useEffect } from "react";
import { galleries } from "./lib/data";
import { Gallery } from "./types";
import CustomCursor from "./components/CustomCursor";
import AboutOverlay from "./components/AboutOverlay";
import Lightbox from "./components/Lightbox";
import Navigation from "./components/Navigation";
import Footer from "./components/Footer";
import HomeView from "./components/HomeView";
import GalleryView from "./components/GalleryView";

const App = () => {
  // Views: 'HOME' | 'GALLERY'
  const [view, setView] = useState<"HOME" | "GALLERY">("HOME");
  const [activeGallery, setActiveGallery] = useState<Gallery | null>(null);
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  
  // Track the ID of the gallery we are interacting with to ensure 
  // we can find the target element when transitioning back to Home.
  const lastGalleryIdRef = useRef<string | null>(null);

  // Lightbox State
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const isLightboxOpen = lightboxIndex !== null;

  // Refs for Animations
  const appRef = useRef<HTMLDivElement>(null);
  const flipStateRef = useRef<any>(null); // Store Flip state between renders

  // --- Initialization ---
  useEffect(() => {
    // Register GSAP plugins if available
    const w = window as any;
    if (w.gsap && w.Flip) {
      w.gsap.registerPlugin(w.Flip, w.ScrollTrigger);
    }
  }, []);

  // --- Navigation Handlers ---

  const handleOpenGallery = (gallery: Gallery) => {
    const w = window as any;
    if (!w.Flip) return;
    
    // 1. Record ID
    lastGalleryIdRef.current = gallery.id;

    // 2. Capture state of the card in Home View
    // We try/catch this to prevent crashes if selector is invalid or missing
    try {
        const selector = `[data-flip-id="cover-${gallery.id}"]`;
        const state = w.Flip.getState(selector);
        flipStateRef.current = state;
    } catch (e) {
        console.warn("GSAP Flip capture failed", e);
        flipStateRef.current = null;
    }

    // 3. Update View
    setActiveGallery(gallery);
    setView("GALLERY");
    window.scrollTo(0, 0);
  };

  const handleBackToHome = () => {
    const w = window as any;
    
    // 1. Capture state of the hero in Gallery View
    if (activeGallery && w.Flip) {
        lastGalleryIdRef.current = activeGallery.id;
        try {
            const selector = `[data-flip-id="cover-${activeGallery.id}"]`;
            const state = w.Flip.getState(selector);
            flipStateRef.current = state;
        } catch (e) {
            console.warn("GSAP Flip capture failed", e);
        }
    }

    // 2. Update View
    setActiveGallery(null);
    setView("HOME");
    window.scrollTo(0, 0);
  };

  const handleResetToHome = () => {
      setIsAboutOpen(false);
      if (view === "GALLERY") {
          handleBackToHome();
      }
  };

  // Determine next gallery for the "Next Project" navigator
  const getNextGallery = () => {
      if (!activeGallery) return null;
      const currentIndex = galleries.findIndex(g => g.id === activeGallery.id);
      if (currentIndex === -1) return null;
      // Loop back to start if at end
      const nextIndex = (currentIndex + 1) % galleries.length;
      return galleries[nextIndex];
  };

  const nextGallery = getNextGallery();

  // --- Animation Effects ---

  useLayoutEffect(() => {
    const w = window as any;
    if (!w.gsap || !w.Flip || !appRef.current) return;

    const ctx = w.gsap.context(() => {
        const Flip = w.Flip;
        const gsap = w.gsap;

        // FLIP TRANSITION
        if (flipStateRef.current) {
            // Determine target ID based on what we just clicked or where we came from
            const targetId = `[data-flip-id="cover-${lastGalleryIdRef.current}"]`;
            
            // Check if target exists in DOM before flipping
            const targetEl = document.querySelector(targetId);

            if (targetEl) {
                Flip.from(flipStateRef.current, {
                    targets: targetId,
                    duration: 1.4,
                    ease: "expo.inOut",
                    absolute: true, 
                    zIndex: 50,
                    // Note: 'scale: true' is deliberately omitted here.
                    // By animating width/height, we allow object-fit: cover to work 
                    // frame-by-frame, preventing the image from looking stretched/distorted
                    // as it changes aspect ratio from Card (3:4) to Hero (16:9).
                    onEnter: (elements: any) => {
                        return gsap.fromTo(elements, 
                            { opacity: 1 }, 
                            { opacity: 1, duration: 0 }
                        );
                    },
                    onComplete: () => {
                        flipStateRef.current = null;
                        // Refresh ScrollTrigger after layout changes
                        w.ScrollTrigger.refresh();
                    }
                });
            } else {
                flipStateRef.current = null;
            }
        }

        // CONTENT ENTRY ANIMATIONS (Staggered fade-ins for non-flipping elements)
        if (view === "HOME") {
            const cards = gsap.utils.toArray(".gallery-card");
            // Only animate if we actually found cards
            if (cards.length > 0) {
                 const nonFlippedCards = cards.filter((el: Element) => {
                    const inner = el.querySelector(`[data-flip-id="cover-${lastGalleryIdRef.current}"]`);
                    return !inner; 
                });

                if (nonFlippedCards.length > 0) {
                     gsap.fromTo(nonFlippedCards, 
                        { opacity: 0, scale: 0.95 },
                        { opacity: 1, scale: 1, duration: 0.8, stagger: 0.05, delay: 0.2, ease: "power2.out" }
                    );
                }
            }
        } else if (view === "GALLERY") {
            const tl = gsap.timeline({ delay: 0.5 }); 
            
            // Safe selection
            if (document.querySelector(".gallery-header-text h2")) {
                tl.fromTo(".gallery-header-text h2", 
                    { y: 50, opacity: 0 }, 
                    { y: 0, opacity: 1, duration: 1, ease: "power3.out" }, 0
                );
            }
            if (document.querySelector(".gallery-header-meta")) {
                tl.fromTo(".gallery-header-meta", 
                    { y: 20, opacity: 0 }, 
                    { y: 0, opacity: 1, duration: 0.8, ease: "power2.out" }, 0.2
                );
            }
            if (document.querySelector(".scroll-hint")) {
                tl.fromTo(".scroll-hint",
                    { opacity: 0, y: -10 },
                    { opacity: 1, y: 0, duration: 1, ease: "power2.out" }, 0.5
                );
            }
            if (document.querySelector(".gallery-description")) {
                tl.fromTo(".gallery-description", 
                    { opacity: 0 }, 
                    { opacity: 1, duration: 1, ease: "power2.out" }, 0.3
                );
            }
            
            const artworks = document.querySelectorAll(".artwork-item");
            if (artworks.length > 0) {
                tl.fromTo(".artwork-item", 
                    { y: 60, opacity: 0 },
                    { y: 0, opacity: 1, duration: 0.8, stagger: 0.05, ease: "power3.out" }, 0.4
                );
            }
        }

    }, appRef);
    return () => ctx.revert();
  }, [view, activeGallery]);

  return (
    <div ref={appRef} className="min-h-screen bg-[#E6E9F2] text-[#3A3D55] selection:bg-[#B6BCE0] selection:text-white overflow-hidden md:cursor-none flex flex-col">
      <CustomCursor />
      <AboutOverlay 
        isOpen={isAboutOpen} 
        onClose={handleResetToHome}
      />
      
      {/* Background Texture/Noise - Darker noise for light bg */}
      <div className="fixed inset-0 pointer-events-none z-0 opacity-[0.05]" 
           style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }} 
      />

      <Navigation 
        view={view} 
        onBack={handleBackToHome} 
        onOpenAbout={() => setIsAboutOpen(true)} 
      />

      {/* Main Content Area */}
      <main className="relative w-full flex-grow z-10">
        
        {/* HOME VIEW: Gallery Grid */}
        {view === "HOME" && (
            <div className="pt-24 md:pt-32 px-4 pb-12">
                <HomeView 
                    galleries={galleries} 
                    onOpenGallery={handleOpenGallery} 
                />
            </div>
        )}

        {/* GALLERY VIEW: Artworks Grid (Masonry) */}
        {view === "GALLERY" && activeGallery && (
            <GalleryView 
                gallery={activeGallery}
                nextGallery={nextGallery}
                onOpenLightbox={setLightboxIndex}
                onOpenGallery={handleOpenGallery}
            />
        )}
      </main>

      <Footer />

      {/* LIGHTBOX OVERLAY */}
      {isLightboxOpen && activeGallery && (
          <Lightbox 
            artworks={activeGallery.artworks}
            initialIndex={lightboxIndex}
            onClose={() => setLightboxIndex(null)}
          />
      )}

      {/* CSS Utils */}
      <style>{`
        .stroke-text {
            -webkit-text-stroke: 1px rgba(58, 61, 85, 0.2);
            color: transparent;
        }
        .perspective-1000 {
            perspective: 1000px;
        }
        @media (min-width: 768px) {
            body {
                cursor: none;
            }
        }
      `}</style>
    </div>
  );
};

export default App;
