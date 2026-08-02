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
      bg: "bg-[#162516]/95 border-[#2F4F2F]/40 text-[#A3C380] shadow-[0_0_25px_rgba(47,79,47,0.25)]",
      icon: <CheckCircle2 className="w-4 h-4 text-[#7A9E3A] flex-shrink-0" />,
      accent: "bg-[#7A9E3A]",
    },
    error: {
      bg: "bg-red-950/95 border-red-500/30 text-red-300 shadow-[0_0_25px_rgba(239,68,68,0.15)]",
      icon: <AlertTriangle className="w-4 h-4 text-red-400 flex-shrink-0" />,
      accent: "bg-red-500",
    },
    warning: {
      bg: "bg-amber-950/95 border-amber-500/30 text-amber-300 shadow-[0_0_25px_rgba(245,158,11,0.15)]",
      icon: <AlertCircle className="w-4 h-4 text-amber-400 flex-shrink-0" />,
      accent: "bg-amber-500",
    },
    info: {
      bg: "bg-blue-950/95 border-blue-500/30 text-blue-300 shadow-[0_0_25px_rgba(59,130,246,0.15)]",
      icon: <Info className="w-4 h-4 text-blue-400 flex-shrink-0" />,
      accent: "bg-blue-500",
    },
  };

  const style = styleMap[type] || styleMap.info;

  return (
    <motion.div
      initial={{ opacity: 0, x: 50, scale: 0.95 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 50, scale: 0.95 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      className={`pointer-events-auto flex items-center justify-between p-4 rounded-2xl border backdrop-blur-xl shadow-2xl relative overflow-hidden ${style.bg}`}
    >
      <div className={`absolute top-0 bottom-0 left-0 w-1 ${style.accent}`} />
      
      <div className="flex items-center gap-3 pl-1 flex-1">
        {style.icon}
        <span className="text-xs font-sans font-semibold tracking-wide leading-relaxed">{message}</span>
      </div>

      <button
        onClick={onClose}
        className="p-1 rounded-lg hover:bg-white/10 text-neutral-400 hover:text-white transition-colors cursor-pointer ml-3 flex-shrink-0"
      >
        <X size={14} />
      </button>
    </motion.div>
  );
}

export function SectionHeader({ title, count, onAdd, disabled }) {
  return (
    <div className="flex items-center justify-between gap-4 mb-6">
      <div>
        <h2 className="text-white font-serif text-2xl md:text-3xl font-normal tracking-wide">{title}</h2>
        <p className="text-neutral-500 text-[10px] font-sans uppercase tracking-[0.25em] font-semibold mt-1">
          {count} item{count !== 1 ? "s" : ""}
        </p>
      </div>
      <button
        onClick={onAdd}
        disabled={disabled}
        className="h-11 sm:h-12 px-6 bg-[#2F4F2F] hover:bg-[#3F5F3F] text-white text-[10px] sm:text-xs font-sans font-bold uppercase tracking-[0.2em] rounded-xl shadow-lg shadow-[#2F4F2F]/20 transition-all duration-300 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center justify-center gap-2 cursor-pointer"
      >
        <Plus size={16} /> Add New
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
      initial={{ opacity: 0, scale: 0.97, y: 15 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.97, y: -15 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className={`mt-6 mb-8 bg-white/[0.03] rounded-3xl p-6 sm:p-8 backdrop-blur-xl border transition-all duration-500 ${
        isEditing 
          ? "border-[#2F4F2F]/80 shadow-[0_0_30px_rgba(47,79,47,0.25)] bg-gradient-to-b from-[#2F4F2F]/10 to-transparent" 
          : "border-white/10 shadow-2xl"
      }`}
    >
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/5">
        <div>
          <h3 className="text-white font-serif text-lg sm:text-xl font-normal tracking-wide">
            {isEditing ? `Editing ${title}` : `Add New ${title}`}
          </h3>
          {subtitle && (
            <p className="text-[10px] sm:text-xs font-sans text-neutral-400 font-medium tracking-wide mt-1">
              {subtitle}
            </p>
          )}
        </div>
        <button
          onClick={onClose}
          className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white transition-colors cursor-pointer"
        >
          <X size={16} />
        </button>
      </div>
      {children}
    </motion.div>
  );
}

export const FormField = React.forwardRef(({ label, value, onChange, required, isTextarea, placeholder, type = "text" }, ref) => {
  const inputClasses = "w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm font-sans placeholder:text-neutral-600 focus:outline-none focus:border-[#2F4F2F] focus:ring-2 focus:ring-[#2F4F2F]/20 transition-all";
  return (
    <div className="space-y-2">
      <label className="text-[10px] uppercase font-sans font-bold tracking-[0.2em] text-neutral-400 block">
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
    <div className="flex flex-col sm:flex-row gap-3 pt-4 w-full">
      <button
        type="submit"
        className="h-11 sm:h-12 px-6 bg-[#2F4F2F] hover:bg-[#3F5F3F] text-white text-[10px] sm:text-xs font-sans font-bold uppercase tracking-[0.2em] rounded-xl shadow-lg shadow-[#2F4F2F]/20 transition-all duration-300 active:scale-95 inline-flex items-center justify-center gap-2 cursor-pointer flex-1 sm:flex-none"
      >
        <Save size={16} /> {label}
      </button>
      <button
        type="button"
        onClick={onCancel}
        className="h-11 sm:h-12 px-6 bg-white/5 hover:bg-white/10 text-neutral-300 hover:text-white border border-white/10 text-[10px] sm:text-xs font-sans font-bold uppercase tracking-[0.2em] rounded-xl transition-all duration-300 active:scale-95 inline-flex items-center justify-center gap-2 cursor-pointer flex-1 sm:flex-none"
      >
        <X size={16} /> Cancel
      </button>
    </div>
  );
}

export function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center py-24">
      <div className="w-8 h-8 border-2 border-[#2F4F2F] border-t-transparent rounded-full animate-spin" />
    </div>
  );
}

export function EmptyState({ label }) {
  return (
    <div className="text-center py-20 border border-dashed border-white/10 rounded-3xl mt-6 bg-white/[0.01]">
      <p className="text-neutral-500 text-xs font-sans tracking-wide">No {label} found. Click "Add New" to create one.</p>
    </div>
  );
}
