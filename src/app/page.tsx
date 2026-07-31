"use client";

import {
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type MouseEvent as ReactMouseEvent,
} from "react";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useSpring,
} from "framer-motion";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import * as THREE from "three";
import {
  DEFAULT_SITE_CONFIG,
  mergeSiteConfig,
  type SectionSettings,
  type SiteConfig,
} from "../lib/site-config";

const GENERATED = "/media/generated";

const PROJECTS = [
  {
    id: "01",
    title: "Identity, with elbows.",
    field: "BRANDING",
    figure: "06 VISUAL SYSTEMS",
    image: `${GENERATED}/scene-branding.webp`,
    alt: "A tactile cobalt, lilac, mint and orange brand identity system",
    detail:
      "The grid stays fixed. The pieces do not. One rounded module turns into packaging, tags and a campaign stamp.",
    className: "project-card--a",
    color: "var(--blue)",
  },
  {
    id: "02",
    title: "Repair gets a pulse.",
    field: "CAMPAIGN DESIGN",
    figure: "12 MOTION LAYERS",
    image: `${GENERATED}/scene-campaign.webp`,
    alt: "A vivid blue multi-format mobile repair campaign",
    detail:
      "Electric blue owns the category. Orange interruption points make the fix feel fast before anyone reads a line.",
    className: "project-card--b",
    color: "var(--orange)",
  },
  {
    id: "03",
    title: "A spread that thinks.",
    field: "EDITORIAL",
    figure: "08 GRID STATES",
    image: `${GENERATED}/scene-editorial.webp`,
    alt: "A playful editorial spread about artificial intelligence and learning",
    detail:
      "A twelve-column system holds diagrams, notes and big ideas. The yellow beat tells the eye where to land next.",
    className: "project-card--c",
    color: "var(--yellow)",
  },
  {
    id: "04",
    title: "Stop the thumb.",
    field: "SOCIAL MEDIA",
    figure: "09 CROP RULES",
    image: `${GENERATED}/scene-social.webp`,
    alt: "A warm food social media system built from pasta ribbons and crops",
    detail:
      "The fork is the hero. Tomato red creates appetite; cobalt rails keep nine unruly crops recognisably related.",
    className: "project-card--d",
    color: "var(--pink)",
  },
  {
    id: "05",
    title: "Frames find momentum.",
    field: "MOTION GRAPHICS",
    figure: "18 FRAME OFFSET",
    image: `${GENERATED}/scene-motion.webp`,
    alt: "An automotive motion design storyboard with paths and keyframes",
    detail:
      "Three static car frames become one move when the mask lands four frames late and the path cuts the corner.",
    className: "project-card--e",
    color: "var(--mint)",
  },
  {
    id: "06",
    title: "Cut on intent.",
    field: "VIDEO EDITING",
    figure: "24 FPS",
    image: `${GENERATED}/scene-editing.webp`,
    alt: "A physical video editing timeline made from acrylic and film",
    detail:
      "The cut lands two frames before the beat. That tiny decision makes the next shot feel faster than it is.",
    className: "project-card--f",
    color: "var(--lilac)",
  },
] as const;

const REEL_CUTS = [
  {
    id: "01",
    label: "BRAND PLAYGROUND",
    figure: "12 MOTION LAYERS",
    line: "Posters, ribbons and film loops move in offset rhythms.",
    start: 0,
  },
  {
    id: "02",
    label: "DESIGN LAB",
    figure: "06 VISUAL SYSTEMS",
    line: "Packaging unfolds while grids snap into place.",
    start: 4,
  },
  {
    id: "03",
    label: "EDITING TRACK",
    figure: "24 FPS",
    line: "Every cut, waveform and keyframe stays in motion.",
    start: 8,
  },
  {
    id: "04",
    label: "PORTFOLIO FINALE",
    figure: "01 CREATIVE WORLD",
    line: "Design and video resolve into one living identity.",
    start: 12,
  },
] as const;

const TIMELAPSE_FRAMES = [
  {
    id: "01",
    stage: "SKETCH",
    figure: "02 ROUGH LAYERS",
    detail: "The grid starts in pencil. Every future collision already has an address.",
    src: `${GENERATED}/timelapse-photoshop/frame-01.webp`,
    alt: "A Photoshop-style workspace showing the first rough poster sketch",
  },
  {
    id: "02",
    stage: "BLOCK",
    figure: "06 SHAPE LAYERS",
    detail: "Cobalt sets the anchor. Orange cuts the first route through the page.",
    src: `${GENERATED}/timelapse-photoshop/frame-02.webp`,
    alt: "The poster sketch blocked into simple colored shapes",
  },
  {
    id: "03",
    stage: "COMPOSITE",
    figure: "11 MASKS",
    detail: "The subject drops in. Type becomes structure before it becomes a message.",
    src: `${GENERATED}/timelapse-photoshop/frame-03.webp`,
    alt: "A subject photograph and bold typography added to the poster",
  },
  {
    id: "04",
    stage: "ART DIRECT",
    figure: "14 ACTIVE LAYERS",
    detail: "Ribbons cross depth planes. One overlap decides what the eye reads first.",
    src: `${GENERATED}/timelapse-photoshop/frame-04.webp`,
    alt: "The poster refined with layered ribbons, texture and art direction",
  },
  {
    id: "05",
    stage: "RETOUCH",
    figure: "18 ADJUSTMENTS",
    detail: "A cobalt edge lift and three shadow passes make flat pieces feel touchable.",
    src: `${GENERATED}/timelapse-photoshop/frame-05.webp`,
    alt: "The poster in its detailed color and edge retouch stage",
  },
  {
    id: "06",
    stage: "FINAL",
    figure: "01 LIVING SYSTEM",
    detail: "The guides disappear. The rhythm stays—ready for posters, crops and motion.",
    src: `${GENERATED}/timelapse-photoshop/frame-06.webp`,
    alt: "The completed and fully retouched PLAY EDIT poster",
  },
] as const;

const PLAYGROUND_NOTES = [
  {
    n: "01",
    title: "BUILD THE RULE.",
    text: "A grid gives the idea somewhere solid to misbehave.",
  },
  {
    n: "02",
    title: "BEND THE RULE.",
    text: "Color controls the first glance. Timing earns the second.",
  },
  {
    n: "03",
    title: "MAKE IT MOVE.",
    text: "Twelve offset layers turn one poster into a small experience.",
  },
  {
    n: "04",
    title: "CUT THE FAT.",
    text: "Every frame either sharpens the rhythm or leaves the timeline.",
  },
] as const;

const PROCESS = [
  {
    id: "01",
    title: "Find the odd bit.",
    text: "The strongest idea is usually the detail everyone else tried to tidy away.",
  },
  {
    id: "02",
    title: "Give it rules.",
    text: "A flexible system survives a square post, a 9:16 reel and packaging without losing its accent.",
  },
  {
    id: "03",
    title: "Add timing.",
    text: "Motion starts with hierarchy: what arrives first, what interrupts, what gets the last frame.",
  },
  {
    id: "04",
    title: "Edit until it clicks.",
    text: "A cut two frames early can sell more energy than another hour of decoration.",
  },
] as const;

type ArchiveAsset = {
  id: string;
  src: string;
  category: string;
  originalName: string;
  type: "image" | "document";
};

function DepthCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 100);
    camera.position.set(0, 0, 9);

    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.6));

    const group = new THREE.Group();
    scene.add(group);

    const materials = [
      new THREE.MeshStandardMaterial({
        color: 0x2454ff,
        roughness: 0.42,
        metalness: 0.08,
      }),
      new THREE.MeshStandardMaterial({
        color: 0xff6a22,
        roughness: 0.7,
      }),
      new THREE.MeshStandardMaterial({
        color: 0xf6d83b,
        roughness: 0.76,
      }),
      new THREE.MeshStandardMaterial({
        color: 0xe6bdf4,
        roughness: 0.65,
      }),
    ];

    const torus = new THREE.Mesh(
      new THREE.TorusGeometry(1.15, 0.3, 24, 80),
      materials[0],
    );
    torus.position.set(2.3, 1.05, -0.5);
    torus.rotation.set(0.6, 0.2, -0.45);
    group.add(torus);

    const sphere = new THREE.Mesh(
      new THREE.SphereGeometry(0.58, 32, 32),
      materials[1],
    );
    sphere.position.set(-2.6, -1.25, 0.3);
    group.add(sphere);

    const box = new THREE.Mesh(
      new THREE.BoxGeometry(1.3, 1.3, 1.3),
      materials[2],
    );
    box.position.set(2.85, -1.7, -1);
    box.rotation.set(0.5, 0.65, 0.2);
    group.add(box);

    const cone = new THREE.Mesh(
      new THREE.ConeGeometry(0.72, 1.5, 5),
      materials[3],
    );
    cone.position.set(-2.55, 1.25, -0.6);
    cone.rotation.set(0.18, 0.45, -0.35);
    group.add(cone);

    const ambient = new THREE.AmbientLight(0xffffff, 0.92);
    const pointerLight = new THREE.DirectionalLight(0xffffff, 2.2);
    pointerLight.position.set(3, 3, 6);
    scene.add(ambient, pointerLight);

    let pointerX = 0;
    let pointerY = 0;

    const onPointerMove = (event: PointerEvent) => {
      pointerX = (event.clientX / window.innerWidth - 0.5) * 2;
      pointerY = (event.clientY / window.innerHeight - 0.5) * 2;
      pointerLight.position.set(pointerX * 5, -pointerY * 4, 6);
    };

    const resize = () => {
      const { width, height } = canvas.getBoundingClientRect();
      renderer.setSize(width, height, false);
      camera.aspect = width / Math.max(height, 1);
      camera.updateProjectionMatrix();
      renderer.render(scene, camera);
    };

    const render = () => {
      group.rotation.y = pointerX * 0.1;
      group.rotation.x = -pointerY * 0.07;
      torus.rotation.z = -0.45 + pointerX * 0.06;
      box.rotation.y = 0.65 - pointerX * 0.08;
      renderer.render(scene, camera);
    };

    const onFrame = () => render();
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(canvas);
    window.addEventListener("pointermove", onPointerMove);
    gsap.ticker.add(onFrame);
    resize();

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("pointermove", onPointerMove);
      gsap.ticker.remove(onFrame);
      group.traverse((object) => {
        if (object instanceof THREE.Mesh) object.geometry.dispose();
      });
      materials.forEach((material) => material.dispose());
      renderer.dispose();
    };
  }, []);

  return <canvas className="depth-canvas" ref={canvasRef} aria-hidden="true" />;
}

function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const [label, setLabel] = useState("");

  useEffect(() => {
    const cursor = cursorRef.current;
    const dot = dotRef.current;
    if (!cursor || !dot || window.matchMedia("(pointer: coarse)").matches) {
      return;
    }

    const cursorX = gsap.quickTo(cursor, "x", {
      duration: 0.22,
      ease: "power3.out",
    });
    const cursorY = gsap.quickTo(cursor, "y", {
      duration: 0.22,
      ease: "power3.out",
    });
    let activeTarget: HTMLElement | null = null;
    const dotX = gsap.quickTo(dot, "x", { duration: 0.08 });
    const dotY = gsap.quickTo(dot, "y", { duration: 0.08 });

    const onMove = (event: PointerEvent) => {
      cursorX(event.clientX);
      cursorY(event.clientY);
      dotX(event.clientX);
      dotY(event.clientY);
      const nextTarget =
        event.target instanceof Element
          ? event.target.closest<HTMLElement>("[data-cursor]")
          : null;
      if (nextTarget === activeTarget) return;
      activeTarget = nextTarget;
      if (activeTarget) {
        setLabel(activeTarget.dataset.cursor ?? "");
        cursor.classList.add("is-active");
      } else {
        setLabel("");
        cursor.classList.remove("is-active");
      }
    };

    window.addEventListener("pointermove", onMove);
    return () => {
      window.removeEventListener("pointermove", onMove);
    };
  }, []);

  return (
    <>
      <div className="custom-cursor" ref={cursorRef} aria-hidden="true">
        <span>{label}</span>
      </div>
      <div className="custom-cursor-dot" ref={dotRef} aria-hidden="true" />
    </>
  );
}

function ProjectCard({
  project,
}: {
  project: SiteConfig["work"]["projects"][number];
}) {
  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);
  const springX = useSpring(rotateX, { stiffness: 280, damping: 24 });
  const springY = useSpring(rotateY, { stiffness: 280, damping: 24 });

  const onMove = (event: ReactMouseEvent<HTMLElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    rotateY.set(x * 7);
    rotateX.set(y * -7);
  };

  const reset = () => {
    rotateX.set(0);
    rotateY.set(0);
  };

  return (
    <motion.article
      className="project-card"
      style={{
        rotateX: springX,
        rotateY: springY,
        transformPerspective: 1200,
        ["--card-accent" as string]: project.color,
        ["--project-start" as string]: project.columnStart,
        ["--project-span" as string]: project.columnSpan,
        ["--project-margin" as string]: `${project.marginTopRem}rem`,
        ["--card-aspect" as string]: project.aspectRatio,
      }}
      onMouseMove={onMove}
      onMouseLeave={reset}
      data-cursor="VIEW"
    >
      <div className="project-card__media">
        <img src={project.image} alt={project.alt} loading="lazy" />
        <span className="project-card__number">{project.id}</span>
        <span className="project-card__field">{project.field}</span>
      </div>
      <div className="project-card__copy">
        <div>
          <h3>{project.title}</h3>
          <p>{project.detail}</p>
        </div>
        <strong>{project.figure}</strong>
      </div>
    </motion.article>
  );
}

export default function Home() {
  const rootRef = useRef<HTMLElement>(null);
  const heroRef = useRef<HTMLElement>(null);
  const heroBackgroundRef = useRef<HTMLDivElement>(null);
  const heroForegroundRef = useRef<HTMLDivElement>(null);
  const heroTypeRef = useRef<HTMLHeadingElement>(null);
  const heroVisualRef = useRef<HTMLDivElement>(null);
  const playgroundRef = useRef<HTMLElement>(null);
  const playgroundStageRef = useRef<HTMLDivElement>(null);
  const showreelRef = useRef<HTMLElement>(null);
  const showreelStageRef = useRef<HTMLDivElement>(null);
  const reelFrameRef = useRef<HTMLDivElement>(null);
  const reelLineRef = useRef<HTMLDivElement>(null);
  const reelTopRef = useRef<HTMLDivElement>(null);
  const reelBottomRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const timelapseRef = useRef<HTMLElement>(null);
  const timelapseStageRef = useRef<HTMLDivElement>(null);
  const timelapseTimelineRef = useRef<gsap.core.Timeline | null>(null);
  const archiveRef = useRef<HTMLElement>(null);
  const archiveTrackRef = useRef<HTMLDivElement>(null);
  const [siteConfig, setSiteConfig] = useState<SiteConfig>(DEFAULT_SITE_CONFIG);
  const [activeCut, setActiveCut] = useState(0);
  const [activeTimelapseFrame, setActiveTimelapseFrame] = useState(0);
  const [archive, setArchive] = useState<ArchiveAsset[]>([]);
  const [selectedArchiveId, setSelectedArchiveId] = useState<string | null>(null);
  const archiveCloseRef = useRef<HTMLButtonElement>(null);

  const imageArchive = useMemo(
    () => {
      const source = siteConfig.archive.items.length
        ? siteConfig.archive.items
        : archive
            .filter((asset) => asset.type === "image")
            .map((asset) => ({
              id: asset.id,
              visible: true,
              label: asset.id,
              category: asset.category,
              src: asset.src,
            }));
      return source
        .filter((asset) => asset.visible && asset.src)
        .slice(0, Math.max(0, siteConfig.archive.visibleItems));
    },
    [archive, siteConfig.archive.items, siteConfig.archive.visibleItems],
  );
  const selectedArchiveIndex = selectedArchiveId
    ? imageArchive.findIndex((asset) => asset.id === selectedArchiveId)
    : -1;
  const selectedArchive =
    selectedArchiveIndex >= 0 ? imageArchive[selectedArchiveIndex] : null;
  const projects = useMemo(
    () => siteConfig.work.projects.filter((project) => project.visible),
    [siteConfig.work.projects],
  );
  const reelCuts = useMemo(
    () => siteConfig.showreel.cuts.filter((cut) => cut.visible),
    [siteConfig.showreel.cuts],
  );
  const timelapseFrames = useMemo(
    () => siteConfig.timelapse.frames.filter((frame) => frame.visible),
    [siteConfig.timelapse.frames],
  );
  const playgroundNotes = useMemo(
    () => siteConfig.playground.notes.filter((note) => note.visible),
    [siteConfig.playground.notes],
  );

  const rootStyle = {
    "--cream": siteConfig.theme.cream,
    "--paper": siteConfig.theme.paper,
    "--ink": siteConfig.theme.ink,
    "--blue": siteConfig.theme.blue,
    "--yellow": siteConfig.theme.yellow,
    "--orange": siteConfig.theme.orange,
    "--pink": siteConfig.theme.pink,
    "--mint": siteConfig.theme.mint,
    "--lilac": siteConfig.theme.lilac,
    "--page-pad": `${siteConfig.theme.pagePaddingPx}px`,
    "--radius": `${siteConfig.theme.cornerRadiusPx}px`,
    "--figure-card-min-height": `${siteConfig.figures.cardMinHeightPx}px`,
    "--playground-card-width": `${siteConfig.playground.cardWidthVw}vw`,
    "--reel-frame-height": `${siteConfig.showreel.frameHeightVh}vh`,
    "--timelapse-aspect": siteConfig.timelapse.frameAspectRatio,
    "--work-gap": `${siteConfig.work.gapPx}px`,
    "--archive-tile-width": `${siteConfig.archive.tileWidthVw}vw`,
    "--archive-track-height": `${siteConfig.archive.trackHeightVh}vh`,
    "--hero-min-height": `${siteConfig.hero.minHeightVh}vh`,
    "--hero-visual-width": `${siteConfig.hero.visualWidthVw}vw`,
  } as CSSProperties;

  const sectionStyle = (section: SectionSettings) =>
    ({ order: section.order } as CSSProperties);

  useEffect(() => {
    let cancelled = false;
    const draft =
      new URLSearchParams(window.location.search).get("site_preview") ===
      "draft";
    fetch(`/api/site-config${draft ? "?mode=draft" : ""}`, {
      cache: "no-store",
    })
      .then((response) => {
        if (!response.ok) throw new Error("Could not load site controls");
        return response.json();
      })
      .then((data: { config?: unknown }) => {
        if (!cancelled) setSiteConfig(mergeSiteConfig(data.config));
      })
      .catch(() => {
        if (!cancelled) setSiteConfig(DEFAULT_SITE_CONFIG);
      });

    fetch("/media/designs/manifest.json")
      .then((response) => response.json())
      .then((data: ArchiveAsset[]) => {
        if (!cancelled) setArchive(data);
      })
      .catch(() => {
        if (!cancelled) setArchive([]);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    document.title = siteConfig.identity.browserTitle;
    setActiveCut(0);
    setActiveTimelapseFrame(0);
  }, [
    siteConfig.identity.browserTitle,
    siteConfig.showreel.cuts,
    siteConfig.timelapse.frames,
  ]);

  useLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const root = rootRef.current;
    if (!root) return;

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    let lenis: Lenis | null = null;
    let lenisRaf: ((time: number) => void) | null = null;

    const priorOverflow = document.documentElement.style.overflow;
    if (!siteConfig.scroll.enabled) {
      document.documentElement.style.overflow = "hidden";
    }

    if (
      siteConfig.scroll.enabled &&
      siteConfig.scroll.smooth &&
      !reducedMotion
    ) {
      lenis = new Lenis({
        duration: siteConfig.scroll.duration,
        smoothWheel: true,
        wheelMultiplier: siteConfig.scroll.wheelMultiplier,
        touchMultiplier: siteConfig.scroll.touchMultiplier,
      });
      lenis.on("scroll", ScrollTrigger.update);
      lenisRaf = (time: number) => lenis?.raf(time * 1000);
      gsap.ticker.add(lenisRaf);
      gsap.ticker.lagSmoothing(0);
    }

    const ctx = gsap.context(() => {
      gsap.set(".hero-kicker, .hero-word, .hero-deck, .hero-meta", {
        yPercent: 115,
        opacity: 0,
      });
      gsap
        .timeline({ defaults: { ease: "back.out(1.45)" } })
        .to(".hero-kicker", { yPercent: 0, opacity: 1, duration: 0.42 })
        .to(
          ".hero-word",
          {
            yPercent: 0,
            opacity: 1,
            duration: 0.54,
            stagger: 0.055,
          },
          "-=0.22",
        )
        .to(
          ".hero-deck, .hero-meta",
          { yPercent: 0, opacity: 1, duration: 0.4, stagger: 0.06 },
          "-=0.22",
        )
        .fromTo(
          ".hero-visual",
          { clipPath: "inset(50% 50% 50% 50% round 2.2rem)" },
          {
            clipPath: "inset(0% 0% 0% 0% round 2.2rem)",
            duration: 0.55,
            ease: "power3.out",
          },
          "-=0.48",
        )
        .fromTo(
          ".hero-cutout",
          { scale: 0.45, rotate: -18, opacity: 0 },
          {
            scale: 1,
            rotate: -6,
            opacity: 1,
            duration: 0.45,
            ease: "back.out(1.7)",
          },
          "-=0.2",
        );

      gsap.utils.toArray<HTMLElement>(".reveal").forEach((element) => {
        gsap.fromTo(
          element,
          { y: siteConfig.scroll.revealDistancePx, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: siteConfig.scroll.revealDuration,
            ease: "power3.out",
            scrollTrigger: {
              trigger: element,
              start: "top 87%",
              once: true,
            },
          },
        );
      });

      gsap.utils.toArray<HTMLElement>("[data-count]").forEach((element) => {
        const target = Number(element.dataset.count ?? 0);
        const state = { value: 0 };
        gsap.to(state, {
          value: target,
          duration: 0.85,
          ease: "power3.out",
          scrollTrigger: {
            trigger: element,
            start: "top 88%",
            once: true,
          },
          onUpdate: () => {
            element.textContent = String(Math.round(state.value)).padStart(
              2,
              "0",
            );
          },
        });
      });

      if (
        playgroundRef.current &&
        playgroundStageRef.current &&
        !reducedMotion
      ) {
        const notes = gsap.utils.toArray<HTMLElement>(".playground-note");
        const playgroundTimeline = gsap.timeline({
          scrollTrigger: {
            trigger: playgroundRef.current,
            start: "top top",
            end: `+=${siteConfig.playground.pinDistancePercent}%`,
            pin: playgroundStageRef.current,
            scrub: 0.48,
            anticipatePin: 1,
          },
        });
        gsap.set(notes, {
          autoAlpha: 0,
          y: 96,
          yPercent: -50,
          scale: 0.92,
        });
        playgroundTimeline
          .fromTo(
            ".playground-image",
            { scale: 0.84, rotate: -1.8 },
            { scale: 1, rotate: 0, duration: 0.3, ease: "power3.out" },
          )
          .fromTo(
            ".playground-sweep",
            { xPercent: -110 },
            { xPercent: 110, duration: 0.32, ease: "none" },
            0.02,
          );
        notes.forEach((note, index) => {
          const position =
            0.15 + index * Math.max(0.12, siteConfig.playground.cardHold);
          playgroundTimeline.fromTo(
            note,
            {
              y: 96,
              yPercent: -50,
              autoAlpha: 0,
              scale: 0.92,
              zIndex: index + 10,
            },
            {
              y: 0,
              autoAlpha: 1,
              scale: 1,
              duration: 0.13,
              ease: "power3.out",
            },
            position,
          );
          if (index < notes.length - 1) {
            playgroundTimeline.to(
              note,
              {
                y: -90,
                autoAlpha: 0,
                scale: 0.96,
                duration: 0.11,
                ease: "power2.in",
              },
              position + 0.22,
            );
          } else {
            playgroundTimeline.to({}, { duration: 0.3 }, position + 0.13);
          }
        });
      }

      if (
        showreelRef.current &&
        showreelStageRef.current &&
        reelFrameRef.current
      ) {
        const reelTimeline = gsap.timeline({
          scrollTrigger: {
            trigger: showreelRef.current,
            start: "top top",
            end: `+=${siteConfig.showreel.pinDistancePercent}%`,
            pin: showreelStageRef.current,
            scrub: reducedMotion ? false : 0.2,
            anticipatePin: 1,
            onEnter: () => void videoRef.current?.play().catch(() => undefined),
            onEnterBack: () =>
              void videoRef.current?.play().catch(() => undefined),
          },
        });

        reelTimeline
          .set(reelFrameRef.current, { scale: 0.43 })
          .set(reelLineRef.current, { scaleX: 0.32 })
          .to(
            reelFrameRef.current,
            {
              scale: 0.43,
              duration: 0.11,
            },
            0,
          )
          .to(
            reelFrameRef.current,
            {
              scale: 1,
              duration: 0.11,
              ease: "back.out(1.15)",
            },
            0.11,
          )
          .to(
            reelLineRef.current,
            {
              scaleX: 1,
              duration: 0.1,
              ease: "power4.out",
            },
            0.11,
          )
          .to(
            reelTopRef.current,
            { y: "-7.5vh", duration: 0.11, ease: "power4.out" },
            0.11,
          )
          .to(
            reelBottomRef.current,
            { y: "7.5vh", duration: 0.11, ease: "power4.out" },
            0.11,
          )
          .to(".reel-backdrop-copy", { yPercent: -22, duration: 0.5 }, 0)
          .to({}, { duration: 0.74 });
      }

      if (timelapseRef.current && timelapseStageRef.current) {
        const frameHold = Math.max(
          0.2,
          siteConfig.timelapse.frameHoldSeconds,
        );
        const timelapseTimeline = gsap.timeline({
          paused: true,
          repeat: siteConfig.timelapse.autoReplay ? -1 : 0,
          repeatDelay: siteConfig.timelapse.repeatDelaySeconds,
          onRepeat: () => setActiveTimelapseFrame(0),
        });
        timelapseFrames.slice(1).forEach((_, index) => {
          timelapseTimeline.call(
            () => setActiveTimelapseFrame(index + 1),
            [],
            (index + 1) * frameHold,
          );
        });
        timelapseTimeline.to(
          {},
          { duration: frameHold },
          Math.max(0, timelapseFrames.length - 1) * frameHold,
        );
        timelapseTimelineRef.current = timelapseTimeline;

        if (reducedMotion) {
          ScrollTrigger.create({
            trigger: timelapseRef.current,
            start: "top 72%",
            once: true,
            onEnter: () =>
              setActiveTimelapseFrame(
                Math.max(0, timelapseFrames.length - 1),
              ),
          });
        } else {
          const startTimelapse = () => {
            setActiveTimelapseFrame(0);
            timelapseTimeline.restart();
          };
          ScrollTrigger.create({
            trigger: timelapseStageRef.current,
            start: "top 8%",
            endTrigger: timelapseRef.current,
            end: "bottom bottom",
            onEnter: startTimelapse,
            onEnterBack: startTimelapse,
            onLeave: () => timelapseTimeline.pause(),
            onLeaveBack: () => timelapseTimeline.pause(),
          });
        }
      }

      gsap.utils.toArray<HTMLElement>(".process-card").forEach((card, index) => {
        gsap.fromTo(
          card,
          { x: index % 2 === 0 ? -56 : 56, opacity: 0 },
          {
            x: 0,
            opacity: 1,
            duration: 0.52,
            ease: "back.out(1.2)",
            scrollTrigger: {
              trigger: card,
              start: "top 86%",
              once: true,
            },
          },
        );
      });

      if (
        heroRef.current &&
        heroBackgroundRef.current &&
        heroForegroundRef.current &&
        siteConfig.hero.parallaxEnabled &&
        !reducedMotion
      ) {
        gsap.fromTo(
          heroBackgroundRef.current,
          { yPercent: -7 },
          {
            yPercent: siteConfig.hero.backgroundParallaxPercent,
            ease: "none",
            scrollTrigger: {
              trigger: heroRef.current,
              start: "top top",
              end: "bottom top",
              scrub: 0.35,
            },
          },
        );
        gsap.to(heroForegroundRef.current, {
          yPercent: siteConfig.hero.foregroundParallaxPercent,
          ease: "none",
          scrollTrigger: {
            trigger: heroRef.current,
            start: "top top",
            end: "bottom top",
            scrub: 0.35,
          },
        });
      }
    }, root);

    const hero = heroRef.current;
    const heroType = heroTypeRef.current;
    const heroVisual = heroVisualRef.current;
    let removeHeroPointer: (() => void) | undefined;

    if (hero && heroType && heroVisual && !reducedMotion) {
      const typeX = gsap.quickTo(heroType, "x", {
        duration: 0.4,
        ease: "power3.out",
      });
      const typeY = gsap.quickTo(heroType, "y", {
        duration: 0.4,
        ease: "power3.out",
      });
      const visualX = gsap.quickTo(heroVisual, "x", {
        duration: 0.45,
        ease: "power3.out",
      });
      const visualY = gsap.quickTo(heroVisual, "y", {
        duration: 0.45,
        ease: "power3.out",
      });
      const onPointerMove = (event: PointerEvent) => {
        const rect = hero.getBoundingClientRect();
        const x = (event.clientX - rect.left) / rect.width - 0.5;
        const y = (event.clientY - rect.top) / rect.height - 0.5;
        typeX(x * -siteConfig.hero.pointerTypeStrength);
        typeY(y * -siteConfig.hero.pointerTypeStrength * 0.625);
        visualX(x * siteConfig.hero.pointerImageStrength);
        visualY(y * siteConfig.hero.pointerImageStrength * 0.73);
        hero.style.setProperty("--light-x", `${event.clientX}px`);
        hero.style.setProperty("--light-y", `${event.clientY}px`);
      };
      hero.addEventListener("pointermove", onPointerMove);
      removeHeroPointer = () =>
        hero.removeEventListener("pointermove", onPointerMove);
    }

    ScrollTrigger.refresh();
    return () => {
      removeHeroPointer?.();
      ctx.revert();
      timelapseTimelineRef.current = null;
      if (lenisRaf) gsap.ticker.remove(lenisRaf);
      lenis?.destroy();
      document.documentElement.style.overflow = priorOverflow;
    };
  }, [siteConfig, timelapseFrames]);

  useLayoutEffect(() => {
    const archiveSection = archiveRef.current;
    const track = archiveTrackRef.current;
    if (!archiveSection || !track || imageArchive.length === 0) return;

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (reducedMotion) return;

    const distance = () =>
      Math.max(0, track.scrollWidth - window.innerWidth + 64);
    let archiveRaf = 0;
    const updateArchive = () => {
      const rect = archiveSection.getBoundingClientRect();
      const scrollableDistance = Math.max(
        1,
        archiveSection.offsetHeight - window.innerHeight,
      );
      const progress = gsap.utils.clamp(
        0,
        1,
        -rect.top / scrollableDistance,
      );
      gsap.set(track, { x: -distance() * progress });
    };
    const scheduleArchiveUpdate = () => {
      cancelAnimationFrame(archiveRaf);
      archiveRaf = requestAnimationFrame(updateArchive);
    };

    gsap.set(track, { x: 0 });
    updateArchive();
    window.addEventListener("scroll", scheduleArchiveUpdate, {
      passive: true,
    });
    window.addEventListener("resize", scheduleArchiveUpdate);

    return () => {
      cancelAnimationFrame(archiveRaf);
      window.removeEventListener("scroll", scheduleArchiveUpdate);
      window.removeEventListener("resize", scheduleArchiveUpdate);
      gsap.set(track, { x: 0 });
    };
  }, [imageArchive.length, siteConfig.archive.scrollDistanceFactor]);

  const onVideoTimeUpdate = () => {
    const time = videoRef.current?.currentTime ?? 0;
    let next = 0;
    for (let index = 0; index < reelCuts.length; index += 1) {
      if (time >= reelCuts[index].start) next = index;
    }
    setActiveCut((current) => (current === next ? current : next));
  };

  const replayTimelapse = () => {
    setActiveTimelapseFrame(0);
    timelapseTimelineRef.current?.restart();
  };

  const stepArchive = (direction: number) => {
    if (imageArchive.length === 0) return;
    setSelectedArchiveId((current) => {
      const currentIndex = imageArchive.findIndex((asset) => asset.id === current);
      const nextIndex =
        (Math.max(currentIndex, 0) + direction + imageArchive.length) %
        imageArchive.length;
      return imageArchive[nextIndex].id;
    });
  };

  useEffect(() => {
    if (!selectedArchive) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const focusFrame = requestAnimationFrame(() => archiveCloseRef.current?.focus());
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setSelectedArchiveId(null);
      if (event.key === "ArrowRight") stepArchive(1);
      if (event.key === "ArrowLeft") stepArchive(-1);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      cancelAnimationFrame(focusFrame);
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [selectedArchiveId, selectedArchive, imageArchive]);

  const brandParts = siteConfig.identity.brand.split("/");
  const activeReelCut = reelCuts[activeCut] ?? reelCuts[0];
  const activeFrame =
    timelapseFrames[activeTimelapseFrame] ?? timelapseFrames[0];

  return (
    <main className="site-main" ref={rootRef} style={rootStyle}>
      <CustomCursor />

      {siteConfig.navigation.visible && (
        <nav className="site-nav" aria-label="Primary navigation">
          <a className="site-mark" href="#top" data-cursor="TOP">
            {brandParts[0]}
            {brandParts.length > 1 && (
              <>
                <span>/</span>
                {brandParts.slice(1).join("/")}
              </>
            )}
          </a>
          <div className="site-nav__links">
            {siteConfig.navigation.links
              .filter((link) => link.visible)
              .map((link) => (
                <motion.a
                  whileHover={{ y: -3 }}
                  href={link.href}
                  data-cursor={link.label.toUpperCase()}
                  key={link.id}
                >
                  {link.label}
                </motion.a>
              ))}
          </div>
          <span className="site-nav__status">
            <i />
            {siteConfig.identity.status}
          </span>
        </nav>
      )}

      {siteConfig.hero.visible && (
      <section
        className="hero"
        id="top"
        ref={heroRef}
        style={sectionStyle(siteConfig.hero)}
      >
        <div
          className="hero-parallax-background"
          ref={heroBackgroundRef}
          aria-hidden="true"
        >
          <DepthCanvas />
          <div className="hero-grid" />
        </div>
        <div className="hero-foreground" ref={heroForegroundRef}>
          <div className="hero-copy" ref={heroTypeRef}>
            <div className="hero-overflow">
              <p className="hero-kicker">{siteConfig.hero.kicker}</p>
            </div>
            <h1 aria-label={siteConfig.hero.words.join(", ")}>
              <span className="hero-line hero-line--one">
                <span className="hero-word">{siteConfig.hero.words[0]}</span>
                <span className="hero-slash">/</span>
              </span>
              <span className="hero-line hero-line--two">
                <span className="hero-word">{siteConfig.hero.words[1]}</span>
              </span>
              <span className="hero-line hero-line--three">
                <span className="hero-word">{siteConfig.hero.words[2]}</span>
              </span>
            </h1>
            <div className="hero-overflow hero-overflow--deck">
              <p className="hero-deck">{siteConfig.hero.deck}</p>
            </div>
            <div className="hero-overflow">
              <div className="hero-meta">
                <span>{siteConfig.hero.location}</span>
                <span>{siteConfig.hero.scrollPrompt}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="hero-visual-wrap" ref={heroVisualRef}>
          <div className="hero-visual">
            <img
              src={siteConfig.hero.image}
              alt={siteConfig.hero.imageAlt}
              fetchPriority="high"
            />
            <div className="hero-visual__label">
              <span>{siteConfig.hero.imageLabel}</span>
              <strong>{siteConfig.hero.imageStatement}</strong>
            </div>
          </div>
          <img
            className="hero-cutout"
            src={siteConfig.hero.cutoutImage}
            alt=""
            aria-hidden="true"
          />
        </div>
        <div className="hero-sticker" aria-hidden="true">
          {siteConfig.hero.stickers.map((sticker) => (
            <span key={sticker}>{sticker}</span>
          ))}
        </div>
      </section>
      )}

      {siteConfig.figures.visible && (
      <section
        className="figures"
        aria-label="Selected figures"
        style={sectionStyle(siteConfig.figures)}
      >
        <div className="section-label">
          <span>{siteConfig.figures.leftLabel}</span>
          <span>{siteConfig.figures.rightLabel}</span>
        </div>
        <div className="figures-grid">
          {siteConfig.figures.cards
            .filter((card) => card.visible)
            .map((card) => (
              <article
                className={`figure-card figure-card--${card.color} reveal`}
                key={card.id}
              >
                <strong data-count={card.value}>00</strong>
                <span>{card.label}</span>
                <p>{card.description}</p>
              </article>
            ))}
        </div>
      </section>
      )}

      {siteConfig.playground.visible && (
      <section
        className="playground"
        ref={playgroundRef}
        aria-labelledby="playground-title"
        style={sectionStyle(siteConfig.playground)}
      >
        <div className="playground-stage" ref={playgroundStageRef}>
          <div className="playground-heading">
            <span>{siteConfig.playground.eyebrow}</span>
            <h2 id="playground-title">{siteConfig.playground.title}</h2>
          </div>
          <div className="playground-image">
            <img
              src={siteConfig.playground.image}
              alt={siteConfig.playground.imageAlt}
            />
            <div className="playground-sweep" aria-hidden="true" />
            <div className="playground-coordinates">
              <span>X 1440</span>
              <span>Y 0920</span>
            </div>
          </div>
          <div className="playground-notes">
            {playgroundNotes.map((note) => (
              <article className="playground-note" key={note.id}>
                <span>
                  {note.id} / {playgroundNotes.length.toString().padStart(2, "0")}
                </span>
                <h3>{note.title}</h3>
                <p>{note.text}</p>
              </article>
            ))}
          </div>
          <img
            className="playground-paper"
            src={siteConfig.playground.cutoutImage}
            alt=""
            aria-hidden="true"
          />
        </div>
      </section>
      )}

      {siteConfig.showreel.visible && (
      <section
        className="showreel"
        id="reel"
        ref={showreelRef}
        aria-labelledby="reel-title"
        style={sectionStyle(siteConfig.showreel)}
      >
        <div className="showreel-stage" ref={showreelStageRef}>
          <div className="reel-backdrop-copy" aria-hidden="true">
            {siteConfig.showreel.backdropText}
          </div>
          <div className="reel-head reel-head--top" ref={reelTopRef}>
            <span>{siteConfig.showreel.topEyebrow}</span>
            <h2 id="reel-title">{siteConfig.showreel.topTitle}</h2>
          </div>
          <div className="reel-frame" ref={reelFrameRef}>
            <video
              ref={videoRef}
              src={siteConfig.showreel.video}
              muted
              autoPlay
              loop
              playsInline
              preload="auto"
              onTimeUpdate={onVideoTimeUpdate}
              aria-label="Animated showreel"
            />
            <div className="reel-frame__wash" aria-hidden="true" />
            {activeReelCut && (
            <div className="reel-data" key={activeReelCut.id}>
              <div className="reel-data__top">
                <span>
                  {activeReelCut.id} /{" "}
                  {reelCuts.length.toString().padStart(2, "0")}
                </span>
                <strong>{activeReelCut.label}</strong>
              </div>
              <div className="reel-data__figure">
                {activeReelCut.figure}
              </div>
              <p>{activeReelCut.line}</p>
            </div>
            )}
            <div className="reel-live">
              <i />
              {siteConfig.showreel.liveLabel}
            </div>
          </div>
          <div className="reel-accent-line" ref={reelLineRef} />
          <div className="reel-head reel-head--bottom" ref={reelBottomRef}>
            <h2>{siteConfig.showreel.bottomTitle}</h2>
            <span>{siteConfig.showreel.durationLabel}</span>
          </div>
        </div>
      </section>
      )}

      {siteConfig.timelapse.visible && (
      <section
        className="timelapse"
        ref={timelapseRef}
        aria-labelledby="timelapse-title"
        style={sectionStyle(siteConfig.timelapse)}
      >
        <div className="timelapse-intro reveal">
          <div className="section-label">
            <span>{siteConfig.timelapse.leftLabel}</span>
            <span>{siteConfig.timelapse.rightLabel}</span>
          </div>
          <h2 id="timelapse-title">
            {siteConfig.timelapse.headline}
            <br />
            <em>{siteConfig.timelapse.accentHeadline}</em>
          </h2>
          <p>{siteConfig.timelapse.description}</p>
        </div>

        <div
          className="timelapse-hold"
          style={{
            ["--timelapse-hold-vh" as string]: Math.max(180, siteConfig.timelapse.pinDistancePercent),
          } as CSSProperties}
        >
          <div className="timelapse-stage" ref={timelapseStageRef}>
          <div className="timelapse-frame" data-cursor="WATCH">
            {timelapseFrames.map((frame, index) => (
              <motion.img
                className="timelapse-frame__image"
                src={frame.src}
                alt={frame.alt}
                key={frame.id}
                animate={
                  index === activeTimelapseFrame
                    ? {
                        opacity: 1,
                        clipPath: "inset(0% 0% 0% 0%)",
                      }
                    : {
                        opacity: 0,
                        clipPath: "inset(0% 100% 0% 0%)",
                      }
                }
                transition={{
                  duration: 0.16,
                  ease: [0.22, 1, 0.36, 1],
                }}
                style={{ zIndex: index === activeTimelapseFrame ? 2 : 1 }}
              />
            ))}
            <div className="timelapse-scan" aria-hidden="true" />

            {activeFrame && (
            <div
              className="timelapse-data"
              key={activeFrame.id}
              aria-live="polite"
            >
              <div className="timelapse-data__top">
                <span>
                  {activeFrame.id} /{" "}
                  {timelapseFrames.length.toString().padStart(2, "0")}
                </span>
                <strong>{activeFrame.stage}</strong>
              </div>
              <div className="timelapse-data__figure">
                {activeFrame.figure}
              </div>
              <p>{activeFrame.detail}</p>
            </div>
            )}

            <button
              className="timelapse-replay"
              type="button"
              onClick={replayTimelapse}
              data-cursor="AGAIN"
              aria-label="Replay the Photoshop build timelapse"
            >
              REPLAY <span>↻</span>
            </button>
          </div>

          <ol className="timelapse-rail" aria-label="Photoshop build stages">
            {timelapseFrames.map((frame, index) => (
              <li
                className={
                  index === activeTimelapseFrame ? "is-active" : undefined
                }
                key={frame.id}
                aria-current={
                  index === activeTimelapseFrame ? "step" : undefined
                }
              >
                <span>{frame.id}</span>
                <strong>{frame.stage}</strong>
                <i aria-hidden="true" />
              </li>
            ))}
          </ol>
        </div>
        </div>
      </section>
      )}

      {siteConfig.work.visible && (
      <section
        className="work"
        id="work"
        aria-labelledby="work-title"
        style={sectionStyle(siteConfig.work)}
      >
        <div className="work-intro reveal">
          <div className="section-label">
            <span>{siteConfig.work.leftLabel}</span>
            <span>{siteConfig.work.rightLabel}</span>
          </div>
          <h2 id="work-title">
            {siteConfig.work.headline}
            <br />
            <em>{siteConfig.work.accentHeadline}</em>
          </h2>
          <p>{siteConfig.work.description}</p>
        </div>
        <div className="projects-grid">
          {projects.map((project) => (
            <ProjectCard project={project} key={project.id} />
          ))}
        </div>
      </section>
      )}

      {siteConfig.archive.visible && (
      <section
        className="archive"
        ref={archiveRef}
        aria-labelledby="archive-title"
        style={{
          ...sectionStyle(siteConfig.archive),
          ["--archive-scroll-vw" as string]: `${Math.max(
            160,
            Math.ceil(imageArchive.length / 3) *
              (siteConfig.archive.tileWidthVw + 0.8) *
              siteConfig.archive.scrollDistanceFactor,
          )}vw`,
        } as CSSProperties}
      >
        <div className="archive-stage">
        <div className="archive-head">
          <div>
            <span>{siteConfig.archive.eyebrow}</span>
            <h2 id="archive-title">{siteConfig.archive.title}</h2>
          </div>
          <p>{siteConfig.archive.description}</p>
        </div>
        {imageArchive.length > 0 && (
          <div className="archive-track" ref={archiveTrackRef}>
            {imageArchive.map((asset, index) => (
              <button
                type="button"
                className={`archive-tile archive-tile--${index % 5}`}
                key={asset.id}
                onClick={() => setSelectedArchiveId(asset.id)}
                aria-label={`Open ${asset.label} in full view`}
                data-cursor="OPEN"
              >
                <img
                  src={asset.src}
                  alt={`${asset.label}, ${asset.category.replace(/^\d+\s*-\s*/, "")}`}
                  loading="lazy"
                />
                <span className="archive-tile__open" aria-hidden="true">OPEN ↗</span>
                <span className="archive-tile__caption">
                  <span>{asset.label.toUpperCase()}</span>
                  <span>{asset.category.replace(/^\d+\s*-\s*/, "")}</span>
                </span>
              </button>
            ))}
          </div>
        )}
        <div className="archive-counter" aria-hidden="true">
          INDEX / {String(imageArchive.length).padStart(3, "0")}
        </div>
        </div>
      </section>
      )}

      <AnimatePresence>
        {selectedArchive && (
          <motion.div
            className="archive-lightbox"
            role="dialog"
            aria-modal="true"
            aria-label={`${selectedArchive.label} full image`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.16 }}
            onMouseDown={(event) => {
              if (event.target === event.currentTarget) setSelectedArchiveId(null);
            }}
          >
            <div className="archive-lightbox__bar">
              <span>
                131 VISUALS / {String(selectedArchiveIndex + 1).padStart(3, "0")}
              </span>
              <strong>{selectedArchive.category.replace(/^\d+\s*-\s*/, "")}</strong>
              <button
                ref={archiveCloseRef}
                type="button"
                onClick={() => setSelectedArchiveId(null)}
                data-cursor="CLOSE"
                aria-label="Close full image"
              >
                CLOSE ×
              </button>
            </div>
            <motion.div
              className="archive-lightbox__art"
              key={selectedArchive.id}
              initial={{ y: 28, scale: 0.94, rotate: -0.6 }}
              animate={{ y: 0, scale: 1, rotate: 0 }}
              exit={{ y: -20, scale: 0.96 }}
              transition={{ duration: 0.24, ease: [0.2, 0.8, 0.2, 1] }}
            >
              <img
                src={selectedArchive.src}
                alt={`${selectedArchive.label}, ${selectedArchive.category.replace(/^\d+\s*-\s*/, "")}`}
              />
            </motion.div>
            <div className="archive-lightbox__footer">
              <div>
                <span>SELECTED DESIGN</span>
                <strong>{selectedArchive.label}</strong>
              </div>
              <div className="archive-lightbox__nav">
                <button
                  type="button"
                  onClick={() => stepArchive(-1)}
                  data-cursor="PREV"
                  aria-label="Previous design"
                >
                  ← PREV
                </button>
                <button
                  type="button"
                  onClick={() => stepArchive(1)}
                  data-cursor="NEXT"
                  aria-label="Next design"
                >
                  NEXT →
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {siteConfig.system.visible && (
      <section
        className="system"
        aria-labelledby="system-title"
        style={sectionStyle(siteConfig.system)}
      >
        <div className="section-label">
          <span>{siteConfig.system.leftLabel}</span>
          <span>{siteConfig.system.rightLabel}</span>
        </div>
        <div className="system-title reveal">
          <h2 id="system-title">{siteConfig.system.headline}</h2>
          <p>{siteConfig.system.description}</p>
        </div>

        <div className="closeups">
          {siteConfig.system.closeups
            .filter((closeup) => closeup.visible)
            .map((closeup) => (
              <figure
                className="closeup reveal"
                style={{ marginTop: `${closeup.marginTopRem}rem` }}
                key={closeup.id}
              >
                <img
                  src={closeup.image}
                  alt={closeup.alt}
                  loading="lazy"
                />
                <figcaption>
                  <span>{closeup.label}</span>
                  <strong>{closeup.caption}</strong>
                </figcaption>
              </figure>
            ))}
        </div>

        <div className="process-grid">
          {siteConfig.system.process
            .filter((step) => step.visible)
            .map((step, _index, steps) => (
            <article
              className="process-card"
              style={{ background: step.color }}
              key={step.id}
            >
              <span>
                {step.id} / {steps.length.toString().padStart(2, "0")}
              </span>
              <h3>{step.title}</h3>
              <p>{step.text}</p>
            </article>
          ))}
        </div>

        <div className="swatch-strip" aria-label="Visual system color palette">
          <span style={{ background: "var(--cream)" }}>CREAM</span>
          <span style={{ background: "var(--blue)" }}>COBALT</span>
          <span style={{ background: "var(--yellow)" }}>SUN</span>
          <span style={{ background: "var(--orange)" }}>TANGERINE</span>
          <span style={{ background: "var(--pink)" }}>HOT PINK</span>
          <span style={{ background: "var(--mint)" }}>MINT</span>
          <span style={{ background: "var(--lilac)" }}>LILAC</span>
        </div>
      </section>
      )}

      {siteConfig.footer.visible && (
      <footer
        className="footer"
        id="hello"
        style={sectionStyle(siteConfig.footer)}
      >
        <div className="footer-kicker">
          <span>{siteConfig.footer.availability}</span>
          <span>{siteConfig.footer.location}</span>
        </div>
        <div className="footer-title">
          <h2>
            {siteConfig.footer.headline}
            <br />
            <em>{siteConfig.footer.accentHeadline}</em>
          </h2>
          <img
            src={siteConfig.footer.cutoutImage}
            alt=""
            aria-hidden="true"
          />
        </div>
        <motion.a
          className="footer-cta"
          href={`mailto:${siteConfig.identity.email}?subject=${encodeURIComponent(
            siteConfig.footer.subject,
          )}`}
          whileHover={{ scale: 1.02, rotate: -1 }}
          whileTap={{ scale: 0.97 }}
          data-cursor="WRITE"
        >
          <span>{siteConfig.footer.cta}</span>
          <strong>↗</strong>
        </motion.a>
        <div className="footer-bottom">
          <span>{siteConfig.footer.copyright}</span>
          <span>{siteConfig.footer.signoff}</span>
          <a href="#top">BACK TO TOP ↑</a>
        </div>
      </footer>
      )}
    </main>
  );
}
