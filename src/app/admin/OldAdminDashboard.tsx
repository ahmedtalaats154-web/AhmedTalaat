"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { upload as uploadToBlob } from "@vercel/blob/client";
import {
  DEFAULT_SITE_CONFIG,
  mergeSiteConfig,
  type SiteConfig,
} from "../../lib/site-config";

type MediaAsset = {
  id: string;
  name: string;
  contentType: string;
  sizeBytes: number;
  createdAt?: string;
  src: string;
};

type JsonValue =
  | string
  | number
  | boolean
  | null
  | JsonValue[]
  | { [key: string]: JsonValue };

const GROUPS = [
  ["all", "All site controls"],
  ["identity", "Identity"],
  ["theme", "Colors & spacing"],
  ["scroll", "Scrolling"],
  ["navigation", "Navigation"],
  ["hero", "Hero"],
  ["figures", "Figures"],
  ["playground", "Playground"],
  ["showreel", "Showreel"],
  ["timelapse", "Not Magic. Layers."],
  ["work", "Creative work"],
  ["archive", "Archive"],
  ["system", "Process & system"],
  ["footer", "Footer"],
  ["media", "Media library"],
  ["advanced", "Advanced JSON"],
] as const;

const LONG_TEXT_KEYS = new Set([
  "description",
  "detail",
  "text",
  "caption",
  "deck",
  "signoff",
  "imageStatement",
]);

const MEDIA_KEYS = new Set([
  "image",
  "video",
  "src",
  "cutoutImage",
]);

function humanize(value: string) {
  return value
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .replace(/[_-]+/g, " ")
    .replace(/^./, (letter) => letter.toUpperCase());
}

function cloneAndSet(root: SiteConfig, path: Array<string | number>, value: unknown) {
  const copy = structuredClone(root) as unknown as Record<string, unknown>;
  let cursor: unknown = copy;
  for (let index = 0; index < path.length - 1; index += 1) {
    cursor = (cursor as Record<string | number, unknown>)[path[index]];
  }
  (cursor as Record<string | number, unknown>)[path[path.length - 1]] = value;
  return copy as unknown as SiteConfig;
}

function isColorField(key: string, value: string) {
  return (
    /^#[0-9a-f]{6}$/i.test(value) &&
    (key === "color" ||
      ["cream", "paper", "ink", "blue", "yellow", "orange", "pink", "mint", "lilac"].includes(key))
  );
}

function FieldEditor({
  label,
  path,
  value,
  onChange,
}: {
  label: string;
  path: Array<string | number>;
  value: JsonValue;
  onChange: (path: Array<string | number>, value: JsonValue) => void;
}) {
  const key = String(path[path.length - 1] ?? label);

  if (typeof value === "boolean") {
    return (
      <label className="control-row control-row--toggle">
        <span>{label}</span>
        <button
          className={`switch ${value ? "is-on" : ""}`}
          type="button"
          role="switch"
          aria-checked={value}
          onClick={() => onChange(path, !value)}
        >
          <i />
          {value ? "ON" : "OFF"}
        </button>
      </label>
    );
  }

  if (typeof value === "number") {
    return (
      <label className="control-row">
        <span>{label}</span>
        <input
          type="number"
          value={value}
          step={Math.abs(value) < 2 ? 0.05 : 1}
          onChange={(event) => onChange(path, Number(event.target.value))}
        />
      </label>
    );
  }

  if (typeof value === "string") {
    const color = isColorField(key, value);
    const media = MEDIA_KEYS.has(key);
    const video =
      key === "video" ||
      /\.(mp4|webm|mov)(?:[?#].*)?$/i.test(value);
    return (
      <label className={`control-row ${media ? "control-row--media" : ""}`}>
        <span>{label}</span>
        {LONG_TEXT_KEYS.has(key) || value.length > 95 ? (
          <textarea
            value={value}
            rows={4}
            onChange={(event) => onChange(path, event.target.value)}
          />
        ) : (
          <div className="control-inline">
            {color && (
              <input
                className="color-input"
                type="color"
                value={value}
                onChange={(event) => onChange(path, event.target.value)}
                aria-label={`${label} color`}
              />
            )}
            <input
              type="text"
              value={value}
              onChange={(event) => onChange(path, event.target.value)}
            />
          </div>
        )}
        {media && value && (
          <span className="media-field-preview">
            {video ? (
              <video src={value} muted playsInline />
            ) : (
              <img src={value} alt="" />
            )}
            <code>{value}</code>
          </span>
        )}
      </label>
    );
  }

  return null;
}

function ObjectEditor({
  value,
  path,
  onChange,
}: {
  value: Record<string, JsonValue>;
  path: Array<string | number>;
  onChange: (path: Array<string | number>, value: JsonValue) => void;
}) {
  return (
    <div className="control-grid">
      {Object.entries(value).map(([key, child]) =>
        Array.isArray(child) ? (
          <ArrayEditor
            key={key}
            label={humanize(key)}
            value={child}
            path={[...path, key]}
            onChange={onChange}
          />
        ) : child && typeof child === "object" ? (
          <fieldset className="control-fieldset" key={key}>
            <legend>{humanize(key)}</legend>
            <ObjectEditor
              value={child as Record<string, JsonValue>}
              path={[...path, key]}
              onChange={onChange}
            />
          </fieldset>
        ) : (
          <FieldEditor
            key={key}
            label={humanize(key)}
            value={child}
            path={[...path, key]}
            onChange={onChange}
          />
        ),
      )}
    </div>
  );
}

function ArrayEditor({
  label,
  value,
  path,
  onChange,
}: {
  label: string;
  value: JsonValue[];
  path: Array<string | number>;
  onChange: (path: Array<string | number>, value: JsonValue) => void;
}) {
  const move = (from: number, to: number) => {
    if (to < 0 || to >= value.length) return;
    const next = structuredClone(value);
    const [item] = next.splice(from, 1);
    next.splice(to, 0, item);
    onChange(path, next);
  };

  const duplicate = (index: number) => {
    const next = structuredClone(value);
    const item = structuredClone(next[index]);
    if (item && typeof item === "object" && !Array.isArray(item) && "id" in item) {
      item.id = `${String(item.id)}-copy`;
    }
    next.splice(index + 1, 0, item);
    onChange(path, next);
  };

  return (
    <fieldset className="control-fieldset control-fieldset--array">
      <legend>{label}</legend>
      <div className="array-list">
        {value.map((item, index) => (
          <details className="array-item" key={`${path.join(".")}-${index}`} open={index === 0}>
            <summary>
              <span>
                {String(
                  item && typeof item === "object" && !Array.isArray(item)
                    ? item.title ?? item.label ?? item.stage ?? item.id ?? `Item ${index + 1}`
                    : `Item ${index + 1}`,
                )}
              </span>
              <span className="array-actions" onClick={(event) => event.preventDefault()}>
                <button type="button" onClick={() => move(index, index - 1)} aria-label="Move up">↑</button>
                <button type="button" onClick={() => move(index, 0)}>FIRST</button>
                <button type="button" onClick={() => move(index, index + 1)} aria-label="Move down">↓</button>
                <button type="button" onClick={() => duplicate(index)}>DUPLICATE</button>
                <button
                  type="button"
                  className="danger-button"
                  onClick={() => onChange(path, value.filter((_, itemIndex) => itemIndex !== index))}
                >
                  REMOVE
                </button>
              </span>
            </summary>
            <div className="array-item__body">
              {item && typeof item === "object" && !Array.isArray(item) ? (
                <ObjectEditor
                  value={item as Record<string, JsonValue>}
                  path={[...path, index]}
                  onChange={onChange}
                />
              ) : (
                <FieldEditor
                  label={`Item ${index + 1}`}
                  value={item}
                  path={[...path, index]}
                  onChange={onChange}
                />
              )}
            </div>
          </details>
        ))}
      </div>
      {value.length > 0 && (
        <button className="secondary-button" type="button" onClick={() => duplicate(value.length - 1)}>
          + ADD ITEM
        </button>
      )}
    </fieldset>
  );
}

export default function OldAdminDashboard({
  userName,
  userEmail,
}: {
  userName: string;
  userEmail: string;
}) {
  const [config, setConfig] = useState<SiteConfig>(DEFAULT_SITE_CONFIG);
  const [activeGroup, setActiveGroup] = useState<(typeof GROUPS)[number][0]>("all");
  const [media, setMedia] = useState<MediaAsset[]>([]);
  const [status, setStatus] = useState("Loading your controls…");
  const [busy, setBusy] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [previewKey, setPreviewKey] = useState(0);
  const [liveKey, setLiveKey] = useState(0);
  const [jsonDraft, setJsonDraft] = useState("");

  const load = useCallback(async () => {
    try {
      const [configResponse, mediaResponse] = await Promise.all([
        fetch("/api/site-config?mode=draft", { cache: "no-store" }),
        fetch("/api/media", { cache: "no-store" }),
      ]);
      if (!configResponse.ok) throw new Error("Could not load the dashboard.");
      const configData = (await configResponse.json()) as { config: SiteConfig };
      const mergedConfig = mergeSiteConfig(configData.config);
      setConfig(mergedConfig);
      setJsonDraft(JSON.stringify(mergedConfig, null, 2));
      if (mediaResponse.ok) {
        const mediaData = (await mediaResponse.json()) as {
          blobs?: Array<{ url: string; pathname: string; size: number; uploadedAt?: string }>;
        };
        setMedia(
          (mediaData.blobs ?? []).map((blob) => {
            const extension = blob.pathname.split(".").pop()?.toLowerCase() ?? "";
            const video = extension === "mp4" || extension === "webm";
            return {
              id: blob.pathname,
              name: blob.pathname.split("/").pop() ?? blob.pathname,
              contentType: video ? `video/${extension}` : `image/${extension === "jpg" ? "jpeg" : extension}`,
              sizeBytes: blob.size,
              createdAt: blob.uploadedAt,
              src: blob.url,
            };
          }),
        );
      }
      setStatus("Draft loaded. Nothing changes live until you publish.");
      setDirty(false);
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Could not load the dashboard.");
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const update = (path: Array<string | number>, value: JsonValue) => {
    setConfig((current) => cloneAndSet(current, path, value));
    setDirty(true);
  };

  const save = async (mode: "draft" | "published") => {
    if (mode === "published" && !window.confirm("Publish these controls to the live site now?")) {
      return;
    }
    setBusy(true);
    setStatus(mode === "draft" ? "Saving draft…" : "Publishing live…");
    try {
      const response = await fetch("/api/site-config", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ mode, config }),
      });
      const data = (await response.json()) as { error?: string };
      if (!response.ok) throw new Error(data.error ?? "Save failed.");
      setPreviewKey((value) => value + 1);
      setJsonDraft(JSON.stringify(config, null, 2));
      setDirty(false);
      if (mode === "published") setLiveKey(Date.now());
      setStatus(
        mode === "draft"
          ? "Draft saved. The preview has refreshed."
          : "Published. The live site now uses these controls.",
      );
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Save failed.");
    } finally {
      setBusy(false);
    }
  };

  const upload = async (file: File) => {
    setBusy(true);
    setStatus(`Uploading ${file.name}…`);
    try {
      const safeName = file.name.replace(/[^a-z0-9._-]+/gi, "-").toLowerCase();
      const blob = await uploadToBlob(`media/uploads/${Date.now()}-${safeName}`, file, {
        access: "public",
        handleUploadUrl: "/api/media/upload",
      });
      const extension = file.name.split(".").pop()?.toLowerCase() ?? "";
      const asset: MediaAsset = {
        id: blob.pathname,
        name: file.name,
        contentType: file.type || (extension === "mp4" ? "video/mp4" : `image/${extension}`),
        sizeBytes: file.size,
        createdAt: new Date().toISOString(),
        src: blob.url,
      };
      setMedia((current) => [asset, ...current]);
      setStatus("Upload complete. Copy its URL into any image or video field.");
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Upload failed.");
    } finally {
      setBusy(false);
    }
  };

  const addMediaToArchive = (asset: MediaAsset) => {
    if (!asset.contentType.startsWith("image/")) {
      setStatus("Only images can be added to 131 Visuals.");
      return;
    }
    if (config.archive.items.some((item) => item.src === asset.src)) {
      setStatus(`${asset.name} is already in 131 Visuals.`);
      return;
    }

    const label =
      asset.name
        .replace(/\.[^.]+$/, "")
        .replace(/[_-]+/g, " ")
        .replace(/\s+/g, " ")
        .trim() || "NEW DESIGN";
    const nextItems = [
      ...config.archive.items,
      {
        id: `upload-${asset.id}`,
        visible: true,
        label,
        category: "NEW DESIGN",
        src: asset.src,
      },
    ];
    update(["archive", "items"], nextItems);
    update(["archive", "visibleItems"], Math.max(config.archive.visibleItems, nextItems.length));
    setStatus(`${asset.name} added to 131 Visuals. Save or publish when ready.`);
  };

  const activeValue = useMemo(() => {
    if (activeGroup === "all" || activeGroup === "media" || activeGroup === "advanced") return null;
    return config[activeGroup as keyof SiteConfig] as unknown as JsonValue;
  }, [activeGroup, config]);

  return (
    <main className="admin-shell">
      <aside className="admin-sidebar">
        <a className="admin-brand" href="/">
          PLAY<span>/</span>EDIT <i>CONTROL</i>
        </a>
        <nav aria-label="Dashboard controls">
          {GROUPS.map(([id, label]) => (
            <button
              className={activeGroup === id ? "is-active" : ""}
              type="button"
              key={id}
              onClick={() => {
                setActiveGroup(id);
                if (id === "advanced") setJsonDraft(JSON.stringify(config, null, 2));
              }}
            >
              <span>{label}</span>
              <b>↗</b>
            </button>
          ))}
        </nav>
        <div className="admin-user">
          <span>{userName}</span>
          <small>{userEmail}</small>
        </div>
      </aside>

      <section className="admin-workspace">
        <header className="admin-topbar">
          <div className="admin-topbar__title">
            <span>EDITING</span>
            <h1>{GROUPS.find(([id]) => id === activeGroup)?.[1]}</h1>
            <label className="admin-section-picker">
              <b>CONTROL GROUP</b>
              <select
                value={activeGroup}
                onChange={(event) => {
                  const next = event.target.value as (typeof GROUPS)[number][0];
                  setActiveGroup(next);
                  if (next === "advanced") {
                    setJsonDraft(JSON.stringify(config, null, 2));
                  }
                }}
              >
                {GROUPS.map(([id, label]) => (
                  <option value={id} key={id}>{label}</option>
                ))}
              </select>
            </label>
          </div>
          <div className="admin-actions">
            <span className={`save-state ${dirty ? "is-dirty" : ""}`}>
              {dirty ? "UNSAVED CHANGES" : "ALL CHANGES SAVED"}
            </span>
            <a className="live-button" href={`/?live=${liveKey}`} target="_blank" rel="noreferrer">
              VIEW LIVE
            </a>
            <button className="secondary-button" type="button" disabled={busy} onClick={() => void save("draft")}>
              SAVE DRAFT
            </button>
            <button className="publish-button" type="button" disabled={busy} onClick={() => void save("published")}>
              PUBLISH LIVE
            </button>
          </div>
        </header>

        <div className="admin-status" role="status">
          <i />
          {status}
        </div>

        <div className="admin-content">
          <div className="admin-editor">
            {activeGroup === "all" ? (
              <div className="all-controls">
                <div className="all-controls__intro">
                  <strong>EVERY SITE CONTROL, IN ONE PLACE</strong>
                  <span>Open any panel, change a detail, then use the fixed save bar below.</span>
                </div>
                {GROUPS.filter(
                  ([id]) => id !== "all" && id !== "media" && id !== "advanced",
                ).map(([id, label]) => {
                  const groupValue = config[id as keyof SiteConfig] as unknown as JsonValue;
                  return (
                    <details className="all-control-group" key={id} open>
                      <summary>
                        <span>{label}</span>
                        <b>EDIT ↓</b>
                      </summary>
                      <div>
                        {groupValue && typeof groupValue === "object" && !Array.isArray(groupValue) ? (
                          <ObjectEditor
                            value={groupValue as Record<string, JsonValue>}
                            path={[id]}
                            onChange={update}
                          />
                        ) : null}
                      </div>
                    </details>
                  );
                })}
              </div>
            ) : activeGroup === "media" ? (
              <div className="media-library">
                <label className="upload-drop">
                  <input
                    type="file"
                    accept="image/*,video/*"
                    disabled={busy}
                    onChange={(event) => {
                      const file = event.target.files?.[0];
                      if (file) void upload(file);
                      event.target.value = "";
                    }}
                  />
                  <strong>DROP IN A NEW IMAGE OR VIDEO</strong>
                  <span>Up to 80 MB. Upload once, use its URL anywhere.</span>
                </label>
                <div className="media-grid">
                  {media.map((asset) => (
                    <article key={asset.id}>
                      {asset.contentType.startsWith("video/") ? (
                        <video src={asset.src} muted controls playsInline />
                      ) : (
                        <img src={asset.src} alt="" />
                      )}
                      <div>
                        <strong>{asset.name}</strong>
                        <span>{(asset.sizeBytes / 1024 / 1024).toFixed(2)} MB</span>
                      </div>
                      {asset.contentType.startsWith("image/") && (
                        <button
                          className="media-use-button"
                          type="button"
                          onClick={() => addMediaToArchive(asset)}
                        >
                          USE IN 131 VISUALS
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => {
                          const fullUrl = new URL(asset.src, window.location.origin).href;
                          void navigator.clipboard.writeText(fullUrl);
                          setStatus(`Copied ${fullUrl}`);
                        }}
                      >
                        COPY FULL URL
                      </button>
                    </article>
                  ))}
                </div>
              </div>
            ) : activeGroup === "advanced" ? (
              <div className="advanced-editor">
                <p>
                  Every stored control is exposed here. Apply carefully, then save
                  as a draft before publishing.
                </p>
                <textarea value={jsonDraft} onChange={(event) => setJsonDraft(event.target.value)} />
                <button
                  className="secondary-button"
                  type="button"
                  onClick={() => {
                    try {
                      const next = mergeSiteConfig(JSON.parse(jsonDraft));
                      setConfig(next);
                      setDirty(true);
                      setStatus("Advanced JSON applied to the unsaved draft.");
                    } catch {
                      setStatus("That JSON is not valid yet.");
                    }
                  }}
                >
                  APPLY JSON TO DRAFT
                </button>
              </div>
            ) : activeValue && typeof activeValue === "object" && !Array.isArray(activeValue) ? (
              <ObjectEditor
                value={activeValue as Record<string, JsonValue>}
                path={[activeGroup]}
                onChange={update}
              />
            ) : (
              <FieldEditor label={humanize(activeGroup)} path={[activeGroup]} value={activeValue} onChange={update} />
            )}

            <div className="admin-reset">
              <div>
                <strong>APPROVED VERSION 4 DEFAULTS</strong>
                <span>Reset only changes your unsaved dashboard draft.</span>
              </div>
              <button
                className="danger-button"
                type="button"
                onClick={() => {
                  if (window.confirm("Reset every dashboard field to the approved Version 4 defaults?")) {
                    setConfig(DEFAULT_SITE_CONFIG);
                    setJsonDraft(JSON.stringify(DEFAULT_SITE_CONFIG, null, 2));
                    setDirty(true);
                    setStatus("Reset locally. Save draft or publish when ready.");
                  }
                }}
              >
                RESET ALL
              </button>
            </div>
          </div>

          <aside className="admin-preview">
            <div>
              <span>LIVE DRAFT PREVIEW</span>
              <a href="/?site_preview=draft" target="_blank" rel="noreferrer">OPEN FULL SIZE ↗</a>
            </div>
            <iframe
              key={previewKey}
              src={`/?site_preview=draft&refresh=${previewKey}`}
              title="Draft site preview"
            />
          </aside>
        </div>

        <div className="admin-commandbar" aria-label="Save controls">
          <div>
            <i className={dirty ? "is-dirty" : ""} />
            <span>{dirty ? "You have unsaved changes" : status}</span>
          </div>
          <div>
            <a className="live-button" href={`/?live=${liveKey}`} target="_blank" rel="noreferrer">
              VIEW LIVE
            </a>
            <button className="secondary-button" type="button" disabled={busy} onClick={() => void save("draft")}>
              SAVE DRAFT
            </button>
            <button className="publish-button" type="button" disabled={busy} onClick={() => void save("published")}>
              PUBLISH LIVE
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}
