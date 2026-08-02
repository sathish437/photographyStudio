import React, { memo } from "react";
import { Phone, MessageCircle, Mail, Instagram, ArrowUpRight, MapPin, Youtube } from "lucide-react";
import { motion } from "framer-motion";
import workspaceImg from "../assets/photographer_workspace.png";

function Contact({ contactInfo }) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.12 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 25 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
    }
  };

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

  const fallback = {
    phone: "9500328838",
    whatsapp: "9500379678",
    email: "kuttydigital.tmg@gmail.com",
    instagram: "https://www.instagram.com/kutty_photography_official",
    youtube: "",
    address: "12, Olive Grove Avenue, Near Art District, Chennai, Tamil Nadu - 600018",
    addresses: ["12, Olive Grove Avenue, Near Art District, Chennai, Tamil Nadu - 600018"]
  };

  const info = contactInfo || fallback;
  const addressesList = info.addresses && info.addresses.length > 0
    ? info.addresses
    : (info.address ? [info.address] : []);

  const contactItems = [
    {
      id: "phone",
      label: "Studio Phone",
      value: info.phone || fallback.phone,
      href: `tel:${info.phone || fallback.phone}`,
      icon: <Phone className="w-5 h-5 text-[#2F4F2F]" />
    },
    {
      id: "whatsapp",
      label: "WhatsApp Portal",
      value: info.whatsapp || fallback.whatsapp,
      href: `https://wa.me/${(info.whatsapp || fallback.whatsapp).replace(/[^0-9]/g, "")}`,
      icon: <MessageCircle className="w-5 h-5 text-[#2F4F2F]" />
    },
    {
      id: "email",
      label: "Direct Email",
      value: info.email || fallback.email,
      href: `mailto:${info.email || fallback.email}`,
      icon: <Mail className="w-5 h-5 text-[#2F4F2F]" />
    },
    {
      id: "instagram",
      label: "Instagram Archive",
      value: formatInstagram(info.instagram || fallback.instagram),
      href: info.instagram || fallback.instagram,
      icon: <Instagram className="w-5 h-5 text-[#2F4F2F]" />
    },
    ...(info.youtube ? [{
      id: "youtube",
      label: "YouTube Channel",
      value: formatYouTube(info.youtube),
      href: info.youtube,
      icon: <Youtube className="w-5 h-5 text-[#2F4F2F]" />
    }] : [])
  ];

  return (
    <section id="contact" className="py-14 bg-[#F7F8F1] overflow-hidden border-b border-neutral-200/40">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="flex flex-col md:flex-row md:items-end justify-between mb-10"
        >
          <div>
            <span className="text-[10px] uppercase tracking-[0.4em] font-semibold text-[#2F4F2F]">
              Let's Co-create
            </span>
            <h2 className="font-serif text-4xl md:text-5xl font-normal text-neutral-800 mt-2">
              Get in <span className="italic font-light">Touch</span>
            </h2>
          </div>
          <p className="text-xs text-neutral-500 font-medium max-w-sm mt-4 md:mt-0 tracking-wide font-sans">
            Connect directly with our creative team to reserve dates or inquire about bespoke pricing.
          </p>
        </motion.div>

        {/* Main Grid split */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-stretch">
          
          {/* Left Column: Direct Action Portals */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            className="lg:col-span-7 flex flex-col justify-between space-y-6"
          >
            {/* Contact Portals Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {contactItems.map((item) => (
                <motion.a
                  key={item.id}
                  href={item.href}
                  target={item.id === "instagram" || item.id === "youtube" || item.id === "whatsapp" ? "_blank" : "_self"}
                  rel="noreferrer"
                  variants={itemVariants}
                  whileHover={{ y: -4, scale: 1.015 }}
                  className="group p-6 rounded-3xl bg-white border border-neutral-200/50 hover:border-[#2F4F2F]/30 hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 rounded-xl bg-[#F7F8F1] border border-neutral-200/40 flex items-center justify-center group-hover:bg-[#2F4F2F] group-hover:border-[#2F4F2F] transition-colors">
                      {React.cloneElement(item.icon, {
                        className: "w-5 h-5 text-[#2F4F2F] group-hover:text-white transition-colors"
                      })}
                    </div>
                    <ArrowUpRight size={16} className="text-neutral-400 group-hover:text-[#2F4F2F] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                  </div>

                  <div>
                    <span className="text-[9px] uppercase tracking-[0.2em] font-semibold text-neutral-400 block mb-1">
                      {item.label}
                    </span>
                    <h3 className="font-sans text-sm font-semibold text-neutral-800 group-hover:text-[#2F4F2F] transition-colors truncate">
                      {item.value}
                    </h3>
                  </div>
                </motion.a>
              ))}
            </div>

            {/* Studio Address Card */}
            <motion.div
              variants={itemVariants}
              className="p-6 md:p-8 rounded-3xl bg-white border border-neutral-200/50 shadow-sm flex flex-col justify-between"
            >
              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 rounded-xl bg-[#F7F8F1] border border-neutral-200/40 flex items-center justify-center flex-shrink-0 mt-1">
                  <MapPin className="w-5 h-5 text-[#2F4F2F]" />
                </div>
                <div className="flex-1 space-y-4">
                  <div>
                    <span className="text-[9px] uppercase tracking-[0.2em] font-semibold text-neutral-400 block mb-1">
                      {addressesList.length > 1 ? "Studio Addresses" : "Studio Address"}
                    </span>
                    <p className="font-serif text-lg text-neutral-800 font-light">
                      {addressesList.length > 1 ? "Our Flagship Locations" : "Our Flagship Atelier"}
                    </p>
                  </div>

                  {/* List of addresses */}
                  <div className="space-y-3 pt-1">
                    {addressesList.map((addr, idx) => (
                      <div key={idx} className={idx > 0 ? "pt-3 border-t border-neutral-100" : ""}>
                        {addressesList.length > 1 && (
                          <span className="text-[9px] uppercase tracking-wider text-[#2F4F2F] font-bold block mb-0.5">
                            Branch 0{idx + 1}
                          </span>
                        )}
                        <p className="text-xs text-neutral-600 leading-relaxed font-sans font-light">
                          {addr}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>

          </motion.div>

          {/* Right Column: Studio Workspace Image Banner */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-5 rounded-3xl overflow-hidden shadow-xl border border-neutral-200/40 relative bg-neutral-900 group min-h-[400px] flex flex-col justify-end"
          >
            {/* Soft gradient overlay at bottom */}
            <div className="absolute inset-0 bg-gradient-to-t from-white/90 via-transparent to-transparent z-10 pointer-events-none" />
            
            {/* Visual Workspace Image */}
            <motion.img
              src={workspaceImg}
              alt="Photographer's premium workspace"
              loading="lazy"
              decoding="async"
              whileHover={{ scale: 1.03 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="absolute inset-0 w-full h-full object-cover select-none"
            />
            
            {/* Decorative branding elements */}
            <div className="absolute bottom-6 left-6 z-20 space-y-1">
              <span className="text-[9px] uppercase tracking-[0.4em] font-semibold text-neutral-800 block">
                Aravinth Studio
              </span>
              <p className="font-serif italic text-xs text-neutral-500">
                Visual Art Curation & Gear Layout
              </p>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}

export default memo(Contact);
