"use client";
import { motion } from "framer-motion";
import { useRef, useState, useEffect } from "react";

// التنسيقات العامة للأنميشن
const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1, delayChildren: 0.2 },
  },
};

const lineReveal = {
  hidden: { y: "120%", opacity: 0 },
  visible: {
    y: "0%",
    opacity: 1,
    transition: { duration: 1, ease: [0.22, 1, 0.36, 1] },
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] },
  },
};

export default function Hero() {
  const [mounted, setMounted] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isClicking, setIsClicking] = useState(false);
  const [isHoveringInteractive, setIsHoveringInteractive] = useState(false);

  // حسابات الحركية للماوس المخصص والـ Spotlight
  useEffect(() => {
    setMounted(true);
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    const handleMouseDown = () => setIsClicking(true);
    const handleMouseUp = () => setIsClicking(false);

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);

  if (!mounted) return <div className="min-h-screen bg-[#F0EEE4]" />;

  return (
    <section className="relative min-h-screen w-full bg-[#F0EEE4] flex items-center justify-center overflow-hidden pt-12 px-6 sm:px-12 lg:px-20">
      
      {/* 1. الـ Spotlight التفاعلي في الخلفية */}
      <div 
        className="absolute inset-0 pointer-events-none transition-opacity duration-300 z-0"
        style={{
          background: `radial-gradient(circle 450px at ${mousePos.x}px ${mousePos.y}px, rgba(0, 47, 65, 0.12), transparent 80%)`,
        }}
      />

      {/* 2. الأشكال الهندسية المتطايرة (Design Tools Particles) */}
      <div className="absolute inset-0 pointer-events-none z-0 opacity-25">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute border border-[#004741] pointer-events-none"
            style={{
              width: i % 2 === 0 ? "12px" : "16px",
              height: i % 2 === 0 ? "12px" : "16px",
              left: `${(i * 7) % 100}%`,
              top: `${(i * 11) % 100}%`,
              borderRadius: i % 3 === 0 ? "50%" : i % 3 === 1 ? "0%" : "2px",
            }}
            animate={{
              y: [0, -20, 0],
              rotate: [0, 360],
            }}
            transition={{
              duration: 6 + (i % 5),
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.2,
            }}
          />
        ))}
      </div>

      {/* 3. الجروب الموحد والمسنتر بقوة وتوزيع الـ 50/50 */}
      <div className="relative z-10 w-full max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-8">
        
        {/* الجزء الشمال: النصوص والعناوين */}
        <motion.div 
          className="w-full lg:w-1/2 flex flex-col items-start text-left lg:pr-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* التاج العلوي */}
          <motion.div variants={fadeUp} className="mb-4">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-widest bg-[#E6E3D5] text-[#004741]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#004741]" />
              Graphic Designer & Video Editor
            </span>
          </motion.div>

          {/* العنوان الرئيسي */}
          <h1 className="text-[#004741] font-bold leading-[1.05] tracking-tight mb-6 flex flex-col w-full" style={{ fontSize: "clamp(2.5rem, 5.5vw, 4.8rem)" }}>
            <span className="overflow-hidden block">
              <motion.span variants={lineReveal} className="block">Crafting Visual</motion.span>
            </span>
            <span className="overflow-hidden block text-[#00635B]">
              <motion.span variants={lineReveal} className="block">Stories That</motion.span>
            </span>
            <span className="overflow-hidden block">
              <motion.span variants={lineReveal} className="inline-flex items-center gap-4 flex-wrap">
                Inspire
                <motion.span 
                  className="inline-flex items-center justify-center rounded-full bg-[#004741] w-12 h-12 lg:w-14 lg:h-14 cursor-pointer"
                  whileHover={{ scale: 1.1, rotate: 45 }}
                  onMouseEnter={() => setIsHoveringInteractive(true)}
                  onMouseLeave={() => setIsHoveringInteractive(false)}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#F0EEE4" strokeWidth="2.5">
                    <line x1="7" y1="17" x2="17" y2="7" /><polyline points="7 7 17 7 17 17" />
                  </svg>
                </motion.span>
              </motion.span>
            </span>
          </h1>

          {/* الوصف والكبسولات */}
          <motion.p variants={fadeUp} className="text-sm lg:text-base text-[#004741]/70 max-w-md mb-6 leading-relaxed">
            Transforming ideas into captivating designs and cinematic edits — where creativity meets purpose.
          </motion.p>

          <motion.div variants={fadeUp} className="flex items-center gap-3">
            <div className="px-4 py-2 rounded-full text-xs font-semibold bg-[#004741] text-[#F0EEE4] flex items-center gap-1.5">
              ★ Design
            </div>
            <div className="px-4 py-2 rounded-full text-xs font-semibold bg-[#E6E3D5] text-[#004741] flex items-center gap-1.5">
              🎬 Video
            </div>
          </motion.div>
        </motion.div>

        {/* الجزء اليمين: الـ Showreel Container مفرود تماماً لليمين */}
        <motion.div 
          className="w-full lg:w-1/2 flex justify-center lg:justify-end"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: