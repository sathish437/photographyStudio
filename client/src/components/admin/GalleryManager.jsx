import React, { useState, useEffect, useRef, useMemo } from "react";
import { Camera, Pencil, Trash2, Search } from "lucide-react";
import { motion } from "framer-motion";
import { adminGalleryApi } from "../../api/api";
import DeleteConfirmationModal from "../DeleteConfirmationModal";
import { SectionHeader, FormCard, FormField, FormActions, LoadingSpinner, EmptyState } from "./AdminShared";
import { getOptimizedImageUrl } from "../../utils/imageUtils";

export default function GalleryManager({ onNotify }) {
  const [gallery, setGallery] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingItem, setEditingItem] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [deleteConfirmItem, setDeleteConfirmItem] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("ALL");

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

  // Extract unique categories for filtering
  const categories = useMemo(() => {
    const set = new Set(gallery.map(item => item.category).filter(Boolean));
    return ["ALL", ...Array.from(set)];
  }, [gallery]);

  // Filtered list
  const filteredGallery = useMemo(() => {
    return gallery.filter(item => {
      const matchesCategory = selectedCategory === "ALL" || item.category === selectedCategory;
      const matchesSearch = !searchQuery || 
        item.title?.toLowerCase().includes(searchQuery.toLowerCase()) || 
        item.description?.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [gallery, selectedCategory, searchQuery]);

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
    <div className="space-y-6 font-sans">
      <SectionHeader
        title="Gallery"
        count={filteredGallery.length}
        onAdd={() => { setEditingItem(null); setShowForm(true); }}
        disabled={deletingId !== null}
      />

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-stretch sm:items-center bg-white/[0.03] border border-white/10 p-4 rounded-2xl shadow-sm backdrop-blur-xl">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search gallery by title or album..."
            className="w-full bg-white/5 border border-white/10 rounded-xl pl-11 pr-4 py-2.5 text-xs font-sans text-white placeholder:text-neutral-500 focus:outline-none focus:border-[#2F4F2F] focus:ring-2 focus:ring-[#2F4F2F]/20 transition-all"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-[10px] uppercase font-sans tracking-[0.2em] font-bold transition-all whitespace-nowrap cursor-pointer ${
                selectedCategory === cat
                  ? "bg-[#2F4F2F] text-white shadow-md shadow-[#2F4F2F]/20"
                  : "bg-white/5 text-neutral-400 hover:text-white hover:bg-white/10 border border-white/5"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

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
        {filteredGallery.map((item) => (
          <motion.div
            key={item.id}
            whileHover={{ y: -6 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="group relative bg-white/[0.03] border border-white/10 rounded-3xl overflow-hidden hover:border-[#2F4F2F]/40 shadow-xl transition-all duration-300 flex flex-col justify-between"
          >
            <div className="aspect-square w-full overflow-hidden bg-neutral-900 relative border-b border-white/10">
              <img
                src={getOptimizedImageUrl(item.imageUrl, 400)}
                alt={item.title}
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1542038784456-1ea8e935640e?q=80&w=200&auto=format&fit=crop'; }}
              />
              <div className="absolute top-3 right-3 px-3 py-1 rounded-xl bg-black/70 backdrop-blur-md border border-white/10 text-[#7A9E3A] text-[9px] font-sans font-bold uppercase tracking-[0.2em]">
                {item.category}
              </div>
            </div>
            <div className="p-5 flex-grow flex flex-col justify-between space-y-4">
              <div>
                <h3 className="text-white font-serif text-lg font-normal truncate group-hover:text-[#7A9E3A] transition-colors">
                  {item.title}
                </h3>
                <p className="text-neutral-400 text-xs font-sans mt-1 line-clamp-2 leading-relaxed">
                  {item.description || "No description provided."}
                </p>
              </div>
              <div className="flex gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => { 
                    setEditingItem(item); 
                    setShowForm(true); 
                  }}
                  disabled={deletingId !== null}
                  className="flex-1 h-11 flex items-center justify-center gap-1.5 rounded-xl bg-white/5 hover:bg-[#2F4F2F]/30 text-neutral-300 hover:text-white text-[10px] font-sans uppercase tracking-[0.2em] font-bold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  <Pencil size={13} /> Edit
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(item)}
                  disabled={deletingId !== null}
                  className="flex-1 h-11 flex items-center justify-center gap-1.5 rounded-xl bg-white/5 hover:bg-red-500/20 text-neutral-400 hover:text-red-400 text-[10px] font-sans uppercase tracking-[0.2em] font-bold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  {deletingId === item.id ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-red-400 border-t-transparent rounded-full animate-spin" />
                      <span>Deleting...</span>
                    </>
                  ) : (
                    <>
                      <Trash2 size={13} /> Delete
                    </>
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {filteredGallery.length === 0 && <EmptyState label="gallery items" />}

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
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <FormField ref={firstInputRef} label="Title" value={title} onChange={setTitle} required placeholder="e.g. Cinematic Wedding" />
        <FormField label="Category / Album" value={category} onChange={setCategory} required placeholder="e.g. Wedding, Pre-Wedding, Portrait" />
      </div>

      <FormField label="Description" value={description} onChange={setDescription} isTextarea placeholder="Enter gallery item description..." />

      {/* Upload Dropzone */}
      <div className="space-y-2">
        <label className="text-[10px] uppercase font-sans font-bold tracking-[0.2em] text-neutral-400 block">
          Photo Asset
        </label>
        <div className="p-6 rounded-2xl bg-white/[0.02] border border-dashed border-white/10 hover:border-[#2F4F2F]/40 transition-colors flex flex-col items-center justify-center relative overflow-hidden group cursor-pointer min-h-[200px]">
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
            <div className="w-full relative aspect-square max-w-xs rounded-2xl overflow-hidden border border-white/10 mx-auto">
              <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-xs font-sans font-semibold uppercase tracking-widest text-white z-20">
                Change Image
              </div>
            </div>
          ) : (
            <div className="py-8 flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mb-4 text-neutral-400 group-hover:text-white transition-colors">
                <Camera size={22} />
              </div>
              <p className="text-xs font-sans font-bold text-neutral-300">Click or tap to upload photo</p>
              <p className="text-[9px] font-sans text-neutral-500 mt-1.5 uppercase tracking-wider">PNG, JPG, JPEG, WEBP up to 30MB</p>
            </div>
          )}
        </div>
      </div>

      <FormActions onCancel={onCancel} label={initial ? "Update Item" : "Upload Item"} />
    </form>
  );
}
