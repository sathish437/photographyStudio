import React from "react";
import { ArrowDown } from "lucide-react";
import { motion, useScroll, useTransform } from "framer-motion";

export default function Hero() {
  const { scrollY } = useScroll();
  
  // Parallax transform bindings
  const yBg = useTransform(scrollY, [0, 600], ["0%", "20%"]);
  const yText = useTransform(scrollY, [0, 600], ["0%", "-10%"]);
  const opacityText = useTransform(scrollY, [0, 400], [1, 0]);

  const handleScrollClick = (e, targetId) => {
    e.preventDefault();
    const element = document.getElementById(targetId);
    if (element) {
      const headerOffset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
    }
  };

  // Text Reveal Variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.25,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { y: 60, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 1.2, ease: [0.16, 1, 0.3, 1] }
    }
  };

  return (
    <section
      id="hero"
      className="relative h-[95vh] min-h-[650px] flex items-center justify-center overflow-hidden bg-[#1E2515]"
    >
      {/* Parallax Background Image */}
      <motion.div
        style={{ y: yBg }}
        className="absolute inset-0 z-0 select-none pointer-events-none scale-110"
      >
        <img
          src="https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1600&auto=format&fit=crop"
          alt="Luxury Photography Background"
          className="w-full h-full object-cover object-center opacity-55"
        />
        {/* Soft Dark Olive-toned Vignette Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#F7F8F5] via-neutral-950/50 to-neutral-950/80" />
      </motion.div>

      {/* Floating Ambient Glow Refractions */}
      <motion.div
        animate={{
          x: [0, 30, 0],
          y: [0, -30, 0],
          scale: [1, 1.15, 1]
        }}
        transition={{
          repeat: Infinity,
          duration: 12,
          ease: "easeInOut"
        }}
        className="absolute top-1/4 left-1/4 w-80 h-80 rounded-full bg-[#7A9E3A]/10 blur-[100px] pointer-events-none z-0"
      />
      <motion.div
        animate={{
          x: [0, -40, 0],
          y: [0, 40, 0],
          scale: [1, 1.2, 1]
        }}
        transition={{
          repeat: Infinity,
          duration: 16,
          ease: "easeInOut"
        }}
        className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-[#2F4F2F]/15 blur-[120px] pointer-events-none z-0"
      />

      {/* Hero Content */}
      <motion.div
        style={{ y: yText, opacity: opacityText }}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 max-w-4xl mx-auto px-6 text-center text-white flex flex-col items-center"
      >
        <motion.span
          variants={itemVariants}
          className="text-[10px] md:text-xs uppercase tracking-[0.5em] font-semibold text-[#7A9E3A] mb-6"
        >
          FINE-ART PHOTOGRAPHY STUDIO
        </motion.span>
        
        {/* Title */}
        <div className="overflow-hidden mb-2">
          <motion.h1
            variants={itemVariants}
            className="font-serif text-5xl md:text-8xl font-bold tracking-wide"
          >
            Aravinth Photography
          </motion.h1>
        </div>

        {/* Slogan */}
        <div className="overflow-hidden mb-6">
          <motion.p
            variants={itemVariants}
            className="font-serif italic text-xl md:text-3xl text-neutral-300 font-light"
          >
            "Creating Your Memories"
          </motion.p>
        </div>

        {/* Tagline */}
        <div className="overflow-hidden mb-12 max-w-lg">
          <motion.p
            variants={itemVariants}
            className="text-neutral-400 font-sans text-xs md:text-sm tracking-wide font-light leading-relaxed"
          >
            Preserving your most precious legacies, milestones, and emotions in timeless, editorial-grade frames.
          </motion.p>
        </div>

        {/* CTA Double Buttons */}
        <motion.div
          variants={itemVariants}
          className="flex flex-col sm:flex-row gap-4 items-center justify-center"
        >
          {/* Primary CTA */}
          <a
            href="#gallery"
            onClick={(e) => handleScrollClick(e, "gallery")}
            className="group flex items-center space-x-3 px-8 py-4 bg-[#2F4F2F] hover:bg-[#3F5F3F] text-white text-xs font-semibold uppercase tracking-[0.2em] rounded-full border border-transparent shadow-lg transition-all duration-300 hover:scale-105 focus:outline-none"
          >
            <span>View Gallery</span>
            <ArrowDown size={14} className="group-hover:translate-y-1 transition-transform" />
          </a>
          
          {/* Secondary CTA */}
          <a
            href="#contact"
            onClick={(e) => handleScrollClick(e, "contact")}
            className="px-8 py-4 bg-white/10 hover:bg-white/20 text-white text-xs font-semibold uppercase tracking-[0.2em] rounded-full border border-white/20 backdrop-blur-sm transition-all duration-300 hover:scale-105"
          >
            Contact Us
          </a>
        </motion.div>

      </motion.div>

      {/* Floating Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 animate-bounce"
      >
        <a
          href="#about"
          onClick={(e) => handleScrollClick(e, "about")}
          className="text-neutral-400 hover:text-white transition-colors"
        >
          <ArrowDown size={18} />
        </a>
      </motion.div>
    </section>
  );
}
