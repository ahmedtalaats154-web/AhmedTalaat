"use client";

import { useEffect } from 'react';
import HeroSection from '@/components/HeroSection';
import AboutSection from '@/components/AboutSection';
import ServicesSection from '@/components/ServicesSection';
import SkillsSection from '@/components/SkillsSection';
import PortfolioSection from '@/components/PortfolioSection';
import IndustryCampaigns from '@/components/IndustryCampaigns';
import TestimonialsSection from '@/components/TestimonialsSection';
import ContactSection from '@/components/ContactSection';
import CursorEffects from '@/components/CursorEffects';
import WhatsAppWidget from '@/components/WhatsAppWidget';

export default function ClientPage({ data }) {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const theme = data?.theme || { primaryColor: '#004741', bgColor: '#F4F1E6' };

  return (
    <main className="w-full min-h-screen bg-[var(--theme-bg)] selection:bg-[var(--theme-primary)] selection:text-[#E6E3D5] overflow-x-hidden antialiased">
      <style dangerouslySetInnerHTML={{__html: `
        :root {
          --theme-primary: ${theme.primaryColor};
          --theme-bg: ${theme.bgColor};
        }
      `}} />
      <CursorEffects />

      {(() => {
        const defaultSections = [
          {id: 'hero', name: 'Hero Section', visible: true},
          {id: 'about', name: 'About Section', visible: true},
          {id: 'services', name: 'Services Section', visible: true},
          {id: 'skills', name: 'Skills Section', visible: true},
          {id: 'portfolio', name: 'Portfolio Section', visible: true},
          {id: 'industryCampaigns', name: 'Campaigns Section', visible: true},
          {id: 'testimonials', name: 'Reviews Section', visible: true},
          {id: 'contact', name: 'Contact Section', visible: true}
        ];
        
        const sectionsConfig = data?.sections || defaultSections;
        const visibleSections = sectionsConfig.filter(s => s.visible !== false);

        return visibleSections.map((sec, index) => {
          let Component = null;
          
          switch(sec.id) {
            case 'hero': Component = <HeroSection data={data?.hero} theme={theme} />; break;
            case 'about': Component = <AboutSection data={data?.about} />; break;
            case 'services': Component = <ServicesSection data={data?.services} />; break;
            case 'skills': Component = <SkillsSection data={data?.skills} />; break;
            case 'portfolio': Component = <PortfolioSection portfolioItems={data?.portfolioItems} moreWorks={data?.moreWorks} portfolioLayout={data?.portfolioLayout} moreWorksLayout={data?.moreWorksLayout} />; break;
            case 'industryCampaigns': Component = <IndustryCampaigns data={data?.industryCampaigns} />; break;
            case 'testimonials': Component = <TestimonialsSection data={data?.testimonials} />; break;
            case 'contact': Component = <ContactSection data={data?.contact} />; break;
            default: return null;
          }

          if (!Component) return null;

          return (
            <div key={sec.id}>
              {Component}
              {/* Add spacing block after every section except the last one (if it's not contact) - actually we should add spacing after all except contact usually. Wait, contact is dark green, if contact is not the last, we might need spacing. Let's just add spacing after every section except the very last one. */}
              {index < visibleSections.length - 1 && (
                <div className="w-full h-16 lg:h-40 bg-[var(--theme-bg)]" />
              )}
            </div>
          );
        });
      })()}
      
      {/* Footer */}
      <footer className="w-full bg-[#004741] border-t border-[#E6E3D5]/10 pt-20 pb-12 px-8 flex flex-col items-center justify-center z-20 relative overflow-hidden text-center">
        <div className="w-full max-w-7xl flex flex-col items-center gap-10 mb-16">
          <div className="flex flex-col items-center">
            <h2 className="text-[#E6E3D5] text-[3.5rem] sm:text-[5rem] lg:text-[6rem] font-black tracking-tighter leading-none m-0" style={{ fontFamily: "var(--font-heading), sans-serif" }}>
              {data?.footer?.name || "SHALABY."}
            </h2>
            <p className="text-[#E6E3D5]/60 text-sm font-medium mt-4 max-w-md mx-auto leading-relaxed">
              {data?.footer?.description || "Creative Graphic Designer and Video Editor based in Egypt. Let's create something beautiful together."}
            </p>
          </div>
          
          <div className="flex flex-wrap justify-center gap-8 lg:gap-12">
            {data?.footer?.socials?.map((social, i) => (
              <a key={i} href={social.link} target="_blank" rel="noreferrer" className="text-[#E6E3D5] text-xs font-bold tracking-[0.2em] uppercase hover:text-[#FF6B35] transition-colors">
                {social.name}
              </a>
            ))}
          </div>
        </div>
        
        <div className="w-full max-w-7xl mx-auto flex flex-col items-center justify-center pt-8 border-t border-[#E6E3D5]/10 text-[#E6E3D5]/40 text-xs font-bold uppercase tracking-widest gap-4">
          <p>© {new Date().getFullYear()} {data?.footer?.copyright || "AHMED SHALABY. ALL RIGHTS RESERVED."}</p>
        </div>
      </footer>

      <WhatsAppWidget data={data?.whatsapp} />
    </main>
  );
}

