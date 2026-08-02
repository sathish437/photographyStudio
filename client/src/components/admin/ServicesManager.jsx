import React, { useState, useEffect, useRef } from "react";
import { Camera, Pencil, Trash2 } from "lucide-react";
import { motion } from "framer-motion";
import { adminServicesApi } from "../../api/api";
import DeleteConfirmationModal from "../DeleteConfirmationModal";
import { SectionHeader, FormCard, FormField, FormActions, LoadingSpinner, EmptyState } from "./AdminShared";
import { getOptimizedImageUrl } from "../../utils/imageUtils";

export default function ServicesManager({ onNotify }) {
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
                  src={getOptimizedImageUrl(service.imageUrl, 500)}
                  alt={service.title}
                  loading="lazy"
                  decoding="async"
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
