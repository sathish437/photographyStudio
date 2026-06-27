import React from "react";
import { Camera, Eye, Heart } from "lucide-react";
import { motion } from "framer-motion";

export default function About() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2 }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
    }
  };

  return (
    <section id="about" className="py-14 bg-[#F7F8F5] border-b border-neutral-200/30 overflow-hidden">
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
              Studio Origin
            </span>
            <h2 className="font-serif text-4xl md:text-5xl font-normal text-neutral-800 mt-2">
              Behind the <span className="italic font-light">Lens</span>
            </h2>
          </div>
          <p className="text-xs text-neutral-500 font-medium max-w-sm mt-4 md:mt-0 tracking-wide font-sans">
            Capturing the organic textures of light, space, and human connections since 2018.
          </p>
        </motion.div>

        {/* Two-Column Split Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Studio Image Frame (Left Column) */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-5 aspect-[4/5] rounded-3xl overflow-hidden shadow-lg border border-neutral-200/40 relative bg-neutral-900 group"
          >
            <motion.img
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 1.5 }}
              src="https://images.unsplash.com/photo-1542038784456-1ea8e935640e?q=80&w=800&auto=format&fit=crop"
              alt="Artistic Director Aravinth Karuppiah"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent pointer-events-none" />
          </motion.div>

          {/* About Content (Right Column) */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-7 space-y-8"
          >
            <div className="space-y-4">
              <span className="text-[10px] uppercase tracking-widest font-bold text-[#2F4F2F]">
                Professional Photography Studio
              </span>
              <h3 className="font-serif text-3xl md:text-4xl font-normal text-neutral-800 leading-snug">
                Capturing <span className="italic font-light text-[#2F4F2F]">beautiful moments</span> in timeless visual chapters.
              </h3>
              <p className="text-neutral-600 text-sm leading-relaxed font-light">
                At Aravinth Photography, we believe every frame holds a unique legacy. Based in Chennai, India, our creative studio combines classic editorial composition with natural, organic photojournalism to capture couples, newborns, and milestone events in their purest, most authentic state.
              </p>
            </div>

            {/* Core Values grid using animated cards */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-4 border-t border-neutral-200/50"
            >
              
              {/* Creative Vision card */}
              <motion.div
                variants={cardVariants}
                whileHover={{ y: -8, scale: 1.02 }}
                className="p-5 rounded-2xl bg-white border border-neutral-200/60 shadow-sm hover:shadow-md transition-all duration-300"
              >
                <div className="p-2.5 bg-[#2F4F2F]/5 rounded-xl text-[#2F4F2F] w-fit mb-4">
                  <Eye size={16} />
                </div>
                <h4 className="font-serif text-lg font-normal text-neutral-800">
                  Creative Vision
                </h4>
                <p className="text-[10px] text-neutral-400 font-semibold tracking-wider uppercase mt-1">
                  Artistic Focus
                </p>
              </motion.div>

              {/* Professional Philosophy card */}
              <motion.div
                variants={cardVariants}
                whileHover={{ y: -8, scale: 1.02 }}
                className="p-5 rounded-2xl bg-white border border-neutral-200/60 shadow-sm hover:shadow-md transition-all duration-300"
              >
                <div className="p-2.5 bg-[#2F4F2F]/5 rounded-xl text-[#2F4F2F] w-fit mb-4">
                  <Heart size={16} />
                </div>
                <h4 className="font-serif text-lg font-normal text-neutral-800">
                  Philosophy
                </h4>
                <p className="text-[10px] text-neutral-400 font-semibold tracking-wider uppercase mt-1">
                  Authentic Light
                </p>
              </motion.div>

              {/* Modern Composition card */}
              <motion.div
                variants={cardVariants}
                whileHover={{ y: -8, scale: 1.02 }}
                className="p-5 rounded-2xl bg-white border border-neutral-200/60 shadow-sm hover:shadow-md transition-all duration-300"
              >
                <div className="p-2.5 bg-[#2F4F2F]/5 rounded-xl text-[#2F4F2F] w-fit mb-4">
                  <Camera size={16} />
                </div>
                <h4 className="font-serif text-lg font-normal text-neutral-800">
                  Composition
                </h4>
                <p className="text-[10px] text-neutral-400 font-semibold tracking-wider uppercase mt-1">
                  Modern Framing
                </p>
              </motion.div>

            </motion.div>

            <p className="text-neutral-500 italic text-xs tracking-wide">
              "We don't capture scenes; we document the raw, silent expressions that tell exactly who you are."
            </p>

          </motion.div>

        </div>

      </div>
    </section>
  );
}
