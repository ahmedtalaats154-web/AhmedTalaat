"use client";

import { useEffect, useRef, useState, type CSSProperties, type RefObject } from "react";
import type { EuAsset, EuProject, EuProjectSummary, EuSection, EuSocial } from "../../lib/eu-visual";
import MotionStory from "./MotionStory";

function Artwork({ asset, eager = false, social = false }: { asset: EuAsset; eager?: boolean; social?: boolean }) {
  if (!asset.src) return null;
  return <img className={social ? "eu-artwork eu-social-art" : "eu-artwork eu-native-art"} style={asset.width > 0 && asset.height > 0 ? { aspectRatio: `${asset.width} / ${asset.height}` } : undefined} src={asset.src} alt={asset.alt} width={asset.width || undefined} height={asset.height || undefined} loading={eager ? "eager" : "lazy"} decoding="async" />;
}
function SocialDesign({ post }: { post: EuSocial }) {
  return <figure className="eu-social-figure">
    <Artwork social asset={{ src: post.image, alt: post.alt || post.title, width: post.width || 1080, height: post.height || 1350 }} />
    <figcaption><p className="eu-eyebrow">POST {String(post.postNumber).padStart(2,"0")} / {post.category}</p><h3>{post.title}</h3>
      <dl><dt>Purpose</dt><dd>{post.purpose}</dd><dt>Visual Approach</dt><dd>{post.visualApproach}</dd></dl>
      {post.supportingCopy && <p>{post.supportingCopy}</p>}
    </figcaption>
  </figure>;
}

function CaseSection({ section: s, project: p, index }: { section: EuSection; project: EuProject; index: number }) {
  const posts = p.socialDesigns.filter(post => post.enabled && post.image).sort((a,b)=>a.sortOrder-b.sortOrder);
  const heading = <header className="eu-section-heading"><p className="eu-eyebrow">{String(index+1).padStart(2,"0")} / {s.kind === "chapter" ? `CHAPTER ${String(s.chapter).padStart(2,"0")}` : s.kind.replace("-"," ").toUpperCase()}</p>{s.title && <h2>{s.title}</h2>}{s.copy && <p>{s.copy}</p>}</header>;
  if (s.kind === "hero") return <section className="eu-case-hero" data-section={s.id}>
    <div className="eu-case-hero-copy"><p className="eu-eyebrow">{p.projectType} / {p.year}</p><h1 id="eu-project-title">{s.title || p.title}</h1><p className="eu-hero-subtitle">{p.subtitle}</p><div className="eu-hero-meta"><p>{p.city}, {p.country}</p><p>{p.category}</p></div>{s.copy && <p>{s.copy}</p>}</div>
    <Artwork asset={p.cover} eager social />
    <div className="eu-hero-bottom"><span>{p.overview.functionalLine}</span><span>SCROLL TO EXPLORE ↓</span></div>
  </section>;
  if (s.kind === "place" || s.kind === "products") {
    const asset = s.kind === "place" ? p.assets.placeSheet : p.assets.productsSheet;
    if (!asset.src) return null;
    return <section className="eu-case-section eu-board-section" data-section={s.id}>{heading}<Artwork asset={asset} /><p className="eu-small">{s.kind === "place" ? p.brand.materials.join(" / ") : (p.assets.productHighlights ?? []).join(" / ")}</p></section>;
  }
  if (s.kind === "ai" && !p.show_ai_process) return null;
  if (s.kind === "details" && !p.assets.details.some(a=>a.src)) return null;
  const stories = (p.motionStories ?? []).filter(story=>story.enabled && story.src).sort((a,b)=>a.sortOrder-b.sortOrder);
  if (s.kind === "motion" && !stories.length) return null;
  return <section className={`eu-case-section eu-section-${s.kind} eu-layout-${s.layout || "default"} ${s.kind === "chapter" ? `eu-chapter-${s.chapter % 4}` : ""}`} data-section={s.id}>
    {heading}
    {s.kind === "overview" && <div className="eu-overview"><div><p className="eu-lead">{p.overview.summary}</p><p>{p.overview.objective}</p>{p.overview.challenge && <p>{p.overview.challenge}</p>}</div><div className="eu-role-list"><p className="eu-eyebrow">ROLE / CAPABILITIES</p>{p.overview.roles.map((r,i)=><span key={i}>{r}</span>)}{p.concept && <p className="eu-concept-note">Independent fictional concept. Not commissioned client work.</p>}</div></div>}
    {s.kind === "idea" && <><p className="eu-brand-idea">{p.overview.brandIdea}</p><div className="eu-personality">{p.overview.personality.map((item,i)=><span key={i}>{item}</span>)}</div><p className="eu-idea-position">{p.overview.positioning}</p></>}
    {s.kind === "system" && <>
      <div className="eu-palette">{p.brand.colors.map(c=><div key={c.id}><div className="eu-swatch" style={{background:c.hex}} /><strong>{c.name}</strong><span>{c.hex}</span></div>)}</div>
      <div className="eu-type-grid">{p.brand.typography.map((font,i)=><div key={font.id} className={font.family && font.family !== "default" ? `eu-font-${font.family}` : i%2 ? "eu-editorial-type" : ""}><p className="eu-eyebrow">{font.name}</p><p className="eu-type-sample">{font.sample}</p><p className="eu-type-description">{font.description}</p></div>)}</div>
      <div className="eu-direction"><h3>{p.brand.visualTerritory}</h3><div><p>{p.brand.photographyDirection}</p><p className="eu-small">{p.brand.materials.join(" / ")}</p></div></div>
    </>}
    {s.kind === "social-intro" && <div className="eu-pillars">{p.contentPillars.map((pillar,i)=><span key={i}><small>{String(i+1).padStart(2,"0")}</small>{pillar}</span>)}</div>}
    {s.kind === "chapter" && <div className="eu-pair">{posts.filter(post=>post.chapter === s.chapter).map(post=><SocialDesign post={post} key={post.id}/>)}</div>}
    {s.kind === "grid" && <div className="eu-full-grid">{posts.map(post=><figure key={post.id}><Artwork social asset={{src:post.image,alt:post.alt || post.title,width:post.width || 1080,height:post.height || 1350}}/><figcaption>{String(post.postNumber).padStart(2,"0")} / {post.title}</figcaption></figure>)}</div>}
    {s.kind === "motion" && <div className="eu-motion-grid">{stories.map(story=><MotionStory key={story.id} story={story}/>)}</div>}
    {s.kind === "details" && <div className="eu-detail-grid">{p.assets.details.filter(a=>a.src).map((asset,i)=><Artwork key={i} asset={asset}/>)}</div>}
    {s.kind === "ai" && <><h3>{p.aiProcess.title}</h3><p className="eu-lead">{p.aiProcess.copy}</p><div className="eu-personality">{p.aiProcess.points.map((point,i)=><span key={i}>{point}</span>)}</div><div className="eu-detail-grid">{p.aiProcess.visuals.map((asset,i)=><Artwork key={i} asset={asset}/>)}</div></>}
    {s.kind === "closing" && <div className="eu-closing"><div><p className="eu-brand-idea">{p.closing.statement}</p><p>{p.city}, {p.country}</p>{p.concept && <p className="eu-eyebrow">{p.projectType}</p>}</div><Artwork asset={p.closing.image} social /></div>}
  </section>;
}

export default function ProjectViewer({ slug, draft, projects, onClose, onNavigate, returnFocus }: {
  slug: string; draft: boolean; projects: EuProjectSummary[]; onClose: ()=>void; onNavigate: (slug:string)=>void; returnFocus: RefObject<HTMLElement | null>;
}) {
  const [project, setProject] = useState<EuProject | null>(null);
  const [error, setError] = useState("");
  const [retry, setRetry] = useState(0);
  const dialog = useRef<HTMLDivElement>(null);
  const scrollArea = useRef<HTMLDivElement>(null);
  const closeButton = useRef<HTMLButtonElement>(null);
  const closeHandler = useRef(onClose);
  closeHandler.current = onClose;

  useEffect(() => {
    const y = window.scrollY;
    const x = window.scrollX;
    const bodyStyle = document.body.style.cssText;
    const gutter = window.innerWidth - document.documentElement.clientWidth;
    Object.assign(document.body.style, { position:"fixed", top:`-${y}px`, left:`-${x}px`, width:"100%", overflow:"hidden", paddingRight:`${gutter}px` });
    closeButton.current?.focus({ preventScroll:true });
    const keydown = (event: KeyboardEvent) => {
      if (event.key === "Escape") { event.preventDefault(); closeHandler.current(); }
      if (event.key === "Tab") {
        const elements = Array.from(dialog.current?.querySelectorAll<HTMLElement>('a[href],button:not([disabled]),input,select,textarea,[tabindex="0"]') ?? []).filter(el=>el.getClientRects().length);
        const first=elements[0], last=elements[elements.length-1];
        if (event.shiftKey && (document.activeElement === first || !dialog.current?.contains(document.activeElement))) { event.preventDefault(); last?.focus(); }
        else if (!event.shiftKey && (document.activeElement === last || !dialog.current?.contains(document.activeElement))) { event.preventDefault(); first?.focus(); }
      }
    };
    document.addEventListener("keydown",keydown);
    return () => {
      document.removeEventListener("keydown",keydown);
      document.body.style.cssText = bodyStyle;
      window.scrollTo(x,y);
      returnFocus.current?.focus({preventScroll:true});
    };
  }, [returnFocus]);
  useEffect(() => {
    const abort = new AbortController();
    setProject(null); setError("");
    scrollArea.current?.scrollTo(0,0);
    fetch(`/api/eu-visual?project=${encodeURIComponent(slug)}${draft ? "&mode=draft" : ""}`,{cache:"no-store",signal:abort.signal})
      .then(async r=>{const data=await r.json();if(!r.ok)throw new Error(data.error || "Could not load project.");return data.project;})
      .then(setProject).catch(e=>{if(e.name !== "AbortError")setError(e.message);});
    return ()=>abort.abort();
  },[slug,draft,retry]);
  const index=projects.findIndex(p=>p.slug===slug);
  const navigate=(direction:number)=>{const next=projects[(index+direction+projects.length)%projects.length];if(next){closeButton.current?.focus();onNavigate(next.slug);}};
  const styles = project ? { "--eu-bg":project.brand.background, "--eu-ink":project.brand.textColor, "--eu-accent":project.brand.accentColor, "--eu-grid-bg":project.brand.gridBackground || "#e7dfcf" } as CSSProperties : undefined;
  return <div ref={dialog} className="eu-viewer" role="dialog" aria-modal="true" aria-label={project?.title || "Project viewer"} style={styles}>
    <header className="eu-viewer-bar"><span>EU VISUAL <i>/</i> {project?.city || "PROJECT"}</span><div>{projects.length>1 && <><button onClick={()=>navigate(-1)} aria-label="Previous project">← Previous</button><button onClick={()=>navigate(1)} aria-label="Next project">Next →</button></>}<button ref={closeButton} className="eu-close" onClick={onClose}>Close <span aria-hidden="true">×</span></button></div></header>
    <div ref={scrollArea} className="eu-viewer-scroll" data-lenis-prevent tabIndex={-1}>
      {error ? <div className="eu-viewer-status" role="alert"><h2>Project unavailable</h2><p>{error}</p><button onClick={()=>setRetry(v=>v+1)}>Try again</button><button onClick={onClose}>Back to projects</button></div> : !project ? <div className="eu-viewer-status" role="status">Opening project…</div> : <article className="eu-case" key={project.id}>
        {draft && <p className="eu-preview-note">DRAFT PREVIEW</p>}
        {project.sections.filter(s=>s.enabled).map((section,i)=><CaseSection key={section.id} section={section} project={project} index={i}/>)}
        <footer className="eu-case-footer"><button onClick={onClose}>Close Project ↗</button>{projects.length>1 && <div><button onClick={()=>navigate(-1)}>← Previous Project</button><button onClick={()=>navigate(1)}>Next Project →</button></div>}</footer>
      </article>}
    </div>
  </div>;
}
