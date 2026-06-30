import React from "react";
import { ArrowUp, Instagram, Youtube, MapPin } from "lucide-react";
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
    <footer className="bg-[#F7F8F1] pb-14 pt-8 border-t border-neutral-200/20">
      <div className="max-w-7xl mx-auto px-6">

        {/* Multi-column Grid Layout (3 columns) */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 lg:gap-12 pb-10 border-b border-neutral-200/50 items-start">

          {/* Column 1: Logo, Slogan & Founder Details (4 cols) */}
          <div className="md:col-span-4 space-y-4">
            <a href="#hero" onClick={scrollToTop} className="flex items-center select-none group w-fit">
              <img
                src={logo}
                alt="Aravinth Photography Logo"
                className="h-12 w-12 rounded-full bg-white object-cover p-1 border border-neutral-200/50 shadow-sm transition-opacity group-hover:opacity-85"
              />
            </a>
            <div className="space-y-1">
              <h3 className="font-serif text-base font-semibold text-neutral-800">
                Aravinth Photography
              </h3>
              <p className="font-serif italic text-xs text-neutral-400">
                "Creating Your Memories"
              </p>
            </div>
            <div className="pt-2 border-t border-neutral-200/40 w-2/3">
              <span className="text-[9px] uppercase tracking-widest font-semibold text-neutral-400 block mb-0.5">
                Founded by
              </span>
              <span className="font-serif italic text-sm text-[#2F4F2F] font-semibold tracking-wide block">
                Aravinth
              </span>
            </div>
          </div>

          {/* Column 2: Studio Location(s) (5 cols) */}
          <div className="md:col-span-5 space-y-3">
            <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#2F4F2F] block">
              Studio Location{contactInfo.addresses && contactInfo.addresses.length > 1 ? "s" : ""}
            </span>
            <div className="space-y-3.5 text-xs text-neutral-600 font-medium">
              {contactInfo.addresses && contactInfo.addresses.length > 0 ? (
                contactInfo.addresses.map((addr, idx) => (
                  <div key={idx} className="flex gap-2.5 items-start leading-relaxed">
                    <MapPin size={13} className="text-[#2F4F2F] shrink-0 mt-0.5" />
                    <span>{addr}</span>
                  </div>
                ))
              ) : (
                contactInfo.address && (
                  <div className="flex gap-2.5 items-start leading-relaxed">
                    <MapPin size={13} className="text-[#2F4F2F] shrink-0 mt-0.5" />
                    <span>{contactInfo.address}</span>
                  </div>
                )
              )}
            </div>
          </div>

          {/* Column 3: Social Portals (3 cols) */}
          <div className="md:col-span-3 space-y-3">
            <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#2F4F2F] block">
              Social Portals
            </span>
            <div className="flex gap-3">
              {contactInfo.instagram && (
                <a
                  href={contactInfo.instagram}
                  target="_blank"
                  rel="noreferrer"
                  className="p-2.5 bg-white hover:bg-[#2F4F2F] hover:text-white rounded-xl border border-neutral-200/50 shadow-sm text-[#2F4F2F] transition-all duration-300"
                >
                  <Instagram size={14} />
                </a>
              )}
              {contactInfo.youtube && (
                <a
                  href={contactInfo.youtube}
                  target="_blank"
                  rel="noreferrer"
                  className="p-2.5 bg-white hover:bg-[#2F4F2F] hover:text-white rounded-xl border border-neutral-200/50 shadow-sm text-[#2F4F2F] transition-all duration-300"
                >
                  <Youtube size={14} />
                </a>
              )}
            </div>
          </div>

        </div>

        {/* Bottom Copyright & Back to Top */}
        <div className="flex flex-col sm:flex-row items-center justify-between pt-8 gap-4">
          <div className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest text-center sm:text-left space-y-1">
            <p>© 2026 Aravinth Photography. All Rights Reserved.</p>
            <p className="text-[9px] font-medium text-neutral-400 lowercase tracking-wider">
              designed with ❤️ for preserving beautiful memories.
            </p>
          </div>

          <button
            onClick={scrollToTop}
            className="flex items-center space-x-2.5 px-4.5 py-2.5 rounded-full border border-neutral-200 hover:border-[#2F4F2F]/20 hover:bg-white text-neutral-500 hover:text-[#2F4F2F] text-[9px] font-semibold uppercase tracking-widest transition-all duration-300 focus:outline-none cursor-pointer"
          >
            <span>Back to top</span>
            <ArrowUp size={10} />
          </button>
        </div>

      </div>
    </footer>
  );
}
