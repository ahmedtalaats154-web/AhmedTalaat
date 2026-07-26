"use client";
import { motion } from 'framer-motion';

export default function ContactSection({ data }) {
  const title = data?.title || "GET IN TOUCH.";
  const subtitle = data?.subtitle || "Start a project";
  const email = data?.email || "a7medboy154@gmail.com";
  const buttonText = data?.buttonText || "SEND MESSAGE";
  const textAlign = data?.textAlign || "center";

  return (
    <section id="contact" className="relative w-full py-24 lg:py-40 bg-[#004741] overflow-hidden flex flex-col items-center">
      {/* Decorative large text background */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none opacity-[0.03] w-[150%] text-center overflow-hidden">
        <h1 className="text-[25vw] font-black text-[#E6E3D5] whitespace-nowrap leading-none">LET'S TALK</h1>
      </div>

      <div className="w-full max-w-4xl px-8 sm:px-16 lg:px-24 relative z-10 flex flex-col items-center">
        <span className="text-[0.65rem] font-bold tracking-[0.2em] text-[#E6E3D5]/60 uppercase block mb-3" style={{ textAlign }}>‣ {subtitle}</span>
        <h2 className="text-[3rem] lg:text-[4.5rem] font-black text-[#E6E3D5] tracking-tight m-0 mb-12 leading-[1]" style={{ fontFamily: "var(--font-heading), sans-serif", textAlign }}>
          {title}
        </h2>

        <form 
          className="w-full flex flex-col gap-6" 
          action={`mailto:${email}`}
          method="POST" 
          encType="text/plain"
        >
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex-1 flex flex-col">
              <label className="text-[#E6E3D5]/70 text-xs font-bold uppercase tracking-widest mb-2 ml-14 sm:ml-16">Name</label>
              <input 
                type="text" 
                name="Name"
                placeholder="John Doe" 
                required
                className="w-full bg-[#E6E3D5]/10 border border-[#E6E3D5]/20 rounded-full py-6 text-[#E6E3D5] placeholder-[#E6E3D5]/30 outline-none focus:border-[#E6E3D5]/50 transition-colors"
                style={{ paddingLeft: `${data?.inputPaddingX || 64}px`, paddingRight: `${data?.inputPaddingX || 64}px` }}
              />
            </div>
            <div className="flex-1 flex flex-col">
              <label className="text-[#E6E3D5]/70 text-xs font-bold uppercase tracking-widest mb-2 ml-14 sm:ml-16">Email</label>
              <input 
                type="email" 
                name="Email"
                placeholder="john@example.com" 
                required
                className="w-full bg-[#E6E3D5]/10 border border-[#E6E3D5]/20 rounded-full py-6 text-[#E6E3D5] placeholder-[#E6E3D5]/30 outline-none focus:border-[#E6E3D5]/50 transition-colors"
                style={{ paddingLeft: `${data?.inputPaddingX || 64}px`, paddingRight: `${data?.inputPaddingX || 64}px` }}
              />
            </div>
          </div>
          
          <div className="flex flex-col">
            <label className="text-[#E6E3D5]/70 text-xs font-bold uppercase tracking-widest mb-2 ml-14 sm:ml-16">Service Needed</label>
            <select name="Service" required className="w-full bg-[#E6E3D5]/10 border border-[#E6E3D5]/20 rounded-full py-6 text-[#E6E3D5] outline-none focus:border-[#E6E3D5]/50 transition-colors appearance-none" style={{ paddingLeft: `${data?.inputPaddingX || 64}px`, paddingRight: `${data?.inputPaddingX || 64}px` }}>
              <option value="" className="text-black">Select a service...</option>
              <option value="brand" className="text-black">Brand Identity</option>
              <option value="video" className="text-black">Video Editing</option>
              <option value="motion" className="text-black">Motion Graphics</option>
              <option value="other" className="text-black">Other</option>
            </select>
          </div>

          <div className="flex flex-col">
            <label className="text-[#E6E3D5]/70 text-xs font-bold uppercase tracking-widest mb-2 ml-14 sm:ml-16">Project Details</label>
            <textarea 
              name="Project Details"
              rows="4"
              required
              placeholder="Tell me about your project, timeline, and budget..." 
              className="w-full bg-[#E6E3D5]/10 border border-[#E6E3D5]/20 rounded-[3rem] py-8 text-[#E6E3D5] placeholder-[#E6E3D5]/30 outline-none focus:border-[#E6E3D5]/50 transition-colors resize-none"
              style={{ paddingLeft: `${data?.inputPaddingX || 64}px`, paddingRight: `${data?.inputPaddingX || 64}px` }}
            ></textarea>
          </div>

          <div className="w-full flex mt-6" style={{ justifyContent: data?.buttonAlign || 'center' }}>
            <motion.button 
              type="submit"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="bg-[#E6E3D5] text-[#004741] rounded-full font-black uppercase tracking-[0.2em] hover:bg-white transition-colors cursor-pointer"
              style={{
                 padding: `${data?.buttonPaddingY || 24}px ${data?.buttonPaddingX || 64}px`,
                 fontSize: `${data?.buttonTextSize || 14}px`,
                 marginTop: `${data?.buttonMarginTop || 0}px`,
                 width: data?.buttonFullWidth ? '100%' : 'auto'
              }}
            >
              {buttonText}
            </motion.button>
          </div>
        </form>
      </div>
    </section>
  );
}
