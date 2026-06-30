import React from "react";
import { Phone, MessageCircle, Mail, Instagram, ArrowUpRight, MapPin, Youtube } from "lucide-react";
import { motion } from "framer-motion";
import workspaceImg from "../assets/photographer_workspace.png";

export default function Contact({ contactInfo }) {
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

  const contactsList = [
    {
      id: "con-phone",
      label: "Studio Phone Number",
      value: contactInfo.phone,
      icon: <Phone className="w-4 h-4 text-[#2F4F2F] group-hover:text-white transition-colors duration-500" />,
      link:  null,
      desc: "Call us directly for session enquiries."
    },
    {
      id: "con-whatsapp",
      label: "WhatsApp Number",
      value: contactInfo.whatsapp,
      icon: <MessageCircle className="w-4 h-4 text-[#2F4F2F] group-hover:text-white transition-colors duration-500" />,
      link: null,
      desc: "Instant message with our planning desk."
    },
    {
      id: "con-email",
      label: "Email Address",
      value: contactInfo.email,
      icon: <Mail className="w-4 h-4 text-[#2F4F2F] group-hover:text-white transition-colors duration-500" />,
      link: null,
      desc: "Drop a detailed request for pricing."
    },
    {
      id: "con-instagram",
      label: "Instagram Profile",
      value: formatInstagram(contactInfo.instagram),
      icon: <Instagram className="w-4 h-4 text-[#2F4F2F] group-hover:text-white transition-colors duration-500" />,
      link: contactInfo.instagram || null,
      desc: "Follow our daily fine-art stories."
    },
    ...(contactInfo.youtube ? [{
      id: "con-youtube",
      label: "YouTube Channel",
      value: formatYouTube(contactInfo.youtube),
      icon: <Youtube className="w-4 h-4 text-[#2F4F2F] group-hover:text-white transition-colors duration-500" />,
      link: contactInfo.youtube || null,
      desc: "Watch our behind-the-scenes and vlogs."
    }] : []),
    {
      id: "con-address",
      label: contactInfo.addresses && contactInfo.addresses.length > 1 ? "Studio Addresses" : "Studio Address",
      value: contactInfo.addresses && contactInfo.addresses.length > 0 ? (
        <div className="space-y-2">
          {contactInfo.addresses.map((addr, idx) => (
            <div key={idx} className={idx > 0 ? "pt-2 border-t border-neutral-100" : ""}>
              {addr}
            </div>
          ))}
        </div>
      ) : contactInfo.address,
      icon: <MapPin className="w-4 h-4 text-[#2F4F2F] group-hover:text-white transition-colors duration-500" />,
      link: null,
      desc: "Visit our studio location(s)."
    }
  ].filter(item => item.value);

  return (
    <section id="contact" className="py-20 bg-gradient-to-b from-[#F7F8F1] to-[#EFF1E8] border-b border-neutral-200/30 overflow-hidden relative">
      {/* Light atmospheric blurred spots */}
      <div className="w-96 h-96 rounded-full bg-[#2F4F2F]/5 blur-[80px] absolute -top-20 -left-20 pointer-events-none" />
      <div className="w-96 h-96 rounded-full bg-[#2F4F2F]/5 blur-[100px] absolute -bottom-40 -right-20 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-stretch">
          
          {/* Left Column: Heading & Contact Cards */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={containerVariants}
            className="lg:col-span-6 flex flex-col justify-center"
          >
            <div>
              <span className="text-[10px] uppercase tracking-[0.4em] font-bold text-[#2F4F2F] block mb-3">
                Let's Co-create
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-light text-neutral-800 leading-tight">
                Let's Create <span className="italic font-light text-[#2F4F2F]">Beautiful Memories</span> Together
              </h2>
              <p className="text-sm text-neutral-500 font-sans leading-relaxed mt-4 max-w-xl">
                We would love to document your special moments, milestones, and celebrations. Reach out directly through any of our channels. Our planning desk is ready to collaborate.
              </p>
            </div>

            {/* Sub-grid of cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8">
              {contactsList.map((contact) => {
                const isLink = !!contact.link;
                const CardTag = isLink ? motion.a : motion.div;
                const extraProps = isLink ? { href: contact.link, target: "_blank", rel: "noreferrer" } : {};

                return (
                  <CardTag
                    key={contact.id}
                    variants={itemVariants}
                    whileHover={isLink ? { y: -6, scale: 1.015 } : {}}
                    className={`group bg-white border border-neutral-200/40 rounded-2xl p-5 ${
                      isLink ? "hover:border-[#2F4F2F]/30 hover:shadow-xl cursor-pointer" : ""
                    } transition-all duration-500 flex flex-col justify-between h-full text-left`}
                    {...extraProps}
                  >
                    <div>
                      <div className="p-2 bg-[#F7F8F1] border border-neutral-200/30 rounded-xl w-fit group-hover:bg-[#2F4F2F] group-hover:text-white transition-colors duration-500">
                        {contact.icon}
                      </div>
                      
                      <span className="text-[9px] uppercase tracking-[0.2em] font-semibold text-[#2F4F2F] block mt-4">
                        {contact.label}
                      </span>
                      
                      <div className="font-sans text-xs md:text-sm font-medium text-neutral-800 mt-1.5 break-words group-hover:text-[#2F4F2F] transition-colors leading-relaxed">
                        {contact.value}
                      </div>
                      
                      <p className="text-[10px] text-neutral-500 font-light leading-relaxed mt-1.5">
                        {contact.desc}
                      </p>
                    </div>

                    {isLink && (
                      <div className="mt-4 pt-2 border-t border-neutral-100 flex justify-end text-neutral-400 group-hover:text-[#2F4F2F] transition-colors">
                        <ArrowUpRight size={15} className="text-black group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform animate-bounce" />
                      </div>
                    )}
                  </CardTag>
                );
              })}
            </div>
          </motion.div>

          {/* Right Column: Visual Area showcasing photographer workspace flat lay */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-6 flex items-center justify-center relative min-h-[400px] lg:min-h-full rounded-3xl overflow-hidden border border-neutral-200/40 shadow-2xl group bg-white"
          >
            {/* Soft gradient overlay at bottom */}
            <div className="absolute inset-0 bg-gradient-to-t from-white/90 via-transparent to-transparent z-10 pointer-events-none" />
            
            {/* Visual Workspace Image */}
            <motion.img
              src={workspaceImg}
              alt="Photographer's premium workspace"
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
