"use client";
import { useState, type ReactNode } from "react";
import { createEuProject, type EuVisualConfig, type EuProject } from "../../lib/eu-visual";

export default function EuVisualEditor({ value, onChange, renderFields }: {
  value: EuVisualConfig; onChange: (value: EuVisualConfig)=>void;
  renderFields: (value: object, path: Array<string | number>)=>ReactNode;
}) {
  const [selected, setSelected] = useState(value.projects[0]?.id || "");
  const currentIndex = value.projects.findIndex(p=>p.id===selected);
  const index = currentIndex < 0 ? 0 : currentIndex;
  const project = value.projects[index];
  function add() {
    const next=createEuProject();
    next.sortOrder=value.projects.length*10+10;
    onChange({...value,projects:[...value.projects,next]});
    setSelected(next.id);
  }
  function patchProject(patch:Partial<EuProject>) {
    onChange({...value,projects:value.projects.map((p,i)=>i===index ? {...p,...patch} : p)});
  }
  function move(direction:number) {
    const next=[...value.projects].sort((a,b)=>a.sortOrder-b.sortOrder);
    const from=next.findIndex(p=>p.id===project.id);
    const to=from+direction;
    if(to<0||to>=next.length)return;
    [next[from],next[to]]=[next[to],next[from]];
    onChange({...value,projects:next.map((p,i)=>({...p,sortOrder:(i+1)*10}))});
  }
  return <div className="eu-admin">
    <div className="all-controls__intro"><strong>EU VISUAL / PROJECTS</strong><span>Manage case studies here. Save Draft to preview, then Publish Live to apply your changes.</span></div>
    <details className="all-control-group"><summary>Landing page copy</summary>{renderFields({title:value.title,headline:value.headline,description:value.description},["euVisual"])}</details>
    <div className="eu-admin-toolbar"><label>PROJECT<select value={project?.id || ""} onChange={e=>setSelected(e.target.value)}>
      {!project && <option value="">No projects yet</option>}
      {[...value.projects].sort((a,b)=>a.sortOrder-b.sortOrder).map(p=><option key={p.id} value={p.id}>{p.title} — {p.published ? "Published" : "Draft"}</option>)}
    </select></label><button type="button" className="secondary-button" onClick={add}>+ NEW PROJECT</button></div>
    {project && <>
      <div className="eu-admin-toolbar">
        <button type="button" className="secondary-button" onClick={()=>patchProject({published:!project.published})}>{project.published ? "SET PROJECT TO DRAFT" : "MARK FOR PUBLICATION"}</button>
        <a className="live-button" target="_blank" rel="noreferrer" href={`/eu-visual?site_preview=draft&project=${encodeURIComponent(project.slug)}`}>PREVIEW PROJECT ↗</a>
        <button type="button" className="secondary-button" onClick={()=>move(-1)}>MOVE EARLIER ↑</button>
        <button type="button" className="secondary-button" onClick={()=>move(1)}>MOVE LATER ↓</button>
        <button type="button" className="danger-button" onClick={()=>{if(window.confirm(`Remove "${project.title}" from this draft? Uploaded media will remain in the library.`)){onChange({...value,projects:value.projects.filter(p=>p.id!==project.id)});setSelected("");}}}>REMOVE PROJECT</button>
      </div>
      {(!project.assets.placeSheet.src || !project.assets.productsSheet.src) && <p className="eu-admin-notice">Place / Products sheets without an image are hidden from the presentation. Add their approved image URLs below; use their original width and height.</p>}
      <p className="eu-admin-notice">Sections follow their list order. Social designs use Sort order within each Chapter (1–4 by default). New items can be added even when a list is empty. AI process appears only when Show ai process is ON and its section is enabled.</p>
      {renderFields(project,["euVisual","projects",index])}
    </>}
  </div>;
}

