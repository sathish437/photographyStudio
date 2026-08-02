import React, { useEffect } from "react";
import {
  Plus, X, Save, CheckCircle2, AlertTriangle, AlertCircle, Info
} from "lucide-react";
import { motion } from "framer-motion";

export function NotificationCard({ type, message, onClose }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const styleMap = {
    success: {
      bg: "bg-[#162516]/90 border-[#2F4F2F]/40 text-[#A3C380] shadow-[0_0_20px_rgba(47,79,47,0.2)]",
      icon: <CheckCircle2 className="w-4 h-4 text-[#7A9E3A] flex-shrink-0" />,
      accent: "bg-[#7A9E3A]",
    },
    error: {
      bg: "bg-red-950/90 border-red-500/30 text-red-300 shadow-[0_0_20px_rgba(239,68,68,0.1)]",
      icon: <AlertTriangle className="w-4 h-4 text-red-400 flex-shrink-0" />,
      accent: "bg-red-500",
    },
    warning: {
      bg: "bg-amber-950/90 border-amber-500/30 text-amber-300 shadow-[0_0_20px_rgba(245,158,11,0.1)]",
      icon: <AlertCircle className="w-4 h-4 text-amber-400 flex-shrink-0" />,
      accent: "bg-amber-500",
    },
    info: {
      bg: "bg-blue-950/90 border-blue-500/30 text-blue-300 shadow-[0_0_20px_rgba(59,130,246,0.1)]",
      icon: <Info className="w-4 h-4 text-blue-400 flex-shrink-0" />,
      accent: "bg-blue-500",
    },
  };

  const style = styleMap[type] || styleMap.info;

  return (
    <motion.div
      initial={{ opacity: 0, x: 50, scale: 0.9 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 50, scale: 0.9 }}
      transition={{ type: "spring", damping: 20, stiffness: 350 }}
      className={`pointer-events-auto flex items-center justify-between p-4 rounded-2xl border backdrop-blur-xl shadow-2xl relative overflow-hidden ${style.bg}`}
    >
      <div className={`absolute top-0 bottom-0 left-0 w-1 ${style.accent}`} />
      
      <div className="flex items-center gap-3 pl-1 flex-1">
        {style.icon}
        <span className="text-xs font-semibold tracking-wide leading-relaxed">{message}</span>
      </div>

      <button
        onClick={onClose}
        className="p-1 rounded-lg hover:bg-white/10 text-neutral-400 hover:text-white transition-all cursor-pointer ml-3 flex-shrink-0"
      >
        <X size={14} />
      </button>
    </motion.div>
  );
}

export function SectionHeader({ title, count, onAdd, disabled }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div>
        <h2 className="text-white font-bold text-base sm:text-lg tracking-wide">{title}</h2>
        <p className="text-neutral-500 text-[9px] uppercase tracking-widest mt-1">{count} item{count !== 1 ? "s" : ""}</p>
      </div>
      <button
        onClick={onAdd}
        disabled={disabled}
        className="flex items-center justify-center gap-1.5 px-4 py-3 sm:py-2.5 min-h-[44px] bg-[#2F4F2F] hover:bg-[#3F5F3F] rounded-xl text-xs sm:text-[10px] uppercase tracking-widest font-bold transition-all shadow-lg shadow-[#2F4F2F]/10 cursor-pointer text-white disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <Plus size={14} /> Add New
      </button>
    </div>
  );
}

export function FormCard({ id, title, subtitle, isEditing, children, onClose }) {
  useEffect(() => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [id]);

  return (
    <motion.div
      id={id}
      initial={{ opacity: 0, scale: 0.96, y: 15 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`mt-5 bg-white/[0.03] rounded-3xl p-5 sm:p-6 backdrop-blur-xl border transition-all duration-500 ${
        isEditing 
          ? "border-[#2F4F2F]/80 shadow-[0_0_25px_rgba(47,79,47,0.3)] bg-gradient-to-b from-[#2F4F2F]/5 to-transparent" 
          : "border-white/10"
      }`}
    >
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="text-white font-bold text-xs sm:text-sm uppercase tracking-widest">
            {isEditing ? `Editing ${title}` : `Add New ${title}`}
          </h3>
          {subtitle && (
            <p className="text-[10px] text-neutral-500 font-semibold tracking-wide mt-1.5">
              {subtitle}
            </p>
          )}
        </div>
        <button onClick={onClose} className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-neutral-500 hover:text-white transition-all cursor-pointer">
          <X size={14} />
        </button>
      </div>
      {children}
    </motion.div>
  );
}

export const FormField = React.forwardRef(({ label, value, onChange, required, isTextarea, placeholder, type = "text" }, ref) => {
  const inputClasses = "w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 sm:py-3 text-white text-sm placeholder:text-neutral-600 focus:outline-none focus:border-[#2F4F2F] transition-colors";
  return (
    <div>
      <label className="text-[10px] uppercase tracking-widest text-neutral-500 block mb-2 font-semibold">
        {label} {required && <span className="text-[#7A9E3A]">*</span>}
      </label>
      {isTextarea ? (
        <textarea
          ref={ref}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`${inputClasses} resize-none`}
          rows={3}
          required={required}
          placeholder={placeholder}
        />
      ) : (
        <input
          ref={ref}
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={inputClasses}
          required={required}
          placeholder={placeholder}
        />
      )}
    </div>
  );
});
FormField.displayName = "FormField";

export function FormActions({ onCancel, label }) {
  return (
    <div className="flex flex-col sm:flex-row gap-3 pt-2 w-full">
      <button
        type="submit"
        className="w-full sm:w-auto min-h-[44px] flex items-center justify-center gap-2 px-5 py-3 bg-[#2F4F2F] hover:bg-[#3F5F3F] rounded-xl text-xs sm:text-[10px] uppercase tracking-widest font-bold transition-all text-white cursor-pointer shadow-lg shadow-[#2F4F2F]/10"
      >
        <Save size={14} /> {label}
      </button>
      <button
        type="button"
        onClick={onCancel}
        className="w-full sm:w-auto min-h-[44px] flex items-center justify-center gap-2 px-5 py-3 bg-white/5 hover:bg-white/10 rounded-xl text-xs sm:text-[10px] uppercase tracking-widest font-bold text-neutral-400 transition-all cursor-pointer"
      >
        <X size={14} /> Cancel
      </button>
    </div>
  );
}

export function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center py-20">
      <div className="w-8 h-8 border-2 border-[#2F4F2F] border-t-transparent rounded-full animate-spin" />
    </div>
  );
}

export function EmptyState({ label }) {
  return (
    <div className="text-center py-16 border border-dashed border-white/10 rounded-2xl mt-6">
      <p className="text-neutral-600 text-xs tracking-wide">No {label} found. Click "Add New" to create one.</p>
    </div>
  );
}
