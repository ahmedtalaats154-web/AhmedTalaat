"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import CursorEffects from '@/components/CursorEffects';

/* ─── Tiny reusable components ─── */
function InputGroup({ label, value, onChange, type = "text" }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[#004741]/60 text-[0.65rem] font-bold uppercase tracking-widest ml-1">{label}</label>
      <input type={type} value={value || ''} onChange={onChange}
        className="w-full bg-white border border-[#004741]/10 rounded-xl px-4 py-3 text-[#004741] text-sm font-medium outline-none focus:border-[#004741]/30 transition-colors" />
    </div>
  );
}

function TextareaGroup({ label, value, onChange, rows = 3 }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[#004741]/60 text-[0.65rem] font-bold uppercase tracking-widest ml-1">{label}</label>
      <textarea rows={rows} value={value || ''} onChange={onChange}
        className="bg-white rounded-xl p-4 border border-[#004741]/10 text-[#004741] text-sm font-medium outline-none focus:border-[#004741]/30 resize-none" />
    </div>
  );
}

function AlignPicker({ label, value, onChange }) {
  const options = ['left', 'center', 'right'];
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[#004741]/60 text-[0.65rem] font-bold uppercase tracking-widest ml-1">{label}</label>
      <div className="flex gap-2">
        {options.map(opt => (
          <button key={opt} onClick={() => onChange(opt)}
            className={`flex-1 py-2 rounded-lg text-xs font-bold uppercase tracking-widest cursor-pointer transition-all ${value === opt ? 'bg-[#004741] text-white' : 'bg-white border border-[#004741]/10 text-[#004741]/50 hover:bg-[#004741]/5'}`}>
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
}

function SliderGroup({ label, value, onChange, min = 0, max = 40, unit = "px" }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[#004741]/60 text-[0.65rem] font-bold uppercase tracking-widest ml-1">{label}: <span className="text-[#004741]">{value}{unit}</span></label>
      <input type="range" min={min} max={max} step="1" value={value} onChange={onChange}
        className="w-full accent-[#004741]" />
    </div>
  );
}

function SectionCard({ title, children, onDelete }) {
  return (
    <div className="bg-white p-5 rounded-2xl shadow-sm border border-[#004741]/5 flex flex-col gap-4 relative">
      {onDelete && <button onClick={onDelete} className="absolute top-4 right-4 text-red-400 hover:text-red-600 text-[0.6rem] font-bold uppercase tracking-widest cursor-pointer transition-colors">✕ Remove</button>}
      {title && <h3 className="font-black text-[#004741] text-sm uppercase tracking-wider">{title}</h3>}
      {children}
    </div>
  );
}

/* ─── Main Dashboard ─── */
export default function AdminDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [auth, setAuth] = useState(false);
  const [password, setPassword] = useState('');
  const [activeTab, setActiveTab] = useState('hero');
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewKey, setPreviewKey] = useState(0);

  const handleLogin = (e) => { e.preventDefault(); if (password === 'admin123') { setAuth(true); fetchData(); } else { alert('Incorrect Password'); } };

  const fetchData = async () => {
    try { const res = await fetch('/api/content'); setData(await res.json()); }
    catch { alert('Failed to load data'); }
    finally { setLoading(false); }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/content', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
      if (res.ok) { setPreviewKey(k => k + 1); alert('Saved! Preview refreshed.'); }
      else { alert('Failed to save.'); }
    } catch { alert('Error saving data.'); }
    finally { setSaving(false); }
  };

  const updateField = (cat, field, val) => setData(prev => ({ ...prev, [cat]: { ...prev[cat], [field]: val } }));
  const updateArrayField = (cat, idx, field, val) => setData(prev => { const a = [...prev[cat]]; a[idx] = { ...a[idx], [field]: val }; return { ...prev, [cat]: a }; });
  const addItem = (cat, template) => setData(prev => ({ ...prev, [cat]: [...(prev[cat] || []), template] }));
  const deleteItem = (cat, idx) => setData(prev => { const a = [...prev[cat]]; a.splice(idx, 1); return { ...prev, [cat]: a }; });

  /* ─── Login Screen ─── */
  if (!auth) {
    return (
      <div className="w-full min-h-screen bg-[#004741] flex items-center justify-center font-sans">
        <CursorEffects />
        <div className="bg-[#E6E3D5] p-10 rounded-3xl shadow-2xl max-w-sm w-full text-center">
          <h2 className="text-[#004741] text-2xl font-black mb-1">SHALABY CMS</h2>
          <p className="text-[#004741]/50 text-xs font-bold uppercase tracking-widest mb-8">Admin Dashboard</p>
          <form onSubmit={handleLogin} className="flex flex-col gap-3">
            <input type="password" placeholder="Enter password" value={password} onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-[#004741]/5 border border-[#004741]/10 rounded-xl px-5 py-3.5 text-[#004741] text-sm outline-none focus:border-[#004741]/30" />
            <button type="submit" className="w-full bg-[#004741] text-[#E6E3D5] rounded-xl py-3.5 text-xs font-black uppercase tracking-[0.2em] hover:bg-[#002f2b] transition-colors cursor-pointer">LOGIN</button>
          </form>
        </div>
      </div>
    );
  }

  if (loading || !data) return <div className="w-full min-h-screen bg-[#F4F1E6] flex items-center justify-center text-[#004741] font-black text-sm">Loading CMS...</div>;

  const TABS = [
    { id: 'layout', label: '📄 Page Layout', icon: '📄' },
    { id: 'hero', label: '🎯 Hero', icon: '🎯' },
    { id: 'about', label: '👤 About', icon: '👤' },
    { id: 'services', label: '⚙️ Services', icon: '⚙️' },
    { id: 'skills', label: '⚡ Skills', icon: '⚡' },
    { id: 'portfolio', label: '🎨 Portfolio', icon: '🎨' },
    { id: 'industryCampaigns', label: '📂 Campaigns', icon: '📂' },
    { id: 'moreWorks', label: '📁 Archive', icon: '📁' },
    { id: 'testimonials', label: '💬 Reviews', icon: '💬' },
    { id: 'header', label: '🔝 Header', icon: '🔝' },
    { id: 'footer', label: '🔻 Footer', icon: '🔻' },
    { id: 'contact', label: '✉️ Contact', icon: '✉️' },
    { id: 'whatsapp', label: '💬 WhatsApp', icon: '💬' },
    { id: 'theme', label: '🎨 Theme', icon: '🎨' },
    { id: 'seo', label: '🔍 SEO & Meta', icon: '🔍' },
  ];

  return (
    <div className="w-full min-h-screen bg-[#F4F1E6] font-sans flex">
      <CursorEffects />

      {/* ─── Fixed Sidebar ─── */}
      <div className="w-56 bg-[#004741] fixed top-0 left-0 h-screen flex flex-col p-5 text-[#E6E3D5] overflow-y-auto z-50 shrink-0">
        <a href="/" className="block no-underline">
          <h2 className="text-2xl font-black leading-none tracking-tighter mb-0.5">SHALABY.</h2>
        </a>
        <span className="text-[0.55rem] font-bold tracking-[0.2em] text-[#E6E3D5]/50 uppercase block mb-8">CMS Dashboard</span>

        <nav className="flex flex-col gap-1 flex-1">
          {TABS.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={`text-left text-[0.7rem] font-bold uppercase tracking-widest py-2 px-3 rounded-lg transition-all cursor-pointer ${activeTab === tab.id ? 'bg-[#E6E3D5]/15 text-white' : 'text-[#E6E3D5]/40 hover:text-[#E6E3D5]/70 hover:bg-white/5'}`}>
              {tab.label}
            </button>
          ))}
        </nav>

        <div className="flex flex-col gap-2 mt-4">
          <button onClick={() => setPreviewOpen(!previewOpen)}
            className="bg-[#E6E3D5]/10 text-[#E6E3D5] text-[0.6rem] font-bold uppercase tracking-widest py-3 rounded-xl hover:bg-[#E6E3D5]/20 transition-colors cursor-pointer border border-[#E6E3D5]/10">
            {previewOpen ? '✕ CLOSE PREVIEW' : '👁 LIVE PREVIEW'}
          </button>
          <button onClick={handleSave} disabled={saving}
            className="bg-[#E6E3D5] text-[#004741] font-black text-[0.6rem] uppercase tracking-widest py-3 rounded-xl hover:scale-[1.02] transition-transform cursor-pointer">
            {saving ? 'SAVING...' : '💾 SAVE CHANGES'}
          </button>
        </div>
      </div>

      {/* ─── Main Content ─── */}
      <div className={`transition-all duration-500 ease-in-out ${previewOpen ? 'pl-56 w-1/2' : 'pl-56 w-full'}`}>
        <div className="min-h-screen flex items-start justify-center py-10 px-4 md:px-8">
          <div className="w-full max-w-2xl">

            <h1 className="text-3xl font-black text-[#004741] uppercase tracking-tighter mb-8">
              {TABS.find(t => t.id === activeTab)?.label || 'Edit'}
            </h1>

            <AnimatePresence mode="wait">
              <motion.div key={activeTab} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}
                className="flex flex-col gap-5">

                {/* ─── PAGE LAYOUT ─── */}
                {activeTab === 'layout' && <>
                  <SectionCard title="Manage Sections">
                    <p className="text-[#004741]/70 text-xs mb-4">Toggle sections on or off, and use the arrows to reorder them on your live site.</p>
                    <div className="flex flex-col gap-3">
                      {(data.sections || []).map((sec, i) => (
                        <div key={sec.id} className="flex items-center justify-between bg-white/50 p-4 rounded-xl border border-[#004741]/5">
                          <div className="flex items-center gap-4">
                            <button
                              onClick={() => {
                                const newSecs = [...data.sections];
                                newSecs[i].visible = !newSecs[i].visible;
                                setData(p => ({...p, sections: newSecs}));
                              }}
                              className={`w-10 h-6 rounded-full transition-colors relative cursor-pointer ${sec.visible !== false ? 'bg-[#004741]' : 'bg-[#004741]/20'}`}
                            >
                              <div className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform ${sec.visible !== false ? 'translate-x-4' : 'translate-x-0'}`} />
                            </button>
                            <span className={`text-sm font-bold tracking-wider ${sec.visible !== false ? 'text-[#004741]' : 'text-[#004741]/40'}`}>
                              {sec.name}
                            </span>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <button 
                              disabled={i === 0}
                              onClick={() => {
                                const newSecs = [...data.sections];
                                const temp = newSecs[i - 1];
                                newSecs[i - 1] = newSecs[i];
                                newSecs[i] = temp;
                                setData(p => ({...p, sections: newSecs}));
                              }}
                              className="p-2 bg-white rounded-lg border border-[#004741]/10 text-[#004741]/60 hover:text-[#004741] hover:border-[#004741]/30 transition-colors disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                            >
                              ↑
                            </button>
                            <button 
                              disabled={i === data.sections.length - 1}
                              onClick={() => {
                                const newSecs = [...data.sections];
                                const temp = newSecs[i + 1];
                                newSecs[i + 1] = newSecs[i];
                                newSecs[i] = temp;
                                setData(p => ({...p, sections: newSecs}));
                              }}
                              className="p-2 bg-white rounded-lg border border-[#004741]/10 text-[#004741]/60 hover:text-[#004741] hover:border-[#004741]/30 transition-colors disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                            >
                              ↓
                            </button>
                          </div>
                        </div>
                      ))}
                      {(!data.sections || data.sections.length === 0) && (
                        <div className="p-4 text-center text-sm font-bold text-[#004741]/50 bg-white/30 rounded-xl">
                          No sections configured. Save to initialize.
                        </div>
                      )}
                    </div>
                  </SectionCard>
                </>}

                {/* ─── HERO ─── */}
                {activeTab === 'hero' && <>
                  <InputGroup label="Subtitle" value={data.hero?.subtitle} onChange={e => updateField('hero', 'subtitle', e.target.value)} />
                  <InputGroup label="Title Line 1" value={data.hero?.titleLine1} onChange={e => updateField('hero', 'titleLine1', e.target.value)} />
                  <InputGroup label="Title Line 2" value={data.hero?.titleLine2} onChange={e => updateField('hero', 'titleLine2', e.target.value)} />
                  <InputGroup label="Title Line 3" value={data.hero?.titleLine3} onChange={e => updateField('hero', 'titleLine3', e.target.value)} />
                  <AlignPicker label="Text Alignment" value={data.hero?.textAlign || 'left'} onChange={v => updateField('hero', 'textAlign', v)} />
                </>}

                {/* ─── ABOUT ─── */}
                {activeTab === 'about' && <>
                  <InputGroup label="Section Title" value={data.about?.title} onChange={e => updateField('about', 'title', e.target.value)} />
                  <TextareaGroup label="Description" rows={5} value={data.about?.description} onChange={e => updateField('about', 'description', e.target.value)} />
                  <InputGroup label="Image URL" value={data.about?.image} onChange={e => updateField('about', 'image', e.target.value)} />
                  <AlignPicker label="Text Alignment" value={data.about?.textAlign || 'left'} onChange={v => updateField('about', 'textAlign', v)} />
                </>}

                {/* ─── SERVICES ─── */}
                {activeTab === 'services' && <>
                  {data.services?.map((srv, i) => (
                    <SectionCard key={i} title={`Service ${i + 1}`} onDelete={() => deleteItem('services', i)}>
                      <InputGroup label="Title" value={srv.title} onChange={e => updateArrayField('services', i, 'title', e.target.value)} />
                      <TextareaGroup label="Description" value={srv.desc} onChange={e => updateArrayField('services', i, 'desc', e.target.value)} />
                    </SectionCard>
                  ))}
                  <button onClick={() => addItem('services', { id: Date.now().toString(), title: 'NEW SERVICE', desc: 'Description...' })}
                    className="bg-[#004741] text-white py-3 rounded-xl text-xs font-bold uppercase tracking-widest cursor-pointer hover:bg-[#002f2b] transition-colors">+ Add Service</button>
                </>}

                {/* ─── SKILLS ─── */}
                {activeTab === 'skills' && <>
                  {data.skills?.map((skill, i) => (
                    <SectionCard key={i} title={`Skill: ${skill.name}`} onDelete={() => deleteItem('skills', i)}>
                      <div className="grid grid-cols-2 gap-3">
                        <InputGroup label="Name" value={skill.name} onChange={e => updateArrayField('skills', i, 'name', e.target.value)} />
                        <InputGroup label="Icon Text (e.g. Ps)" value={skill.iconText} onChange={e => updateArrayField('skills', i, 'iconText', e.target.value)} />
                      </div>
                      <div className="grid grid-cols-2 gap-3 mt-3">
                        <div className="flex flex-col gap-1.5">
                          <label className="text-[#004741]/60 text-[0.65rem] font-bold uppercase tracking-widest ml-1">Icon Color</label>
                          <div className="flex gap-2 items-center">
                            <input type="color" value={skill.iconColor || '#31A8FF'} onChange={e => updateArrayField('skills', i, 'iconColor', e.target.value)} className="w-10 h-10 rounded-lg border-0 cursor-pointer" />
                            <input type="text" value={skill.iconColor || '#31A8FF'} onChange={e => updateArrayField('skills', i, 'iconColor', e.target.value)} className="flex-1 bg-white border border-[#004741]/10 rounded-xl px-3 py-2 text-[#004741] text-xs font-medium outline-none" />
                          </div>
                        </div>
                        <div className="flex flex-col gap-1.5">
                          <label className="text-[#004741]/60 text-[0.65rem] font-bold uppercase tracking-widest ml-1">Icon Background</label>
                          <div className="flex gap-2 items-center">
                            <input type="color" value={skill.iconBg || '#001833'} onChange={e => updateArrayField('skills', i, 'iconBg', e.target.value)} className="w-10 h-10 rounded-lg border-0 cursor-pointer" />
                            <input type="text" value={skill.iconBg || '#001833'} onChange={e => updateArrayField('skills', i, 'iconBg', e.target.value)} className="flex-1 bg-white border border-[#004741]/10 rounded-xl px-3 py-2 text-[#004741] text-xs font-medium outline-none" />
                          </div>
                        </div>
                      </div>
                      <div className="mt-3">
                        <TextareaGroup label="Description" value={skill.desc} onChange={e => updateArrayField('skills', i, 'desc', e.target.value)} />
                      </div>
                    </SectionCard>
                  ))}
                  <button onClick={() => addItem('skills', { id: Date.now().toString(), name: 'NEW SKILL', desc: 'Description...', iconText: 'Aa', iconColor: '#ffffff', iconBg: '#000000' })}
                    className="bg-[#004741] text-white py-3 rounded-xl text-xs font-bold uppercase tracking-widest cursor-pointer hover:bg-[#002f2b] transition-colors">+ Add Skill</button>
                </>}

                {/* ─── PORTFOLIO ─── */}
                {activeTab === 'portfolio' && <>
                  <SectionCard title="Portfolio Text Style">
                    <SliderGroup label="Left Padding" value={data.portfolioLayout?.textPaddingLeft || 16} onChange={e => updateField('portfolioLayout', 'textPaddingLeft', parseInt(e.target.value))} max={80} />
                    <SliderGroup label="Bottom Padding" value={data.portfolioLayout?.textPaddingBottom || 16} onChange={e => updateField('portfolioLayout', 'textPaddingBottom', parseInt(e.target.value))} max={80} />
                    <SliderGroup label="Title Size" value={data.portfolioLayout?.titleSize || 28} onChange={e => updateField('portfolioLayout', 'titleSize', parseInt(e.target.value))} min={12} max={60} />
                    <AlignPicker label="Text Alignment" value={data.portfolioLayout?.textAlign || 'left'} onChange={v => updateField('portfolioLayout', 'textAlign', v)} />
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[#004741]/60 text-[0.65rem] font-bold uppercase tracking-widest ml-1">Text Color</label>
                      <div className="flex gap-2 items-center">
                        <input type="color" value={data.portfolioLayout?.textColor || '#E6E3D5'} onChange={e => updateField('portfolioLayout', 'textColor', e.target.value)} className="w-10 h-10 rounded-lg border-0 cursor-pointer" />
                        <input type="text" value={data.portfolioLayout?.textColor || '#E6E3D5'} onChange={e => updateField('portfolioLayout', 'textColor', e.target.value)}
                          className="flex-1 bg-white border border-[#004741]/10 rounded-xl px-4 py-3 text-[#004741] text-sm font-medium outline-none" />
                      </div>
                    </div>
                  </SectionCard>
                  {data.portfolioItems?.map((item, i) => (
                    <SectionCard key={i} title={`Project ${i + 1}`} onDelete={() => deleteItem('portfolioItems', i)}>
                      <div className="grid grid-cols-2 gap-3">
                        <InputGroup label="Title" value={item.title} onChange={e => updateArrayField('portfolioItems', i, 'title', e.target.value)} />
                        <InputGroup label="Type" value={item.type} onChange={e => updateArrayField('portfolioItems', i, 'type', e.target.value)} />
                      </div>
                      <InputGroup label="Image URL" value={item.img} onChange={e => updateArrayField('portfolioItems', i, 'img', e.target.value)} />
                      <TextareaGroup label="Description" value={item.desc} onChange={e => updateArrayField('portfolioItems', i, 'desc', e.target.value)} />
                    </SectionCard>
                  ))}
                  <button onClick={() => addItem('portfolioItems', { id: Date.now(), title: 'New Project', type: 'Design', img: '/Work1.png', desc: 'Description...' })}
                    className="bg-[#004741] text-white py-3 rounded-xl text-xs font-bold uppercase tracking-widest cursor-pointer hover:bg-[#002f2b] transition-colors">+ Add Project</button>
                </>}

                {/* ─── INDUSTRY CAMPAIGNS ─── */}
                {activeTab === 'industryCampaigns' && <>
                  <SectionCard title="Section Header">
                    <InputGroup label="Title" value={data.industryCampaigns?.title} onChange={e => updateField('industryCampaigns', 'title', e.target.value)} />
                    <InputGroup label="Subtitle" value={data.industryCampaigns?.subtitle} onChange={e => updateField('industryCampaigns', 'subtitle', e.target.value)} />
                  </SectionCard>
                  
                  <SectionCard title="Category Tabs Style (Buttons)">
                    <SliderGroup label="Button Width Padding (X)" value={data.industryCampaigns?.tabsLayout?.paddingX || 24} onChange={e => setData(p => ({...p, industryCampaigns: {...p.industryCampaigns, tabsLayout: {...p.industryCampaigns.tabsLayout, paddingX: parseInt(e.target.value)}}}))} max={60} />
                    <SliderGroup label="Button Height Padding (Y)" value={data.industryCampaigns?.tabsLayout?.paddingY || 12} onChange={e => setData(p => ({...p, industryCampaigns: {...p.industryCampaigns, tabsLayout: {...p.industryCampaigns.tabsLayout, paddingY: parseInt(e.target.value)}}}))} max={40} />
                    <SliderGroup label="Text Size" value={data.industryCampaigns?.tabsLayout?.textSize || 12} onChange={e => setData(p => ({...p, industryCampaigns: {...p.industryCampaigns, tabsLayout: {...p.industryCampaigns.tabsLayout, textSize: parseInt(e.target.value)}}}))} min={8} max={30} />
                    <SliderGroup label="Gap Between Buttons" value={data.industryCampaigns?.tabsLayout?.gap || 16} onChange={e => setData(p => ({...p, industryCampaigns: {...p.industryCampaigns, tabsLayout: {...p.industryCampaigns.tabsLayout, gap: parseInt(e.target.value)}}}))} max={100} />
                    <SliderGroup label="Top Gap (Space from Header)" value={data.industryCampaigns?.tabsLayout?.marginTop || 48} onChange={e => setData(p => ({...p, industryCampaigns: {...p.industryCampaigns, tabsLayout: {...p.industryCampaigns.tabsLayout, marginTop: parseInt(e.target.value)}}}))} max={160} />
                    <SliderGroup label="Bottom Gap (Space to Designs)" value={data.industryCampaigns?.tabsLayout?.marginBottom || 48} onChange={e => setData(p => ({...p, industryCampaigns: {...p.industryCampaigns, tabsLayout: {...p.industryCampaigns.tabsLayout, marginBottom: parseInt(e.target.value)}}}))} max={160} />
                  </SectionCard>

                  <SectionCard title="Design Overlay Text Style">
                    <SliderGroup label="Left Padding" value={data.industryCampaigns?.layout?.textPaddingLeft || 16} onChange={e => setData(p => ({...p, industryCampaigns: {...p.industryCampaigns, layout: {...p.industryCampaigns.layout, textPaddingLeft: parseInt(e.target.value)}}}))} max={80} />
                    <SliderGroup label="Bottom Padding" value={data.industryCampaigns?.layout?.textPaddingBottom || 16} onChange={e => setData(p => ({...p, industryCampaigns: {...p.industryCampaigns, layout: {...p.industryCampaigns.layout, textPaddingBottom: parseInt(e.target.value)}}}))} max={80} />
                    <SliderGroup label="Title Size" value={data.industryCampaigns?.layout?.titleSize || 18} onChange={e => setData(p => ({...p, industryCampaigns: {...p.industryCampaigns, layout: {...p.industryCampaigns.layout, titleSize: parseInt(e.target.value)}}}))} min={10} max={40} />
                    <AlignPicker label="Text Alignment" value={data.industryCampaigns?.layout?.textAlign || 'left'} onChange={v => setData(p => ({...p, industryCampaigns: {...p.industryCampaigns, layout: {...p.industryCampaigns.layout, textAlign: v}}}))} />
                    <div className="flex flex-col gap-1.5 mt-3">
                      <label className="text-[#004741]/60 text-[0.65rem] font-bold uppercase tracking-widest ml-1">Text Color</label>
                      <div className="flex gap-2 items-center">
                        <input type="color" value={data.industryCampaigns?.layout?.textColor || '#E6E3D5'} onChange={e => setData(p => ({...p, industryCampaigns: {...p.industryCampaigns, layout: {...p.industryCampaigns.layout, textColor: e.target.value}}}))} className="w-10 h-10 rounded-lg border-0 cursor-pointer" />
                        <input type="text" value={data.industryCampaigns?.layout?.textColor || '#E6E3D5'} onChange={e => setData(p => ({...p, industryCampaigns: {...p.industryCampaigns, layout: {...p.industryCampaigns.layout, textColor: e.target.value}}}))} className="flex-1 bg-white border border-[#004741]/10 rounded-xl px-4 py-3 text-[#004741] text-sm font-medium outline-none" />
                      </div>
                    </div>
                  </SectionCard>
                  {data.industryCampaigns?.categories?.map((cat, i) => (
                    <SectionCard key={i} title={`Category: ${cat.name}`} onDelete={() => {
                        const newCats = [...data.industryCampaigns.categories];
                        newCats.splice(i, 1);
                        setData(p => ({...p, industryCampaigns: {...p.industryCampaigns, categories: newCats}}));
                      }}>
                      <InputGroup label="Category Name" value={cat.name} onChange={e => {
                        const newCats = [...data.industryCampaigns.categories];
                        newCats[i].name = e.target.value;
                        setData(p => ({...p, industryCampaigns: {...p.industryCampaigns, categories: newCats}}));
                      }} />
                      
                      <div className="mt-4 pt-4 border-t border-[#004741]/10">
                        <label className="text-[#004741] text-sm font-bold uppercase tracking-widest mb-3 block">Designs in {cat.name}</label>
                        {cat.designs?.map((design, dIdx) => (
                          <div key={dIdx} className="bg-white/50 p-4 rounded-xl mb-3 border border-[#004741]/5 relative">
                            <button onClick={() => {
                              const newCats = [...data.industryCampaigns.categories];
                              newCats[i].designs.splice(dIdx, 1);
                              setData(p => ({...p, industryCampaigns: {...p.industryCampaigns, categories: newCats}}));
                            }} className="absolute top-3 right-3 text-red-500 hover:text-red-700 text-lg leading-none cursor-pointer">×</button>
                            <div className="grid grid-cols-2 gap-3 mb-3 pr-6">
                              <InputGroup label="Title" value={design.title} onChange={e => {
                                const newCats = [...data.industryCampaigns.categories];
                                newCats[i].designs[dIdx].title = e.target.value;
                                setData(p => ({...p, industryCampaigns: {...p.industryCampaigns, categories: newCats}}));
                              }} />
                              <InputGroup label="Type" value={design.type} onChange={e => {
                                const newCats = [...data.industryCampaigns.categories];
                                newCats[i].designs[dIdx].type = e.target.value;
                                setData(p => ({...p, industryCampaigns: {...p.industryCampaigns, categories: newCats}}));
                              }} />
                            </div>
                            <InputGroup label="Image URL" value={design.img} onChange={e => {
                                const newCats = [...data.industryCampaigns.categories];
                                newCats[i].designs[dIdx].img = e.target.value;
                                setData(p => ({...p, industryCampaigns: {...p.industryCampaigns, categories: newCats}}));
                              }} />
                          </div>
                        ))}
                        <button onClick={() => {
                          const newCats = [...data.industryCampaigns.categories];
                          if (!newCats[i].designs) newCats[i].designs = [];
                          newCats[i].designs.push({ id: Date.now(), title: 'New Design', type: 'Design', img: '/Work1.png' });
                          setData(p => ({...p, industryCampaigns: {...p.industryCampaigns, categories: newCats}}));
                        }} className="w-full border-2 border-dashed border-[#004741]/20 text-[#004741]/60 py-2 rounded-xl text-xs font-bold uppercase tracking-widest hover:border-[#004741]/40 hover:text-[#004741] transition-colors">+ Add Design to Category</button>
                      </div>
                    </SectionCard>
                  ))}
                  <button onClick={() => {
                    const newCats = [...(data.industryCampaigns?.categories || [])];
                    newCats.push({ id: `cat_${Date.now()}`, name: 'New Category', designs: [] });
                    setData(p => ({...p, industryCampaigns: {...p.industryCampaigns, categories: newCats}}));
                  }} className="bg-[#004741] text-white py-3 rounded-xl text-xs font-bold uppercase tracking-widest cursor-pointer hover:bg-[#002f2b] transition-colors">+ Add Category</button>
                </>}

                {/* ─── ARCHIVE / MORE WORKS ─── */}
                {activeTab === 'moreWorks' && <>
                  <SectionCard title="Archive Text Style">
                    <SliderGroup label="Left Padding" value={data.moreWorksLayout?.textPaddingLeft || 16} onChange={e => updateField('moreWorksLayout', 'textPaddingLeft', parseInt(e.target.value))} max={80} />
                    <SliderGroup label="Bottom Padding" value={data.moreWorksLayout?.textPaddingBottom || 16} onChange={e => updateField('moreWorksLayout', 'textPaddingBottom', parseInt(e.target.value))} max={80} />
                    <SliderGroup label="Title Size" value={data.moreWorksLayout?.titleSize || 14} onChange={e => updateField('moreWorksLayout', 'titleSize', parseInt(e.target.value))} min={10} max={40} />
                    <AlignPicker label="Text Alignment" value={data.moreWorksLayout?.textAlign || 'left'} onChange={v => updateField('moreWorksLayout', 'textAlign', v)} />
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[#004741]/60 text-[0.65rem] font-bold uppercase tracking-widest ml-1">Text Color</label>
                      <div className="flex gap-2 items-center">
                        <input type="color" value={data.moreWorksLayout?.textColor || '#E6E3D5'} onChange={e => updateField('moreWorksLayout', 'textColor', e.target.value)} className="w-10 h-10 rounded-lg border-0 cursor-pointer" />
                        <input type="text" value={data.moreWorksLayout?.textColor || '#E6E3D5'} onChange={e => updateField('moreWorksLayout', 'textColor', e.target.value)}
                          className="flex-1 bg-white border border-[#004741]/10 rounded-xl px-4 py-3 text-[#004741] text-sm font-medium outline-none" />
                      </div>
                    </div>
                  </SectionCard>
                  {data.moreWorks?.map((item, i) => (
                    <SectionCard key={i} title={`Grid Item ${i + 1}`} onDelete={() => deleteItem('moreWorks', i)}>
                      <div className="grid grid-cols-2 gap-3">
                        <InputGroup label="Title" value={item.title} onChange={e => updateArrayField('moreWorks', i, 'title', e.target.value)} />
                        <InputGroup label="Type" value={item.type} onChange={e => updateArrayField('moreWorks', i, 'type', e.target.value)} />
                      </div>
                      <InputGroup label="Image URL" value={item.img} onChange={e => updateArrayField('moreWorks', i, 'img', e.target.value)} />
                    </SectionCard>
                  ))}
                  <button onClick={() => addItem('moreWorks', { id: Date.now(), title: 'New Work', type: 'Design', img: '/Work1.png' })}
                    className="bg-[#004741] text-white py-3 rounded-xl text-xs font-bold uppercase tracking-widest cursor-pointer hover:bg-[#002f2b] transition-colors">+ Add Grid Item</button>
                </>}

                {/* ─── TESTIMONIALS ─── */}
                {activeTab === 'testimonials' && <>
                  {data.testimonials?.map((t, i) => (
                    <SectionCard key={i} title={`Review ${i + 1}`} onDelete={() => deleteItem('testimonials', i)}>
                      <div className="grid grid-cols-2 gap-3">
                        <InputGroup label="Name" value={t.name} onChange={e => updateArrayField('testimonials', i, 'name', e.target.value)} />
                        <InputGroup label="Role" value={t.role} onChange={e => updateArrayField('testimonials', i, 'role', e.target.value)} />
                      </div>
                      <TextareaGroup label="Quote" value={t.quote} onChange={e => updateArrayField('testimonials', i, 'quote', e.target.value)} />
                    </SectionCard>
                  ))}
                  <button onClick={() => addItem('testimonials', { id: Date.now(), name: 'New Client', role: 'Role', quote: 'Their feedback...' })}
                    className="bg-[#004741] text-white py-3 rounded-xl text-xs font-bold uppercase tracking-widest cursor-pointer hover:bg-[#002f2b] transition-colors">+ Add Review</button>
                </>}

                {/* ─── HEADER ─── */}
                {activeTab === 'header' && <>
                  <InputGroup label="Logo Text" value={data.header?.logo} onChange={e => updateField('header', 'logo', e.target.value)} />
                  <p className="text-[#004741]/40 text-xs font-bold uppercase tracking-widest mt-2">Navigation Links</p>
                  {data.header?.links?.map((link, i) => (
                    <SectionCard key={i} onDelete={() => deleteItem('header', i)}>
                      <div className="grid grid-cols-2 gap-3">
                        <InputGroup label="Label" value={link.label} onChange={e => {
                          const links = [...data.header.links]; links[i] = { ...links[i], label: e.target.value };
                          setData(prev => ({ ...prev, header: { ...prev.header, links } }));
                        }} />
                        <InputGroup label="Link (href)" value={link.href} onChange={e => {
                          const links = [...data.header.links]; links[i] = { ...links[i], href: e.target.value };
                          setData(prev => ({ ...prev, header: { ...prev.header, links } }));
                        }} />
                      </div>
                    </SectionCard>
                  ))}
                  <button onClick={() => {
                    const links = [...(data.header?.links || []), { label: 'NEW', href: '#new' }];
                    setData(prev => ({ ...prev, header: { ...prev.header, links } }));
                  }} className="bg-[#004741] text-white py-3 rounded-xl text-xs font-bold uppercase tracking-widest cursor-pointer hover:bg-[#002f2b] transition-colors">+ Add Link</button>
                </>}

                {/* ─── FOOTER ─── */}
                {activeTab === 'footer' && <>
                  <InputGroup label="Footer Name" value={data.footer?.name} onChange={e => updateField('footer', 'name', e.target.value)} />
                  <TextareaGroup label="Footer Description" value={data.footer?.description} onChange={e => updateField('footer', 'description', e.target.value)} />
                  <InputGroup label="Copyright Text" value={data.footer?.copyright} onChange={e => updateField('footer', 'copyright', e.target.value)} />
                  <p className="text-[#004741]/40 text-xs font-bold uppercase tracking-widest mt-2">Social Links</p>
                  {data.footer?.socials?.map((s, i) => (
                    <SectionCard key={i} onDelete={() => {
                      const socials = [...data.footer.socials]; socials.splice(i, 1);
                      setData(prev => ({ ...prev, footer: { ...prev.footer, socials } }));
                    }}>
                      <div className="grid grid-cols-2 gap-3">
                        <InputGroup label="Name" value={s.name} onChange={e => {
                          const socials = [...data.footer.socials]; socials[i] = { ...socials[i], name: e.target.value };
                          setData(prev => ({ ...prev, footer: { ...prev.footer, socials } }));
                        }} />
                        <InputGroup label="URL" value={s.link} onChange={e => {
                          const socials = [...data.footer.socials]; socials[i] = { ...socials[i], link: e.target.value };
                          setData(prev => ({ ...prev, footer: { ...prev.footer, socials } }));
                        }} />
                      </div>
                    </SectionCard>
                  ))}
                  <button onClick={() => {
                    const socials = [...(data.footer?.socials || []), { name: 'New Social', link: '#' }];
                    setData(prev => ({ ...prev, footer: { ...prev.footer, socials } }));
                  }} className="bg-[#004741] text-white py-3 rounded-xl text-xs font-bold uppercase tracking-widest cursor-pointer hover:bg-[#002f2b] transition-colors">+ Add Social</button>
                </>}

                {/* ─── CONTACT ─── */}
                {activeTab === 'contact' && <>
                  <SectionCard title="Contact Section Text">
                    <InputGroup label="Section Title" value={data.contact?.title} onChange={e => updateField('contact', 'title', e.target.value)} />
                    <InputGroup label="Subtitle" value={data.contact?.subtitle} onChange={e => updateField('contact', 'subtitle', e.target.value)} />
                    <InputGroup label="Email (messages go here)" value={data.contact?.email} onChange={e => updateField('contact', 'email', e.target.value)} />
                    <AlignPicker label="Section Text Alignment" value={data.contact?.textAlign || 'center'} onChange={v => updateField('contact', 'textAlign', v)} />
                    <SliderGroup label="Input Text Indentation (Padding Left/Right)" value={data.contact?.inputPaddingX || 64} onChange={e => updateField('contact', 'inputPaddingX', parseInt(e.target.value))} max={120} />
                  </SectionCard>
                  
                  <SectionCard title="Submit Button Style">
                    <InputGroup label="Button Text" value={data.contact?.buttonText} onChange={e => updateField('contact', 'buttonText', e.target.value)} />
                    
                    <div className="flex items-center gap-3 mt-4 mb-2">
                      <button
                        onClick={() => updateField('contact', 'buttonFullWidth', !data.contact?.buttonFullWidth)}
                        className={`w-10 h-6 rounded-full transition-colors relative cursor-pointer ${data.contact?.buttonFullWidth ? 'bg-[#004741]' : 'bg-[#004741]/20'}`}
                      >
                        <div className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform ${data.contact?.buttonFullWidth ? 'translate-x-4' : 'translate-x-0'}`} />
                      </button>
                      <span className="text-[#004741] text-xs font-bold uppercase tracking-widest">Full Width Button</span>
                    </div>

                    {!data.contact?.buttonFullWidth && (
                      <AlignPicker label="Button Alignment" value={data.contact?.buttonAlign || 'center'} onChange={v => updateField('contact', 'buttonAlign', v)} />
                    )}

                    <SliderGroup label="Button Width Padding (X)" value={data.contact?.buttonPaddingX || 64} onChange={e => updateField('contact', 'buttonPaddingX', parseInt(e.target.value))} max={120} />
                    <SliderGroup label="Button Height Padding (Y)" value={data.contact?.buttonPaddingY || 24} onChange={e => updateField('contact', 'buttonPaddingY', parseInt(e.target.value))} max={60} />
                    <SliderGroup label="Button Text Size" value={data.contact?.buttonTextSize || 14} onChange={e => updateField('contact', 'buttonTextSize', parseInt(e.target.value))} min={10} max={30} />
                    <SliderGroup label="Top Margin (Space above button)" value={data.contact?.buttonMarginTop || 0} onChange={e => updateField('contact', 'buttonMarginTop', parseInt(e.target.value))} max={100} />
                  </SectionCard>
                </>}

                {/* ─── WHATSAPP ─── */}
                {activeTab === 'whatsapp' && <>
                  <SectionCard title="WhatsApp Floating Widget">
                    <div className="flex items-center gap-3 mb-6">
                      <button
                        onClick={() => updateField('whatsapp', 'enabled', data.whatsapp?.enabled !== false)}
                        className={`w-12 h-7 rounded-full transition-colors relative cursor-pointer ${data.whatsapp?.enabled !== false ? 'bg-[#25D366]' : 'bg-[#004741]/20'}`}
                      >
                        <div className={`absolute top-1 left-1 w-5 h-5 rounded-full bg-white transition-transform ${data.whatsapp?.enabled !== false ? 'translate-x-5' : 'translate-x-0'}`} />
                      </button>
                      <span className="text-[#004741] text-xs font-bold uppercase tracking-widest">Enable WhatsApp Widget</span>
                    </div>
                    
                    {data.whatsapp?.enabled !== false && (
                      <InputGroup 
                        label="WhatsApp Phone Number (with country code, no + or spaces)" 
                        value={data.whatsapp?.number} 
                        onChange={e => updateField('whatsapp', 'number', e.target.value)} 
                        placeholder="e.g. 201012345678"
                      />
                    )}
                  </SectionCard>
                </>}

                {/* ─── THEME ─── */}
                {activeTab === 'theme' && <>
                  <SectionCard title="Site Theme & Typography">
                    <div className="flex flex-col gap-1.5 mb-4">
                      <label className="text-[#004741]/60 text-[0.65rem] font-bold uppercase tracking-widest ml-1">Primary Color</label>
                      <div className="flex gap-2 items-center">
                        <input type="color" value={data.theme?.primaryColor || '#004741'} onChange={e => updateField('theme', 'primaryColor', e.target.value)} className="w-10 h-10 rounded-lg border-0 cursor-pointer" />
                        <input type="text" value={data.theme?.primaryColor || '#004741'} onChange={e => updateField('theme', 'primaryColor', e.target.value)} className="flex-1 bg-white border border-[#004741]/10 rounded-xl px-4 py-3 text-[#004741] text-sm font-medium outline-none" />
                      </div>
                    </div>
                    <div className="flex flex-col gap-1.5 mb-4">
                      <label className="text-[#004741]/60 text-[0.65rem] font-bold uppercase tracking-widest ml-1">Background Color</label>
                      <div className="flex gap-2 items-center">
                        <input type="color" value={data.theme?.bgColor || '#F4F1E6'} onChange={e => updateField('theme', 'bgColor', e.target.value)} className="w-10 h-10 rounded-lg border-0 cursor-pointer" />
                        <input type="text" value={data.theme?.bgColor || '#F4F1E6'} onChange={e => updateField('theme', 'bgColor', e.target.value)} className="flex-1 bg-white border border-[#004741]/10 rounded-xl px-4 py-3 text-[#004741] text-sm font-medium outline-none" />
                      </div>
                    </div>
                  </SectionCard>
                  <SectionCard title="Typography">
                    <SliderGroup label="Heading Scale" value={data.theme?.headingScale || 1} onChange={e => updateField('theme', 'headingScale', parseFloat(e.target.value))} min={0.5} max={2} unit="x" />
                  </SectionCard>
                </>}

                {/* ─── SEO & META ─── */}
                {activeTab === 'seo' && <>
                  <SectionCard title="Search Engine Optimization">
                    <InputGroup label="Website Title (Appears in browser tab)" value={data.seo?.title || ''} onChange={e => updateField('seo', 'title', e.target.value)} />
                    <TextareaGroup label="Website Description (Appears on Google)" value={data.seo?.description || ''} onChange={e => updateField('seo', 'description', e.target.value)} />
                    <InputGroup label="Thumbnail Image URL (Appears when shared on social media)" value={data.seo?.ogImage || ''} onChange={e => updateField('seo', 'ogImage', e.target.value)} />
                  </SectionCard>
                </>}

              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* ─── Live Preview Slider ─── */}
      <AnimatePresence>
        {previewOpen && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed top-0 right-0 w-1/2 h-screen bg-white border-l-2 border-[#004741]/10 z-40 flex flex-col"
          >
            <div className="bg-[#004741] text-[#E6E3D5] px-5 py-3 flex items-center justify-between shrink-0">
              <span className="text-xs font-bold uppercase tracking-widest">Live Preview</span>
              <div className="flex items-center gap-3">
                <button onClick={() => setPreviewKey(k => k + 1)} className="text-[0.6rem] font-bold uppercase tracking-widest bg-[#E6E3D5]/10 px-3 py-1.5 rounded-lg cursor-pointer hover:bg-[#E6E3D5]/20 transition-colors">↻ Refresh</button>
                <button onClick={() => setPreviewOpen(false)} className="text-[0.6rem] font-bold uppercase tracking-widest bg-[#E6E3D5]/10 px-3 py-1.5 rounded-lg cursor-pointer hover:bg-[#E6E3D5]/20 transition-colors">✕ Close</button>
              </div>
            </div>
            <iframe key={previewKey} src="/" className="flex-1 w-full border-0" />
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
