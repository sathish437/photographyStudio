import React from "react";
import { motion } from "framer-motion";
import { services } from "../data/mockData";

export default function Services() {
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

  return (
    <section id="services" className="py-14 bg-white border-b border-neutral-100 overflow-hidden">
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
              Studio Curation
            </span>
            <h2 className="font-serif text-4xl md:text-5xl font-normal text-neutral-800 mt-2">
              Our <span className="italic font-light">Services</span>
            </h2>
          </div>
          <p className="text-xs text-neutral-500 font-medium max-w-sm mt-4 md:mt-0 tracking-wide font-sans">
            Explore our specialized professional photography offerings to document your precious milestones.
          </p>
        </motion.div>

        {/* Services Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {services.map((service) => (
            <motion.div
              key={service.id}
              variants={itemVariants}
              whileHover={{ y: -8, scale: 1.015 }}
              className="group relative rounded-3xl overflow-hidden bg-[#F7F8F5] border border-neutral-200/40 hover:border-[#2F4F2F]/20 hover:shadow-2xl transition-all duration-500 flex flex-col h-full"
            >
              {/* Image Frame */}
              <div className="aspect-[16/10] relative overflow-hidden bg-neutral-100">
                <motion.img
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.8 }}
                  src={service.imageUrl}
                  alt={service.title}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Text Info */}
              <div className="p-6 md:p-8 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-serif text-2xl font-normal text-neutral-800 tracking-wide mb-3 group-hover:text-[#2F4F2F] transition-colors">
                    {service.title}
                  </h3>
                  <p className="text-xs text-neutral-500 leading-relaxed font-light font-sans pr-2">
                    {service.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

      </div>
    </section>
  );
}
