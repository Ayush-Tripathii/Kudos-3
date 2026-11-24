# Kudos Restro Lounge — landing page

**Direction B: "Built, not launched."** Earth & Terracotta palette, light theme. This is an editorial, grid-led page that assembles itself as you read: rules draw first, modules snap onto the grid, and images open through arched apertures.

Stack: **Astro 4 + TypeScript + vanilla CSS** (custom properties, hand-set 12-column grid). Motion uses **GSAP 3 + ScrollTrigger + Lenis**, lazy-loaded.

```bash
npm install
npm run images     # only needed if photos change (outputs already generated in public/img)
npm run dev        # http://localhost:4321
npm run build      # static site → dist/
npm run preview
```

Copy `.env.example` → `.env` and set `PUBLIC_FORM_ENDPOINT` once the enquiry endpoint exists.

---

## 1. TODO constants awaiting client input

All of these live in **[src/config.ts](src/config.ts)**. Nothing was guessed. Until a value is set, the page degrades gracefully: hours read "To be confirmed", JSON-LD omits the field, and directions fall back to a Google Maps search.

| Constant | Used for | Current fallback |
|---|---|---|
| `SITE_URL` (also `site` in [astro.config.mjs](astro.config.mjs)) | canonical, OG/Twitter, sitemap, robots | placeholder domain |
| `WHATSAPP_NUMBER` | every "Hold us a table" CTA, form fallback | `wa.me/TODO_WHATSAPP_NUMBER` |
| `PHONE_DISPLAY`, `PHONE_TEL` | Call buttons, mobile action bar, JSON-LD | "Call us" with a TODO `tel:` |
| `EMAIL` | reserved | — |
| `ADDRESS.street`, `ADDRESS.postalCode` | footer/visit address, JSON-LD | "Udaipur, Rajasthan" only |
| `GEO.lat`, `GEO.lng` | JSON-LD `geo`, directions link | omitted / Maps search |
| `MAPS_URL` | "Get directions" | Maps search for "Kudos Restro Lounge Udaipur" |
| `HOURS[]` (opens/closes, 24h) | hours table, **pine "open now" dot**, JSON-LD | "To be confirmed"; status reads "Message us for today's hours" |
| `PRICE_RANGE` | JSON-LD only | omitted |
| `MENU_URL` (PDF) | "Get the full menu" | opens WhatsApp asking for the menu |
| `SOCIALS[]` | footer "Elsewhere", JSON-LD `sameAs` | hidden until set |
| `PUBLIC_FORM_ENDPOINT` (.env) | enquiry form POST (JSON) | composes the enquiry into a WhatsApp message |

### Copy awaiting sign-off
Copy marked `[draft]` in [src/data/content.ts](src/data/content.ts) was written **only from facts in the brief**, with no invented claims, prices or ratings. It still needs client approval:

- the five story chapter bodies,
- the eight "What makes Kudos different" points (the brief references eight but doesn't list them),
- the bar copy,
- the four Music & Nights lines,
- the dish grouping and cuisine tags.

The mood "time ranges" are deliberately descriptive ("Sunset → Dinner"), not opening hours.

### Photography gaps
The client folders contain **no founder portrait, no people or crowd shots, and no cocktail close-ups**. The founder slot is a labelled empty 4:5 arch frame ("Awaiting photography"). Night and bar moments use the venue's evening shots.

---

## 2. Colour tokens

Exact values from the brief, defined once in `:root` in [src/styles/global.css](src/styles/global.css).

| Token | Hex | Role | Share |
|---|---|---|---|
| `--plaster` | `#F7F0E4` | primary canvas | ~55% neutrals |
| `--sandstone` | `#EFE2CD` | alternating surface, ticker | |
| `--clay-100` | `#E6D2BA` | cards, the Bar, footer, plate fills | |
| `--teak` | `#3A2A1D` | headings, primary ink | ~20% earth |
| `--espresso` | `#241810` | **the single dark band** (Music & Nights) | |
| `--ink-muted` | `#6B5949` | secondary text | |
| `--rule` | `#CBB79C` | hairlines on light | |
| `--terracotta` | `#B4552C` | italic headline words, progress bar, rail marker | ~15% accent |
| `--terracotta-d` | `#8C3F20` | button fills, small terracotta text, links | |
| `--terracotta-t` | `#F0DBCB` | hovered menu-row wash | |
| `--brass` | `#A97B3C` | hairlines, large numerals, leader dots | ~7% |
| `--brass-light` | `#CBA368` | hairlines/numerals inside the espresso band | |
| `--pine` | `#1C5E42` | **signature only** | ~3% |
| `--on-dark` | `#F2E9DA` | text on espresso / on buttons | |

**Where pine appears (the six permitted places):**
1. the logo mark (header and favicon),
2. the "open now" status dot,
3. the form success state,
4. the eight differentiator checkmarks,
5. the focus ring (the brief's §11 requires a 2px pine ring site-wide, including the reserve button),
6. the footer rule.

### Contrast (measured, WCAG 2.x)

| Pair | Ratio | Decision |
|---|---|---|
| terracotta on plaster | **4.34** | fails 4.5 for small text → used only for large display italics (≥24px, needs 3:1) |
| terracotta-d on plaster | 6.51 | all small terracotta text, links, button fills |
| on-dark on terracotta-d | 6.51 | button labels |
| brass on plaster | **3.32** | brass is never small text; brass numerals are ≥24px |
| ink-muted on plaster / sandstone / clay | 5.88 / 5.22 / 4.54 | secondary text |
| brass-light on espresso | 7.40 | numerals and hairlines in the dark band |

---

## 3. Type system — three voices

| Voice | Face | Use |
|---|---|---|
| **Display** | Instrument Serif, regular + italic | H1/H2/H3, pull-quote, dish names, drop cap. Mixed case only; the emphasised word goes italic and terracotta. |
| **Structural** | Archivo variable, `font-stretch` 105–125% (Expanded), 600, UPPERCASE | section labels, left-rail index, menu categories, buttons, ticker, captions: the "printed menu board" voice |
| **Body** | Switzer 400 (fallback Inter / system) | paragraphs and forms, 1.0625rem / 1.68, 64ch measure |

The scale (`--t-display`, `--t-h2`, `--t-h3`, `--t-label`, `--t-body`) is exactly as specified.

Every section opens with the same rhythm: **brass numeral · Archivo label · brass hairline · serif headline**, with the numeral hanging in the left margin on the headline's first baseline. This lives in one component: [src/components/SectionHead.astro](src/components/SectionHead.astro).

Fonts are self-hosted and **subset** with [scripts/subset-fonts.mjs](scripts/subset-fonts.mjs), going from 167 KB to 77 KB. All four are preloaded together so they swap in one pass. Originals are kept in `_raw/fonts/`. Paid upgrade path for display: Boska or Signifier (swap the `@font-face` and `--f-display`).

---

## 4. Why terracotta-led, why three voices

**Terracotta-led.** Udaipur is built of lime plaster, sandstone and fired clay, so the palette is literally the city's material. That lets the page run the brief's emotional arc through *surfaces* rather than lighting: plaster → sandstone → clay → terracotta → espresso → plaster. Terracotta is warm and energetic without reading as "luxury gold" or "nightclub dark", which is exactly the fine-casual line: premium, not pretentious. Brass is kept to hairlines so it feels like inlay, not bling. Irish green is held to a ~3% signature so it registers as the brand's mark instead of a theme.

**Three voices.** Each voice does one job, so the page reads like a printed publication:
- **The serif** carries personality and warmth (the conversation).
- **Archivo in caps** carries structure (the menu board, the index, the signage).
- **Switzer** gets out of the way for reading.

Uppercase belongs only to Archivo, so hierarchy is instant: caps mean *navigation and labels*, the serif means *what we're saying*.

---

## 5. Image pipeline

All 24 client photos were downloaded from the two Drive folders into `_raw/` (git-ignored). Nothing is hot-linked. The venue files were identified by eye and renamed `kudos-<zone>-<subject>`:

| Raw file | Published name | What it shows |
|---|---|---|
| DSC08110 | `kudos-terrace-palace-table` | table at the rail, City Palace + Lake Pichola (**hero**) |
| DSC8254 | `kudos-terrace-sunset-palace` | covered terrace, late light, palace view |
| DSC08527-HDR | `kudos-lounge-stage` | stage / DJ booth |
| DSC08944 | `kudos-terrace-dining-day` | rooftop dining room by day |
| DSC09016 | `kudos-terrace-dining-dusk` | terrace edge at dusk |
| DSC09061 | `kudos-terrace-hill-view` | rail tables, hills |
| DSC09131 | `kudos-lounge-bar-room` | lounge floor, bar at far end |
| DSC09159 | `kudos-bar-counter` | lit bar counter |
| DSC09270 | `kudos-lounge-evening-neon` | lounge, evening, neon |
| DSC09281 | `kudos-terrace-night-lights` | terrace at night, city lights |
| DSC09284 | `kudos-interior-hall-night` | glass-walled hall, night |
| DSC09293 | `kudos-interior-dining-night` | indoor dining room, night |

Dishes become `kudos-dish-<name>`.

**Commands**

```bash
npm run images                         # build missing outputs only
npm run images -- --force              # rebuild everything (~15 min)
ONLY=kudos-bar-counter npm run images -- --force   # rebuild one image
node scripts/subset-fonts.mjs          # re-subset fonts from _raw/fonts
```

**What [scripts/build-images.mjs](scripts/build-images.mjs) does** (uses `sharp`; per-image focal points live in [scripts/images.config.mjs](scripts/images.config.mjs)):

1. **Crop** to 4:5 (editorial and dish), 3:2 (wide and lightbox) or 1:1 (contact sheet) around a focal point.
2. **One shared grade** for food and venue: a high-key, airy look.
   - contrast compressed and shadows lifted toward warm grey-brown,
   - warmth roughly +5 via a recomb matrix,
   - saturation −8%, brightness +3%.
3. **Film grain:** grayscale gaussian noise, soft-light blended (σ 12, or σ 9 at ≥1600px). Applied to photos only.
4. **Encode** AVIF (primary), WebP and JPEG.
   - widths: 4:5 → 640/768/1024/1600; 3:2 → 640/1024/1600/2400; 1:1 → 320/640.
   - 2400 is AVIF-only; WebP and JPEG fallbacks stop at 1600.
   - each file steps quality down until it fits its budget (≤200 KB editorial, ≤70 KB thumbnails).
   - the hero/LCP image uses AVIF q42 for the critical path.
5. **LQIP:** a 20px blurred WebP stored as base64 in `src/data/images.json`. It cross-fades out on load.
6. **Open Graph card:** `og-kudos-1200x630.jpg`.

`scripts/image-report.txt` lists every output's quality and size.

**Budget status:**
- Every **AVIF** (what modern browsers download) is within budget.
- Five *fallback* files run over 200 KB: 4:5-1600 WebP/JPEG for `lounge-stage`, `terrace-sunset-palace` and `terrace-dining-dusk`, at 199–247 KB.
- Only non-AVIF browsers on large screens fetch them. Below about q38, the grain turns to mush, so I held quality there rather than force the number.

Every `<img>` has fixed `width`/`height` and an aspect-ratio wrapper (CLS ≈ 0), and brand-voice alt text from `ALT` in [src/data/content.ts](src/data/content.ts). There are no overlays on dish photography.

---

## 6. Motion system

**Easings:** `--draw` (rules, 700–900ms), `--snap` (modules, 520ms, slight overshoot), `--soft` (hovers).

**What runs where:**
- **CSS** handles the intro, hero snap-on, rule draws, apertures, button wipes, the equaliser and the band opening, using transforms, opacity and clip-path.
- **One IntersectionObserver** (85% viewport line) adds `.is-in` to trigger them. It staggers 70ms and never moves more than 5 items at once.

| Effect | Where |
|---|---|
| Intro (grid draws → wordmark types → grid recedes, ≤1.6s, once per session) | inline bootstrap in [Base.astro](src/layouts/Base.astro) + CSS |
| Scramble labels, count-ups, rail index, ticker, tilt, contact-sheet drag/inertia, pillar accordion, open-now | [src/scripts/main.ts](src/scripts/main.ts) |
| FLIP lightbox (native `<dialog>`: focus-trapped, Esc closes, focus returns) | [src/scripts/lightbox.ts](src/scripts/lightbox.ts) |
| Lenis smooth scroll + ScrollTrigger timeline scrub / plate fills | [src/scripts/motion.ts](src/scripts/motion.ts), **lazy-loaded on first scroll/interaction** |
| Enquiry form: inline brand-voice validation, honeypot, endpoint or WhatsApp fallback | [src/scripts/form.ts](src/scripts/form.ts) |

**`prefers-reduced-motion`:**
- no intro, Lenis, scramble, ticker, tilt or drag inertia, and the equaliser is still;
- reveals become a 180ms opacity fade;
- apertures render open;
- timeline plates render filled.

**Not used anywhere** (Direction A only): cinematic hero video, custom cursor, pinned horizontal scroll.

**Judgement calls, stated plainly:**
- **Buttons rest on `--terracotta-d`, not `--terracotta`.** Plaster on `#B4552C` is 4.34:1, which fails the brief's own 4.5 rule for button-sized labels. The hover wipe rises in teak (primary) or terracotta-d (ghost).
- **The pillar accordion animates `grid-template-rows`.** This is the one non-transform property in the system. The brief asks the active row to "expand its height", which a transform can't do without distorting text.
- **The contact sheet scrolls horizontally because the user drags it.** It is not scroll-driven motion, so the ticker remains the only *autonomous* horizontal motion.
- **Below-the-fold sections use `content-visibility: auto`.** In profiling, every web-font swap relaid out the whole ~17,000px page. Skipping off-screen layout cut mobile TBT roughly in half.

---

## 7. Quality gates — measured

All figures are from a production build (`astro preview`) with Lighthouse 12.2.1 and local Chrome.

| Gate | Target | Result |
|---|---|---|
| Lighthouse **mobile** Performance | ≥ 92 | **96 – 98** (three consecutive runs) |
| Accessibility / Best practices / SEO (mobile) | ≥ 95 | **100 / 100 / 100** |
| Lighthouse desktop | — | 100 / 100 / 100 / 100 |
| LCP (mobile, simulated 4G) | < 2.2s | **~1.90s** (hero arch image) |
| CLS | < 0.05 | 0 – 0.017 |
| TBT (mobile) | INP proxy | 130 – 220 ms |
| JS, gzipped | ≤ 150 KB | **5.8 KB on first paint** + 48.7 KB lazy motion chunk = **54.5 KB** |
| Horizontal overflow at 390 and 1440 | 0 | 0 |

**Keyboard and screen-reader checks** (all passing, [scripts/qa/interact.mjs](scripts/qa/interact.mjs)):
- skip link is the first tab stop;
- pillar accordion works with arrows, Home/End and Enter;
- the dish row's photo wipes in on hover or focus;
- the contact sheet opens the lightbox with Enter and steps with the arrow keys;
- focus is trapped in the dialog, Esc closes it, and focus returns to the current thumbnail;
- an empty form submit shows 5 inline errors and moves focus to the first;
- the WhatsApp fallback composes the full enquiry.

**Not verified here:** 60fps on a physical mid-tier Android, and real-device INP. Both need a real device. The CPU-throttled traces are the closest proxy available.

**Dev QA tools** live in `scripts/qa/` (Puppeteer against local Chrome):
- `shoot.mjs`: viewport screenshots and overflow check.
- `interact.mjs`: keyboard, lightbox and form checks.
- `trace.mjs`: long-task attribution.
- `vitals.mjs`, `fcp-probe.mjs`: paint timing.

---

## 8. File map

```
src/
  config.ts                 ← client TODO constants + link helpers
  data/content.ts           ← all copy, alt text, captions, menu, chapters
  data/images.json          ← generated manifest (widths + LQIP)
  layouts/Base.astro        ← head, SEO, OG/Twitter, JSON-LD, intro bootstrap
  pages/index.astro         ← the 12 sections
  pages/robots.txt.ts, sitemap.xml.ts
  components/Img.astro      ← <picture> + aperture + LQIP
  components/SectionHead.astro
  styles/global.css         ← tokens, grid, type, every section
  scripts/main.ts, motion.ts, lightbox.ts, form.ts
scripts/                    ← image pipeline, font subsetting, qa/
public/img/                 ← generated responsive images (AVIF/WebP/JPEG)
public/fonts/               ← subset WOFF2
_raw/                       ← original client photos + fonts (git-ignored)
```
