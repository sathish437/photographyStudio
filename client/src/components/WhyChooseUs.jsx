import React from "react";
import { Camera, Sliders, Image, Zap, Award, Users } from "lucide-react";
import { motion } from "framer-motion";
import { whyChooseUs } from "../data/mockData";

const iconMap = {
  Camera: <Camera className="w-6 h-6 text-[#2F4F2F]" />,
  Sliders: <Sliders className="w-6 h-6 text-[#2F4F2F]" />,
  Image: <Image className="w-6 h-6 text-[#2F4F2F]" />,
  Zap: <Zap className="w-6 h-6 text-[#2F4F2F]" />,
  Award: <Award className="w-6 h-6 text-[#2F4F2F]" />,
  Users: <Users className="w-6 h-6 text-[#2F4F2F]" />
};

export default function WhyChooseUs() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.12 }
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
    <section id="why-us" className="py-14 bg-white border-b border-neutral-100 overflow-hidden">
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
              Our Core Strengths
            </span>
            <h2 className="font-serif text-4xl md:text-5xl font-normal text-neutral-800 mt-2">
              Why <span className="italic font-light">Choose Us</span>
            </h2>
          </div>
          <p className="text-xs text-neutral-500 font-medium max-w-sm mt-4 md:mt-0 tracking-wide font-sans">
            Crafting premium visual memoirs and fine-art digital archives with an uncompromising focus on quality.
          </p>
        </motion.div>

        {/* Feature Cards Grid (3 columns on desktop, 2 on tablet, 1 on mobile) */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {whyChooseUs.map((item) => (
            <motion.div
              key={item.id}
              variants={itemVariants}
              whileHover={{ y: -8, scale: 1.015 }}
              className="group relative rounded-3xl p-8 bg-[#F7F8F5] border border-neutral-200/40 hover:border-[#2F4F2F]/20 hover:shadow-2xl transition-all duration-500 flex flex-col justify-between"
            >
              <div className="space-y-4">
                {/* Icon Wrapper */}
                <div className="p-3 bg-white border border-neutral-200/50 rounded-2xl w-fit group-hover:bg-[#2F4F2F] group-hover:text-white transition-colors duration-500">
                  {React.cloneElement(iconMap[item.iconName] || <Camera />, {
                    className: "w-6 h-6 text-[#2F4F2F] group-hover:text-white transition-colors duration-500"
                  })}
                </div>

                {/* Card Title */}
                <h3 className="font-serif text-2xl font-normal text-neutral-800 tracking-wide pt-2 group-hover:text-[#2F4F2F] transition-colors">
                  {item.title}
                </h3>

                {/* Description */}
                <p className="text-xs text-neutral-500 leading-relaxed font-light font-sans pr-2">
                  {item.description}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>

      </div>
    </section>
  );
}
