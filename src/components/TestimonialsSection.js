"use client";
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { useRef } from 'react';

export default function TestimonialsSection({ data }) {
  const TESTIMONIALS = data || [
    {
      id: 1,
      name: "Sarah Jenkins",
      role: "Marketing Director",
      quote: "Ahmed completely transformed our brand's visual identity. The attention to detail and cinematic quality in his video edits doubled our social engagement within a month.",
    },
    {
      id: 2,
      name: "Omar Tariq",
      role: "Startup Founder",
      quote: "Working with Ahmed was a game-changer. He understands the intersection of modern design and conversion-focused marketing better than any agency we've hired.",
    },
    {
      id: 3,
      name: "Elena Rostova",
      role: "Creative Lead",
      quote: "A true master of his craft. The motion graphics he delivered were buttery smooth, perfectly paced, and exceeded our wildest expectations.",
    }
  ];

  const containerRef = useRef(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });
  
  // Create a parallax scrolling effect for the middle card to break the grid
  const smoothProgress = useSpring(scrollYProgress, { stiffness: 100, damping: 20 });
  const yOffset = useTransform(smoothProgress, [0, 1], [60, -60]);

  return (
    <section ref={containerRef} id="testimonials" className="relative w-full py-24 lg:py-40 bg-[#F4F1E6] overflow-hidden flex flex-col items-center">
      <div className="w-full px-8 sm:px-16 lg:px-24 mb-20 text-center">
        <span className="text-[0.65rem] font-bold tracking-[0.2em] text-[#004741]/60 uppercase block mb-3">‣ Word on the street</span>
        <h2 className="text-[3rem] lg:text-[4.5rem] font-black text-[#004741] tracking-tight m-0 uppercase" style={{ fontFamily: "var(--font-heading), sans-serif" }}>
          TESTIMONIALS
        </h2>
      </div>

      <div className="w-full max-w-7xl px-4 sm:px-8 flex flex-col lg:flex-row gap-6 relative z-10">
        {TESTIMONIALS.map((test, i) => (
          <motion.div 
            key={test.id}
            style={{ y: i === 1 ? yOffset : 0 }}
            className="flex-1 bg-[#E6E3D5] rounded-[2.5rem] p-10 px-12 lg:p-12 lg:px-16 border border-[#004741]/10 shadow-xl shadow-[#004741]/5 flex flex-col justify-between min-h-[350px]"
          >
            <div>
              <span className="text-[#004741]/20 font-serif text-7xl leading-none block h-10 mb-2">"</span>
              <p className="text-[#004741]/80 font-medium leading-relaxed text-base lg:text-lg italic">
                {test.quote}
              </p>
            </div>
            <div className="mt-10 flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-[#004741] flex items-center justify-center">
                <span className="text-[#E6E3D5] font-black text-lg">{test.name.charAt(0)}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-[#004741] font-black text-sm uppercase tracking-wider">{test.name}</span>
                <span className="text-[#004741]/60 text-xs font-bold">{test.role}</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
