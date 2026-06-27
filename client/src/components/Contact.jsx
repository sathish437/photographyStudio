import React from "react";
import { Phone, MessageCircle, Mail, Instagram, ArrowUpRight, MapPin } from "lucide-react";
import { motion } from "framer-motion";

export default function Contact({ contactInfo }) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
    }
  };

  const contactsList = [
    {
      id: "con-phone",
      label: "Direct Call",
      value: contactInfo.phone,
      icon: <Phone className="w-5 h-5 text-[#2F4F2F]" />,
      link: `tel:${contactInfo.phone}`,
      desc: "Call us directly for session enquiries."
    },
    {
      id: "con-whatsapp",
      label: "WhatsApp Chat",
      value: contactInfo.whatsapp,
      icon: <MessageCircle className="w-5 h-5 text-[#2F4F2F]" />,
      link: `https://wa.me/${contactInfo.whatsapp.replace(/[^0-9]/g, "")}`,
      desc: "Instant message with our planning desk."
    },
    {
      id: "con-email",
      label: "Email Enquiries",
      value: contactInfo.email,
      icon: <Mail className="w-5 h-5 text-[#2F4F2F]" />,
      link: `mailto:${contactInfo.email}`,
      desc: "Drop a detailed request for pricing."
    },
    {
      id: "con-instagram",
      label: "Instagram Portal",
      value: "@kutty_photography_official",
      icon: <Instagram className="w-5 h-5 text-[#2F4F2F]" />,
      link: contactInfo.instagram,
      desc: "Follow our daily fine-art stories."
    }
  ];

  return (
    <section id="contact" className="py-14 bg-white border-b border-neutral-100 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Two-Column Contact Split Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-stretch">
          
          {/* Left Column: Get In Touch branding intro (5 cols) */}
          <motion.div
            initial={{ opacity: 0, x: -35 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-5 flex flex-col justify-between"
          >
            <div className="space-y-6">
              <span className="text-[10px] uppercase tracking-[0.4em] font-semibold text-[#2F4F2F] block">
                Let's Co-create
              </span>
              
              <h2 className="font-serif text-4xl md:text-5xl font-normal text-neutral-800 leading-tight">
                Get in <span className="italic font-light text-[#2F4F2F]">Touch</span>
              </h2>

              <p className="text-xs text-neutral-500 font-sans leading-relaxed tracking-wide">
                We would love to document your special moments, milestones, and celebrations. Reach out directly through any of our channels, or read about our Chennai headquarters address.
              </p>

              {/* Minimal Address Block */}
              <div className="flex items-start space-x-3 pt-4 border-t border-neutral-100">
                <div className="p-2 bg-[#2F4F2F]/5 rounded-xl text-[#2F4F2F] mt-0.5">
                  <MapPin size={16} />
                </div>
                <div>
                  <span className="text-[9px] uppercase tracking-widest font-semibold text-neutral-400 block mb-1">
                    Studio Headquarters
                  </span>
                  <p className="text-xs text-neutral-600 leading-relaxed max-w-sm">
                    {contactInfo.address}
                  </p>
                </div>
              </div>
            </div>

            {/* Google route text link (no map maps) */}
            <div className="pt-8 lg:pt-0">
              <a
                href="https://maps.google.com/?q=Chennai+Art+District"
                target="_blank"
                rel="noreferrer"
                className="flex items-center space-x-2 text-xs font-semibold text-[#2F4F2F] hover:underline uppercase tracking-widest"
              >
                <span>Find Route on Google Maps</span>
                <ArrowUpRight size={12} />
              </a>
            </div>
          </motion.div>

          {/* Right Column: Contact Details Cards (7 cols) */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-6"
          >
            {contactsList.map((contact) => (
              <motion.a
                key={contact.id}
                href={contact.link}
                target="_blank"
                rel="noreferrer"
                variants={itemVariants}
                whileHover={{ y: -8, scale: 1.015 }}
                className="group bg-[#F7F8F5] border border-neutral-200/50 hover:border-[#2F4F2F]/20 rounded-3xl p-6 hover:shadow-xl transition-all duration-500 flex flex-col justify-between h-full cursor-pointer text-left"
              >
                <div>
                  <div className="p-2.5 bg-white border border-neutral-200/40 rounded-xl w-fit group-hover:bg-[#2F4F2F] group-hover:text-white transition-colors duration-500">
                    {contact.icon}
                  </div>
                  
                  <span className="text-[9px] uppercase tracking-[0.3em] font-bold text-neutral-400 block mt-4">
                    {contact.label}
                  </span>
                  
                  <h3 className="font-serif text-lg font-normal text-neutral-800 mt-2 break-all group-hover:text-[#2F4F2F] transition-colors">
                    {contact.value}
                  </h3>
                  
                  <p className="text-[10px] text-neutral-400 font-light leading-relaxed mt-2">
                    {contact.desc}
                  </p>
                </div>

                <div className="mt-6 pt-3 border-t border-neutral-200/40 flex justify-end text-neutral-400 group-hover:text-[#2F4F2F] transition-colors">
                  <ArrowUpRight size={12} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </div>
              </motion.a>
            ))}
          </motion.div>

        </div>

      </div>
    </section>
  );
}
