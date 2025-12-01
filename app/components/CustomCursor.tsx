import React, { useRef, useEffect } from "react";

const CustomCursor = () => {
    const cursorRef = useRef<HTMLDivElement>(null);
    const textRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const cursor = cursorRef.current;
        const textLabel = textRef.current;
        if (!cursor || !textLabel) return;

        // Wait for GSAP to be available
        const w = window as any;
        let cleanup: (() => void) | null = null;
        let checkInterval: NodeJS.Timeout | null = null;

        function initializeCursor() {
            if (!w.gsap || !cursor || !textLabel) return;

            const xTo = w.gsap.quickTo(cursor, "x", { duration: 0.2, ease: "power3" });
            const yTo = w.gsap.quickTo(cursor, "y", { duration: 0.2, ease: "power3" });

            const moveShape = (e: MouseEvent) => {
                xTo(e.clientX);
                yTo(e.clientY);
            };

            const onHover = (e: MouseEvent) => {
                const target = e.target as HTMLElement;
                
                // Check for buttons/links
                if (target.closest('button') || target.closest('a') || target.closest('[data-cursor="hover"]')) {
                    cursor.style.width = '60px';
                    cursor.style.height = '60px';
                    cursor.style.backgroundColor = 'transparent';
                    cursor.style.border = '1px solid white';
                    cursor.style.mixBlendMode = 'normal';
                    textLabel.textContent = '';
                } 
                // Check for images/text triggers
                else if (target.closest('[data-cursor="text"]')) {
                    const el = target.closest('[data-cursor="text"]');
                    const text = el?.getAttribute('data-cursor-text') || 'VIEW';
                    
                    cursor.style.width = '100px';
                    cursor.style.height = '100px';
                    cursor.style.backgroundColor = 'white';
                    cursor.style.border = 'none';
                    cursor.style.mixBlendMode = 'difference';
                    textLabel.textContent = text;
                } 
                // Default
                else {
                    cursor.style.width = '12px';
                    cursor.style.height = '12px';
                    cursor.style.backgroundColor = 'white';
                    cursor.style.border = 'none';
                    cursor.style.mixBlendMode = 'difference';
                    textLabel.textContent = '';
                }
            };

            window.addEventListener("mousemove", moveShape);
            window.addEventListener("mouseover", onHover);

            cleanup = () => {
                window.removeEventListener("mousemove", moveShape);
                window.removeEventListener("mouseover", onHover);
            };
        }

        if (!w.gsap) {
            // Retry after a short delay if GSAP isn't loaded yet
            checkInterval = setInterval(() => {
                if (w.gsap) {
                    if (checkInterval) clearInterval(checkInterval);
                    initializeCursor();
                }
            }, 50);
        } else {
            initializeCursor();
        }

        return () => {
            if (checkInterval) clearInterval(checkInterval);
            if (cleanup) cleanup();
        };
    }, []);

    return (
        <div 
            ref={cursorRef} 
            className="hidden md:flex fixed top-0 left-0 w-3 h-3 bg-white rounded-full pointer-events-none z-[9999] items-center justify-center -translate-x-1/2 -translate-y-1/2 overflow-hidden transition-[width,height,background-color,border] duration-300"
        >
            <span ref={textRef} className="text-black font-bold text-[10px] tracking-widest uppercase" />
        </div>
    );
};

export default CustomCursor;
