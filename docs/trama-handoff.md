# TRAMA implementation handoff

Date: 2026-09-21
Repository: AhmedTalaat, feature/eu-visual.
Local review: http://127.0.0.1:3108/eu-visual?project=trama
Slug and stable project ID: `trama`.

## Result

TRAMA is the second entry in the existing EU Visual project collection, sort order 20 after North Pier (10). It uses the same Next.js App Router route, project API, dynamic full-screen viewer, URL state, focus trap, scroll lock and dashboard. No new route or parallel presentation system.

Viewer order: hero → overview → compact visual system → Four Moods → Main Social Campaign → full 10-post feed → Motion Stories → closing. No place/products sheets, AI-process section, packaging or menu sections are rendered. The concept is explicitly labelled fictional, not commissioned client work.

The portfolio landing keeps its existing cream/cobalt identity and hover animation. TRAMA's cream/burgundy/ink palette is scoped to the shared viewer. Website typography stays the same; Bebas Neue and Poppins are used only for the compact artwork-type specimens, without changing any artwork.

## Validated source map

Source: `D:\Recovery\Work\EU\TRAMA`.
Destination: `public/media/eu-visual/trama/`, preserving the three named source subfolders and filenames.

| Group | Feed / story order | Filename within TRAMA | Dimensions |
| --- | --- | --- | --- |
| Four Moods | 1 | 01-FOUR-MOODS/01-TWIRL-Spaghetti-Pomodoro.jpg | 1792 × 2400 |
| Four Moods | 2 | 01-FOUR-MOODS/02-ZESTY-Lemon-Butter.jpg | 1792 × 2400 |
| Four Moods | 3 | 01-FOUR-MOODS/03-FRESH-Pesto.jpg | 1792 × 2400 |
| Four Moods | 4 | 01-FOUR-MOODS/04-FEISTY-Arrabbiata.jpg | 1792 × 2400 |
| Main campaign | 5 | 02-MAIN-CAMPAIGN/01-Rigatoni-Burrata-Tomato.jpg | 1080 × 1350 |
| Main campaign | 6 | 02-MAIN-CAMPAIGN/02-Cacio-e-Pepe.jpg | 1080 × 1350 |
| Main campaign | 7 | 02-MAIN-CAMPAIGN/03-Beef-Ragu.jpg | 1080 × 1350 |
| Main campaign | 8 | 02-MAIN-CAMPAIGN/04-From-Kitchen-To-Table.jpg | 1080 × 1350 |
| Main campaign | 9 | 02-MAIN-CAMPAIGN/05-Penne-Pomodoro.jpg | 1080 × 1350 |
| Main campaign | 10 | 02-MAIN-CAMPAIGN/06-Tear-It-Up-Focaccia.jpg | 1080 × 1350 |
| Motion story | 1 | 03-MOTION-STORIES/01-Pepper-In-Motion.mp4 | 1080 × 1920, 4.01 s |
| Motion story | 2 | 03-MOTION-STORIES/02-Tear-It-Up-Focaccia.mp4 | 1080 × 1920, 4.01 s |

Exactly 4 Four Moods JPEGs, 6 Main Campaign JPEGs and 2 MP4s were present in their designated folders and imported. Both videos decode as 1080 × 1920, 4.01 seconds. All twelve copied files have identical SHA-256 hashes to their source files. No resampling, cropping, generation, transcoding or quality reduction.

The optional `04-COVER/TRAMA-Cover.jpg` does not exist. The approved `02-MAIN-CAMPAIGN/01-Rigatoni-Burrata-Tomato.jpg` is used as the cover: large food hero, readable headline and a stronger burgundy contrast against North Pier.

Additional files were deliberately excluded: root `Post 1.psd` through `Post 6.psd`, `01-FOUR-MOODS/Frame.psd`, `images/Frame 2.psd`, `images/Untitled-2_01.jpg`, `images/Untitled-2_02.jpg`, `images/images/3_01.jpg`, `images/images/3_02.jpg`, `images/images/Untitled-2.jpg`. These are outside the specified delivery map (or editable source documents); no attempt was made to classify them as additional posts. No missing or ambiguous required filenames.

## Reusable changes

- Optional original width/height on social designs, defaulting to the existing 1080 × 1350 for older projects. Four Moods preserves 1792 × 2400.
- Optional section layouts: default, compact, balanced and wide. Four Moods uses an even two-column sequence; the main campaign retains the editorial stagger. Feed is three columns on desktop, two on tablet and one on mobile.
- Optional typography specimen family and feed-background colour; older project defaults remain unchanged.
- Optional `motionStories` data and reusable `motion` section. No slug-specific renderer.
- Motion stories acquire a source when entering the viewer viewport, play at natural speed, muted/loop/playsInline, and pause offscreen or in a hidden tab. No scroll seeking. Accessible play/pause buttons work when autoplay is blocked and respect reduced-motion preferences.
- The landing temporarily uses manual history scroll restoration so browser restoration does not compete with the viewer.
- Existing admin now handles Motion section types, story editing/add/remove/reorder, layout selectors and actual artwork dimensions.

## Admin and saved content safety

Use Admin → EU Visual → PROJECT → TRAMA. Edit the existing project fields, social designs, motion stories and sections. Save Draft and Publish Live retain the existing persistence/authentication flow.

Tests exercise the actual admin UI with a mocked configuration persistence endpoint, including save/reload and unchanged North Pier/main-page data. Authentication and draft protection also use the existing real local test API. Production Blob writes were **not** made or tested.

TRAMA was added to the repository seed configuration. Existing saved Blob configuration takes precedence over the seed and intentionally is not overwritten or silently merged with new projects (which could revive deleted projects). Before any future production release, append only the TRAMA entry to the latest backed-up live/draft EU Visual project arrays through the existing authenticated workflow, preserving all other saved fields. Do not upload an old full-site backup. This task does not publish to the main domain.

## Created files

- `src/app/eu-visual/MotionStory.tsx`
- `tests/trama.spec.ts`
- `docs/trama-handoff.md`
- Twelve media files listed above under `public/media/eu-visual/trama/`.

## Modified files

- `src/data/eu-visual.json`
- `src/lib/eu-visual.ts`
- `src/app/eu-visual/ProjectViewer.tsx`
- `src/app/eu-visual/EuVisualClient.tsx`
- `src/app/eu-visual/page.tsx`
- `src/app/eu-visual/eu-visual.css`
- `src/app/admin/EuVisualEditor.tsx`
- `src/app/admin/OldAdminDashboard.tsx`
- `tests/eu-visual.spec.ts`

North Pier's project data was compared with the pre-task HEAD and is identical. Its media files were not modified. Shared renderer additions are backward-compatible.

## Validation

- Baseline build: passed.
- Baseline browser suite: 14 passed, 6 deliberately skipped, 1 tablet scroll-restoration failure.
- Final build: passed.
- TypeScript `npm run typecheck`: passed.
- `npm run lint`: unavailable; no lint script/configuration in this repository. No lint success is claimed.
- Full updated Playwright suite: 22 passed, 8 deliberately skipped (admin/API-only cases run on desktop, not duplicated on tablet/mobile).
- Additional TRAMA rerun after screenshot capture correction: 7 passed, 2 deliberately skipped.
- Desktop 1440 × 1000, tablet 820 × 1180, mobile 390 × 844 verified.
- Checked: counts and order, native image ratios, no horizontal overflow, deferred video loads, natural playback and loop, play/pause, offscreen pause, reduced motion, next/previous, Escape, browser Back/Forward, selected-project refresh, focus restoration and landing scroll restoration.
- Existing single-project test assumptions were updated for the two-project collection. Keyboard activation in the scroll-restoration test avoids Playwright's automatic card scrolling changing the starting position.
- Screenshots reviewed from the real local route. Wait for lazy images to decode before comparing captures; element screenshots larger than the fixed viewer viewport do not represent the actual on-screen layout.

## Assumptions

The folder/filename map is authoritative. Extra PSDs and unrelated export directories are not additional delivery assets. Year is 2026. The brief's fallback-cover permission is used. Projects remain data-editable; initial order follows the supplied brief rather than permanently locking admin controls.

