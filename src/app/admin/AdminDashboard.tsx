"use client";

import { upload } from "@vercel/blob/client";
import { useCallback, useEffect, useMemo, useState } from "react";
import type { SiteConfig } from "../../lib/site-config";

type BlobItem = {
  url: string;
  pathname: string;
  size: number;
  uploadedAt: string;
};

type JsonObject = Record<string, unknown>;
type Path = Array<string | number>;

function clone<T>(value: T): T {
  return structuredClone(value);
}

function setAtPath(source: SiteConfig, path: Path, nextValue: unknown) {
  const output = clone(source) as unknown as JsonObject;
  let cursor: unknown = output;
  for (let index = 0; index < path.length - 1; index += 1) {
    cursor = (cursor as JsonObject)[path[index] as string];
  }
  (cursor as JsonObject)[path[path.length - 1] as string] = nextValue;
  return output as unknown as SiteConfig;
}

function titleCase(value: string) {
  return value.replace(/([a-z])([A-Z])/g, "$1 $2").replaceAll("_", " ").toUpperCase();
}

function FieldEditor({
  label,
  value,
  onChange,
}: {
  label: string;
  value: unknown;
  onChange: (value: unknown) => void;
}) {
  if (typeof value === "boolean") {
    return (
      <label className="control-toggle">
        <input type="checkbox" checked={value} onChange={(event) => onChange(event.target.checked)} />
        <span>{titleCase(label)}</span>
      </label>
    );
  }
  if (typeof value === "number") {
    return (
      <label className="control-field">
        <span>{titleCase(label)}</span>
        <input type="number" step="any" value={value} onChange={(event) => onChange(Number(event.target.value))} />
      </label>
    );
  }
  if (typeof value === "string") {
    const isColor = /^#[0-9a-f]{6}$/i.test(value);
    const isMedia = /^(https?:\/\/|\/media\/).+\.(png|jpe?g|webp|gif|mp4|webm)(\?.*)?$/i.test(value);
    const isLong = value.length > 74 || /description|detail|caption|line|deck|statement/i.test(label);
    return (
      <label className="control-field">
        <span>{titleCase(label)}</span>
        <div className="control-field__input">
          {isColor && <input className="color-chip" type="color" value={value} onChange={(event) => onChange(event.target.value)} />}
          {isLong ? (
            <textarea value={value} rows={3} onChange={(event) => onChange(event.target.value)} />
          ) : (
            <input type="text" value={value} onChange={(event) => onChange(event.target.value)} />
          )}
          {isMedia && !/\.(mp4|webm)(\?.*)?$/i.test(value) && <img className="field-thumb" src={value} alt="" />}
        </div>
      </label>
    );
  }
  return null;
}

function RecursiveEditor({
  value,
  path,
  onChange,
}: {
  value: unknown;
  path: Path;
  onChange: (path: Path, value: unknown) => void;
}) {
  if (Array.isArray(value)) {
    return (
      <div className="array-editor">
        {value.map((item, index) => (
          <details className="array-item" key={`${path.join(".")}-${index}`}>
            <summary>
              <span>{String((item as JsonObject)?.id ?? (item as JsonObject)?.title ?? `ITEM ${index + 1}`)}</span>
              <span className="array-actions" onClick={(event) => event.preventDefault()}>
                <button type="button" disabled={index === 0} onClick={() => {
                  const next = [...value];
                  [next[index - 1], next[index]] = [next[index], next[index - 1]];
                  onChange(path, next);
                }}>↑</button>
                <button type="button" disabled={index === value.length - 1} onClick={() => {
                  const next = [...value];
                  [next[index + 1], next[index]] = [next[index], next[index + 1]];
                  onChange(path, next);
                }}>↓</button>
                <button type="button" onClick={() => onChange(path, value.filter((_, itemIndex) => itemIndex !== index))}>DELETE</button>
              </span>
            </summary>
            <RecursiveEditor value={item} path={[...path, index]} onChange={onChange} />
          </details>
        ))}
        <button className="add-row" type="button" onClick={() => {
          const template = value.length ? clone(value[value.length - 1]) : "";
          if (template && typeof template === "object" && !Array.isArray(template)) {
            (template as JsonObject).id = `new-${Date.now()}`;
          }
          onChange(path, [...value, template]);
        }}>＋ ADD ITEM</button>
      </div>
    );
  }

  if (value && typeof value === "object") {
    return (
      <div className="object-editor">
        {Object.entries(value as JsonObject).map(([key, child]) =>
          child && typeof child === "object" ? (
            <div className="nested-field" key={key}>
              <h4>{titleCase(key)}</h4>
              <RecursiveEditor value={child} path={[...path, key]} onChange={onChange} />
            </div>
          ) : (
            <FieldEditor key={key} label={key} value={child} onChange={(next) => onChange([...path, key], next)} />
          ),
        )}
      </div>
    );
  }
  return null;
}

export default function AdminDashboard() {
  const [authenticated, setAuthenticated] = useState<boolean | null>(null);
  const [password, setPassword] = useState("");
  const [config, setConfig] = useState<SiteConfig | null>(null);
  const [media, setMedia] = useState<BlobItem[]>([]);
  const [active, setActive] = useState<"archive" | "sections" | "media" | "advanced">("archive");
  const [status, setStatus] = useState("READY");
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [jsonDraft, setJsonDraft] = useState("");
  const [dragIndex, setDragIndex] = useState<number | null>(null);

  const loadAll = useCallback(async () => {
    const [configResponse, mediaResponse] = await Promise.all([
      fetch("/api/site-config", { cache: "no-store" }),
      fetch("/api/media", { cache: "no-store" }),
    ]);
    if (!configResponse.ok || !mediaResponse.ok) throw new Error("Could not load site controls");
    const configData = await configResponse.json();
    const mediaData = await mediaResponse.json();
    setConfig(configData.config);
    setJsonDraft(JSON.stringify(configData.config, null, 2));
    setMedia(mediaData.blobs ?? []);
  }, []);

  useEffect(() => {
    fetch("/api/admin/session", { cache: "no-store" })
      .then((response) => response.json())
      .then(async (data) => {
        setAuthenticated(Boolean(data.authenticated));
        if (data.authenticated) await loadAll();
      })
      .catch(() => setAuthenticated(false));
  }, [loadAll]);

  const mediaInUse = useMemo(() => {
    const source = JSON.stringify(config ?? {});
    return new Set(media.filter((item) => source.includes(item.url)).map((item) => item.url));
  }, [config, media]);

  async function login(event: React.FormEvent) {
    event.preventDefault();
    setStatus("CHECKING");
    const response = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ password }),
    });
    if (!response.ok) {
      setStatus("WRONG PASSWORD");
      return;
    }
    setAuthenticated(true);
    setPassword("");
    await loadAll();
    setStatus("READY");
  }

  async function save() {
    if (!config) return;
    setSaving(true);
    setStatus("SAVING");
    const response = await fetch("/api/site-config", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ config }),
    });
    const data = await response.json();
    if (!response.ok) setStatus(data.error ?? "SAVE FAILED");
    else {
      setConfig(data.config);
      setJsonDraft(JSON.stringify(data.config, null, 2));
      setStatus("LIVE NOW");
    }
    setSaving(false);
  }

  function update(path: Path, value: unknown) {
    setConfig((current) => (current ? setAtPath(current, path, value) : current));
    setStatus("UNSAVED CHANGES");
  }

  async function uploadFile(file: File, onComplete?: (url: string) => void) {
    setUploading(true);
    setStatus("UPLOADING");
    try {
      const safeName = file.name.replace(/[^a-z0-9._-]+/gi, "-").toLowerCase();
      const blob = await upload(`media/uploads/${Date.now()}-${safeName}`, file, {
        access: "public",
        handleUploadUrl: "/api/media/upload",
      });
      onComplete?.(blob.url);
      await loadAll();
      setStatus(onComplete ? "MEDIA ADDED — SAVE TO PUBLISH" : "UPLOAD READY");
    } catch (error) {
      setStatus(error instanceof Error ? error.message.toUpperCase() : "UPLOAD FAILED");
    } finally {
      setUploading(false);
    }
  }

  if (authenticated === null) return <main className="admin-loading">LOADING SITE CONTROL…</main>;

  if (!authenticated) {
    return (
      <main className="admin-login">
        <div className="login-mark">PLAY<span>/</span>EDIT</div>
        <form onSubmit={login}>
          <span>PRIVATE CONTROL ROOM</span>
          <h1>MAKE THE SITE<br /><em>MISBEHAVE.</em></h1>
          <label>
            DASHBOARD PASSWORD
            <input type="password" autoFocus value={password} onChange={(event) => setPassword(event.target.value)} />
          </label>
          <button type="submit">ENTER CONTROL →</button>
          <p>{status}</p>
        </form>
      </main>
    );
  }

  if (!config) return <main className="admin-loading">LOADING EVERY DETAIL…</main>;

  const archive = config.archive.items;

  function changeArchive(items: SiteConfig["archive"]["items"]) {
    update(["archive", "items"], items);
  }

  return (
    <main className="admin-shell">
      <header className="admin-header">
        <a className="admin-brand" href="/" target="_blank">PLAY<span>/</span>EDIT <small>SITE CONTROL</small></a>
        <div className="admin-status"><i className={status === "LIVE NOW" ? "is-live" : ""} />{status}</div>
        <div className="admin-header__actions">
          <a href="/" target="_blank">VIEW LIVE ↗</a>
          <button type="button" onClick={async () => {
            await fetch("/api/admin/logout", { method: "POST" });
            setAuthenticated(false);
          }}>LOG OUT</button>
          <button className="save-button" type="button" disabled={saving} onClick={save}>{saving ? "SAVING…" : "SAVE + PUBLISH"}</button>
        </div>
      </header>

      <nav className="admin-tabs">
        {([
          ["archive", `${archive.length} DESIGNS`],
          ["sections", "ALL SECTIONS"],
          ["media", `${media.length} MEDIA FILES`],
          ["advanced", "ADVANCED JSON"],
        ] as const).map(([id, label]) => (
          <button type="button" className={active === id ? "is-active" : ""} onClick={() => setActive(id)} key={id}>{label}</button>
        ))}
      </nav>

      {active === "archive" && (
        <section className="admin-panel">
          <div className="panel-intro">
            <div><span>THE FULL NOISY ARCHIVE</span><h1>CHOOSE WHO<br /><em>GOES FIRST.</em></h1></div>
            <p>Drag designs to reorder. Replace an image directly. Add more work, hide it, or delete it. Press <strong>Save + Publish</strong> when the order feels right.</p>
          </div>
          <div className="archive-settings">
            {(["visibleItems", "tileWidthVw", "trackHeightVh", "scrollDistanceFactor"] as const).map((key) => (
              <FieldEditor key={key} label={key} value={config.archive[key]} onChange={(value) => update(["archive", key], value)} />
            ))}
          </div>
          <div className="archive-toolbar">
            <button type="button" onClick={() => changeArchive([
              ...archive,
              { id: `design-${Date.now()}`, visible: true, label: `DESIGN ${archive.length + 1}`, category: "NEW WORK", src: media[0]?.url ?? "" },
            ])}>＋ ADD DESIGN</button>
            <label className={uploading ? "is-disabled" : ""}>＋ UPLOAD + ADD<input type="file" accept="image/*" disabled={uploading} onChange={(event) => {
              const file = event.target.files?.[0];
              if (file) uploadFile(file, (url) => changeArchive([...archive, { id: `design-${Date.now()}`, visible: true, label: `DESIGN ${archive.length + 1}`, category: "NEW WORK", src: url }]));
              event.target.value = "";
            }} /></label>
            <span>DRAG ANY CARD TO MOVE IT</span>
          </div>
          <div className="archive-admin-list">
            {archive.map((item, index) => (
              <article
                className="archive-admin-card"
                key={item.id}
                draggable
                onDragStart={() => setDragIndex(index)}
                onDragOver={(event) => event.preventDefault()}
                onDrop={() => {
                  if (dragIndex === null || dragIndex === index) return;
                  const next = [...archive];
                  const [moved] = next.splice(dragIndex, 1);
                  next.splice(index, 0, moved);
                  changeArchive(next);
                  setDragIndex(null);
                }}
              >
                <div className="archive-admin-card__number">{String(index + 1).padStart(3, "0")}<span>↕</span></div>
                <div className="archive-admin-card__image"><img src={item.src} alt="" /></div>
                <div className="archive-admin-card__fields">
                  <input aria-label="Design label" value={item.label} onChange={(event) => changeArchive(archive.map((row, rowIndex) => rowIndex === index ? { ...row, label: event.target.value } : row))} />
                  <input aria-label="Design category" value={item.category} onChange={(event) => changeArchive(archive.map((row, rowIndex) => rowIndex === index ? { ...row, category: event.target.value } : row))} />
                  <input aria-label="Design media URL" value={item.src} onChange={(event) => changeArchive(archive.map((row, rowIndex) => rowIndex === index ? { ...row, src: event.target.value } : row))} />
                </div>
                <div className="archive-admin-card__actions">
                  <label>REPLACE<input type="file" accept="image/*" disabled={uploading} onChange={(event) => {
                    const file = event.target.files?.[0];
                    if (file) uploadFile(file, (url) => changeArchive(archive.map((row, rowIndex) => rowIndex === index ? { ...row, src: url } : row)));
                    event.target.value = "";
                  }} /></label>
                  <button type="button" onClick={() => changeArchive(archive.map((row, rowIndex) => rowIndex === index ? { ...row, visible: !row.visible } : row))}>{item.visible ? "HIDE" : "SHOW"}</button>
                  <button type="button" disabled={index === 0} onClick={() => {
                    const next = [...archive]; [next[index - 1], next[index]] = [next[index], next[index - 1]]; changeArchive(next);
                  }}>↑</button>
                  <button type="button" disabled={index === archive.length - 1} onClick={() => {
                    const next = [...archive]; [next[index + 1], next[index]] = [next[index], next[index + 1]]; changeArchive(next);
                  }}>↓</button>
                  <button className="danger" type="button" onClick={() => {
                    if (window.confirm(`Delete ${item.label} from the section? The media file will remain in your library.`)) changeArchive(archive.filter((_, rowIndex) => rowIndex !== index));
                  }}>DELETE</button>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}

      {active === "sections" && (
        <section className="admin-panel">
          <div className="panel-intro"><div><span>EVERY SMALL DETAIL</span><h1>THE WHOLE<br /><em>SYSTEM.</em></h1></div><p>Open a section to edit its text, timing, scroll distance, sizing, visibility, cards, media and order.</p></div>
          <div className="section-editor-list">
            {Object.entries(config).filter(([key]) => key !== "version" && key !== "archive").map(([key, value]) => (
              <details className="section-editor" key={key}>
                <summary><span>{titleCase(key)}</span><b>EDIT ALL →</b></summary>
                <RecursiveEditor value={value} path={[key]} onChange={update} />
              </details>
            ))}
          </div>
        </section>
      )}

      {active === "media" && (
        <section className="admin-panel">
          <div className="panel-intro"><div><span>VERCEL MEDIA LIBRARY</span><h1>UPLOAD.<br /><em>USE. REPEAT.</em></h1></div><p>Every image and video here is hosted by Vercel. Copy a URL, add an image to the archive, or remove files that are not used anywhere.</p></div>
          <label className="media-drop">{uploading ? "UPLOADING…" : "DROP IN A NEW IMAGE OR VIDEO"}<input type="file" accept="image/*,video/*" disabled={uploading} onChange={(event) => {
            const file = event.target.files?.[0]; if (file) uploadFile(file); event.target.value = "";
          }} /></label>
          <div className="media-grid">
            {media.map((item) => {
              const video = /\.(mp4|webm)(\?.*)?$/i.test(item.url);
              const inUse = mediaInUse.has(item.url);
              return (
                <article className="media-card" key={item.url}>
                  <div className="media-card__preview">{video ? <video src={item.url} muted /> : <img src={item.url} alt="" loading="lazy" />}</div>
                  <strong>{item.pathname.split("/").pop()}</strong>
                  <span>{(item.size / 1024 / 1024).toFixed(2)} MB · {inUse ? "IN USE" : "FREE"}</span>
                  <div>
                    <button type="button" onClick={async () => { await navigator.clipboard.writeText(item.url); setStatus("URL COPIED"); }}>COPY URL</button>
                    {!video && <button type="button" onClick={() => {
                      changeArchive([...archive, { id: `design-${Date.now()}`, visible: true, label: `DESIGN ${archive.length + 1}`, category: "NEW WORK", src: item.url }]);
                      setActive("archive");
                    }}>ADD TO 131</button>}
                    <button className="danger" type="button" disabled={inUse} title={inUse ? "Remove it from the site before deleting the file" : "Delete media file"} onClick={async () => {
                      if (!window.confirm("Permanently delete this unused media file from Vercel?")) return;
                      await fetch("/api/media", { method: "DELETE", headers: { "content-type": "application/json" }, body: JSON.stringify({ url: item.url }) });
                      await loadAll();
                    }}>DELETE</button>
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      )}

      {active === "advanced" && (
        <section className="admin-panel advanced-panel">
          <div className="panel-intro"><div><span>NO LIMITS MODE</span><h1>RAW<br /><em>CONTROL.</em></h1></div><p>Edit the complete configuration as JSON. Use this when you need a property that is faster to change in bulk.</p></div>
          <textarea value={jsonDraft} spellCheck={false} onChange={(event) => setJsonDraft(event.target.value)} />
          <button type="button" onClick={() => {
            try { const parsed = JSON.parse(jsonDraft) as SiteConfig; setConfig(parsed); setStatus("JSON APPLIED — SAVE TO PUBLISH"); }
            catch { setStatus("INVALID JSON — CHECK THE RED LINE"); }
          }}>APPLY JSON TO EDITOR</button>
        </section>
      )}
    </main>
  );
}
