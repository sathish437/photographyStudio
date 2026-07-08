import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trash2 } from "lucide-react";

export default function DeleteConfirmationModal({ isOpen, onClose, onConfirm, isDeleting }) {
  // Esc key closes the modal
  useEffect(() => {
    if (!isOpen) return;
    
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && !isDeleting) {
        onClose();
      }
    };
    
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose, isDeleting]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 overflow-y-auto">
          {/* Backdrop overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => {
              if (!isDeleting) onClose();
            }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ type: "spring", duration: 0.4, bounce: 0.12 }}
            className="relative bg-[#0A0A0A] border border-white/10 rounded-3xl p-6 w-full max-w-sm shadow-2xl overflow-hidden flex flex-col items-center text-center z-10"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top Warning Icon */}
            <div className="w-12 h-12 bg-red-500/10 rounded-2xl flex items-center justify-center text-red-400 mb-4 border border-red-500/20">
              <Trash2 size={22} className="animate-pulse" />
            </div>

            {/* Content text */}
            <h3 className="text-white font-bold text-base tracking-wide font-sans">
              Delete Item?
            </h3>
            <p className="text-neutral-400 text-xs mt-2 leading-relaxed font-sans font-semibold">
              This action cannot be undone.
            </p>

            {/* Action buttons */}
            <div className="flex gap-3 w-full mt-6">
              <button
                type="button"
                onClick={onClose}
                disabled={isDeleting}
                className="flex-1 min-h-[44px] flex items-center justify-center px-4 py-2.5 bg-white/5 hover:bg-white/10 border border-white/5 rounded-xl text-xs uppercase tracking-widest font-bold transition-all text-neutral-300 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={onConfirm}
                disabled={isDeleting}
                className="flex-1 min-h-[44px] flex items-center justify-center gap-2 px-4 py-2.5 bg-red-500/10 hover:bg-red-500/20 border border-red-500/10 rounded-xl text-xs uppercase tracking-widest font-bold transition-all text-red-400 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isDeleting ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-red-400 border-t-transparent rounded-full animate-spin" />
                    <span>Deleting...</span>
                  </>
                ) : (
                  <span>Delete</span>
                )}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
