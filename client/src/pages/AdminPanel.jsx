import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  LogOut, Camera, Image, Phone, Plus, Pencil, Trash2, Save, X, Menu,
  LayoutDashboard, ChevronRight, Eye, Youtube, RotateCcw, MessageCircle, Mail, Instagram, MapPin,
  CheckCircle2, AlertTriangle, AlertCircle, Info
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { authApi, adminServicesApi, adminGalleryApi, adminContactApi, BASE_URL } from "../api/api";
import DeleteConfirmationModal from "../components/DeleteConfirmationModal";

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
    <div className="flex flex-col h-full">
      {/* Brand logo */}
      <div className="flex items-center gap-3 mb-8">
        <div className="w-9 h-9 bg-gradient-to-br from-[#2F4F2F] to-[#5A8A5A] rounded-xl flex items-center justify-center shadow-lg shadow-[#2F4F2F]/20">
          <LayoutDashboard size={18} />
        </div>
        <div>
          <h1 className="text-sm font-bold tracking-wide">CMS Admin</h1>
          <p className="text-[10px] text-neutral-500 uppercase tracking-widest">Aravinth Studio</p>
        </div>
      </div>

      {/* Navigation Links */}
      <div className="space-y-1">
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
            className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-xs font-semibold uppercase tracking-widest transition-all ${
              activeTab === key
                ? "bg-[#2F4F2F] text-white shadow-lg shadow-[#2F4F2F]/20"
                : "text-neutral-500 hover:text-white hover:bg-white/5"
            }`}
          >
            <Icon size={14} />
            {label}
          </button>
        ))}
      </div>

      {/* Footer Profile & Logout */}
      <div className="mt-auto pt-6 border-t border-white/5">
        <div className="flex items-center justify-between gap-2 px-3 py-2.5 bg-white/5 rounded-2xl mb-3">
          <div className="flex items-center gap-2 truncate">
            <div className="w-2 h-2 rounded-full bg-[#7A9E3A] flex-shrink-0" />
            <span className="text-[10px] uppercase tracking-widest text-neutral-400 truncate">{adminUser?.username}</span>
          </div>
          <a
            href="/"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1 text-[9px] uppercase tracking-widest text-neutral-500 hover:text-white transition-colors"
          >
            <Eye size={10} /> Site
          </a>
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-2 justify-center py-3.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-xl text-[10px] uppercase tracking-widest font-bold transition-all"
        >
          <LogOut size={14} /> Log Out
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0F0F0F] text-white font-sans flex flex-col md:flex-row">
      {/* Desktop Sidebar (hidden on mobile) */}
      <aside className="hidden md:block w-64 bg-[#0A0A0A] border-r border-white/5 p-6 h-screen sticky top-0 flex-shrink-0">
        <SidebarContent />
      </aside>

      {/* Mobile Top Header (hidden on desktop) */}
      <header className="md:hidden sticky top-0 z-40 bg-[#0F0F0F]/95 backdrop-blur-xl border-b border-white/5 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-[#2F4F2F] to-[#5A8A5A] rounded-lg flex items-center justify-center">
            <LayoutDashboard size={16} />
          </div>
          <div>
            <h1 className="text-xs font-bold tracking-wide">CMS Admin</h1>
            <p className="text-[8px] text-neutral-500 uppercase tracking-widest">Aravinth Studio</p>
          </div>
        </div>
        
        <button
          onClick={() => setIsMobileMenuOpen(true)}
          className="p-2 bg-white/5 rounded-lg hover:bg-white/10 transition-all text-neutral-400 hover:text-white"
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
              className="fixed inset-0 bg-black/80 z-40 md:hidden"
            />
            {/* Drawer */}
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 left-0 w-72 bg-[#0A0A0A] z-50 p-6 flex flex-col md:hidden"
            >
              {/* Close Button */}
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="absolute top-6 right-6 p-1.5 rounded-lg bg-white/5 text-neutral-500 hover:text-white transition-all"
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
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.2 }}
          >
            {activeTab === "services" && <ServicesManager onNotify={addNotification} />}
            {activeTab === "gallery" && <GalleryManager onNotify={addNotification} />}
            {activeTab === "contact" && <ContactManager onNotify={addNotification} />}
          </motion.div>
        </AnimatePresence>
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

function NotificationCard({ type, message, onClose }) {
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
      {/* Dynamic border accent bar */}
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

// =====================================================
// LOGIN PAGE
// =====================================================

function LoginPage({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await authApi.login({ username, password });
      localStorage.setItem("adminToken", res.data.token);
      localStorage.setItem("adminUser", JSON.stringify({ username: res.data.username, role: res.data.role }));
      onLogin({ username: res.data.username, role: res.data.role });
    } catch (err) {
      setError(err.response?.data?.message || "Invalid username or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0F0F0F] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        {/* Branding */}
        <div className="text-center mb-10">
          <div className="w-14 h-14 bg-gradient-to-br from-[#2F4F2F] to-[#5A8A5A] rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-lg shadow-[#2F4F2F]/20">
            <Camera size={26} className="text-white" />
          </div>
          <h1 className="text-white text-xl font-bold tracking-wide">Aravinth Photography</h1>
          <p className="text-neutral-500 text-[10px] uppercase tracking-[0.4em] mt-2">CMS Admin Panel</p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="bg-white/[0.03] border border-white/5 rounded-3xl p-8 backdrop-blur-xl">
          <h2 className="text-white font-semibold text-sm mb-6 uppercase tracking-widest">Sign In</h2>

          {error && (
            <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="text-[10px] uppercase tracking-widest text-neutral-500 block mb-2">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder:text-neutral-600 focus:outline-none focus:border-[#2F4F2F] transition-colors"
                placeholder="Enter username"
                required
              />
            </div>
            <div>
              <label className="text-[10px] uppercase tracking-widest text-neutral-500 block mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder:text-neutral-600 focus:outline-none focus:border-[#2F4F2F] transition-colors"
                placeholder="Enter password"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-6 py-3.5 bg-gradient-to-r from-[#2F4F2F] to-[#3F6F3F] hover:from-[#3F5F3F] hover:to-[#4F7F4F] text-white text-xs font-bold uppercase tracking-[0.2em] rounded-xl transition-all disabled:opacity-50 shadow-lg shadow-[#2F4F2F]/20"
          >
            {loading ? "Authenticating..." : "Sign In"}
          </button>
        </form>

        <p className="text-center text-neutral-600 text-[10px] mt-6 tracking-wide">
          Protected admin access only
        </p>
      </div>
    </div>
  );
}

// =====================================================
// SERVICES MANAGER
// =====================================================

function ServicesManager({ onNotify }) {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingItem, setEditingItem] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [deleteConfirmItem, setDeleteConfirmItem] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const fetchServices = async () => {
    try {
      const res = await adminServicesApi.getAll();
      setServices(res.data);
    } catch (err) {
      console.error("Failed to fetch services:", err);
      onNotify("error", "Failed to fetch services list");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchServices(); }, []);

  const handleSave = async (data) => {
    onNotify("info", "Upload in progress...");
    try {
      if (editingItem) {
        await adminServicesApi.update(editingItem.id, data);
        onNotify("success", "Service updated successfully.");
      } else {
        await adminServicesApi.create(data);
        onNotify("success", "Service created successfully.");
      }
      setShowForm(false);
      setEditingItem(null);
      fetchServices();
    } catch (err) {
      onNotify("error", err.response?.data?.message || "Failed to save service");
    }
  };

  const handleDelete = (service) => {
    setDeleteConfirmItem(service);
  };

  const performDelete = async (id) => {
    setDeletingId(id);
    try {
      await adminServicesApi.delete(id);
      onNotify("success", "Service deleted successfully.");
      fetchServices();
    } catch (err) {
      onNotify("error", "Failed to delete service");
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-6">
      <SectionHeader
        title="Services"
        count={services.length}
        onAdd={() => { setEditingItem(null); setShowForm(true); }}
        disabled={deletingId !== null}
      />

      {showForm && (
        <FormCard
          id="service-form-card"
          title="Service"
          subtitle={editingItem ? "Update the selected item below." : "Enter details for the new service."}
          isEditing={!!editingItem}
          onClose={() => { setShowForm(false); setEditingItem(null); }}
        >
          <ServiceForm
            initial={editingItem}
            onSave={handleSave}
            onCancel={() => { setShowForm(false); setEditingItem(null); }}
            onNotify={onNotify}
          />
        </FormCard>
      )}

      {/* Responsive Services Card Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
        {services.map((service) => (
          <motion.div
            key={service.id}
            whileHover={{ y: -6 }}
            transition={{ duration: 0.3 }}
            className="group bg-white/[0.02] border border-white/5 rounded-3xl overflow-hidden hover:border-[#2F4F2F]/30 transition-all flex flex-col justify-between"
          >
            <div>
              {/* Image Banner */}
              <div className="aspect-[16/10] w-full overflow-hidden bg-neutral-900 border-b border-white/5 relative">
                <img
                  src={service.imageUrl}
                  alt={service.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1542038784456-1ea8e935640e?q=80&w=300&auto=format&fit=crop'; }}
                />
              </div>

              {/* Card Body */}
              <div className="p-5 space-y-2">
                <h3 className="text-white font-bold text-sm tracking-wide group-hover:text-[#7A9E3A] transition-colors">{service.title}</h3>
                <p className="text-neutral-400 text-xs leading-relaxed line-clamp-3">{service.description}</p>
              </div>
            </div>

            {/* Actions */}
            <div className="p-5 pt-0 flex gap-2 w-full">
              <button
                type="button"
                onClick={() => { 
                  setEditingItem(service); 
                  setShowForm(true); 
                }}
                disabled={deletingId !== null}
                className="flex-1 min-h-[44px] flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-white/5 hover:bg-[#2F4F2F]/30 text-neutral-300 hover:text-white text-[10px] uppercase tracking-widest font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Pencil size={12} /> Edit
              </button>
              <button
                type="button"
                onClick={() => handleDelete(service)}
                disabled={deletingId !== null}
                className="flex-1 min-h-[44px] flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-white/5 hover:bg-red-500/20 text-neutral-400 hover:text-red-400 text-[10px] uppercase tracking-widest font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {deletingId === service.id ? (
                  <>
                    <div className="w-3 h-3 border-2 border-red-400 border-t-transparent rounded-full animate-spin" />
                    <span>Deleting...</span>
                  </>
                ) : (
                  <>
                    <Trash2 size={12} /> Delete
                  </>
                )}
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {services.length === 0 && <EmptyState label="services" />}

      <DeleteConfirmationModal
        isOpen={deleteConfirmItem !== null}
        onClose={() => setDeleteConfirmItem(null)}
        onConfirm={() => {
          if (deleteConfirmItem) {
            const id = deleteConfirmItem.id;
            setDeleteConfirmItem(null);
            performDelete(id);
          }
        }}
        isDeleting={false}
      />
    </div>
  );
}

function ServiceForm({ initial, onSave, onCancel, onNotify }) {
  const [title, setTitle] = useState(initial?.title || "");
  const [description, setDescription] = useState(initial?.description || "");
  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(initial?.imageUrl || "");
  const firstInputRef = useRef(null);

  useEffect(() => {
    if (firstInputRef.current) {
      firstInputRef.current.focus();
    }
  }, [initial]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!initial && !imageFile) {
      onNotify("warning", "Please select an image file to upload.");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    if (imageFile) {
      formData.append("image", imageFile);
    }
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <FormField ref={firstInputRef} label="Title" value={title} onChange={setTitle} required placeholder="e.g. Wedding Photography" />
      <FormField label="Description" value={description} onChange={setDescription} isTextarea required placeholder="Enter service description..." />
      
      {/* Upload Dropzone */}
      <div>
        <label className="text-[10px] uppercase tracking-widest text-neutral-500 block mb-2 font-semibold">
          Service Image
        </label>
        <div className="p-6 rounded-2xl bg-white/[0.02] border border-dashed border-white/10 hover:border-[#2F4F2F]/30 transition-colors flex flex-col items-center justify-center relative overflow-hidden group cursor-pointer min-h-[200px]">
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files[0];
              if (file) {
                setImageFile(file);
                setPreviewUrl(URL.createObjectURL(file));
              }
            }}
            className="absolute inset-0 opacity-0 cursor-pointer z-10 w-full h-full"
          />
          {previewUrl ? (
            <div className="w-full relative aspect-[16/10] rounded-xl overflow-hidden border border-white/10">
              <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-xs font-semibold uppercase tracking-widest text-white z-20">
                Change Image
              </div>
            </div>
          ) : (
            <div className="py-8 flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mb-4 text-neutral-400 group-hover:text-white transition-colors">
                <Camera size={20} />
              </div>
              <p className="text-xs font-bold text-neutral-300">Click or tap to upload image</p>
              <p className="text-[9px] text-neutral-500 mt-1.5 uppercase tracking-wider">PNG, JPG, JPEG, WEBP up to 10MB</p>
            </div>
          )}
        </div>
      </div>

      <FormActions onCancel={onCancel} label={initial ? "Update Service" : "Create Service"} />
    </form>
  );
}

// =====================================================
// GALLERY MANAGER
// =====================================================

function GalleryManager({ onNotify }) {
  const [gallery, setGallery] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingItem, setEditingItem] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [deleteConfirmItem, setDeleteConfirmItem] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const fetchGallery = async () => {
    try {
      const res = await adminGalleryApi.getAll();
      setGallery(res.data);
    } catch (err) {
      console.error("Failed to fetch gallery:", err);
      onNotify("error", "Failed to fetch gallery items");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchGallery(); }, []);

  const handleSave = async (data) => {
    onNotify("info", "Upload in progress...");
    try {
      if (editingItem) {
        await adminGalleryApi.update(editingItem.id, data);
        onNotify("success", "Gallery item updated successfully.");
      } else {
        await adminGalleryApi.create(data);
        onNotify("success", "Gallery image uploaded successfully.");
      }
      setShowForm(false);
      setEditingItem(null);
      fetchGallery();
    } catch (err) {
      onNotify("error", err.response?.data?.message || "Failed to save gallery item");
    }
  };

  const handleDelete = (item) => {
    setDeleteConfirmItem(item);
  };

  const performDelete = async (id) => {
    setDeletingId(id);
    try {
      await adminGalleryApi.delete(id);
      onNotify("success", "Gallery item deleted successfully.");
      fetchGallery();
    } catch (err) {
      onNotify("error", "Failed to delete gallery item");
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-6">
      <SectionHeader
        title="Gallery"
        count={gallery.length}
        onAdd={() => { setEditingItem(null); setShowForm(true); }}
        disabled={deletingId !== null}
      />

      {showForm && (
        <FormCard
          id="gallery-form-card"
          title="Gallery Item"
          subtitle={editingItem ? "Update the selected item below." : "Enter details for the new gallery item."}
          isEditing={!!editingItem}
          onClose={() => { setShowForm(false); setEditingItem(null); }}
        >
          <GalleryForm
            initial={editingItem}
            onSave={handleSave}
            onCancel={() => { setShowForm(false); setEditingItem(null); }}
            onNotify={onNotify}
          />
        </FormCard>
      )}

      {/* Responsive Gallery Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-6">
        {gallery.map((item) => (
          <motion.div
            key={item.id}
            whileHover={{ y: -4 }}
            transition={{ duration: 0.3 }}
            className="group relative bg-white/[0.02] border border-white/5 rounded-3xl overflow-hidden hover:border-[#2F4F2F]/30 transition-all flex flex-col justify-between"
          >
            <div className="aspect-square w-full overflow-hidden bg-neutral-900 relative border-b border-white/5">
              <img
                src={item.imageUrl}
                alt={item.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1542038784456-1ea8e935640e?q=80&w=200&auto=format&fit=crop'; }}
              />
              <div className="absolute top-3 right-3 px-2.5 py-1 rounded-lg bg-black/70 backdrop-blur-md border border-white/10 text-[#7A9E3A] text-[9px] font-bold uppercase tracking-wider">
                {item.category}
              </div>
            </div>
            <div className="p-4 flex-grow flex flex-col justify-between">
              <div>
                <h3 className="text-white font-bold text-xs truncate group-hover:text-[#7A9E3A] transition-colors">{item.title}</h3>
                <p className="text-neutral-500 text-[10px] mt-1 line-clamp-2 leading-relaxed">{item.description || "No description provided."}</p>
              </div>
              <div className="flex gap-2 mt-4">
                <button
                  type="button"
                  onClick={() => { 
                    setEditingItem(item); 
                    setShowForm(true); 
                  }}
                  disabled={deletingId !== null}
                  className="flex-1 min-h-[44px] flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-white/5 hover:bg-[#2F4F2F]/30 text-neutral-300 hover:text-white text-[9px] uppercase tracking-wider font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Pencil size={11} /> Edit
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(item)}
                  disabled={deletingId !== null}
                  className="flex-1 min-h-[44px] flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-white/5 hover:bg-red-500/20 text-neutral-400 hover:text-red-400 text-[9px] uppercase tracking-wider font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {deletingId === item.id ? (
                    <>
                      <div className="w-3 h-3 border-2 border-red-400 border-t-transparent rounded-full animate-spin" />
                      <span>Deleting...</span>
                    </>
                  ) : (
                    <>
                      <Trash2 size={11} /> Delete
                    </>
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {gallery.length === 0 && <EmptyState label="gallery items" />}

      <DeleteConfirmationModal
        isOpen={deleteConfirmItem !== null}
        onClose={() => setDeleteConfirmItem(null)}
        onConfirm={() => {
          if (deleteConfirmItem) {
            const id = deleteConfirmItem.id;
            setDeleteConfirmItem(null);
            performDelete(id);
          }
        }}
        isDeleting={false}
      />
    </div>
  );
}

function GalleryForm({ initial, onSave, onCancel, onNotify }) {
  const [title, setTitle] = useState(initial?.title || "");
  const [category, setCategory] = useState(initial?.category || "");
  const [description, setDescription] = useState(initial?.description || "");
  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(initial?.imageUrl || "");
  const firstInputRef = useRef(null);

  useEffect(() => {
    if (firstInputRef.current) {
      firstInputRef.current.focus();
    }
  }, [initial]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!initial && !imageFile) {
      onNotify("warning", "Please select an image file to upload.");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("category", category);
    formData.append("description", description);
    if (imageFile) {
      formData.append("image", imageFile);
    }
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <FormField ref={firstInputRef} label="Title" value={title} onChange={setTitle} required placeholder="e.g. The Sacred Vows" />
      <FormField label="Category" value={category} onChange={setCategory} placeholder="e.g. Wedding, Pre Wedding, Portrait" required />
      
      {/* Upload Dropzone */}
      <div>
        <label className="text-[10px] uppercase tracking-widest text-neutral-500 block mb-2 font-semibold">
          Gallery Image
        </label>
        <div className="p-6 rounded-2xl bg-white/[0.02] border border-dashed border-white/10 hover:border-[#2F4F2F]/30 transition-colors flex flex-col items-center justify-center relative overflow-hidden group cursor-pointer min-h-[200px]">
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files[0];
              if (file) {
                setImageFile(file);
                setPreviewUrl(URL.createObjectURL(file));
              }
            }}
            className="absolute inset-0 opacity-0 cursor-pointer z-10 w-full h-full"
          />
          {previewUrl ? (
            <div className="w-full relative aspect-square max-w-[260px] rounded-xl overflow-hidden border border-white/10 mx-auto">
              <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-xs font-semibold uppercase tracking-widest text-white z-20">
                Change Image
              </div>
            </div>
          ) : (
            <div className="py-8 flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mb-4 text-neutral-400 group-hover:text-white transition-colors">
                <Camera size={20} />
              </div>
              <p className="text-xs font-bold text-neutral-300">Click or tap to upload image</p>
              <p className="text-[9px] text-neutral-500 mt-1.5 uppercase tracking-wider">PNG, JPG, JPEG, WEBP up to 10MB</p>
            </div>
          )}
        </div>
      </div>

      <FormField label="Description" value={description} onChange={setDescription} placeholder="Album name or image details..." />
      <FormActions onCancel={onCancel} label={initial ? "Update Gallery Item" : "Create Gallery Item"} />
    </form>
  );
}

// =====================================================
// CONTACT MANAGER
// =====================================================

function PreviewCard({ form }) {
  const formatInstagram = (url) => {
    if (!url) return "";
    try {
      const cleanUrl = url.split("?")[0].replace(/\/$/, "");
      if (cleanUrl.includes("instagram.com/")) {
        const parts = cleanUrl.split("instagram.com/");
        return `@${parts[parts.length - 1]}`;
      }
    } catch (e) {}
    return url;
  };

  const formatYouTube = (url) => {
    if (!url) return "";
    try {
      const cleanUrl = url.split("?")[0].replace(/\/$/, "");
      if (cleanUrl.includes("youtube.com/")) {
        const parts = cleanUrl.split("youtube.com/");
        const handle = parts[parts.length - 1];
        return handle.startsWith("@") ? handle : `@${handle}`;
      }
    } catch (e) {}
    return "YouTube Channel";
  };

  const previewItems = [
    { label: "Studio Phone Number", value: form.phone, icon: <Phone className="w-4 h-4 text-[#4F7F4F]" /> },
    { label: "WhatsApp Number", value: form.whatsapp, icon: <MessageCircle className="w-4 h-4 text-[#4F7F4F]" /> },
    { label: "Email Address", value: form.email, icon: <Mail className="w-4 h-4 text-[#4F7F4F]" /> },
    { label: "Instagram Profile", value: formatInstagram(form.instagram), icon: <Instagram className="w-4 h-4 text-[#4F7F4F]" /> },
    ...(form.youtube ? [{ label: "YouTube Channel", value: formatYouTube(form.youtube), icon: <Youtube className="w-4 h-4 text-[#4F7F4F]" /> }] : []),
    {
      label: form.addresses && form.addresses.length > 1 ? "Studio Addresses" : "Studio Address",
      value: form.addresses && form.addresses.length > 0 ? (
        <div className="space-y-2">
          {form.addresses.map((addr, idx) => (
            <div key={idx} className={idx > 0 ? "pt-2 border-t border-white/5" : ""}>
              {addr}
            </div>
          ))}
        </div>
      ) : form.address,
      icon: <MapPin className="w-4 h-4 text-[#4F7F4F]" />
    }
  ].filter(item => item.value);

  return (
    <div className="bg-gradient-to-br from-[#F7F8F1] to-[#EFF1E8] rounded-3xl p-6 sm:p-8 border border-neutral-200/40 relative overflow-hidden shadow-2xl flex flex-col justify-between h-full min-h-[450px]">
      {/* Blurred decorative spots for luxury background styling */}
      <div className="w-48 h-48 rounded-full bg-[#2F4F2F]/5 blur-2xl absolute -top-10 -right-10 pointer-events-none" />
      <div className="w-48 h-48 rounded-full bg-[#2F4F2F]/5 blur-2xl absolute -bottom-10 -left-10 pointer-events-none" />
      
      <div className="relative z-10 space-y-6">
        <div>
          <span className="text-[9px] uppercase tracking-[0.4em] font-semibold text-[#2F4F2F] block">
            Let's Co-create
          </span>
          <h4 className="font-serif text-2xl font-normal text-neutral-800 mt-1">
            Get in <span className="italic font-light">Touch</span>
          </h4>
          <p className="text-[10px] text-neutral-500 font-sans mt-2 leading-relaxed">
            Live Preview of how this section will look on the public website.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {previewItems.map((item, idx) => (
            <div 
              key={idx} 
              className="bg-white border border-neutral-200/40 rounded-2xl p-4 flex flex-col justify-between"
            >
              <div>
                <div className="p-2 bg-[#F7F8F1] border border-neutral-200/30 rounded-lg w-fit">
                  {item.icon}
                </div>
                <span className="text-[9px] uppercase tracking-wider font-semibold text-[#2F4F2F] block mt-3">
                  {item.label}
                </span>
                <div className="font-sans text-xs font-medium text-neutral-800 mt-1 break-all leading-normal">
                  {item.value || "—"}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="relative z-10 border-t border-neutral-200/60 pt-4 mt-6 flex items-center justify-between">
        <span className="text-[9px] uppercase tracking-widest font-semibold text-neutral-500">
          Aravinth Photography
        </span>
        <span className="text-[8px] uppercase tracking-widest font-semibold px-2 py-1 bg-white border border-neutral-200/40 rounded-full text-neutral-500">
          CMS Preview
        </span>
      </div>
    </div>
  );
}

function ContactManager({ onNotify }) {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({});
  const [saving, setSaving] = useState(false);
  const firstInputRef = useRef(null);

  const fetchContact = async () => {
    try {
      const res = await adminContactApi.getAll();
      setContacts(res.data);
      if (res.data.length > 0) {
        const contactData = { ...res.data[0] };
        if (!contactData.addresses) {
          contactData.addresses = contactData.address ? [contactData.address] : [];
        }
        setForm(contactData);
      }
    } catch (err) {
      console.error("Failed to fetch contact:", err);
      onNotify("error", "Failed to fetch contact details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContact();
  }, []);

  useEffect(() => {
    if (!loading && firstInputRef.current) {
      firstInputRef.current.focus();
    }
  }, [loading]);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      // Synchronize primary address to ensure legacy columns remain updated
      const updatedForm = { ...form };
      updatedForm.address = form.addresses && form.addresses.length > 0 ? form.addresses[0] : "";
      
      await adminContactApi.update(updatedForm.id, updatedForm);
      onNotify("success", "Contact information saved.");
      fetchContact();
    } catch (err) {
      onNotify("error", err.response?.data?.message || "Failed to update contact");
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    if (contacts.length > 0) {
      const contactData = { ...contacts[0] };
      if (!contactData.addresses) {
        contactData.addresses = contactData.address ? [contactData.address] : [];
      }
      setForm(contactData);
      onNotify("info", "Changes reset to saved values.");
    }
  };

  if (loading) return <LoadingSpinner />;

  const contact = contacts[0];
  if (!contact) return <EmptyState label="contact information" />;

  const fields = [
    { key: "phone", label: "Studio Phone Number", placeholder: "Enter studio phone number" },
    { key: "whatsapp", label: "WhatsApp Number", placeholder: "Enter WhatsApp number with country code" },
    { key: "email", label: "Email Address", placeholder: "Enter email address" },
    { key: "instagram", label: "Instagram Profile URL", placeholder: "https://instagram.com/yourstudio" },
    { key: "youtube", label: "YouTube Channel URL", placeholder: "https://youtube.com/@yourchannel" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-white font-bold text-lg tracking-wide">Contact Details</h2>
        <p className="text-neutral-500 text-[10px] uppercase tracking-widest mt-1">
          Manage your photography studio contact portals
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        {/* Left Side: Contact Information Form */}
        <form onSubmit={handleSave} className="lg:col-span-6 space-y-6 bg-white/[0.02] border border-white/5 p-5 sm:p-6 rounded-3xl flex flex-col justify-between">
          <div className="space-y-5">
            {fields.map(({ key, label, placeholder }, idx) => (
              <div key={key}>
                <label className="text-[10px] uppercase tracking-widest text-neutral-400 font-semibold block mb-2">
                  {label}
                </label>
                <input
                  ref={idx === 0 ? firstInputRef : null}
                  type={key === "email" ? "email" : "text"}
                  value={form[key] || ""}
                  onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                  placeholder={placeholder}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-white text-sm placeholder:text-neutral-600 focus:outline-none focus:border-[#2F4F2F] transition-colors"
                />
              </div>
            ))}

            {/* Dynamic Address List Editor */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between gap-2">
                <label className="text-[10px] uppercase tracking-widest text-neutral-400 font-semibold block">
                  Studio Addresses
                </label>
                <button
                  type="button"
                  onClick={() => {
                    const currentAddresses = form.addresses ? [...form.addresses] : [];
                    setForm({ ...form, addresses: [...currentAddresses, ""] });
                  }}
                  className="flex items-center gap-1.5 px-4 py-2.5 sm:px-3 sm:py-1.5 bg-white/5 hover:bg-white/10 border border-white/5 rounded-lg text-xs sm:text-[9px] uppercase tracking-wider font-bold transition-all text-neutral-300 cursor-pointer"
                >
                  <Plus size={12} /> Add Address
                </button>
              </div>
              
              <div className="space-y-3">
                {(!form.addresses || form.addresses.length === 0) ? (
                  <p className="text-xs text-neutral-600 italic">No addresses added. Add at least one address.</p>
                ) : (
                  form.addresses.map((addr, idx) => (
                    <div key={idx} className="flex gap-2 items-start">
                      <textarea
                        value={addr}
                        onChange={(e) => {
                          const newAddresses = [...form.addresses];
                          newAddresses[idx] = e.target.value;
                          setForm({ ...form, addresses: newAddresses });
                        }}
                        placeholder="Enter studio address"
                        className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder:text-neutral-600 focus:outline-none focus:border-[#2F4F2F] transition-colors resize-none"
                        rows={2}
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const newAddresses = form.addresses.filter((_, i) => i !== idx);
                          setForm({ ...form, addresses: newAddresses });
                        }}
                        className="p-4 bg-red-950/20 hover:bg-red-900/40 border border-red-900/20 text-red-400 rounded-xl transition-all cursor-pointer mt-0.5 min-h-[44px] flex items-center justify-center"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-6 mt-6 border-t border-white/5">
            <button
              type="submit"
              disabled={saving}
              className="w-full sm:w-auto min-h-[44px] flex items-center justify-center gap-2 px-5 py-3 bg-[#2F4F2F] hover:bg-[#3F5F3F] disabled:opacity-50 rounded-xl text-xs sm:text-[10px] uppercase tracking-widest font-bold transition-all text-white cursor-pointer shadow-lg shadow-[#2F4F2F]/10"
            >
              <Save size={14} /> {saving ? "Saving..." : "Save Changes"}
            </button>
            <button
              type="button"
              onClick={handleReset}
              className="w-full sm:w-auto min-h-[44px] flex items-center justify-center gap-2 px-5 py-3 bg-white/5 hover:bg-white/10 rounded-xl text-xs sm:text-[10px] uppercase tracking-widest font-bold text-neutral-400 transition-all cursor-pointer"
            >
              <RotateCcw size={14} /> Reset Changes
            </button>
          </div>
        </form>

        {/* Right Side: Live Preview Card */}
        <div className="lg:col-span-6 h-full">
          <PreviewCard form={form} />
        </div>
      </div>
    </div>
  );
}

// =====================================================
// SHARED UI COMPONENTS
// =====================================================

function SectionHeader({ title, count, onAdd, disabled }) {
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

function FormCard({ id, title, subtitle, isEditing, children, onClose }) {
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

const FormField = React.forwardRef(({ label, value, onChange, required, isTextarea, placeholder, type = "text" }, ref) => {
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

function FormActions({ onCancel, label }) {
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

function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center py-20">
      <div className="w-8 h-8 border-2 border-[#2F4F2F] border-t-transparent rounded-full animate-spin" />
    </div>
  );
}

function EmptyState({ label }) {
  return (
    <div className="text-center py-16 border border-dashed border-white/10 rounded-2xl mt-6">
      <p className="text-neutral-600 text-xs tracking-wide">No {label} found. Click "Add New" to create one.</p>
    </div>
  );
}
