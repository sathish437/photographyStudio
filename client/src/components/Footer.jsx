import React from "react";
import { ArrowUp, Instagram, Mail, Phone } from "lucide-react";
import logo from "../assets/logo.png";

export default function Footer({ contactInfo }) {
  const scrollToTop = (e) => {
    e.preventDefault();
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };

  return (
    <footer className="bg-[#FAF9F6] border-t border-neutral-200/50 py-10">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Main 2-Column Grid Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pb-8 border-b border-neutral-200/40 items-center">
          
          {/* Column 1: Logo & Slogan (Left aligned) */}
          <div className="space-y-3">
            <a href="#hero" onClick={scrollToTop} className="flex items-center select-none group w-fit">
              <img
                src={logo}
                alt="Aravinth Photography Logo"
                className="h-8 w-auto object-contain transition-opacity group-hover:opacity-85"
              />
            </a>
            <div className="space-y-0.5">
              <h3 className="font-serif text-base font-semibold text-neutral-800">
                Aravinth Photography
              </h3>
              <p className="font-serif italic text-xs text-neutral-400">
                "Creating Your Memories"
              </p>
            </div>
          </div>

          {/* Column 2: Social & Contact details (Right aligned) */}
          <div className="space-y-3 flex flex-col md:items-end">
            <span className="text-[10px] uppercase tracking-widest font-semibold text-neutral-400 block mb-1">
              Studio Portals
            </span>
            <div className="space-y-2 text-xs text-neutral-500 font-semibold flex flex-col md:items-end">
              {/* Instagram link */}
              <a
                href={contactInfo.instagram}
                target="_blank"
                rel="noreferrer"
                className="flex items-center space-x-1.5 hover:text-[#2F4F2F] transition-colors"
              >
                <Instagram size={13} className="text-[#2F4F2F]" />
                <span>Instagram</span>
              </a>

              {/* Email link */}
              <a
                href={`mailto:${contactInfo.email}`}
                className="flex items-center space-x-1.5 hover:text-[#2F4F2F] transition-colors"
              >
                <Mail size={13} className="text-[#2F4F2F]" />
                <span>{contactInfo.email}</span>
              </a>

              {/* Phone details */}
              <div className="flex items-center space-x-1.5 text-neutral-500">
                <Phone size={13} className="text-[#2F4F2F]" />
                <span>{contactInfo.phone} / {contactInfo.whatsapp}</span>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom copyright notice and Scroll up button */}
        <div className="flex flex-col sm:flex-row items-center justify-between pt-6 gap-4">
          <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest text-center sm:text-left">
            © {new Date().getFullYear()} Aravinth Photography. All rights reserved.
          </p>

          <button
            onClick={scrollToTop}
            className="flex items-center space-x-2.5 px-4.5 py-2.5 rounded-full border border-neutral-200 hover:border-[#2F4F2F]/25 hover:bg-[#2F4F2F]/5 text-neutral-500 hover:text-[#2F4F2F] text-[9px] font-semibold uppercase tracking-widest transition-all duration-300 focus:outline-none"
          >
            <span>Back to top</span>
            <ArrowUp size={10} />
          </button>
        </div>

      </div>
    </footer>
  );
}
