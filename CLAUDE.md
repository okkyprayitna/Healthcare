# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

A static, single-page healthcare clinic marketing site — no framework, no build step, no package manager. Three files:

- `index.html` — all markup
- `styles.css` — all styling
- `script.js` — all behavior

## Commands

There is no build, lint, or test tooling. To preview changes, open `index.html` directly in a browser (double-click, or `start index.html` on Windows).

## Architecture

`index.html` is organized as a linear sequence of `<section>`s (hero → services → testimonials → enquiry form → footer), each with an `id` matching a nav anchor (`#home`, `#services`, `#testimonials`, `#enquiry`). Nav links and CTA buttons scroll to these anchors via CSS `scroll-behavior: smooth` — there is no client-side routing.

`script.js` is initialized from a single `DOMContentLoaded` listener in `initMobileNav`/`initFadeInOnScroll`/`initFooterYear`/`initEnquiryForm`, each self-contained and independent of the others:

- **Mobile nav** — toggles a `.is-open` class on `#navMenu`; CSS media queries at 768px control when the hamburger button is shown.
- **Fade-in on scroll** — any element with the `.fade-in` class is observed by an `IntersectionObserver` and gets `.is-visible` added once it scrolls into view (falls back to making everything visible immediately if `IntersectionObserver` is unsupported).
- **Enquiry form** (`#enquiryForm`) — client-side only; validates name/email/phone with inline per-field error spans (no `alert()`), and on success logs the collected data to the console instead of POSTing anywhere. The spot for wiring up a real backend is marked with a `TODO` comment directly above the `console.log` in `initEnquiryForm`.

`styles.css` uses CSS custom properties defined on `:root` (colors, radius, shadow, max content width) — reuse these variables rather than hardcoding new values. Layout is mobile-first; grid section breakpoints are at 640px and 992px, nav breakpoint is at 768px.

Images are hotlinked from Unsplash's CDN (`images.unsplash.com/photo-<id>?...`) rather than stored locally — when swapping images, verify the new photo ID resolves before committing.
