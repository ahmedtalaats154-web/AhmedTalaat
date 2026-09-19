# EU Visual implementation handoff

Implemented on 18 September 2026 in the existing Next.js App Router application.

19 September revision: the EU Visual landing inherits the main site's editable theme (cream, ink, cobalt, yellow and orange) and display typography, with restrained accents and the existing minimal layout. North Pier's colors and Instrument Sans / Newsreader remain scoped to its project viewer. Both server-rendered content and authenticated draft previews receive the site theme. Production build and nine desktop/tablet/mobile landing and viewer checks passed after this revision.

## Routes and viewer

- Landing: `/eu-visual`
- North Pier deep link: `/eu-visual?project=north-pier`
- Authenticated draft preview: `/eu-visual?site_preview=draft&project=north-pier`
- Read API: `/api/eu-visual`; add `project=<slug>` to request one case study.
- The landing response includes project summaries only. Viewer code and case-study details load on open; deeper artwork uses native lazy loading.
- The full-screen viewer has its own scroll container, a fixed Close control, focus containment, Escape handling, browser Back/Forward state, and restores landing scroll/focus.
- Next/Previous controls appear only with multiple available projects and replace content inside the same viewer.
- The main homepage and its existing animation code were not edited.

## North Pier presentation

The supplied brief is implemented as a reusable data entry: hero, overview, brand idea, visual system, place system, product system, social introduction, four editorial chapters, full social grid, optional details, optional AI process, closing.

The eight artworks are shown in four asymmetric pairs (identity/bakery, ritual/lifestyle, campaign/commercial, service/place), then together in a grid. Mobile stacks the artworks. Each design has editable title, category, purpose, visual approach, supporting copy, visibility, chapter and sort order.

All eight source images are 1080 × 1350. The imported JPEGs are byte-identical to the supplied originals, use stable filenames, and render at 4:5 with object-fit: contain. No artwork was generated, recolored, cropped, overprinted or compressed. Total original media is approximately 2.74 MB.

North Pier is explicitly identified as a fictional hospitality concept. No results or engagement claims were added. The optional AI process flag is false. Its stored content is ready to enable later.

Instrument Sans and Newsreader are integrated with next/font/google, scoped to this route, with display: swap. Build downloads the font files; visitors receive locally served font assets.

## Missing supplied assets

The specified folder contained only Post 1.jpg through Post 8.jpg. Place Sheet and Products Sheet were not present (including recursive inspection). Their sections and all copy are implemented and editable, but omit themselves until a real asset URL is assigned. No placeholder/reference sheet was invented.

To complete these sections, provide the approved files, upload through the existing Media Library and paste their URLs under EU Visual → selected project → Assets → Place Sheet / Products Sheet. Enter the original width and height to reserve the native layout ratio. These boards use natural dimensions and contain, never cropping.

The optional detail section is disabled because no separate approved detail assets were supplied.

## Existing Admin extension

A new EU Visual group is added to the existing dashboard. It uses the existing login/session, upload library, Save Draft, Publish Live, Advanced JSON, field editors and persistence.

Available controls:
- Landing title, headline and description.
- New blank project creation, project selection, delete, publication status and order.
- Identity, slug, cover, location, category, type, year and concept flag.
- Overview, positioning, roles, brand idea, challenge, personality.
- Palette, color picker/HEX values, typography descriptions/samples, materials, photography direction.
- Place/product sheets, product highlights, details.
- Add/remove/duplicate/reorder social designs, including empty collections.
- Enable/disable/reorder sections and select section type/chapter.
- Optional AI process toggle, copy, points and visuals.
- Closing statement and image.
- EU Visual-specific draft preview in the existing preview pane.

IDs are stable and hidden from ordinary field editing. Slugs must be unique lowercase hyphenated values. Duplicate project/item IDs and publishing without a title/cover are rejected. Old dashboard clients that omit euVisual preserve the stored module rather than replacing it with defaults.

### Add Project 02 later

1. Admin → EU Visual → + NEW PROJECT.
2. Add identity and a unique slug. The new project starts as a draft with no invented artwork.
3. Upload approved images in Media Library; copy full URLs into cover/assets/social fields.
4. Add social designs, assign chapter numbers and sort order, then edit/reorder/disable sections.
5. Save Draft. Open Preview Project and inspect desktop/mobile.
6. Mark for publication and Publish Live.

Published cards appear automatically by sort order. No code change is required for ordinary future projects.

## Storage and compatibility

- Seed data: `src/data/eu-visual.json`.
- Types, project factory, summaries and validation: `src/lib/eu-visual.ts`.
- Existing SiteConfig gains one additive `euVisual` key.
- Runtime edits remain in the existing encrypted Vercel Blob configuration:
  - `site-control/config.draft.enc.json`
  - `site-control/config.enc.json`
- Existing config without euVisual receives the seed through the current default merge. Explicit empty project arrays remain empty.
- No database migration, new Blob store or new environment variable is required.
- Public config/API responses exclude unpublished projects. Authenticated draft previews can show them.
- Approved source images are committed under `public/media/eu-visual/north-pier/`, so initial deployment does not require a Blob media migration. Future uploads use the existing Media Library.

## Files created

- `src/lib/eu-visual.ts`
- `src/data/eu-visual.json`
- `src/app/api/eu-visual/route.ts`
- `src/app/eu-visual/page.tsx`
- `src/app/eu-visual/EuVisualClient.tsx`
- `src/app/eu-visual/ProjectViewer.tsx`
- `src/app/eu-visual/eu-visual.css`
- `src/app/admin/EuVisualEditor.tsx`
- `public/media/eu-visual/north-pier/post-01.jpg` through `post-08.jpg`
- `playwright.config.ts`
- `tests/start-test-server.mjs`
- `tests/eu-visual.spec.ts`
- This handoff.

## Existing files modified

- `src/lib/site-config.ts`: additive EU Visual configuration/default.
- `src/app/admin/OldAdminDashboard.tsx`: existing group integration, reusable empty-list support, EU IDs/order, preview route and validation.
- `src/app/admin/admin.css`: scoped new-module controls.
- `src/app/api/site-config/route.ts`: EU validation, public publication filtering and legacy-client preservation.
- `package.json` and lockfile: Playwright dev dependency and typecheck/test scripts.
- `.gitignore`: generated test artifacts and TypeScript build cache.

## Verification

Baseline production build passed before changes. Implementation production build and TypeScript checks passed.

Browser verification uses Chromium at 1440×1000, 820×1180 and 390×844. Fifteen applicable scenarios passed across test runs; desktop-only admin/data scenarios are intentionally skipped on the other two sizes.

Verified:
- Cover-only initial loading and 2/2/1 responsive landing columns.
- Full-screen opening, Escape, Back, focus trap, exact landing scroll/focus restoration.
- Direct URL refresh reopening.
- Eight individual designs, four chapters, eight-image summary grid.
- Full 4:5 rendering and contain for all social artworks.
- No horizontal overflow at tested viewports.
- Draft API authentication and unavailable-project errors.
- Real existing password/session route with isolated localhost test credentials.
- Invalid project slug rejection.
- Future-project navigation and AI opt-in rendering.
- Admin editing, reorder, empty-list addition, new project, save/reload and publish flow while preserving unrelated config.

The dashboard save/reload UI test uses an in-memory API fixture to avoid altering production Blob data. Actual production Blob persistence is reused unchanged; no live content was saved during tests.

Commands:
```sh
npm run build
npm run typecheck
npm run test:e2e
```

There was no existing lint or test script. Playwright is the only newly added dependency and is development-only. No runtime UI/animation library was added.

The original build prints a pre-existing Browserslist warning about the parent workspace package.json; it does not prevent a successful build. npm audit also reports existing Next.js/PostCSS/Sharp/nanoid advisories; dependency upgrades are outside this feature and were not applied.

## Recovery and deployment

Base commit: `85b5ab507483cc42a3ec81ccca3eb15bbfcb4a59`.
Local backup branch: `backup/pre-eu-visual-2026-09-18`.
Published config downloaded before changes:
`C:\Users\A7med\Documents\Codex\AhmedTalaat-backups\2026-09-18-before-eu-visual\published-config.json`.

Development branch: `feature/eu-visual`.
Vercel CLI authentication was expired during implementation. GitHub push authentication is available; deployment status should be checked after pushing the feature branch. This document does not claim production publication.
