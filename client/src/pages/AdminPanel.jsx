import React, { useState, useEffect, lazy, Suspense } from "react";
import {
  LogOut, Camera, Image, Phone, Menu, LayoutDashboard, Eye, X
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import LoginPage from "../components/admin/LoginPage";
import { NotificationCard, LoadingSpinner } from "../components/admin/AdminShared";

// Lazy load manager tabs for optimal code splitting & memory management
const ServicesManager = lazy(() => import("../components/admin/ServicesManager"));
const GalleryManager = lazy(() => import("../components/admin/GalleryManager"));
const ContactManager = lazy(() => import("../components/admin/ContactManager"));

// =====================================================
// ADMIN PANEL — Full CMS for Photography Studio
// =====================================================

export default function AdminPanel() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [adminUser, setAdminUser] = useState(null);
  const [activeTab, setActiveTab] = useState("services");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);

  const addNotification = (type, message) => {
    const id = Date.now() + Math.random().toString(36).substring(2, 9);
    setNotifications((prev) => [...prev, { id, type, message }]);
  };

  const removeNotification = (id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    const user = localStorage.getItem("adminUser");
    if (token && user) {
      setIsLoggedIn(true);
      setAdminUser(JSON.parse(user));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminUser");
    setIsLoggedIn(false);
    setAdminUser(null);
  };

  if (!isLoggedIn) {
    return <LoginPage onLogin={(user) => { setIsLoggedIn(true); setAdminUser(user); }} />;
  }

  const SidebarContent = () => (
    <div className="flex flex-col h-full font-sans">
      {/* Brand logo */}
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 bg-gradient-to-br from-[#2F4F2F] to-[#5A8A5A] rounded-xl flex items-center justify-center shadow-lg shadow-[#2F4F2F]/20">
          <LayoutDashboard size={20} className="text-white" />
        </div>
        <div>
          <h1 className="text-white font-serif text-lg font-normal tracking-wide">Aravinth Studio</h1>
          <p className="text-[9px] text-neutral-500 font-sans uppercase tracking-[0.3em] font-semibold">CMS Admin Panel</p>
        </div>
      </div>

      {/* Navigation Links */}
      <div className="space-y-2">
        {[
          { key: "services", label: "Services", icon: Camera },
          { key: "gallery", label: "Gallery", icon: Image },
          { key: "contact", label: "Contact", icon: Phone },
        ].map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => {
              setActiveTab(key);
              setIsMobileMenuOpen(false);
            }}
            className={`w-full h-11 flex items-center gap-3 px-4 rounded-xl text-[10px] sm:text-xs font-sans uppercase tracking-[0.2em] font-bold transition-all duration-300 cursor-pointer ${
              activeTab === key
                ? "bg-[#2F4F2F] text-white shadow-lg shadow-[#2F4F2F]/20"
                : "text-neutral-400 hover:text-white hover:bg-white/5"
            }`}
          >
            <Icon size={16} />
            {label}
          </button>
        ))}
      </div>

      {/* Footer Profile & Logout */}
      <div className="mt-auto pt-6 border-t border-white/10 space-y-3">
        <div className="flex items-center justify-between gap-2 px-3.5 py-3 bg-white/5 rounded-xl border border-white/5">
          <div className="flex items-center gap-2 truncate">
            <div className="w-2 h-2 rounded-full bg-[#7A9E3A] flex-shrink-0 animate-pulse" />
            <span className="text-[10px] font-sans font-bold uppercase tracking-[0.2em] text-neutral-300 truncate">
              {adminUser?.username}
            </span>
          </div>
          <a
            href="/"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1 text-[9px] uppercase font-sans font-bold tracking-widest text-neutral-400 hover:text-[#7A9E3A] transition-colors"
          >
            <Eye size={12} /> Site
          </a>
        </div>
        <button
          onClick={handleLogout}
          className="w-full h-11 flex items-center gap-2 justify-center bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 rounded-xl text-[10px] sm:text-xs font-sans uppercase tracking-[0.2em] font-bold transition-all duration-300 active:scale-95 cursor-pointer"
        >
          <LogOut size={16} /> Log Out
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0F0F0F] text-white font-sans flex flex-col md:flex-row">
      {/* Desktop Sidebar (hidden on mobile) */}
      <aside className="hidden md:block w-64 bg-[#0A0A0A] border-r border-white/10 p-6 h-screen sticky top-0 flex-shrink-0">
        <SidebarContent />
      </aside>

      {/* Mobile Top Header (hidden on desktop) */}
      <header className="md:hidden sticky top-0 z-40 bg-[#0F0F0F]/95 backdrop-blur-xl border-b border-white/10 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-[#2F4F2F] to-[#5A8A5A] rounded-lg flex items-center justify-center">
            <LayoutDashboard size={16} className="text-white" />
          </div>
          <div>
            <h1 className="text-white font-serif text-base font-normal tracking-wide">CMS Admin</h1>
            <p className="text-[8px] text-neutral-500 uppercase tracking-widest font-sans font-semibold">Aravinth Studio</p>
          </div>
        </div>
        
        <button
          onClick={() => setIsMobileMenuOpen(true)}
          className="p-2.5 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-all text-neutral-300 hover:text-white cursor-pointer"
        >
          <Menu size={18} />
        </button>
      </header>

      {/* Mobile Menu Drawer (Framer Motion) */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/80 z-40 md:hidden backdrop-blur-sm"
            />
            {/* Drawer */}
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="fixed inset-y-0 left-0 w-72 bg-[#0A0A0A] z-50 p-6 flex flex-col md:hidden border-r border-white/10"
            >
              {/* Close Button */}
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="absolute top-6 right-6 p-2 rounded-xl bg-white/5 text-neutral-400 hover:text-white transition-colors cursor-pointer"
              >
                <X size={16} />
              </button>
              <SidebarContent />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 md:px-8 py-6 md:py-8 overflow-x-hidden">
        <Suspense fallback={<LoadingSpinner />}>
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            >
              {activeTab === "services" && <ServicesManager onNotify={addNotification} />}
              {activeTab === "gallery" && <GalleryManager onNotify={addNotification} />}
              {activeTab === "contact" && <ContactManager onNotify={addNotification} />}
            </motion.div>
          </AnimatePresence>
        </Suspense>
      </main>

      {/* Toast Notification Container */}
      <div className="fixed top-6 right-6 z-[100] flex flex-col gap-3 w-full max-w-sm pointer-events-none">
        <AnimatePresence>
          {notifications.map((n) => (
            <NotificationCard
              key={n.id}
              type={n.type}
              message={n.message}
              onClose={() => removeNotification(n.id)}
            />
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
