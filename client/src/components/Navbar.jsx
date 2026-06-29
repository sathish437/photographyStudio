import React, { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import logo from "../assets/logo.png";

export default function Navbar({ activeSection }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { id: "hero", label: "Home" },
    { id: "about", label: "About" },
    { id: "why-us", label: "Why Us" },
    { id: "services", label: "Services" },
    { id: "gallery", label: "Gallery" },
    { id: "contact", label: "Contact" }
  ];

  const handleNavClick = (e, id) => {
    e.preventDefault();
    setIsMobileMenuOpen(false);

    // A small timeout allows React's unmount state updates to complete,
    // avoiding interruption of smooth scroll actions in mobile engines
    setTimeout(() => {
      const element = document.getElementById(id);
      if (element) {
        const headerOffset = 80;
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth"
        });
      }
    }, 150);
  };

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
      className={`sticky top-0 z-50 transition-all duration-500 ${isScrolled
          ? "bg-[#F7F8F5]/90 backdrop-blur-md border-b border-[#2F4F2F]/10 shadow-sm"
          : "bg-gradient-to-b from-[#0D1409]/30 to-transparent border-b border-transparent backdrop-blur-[2px]"
        }`}
    >
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">

        {/* Brand Logo */}
        <a
          href="#hero"
          onClick={(e) => handleNavClick(e, "hero")}
          className="flex items-center select-none"
        >
          <motion.img
            whileHover={{ opacity: 0.8 }}
            src={logo}
            alt="Aravinth Photography Logo"
            className="h-12 w-12 md:h-14 md:w-14 rounded-full bg-white object-cover p-1.5 border border-neutral-200/50 shadow-sm"
          />
        </a>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center space-x-8">
          {navItems.map((item) => {
            const isActive = activeSection === item.id;
            return (
              <a
                key={item.id}
                href={`#${item.id}`}
                onClick={(e) => handleNavClick(e, item.id)}
                className={`relative text-xs uppercase tracking-[0.2em] font-medium transition-colors duration-300 py-2 ${isActive
                    ? isScrolled ? "text-[#2F4F2F] font-bold" : "text-[#2F4F2F] font-bold"
                    : isScrolled ? "text-neutral-500 hover:text-[#2F4F2F]" : "text-neutral-500 hover:text-[#2F4F2F]"
                  }`}
              >
                {item.label}
                {isActive && (
                  <motion.span
                    layoutId="activeNavIndicator"
                    className={`absolute bottom-0 left-0 w-full h-[1.5px] ${isScrolled ? "bg-[#2F4F2F]" : "bg-white"
                      }`}
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
              </a>
            );
          })}
        </nav>

        {/* Mobile menu trigger */}
        <div className="md:hidden flex items-center">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className={`p-2 rounded-xl transition-all duration-300 focus:outline-none ${isScrolled || isMobileMenuOpen
              ? "text-neutral-700 hover:text-[#2F4F2F] hover:bg-neutral-100/60"
              : "text-neutral-600 hover:text-[#2F4F2F] hover:bg-white/10"
              }`}
          >
            {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

      </div>

      {/* Mobile Drawer Menu with AnimatePresence */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden absolute top-20 left-0 w-full bg-[#F7F8F5] border-b border-[#2F4F2F]/10 shadow-lg overflow-hidden z-40"
          >
            <nav className="flex flex-col space-y-4 p-6">
              {navItems.map((item) => {
                const isActive = activeSection === item.id;
                return (
                  <a
                    key={item.id}
                    href={`#${item.id}`}
                    onClick={(e) => handleNavClick(e, item.id)}
                    className={`text-xs uppercase tracking-[0.2em] font-semibold py-2 border-l-2 pl-3 transition-colors ${isActive
                        ? "text-[#2F4F2F] border-[#2F4F2F] bg-[#2F4F2F]/5"
                        : "text-neutral-500 border-transparent hover:text-[#2F4F2F]"
                      }`}
                  >
                    {item.label}
                  </a>
                );
              })}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
