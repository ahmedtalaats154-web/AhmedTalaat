"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence, useSpring, useTransform, useMotionValue } from "framer-motion";
import Image from 'next/image';

const NAV_LINKS = [
  { label: "WORK", href: "#work" },
  { label: "ABOUT", href: "#about" },
  { label: "CONTACT", href: "#contact" },
];

/* ════════════════════════════════════════════════════════════════════
   DIVERSE FLOATING GEOMETRIC ARTIFACTS
   ════════════════════════════════════════════════════════════════════ */
function ParticleShape({ type, size }) {
  const s = size;
  switch (type) {
    case 0:
      return (
        <svg width={s} height={s} viewBox="0 0 24 24">
          <polygon points="12,2 22,22 2,22" fill="none" stroke="#004741" strokeWidth="1.5" />
        </svg>
      );
    case 1:
      return (
        <svg width={s} height={s} viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="8" fill="#004741" opacity="0.15" />
        </svg>
      );
    case 2:
      return (
        <svg width={s} height={s} viewBox="0 0 24 24">
          <rect x="4" y="4" width="16" height="16" fill="none" stroke="#004741" strokeWidth="1.5" />
        </svg>
      );
    case 3:
      return (
        <svg width={s} height={s} viewBox="0 0 24 24">
          <line x1="12" y1="4" x2="12" y2="20" stroke="#004741" strokeWidth="1.2" />
          <line x1="4" y1="12" x2="20" y2="12" stroke="#004741" strokeWidth="1.2" />
          <circle cx="12" cy="12" r="2.5" fill="none" stroke="#004741" strokeWidth="1.2" />
        </svg>
      );
    default:
      return null;
  }
}

function MicroParticles() {
  const requestRef = useRef();
  const mouseRef = useRef({ x: -1000, y: -1000 });
  const particlesRef = useRef(
    Array.from({ length: 45 }, (_, i) => ({
      id: i,
      type: i % 4,
      x: typeof window !== 'undefined' ? Math.random() * window.innerWidth : 0,
      y: typeof window !== 'undefined' ? Math.random() * window.innerHeight : 0,
      size: 14 + Math.random() * 14,
      vx: (Math.random() - 0.5) * 0.8,
      vy: (Math.random() - 0.5) * 0.8,
      rot: Math.random() * 360,
    }))
  );
  const [, setFrame] = useState(0);

  useEffect(() => {
    const handleMouseMove = (e) => { mouseRef.current = { x: e.clientX, y: e.clientY }; };
    window.addEventListener("mousemove", handleMouseMove);

    const animate = () => {
      particlesRef.current.forEach(p => {
        p.x += p.vx; p.y += p.vy; p.rot += 0.3;
        if (p.x < 0) p.vx = Math.abs(p.vx);
        if (p.x > window.innerWidth) p.vx = -Math.abs(p.vx);
        if (p.y < 0) p.vy = Math.abs(p.vy);
        if (p.y > window.innerHeight) p.vy = -Math.abs(p.vy);

        const dx = p.x - mouseRef.current.x;
        const dy = p.y - mouseRef.current.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120 && dist > 0) {
          const force = (120 - dist) / 120;
          p.x += (dx / dist) * force * 3;
          p.y += (dy / dist) * force * 3;
        }
      });
      setFrame(f => f + 1);
      requestRef.current = requestAnimationFrame(animate);
    };
    requestRef.current = requestAnimationFrame(animate);
    return () => { cancelAnimationFrame(requestRef.current); window.removeEventListener("mousemove", handleMouseMove); };
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {particlesRef.current.map((p) => (
        <div
          key={p.id}
          className="absolute opacity-[0.12]"
          style={{
            width: p.size,
            height: p.size,
            left: 0, top: 0,
            transform: `translate(${p.x}px, ${p.y}px) rotate(${p.rot}deg) translate(-50%, -50%)`,
          }}
        >
          <ParticleShape type={p.type} size={p.size} />
        </div>
      ))}
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════════
   DYNAMIC SPOTLIGHT
   ════════════════════════════════════════════════════════════════════ */
function DynamicSpotlight({ mouseX, mouseY }) {
  const smoothX = useSpring(mouseX, { stiffness: 60, damping: 25 });
  const smoothY = useSpring(mouseY, { stiffness: 60, damping: 25 });
  const background = useTransform(
    [smoothX, smoothY],
    ([x, y]) => `radial-gradient(500px circle at ${x}px ${y}px, rgba(0, 71, 65, 0.1), transparent 80%)`
  );
  return <motion.div className="fixed inset-0 pointer-events-none z-0" style={{ background }} />;
}

/* ════════════════════════════════════════════════════════════════════
   DESIGNER'S BOUNDING BOX CURSOR
   ════════════════════════════════════════════════════════════════════ */
function DesignerCursor({ mouseX, mouseY }) {
  const [isClicked, setIsClicked] = useState(false);
  useEffect(() => {
    const down = () => setIsClicked(true); const up = () => setIsClicked(false);
    window.addEventListener("mousedown", down); window.addEventListener("mouseup", up);
    return () => { window.removeEventListener("mousedown", down); window.removeEventListener("mouseup", up); };
  }, []);

  const smoothX = useSpring(mouseX, { stiffness: 800, damping: 45, mass: 0.1 });
  const smoothY = useSpring(mouseY, { stiffness: 800, damping: 45, mass: 0.1 });

  return (
    <motion.div
      className="fixed top-0 left-0 pointer-events-none z-[99999] flex items-center justify-center hidden md:flex"
      style={{ x: smoothX, y: smoothY, translateX: "-50%", translateY: "-50%" }}
    >
      <motion.div className="absolute w-8 h-8 flex items-center justify-center" animate={{ scale: isClicked ? 0.35 : 1 }}>
        <motion.div className="w-full h-full border-[1.25px] border-[#004741]" animate={{ rotate: 360 }} transition={{ duration: 12, repeat: Infinity, ease: "linear" }} />
      </motion.div>
      <div className="absolute w-[5px] h-[5px] bg-[#004741]" />
    </motion.div>
  );
}

/* ════════════════════════════════════════════════════════════════════
   MAGNETIC SHOWREEL CONTAINER (Expanded)
   ════════════════════════════════════════════════════════════════════ */
function MagneticMedia() {
  const containerRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);
  const mX = useMotionValue(0); const mY = useMotionValue(0);
  const x = useSpring(mX, { stiffness: 150, damping: 20 });
  const y = useSpring(mY, { stiffness: 150, damping: 20 });

  return (
    <motion.div
      className="w-full max-w-[440px] aspect-[4/5] relative"
      ref={containerRef}
      onMouseMove={(e) => {
        const r = containerRef.current?.getBoundingClientRect(); if (!r) return;
        mX.set((e.clientX - r.left) / r.width - 0.5); mY.set((e.clientY - r.top) / r.height - 0.5);
      }}
      onMouseLeave={() => { mX.set(0); mY.set(0); setIsHovered(false); }}
      style={{ x, y, rotateX: useTransform(y, [-0.5, 0.5], [6, -6]), rotateY: useTransform(x, [-0.5, 0.5], [-6, 6]), transformPerspective: 800 }}
    >
      <div className="absolute inset-[-4px] rounded-[2.25rem] bg-[#004741] opacity-5" />
      <div className="relative w-full h-full rounded-[2rem] overflow-hidden flex flex-col items-center justify-center gap-4 z-10 bg-[#E6E3D5] border border-[#004741]/5 shadow-lg">
        <div className="w-12 h-12 rounded-full bg-[#004741]/5 flex items-center justify-center text-[var(--theme-primary)]">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><polygon points="6 3 20 12 6 21 6 3" /></svg>
        </div>
        <span className="text-[0.65rem] font-bold uppercase tracking-[0.15em] text-[var(--theme-primary)]/60">Showreel Coming Soon</span>
      </div>
    </motion.div>
  );
}

/* ════════════════════════════════════════════════════════════════════
   MAIN HERO COMPONENT — FULLY RESPONSIVE WIDESCREEN
   ════════════════════════════════════════════════════════════════════ */
const DISCOVERY_PHRASES = [
  { icon: "🎨", text: "CRAFTING BRAND IDENTITIES" },
  { icon: "🎬", text: "EDITING CINEMATIC STORIES" },
  { icon: "🚀", text: "DESIGNING NEXT-GEN VISUALS" },
  { icon: "✨", text: "AHMED SHALABY — CREATIVE DIRECTOR" }
];

const pageContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.1
    }
  }
};

const unifiedItemVariants = {
  hidden: { opacity: 0, y: 25, scale: 0.97, filter: "blur(4px)" },
  visible: { 
    opacity: 1, 
    y: 0, 
    scale: 1,
    filter: "blur(0px)",
    transition: { type: "spring", stiffness: 130, damping: 15 }
  }
};

export default function HeroSection({ data, theme }) {
  const subtitle = data?.subtitle || "CREATIVE DIRECTOR & EDITOR";
  const titleLine1 = data?.titleLine1 || "CRAFTING";
  const titleLine2 = data?.titleLine2 || "VISUAL";
  const titleLine3 = data?.titleLine3 || "LEGACIES.";
  
  const scale = theme?.headingScale || 1;
  const headingStyle = { transform: `scale(${scale})`, transformOrigin: 'center left' };

  const [mounted, setMounted] = useState(false);
  const [isHoveredAvatar, setIsHoveredAvatar] = useState(false);
  const [statusIndex, setStatusIndex] = useState(0);
  const avatarRef = useRef(null);

  const globalMouseX = useMotionValue(-1000);
  const globalMouseY = useMotionValue(-1000);

  const pupilX = useSpring(0, { stiffness: 200, damping: 22 });
  const pupilY = useSpring(0, { stiffness: 200, damping: 22 });

  useEffect(() => {
    setMounted(true);
    const globalMove = (e) => {
      globalMouseX.set(e.clientX);
      globalMouseY.set(e.clientY);

      if (avatarRef.current) {
        const rect = avatarRef.current.getBoundingClientRect();
        const avatarCenterX = rect.left + rect.width * 0.5;
        const avatarCenterY = rect.top + rect.height * 0.43;

        const deltaX = e.clientX - avatarCenterX;
        const deltaY = e.clientY - avatarCenterY;
        const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

        const maxMove = 3;
        const angle = Math.atan2(deltaY, deltaX);

        pupilX.set(Math.cos(angle) * Math.min(maxMove, distance * 0.012));
        pupilY.set(Math.sin(angle) * Math.min(maxMove, distance * 0.012));
      }
    };

    window.addEventListener("mousemove", globalMove);
    return () => window.removeEventListener("mousemove", globalMove);
  }, [pupilX, pupilY]);

  // Infinite cycling discovery text
  useEffect(() => {
    if (!mounted) return;
    const interval = setInterval(() => {
      setStatusIndex((prev) => (prev + 1) % DISCOVERY_PHRASES.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [mounted]);

  if (!mounted) return <div className="min-h-screen bg-transparent" />;

  return (
    <motion.div 
      variants={pageContainerVariants}
      initial="hidden"
      animate="visible"
      className="relative min-h-screen w-full bg-transparent flex flex-col justify-center overflow-hidden"
    >
      {/* Global CursorEffects is now injected at the layout/page level, no local effects needed here */}

      {/* Header */}
      <motion.header variants={unifiedItemVariants} className="fixed top-0 left-0 w-full z-50 flex items-center justify-between px-8 sm:px-16 lg:px-24 py-6 border-b border-[#004741]/5" style={{ backdropFilter: "blur(12px)", backgroundColor: "rgba(244, 241, 230, 0.8)" }}>
        <a href="/" className="flex items-center gap-2 no-underline z-10 font-black text-[var(--theme-primary)] tracking-[0.15em] text-[1.1rem]">
          AHMED .
        </a>

        <nav className="hidden md:flex items-center gap-10">
          {NAV_LINKS.map((link) => (
            <a key={link.label} href={link.href} className="text-[0.85rem] font-bold text-[var(--theme-primary)]/70 tracking-[0.2em] uppercase py-2 hover:text-[var(--theme-primary)] transition-colors relative group overflow-hidden">
              {link.label}
              <span className="absolute bottom-0 left-0 w-full h-[1.5px] bg-[#004741] -translate-x-full group-hover:translate-x-0 transition-transform duration-300" />
            </a>
          ))}
        </nav>
        <a href="#contact" className="hidden md:inline-flex items-center px-5 py-2.5 rounded-full text-[#E6E3D5] bg-[#004741] text-[0.8rem] font-bold tracking-[0.15em] uppercase hover:scale-105 transition-transform">LET'S TALK</a>
      </motion.header>

      {/* Cycling Discovery Text — Glass Capsule */}
      <motion.div variants={unifiedItemVariants} className="absolute top-[23%] left-1/2 -translate-x-1/2 z-30 pointer-events-none hidden lg:block">
        <div className="bg-[#E6E3D5]/90 backdrop-blur-lg px-7 py-2.5 rounded-full border border-[#004741]/20 shadow-sm flex items-center justify-center min-w-[520px]">
          <h2 
            className="text-[1.15rem] lg:text-[1.25rem] font-black tracking-tight text-[var(--theme-primary)] uppercase whitespace-nowrap text-center flex items-center justify-center overflow-hidden gap-3"
            style={{ fontFamily: "var(--font-heading), sans-serif" }}
          >
            <AnimatePresence mode="wait">
              <motion.div key={statusIndex} className="flex items-center gap-3">
                <motion.span
                  initial={{ opacity: 0, scale: 0.5, rotate: -45 }}
                  animate={{ opacity: 1, scale: 1, rotate: 0 }}
                  exit={{ opacity: 0, scale: 0.5, rotate: 45 }}
                  transition={{ type: "spring", stiffness: 200, damping: 15 }}
                  className="inline-block"
                >
                  {DISCOVERY_PHRASES[statusIndex].icon}
                </motion.span>

                <span className="flex items-center">
                  {DISCOVERY_PHRASES[statusIndex].text.split("").map((char, index) => {
                    if (char === " ") return <span key={index} className="w-[0.45em]">&nbsp;</span>;
                    return (
                      <span key={index} className="inline-block overflow-hidden h-[1.5em] relative">
                        <motion.span
                          initial={{ y: "100%", rotateX: 90, filter: "blur(3px)" }}
                          animate={{ y: 0, rotateX: 0, filter: "blur(0px)" }}
                          exit={{ y: "-100%", rotateX: -90, filter: "blur(3px)" }}
                          transition={{
                            type: "spring",
                            stiffness: 160,
                            damping: 15,
                            delay: index * 0.02,
                          }}
                          className="inline-block origin-center"
                        >
                          {char}
                        </motion.span>
                      </span>
                    );
                  })}
                </span>
              </motion.div>
            </AnimatePresence>
          </h2>
        </div>
      </motion.div>

      {/* ═══ FLUID FULL-WIDTH 3-COLUMN HERO ═══ */}
      <div className="relative z-10 w-full min-h-screen px-8 sm:px-16 lg:px-24 flex flex-col lg:flex-row items-center justify-between gap-8 mx-auto">

        {/* Column 1: Text Content — Left Edge */}
        <div className="lg:w-[35%] w-full flex flex-col items-start text-left">
          <motion.span variants={unifiedItemVariants} className="text-[0.65rem] font-bold tracking-[0.2em] text-[var(--theme-primary)]/60 uppercase mb-3">
            ‣ {subtitle}
          </motion.span>
          <motion.h1 
            variants={unifiedItemVariants}
            className="text-[3rem] lg:text-[4.2rem] font-black leading-[1.05] text-[var(--theme-primary)] tracking-tight mb-6"
            style={{ fontFamily: "var(--font-heading), sans-serif" }}
          >
            <motion.div initial={{ y: "100%" }} animate={{ y: "0%" }} transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.3 }} style={headingStyle}>{titleLine1}</motion.div>
            <motion.div initial={{ y: "100%" }} animate={{ y: "0%" }} transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.4 }} style={headingStyle}>{titleLine2}</motion.div>
            <motion.div initial={{ y: "100%" }} animate={{ y: "0%" }} transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.5 }} style={headingStyle}>{titleLine3}</motion.div>
          </motion.h1>
          <motion.p
            variants={unifiedItemVariants}
            className="text-[0.95rem] lg:text-[1.05rem] font-medium text-[var(--theme-primary)]/80 max-w-[480px] leading-relaxed mb-8 text-left"
          >
            Transforming ideas into captivating designs and cinematic edits — where creativity meets purpose.
          </motion.p>
          <motion.div variants={unifiedItemVariants} className="flex items-center gap-6 flex-wrap justify-start mt-2">
            {/* Design Badge */}
            <motion.div
              whileHover={{ 
                scale: 1.05, 
                boxShadow: "0px 0px 35px rgba(0, 71, 65, 0.45)",
                borderColor: "rgba(0, 71, 65, 0.5)"
              }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center justify-center gap-4 px-10 py-5 bg-[#004741] text-[#E6E3D5] rounded-full text-[1rem] font-black tracking-wider uppercase shadow-md cursor-pointer border border-transparent transition-all duration-200 z-10 select-none leading-none h-auto"
            >
              <svg className="w-5 h-5 text-[#E6E3D5]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
              <span>Design</span>
            </motion.div>

            {/* Video Badge */}
            <motion.div
              whileHover={{ 
                scale: 1.05, 
                boxShadow: "0px 0px 35px rgba(0, 71, 65, 0.25)",
                borderColor: "rgba(0, 71, 65, 0.3)",
                backgroundColor: "rgba(230, 227, 213, 0.95)"
              }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center justify-center gap-4 px-10 py-5 bg-[#E6E3D5] text-[var(--theme-primary)] rounded-full text-[1rem] font-black tracking-wider uppercase shadow-md cursor-pointer border border-[#004741]/15 transition-all duration-200 z-10 select-none leading-none h-auto"
            >
              <svg className="w-5 h-5 text-[var(--theme-primary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              <span>Video</span>
            </motion.div>
          </motion.div>
        </div>

        {/* Column 2: Center Avatar — Responsive vw-based sizing */}
        <motion.div
          variants={unifiedItemVariants}
          className="w-full lg:w-auto flex justify-center items-center relative flex-shrink-0"
        >
          <motion.div
            className="absolute -top-14 bg-[#004741] text-[#F0EEE4] text-[0.7rem] font-bold tracking-wider uppercase px-4 py-2 rounded-xl shadow-md whitespace-nowrap pointer-events-none z-30"
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: isHoveredAvatar ? 1 : 0, y: isHoveredAvatar ? 0 : 10, scale: isHoveredAvatar ? 1 : 0.95 }}
            transition={{ type: "spring", stiffness: 400, damping: 20 }}
          >
            Ahmed Shalaby — Designer & Editor
            <div className="absolute bottom-[-4px] left-1/2 -translate-x-1/2 w-2 h-2 bg-[#004741] rotate-45" />
          </motion.div>

          {/* Floating Icons (Matching Reference) */}
          <motion.div
            className="absolute top-[10%] right-[-12%] z-40 hidden lg:block"
            animate={{ y: [0, -15, 0], rotate: [10, 15, 10] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          >
            {/* Photoshop Icon */}
            <div className="w-14 h-14 rounded-[1.25rem] bg-[#001833] border border-[#31A8FF]/20 flex items-center justify-center shadow-2xl shadow-[#001833]/40 transform scale-110">
              <span className="text-[#31A8FF] font-black text-xl tracking-tighter">Ps</span>
            </div>
          </motion.div>

          <motion.div
            className="absolute bottom-[25%] right-[-18%] z-40 hidden lg:block"
            animate={{ y: [0, -20, 0], rotate: [-10, -5, -10] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          >
            {/* AI Generative Icon */}
            <div className="w-14 h-14 rounded-[1.25rem] bg-gradient-to-br from-[#FF007A] to-[#7000FF] flex items-center justify-center shadow-2xl shadow-[#7000FF]/40 border border-white/20 transform scale-125">
              <svg className="w-7 h-7 text-white drop-shadow-sm" fill="currentColor" viewBox="0 0 24 24">
                <path d="M11.64 5.23a.75.75 0 011.22 0l2.21 3.23a2.25 2.25 0 001.29.98l3.7.88a.75.75 0 010 1.46l-3.7.88a2.25 2.25 0 00-1.29.98l-2.21 3.23a.75.75 0 01-1.22 0l-2.21-3.23a2.25 2.25 0 00-1.29-.98l-3.7-.88a.75.75 0 010-1.46l3.7-.88a2.25 2.25 0 001.29-.98l2.21-3.23z"/>
              </svg>
            </div>
          </motion.div>

          <motion.div
            className="absolute top-[45%] left-[-15%] z-40 hidden lg:block"
            animate={{ y: [0, -12, 0], rotate: [-15, -8, -15] }}
            transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
          >
            {/* Premiere Pro Icon */}
            <div className="w-14 h-14 rounded-[1.25rem] bg-[#00005B] border border-[#9999FF]/20 flex items-center justify-center shadow-2xl shadow-[#00005B]/40 transform scale-110">
              <span className="text-[#9999FF] font-black text-xl tracking-tighter">Pr</span>
            </div>
          </motion.div>

          <motion.div
            ref={avatarRef}
            className="relative flex items-center justify-center cursor-none z-20 overflow-hidden"
            style={{ width: "clamp(220px, 24vw, 340px)", aspectRatio: "3 / 4" }}
            onMouseEnter={() => setIsHoveredAvatar(true)}
            onMouseLeave={() => setIsHoveredAvatar(false)}
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
          >
            {/* Base face layer */}
            <Image
              src="/my-face.png"
              alt="Ahmed Shalaby"
              fill
              sizes="(max-width: 768px) 80vw, 30vw"
              priority
              className="object-contain z-20 pointer-events-none"
            />

            {/* Pupils layer — perfect 1:1 stack */}
            <motion.div
              className="absolute inset-0 z-10 pointer-events-none w-full h-full"
              style={{ x: pupilX, y: pupilY }}
            >
              <Image
                src="/my-pupils.png"
                alt="Eyes Tracking"
                fill
                sizes="(max-width: 768px) 80vw, 30vw"
                priority
                className="object-contain pointer-events-none"
              />
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Column 3: Showreel — Right Edge */}
        <motion.div
          variants={unifiedItemVariants}
          className="lg:w-[38%] w-full flex justify-center lg:justify-end"
        >
          <MagneticMedia />
        </motion.div>

      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 opacity-50 z-20">
        <span className="text-[10px] font-bold uppercase tracking-widest text-[#004741]">Scroll</span>
        <div className="w-4 h-7 rounded-full border border-[#004741] flex justify-center p-1">
          <motion.div className="w-1 h-1 rounded-full bg-[#004741]" animate={{ y: [0, 6, 0] }} transition={{ duration: 1.5, repeat: Infinity }} />
        </div>
      </div>
    </motion.div>
  );
}