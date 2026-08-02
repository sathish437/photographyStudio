import React, { useState, useEffect, memo } from "react";
import { X, ChevronLeft, ChevronRight, Image as ImageIcon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { getOptimizedImageUrl } from "../utils/imageUtils";

function Gallery({ photos }) {
  const [activePhotoIdx, setActivePhotoIdx] = useState(null);

  // Handle keyboard navigation for lightbox
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (activePhotoIdx === null) return;
      if (e.key === "Escape") setActivePhotoIdx(null);
      if (e.key === "ArrowRight") {
        setActivePhotoIdx((prev) => (prev + 1) % photos.length);
      }
      if (e.key === "ArrowLeft") {
        setActivePhotoIdx((prev) => (prev - 1 + photos.length) % photos.length);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activePhotoIdx, photos.length]);

  const handlePrev = (e) => {
    e.stopPropagation();
    setActivePhotoIdx((prev) => (prev - 1 + photos.length) % photos.length);
  };

  const handleNext = (e) => {
    e.stopPropagation();
    setActivePhotoIdx((prev) => (prev + 1) % photos.length);
  };

  return (
    <section id="gallery" className="py-16 md:py-24 bg-white border-b border-neutral-100 relative overflow-hidden font-sans">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col md:flex-row md:items-end justify-between mb-12 md:mb-16"
        >
          <div>
            <span className="text-[10px] sm:text-xs uppercase tracking-[0.35em] font-bold text-[#2F4F2F]">
              Visual Archives
            </span>
            <h2 className="font-serif text-4xl md:text-5xl font-normal text-neutral-800 mt-2">
              Portfolio <span className="italic font-light">Showcase</span>
            </h2>
          </div>
          <p className="text-xs md:text-sm text-neutral-500 font-normal max-w-sm mt-4 md:mt-0 tracking-wide font-sans leading-relaxed">
            Explore a curated fine-art masonry grid of our premium, high-resolution photographs.
          </p>
        </motion.div>

        {/* Pinterest-Style Masonry Grid */}
        <motion.div
          className="columns-1 sm:columns-2 md:columns-3 gap-6 sm:gap-8 space-y-6 sm:space-y-8"
        >
          <AnimatePresence mode="popLayout">
            {photos.map((photo, index) => (
              <motion.div
                key={photo.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                onClick={() => setActivePhotoIdx(index)}
                className="break-inside-avoid relative rounded-3xl overflow-hidden group bg-neutral-900 border border-neutral-200/50 shadow-sm hover:shadow-2xl transition-all duration-500 cursor-pointer"
              >
                {/* Image with zoom hover effect */}
                <motion.img
                  whileHover={{ scale: 1.04 }}
                  transition={{ duration: 0.8 }}
                  src={getOptimizedImageUrl(photo.url, 800)}
                  alt={photo.title}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-auto object-cover block min-h-[150px]"
                />

                {/* Hover Details Panel */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/10 opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col justify-between p-6">
                  
                  {/* Category Badge (Top) */}
                  <div className="flex justify-start">
                    <span className="text-[8px] font-sans uppercase tracking-[0.25em] px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-[#7A9E3A] border border-white/10 font-bold">
                      {photo.category}
                    </span>
                  </div>

                  {/* Details (Bottom) */}
                  <div className="text-white border-t border-white/10 pt-4">
                    <p className="text-[10px] font-sans text-neutral-400 uppercase tracking-widest font-semibold mb-0.5">
                      {photo.albumName}
                    </p>
                    <h4 className="font-serif text-xl font-normal tracking-wide">
                      {photo.title}
                    </h4>
                  </div>

                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Empty state fallback */}
        {photos.length === 0 && (
          <div className="text-center py-20 border border-dashed border-neutral-200 rounded-3xl p-8 bg-neutral-50/50">
            <ImageIcon size={32} className="mx-auto text-neutral-300 mb-3" />
            <p className="text-neutral-500 text-xs font-sans tracking-wide">No photographs found in the portfolio.</p>
          </div>
        )}

        {/* Explore Full Archives Button */}
        {photos.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            className="mt-12 md:mt-16 flex justify-center"
          >
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              className="h-12 px-8 bg-[#2F4F2F] hover:bg-[#3F5F3F] text-white text-[10px] sm:text-xs font-sans font-bold uppercase tracking-[0.2em] rounded-full border border-transparent shadow-lg shadow-[#2F4F2F]/20 transition-all duration-300 cursor-pointer"
            >
              Explore Full Archives
            </motion.button>
          </motion.div>
        )}

      </div>

      {/* High-End Lightbox Modal Overlay */}
      <AnimatePresence>
        {activePhotoIdx !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActivePhotoIdx(null)}
            className="fixed inset-0 z-[60] bg-black/95 backdrop-blur-md flex flex-col items-center justify-between p-6 font-sans"
          >
            {/* Top Controls */}
            <div className="w-full max-w-7xl flex items-center justify-between text-white/80 select-none">
              <span className="text-xs font-sans uppercase tracking-[0.2em] font-bold">
                Photo {activePhotoIdx + 1} of {photos.length}
              </span>
              <button
                onClick={() => setActivePhotoIdx(null)}
                className="p-3 rounded-full bg-white/10 hover:bg-white/20 hover:text-white transition-colors cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            {/* Middle Container (Arrows + Image) */}
            <div className="w-full flex items-center justify-between max-w-7xl flex-1 my-6 relative">
              <button
                onClick={handlePrev}
                className="absolute left-0 md:left-4 p-3.5 rounded-full bg-white/10 hover:bg-white/20 hover:text-white transition-colors z-10 cursor-pointer"
              >
                <ChevronLeft size={24} />
              </button>

              <div className="flex-1 flex items-center justify-center p-4 h-full max-h-[70vh]">
                <motion.img
                  key={photos[activePhotoIdx].id}
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  src={getOptimizedImageUrl(photos[activePhotoIdx].url, 1600)}
                  alt={photos[activePhotoIdx].title}
                  className="max-w-full max-h-full object-contain rounded-2xl shadow-2xl select-none"
                  onClick={(e) => e.stopPropagation()}
                />
              </div>

              <button
                onClick={handleNext}
                className="absolute right-0 md:right-4 p-3.5 rounded-full bg-white/10 hover:bg-white/20 hover:text-white transition-colors z-10 cursor-pointer"
              >
                <ChevronRight size={24} />
              </button>
            </div>

            {/* Bottom Meta Info */}
            <div className="w-full max-w-7xl text-center text-white/90 pb-4 select-none" onClick={(e) => e.stopPropagation()}>
              <span className="text-[10px] uppercase font-sans tracking-[0.2em] text-[#7A9E3A] font-bold">
                {photos[activePhotoIdx].category} — {photos[activePhotoIdx].albumName}
              </span>
              <h3 className="font-serif text-2xl font-normal tracking-wide mt-1.5">
                {photos[activePhotoIdx].title}
              </h3>
            </div>

          </motion.div>
        )}
      </AnimatePresence>

    </section>
  );
}

export default memo(Gallery);
