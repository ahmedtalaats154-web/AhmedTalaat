"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useSpring, useMotionTemplate } from "framer-motion";

function ParticleShape({ type }) {
  switch (type) {
    case 0: // Triangle
      return <polygon points="12,2 22,22 2,22" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />;
    case 1: // Diamond
      return <rect x="5" y="5" width="14" height="14" transform="rotate(45 12 12)" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />;
    case 2: // Cross/Star
      return (
        <path d="M12 2C12 7.5 16.5 12 22 12C16.5 12 12 16.5 12 22C12 16.5 7.5 12 2 12C7.5 12 12 7.5 12 2Z" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      );
    case 3: // Circle
      return <circle cx="12" cy="12" r="7" fill="none" stroke="currentColor" strokeWidth="1.5" />;
    default:
      return null;
  }
}

export default function CursorEffects() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Check if it's a touch device or small screen
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768 || ('ontouchstart' in window) || navigator.maxTouchPoints > 0);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const mouseRef = useRef({ x: -1000, y: -1000 });
  const isDarkRef = useRef(false);
  const animRef = useRef(null);

  // Particles array for physics simulation
  const particlesRef = useRef([]);
  const particleElsRef = useRef([]);

  // Initialize particles once on the client
  useEffect(() => {
    particlesRef.current = Array.from({ length: 35 }, (_, i) => ({
      id: i,
      type: i % 4,
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      vx: (Math.random() - 0.5) * 0.8,
      vy: (Math.random() - 0.5) * 0.8,
      rot: Math.random() * 360,
      scale: 0.3 + Math.random() * 0.6,
    }));
  }, []);

  const [isDarkBg, setIsDarkBg] = useState(false);
  const [isClicked, setIsClicked] = useState(false);

  const rawCursorX = useMotionValue(-100);
  const rawCursorY = useMotionValue(-100);
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  
  // Motion values for colors to avoid lag
  const themeColor = useMotionValue("#004741");
  const glowColor = useMotionValue("rgba(0, 71, 65, 0.05)"); 
  const particleColor = useMotionValue("rgba(0, 71, 65, 0.15)");
  // Tighter spring for a faster, smoother, less bouncy cursor
  const springConfig = { mass: 0.1, stiffness: 1000, damping: 40 }; 
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);

  const glowBackground = useMotionTemplate`radial-gradient(500px circle at ${rawCursorX}px ${rawCursorY}px, ${glowColor}, transparent 70%)`;

  useEffect(() => {
    if (isMobile) return; // Completely disable physics loop on mobile!

    const onMove = (e) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
      rawCursorX.set(e.clientX);
      rawCursorY.set(e.clientY);
      cursorX.set(e.clientX - 16); 
      cursorY.set(e.clientY - 16);
    };

    window.addEventListener("mousemove", onMove, { passive: true });

    let frameCount = 0;
    const animate = () => {
      const { x, y } = mouseRef.current;
      
      // 1. Raycast color check (throttled for performance)
      if (frameCount % 3 === 0 && x >= 0 && y >= 0) {
        const el = document.elementFromPoint(x, y);
        if (el) {
          const overDark = 
            el.closest('[data-cursor="light"]') !== null || 
            el.closest('.bg-\\[\\#004741\\]') !== null;
          
          if (isDarkRef.current !== overDark) {
            isDarkRef.current = overDark;
            setIsDarkBg(overDark);
            
            themeColor.set(overDark ? "#F4F1E6" : "#004741");
            glowColor.set(overDark ? "rgba(244, 241, 230, 0.06)" : "rgba(0, 71, 65, 0.06)");
            particleColor.set(overDark ? "rgba(244, 241, 230, 0.15)" : "rgba(0, 71, 65, 0.15)");
          }
        }
      }

      // 2. Particle Physics Simulation
      particlesRef.current.forEach((p, i) => {
        // Natural drift
        p.x += p.vx;
        p.y += p.vy;
        p.rot += 0.4;

        // Bounce off screen boundaries gently
        if (p.x < 0) p.vx = Math.abs(p.vx);
        if (p.x > window.innerWidth) p.vx = -Math.abs(p.vx);
        if (p.y < 0) p.vy = Math.abs(p.vy);
        if (p.y > window.innerHeight) p.vy = -Math.abs(p.vy);

        // Repel away from cursor (magnetic anti-gravity effect)
        const dx = p.x - x;
        const dy = p.y - y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        if (dist < 150 && dist > 0) {
          const force = (150 - dist) / 150;
          p.x += (dx / dist) * force * 4;
          p.y += (dy / dist) * force * 4;
        }

        // Direct DOM update (bypasses React for 60fps performance)
        const el = particleElsRef.current[i];
        if (el) {
          el.style.transform = `translate(${p.x}px, ${p.y}px) rotate(${p.rot}deg) scale(${p.scale})`;
        }
      });

      frameCount++;
      animRef.current = requestAnimationFrame(animate);
    };

    animRef.current = requestAnimationFrame(animate);

    const handleMouseDown = () => setIsClicked(true);
    const handleMouseUp = () => setIsClicked(false);

    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, [cursorX, cursorY, rawCursorX, rawCursorY, themeColor, glowColor, particleColor, isMobile]);

  // Initial render (particles mount invisibly until JS positions them)
  const renderParticles = Array.from({ length: 35 }).map((_, i) => (
    <div
      key={i}
      ref={el => particleElsRef.current[i] = el}
      className="absolute left-0 top-0 w-6 h-6 origin-center"
      style={{ transform: "scale(0)" }} // hide until first frame
    >
      <svg viewBox="0 0 24 24" className="w-full h-full">
        <ParticleShape type={i % 4} />
      </svg>
    </div>
  ));

  if (isMobile) return null;

  return (
    <>
      {/* 1. Global Soft Radial Glow */}
      <motion.div
        className="fixed inset-0 pointer-events-none z-[9990] transition-colors duration-500"
        style={{ background: glowBackground }}
      />

      {/* 2. Global Drifting Geometric Particles (Physics Layer) */}
      <motion.div 
        className="fixed inset-0 pointer-events-none z-[9991] overflow-hidden"
        style={{ color: particleColor, transition: "color 0.5s ease" }}
      >
        {renderParticles}
      </motion.div>

      {/* 3. The Perfect Diamond Cursor */}
      <motion.div
        className="hidden md:flex fixed top-0 left-0 pointer-events-none z-[9999] items-center justify-center"
        style={{
          x: cursorXSpring,
          y: cursorYSpring,
          width: 32,
          height: 32,
          willChange: "transform",
        }}
      >
        <motion.div 
          className="w-6 h-6 flex items-center justify-center transition-colors duration-300 shadow-md"
          animate={{ 
            rotate: [45, 405],
            scale: isClicked ? 0.4 : 1
          }}
          transition={{
            rotate: { duration: 8, repeat: Infinity, ease: "linear" },
            scale: { type: "spring", stiffness: 400, damping: 25 }
          }}
          style={{ 
            backgroundColor: isDarkBg ? "#F4F1E6" : "transparent",
            borderColor: isDarkBg ? "#F4F1E6" : "#004741",
            borderWidth: "1.5px"
          }}
        >
          <div 
            className="w-1.5 h-1.5 rounded-full transition-colors duration-300"
            style={{ backgroundColor: isDarkBg ? "#004741" : "#004741" }}
          />
        </motion.div>
      </motion.div>
    </>
  );
}
