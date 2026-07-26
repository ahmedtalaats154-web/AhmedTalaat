"use client";

import { useRef, useState } from 'react';
import { motion, useScroll, useTransform, useSpring, AnimatePresence } from 'framer-motion';

export default function PortfolioSection({ portfolioItems: propPortfolioItems, moreWorks: propMoreWorks, portfolioLayout, moreWorksLayout }) {
  const topRibbonRef = useRef(null);
  const constraintRef = useRef(null);
  const [selectedProject, setSelectedProject] = useState(null);

  const PORTFOLIO_ITEMS = propPortfolioItems || [
    { id: 1, title: "Brand Identity El Fahd", type: "Design", img: "/Work1.png", desc: "A comprehensive brand identity overhaul focusing on modern minimalism and bold typography." },
    { id: 2, title: "Cinematic Reel Mr. Yasser", type: "Video", img: "/Work2.jpg", desc: "High-octane cinematic promotional reel showcasing dynamic transitions." },
  ];

  const MORE_WORKS = propMoreWorks || [
    { id: 13, title: "Logo Explorations", type: "Design", img: "/Work1.png" },
    { id: 14, title: "Event Promo 2026", type: "Video", img: "/Work2.jpg" },
  ];
  const [hoveredIndex, setHoveredIndex] = useState(null);

  // Scroll tracking for the Top Ribbon
  const { scrollYProgress: topScroll } = useScroll({
    target: topRibbonRef,
    offset: ["start end", "end start"]
  });
  const smoothTop = useSpring(topScroll, { stiffness: 45, damping: 22 });
  const xTranslation = useTransform(smoothTop, [0, 1], ["10vw", "-180vw"]);

  return (
    <div id="work" className="w-full bg-[#F4F1E6] relative overflow-hidden">
      
      {/* =========================================
          SECTION 1: THE DRAGGABLE RIBBON 
      ========================================= */}
      <section ref={topRibbonRef} className="relative w-full py-24 lg:py-40 overflow-hidden flex flex-col justify-center">
        <div className="w-full px-8 sm:px-16 lg:px-24 mb-16 text-left select-none">
          <span className="text-[0.65rem] font-bold tracking-[0.2em] text-[#004741]/60 uppercase block mb-3">‣ Interactive Showcase</span>
          <h2 className="text-[2.5rem] lg:text-[4.5rem] font-black text-[#004741] tracking-tight m-0" style={{ fontFamily: "var(--font-heading), sans-serif" }}>
            DESIGN & MOTION.
          </h2>
        </div>

        <div ref={constraintRef} className="relative w-full flex items-center overflow-visible py-12 bg-[#004741]/5 border-y border-[#004741]/10 transform rotate-[-2deg] cursor-grab active:cursor-grabbing">
          <motion.div style={{ x: xTranslation }} drag="x" dragConstraints={constraintRef} dragElastic={0.2} whileDrag={{ cursor: "grabbing" }} className="flex gap-12 whitespace-nowrap px-12">
            {[...PORTFOLIO_ITEMS, ...PORTFOLIO_ITEMS].map((item, index) => (
              <motion.div
                key={`ribbon-${item.id}-${index}`}
                onClick={() => setSelectedProject(item)}
                whileHover={{ y: -22, scale: 1.04, boxShadow: "0px 25px 50px rgba(0, 47, 65, 0.15)" }}
                transition={{ type: "spring", stiffness: 200, damping: 18 }}
                className="w-[290px] sm:w-[410px] aspect-[15/10] bg-[#E6E3D5] rounded-[2.2rem] border border-[#004741]/10 overflow-hidden relative shadow-md cursor-pointer group flex-shrink-0 inline-block will-change-transform"
              >
                <div className="w-full h-full relative overflow-hidden">
                  <img src={item.img} alt={item.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.08]" />
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* =========================================
          SECTION 2: FULL-SCREEN PORTAL REVEAL
      ========================================= */}
      <section data-cursor="light" className="w-full min-h-screen relative bg-[#004741] flex flex-col justify-center items-center overflow-hidden z-30 shadow-2xl py-24 lg:py-40">
        <motion.div 
          initial={{ scaleY: 0, opacity: 0 }}
          whileInView={{ scaleY: 1, opacity: 1 }}
          viewport={{ once: false, margin: "-20% 0px" }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="absolute inset-0 bg-gradient-to-br from-[#003833] to-[#001f1c] origin-bottom"
        />
        <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-[0.03]">
          {[...Array(12)].map((_, i) => <div key={i} className="w-full h-[2px] bg-[#E6E3D5]" />)}
        </div>
        <motion.div initial={{ y: 50, opacity: 0 }} whileInView={{ y: 0, opacity: 1 }} transition={{ delay: 0.2, duration: 0.6 }} className="z-10 text-center px-6 select-none">
          <span className="text-[0.7rem] font-black tracking-[0.4em] text-[#E6E3D5]/40 uppercase block mb-4">‣ Process Phase 02</span>
          <h2 className="text-[8vw] sm:text-[6vw] font-black text-[#E6E3D5] tracking-tighter m-0 leading-none uppercase">ENTER THE ARCHIVE</h2>
        </motion.div>
      </section>

      {/* =========================================
          SECTION 3: PLAYFUL ACCORDION GALLERY
      ========================================= */}
      <section className="relative w-full bg-[#F4F1E6] py-24 lg:py-40 overflow-hidden">
        <div className="w-full text-center mb-16 select-none px-4">
          <span className="text-[0.65rem] font-bold tracking-[0.2em] text-[#004741]/60 uppercase block mb-3">‣ Fast Navigation</span>
          <h2 className="text-[2.5rem] lg:text-[4.5rem] font-black text-[#004741] tracking-tight m-0" style={{ fontFamily: "var(--font-heading), sans-serif" }}>
            THE ARCHIVE.
          </h2>
          <p className="text-[#004741]/70 text-sm md:text-base font-medium max-w-lg mx-auto mt-4">
            Hover over any project to expand its details. Click to open the full case study viewer.
          </p>
        </div>

        <div className="w-full px-4 sm:px-8 h-[80vh] flex flex-col md:flex-row gap-2 sm:gap-4 relative z-10">
          {PORTFOLIO_ITEMS.map((item, index) => {
            const isHovered = hoveredIndex === index;
            
            return (
              <motion.div 
                key={item.id}
                onHoverStart={() => setHoveredIndex(index)}
                onHoverEnd={() => setHoveredIndex(null)}
                onClick={() => {
                  if (hoveredIndex !== index) {
                    setHoveredIndex(index);
                  } else {
                    setSelectedProject(item);
                  }
                }}
                animate={{ 
                  flex: isHovered ? 12 : 1,
                  opacity: hoveredIndex !== null && !isHovered ? 0.6 : 1
                }}
                transition={{ type: "spring", stiffness: 150, damping: 20 }}
                data-cursor="light"
                className="relative h-full w-full min-w-[50px] sm:min-w-[70px] bg-[#004741] rounded-[1.5rem] sm:rounded-[2rem] overflow-hidden cursor-pointer group shadow-xl origin-center"
              >
                <img 
                  src={item.img} 
                  alt={item.title} 
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.05]" 
                />
                
                {/* Collapsed State Title (Vertical Text on Desktop) */}
                <motion.div 
                  animate={{ opacity: isHovered ? 0 : 1 }}
                  className="absolute inset-0 p-4 sm:p-6 flex items-end justify-center md:justify-start pointer-events-none"
                >
                  {/* Desktop Vertical Text */}
                  <div className="hidden md:block absolute bottom-12 left-1/2 -translate-x-1/2 origin-bottom -rotate-90 whitespace-nowrap">
                    <span className="text-[#E6E3D5] font-black uppercase tracking-[0.15em] text-xs drop-shadow-md">
                      {item.title}
                    </span>
                  </div>
                  {/* Mobile Horizontal Text */}
                  <div className="md:hidden w-full text-center bg-[#004741]/60 backdrop-blur-md py-2 rounded-xl border border-[#E6E3D5]/10">
                    <span className="text-[#E6E3D5] font-black uppercase tracking-widest text-[0.65rem] drop-shadow-md">
                      {item.title}
                    </span>
                  </div>
                </motion.div>

                {/* Expanded State Details */}
                <AnimatePresence>
                  {isHovered && (
                    <motion.div 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      transition={{ duration: 0.3 }}
                      className="absolute inset-0 bg-gradient-to-t from-[#004741]/95 via-[#004741]/40 to-transparent flex flex-col justify-end items-start text-left pointer-events-none"
                      style={{ padding: `${portfolioLayout?.textPaddingBottom || 12}px ${portfolioLayout?.textPaddingLeft || 16}px`, paddingTop: 0 }}
                    >
                      <motion.span 
                        initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}
                        className="text-[0.65rem] font-black text-[#E6E3D5]/70 tracking-[0.2em] uppercase mb-3 border border-[#E6E3D5]/20 px-4 py-1.5 rounded-full backdrop-blur-md"
                      >
                        {item.type}
                      </motion.span>
                      
                      <motion.h3 
                        initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15 }}
                        className="font-black tracking-tight leading-none mb-3 min-w-[250px]"
                        style={{ color: portfolioLayout?.textColor || '#E6E3D5', fontSize: `${portfolioLayout?.titleSize || 28}px`, textAlign: portfolioLayout?.textAlign || 'left' }}
                      >
                        {item.title}
                      </motion.h3>
                      
                      <motion.p 
                        initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}
                        className="text-xs lg:text-sm font-medium leading-relaxed max-w-sm hidden sm:block"
                        style={{ color: (portfolioLayout?.textColor || '#E6E3D5') + 'cc' }}
                      >
                        {item.desc}
                      </motion.p>
                      
                      <motion.button 
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedProject(item);
                        }}
                        initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.25 }}
                        className="mt-6 bg-[#E6E3D5] text-[#004741] font-black uppercase tracking-widest text-[0.7rem] px-6 py-3 rounded-full shadow-[0_10px_20px_rgba(0,0,0,0.2)] pointer-events-auto"
                      >
                        View Project
                      </motion.button>
                    </motion.div>
                  )}
                </AnimatePresence>

              </motion.div>
            );
          })}
        </div>
      </section>

      {/* =========================================
          SECTION 4: PLAYFUL MASONRY GRID
      ========================================= */}
      <section className="relative w-full py-24 lg:py-40 px-8 sm:px-16 lg:px-24 bg-[#E6E3D5]/20">
        <div className="w-full text-center mb-16 select-none">
          <span className="text-[0.65rem] font-bold tracking-[0.2em] text-[#004741]/60 uppercase block mb-3">‣ Deeper Cuts</span>
          <h2 className="text-[2.5rem] lg:text-[4.5rem] font-black text-[#004741] tracking-tight m-0" style={{ fontFamily: "var(--font-heading), sans-serif" }}>
            MORE WORKS.
          </h2>
        </div>

        <div className="columns-1 sm:columns-2 lg:columns-3 gap-6">
          {MORE_WORKS.map((item) => (
            <motion.div 
              key={item.id}
              whileHover={{ y: -10, rotate: Math.random() * 2 - 1 }}
              onClick={() => setSelectedProject(item)}
              data-cursor="light"
              className="break-inside-avoid mb-6 rounded-[2rem] overflow-hidden cursor-pointer shadow-xl group relative"
            >
              <img src={item.img} className="w-full object-cover group-hover:scale-110 transition-transform duration-700" />
              <div className="absolute inset-0 bg-[#004741]/20 group-hover:bg-[#004741]/40 transition-colors duration-500" />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[#004741]/90 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-y-4 group-hover:translate-y-0"
                style={{ padding: `${moreWorksLayout?.textPaddingBottom || 12}px ${moreWorksLayout?.textPaddingLeft || 12}px` }}
              >
                <span className="font-black uppercase tracking-widest" style={{ color: (moreWorksLayout?.textColor || '#E6E3D5') + 'b3', fontSize: `${(moreWorksLayout?.titleSize || 14) * 0.6}px` }}>{item.type}</span>
                <h4 className="font-black leading-none mt-1" style={{ color: moreWorksLayout?.textColor || '#E6E3D5', fontSize: `${moreWorksLayout?.titleSize || 14}px`, textAlign: moreWorksLayout?.textAlign || 'left' }}>{item.title}</h4>
              </div>
            </motion.div>
          ))}
        </div>
        <div className="w-full flex justify-center mt-12">
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-transparent border-2 border-[#004741]/20 text-[#004741] font-black uppercase tracking-[0.2em] text-xs px-10 py-5 rounded-full hover:bg-[#004741] hover:text-[#E6E3D5] hover:border-[#004741] transition-all duration-300 shadow-md"
          >
            Load More Projects
          </motion.button>
        </div>
      </section>

      {/* =========================================
          SECTION 5: CINEMATIC OUTRO CTA
      ========================================= */}
      <section data-cursor="light" className="relative w-full min-h-screen bg-[#004741] flex flex-col justify-center items-center overflow-hidden z-20 py-24 lg:py-40">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9, y: 50 }}
          whileInView={{ opacity: 1, scale: 1, y: 0 }}
          viewport={{ once: false, margin: "-20% 0px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center px-4 relative z-10"
        >
          <span className="text-[#E6E3D5]/70 text-[0.7rem] sm:text-sm font-black tracking-[0.4em] uppercase mb-8 block">
            ‣ Ready to elevate your brand?
          </span>
          <h2 className="text-[12vw] sm:text-[9vw] font-black text-[#E6E3D5] tracking-tighter leading-[0.9] m-0 uppercase mb-12">
            LET'S CREATE<br />TOGETHER.
          </h2>
          <motion.button 
            whileHover={{ scale: 1.05, backgroundColor: "#E6E3D5", color: "#004741" }}
            whileTap={{ scale: 0.95 }}
            className="bg-transparent border border-[#E6E3D5]/30 text-[#E6E3D5] font-black uppercase tracking-[0.2em] text-xs sm:text-sm px-10 py-5 rounded-full transition-all duration-300 shadow-[0_0_40px_rgba(230,227,213,0.05)] hover:shadow-[0_0_60px_rgba(230,227,213,0.2)] backdrop-blur-sm"
          >
            Start a Project 
            <span className="inline-block ml-3 transform group-hover:translate-x-1 transition-transform">→</span>
          </motion.button>
        </motion.div>
        
        {/* Ambient background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vw] bg-[#E6E3D5] opacity-[0.03] blur-[150px] rounded-full pointer-events-none" />
        
        {/* Cinematic scanlines */}
        <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-[0.02]">
          {[...Array(20)].map((_, i) => <div key={i} className="w-full h-[1px] bg-[#E6E3D5]" />)}
        </div>
      </section>

      {/* =========================================
          GLOBAL LIGHTBOX POP-UP MODAL
      ========================================= */}
      <AnimatePresence>
        {selectedProject && (
          <motion.div data-cursor="light" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedProject(null)} className="fixed inset-0 bg-[#004741]/90 backdrop-blur-lg z-50 flex items-center justify-center p-4 lg:p-12 cursor-zoom-out">
            <button className="absolute top-8 right-8 text-[#E6E3D5]/80 hover:text-[#E6E3D5] text-sm font-black uppercase tracking-widest bg-[#004741] border border-[#E6E3D5]/20 px-6 py-3 rounded-full transition-all hover:scale-[1.05] z-10">✕ Close</button>
            <motion.div initial={{ scale: 0.9, y: 30 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 30 }} transition={{ type: "spring", stiffness: 200, damping: 25 }} onClick={(e) => e.stopPropagation()} className="max-w-7xl w-full max-h-[90vh] bg-[#E6E3D5] rounded-[2.5rem] overflow-hidden shadow-2xl flex flex-col relative">
              <div className="w-full flex-1 min-h-[50vh] relative bg-black/5 flex items-center justify-center p-4">
                <img src={selectedProject.img} alt={selectedProject.title} className="max-w-full max-h-[60vh] object-contain rounded-xl shadow-lg" />
              </div>
              <div className="p-8 lg:p-10 flex flex-col items-center text-center bg-[#E6E3D5] flex-shrink-0">
                <span className="text-[0.65rem] font-bold tracking-[0.2em] text-[#004741]/60 uppercase mb-2">{selectedProject.type}</span>
                <h3 className="text-2xl lg:text-4xl font-black text-[#004741] tracking-tight mb-2">{selectedProject.title}</h3>
                {selectedProject.desc && <p className="text-[#004741]/70 font-medium text-sm max-w-2xl">{selectedProject.desc}</p>}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}