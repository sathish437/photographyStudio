import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  LogOut, Camera, Image, Phone, Plus, Pencil, Trash2, Save, X,
  LayoutDashboard, ChevronRight, Eye, Youtube, RotateCcw, MessageCircle, Mail, Instagram, MapPin
} from "lucide-react";
import { authApi, adminServicesApi, adminGalleryApi, adminContactApi, BASE_URL } from "../api/api";

// =====================================================
// ADMIN PANEL — Full CMS for Photography Studio
// =====================================================

export default function AdminPanel() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [adminUser, setAdminUser] = useState(null);
  const [activeTab, setActiveTab] = useState("services");

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

  return (
    <div className="min-h-screen bg-[#0F0F0F] text-white font-sans">
      {/* Top Header Bar */}
      <header className="sticky top-0 z-50 bg-[#0F0F0F]/95 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-gradient-to-br from-[#2F4F2F] to-[#5A8A5A] rounded-xl flex items-center justify-center">
              <LayoutDashboard size={18} />
            </div>
            <div>
              <h1 className="text-sm font-bold tracking-wide">CMS Dashboard</h1>
              <p className="text-[10px] text-neutral-500 uppercase tracking-widest">Aravinth Photography</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <a
              href="/"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 text-[10px] uppercase tracking-widest text-neutral-400 hover:text-[#7A9E3A] transition-colors"
            >
              <Eye size={12} />
              View Site
            </a>
            <div className="flex items-center gap-2 px-3 py-1.5 bg-white/5 rounded-full">
              <div className="w-2 h-2 rounded-full bg-[#7A9E3A]" />
              <span className="text-[10px] uppercase tracking-widest text-neutral-400">{adminUser?.username}</span>
            </div>
            <button
              onClick={handleLogout}
              className="p-2 rounded-xl bg-white/5 hover:bg-red-500/20 hover:text-red-400 transition-all"
              title="Logout"
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </header>

      {/* Tab Navigation */}
      <nav className="max-w-7xl mx-auto px-6 pt-6">
        <div className="flex gap-1 bg-white/5 p-1 rounded-2xl w-fit">
          {[
            { key: "services", label: "Services", icon: Camera },
            { key: "gallery", label: "Gallery", icon: Image },
            { key: "contact", label: "Contact", icon: Phone },
          ].map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-widest transition-all ${
                activeTab === key
                  ? "bg-[#2F4F2F] text-white shadow-lg"
                  : "text-neutral-500 hover:text-white hover:bg-white/5"
              }`}
            >
              <Icon size={14} />
              {label}
            </button>
          ))}
        </div>
      </nav>

      {/* Content Area */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {activeTab === "services" && <ServicesManager />}
        {activeTab === "gallery" && <GalleryManager />}
        {activeTab === "contact" && <ContactManager />}
      </main>
    </div>
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

function ServicesManager() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingItem, setEditingItem] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const fetchServices = async () => {
    try {
      const res = await adminServicesApi.getAll();
      setServices(res.data);
    } catch (err) {
      console.error("Failed to fetch services:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchServices(); }, []);

  const handleSave = async (data) => {
    try {
      if (editingItem) {
        await adminServicesApi.update(editingItem.id, data);
      } else {
        await adminServicesApi.create(data);
      }
      setShowForm(false);
      setEditingItem(null);
      fetchServices();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to save service");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this service?")) return;
    try {
      await adminServicesApi.delete(id);
      fetchServices();
    } catch (err) {
      alert("Failed to delete service");
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div>
      <SectionHeader
        title="Services"
        count={services.length}
        onAdd={() => { setEditingItem(null); setShowForm(true); }}
      />

      {showForm && (
        <FormCard
          title={editingItem ? "Edit Service" : "Add New Service"}
          onClose={() => { setShowForm(false); setEditingItem(null); }}
        >
          <ServiceForm
            initial={editingItem}
            onSave={handleSave}
            onCancel={() => { setShowForm(false); setEditingItem(null); }}
          />
        </FormCard>
      )}

      <div className="space-y-4 mt-6">
        {services.map((service) => (
          <div
            key={service.id}
            className="flex flex-col md:flex-row items-center justify-between p-5 bg-white/[0.03] border border-white/5 rounded-2xl hover:border-[#2F4F2F]/30 transition-all gap-4"
          >
            <div className="flex items-center gap-4 w-full md:w-auto">
              <div className="w-20 h-20 rounded-xl overflow-hidden border border-white/10 bg-neutral-900 flex-shrink-0">
                <img
                  src={service.imageUrl && (service.imageUrl.startsWith("http://") || service.imageUrl.startsWith("https://")) ? service.imageUrl : `${BASE_URL}${service.imageUrl}`}
                  alt={service.title}
                  className="w-full h-full object-cover"
                  onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1542038784456-1ea8e935640e?q=80&w=200&auto=format&fit=crop'; }}
                />
              </div>
              <div>
                <h3 className="text-white font-semibold text-sm">{service.title}</h3>
                <p className="text-neutral-500 text-xs mt-1 leading-relaxed line-clamp-2 md:line-clamp-1">{service.description}</p>
              </div>
            </div>
            <div className="flex gap-2 w-full md:w-auto justify-end">
              <button
                onClick={() => { setEditingItem(service); setShowForm(true); }}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white/5 hover:bg-[#2F4F2F]/30 text-neutral-400 hover:text-white text-[10px] uppercase tracking-widest transition-all"
              >
                <Pencil size={11} /> Edit
              </button>
              <button
                onClick={() => handleDelete(service.id)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white/5 hover:bg-red-500/20 text-neutral-400 hover:text-red-400 text-[10px] uppercase tracking-widest transition-all"
              >
                <Trash2 size={11} /> Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {services.length === 0 && <EmptyState label="services" />}
    </div>
  );
}

function ServiceForm({ initial, onSave, onCancel }) {
  const [title, setTitle] = useState(initial?.title || "");
  const [description, setDescription] = useState(initial?.description || "");
  const [imageFile, setImageFile] = useState(null);
  const [imageUrl, setImageUrl] = useState(initial?.imageType === "URL" ? initial.imagePath : "");
  const [previewUrl, setPreviewUrl] = useState(
    initial?.imageUrl && (initial.imageUrl.startsWith("http://") || initial.imageUrl.startsWith("https://"))
      ? initial.imageUrl
      : initial?.imageUrl
      ? `${BASE_URL}${initial.imageUrl}`
      : ""
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    const hasImage = !!imageFile;
    const hasUrl = !!imageUrl.trim();

    if (!initial) {
      if (hasImage && hasUrl) {
        alert("Please provide either an uploaded image or an image URL, but not both.");
        return;
      }
      if (!hasImage && !hasUrl) {
        alert("Please provide either an uploaded image or an image URL, but not both.");
        return;
      }
    } else {
      if (hasImage && hasUrl) {
        alert("Please provide either an uploaded image or an image URL, but not both.");
        return;
      }
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    if (imageFile) {
      formData.append("image", imageFile);
    }
    if (imageUrl.trim()) {
      formData.append("imageUrl", imageUrl.trim());
    }
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {initial && (
        <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5">
          <span className="text-[10px] uppercase tracking-widest text-neutral-500 block mb-2">Current Image</span>
          <div className="w-40 h-24 rounded-2xl overflow-hidden border border-white/10 bg-neutral-900">
            <img src={previewUrl} alt="Current" className="w-full h-full object-cover" onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1542038784456-1ea8e935640e?q=80&w=300&auto=format&fit=crop'; }} />
          </div>
        </div>
      )}

      <FormField label="Title" value={title} onChange={setTitle} required />
      <FormField label="Description" value={description} onChange={setDescription} isTextarea required />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
        {/* Upload file */}
        <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5">
          <label className="text-[10px] uppercase tracking-widest text-neutral-500 block mb-2">
            Upload Image
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files[0];
              if (file) {
                setImageFile(file);
                setImageUrl(""); // clear URL field when choosing a file
              }
            }}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#2F4F2F] transition-colors"
          />
        </div>

        {/* Enter URL */}
        <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5">
          <label className="text-[10px] uppercase tracking-widest text-neutral-500 block mb-2">
            Image URL
          </label>
          <input
            type="text"
            value={imageUrl}
            onChange={(e) => {
              const val = e.target.value;
              setImageUrl(val);
              if (val.trim()) {
                setImageFile(null); // clear file field when typing a URL
              }
            }}
            placeholder="https://images.unsplash.com/..."
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder:text-neutral-600 focus:outline-none focus:border-[#2F4F2F] transition-colors"
          />
        </div>
      </div>

      <FormActions onCancel={onCancel} label={initial ? "Update" : "Create"} />
    </form>
  );
}

// =====================================================
// GALLERY MANAGER
// =====================================================

function GalleryManager() {
  const [gallery, setGallery] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingItem, setEditingItem] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const fetchGallery = async () => {
    try {
      const res = await adminGalleryApi.getAll();
      setGallery(res.data);
    } catch (err) {
      console.error("Failed to fetch gallery:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchGallery(); }, []);

  const handleSave = async (data) => {
    try {
      if (editingItem) {
        await adminGalleryApi.update(editingItem.id, data);
      } else {
        await adminGalleryApi.create(data);
      }
      setShowForm(false);
      setEditingItem(null);
      fetchGallery();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to save gallery item");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this gallery item?")) return;
    try {
      await adminGalleryApi.delete(id);
      fetchGallery();
    } catch (err) {
      alert("Failed to delete gallery item");
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div>
      <SectionHeader
        title="Gallery"
        count={gallery.length}
        onAdd={() => { setEditingItem(null); setShowForm(true); }}
      />

      {showForm && (
        <FormCard
          title={editingItem ? "Edit Gallery Item" : "Add Gallery Item"}
          onClose={() => { setShowForm(false); setEditingItem(null); }}
        >
          <GalleryForm
            initial={editingItem}
            onSave={handleSave}
            onCancel={() => { setShowForm(false); setEditingItem(null); }}
          />
        </FormCard>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-6">
        {gallery.map((item) => (
          <div
            key={item.id}
            className="group relative bg-white/[0.03] border border-white/5 rounded-2xl overflow-hidden hover:border-[#2F4F2F]/30 transition-all flex flex-col justify-between"
          >
            <div className="aspect-square w-full overflow-hidden bg-neutral-900 relative">
              <img
                src={item.imagePath && (item.imagePath.startsWith("http://") || item.imagePath.startsWith("https://")) ? item.imagePath : `${BASE_URL}${item.imagePath}`}
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1542038784456-1ea8e935640e?q=80&w=200&auto=format&fit=crop'; }}
              />
              <div className="absolute top-2 right-2 px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-sm border border-white/10 text-[#7A9E3A] text-[9px] font-bold uppercase tracking-wider">
                {item.category}
              </div>
            </div>
            <div className="p-4 flex-grow flex flex-col justify-between">
              <div>
                <h3 className="text-white font-medium text-xs truncate">{item.title}</h3>
                <p className="text-neutral-500 text-[10px] mt-1 line-clamp-2 leading-relaxed">{item.description}</p>
              </div>
              <div className="flex gap-2 mt-4">
                <button
                  onClick={() => { setEditingItem(item); setShowForm(true); }}
                  className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg bg-white/5 hover:bg-[#2F4F2F]/30 text-neutral-400 hover:text-white text-[9px] uppercase tracking-wider transition-all"
                >
                  <Pencil size={10} /> Edit
                </button>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg bg-white/5 hover:bg-red-500/20 text-neutral-400 hover:text-red-400 text-[9px] uppercase tracking-wider transition-all"
                >
                  <Trash2 size={10} /> Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {gallery.length === 0 && <EmptyState label="gallery items" />}
    </div>
  );
}

function GalleryForm({ initial, onSave, onCancel }) {
  const [title, setTitle] = useState(initial?.title || "");
  const [category, setCategory] = useState(initial?.category || "");
  const [description, setDescription] = useState(initial?.description || "");
  const [imageFile, setImageFile] = useState(null);
  const [imageUrl, setImageUrl] = useState(initial?.imageType === "URL" ? initial.imagePath : "");
  const [previewUrl, setPreviewUrl] = useState(
    initial?.imagePath && (initial.imagePath.startsWith("http://") || initial.imagePath.startsWith("https://"))
      ? initial.imagePath
      : initial?.imagePath
      ? `${BASE_URL}${initial.imagePath}`
      : ""
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    const hasImage = !!imageFile;
    const hasUrl = !!imageUrl.trim();

    if (!initial) {
      if (hasImage && hasUrl) {
        alert("Please provide either an uploaded image or an image URL, but not both.");
        return;
      }
      if (!hasImage && !hasUrl) {
        alert("Please provide either an uploaded image or an image URL, but not both.");
        return;
      }
    } else {
      if (hasImage && hasUrl) {
        alert("Please provide either an uploaded image or an image URL, but not both.");
        return;
      }
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("category", category);
    formData.append("description", description);
    if (imageFile) {
      formData.append("image", imageFile);
    }
    if (imageUrl.trim()) {
      formData.append("imageUrl", imageUrl.trim());
    }
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {initial && (
        <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5">
          <span className="text-[10px] uppercase tracking-widest text-neutral-500 block mb-2">Current Image</span>
          <div className="w-40 h-24 rounded-2xl overflow-hidden border border-white/10 bg-neutral-900">
            <img src={previewUrl} alt="Current" className="w-full h-full object-cover" onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1542038784456-1ea8e935640e?q=80&w=300&auto=format&fit=crop'; }} />
          </div>
        </div>
      )}

      <FormField label="Title" value={title} onChange={setTitle} required />
      <FormField label="Category" value={category} onChange={setCategory} placeholder="e.g. Wedding, Birthday" required />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
        {/* Upload file */}
        <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5">
          <label className="text-[10px] uppercase tracking-widest text-neutral-500 block mb-2">
            Upload Image
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files[0];
              if (file) {
                setImageFile(file);
                setImageUrl(""); // clear URL field when choosing a file
              }
            }}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#2F4F2F] transition-colors"
          />
        </div>

        {/* Enter URL */}
        <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5">
          <label className="text-[10px] uppercase tracking-widest text-neutral-500 block mb-2">
            Image URL
          </label>
          <input
            type="text"
            value={imageUrl}
            onChange={(e) => {
              const val = e.target.value;
              setImageUrl(val);
              if (val.trim()) {
                setImageFile(null); // clear file field when typing a URL
              }
            }}
            placeholder="https://images.unsplash.com/..."
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder:text-neutral-600 focus:outline-none focus:border-[#2F4F2F] transition-colors"
          />
        </div>
      </div>

      <FormField label="Description" value={description} onChange={setDescription} placeholder="Album name or description" />
      <FormActions onCancel={onCancel} label={initial ? "Update" : "Create"} />
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
    <div className="bg-gradient-to-br from-[#F7F8F1] to-[#EFF1E8] rounded-3xl p-8 border border-neutral-200/40 relative overflow-hidden shadow-2xl flex flex-col justify-between h-full min-h-[500px]">
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

function ContactManager() {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({});
  const [saving, setSaving] = useState(false);

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
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContact();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      // Synchronize primary address to ensure legacy columns remain updated
      const updatedForm = { ...form };
      updatedForm.address = form.addresses && form.addresses.length > 0 ? form.addresses[0] : "";
      
      await adminContactApi.update(updatedForm.id, updatedForm);
      alert("Contact information updated successfully!");
      fetchContact();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update contact");
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
        <form onSubmit={handleSave} className="lg:col-span-6 space-y-6 bg-white/[0.02] border border-white/5 p-6 rounded-3xl flex flex-col justify-between">
          <div className="space-y-5">
            {fields.map(({ key, label, placeholder }) => (
              <div key={key}>
                <label className="text-[10px] uppercase tracking-widest text-neutral-400 font-semibold block mb-2">
                  {label}
                </label>
                <input
                  type={key === "email" ? "email" : "text"}
                  value={form[key] || ""}
                  onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                  placeholder={placeholder}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder:text-neutral-600 focus:outline-none focus:border-[#2F4F2F] transition-colors"
                />
              </div>
            ))}

            {/* Dynamic Address List Editor */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <label className="text-[10px] uppercase tracking-widest text-neutral-400 font-semibold block">
                  Studio Addresses
                </label>
                <button
                  type="button"
                  onClick={() => {
                    const currentAddresses = form.addresses ? [...form.addresses] : [];
                    setForm({ ...form, addresses: [...currentAddresses, ""] });
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/5 rounded-lg text-[9px] uppercase tracking-wider font-bold transition-all text-neutral-300 cursor-pointer"
                >
                  <Plus size={10} /> Add Address
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
                        className="p-3.5 bg-red-950/20 hover:bg-red-900/40 border border-red-900/20 text-red-400 rounded-xl transition-all cursor-pointer mt-0.5"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          <div className="flex gap-3 pt-6 mt-6 border-t border-white/5">
            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 px-5 py-2.5 bg-[#2F4F2F] hover:bg-[#3F5F3F] disabled:opacity-50 rounded-xl text-[10px] uppercase tracking-widest font-bold transition-all text-white cursor-pointer"
            >
              <Save size={12} /> {saving ? "Saving..." : "Save Changes"}
            </button>
            <button
              type="button"
              onClick={handleReset}
              className="flex items-center gap-2 px-5 py-2.5 bg-white/5 hover:bg-white/10 rounded-xl text-[10px] uppercase tracking-widest font-bold text-neutral-400 transition-all cursor-pointer"
            >
              <RotateCcw size={12} /> Reset Changes
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

function SectionHeader({ title, count, onAdd }) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h2 className="text-white font-bold text-lg tracking-wide">{title}</h2>
        <p className="text-neutral-500 text-[10px] uppercase tracking-widest mt-1">{count} item{count !== 1 ? "s" : ""}</p>
      </div>
      <button
        onClick={onAdd}
        className="flex items-center gap-2 px-4 py-2.5 bg-[#2F4F2F] hover:bg-[#3F5F3F] rounded-xl text-[10px] uppercase tracking-widest font-bold transition-all shadow-lg shadow-[#2F4F2F]/10"
      >
        <Plus size={14} /> Add New
      </button>
    </div>
  );
}

function FormCard({ title, children, onClose }) {
  return (
    <div className="mt-5 bg-white/[0.03] border border-white/10 rounded-2xl p-6 backdrop-blur-xl">
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-white font-semibold text-sm uppercase tracking-widest">{title}</h3>
        <button onClick={onClose} className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-neutral-500 hover:text-white transition-all">
          <X size={14} />
        </button>
      </div>
      {children}
    </div>
  );
}

function FormField({ label, value, onChange, required, isTextarea, placeholder, type = "text" }) {
  const inputClasses = "w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder:text-neutral-600 focus:outline-none focus:border-[#2F4F2F] transition-colors";
  return (
    <div>
      <label className="text-[10px] uppercase tracking-widest text-neutral-500 block mb-2">
        {label} {required && <span className="text-[#7A9E3A]">*</span>}
      </label>
      {isTextarea ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`${inputClasses} resize-none`}
          rows={3}
          required={required}
          placeholder={placeholder}
        />
      ) : (
        <input
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
}

function FormActions({ onCancel, label }) {
  return (
    <div className="flex gap-3 pt-2">
      <button
        type="submit"
        className="flex items-center gap-2 px-5 py-2.5 bg-[#2F4F2F] hover:bg-[#3F5F3F] rounded-xl text-[10px] uppercase tracking-widest font-bold transition-all"
      >
        <Save size={12} /> {label}
      </button>
      <button
        type="button"
        onClick={onCancel}
        className="flex items-center gap-2 px-5 py-2.5 bg-white/5 hover:bg-white/10 rounded-xl text-[10px] uppercase tracking-widest font-bold text-neutral-400 transition-all"
      >
        <X size={12} /> Cancel
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
