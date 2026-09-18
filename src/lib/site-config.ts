import archiveCatalog from "../data/archive-catalog.json";
import euVisualSeed from "../data/eu-visual.json";
import type { EuVisualConfig } from "./eu-visual";

export function withMediaOrigin<T>(value: T, origin: string): T {
  if (typeof value === "string") {
    return (value.startsWith("/media/") ? `${origin}${value}` : value) as T;
  }
  if (Array.isArray(value)) {
    return value.map((item) => withMediaOrigin(item, origin)) as T;
  }
  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value as Record<string, unknown>).map(([key, child]) => [
        key,
        withMediaOrigin(child, origin),
      ]),
    ) as T;
  }
  return value;
}

export type SectionSettings = {
  visible: boolean;
  order: number;
};

export type SiteConfig = {
  euVisual: EuVisualConfig;
  version: number;
  identity: {
    browserTitle: string;
    brand: string;
    status: string;
    email: string;
  };
  theme: {
    cream: string;
    paper: string;
    ink: string;
    blue: string;
    yellow: string;
    orange: string;
    pink: string;
    mint: string;
    lilac: string;
    pagePaddingPx: number;
    cornerRadiusPx: number;
  };
  scroll: {
    enabled: boolean;
    smooth: boolean;
    duration: number;
    wheelMultiplier: number;
    touchMultiplier: number;
    revealDuration: number;
    revealDistancePx: number;
  };
  navigation: {
    visible: boolean;
    links: Array<{
      id: string;
      visible: boolean;
      label: string;
      href: string;
    }>;
  };
  hero: SectionSettings & {
    kicker: string;
    words: [string, string, string];
    deck: string;
    location: string;
    scrollPrompt: string;
    image: string;
    imageAlt: string;
    imageLabel: string;
    imageStatement: string;
    cutoutImage: string;
    stickers: [string, string, string];
    minHeightVh: number;
    visualWidthVw: number;
    pointerTypeStrength: number;
    pointerImageStrength: number;
    parallaxEnabled: boolean;
    backgroundParallaxPercent: number;
    foregroundParallaxPercent: number;
  };
  figures: SectionSettings & {
    leftLabel: string;
    rightLabel: string;
    cardMinHeightPx: number;
    cards: Array<{
      id: string;
      visible: boolean;
      value: number;
      label: string;
      description: string;
      color: "blue" | "yellow" | "pink" | "mint";
    }>;
  };
  playground: SectionSettings & {
    eyebrow: string;
    title: string;
    image: string;
    imageAlt: string;
    cutoutImage: string;
    pinDistancePercent: number;
    cardWidthVw: number;
    cardHold: number;
    notes: Array<{
      id: string;
      visible: boolean;
      title: string;
      text: string;
    }>;
  };
  showreel: SectionSettings & {
    video: string;
    topEyebrow: string;
    topTitle: string;
    bottomTitle: string;
    durationLabel: string;
    backdropText: string;
    liveLabel: string;
    pinDistancePercent: number;
    frameHeightVh: number;
    cuts: Array<{
      id: string;
      visible: boolean;
      label: string;
      figure: string;
      line: string;
      start: number;
    }>;
  };
  timelapse: SectionSettings & {
    leftLabel: string;
    rightLabel: string;
    headline: string;
    accentHeadline: string;
    description: string;
    frameHoldSeconds: number;
    repeatDelaySeconds: number;
    autoReplay: boolean;
    pinDistancePercent: number;
    frameAspectRatio: number;
    frames: Array<{
      id: string;
      visible: boolean;
      stage: string;
      figure: string;
      detail: string;
      src: string;
      alt: string;
    }>;
  };
  work: SectionSettings & {
    leftLabel: string;
    rightLabel: string;
    headline: string;
    accentHeadline: string;
    description: string;
    gapPx: number;
    projects: Array<{
      id: string;
      visible: boolean;
      title: string;
      field: string;
      figure: string;
      image: string;
      alt: string;
      detail: string;
      color: string;
      columnStart: number;
      columnSpan: number;
      aspectRatio: number;
      marginTopRem: number;
    }>;
  };
  archive: SectionSettings & {
    eyebrow: string;
    title: string;
    description: string;
    visibleItems: number;
    tileWidthVw: number;
    trackHeightVh: number;
    scrollDistanceFactor: number;
    items: Array<{
      id: string;
      visible: boolean;
      label: string;
      category: string;
      src: string;
    }>;
  };
  system: SectionSettings & {
    leftLabel: string;
    rightLabel: string;
    headline: string;
    description: string;
    closeups: Array<{
      id: string;
      visible: boolean;
      image: string;
      alt: string;
      label: string;
      caption: string;
      marginTopRem: number;
    }>;
    process: Array<{
      id: string;
      visible: boolean;
      title: string;
      text: string;
      color: string;
    }>;
  };
  footer: SectionSettings & {
    availability: string;
    location: string;
    headline: string;
    accentHeadline: string;
    cutoutImage: string;
    cta: string;
    subject: string;
    socialHeading: string;
    socials: {
      facebook: {
        visible: boolean;
        label: string;
        detail: string;
        url: string;
        color: string;
      };
      instagram: {
        visible: boolean;
        label: string;
        detail: string;
        url: string;
        color: string;
      };
      whatsapp: {
        visible: boolean;
        label: string;
        detail: string;
        url: string;
        color: string;
      };
    };
    copyright: string;
    signoff: string;
  };
};

export const DEFAULT_SITE_CONFIG: SiteConfig = {
  euVisual: euVisualSeed as EuVisualConfig,
  version: 2,
  identity: {
    browserTitle: "PLAY / EDIT — Graphic Design × Video",
    brand: "PLAY/EDIT",
    status: "OPEN FOR ODD IDEAS",
    email: "hello@playedit.studio",
  },
  theme: {
    cream: "#f4efe3",
    paper: "#fffdf7",
    ink: "#101113",
    blue: "#2454ff",
    yellow: "#f6d83b",
    orange: "#ff6a22",
    pink: "#ff508e",
    mint: "#8ee8c1",
    lilac: "#e6bdf4",
    pagePaddingPx: 32,
    cornerRadiusPx: 35,
  },
  scroll: {
    enabled: true,
    smooth: true,
    duration: 0.86,
    wheelMultiplier: 0.92,
    touchMultiplier: 1.2,
    revealDuration: 0.6,
    revealDistancePx: 72,
  },
  navigation: {
    visible: true,
    links: [
      { id: "work", visible: true, label: "Work", href: "#work" },
      { id: "reel", visible: true, label: "Reel", href: "#reel" },
      { id: "hello", visible: true, label: "Hello", href: "#hello" },
    ],
  },
  hero: {
    visible: true,
    order: 10,
    kicker: "GRAPHIC DESIGNER — VIDEO EDITOR",
    words: ["MAKE", "MOVE", "MEAN IT."],
    deck: "Static never has the last word. I build visual systems, then give them timing, cuts and a pulse.",
    location: "CAIRO / EVERYWHERE",
    scrollPrompt: "SCROLL TO BREAK THE GRID ↓",
    image: "/media/generated/playground-master.webp",
    imageAlt: "A tactile creative playground made from paper, foam, film, grids and editing controls",
    imageLabel: "PLAYGROUND No. 01",
    imageStatement: "DESIGN THAT REFUSES TO SIT STILL.",
    cutoutImage: "/media/generated/cutout-loop.png",
    stickers: ["NEW", "LOUD", "ALIVE"],
    minHeightVh: 100,
    visualWidthVw: 43,
    pointerTypeStrength: 16,
    pointerImageStrength: 22,
    parallaxEnabled: true,
    backgroundParallaxPercent: 11,
    foregroundParallaxPercent: -13,
  },
  figures: {
    visible: true,
    order: 20,
    leftLabel: "FIGURES / 00—04",
    rightLabel: "THE USEFUL KIND",
    cardMinHeightPx: 352,
    cards: [
      { id: "01", visible: true, value: 134, label: "SOURCE VISUALS", description: "Every supplied design. Indexed, kept and pulled into the world.", color: "blue" },
      { id: "02", visible: true, value: 6, label: "CREATIVE FIELDS", description: "One system stretching from identity to the final edit.", color: "yellow" },
      { id: "03", visible: true, value: 24, label: "FRAMES / SECOND", description: "Rhythm lives in the distance between two cuts.", color: "pink" },
      { id: "04", visible: true, value: 1, label: "LIVING SYSTEM", description: "Flexible enough to stay recognisable while it misbehaves.", color: "mint" },
    ],
  },
  playground: {
    visible: true,
    order: 30,
    eyebrow: "THE CREATIVE",
    title: "PLAYGROUND",
    image: "/media/generated/playground-master.webp",
    imageAlt: "The master creative playground visual",
    cutoutImage: "/media/generated/cutout-paper.png",
    pinDistancePercent: 420,
    cardWidthVw: 26,
    cardHold: 0.34,
    notes: [
      { id: "01", visible: true, title: "BUILD THE RULE.", text: "A grid gives the idea somewhere solid to misbehave." },
      { id: "02", visible: true, title: "BEND THE RULE.", text: "Color controls the first glance. Timing earns the second." },
      { id: "03", visible: true, title: "MAKE IT MOVE.", text: "Twelve offset layers turn one poster into a small experience." },
      { id: "04", visible: true, title: "CUT THE FAT.", text: "Every frame either sharpens the rhythm or leaves the timeline." },
    ],
  },
  showreel: {
    visible: true,
    order: 40,
    video: "/media/reel-final.mp4",
    topEyebrow: "THE",
    topTitle: "WORK",
    bottomTitle: "IN MOTION",
    durationLabel: "16 SEC / LOOP",
    backdropText: "NATURAL SPEED — NATURAL SPEED — NATURAL SPEED",
    liveLabel: "PLAYING AT NATURAL SPEED",
    pinDistancePercent: 235,
    frameHeightVh: 78,
    cuts: [
      { id: "01", visible: true, label: "BRAND PLAYGROUND", figure: "12 MOTION LAYERS", line: "Posters, ribbons and film loops move in offset rhythms.", start: 0 },
      { id: "02", visible: true, label: "DESIGN LAB", figure: "06 VISUAL SYSTEMS", line: "Packaging unfolds while grids snap into place.", start: 4 },
      { id: "03", visible: true, label: "EDITING TRACK", figure: "24 FPS", line: "Every cut, waveform and keyframe stays in motion.", start: 8 },
      { id: "04", visible: true, label: "PORTFOLIO FINALE", figure: "01 CREATIVE WORLD", line: "Design and video resolve into one living identity.", start: 12 },
    ],
  },
  timelapse: {
    visible: true,
    order: 50,
    leftLabel: "PHOTOSHOP BUILD / 01—06",
    rightLabel: "TIMED / AUTO REPLAY",
    headline: "NOT MAGIC.",
    accentHeadline: "LAYERS.",
    description: "One poster grows through 18 adjustments and four color passes. Each stage holds long enough to read and auto-replays—never tied to scroll progress.",
    frameHoldSeconds: 1.45,
    repeatDelaySeconds: 0.8,
    autoReplay: true,
    pinDistancePercent: 360,
    frameAspectRatio: 1.7778,
    frames: [
      { id: "01", visible: true, stage: "SKETCH", figure: "02 ROUGH LAYERS", detail: "The grid starts in pencil. Every future collision already has an address.", src: "/media/generated/timelapse-photoshop/frame-01.webp", alt: "A Photoshop-style workspace showing the first rough poster sketch" },
      { id: "02", visible: true, stage: "BLOCK", figure: "06 SHAPE LAYERS", detail: "Cobalt sets the anchor. Orange cuts the first route through the page.", src: "/media/generated/timelapse-photoshop/frame-02.webp", alt: "The poster sketch blocked into simple colored shapes" },
      { id: "03", visible: true, stage: "COMPOSITE", figure: "11 MASKS", detail: "The subject drops in. Type becomes structure before it becomes a message.", src: "/media/generated/timelapse-photoshop/frame-03.webp", alt: "A subject photograph and bold typography added to the poster" },
      { id: "04", visible: true, stage: "ART DIRECT", figure: "14 ACTIVE LAYERS", detail: "Ribbons cross depth planes. One overlap decides what the eye reads first.", src: "/media/generated/timelapse-photoshop/frame-04.webp", alt: "The poster refined with layered ribbons, texture and art direction" },
      { id: "05", visible: true, stage: "RETOUCH", figure: "18 ADJUSTMENTS", detail: "A cobalt edge lift and three shadow passes make flat pieces feel touchable.", src: "/media/generated/timelapse-photoshop/frame-05.webp", alt: "The poster in its detailed color and edge retouch stage" },
      { id: "06", visible: true, stage: "FINAL", figure: "01 LIVING SYSTEM", detail: "The guides disappear. The rhythm stays—ready for posters, crops and motion.", src: "/media/generated/timelapse-photoshop/frame-06.webp", alt: "The completed and fully retouched PLAY EDIT poster" },
    ],
  },
  work: {
    visible: true,
    order: 70,
    leftLabel: "SELECTED WORK / 01—06",
    rightLabel: "ONE WORLD. SIX WAYS IN.",
    headline: "GOOD IDEAS",
    accentHeadline: "NEED GOOD TIMING.",
    description: "Branding sets the rules. Motion tests them. Editing keeps only the frames that earn their place.",
    gapPx: 128,
    projects: [
      { id: "01", visible: true, title: "Identity, with elbows.", field: "BRANDING", figure: "06 VISUAL SYSTEMS", image: "/media/generated/scene-branding.webp", alt: "A tactile cobalt, lilac, mint and orange brand identity system", detail: "The grid stays fixed. The pieces do not. One rounded module turns into packaging, tags and a campaign stamp.", color: "#2454ff", columnStart: 1, columnSpan: 7, aspectRatio: 1.08, marginTopRem: 0 },
      { id: "02", visible: true, title: "Repair gets a pulse.", field: "CAMPAIGN DESIGN", figure: "12 MOTION LAYERS", image: "/media/generated/scene-campaign.webp", alt: "A vivid blue multi-format mobile repair campaign", detail: "Electric blue owns the category. Orange interruption points make the fix feel fast before anyone reads a line.", color: "#ff6a22", columnStart: 9, columnSpan: 4, aspectRatio: 0.79, marginTopRem: 12 },
      { id: "03", visible: true, title: "A spread that thinks.", field: "EDITORIAL", figure: "08 GRID STATES", image: "/media/generated/scene-editorial.webp", alt: "A playful editorial spread about artificial intelligence and learning", detail: "A twelve-column system holds diagrams, notes and big ideas. The yellow beat tells the eye where to land next.", color: "#f6d83b", columnStart: 2, columnSpan: 4, aspectRatio: 0.79, marginTopRem: 0 },
      { id: "04", visible: true, title: "Stop the thumb.", field: "SOCIAL MEDIA", figure: "09 CROP RULES", image: "/media/generated/scene-social.webp", alt: "A warm food social media system built from pasta ribbons and crops", detail: "The fork is the hero. Tomato red creates appetite; cobalt rails keep nine unruly crops recognisably related.", color: "#ff508e", columnStart: 7, columnSpan: 6, aspectRatio: 1.08, marginTopRem: -3 },
      { id: "05", visible: true, title: "Frames find momentum.", field: "MOTION GRAPHICS", figure: "18 FRAME OFFSET", image: "/media/generated/scene-motion.webp", alt: "An automotive motion design storyboard with paths and keyframes", detail: "Three static car frames become one move when the mask lands four frames late and the path cuts the corner.", color: "#8ee8c1", columnStart: 1, columnSpan: 5, aspectRatio: 0.79, marginTopRem: 4 },
      { id: "06", visible: true, title: "Cut on intent.", field: "VIDEO EDITING", figure: "24 FPS", image: "/media/generated/scene-editing.webp", alt: "A physical video editing timeline made from acrylic and film", detail: "The cut lands two frames before the beat. That tiny decision makes the next shot feel faster than it is.", color: "#e6bdf4", columnStart: 7, columnSpan: 6, aspectRatio: 1.08, marginTopRem: 0 },
    ],
  },
  archive: {
    visible: true,
    order: 60,
    eyebrow: "THE FULL NOISY ARCHIVE",
    title: "131 VISUALS. NO FILLER.",
    description: "Food. Cars. Tech. Repair. AI. Identity. Travel. Beauty. Homes. Retail. Every supplied image stays in the mix.",
    visibleItems: 131,
    tileWidthVw: 13,
    trackHeightVh: 56,
    scrollDistanceFactor: 0.76,
    items: [],
  },
  system: {
    visible: true,
    order: 80,
    leftLabel: "PROCESS / VISUAL SYSTEM",
    rightLabel: "PLAY HAS STRUCTURE",
    headline: "CHAOS, WITH A BASELINE.",
    description: "The work feels loose because the system underneath it is doing the heavy lifting.",
    closeups: [
      { id: "type", visible: true, image: "/media/generated/closeup-type.webp", alt: "Macro detail of tactile typography and color hierarchy", label: "TYPE / ATTENTION", caption: "Black holds the field. Orange makes the decision.", marginTopRem: 0 },
      { id: "motion", visible: true, image: "/media/generated/closeup-motion.webp", alt: "Macro detail of a motion path and colorful keyframes", label: "PATH / KEYFRAMES", caption: "The curve is soft. The timing points are not.", marginTopRem: 8 },
      { id: "edit", visible: true, image: "/media/generated/closeup-edit.webp", alt: "Macro filmstrip and edit waveform detail", label: "CUT / RHYTHM", caption: "Three shots. One splice. Zero wasted frames.", marginTopRem: 3 },
    ],
    process: [
      { id: "01", visible: true, title: "Find the odd bit.", text: "The strongest idea is usually the detail everyone else tried to tidy away.", color: "#2454ff" },
      { id: "02", visible: true, title: "Give it rules.", text: "A flexible system survives a square post, a 9:16 reel and packaging without losing its accent.", color: "#ff6a22" },
      { id: "03", visible: true, title: "Add timing.", text: "Motion starts with hierarchy: what arrives first, what interrupts, what gets the last frame.", color: "#8ee8c1" },
      { id: "04", visible: true, title: "Edit until it clicks.", text: "A cut two frames early can sell more energy than another hour of decoration.", color: "#e6bdf4" },
    ],
  },
  footer: {
    visible: true,
    order: 90,
    availability: "AVAILABLE FOR SELECT PROJECTS",
    location: "CAIRO / REMOTE",
    headline: "GOT A GOOD",
    accentHeadline: "PROBLEM?",
    cutoutImage: "/media/generated/cutout-loop.png",
    cta: "START A PROJECT",
    subject: "Let's make something move",
    socialHeading: "PICK A CHANNEL.",
    socials: {
      facebook: {
        visible: true,
        label: "FACEBOOK",
        detail: "PROJECTS / UPDATES",
        url: "",
        color: "#2454ff",
      },
      instagram: {
        visible: true,
        label: "INSTAGRAM",
        detail: "DAILY CUTS / WIP",
        url: "",
        color: "#ff508e",
      },
      whatsapp: {
        visible: true,
        label: "WHATSAPP",
        detail: "START A CONVERSATION",
        url: "https://wa.me/201012556309",
        color: "#8ee8c1",
      },
    },
    copyright: "© 2026 PLAY / EDIT",
    signoff: "DESIGNED TO MOVE. EDITED TO LAND.",
  },
};

export function mergeSiteConfig(value: unknown): SiteConfig {
  const incomingVersion =
    value &&
    typeof value === "object" &&
    !Array.isArray(value) &&
    typeof (value as { version?: unknown }).version === "number"
      ? (value as { version: number }).version
      : 0;
  const merged = deepMerge(DEFAULT_SITE_CONFIG, value) as SiteConfig;

  if (incomingVersion < 2) {
    merged.version = 2;
    merged.showreel.visible = true;
    merged.showreel.order = 40;
    merged.timelapse.visible = true;
    merged.timelapse.order = 50;
    merged.timelapse.frames = merged.timelapse.frames.map((frame) => ({
      ...frame,
      visible: true,
    }));
    merged.archive.visible = true;
    merged.archive.order = 60;
    merged.work.order = 70;
  }

  const hasLegacyArchiveMetadata =
    merged.archive.items.length === archiveCatalog.length &&
    merged.archive.items.some(
      (item) => /^gd-\d+$/i.test(item.label) || /^\d+\s*-\s*/.test(item.category),
    );

  if (hasLegacyArchiveMetadata) {
    merged.archive.items = merged.archive.items.map((item, index) => {
      const curated = archiveCatalog[index];
      return {
        ...item,
        id: curated.id,
        label: /^gd-\d+$/i.test(item.label) ? curated.label : item.label,
        category: /^\d+\s*-\s*/.test(item.category)
          ? curated.category
          : item.category,
      };
    });
  }

  return merged;
}

function deepMerge(base: unknown, incoming: unknown): unknown {
  if (Array.isArray(base)) {
    return Array.isArray(incoming) ? incoming : base;
  }
  if (
    base &&
    typeof base === "object" &&
    incoming &&
    typeof incoming === "object" &&
    !Array.isArray(incoming)
  ) {
    const output: Record<string, unknown> = { ...(base as Record<string, unknown>) };
    for (const [key, value] of Object.entries(incoming as Record<string, unknown>)) {
      output[key] = key in output ? deepMerge(output[key], value) : value;
    }
    return output;
  }
  return incoming === undefined ? base : incoming;
}
