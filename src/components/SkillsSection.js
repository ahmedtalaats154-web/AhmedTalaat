"use client";

import { motion } from "framer-motion";

const DEFAULT_SKILLS = [
  { id: "ps", name: "PHOTOSHOP", desc: "Create and edit stunning images, retouch photos, and design graphics.", iconText: "Ps", iconColor: "#31A8FF", iconBg: "#001833" },
  { id: "ai", name: "ILLUSTRATOR", desc: "Design scalable vector art, logos, icons, and detailed illustrations.", iconText: "Ai", iconColor: "#FF9A00", iconBg: "#330000" },
  { id: "ae", name: "AFTER EFFECTS", desc: "Create cinematic visual effects, complex motion graphics, and animations.", iconText: "Ae", iconColor: "#9999FF", iconBg: "#00005B" },
  { id: "pr", name: "PREMIERE PRO", desc: "Edit professional videos, craft stories, and compile engaging cinematic reels.", iconText: "Pr", iconColor: "#EA77FF", iconBg: "#2A004D" },
];

export default function SkillsSection({ data }) {
  const skillsData = data || DEFAULT_SKILLS;

  return (
    <section id="skills" className="relative w-full py-24 lg:py-40 px-8 sm:px-16 lg:px-24 bg-[var(--theme-bg)] overflow-hidden flex flex-col items-center z-10 border-t border-[var(--theme-primary)]/10 border-b">
      {/* Decorative text */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none opacity-[0.03] w-[150%] text-center overflow-hidden">
        <h1 className="text-[20vw] font-black text-[var(--theme-primary)] whitespace-nowrap leading-none">EXPERTISE</h1>
      </div>

      <div className="w-full max-w-7xl relative z-10 flex flex-col lg:flex-row gap-16 lg:gap-24 items-center">
        
        {/* Title Area */}
        <div className="lg:w-1/3 flex flex-col items-center lg:items-start text-center lg:text-left shrink-0">
          <span className="text-[0.65rem] font-bold tracking-[0.2em] text-[var(--theme-primary)]/60 uppercase block mb-3">‣ The Toolkit</span>
          <h2 className="text-[3rem] lg:text-[4.5rem] font-black text-[var(--theme-primary)] tracking-tight m-0 leading-[1]" style={{ fontFamily: "var(--font-heading), sans-serif" }}>
            SKILLS.
          </h2>
          <p className="text-[var(--theme-primary)]/80 text-sm font-medium mt-6 max-w-xs mx-auto lg:mx-0 leading-relaxed">
            I don't just use software; I leverage industry-standard tools to craft pixel-perfect designs and cinematic experiences that leave a lasting impact.
          </p>
        </div>

        {/* Skills Grid */}
        <div className="lg:w-2/3 w-full grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-10 lg:gap-y-14">
          {skillsData.map((skill, index) => (
            <motion.div 
              key={skill.id || index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              className="flex flex-col gap-4 group"
            >
              <div className="flex items-center gap-4">
                <motion.div 
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ type: "spring", stiffness: 300, damping: 15 }}
                  className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-md border"
                  style={{ backgroundColor: skill.iconBg || '#000', borderColor: `${skill.iconColor || '#fff'}20` }}
                >
                  <span className="font-black text-xl tracking-tighter" style={{ color: skill.iconColor || '#fff' }}>
                    {skill.iconText || 'Aa'}
                  </span>
                </motion.div>
                <h3 className="text-[var(--theme-primary)] font-black text-lg tracking-wider uppercase group-hover:text-[var(--theme-primary)]/70 transition-colors">
                  {skill.name}
                </h3>
              </div>
              
              {/* Divider Line */}
              <div className="w-full h-[1px] bg-[var(--theme-primary)]/10 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  whileInView={{ width: "100%" }}
                  viewport={{ once: true }}
                  transition={{ duration: 1, delay: 0.2 + (index * 0.1), ease: "circOut" }}
                  className="h-full bg-[var(--theme-primary)]/40"
                  style={{ backgroundColor: skill.iconColor || 'var(--theme-primary)' }}
                />
              </div>

              <p className="text-[var(--theme-primary)]/70 text-xs font-medium leading-relaxed max-w-[90%]">
                {skill.desc}
              </p>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
