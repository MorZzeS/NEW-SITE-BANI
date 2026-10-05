# Hero video viewer — stage 4

Base: `d6d3cbd1be24863e7eccd6f3b063ebef862a2a9f`.

## Owner sources

Source folder: `C:\Users\maxto\Desktop\НОВЫЙ САЙТ\Видео для сайта`.
The folder was created/checked and contains no files. No footage or poster has
been invented, downloaded, or generated. Original owner files must be preserved.

Put optimized copies in `public/videos/baths/banya-01.mp4`, etc., with WebP
posters `banya-01-poster.webp`. Register each approved pair in `src/data/videos.ts`
with id, title, src, poster, optional duration, and order. On this staging export,
asset URLs need the `/NEW-SITE-BANI/videos/baths/` prefix. Do not add missing-file
entries. The current `bathVideos` array is intentionally empty.

## Implementation

- Existing Hero video action now opens a dynamically imported viewer; CTA text
  and central data are in `src/data/videos.ts`.
- Native modal dialog in a body portal: page is inert, focus is contained,
  Esc / close / overlay click close, trigger focus and scroll position restored.
- Body fixed during viewing for scroll lock, with previous inline styles restored.
- Panel is 82vw on desktop; safe edge insets on mobile; controls 44×44 px.
- Theme styles use existing semantic tokens, without changing the theme system.
- No new motion animations, and no panel blur on mobile.
- Only the selected video mounts after opening. Poster and native controls,
  muted initial playback, external sound toggle, metadata preload, error message.
- Switching unmounts the old player: pause, remove src, load to release resource.
- Previous/next wrap; keyboard arrows and horizontal touch swipe navigate.
- Empty folder shows an explicit empty state; navigation/sound disabled.

## Verification

- `npm run build`: PASS, 88 routes and 21 static slash aliases.
- `npm run check:static -- --base-url http://127.0.0.1:56756`: PASS,
  105 HTML pages, 249 local URLs, 31 models, 28 plans, errors [].
- Hero and viewer screenshots reviewed at 1440/390 px in DAY/NIGHT: PASS.
- Panel fits viewport, no horizontal overflow, all four controls 44×44: PASS.
- CTA open, close button, Esc, overlay click, Tab focus containment, restored
  trigger focus and body styles: PASS with empty-state viewer.
- Before interaction: 0 video nodes and 0 video preload links; source contains
  no footage URLs. No mp4 assets exist in this version. No initial video download
  or autoplay is possible. Hero background and priority image remain unchanged.
- Real playback, muted autoplay, sound, poster display, next/prev and swipe
  changing an actual video, and decoder/resource stop require owner footage.
  They are implemented but NOT marked as runtime PASS without actual sources.

Screenshots and DOM measurements:
`C:\Users\maxto\.codex\tmp\banger-hero-stage4\`.

Catalog, articles, theme provider, info cards, trust-strip and existing Hero
animations remain unchanged. Push/deploy not performed. Stop after stage 4.
