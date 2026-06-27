import React, { useState, useEffect } from "react";
import { X, ChevronLeft, ChevronRight, Image as ImageIcon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Gallery({ photos }) {
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
    <section id="gallery" className="py-14 bg-white border-b border-neutral-100 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="flex flex-col md:flex-row md:items-end justify-between mb-10"
        >
          <div>
            <span className="text-[10px] uppercase tracking-[0.4em] font-semibold text-[#2F4F2F]">
              Visual Archives
            </span>
            <h2 className="font-serif text-4xl md:text-5xl font-normal text-neutral-800 mt-2">
              Portfolio <span className="italic font-light">Showcase</span>
            </h2>
          </div>
          <p className="text-xs text-neutral-500 font-medium max-w-sm mt-4 md:mt-0 tracking-wide">
            Explore a curated fine-art masonry grid of our premium, high-resolution photographs.
          </p>
        </motion.div>

        {/* Pinterest-Style Masonry Grid */}
        <motion.div
          layout
          className="columns-1 sm:columns-2 md:columns-3 gap-6 space-y-6"
        >
          <AnimatePresence mode="popLayout">
            {photos.map((photo, index) => (
              <motion.div
                key={photo.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                onClick={() => setActivePhotoIdx(index)}
                className="break-inside-avoid relative rounded-3xl overflow-hidden group bg-neutral-900 border border-neutral-200/20 shadow-sm hover:shadow-2xl transition-all duration-500 cursor-pointer"
              >
                {/* Image with zoom hover effect */}
                <motion.img
                  whileHover={{ scale: 1.04 }}
                  transition={{ duration: 0.8 }}
                  src={photo.url}
                  alt={photo.title}
                  className="w-full h-auto object-cover block"
                />

                {/* Hover Details Panel */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-black/10 opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col justify-between p-6">
                  
                  {/* Category Badge (Top) */}
                  <div className="flex justify-start">
                    <span className="text-[8px] uppercase tracking-[0.25em] px-2.5 py-1 rounded-full bg-white/10 backdrop-blur-md text-[#7A9E3A] border border-white/10 font-bold">
                      {photo.category}
                    </span>
                  </div>

                  {/* Details (Bottom) */}
                  <div className="text-white border-t border-white/10 pt-4">
                    <p className="text-[10px] text-neutral-400 uppercase tracking-widest font-semibold mb-0.5">
                      {photo.albumName}
                    </p>
                    <h4 className="font-serif text-lg font-light tracking-wide">
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
          <div className="text-center py-20 border border-dashed border-neutral-200 rounded-3xl p-8 bg-neutral-50/40">
            <ImageIcon size={32} className="mx-auto text-neutral-300 mb-3" />
            <p className="text-neutral-500 text-sm">No photographs found in the portfolio.</p>
          </div>
        )}

        {/* Explore Full Archives Button */}
        {photos.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-12 flex justify-center"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              className="px-8 py-3.5 bg-[#2F4F2F] hover:bg-[#3F5F3F] text-white text-xs font-semibold uppercase tracking-[0.2em] rounded-full border border-transparent shadow-lg transition-all duration-300 focus:outline-none"
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
            className="fixed inset-0 z-[60] bg-black/95 backdrop-blur-md flex flex-col items-center justify-between p-6"
          >
            {/* Top Controls */}
            <div className="w-full max-w-7xl flex items-center justify-between text-white/70 select-none">
              <span className="text-xs uppercase tracking-widest font-semibold">
                Photo {activePhotoIdx + 1} of {photos.length}
              </span>
              <button
                onClick={() => setActivePhotoIdx(null)}
                className="p-3 rounded-full bg-white/5 hover:bg-white/10 hover:text-white transition-colors focus:outline-none"
              >
                <X size={20} />
              </button>
            </div>

            {/* Middle Container (Arrows + Image) */}
            <div className="w-full flex items-center justify-between max-w-7xl flex-1 my-6 relative">
              <button
                onClick={handlePrev}
                className="absolute left-0 md:left-4 p-3.5 rounded-full bg-white/5 hover:bg-white/10 hover:text-white transition-colors z-10 focus:outline-none"
              >
                <ChevronLeft size={24} />
              </button>

              <div className="flex-1 flex items-center justify-center p-4 h-full max-h-[70vh]">
                <motion.img
                  key={photos[activePhotoIdx].id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  src={photos[activePhotoIdx].url}
                  alt={photos[activePhotoIdx].title}
                  className="max-w-full max-h-full object-contain rounded-2xl shadow-2xl select-none"
                  onClick={(e) => e.stopPropagation()}
                />
              </div>

              <button
                onClick={handleNext}
                className="absolute right-0 md:right-4 p-3.5 rounded-full bg-white/5 hover:bg-white/10 hover:text-white transition-colors z-10 focus:outline-none"
              >
                <ChevronRight size={24} />
              </button>
            </div>

            {/* Bottom Meta Info */}
            <div className="w-full max-w-7xl text-center text-white/90 pb-4 select-none" onClick={(e) => e.stopPropagation()}>
              <span className="text-[10px] uppercase tracking-widest text-[#7A9E3A] font-semibold">
                {photos[activePhotoIdx].category} — {photos[activePhotoIdx].albumName}
              </span>
              <h3 className="font-serif text-2xl font-light tracking-wide mt-2">
                {photos[activePhotoIdx].title}
              </h3>
            </div>

          </motion.div>
        )}
      </AnimatePresence>

    </section>
  );
}
