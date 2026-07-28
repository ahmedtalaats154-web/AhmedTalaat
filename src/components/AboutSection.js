"use client";
import { motion } from 'framer-motion';
import Image from 'next/image';

export default function AboutSection({ data }) {
  const title = data?.title || "CREATIVE VISION.";
  // We handle line breaks by splitting the string since the JSON uses \n\n
  const paragraphs = data?.description ? data.description.split('\n\n') : [
    "Hi, I'm Ahmed. I am a multidisciplinary creative specializing in high-end graphic design, cinematic video editing, and motion graphics. With years of experience pushing pixels and crafting narratives, my goal is simple: to transform raw ideas into striking visual realities.",
    "Whether I'm developing a robust brand identity from scratch or editing a fast-paced commercial reel, I obsess over the micro-details that separate good design from unforgettable design."
  ];
  
  const stats = data?.stats || [
    { number: "8+", label: "YEARS EXP." },
    { number: "120+", label: "PROJECTS" }
  ];

  const image = data?.image || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1000&auto=format&fit=crop";

  return (
    <section id="about" className="relative w-full py-24 lg:py-40 bg-[#F4F1E6] overflow-hidden flex flex-col items-center">
      <div className="w-full px-8 sm:px-16 lg:px-24 flex flex-col lg:flex-row items-center justify-between gap-16 mx-auto max-w-7xl">
        
        {/* Left Side: Photo/Avatar Block */}
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="w-full lg:w-[45%] relative aspect-[4/5] rounded-[3rem] overflow-hidden bg-[#004741] shadow-2xl flex-shrink-0"
        >
          <Image 
            src={image}
            alt="Ahmed Shalaby"
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover opacity-90 transition-transform duration-700 hover:scale-105"
          />
          <div className="absolute inset-0 bg-[#004741]/20 mix-blend-overlay pointer-events-none" />
        </motion.div>

        {/* Right Side: Typography */}
        <motion.div 
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
          className="w-full lg:w-[50%] flex flex-col text-left"
        >
          <span className="text-[0.65rem] font-bold tracking-[0.2em] text-[#004741]/60 uppercase mb-4 block">
            ‣ The Mind Behind The Lens
          </span>
          <h2 className="text-[3rem] lg:text-[4rem] font-black text-[#004741] tracking-tight leading-[1.05] mb-8" style={{ fontFamily: "var(--font-heading), sans-serif" }}>
            {title}
          </h2>
          
          {paragraphs.map((text, i) => (
            <p key={i} className="text-[#004741]/80 text-base lg:text-lg font-medium leading-relaxed mb-6">
              {text}
            </p>
          ))}
          
          <div className="flex items-center gap-12 mt-4">
            {stats.map((stat, i) => (
              <div key={i} className="flex flex-col">
                <span className="text-5xl font-black text-[#004741]">{stat.number}</span>
                <span className="text-[0.65rem] uppercase tracking-widest text-[#004741]/60 mt-1 font-bold">{stat.label}</span>
              </div>
            ))}
          </div>
        </motion.div>
        
      </div>
    </section>
  );
}
