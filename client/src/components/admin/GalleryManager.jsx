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
    <div className="space-y-6">
      <SectionHeader
        title="Gallery"
        count={filteredGallery.length}
        onAdd={() => { setEditingItem(null); setShowForm(true); }}
        disabled={deletingId !== null}
      />

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-stretch sm:items-center bg-white/[0.02] border border-white/5 p-4 rounded-2xl">
        <div className="relative flex-1">
          <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search gallery by title or album..."
            className="w-full bg-white/5 border border-white/10 rounded-xl pl-9 pr-4 py-2.5 text-xs text-white placeholder:text-neutral-500 focus:outline-none focus:border-[#2F4F2F]"
          />
        </div>
        <div className="flex gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-2 rounded-xl text-[9px] uppercase tracking-wider font-bold transition-all whitespace-nowrap ${
                selectedCategory === cat
                  ? "bg-[#2F4F2F] text-white shadow-sm"
                  : "bg-white/5 text-neutral-400 hover:text-white"
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
            whileHover={{ y: -4 }}
            transition={{ duration: 0.3 }}
            className="group relative bg-white/[0.02] border border-white/5 rounded-3xl overflow-hidden hover:border-[#2F4F2F]/30 transition-all flex flex-col justify-between"
          >
            <div className="aspect-square w-full overflow-hidden bg-neutral-900 relative border-b border-white/5">
              <img
                src={getOptimizedImageUrl(item.imageUrl, 400)}
                alt={item.title}
                loading="lazy"
                decoding="async"
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
