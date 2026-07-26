"use client";
import { motion } from 'framer-motion';

export default function ServicesSection({ data }) {
  const servicesList = data || [
    {
      id: "01",
      title: "BRAND IDENTITY",
      desc: "Crafting comprehensive, scalable visual systems. From iconic logo marks to typography and full brand guidelines that ensure your business stands out."
    },
    {
      id: "02",
      title: "VIDEO EDITING",
      desc: "Cinematic storytelling tailored for high retention. Commercials, documentaries, and social reels cut with precision, perfect pacing, and advanced color grading."
    },
    {
      id: "03",
      title: "MOTION GRAPHICS",
      desc: "Breathing life into static designs. Kinetic typography, 3D product visualizations, and dynamic UI animations that capture and hold audience attention."
    }
  ];

  return (
    <section id="services" className="relative w-full py-24 lg:py-40 bg-[#F4F1E6] overflow-hidden flex flex-col items-center">
      <div className="w-full px-8 sm:px-16 lg:px-24 mb-16 text-center">
        <span className="text-[0.65rem] font-bold tracking-[0.2em] text-[#004741]/60 uppercase block mb-3">‣ What I Do</span>
        <h2 className="text-[3rem] lg:text-[4.5rem] font-black text-[#004741] tracking-tight m-0 uppercase" style={{ fontFamily: "var(--font-heading), sans-serif" }}>
          SERVICES
        </h2>
      </div>

      <div className="w-full max-w-7xl px-8 sm:px-16 lg:px-24 grid grid-cols-1 lg:grid-cols-3 gap-6 relative z-10">
        {servicesList.map((srv, i) => (
          <motion.div 
            key={srv.id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6, delay: i * 0.15, ease: "easeOut" }}
            whileHover={{ y: -10 }}
            className="group bg-[#E6E3D5] rounded-[2rem] p-10 px-12 lg:px-14 border border-[#004741]/5 shadow-lg relative overflow-hidden flex flex-col"
          >
            {/* Animated top border line */}
            <div className="absolute top-0 left-0 w-full h-1 bg-[#004741] transform origin-left scale-x-0 transition-transform duration-500 group-hover:scale-x-100" />
            
            <span className="text-[#004741]/20 font-black text-6xl mb-6 block leading-none">{srv.id}</span>
            <h3 className="text-[#004741] font-black text-2xl mb-4 tracking-tight break-words">{srv.title}</h3>
            <p className="text-[#004741]/70 font-medium leading-relaxed text-sm whitespace-normal break-words w-full pr-2">
              {srv.desc}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
