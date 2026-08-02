import React, { useState, useEffect, useRef } from "react";
import { Phone, MessageCircle, Mail, Instagram, Youtube, MapPin, Plus, Trash2, Save, RotateCcw } from "lucide-react";
import { adminContactApi } from "../../api/api";
import { LoadingSpinner, EmptyState } from "./AdminShared";

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

export default function ContactManager({ onNotify }) {
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
