"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function IndustryCampaigns({ data }) {
  const defaultData = {
    title: "INDUSTRY CAMPAIGNS.",
    subtitle: "Tailored Solutions",
    categories: [
      { id: 'cat1', name: 'All', designs: [] }
    ],
    layout: {
      textPaddingLeft: 16,
      textPaddingBottom: 16,
      titleSize: 18,
      textColor: '#E6E3D5',
      textAlign: 'left'
    }
  };

  const campaigns = data || defaultData;
  const categories = campaigns.categories || [];
  const layout = campaigns.layout || defaultData.layout;
  const tabsLayout = campaigns.tabsLayout || { paddingX: 24, paddingY: 12, textSize: 12, gap: 16, marginTop: 48, marginBottom: 48 };
  
  const [activeTab, setActiveTab] = useState(categories[0]?.id || null);

  // If there's no data, don't render anything
  if (!categories.length) return null;

  const activeCategory = categories.find(c => c.id === activeTab) || categories[0];

  return (
    <section id="campaigns" className="relative w-full py-24 lg:py-40 bg-[var(--theme-bg)] overflow-hidden flex flex-col items-center">
      
      {/* Decorative large text background */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none opacity-[0.03] w-[150%] text-center overflow-hidden">
        <h1 className="text-[25vw] font-black text-[var(--theme-primary)] whitespace-nowrap leading-none">CAMPAIGNS</h1>
      </div>

      <div className="w-full max-w-7xl px-8 sm:px-16 lg:px-24 relative z-10 flex flex-col items-center">
        
        {/* Section Header */}
        <div className="text-center">
          <span className="text-[0.65rem] font-bold tracking-[0.2em] text-[var(--theme-primary)]/60 uppercase block mb-3">‣ {campaigns.subtitle}</span>
          <h2 className="text-[2.5rem] lg:text-[4.5rem] font-black text-[var(--theme-primary)] tracking-tight m-0" style={{ fontFamily: "var(--font-heading), sans-serif" }}>
            {campaigns.title}
          </h2>
        </div>

        {/* Category Tabs */}
        <div 
          className="flex flex-wrap justify-center z-20 relative w-full"
          style={{ 
            gap: `${tabsLayout.gap || 16}px`, 
            marginTop: `${tabsLayout.marginTop || 48}px`, 
            marginBottom: `${tabsLayout.marginBottom || 48}px` 
          }}
        >
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveTab(cat.id)}
              style={{
                padding: `${tabsLayout.paddingY || 12}px ${tabsLayout.paddingX || 24}px`,
                fontSize: `${tabsLayout.textSize || 12}px`
              }}
              className={`relative rounded-full font-bold uppercase tracking-widest transition-colors duration-300 ${
                activeTab === cat.id ? 'text-[var(--theme-bg)]' : 'text-[var(--theme-primary)] hover:bg-[var(--theme-primary)]/5'
              }`}
            >
              {activeTab === cat.id && (
                <motion.div
                  layoutId="activeTabPill"
                  className="absolute inset-0 bg-[var(--theme-primary)] rounded-full -z-10"
                  transition={{ type: "spring", stiffness: 300, damping: 25 }}
                />
              )}
              {cat.name}
            </button>
          ))}
        </div>

        {/* Projects Grid */}
        <div className="w-full relative min-h-[400px] mt-4">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {activeCategory?.designs?.map((design, idx) => (
                <motion.div
                  key={design.id || idx}
                  whileHover={{ y: -10 }}
                  className="relative rounded-[2rem] overflow-hidden group shadow-xl bg-[var(--theme-primary)] aspect-[4/5] cursor-pointer"
                >
                  <img src={design.img} alt={design.title} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-90 group-hover:opacity-100" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500" />
                  
                  <div 
                    className="absolute bottom-0 left-0 right-0 flex flex-col justify-end transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500"
                    style={{ padding: `${layout.textPaddingBottom || 16}px ${layout.textPaddingLeft || 16}px` }}
                  >
                    <span 
                      className="font-black uppercase tracking-widest mb-1 drop-shadow-md" 
                      style={{ color: layout.textColor ? layout.textColor + 'b3' : 'rgba(230,227,213,0.7)', fontSize: `${(layout.titleSize || 18) * 0.6}px`, textAlign: layout.textAlign || 'left' }}
                    >
                      {design.type}
                    </span>
                    <h3 
                      className="font-black leading-none drop-shadow-lg" 
                      style={{ color: layout.textColor || '#E6E3D5', fontSize: `${layout.titleSize || 18}px`, textAlign: layout.textAlign || 'left' }}
                    >
                      {design.title}
                    </h3>
                  </div>
                </motion.div>
              ))}
              
              {/* Empty state if category has no designs */}
              {(!activeCategory?.designs || activeCategory.designs.length === 0) && (
                <div className="col-span-full py-20 text-center text-[var(--theme-primary)]/50 font-medium">
                  No campaigns added to this category yet.
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

      </div>
    </section>
  );
}
