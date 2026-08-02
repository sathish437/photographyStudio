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
    { label: "Studio Phone Number", value: form.phone, icon: <Phone className="w-4 h-4 text-[#2F4F2F]" /> },
    { label: "WhatsApp Number", value: form.whatsapp, icon: <MessageCircle className="w-4 h-4 text-[#2F4F2F]" /> },
    { label: "Email Address", value: form.email, icon: <Mail className="w-4 h-4 text-[#2F4F2F]" /> },
    { label: "Instagram Profile", value: formatInstagram(form.instagram), icon: <Instagram className="w-4 h-4 text-[#2F4F2F]" /> },
    ...(form.youtube ? [{ label: "YouTube Channel", value: formatYouTube(form.youtube), icon: <Youtube className="w-4 h-4 text-[#2F4F2F]" /> }] : []),
    {
      label: form.addresses && form.addresses.length > 1 ? "Studio Addresses" : "Studio Address",
      value: form.addresses && form.addresses.length > 0 ? (
        <div className="space-y-2">
          {form.addresses.map((addr, idx) => (
            <div key={idx} className={idx > 0 ? "pt-2 border-t border-neutral-100" : ""}>
              {addr}
            </div>
          ))}
        </div>
      ) : form.address,
      icon: <MapPin className="w-4 h-4 text-[#2F4F2F]" />
    }
  ].filter(item => item.value);

  return (
    <div className="bg-[#F7F8F1] rounded-3xl p-6 sm:p-8 border border-neutral-200/50 relative overflow-hidden shadow-2xl flex flex-col justify-between h-full min-h-[450px]">
      <div className="w-48 h-48 rounded-full bg-[#2F4F2F]/5 blur-2xl absolute -top-10 -right-10 pointer-events-none" />
      <div className="w-48 h-48 rounded-full bg-[#2F4F2F]/5 blur-2xl absolute -bottom-10 -left-10 pointer-events-none" />
      
      <div className="relative z-10 space-y-6">
        <div>
          <span className="text-[10px] uppercase font-sans tracking-[0.3em] font-bold text-[#2F4F2F] block">
            Let's Co-create
          </span>
          <h4 className="font-serif text-2xl md:text-3xl font-normal text-neutral-800 mt-1">
            Get in <span className="italic font-light">Touch</span>
          </h4>
          <p className="text-xs text-neutral-500 font-sans mt-2 leading-relaxed">
            Live Preview of how this section will look on the public website.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {previewItems.map((item, idx) => (
            <div 
              key={idx} 
              className="bg-white border border-neutral-200/50 rounded-2xl p-5 flex flex-col justify-between shadow-sm"
            >
              <div>
                <div className="p-2.5 bg-[#F7F8F1] border border-neutral-200/40 rounded-xl w-fit">
                  {item.icon}
                </div>
                <span className="text-[9px] uppercase font-sans tracking-[0.2em] font-bold text-[#2F4F2F] block mt-3">
                  {item.label}
                </span>
                <div className="font-sans text-xs font-semibold text-neutral-800 mt-1 break-all leading-normal">
                  {item.value || "—"}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="relative z-10 border-t border-neutral-200/60 pt-4 mt-6 flex items-center justify-between font-sans">
        <span className="text-[9px] uppercase tracking-widest font-semibold text-neutral-500">
          Aravinth Photography
        </span>
        <span className="text-[8px] uppercase tracking-widest font-bold px-3 py-1 bg-white border border-neutral-200/50 rounded-full text-[#2F4F2F]">
          CMS Live Preview
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
    <div className="space-y-6 font-sans">
      <div>
        <h2 className="text-white font-serif text-2xl md:text-3xl font-normal tracking-wide">Contact Details</h2>
        <p className="text-neutral-500 text-[10px] uppercase font-sans tracking-[0.25em] font-semibold mt-1">
          Manage your photography studio contact portals
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        {/* Left Side: Contact Information Form */}
        <form onSubmit={handleSave} className="lg:col-span-6 space-y-6 bg-white/[0.03] border border-white/10 p-6 sm:p-8 rounded-3xl backdrop-blur-xl flex flex-col justify-between shadow-2xl">
          <div className="space-y-5">
            {fields.map(({ key, label, placeholder }, idx) => (
              <div key={key} className="space-y-2">
                <label className="text-[10px] uppercase font-sans font-bold tracking-[0.2em] text-neutral-400 block">
                  {label}
                </label>
                <input
                  ref={idx === 0 ? firstInputRef : null}
                  type={key === "email" ? "email" : "text"}
                  value={form[key] || ""}
                  onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                  placeholder={placeholder}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm font-sans placeholder:text-neutral-600 focus:outline-none focus:border-[#2F4F2F] focus:ring-2 focus:ring-[#2F4F2F]/20 transition-all"
                />
              </div>
            ))}

            {/* Dynamic Address List Editor */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between gap-2">
                <label className="text-[10px] uppercase font-sans font-bold tracking-[0.2em] text-neutral-400 block">
                  Studio Addresses
                </label>
                <button
                  type="button"
                  onClick={() => {
                    const currentAddresses = form.addresses ? [...form.addresses] : [];
                    setForm({ ...form, addresses: [...currentAddresses, ""] });
                  }}
                  className="h-9 px-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-[10px] uppercase font-sans tracking-[0.2em] font-bold transition-all text-neutral-300 hover:text-white cursor-pointer inline-flex items-center gap-1.5"
                >
                  <Plus size={14} /> Add Address
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
                        className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm font-sans placeholder:text-neutral-600 focus:outline-none focus:border-[#2F4F2F] focus:ring-2 focus:ring-[#2F4F2F]/20 transition-all resize-none"
                        rows={2}
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const newAddresses = form.addresses.filter((_, i) => i !== idx);
                          setForm({ ...form, addresses: newAddresses });
                        }}
                        className="h-11 w-11 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 rounded-xl transition-all cursor-pointer flex items-center justify-center flex-shrink-0"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-6 mt-6 border-t border-white/10">
            <button
              type="submit"
              disabled={saving}
              className="h-11 sm:h-12 px-6 bg-[#2F4F2F] hover:bg-[#3F5F3F] text-white text-[10px] sm:text-xs font-sans font-bold uppercase tracking-[0.2em] rounded-xl shadow-lg shadow-[#2F4F2F]/20 transition-all duration-300 active:scale-95 disabled:opacity-50 inline-flex items-center justify-center gap-2 cursor-pointer flex-1"
            >
              <Save size={16} /> {saving ? "Saving..." : "Save Changes"}
            </button>
            <button
              type="button"
              onClick={handleReset}
              className="h-11 sm:h-12 px-6 bg-white/5 hover:bg-white/10 text-neutral-300 hover:text-white border border-white/10 text-[10px] sm:text-xs font-sans font-bold uppercase tracking-[0.2em] rounded-xl transition-all duration-300 active:scale-95 inline-flex items-center justify-center gap-2 cursor-pointer flex-1"
            >
              <RotateCcw size={16} /> Reset Changes
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
