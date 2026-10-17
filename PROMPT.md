# Design Prompt — Patrick Fontanilla, Video Editor Portfolio

## 1. Goal
Build a single-page, fast, static portfolio website for **Patrick Fontanilla**, a freelance **video editor** who specializes in
real estate (listing tours, luxury, agent YouTube), short-form social (Reels/TikTok/Shorts) and UGC performance ads for Meta/TikTok.
The site has to win clients within about 10 seconds: show the face, show the niche, then put the reels in front of them right away.

## 2. Visual direction (from the Pinterest reference)
The reference is a "Welcome to my PORTFOLIO" poster in a Swiss/brutalist motion-designer style:
- **Canvas:** cool light grey paper (`#E4E4E2`), near-black ink (`#0E0E0E`), and one loud accent: **signal red-orange `#E5432F`**.
- **Hero signature:** one huge, extra-wide, heavy **PORTFOLIO** headline set over a **tall red-orange vertical bar** that sits behind
  the center letters. Behind the solid word, outlined "ghost" copies of the word are warped and skewed, so it reads like a motion-blurred
  title frame.
- **Small caps labels** in the four corners ("WELCOME TO MY", the name, "VIDEO EDITOR", a logo mark), with thin **crosshair "+" registration
  marks** and little ◀ ▶ triangles at the edges, like an editing timeline or a print sheet.
- **Fanned card arc:** below the title, rounded-corner cards (radius ~22px) fan out in an arc, each tilted a few degrees. One card is the
  **portrait** (grayscale, which turns to color on hover), one is a solid red-orange card with the logo mark, and the rest are **live
  muted video previews** of the work.
- **Rotating ring text:** a circle of text ("PORTFOLIO • VIDEO EDITOR • PORTFOLIO •") that slowly spins with a "▲ ME" pointer.
- Mood: editorial, confident, technical. Lots of whitespace, sharp type, no gradients and no glassmorphism.

## 3. Typography
- Display: **Unbounded** (800–900) for PORTFOLIO and section titles: wide and geometric, close to the reference.
- Body/labels: **Space Grotesk** (400–600). Labels are 11–12px, uppercase, letter-spacing .14em.
- Numerals for timecodes and counters: **JetBrains Mono**.

## 4. Information architecture (single page)
1. **Top bar:** small "PF" monogram (eye/lens mark in a rounded square) · nav (Work, About, Services, Contact) · "Available for work"
   pill with a pulsing red dot.
2. **Hero:** follows section 2. The cards fan in on load with a stagger, and on desktop the fan follows the mouse slightly (parallax).
   CTA buttons: "View reels ↓" and "Hire me".
3. **Marquee strip:** black band with scrolling text: REAL ESTATE ✦ LUXURY LISTINGS ✦ UGC ADS ✦ TIKTOK ✦ REELS ✦ YOUTUBE ✦ SHORTS.
4. **Stats row:** "40+ edits delivered · 5 niches · 9:16 / 1:1 / 16:9 · Premiere Pro · After Effects · CapCut".
5. **Work** (the core section):
   - Filter chips: **All · Luxury Real Estate · Real Estate Shorts · Real Estate YouTube · Short Form · UGC / TikTok / Meta**, each with a count.
   - Masonry-style grid that respects each video's **true aspect ratio** (9:16, 4:5, 1:1, 16:9). Vertical videos are grouped in
     a tight row; 16:9 pieces span 2 columns.
   - Each tile shows a poster frame and plays a **4-second muted preview loop on hover** (on mobile, when it scrolls into view). It also
     shows a timecode-style duration badge (`00:01:02`), format badge (`9:16`), title, and category.
   - Clicking a tile opens a **lightbox player** with the full-quality video (sound on, native controls), title, category, prev/next
     arrows, Esc to close, and arrow-key navigation.
6. **About:** large color portrait in a rounded card with a crosshair frame, plus a short bio written in the first person, a "toolkit"
   list, and "what I deliver" bullets (hooks in the first 2 seconds, captions/subtitles, sound design, color grading, branded
   lower-thirds, multi-format exports).
7. **Services:** three numbered cards (01 Real Estate & Luxury Listings · 02 Short-Form & Reels · 03 UGC & Performance Ads), each with
   what is included and the typical turnaround.
8. **Process:** a timeline-styled 4-step row (Brief → Rough cut → Revisions → Delivery), drawn like an editing timeline with a red playhead.
9. **Contact/footer:** huge "LET'S EDIT." headline with the red bar motif again, an email button, social links, and a back-to-top
   triangle. © 2026 Patrick Fontanilla.

## 5. Motion and interaction
- Entrance: the headline letters rise in with a stagger, the red bar scales up from the bottom, and the cards fan out.
- Scroll reveals use IntersectionObserver (fade + 24px rise). Everything respects `prefers-reduced-motion`.
- Custom cursor dot on desktop that grows into a "PLAY" disc over video tiles.
- Ring text spins on a 20s infinite loop.

## 6. Technical requirements
- Plain **HTML + CSS + vanilla JS** with no build step, so it can be hosted anywhere (Netlify, Vercel, GitHub Pages, Hostinger).
- Video data lives in one `works.js` array (id, title, category, aspect, duration) so new edits are easy to add.
- Media folders: `media/web/` (720p H.264 faststart, for the lightbox), `media/previews/` (4s muted 360p loops), `media/posters/` (JPG).
- Lazy-load posters and videos (`loading="lazy"`, `preload="none"`), and only one preview plays at a time.
- Responsive: 1 column at <560px, 2 at tablet, 3–4 on desktop. The hero card fan shrinks to fit phones with no horizontal scroll.
- Accessible: semantic landmarks, alt text, keyboard-operable tiles and lightbox, visible focus rings, AA contrast.
- SEO: title "Patrick Fontanilla — Video Editor | Real Estate, Reels & UGC", plus meta description and Open Graph image (the portrait).

## 7. Content: work mapping
| Category | Pieces |
|---|---|
| Luxury Real Estate | Luxury Edit (9:16), Luxury Listing (9:16), Luxury Property Film (16:9) |
| Real Estate Shorts | 23 Woodland Trail, 80 Nantucket (reel + branded), 2422 Fall Harvest Cres (social + branded), 50 O'Shea Crescent Ajax |
| Real Estate YouTube | Intro to Coconut Grove, Child-Friendly McLean (Paul Kim), New Home Myths (Rob Rovnak), Justin's Finished Flip (Paul Robert) |
| Short Form | Leif Jacobson, Short-Form Edit (4K vertical), Amora Media test edit |
| UGC / TikTok / Meta | Billo creators (Alexis, Courtney, Eden, Haley J), BB UGC ×3, College Send-Off ×2, Bad Behavior ×2, Whitening ×3, Bradley Work, Reading Reviews, Just Start (9:16 + 1:1), Elsa Edits, Àerre brand video ×4, RomeMD |
