
import React from "react";

const Footer = () => {
    return (
        <footer className="w-full py-12 border-t border-[#3A3D55]/10 bg-[#DEE2F2] relative z-20">
            <div className="flex flex-col items-center justify-center gap-4 text-center">
                <h2 className="text-xl md:text-2xl font-display font-bold tracking-tighter uppercase text-[#3A3D55]">Zane Balode</h2>
                <p className="text-xs text-[#6B7090] font-mono tracking-[0.2em]">
                    &copy; {new Date().getFullYear()} ALL RIGHTS RESERVED
                </p>
            </div>
        </footer>
    );
};

export default Footer;
