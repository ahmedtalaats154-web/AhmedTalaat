export type EuAsset = { src: string; alt: string; width: number; height: number };
export type EuSectionKind = "hero" | "overview" | "idea" | "system" | "place" | "products" | "social-intro" | "chapter" | "grid" | "details" | "ai" | "closing";
export type EuSection = { id: string; kind: EuSectionKind; enabled: boolean; title: string; copy: string; chapter: number };
export type EuSocial = { id: string; postNumber: number; image: string; alt: string; title: string; category: string; purpose: string; visualApproach: string; supportingCopy: string; chapter: number; sortOrder: number; enabled: boolean };
export type EuProject = {
  id: string; title: string; slug: string; subtitle: string; city: string; country: string;
  category: string; projectType: string; year: number; concept: boolean; published: boolean; sortOrder: number;
  cover: EuAsset;
  overview: { summary: string; objective: string; positioning: string; roles: string[]; brandIdea: string; functionalLine: string; challenge: string; personality: string[] };
  brand: {
    colors: { id: string; name: string; hex: string }[];
    typography: { id: string; name: string; description: string; sample: string }[];
    visualTerritory: string; materials: string[]; photographyDirection: string;
    background: string; textColor: string; accentColor: string;
  };
  assets: { placeSheet: EuAsset; productsSheet: EuAsset; productHighlights: string[]; details: EuAsset[] };
  socialDesigns: EuSocial[];
  contentPillars: string[];
  show_ai_process: boolean;
  aiProcess: { title: string; copy: string; points: string[]; visuals: EuAsset[] };
  closing: { statement: string; image: EuAsset };
  sections: EuSection[];
};
export type EuVisualConfig = { title: string; headline: string; description: string; projects: EuProject[] };
export type EuProjectSummary = Pick<EuProject, "id" | "title" | "slug" | "city" | "country" | "category" | "projectType" | "concept" | "cover" | "year">;
export type EuLandingTheme = { cream: string; paper: string; ink: string; blue: string; yellow: string; orange: string };
export type EuLandingData = Omit<EuVisualConfig, "projects"> & { brand: string; theme: EuLandingTheme; projects: EuProjectSummary[] };

export function summarizeProjects(config: EuVisualConfig, includeDrafts = false): EuProjectSummary[] {
  return config.projects.filter(p => includeDrafts || p.published).sort((a,b) => a.sortOrder - b.sortOrder).map(
    ({ id, title, slug, city, country, category, projectType, concept, cover, year }) =>
      ({ id, title, slug, city, country, category, projectType, concept, cover, year })
  );
}

// Preserve stable IDs while keeping future projects independent from North Pier.
export function createEuProject(): EuProject {
  const id = crypto.randomUUID();
  const emptyAsset = () => ({ src: "", alt: "", width: 1080, height: 1350 });
  return {
    id, title: "Untitled project", slug: `project-${id.slice(0,8)}`, subtitle: "", city: "", country: "",
    category: "", projectType: "Concept project", year: new Date().getFullYear(), concept: true, published: false, sortOrder: 0,
    cover: emptyAsset(),
    overview: { summary: "", objective: "", positioning: "", roles: [], brandIdea: "", functionalLine: "", challenge: "", personality: [] },
    brand: { colors: [], typography: [], visualTerritory: "", materials: [], photographyDirection: "", background: "#F1EBDD", textColor: "#183344", accentColor: "#B84B3C" },
    assets: { placeSheet: emptyAsset(), productsSheet: emptyAsset(), productHighlights: [], details: [] },
    socialDesigns: [], contentPillars: [], show_ai_process: false,
    aiProcess: { title: "Visual Production System", copy: "", points: [], visuals: [] },
    closing: { statement: "", image: emptyAsset() },
    sections: [
      { id: "hero", kind: "hero", enabled: true, title: "", copy: "", chapter: 0 },
      { id: "overview", kind: "overview", enabled: true, title: "Project overview", copy: "", chapter: 0 },
      { id: "idea", kind: "idea", enabled: true, title: "The brand idea", copy: "", chapter: 0 },
      { id: "system", kind: "system", enabled: true, title: "Visual system", copy: "", chapter: 0 },
      { id: "place", kind: "place", enabled: true, title: "Place system", copy: "", chapter: 0 },
      { id: "products", kind: "products", enabled: true, title: "Product system", copy: "", chapter: 0 },
      { id: "social-intro", kind: "social-intro", enabled: true, title: "One visual world. Multiple content roles.", copy: "", chapter: 0 },
      ...[1,2,3,4].map(chapter => ({ id: `chapter-${chapter}`, kind: "chapter" as const, enabled: true, title: `Chapter ${chapter}`, copy: "", chapter })),
      { id: "grid", kind: "grid", enabled: true, title: "The complete system", copy: "", chapter: 0 },
      { id: "details", kind: "details", enabled: false, title: "A closer look", copy: "", chapter: 0 },
      { id: "ai", kind: "ai", enabled: true, title: "", copy: "", chapter: 0 },
      { id: "closing", kind: "closing", enabled: true, title: "", copy: "", chapter: 0 },
    ],
  };
}

export function validateEuVisual(value: EuVisualConfig): string | null {
  if (!value || !Array.isArray(value.projects)) return "EU Visual projects must be a list.";
  const slugs = new Set<string>();
  const ids = new Set<string>();
  for (const p of value.projects) {
    if (!p.id || ids.has(p.id)) return "Each EU Visual project needs a unique ID.";
    ids.add(p.id);
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(p.slug)) return "Project slugs must use lowercase letters, numbers and hyphens.";
    if (slugs.has(p.slug)) return `Duplicate project slug: ${p.slug}.`;
    slugs.add(p.slug);
    if (p.published && (!p.title.trim() || !p.cover.src.trim())) return `Add a title and cover before publishing ${p.slug}.`;
    if (!Array.isArray(p.sections) || !Array.isArray(p.socialDesigns)) return "Project sections and social designs must be lists.";
    for (const list of [p.sections, p.socialDesigns]) {
      if (new Set(list.map(item => item.id)).size !== list.length) return `Duplicate item IDs in ${p.slug}.`;
    }
  }
  return null;
}
