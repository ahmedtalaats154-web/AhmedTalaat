"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import dynamic from "next/dynamic";
import type { EuLandingData } from "../../lib/eu-visual";

const ProjectViewer = dynamic(() => import("./ProjectViewer"), { ssr: false });
export default function EuVisualClient({ initialData }: { initialData: EuLandingData }) {
  const [data, setData] = useState(initialData);
  const [slug, setSlug] = useState<string | null>(null);
  const [draft, setDraft] = useState(false);
  const [error, setError] = useState("");
  const landing = useRef<HTMLDivElement>(null);
  const returnFocus = useRef<HTMLElement | null>(null);
  const pushed = useRef(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const isDraft = params.get("site_preview") === "draft";
    setDraft(isDraft);
    setSlug(params.get("project"));
    const onPop = () => {
      pushed.current = false;
      setSlug(new URLSearchParams(window.location.search).get("project"));
    };
    window.addEventListener("popstate", onPop);
    const abort = new AbortController();
    if (isDraft) {
      fetch("/api/eu-visual?mode=draft", { cache: "no-store", signal: abort.signal })
        .then(async r => { if (!r.ok) throw new Error("Sign in to the dashboard to preview drafts."); return r.json(); })
        .then(setData).catch(e => { if (e.name !== "AbortError") setError(e.message); });
    }
    return () => { window.removeEventListener("popstate", onPop); abort.abort(); };
  }, []);

  function openProject(next: string) {
    returnFocus.current = document.activeElement as HTMLElement;
    const url = new URL(window.location.href);
    url.searchParams.set("project", next);
    window.history.pushState({ ...window.history.state, euViewer: true }, "", url);
    pushed.current = true;
    setSlug(next);
  }
  function closeProject() {
    if (pushed.current) {
      window.history.back();
      pushed.current = false;
    } else {
      const url = new URL(window.location.href);
      url.searchParams.delete("project");
      window.history.replaceState(window.history.state, "", url);
    }
    setSlug(null);
  }
  function switchProject(next: string) {
    const url = new URL(window.location.href);
    url.searchParams.set("project", next);
    window.history.replaceState(window.history.state, "", url);
    setSlug(next);
  }
  const theme = data.theme ?? initialData.theme;
  const landingStyle = {
    "--eu-bg": theme.cream,
    "--eu-ink": theme.ink,
    "--eu-accent": theme.blue,
    "--eu-paper": theme.paper,
    "--eu-highlight": theme.yellow,
    "--eu-secondary": theme.orange,
  } as CSSProperties;
  return <div className="eu-root" style={landingStyle}>
    <div ref={landing} inert={slug ? true : undefined} aria-hidden={slug ? true : undefined}>
      <nav className="eu-nav" aria-label="Portfolio navigation">
        <a className="eu-mark" href="/">{data.brand}</a>
        <span>SELECTED WORK / EUROPE</span>
        <a href="/">Back to portfolio ↗</a>
      </nav>
      <main className="eu-landing">
        {draft && <p className="eu-preview-note">DRAFT PREVIEW — only visible to signed-in administrators</p>}
        {error && <p role="alert">{error}</p>}
        <header className="eu-intro">
          <p className="eu-eyebrow">A COLLECTION BY AHMED TALAAT</p>
          <h1>{data.title}</h1>
          <div className="eu-intro-copy"><h2>{data.headline}</h2><p>{data.description}</p></div>
        </header>
        <div className="eu-collection-label"><span>THE PROJECTS</span><span>{String(data.projects.length).padStart(2,"0")} / SELECTED CONCEPTS</span></div>
        <div className="eu-project-grid">
          {data.projects.map((p,i) => <article className="eu-project-card" key={p.id}>
            <a href={`/eu-visual?project=${encodeURIComponent(p.slug)}`} onClick={event => {
              if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
              event.preventDefault(); openProject(p.slug);
            }} aria-label={`View ${p.title}`}>
              <div className="eu-cover"><img src={p.cover.src} alt={p.cover.alt} width={p.cover.width || 1080} height={p.cover.height || 1350} loading={i === 0 ? "eager" : "lazy"} /><span className="eu-card-index">{String(i+1).padStart(2,"0")}</span></div>
              <div className="eu-card-meta"><div><h3>{p.title}</h3><p>{p.city}{p.country ? `, ${p.country}` : ""}</p></div><span className="eu-view-link">View Project <span className="eu-view-arrow" aria-hidden="true">↗</span></span></div>
              <p className="eu-card-type">{p.concept ? "CONCEPT PROJECT" : p.projectType} / {p.year}</p>
            </a>
          </article>)}
        </div>
        {!data.projects.length && <p className="eu-empty">The next collection is taking shape.</p>}
        <footer className="eu-landing-footer"><span>VISUAL SYSTEMS. CONSIDERED DETAILS.</span><a href="/#hello">Let’s talk ↗</a></footer>
      </main>
    </div>
    {slug && <ProjectViewer slug={slug} draft={draft} projects={data.projects} onClose={closeProject} onNavigate={switchProject} returnFocus={returnFocus} />}
  </div>;
}
