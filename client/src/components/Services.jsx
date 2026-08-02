import React, { memo } from "react";
import { motion } from "framer-motion";
import { getOptimizedImageUrl } from "../utils/imageUtils";

function Services({ services = [] }) {
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
      transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] }
    }
  };

  return (
    <section id="services" className="py-16 md:py-24 bg-white border-b border-neutral-100 overflow-hidden font-sans">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col md:flex-row md:items-end justify-between mb-12 md:mb-16"
        >
          <div>
            <span className="text-[10px] sm:text-xs uppercase tracking-[0.35em] font-bold text-[#2F4F2F]">
              Studio Curation
            </span>
            <h2 className="font-serif text-4xl md:text-5xl font-normal text-neutral-800 mt-2">
              Our <span className="italic font-light">Services</span>
            </h2>
          </div>
          <p className="text-xs md:text-sm text-neutral-500 font-normal max-w-sm mt-4 md:mt-0 tracking-wide font-sans leading-relaxed">
            Explore our specialized professional photography offerings to document your precious milestones.
          </p>
        </motion.div>

        {/* Services Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-40px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8"
        >
          {services.map((service) => (
            <motion.div
              key={service.id}
              variants={itemVariants}
              whileHover={{ y: -6, scale: 1.015 }}
              className="group relative rounded-3xl overflow-hidden bg-[#F7F8F5] border border-neutral-200/50 hover:border-[#2F4F2F]/30 hover:shadow-xl transition-all duration-500 flex flex-col h-full"
            >
              {/* Image Frame */}
              <div className="aspect-[16/10] relative overflow-hidden bg-neutral-100 border-b border-neutral-200/40">
                <motion.img
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.8 }}
                  src={getOptimizedImageUrl(service.imageUrl, 600)}
                  alt={service.title}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Text Info */}
              <div className="p-6 sm:p-8 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-serif text-2xl font-normal text-neutral-800 tracking-wide mb-3 group-hover:text-[#2F4F2F] transition-colors">
                    {service.title}
                  </h3>
                  <p className="text-xs md:text-sm text-neutral-500 leading-relaxed font-light font-sans">
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

export default memo(Services);
