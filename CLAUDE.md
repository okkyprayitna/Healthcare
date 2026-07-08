# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

A static, single-page healthcare clinic marketing site — no framework, no build step, no package manager. Core files:

- `index.html` — all markup
- `styles.css` — all styling
- `script.js` — all behavior
- `new-patient-checklist.html` — standalone, `noindex` lead-magnet page (printable new-patient checklist), reuses `styles.css` and the same fonts; linked from the enquiry section and its success message
- `favicon.svg`, `robots.txt`, `sitemap.xml` — static SEO/branding assets

## Commands

There is no build, lint, or test tooling. To preview changes, open `index.html` directly in a browser (double-click, or `start index.html` on Windows).

## Architecture

`index.html` is organized as a linear sequence of `<section>`s (hero → why-us → services → testimonials → enquiry form → footer), each with an `id` matching a nav anchor (`#home`, `#services`, `#testimonials`, `#enquiry`; `#why-us` has no nav link). Nav links and CTA buttons scroll to these anchors via CSS `scroll-behavior: smooth` — there is no client-side routing. A `MedicalClinic` JSON-LD block in `<head>` carries structured data (address, phone, hours) for local search.

`script.js` is initialized from a single `DOMContentLoaded` listener in `initMobileNav`/`initFadeInOnScroll`/`initFooterYear`/`initEnquiryForm`, each self-contained and independent of the others:

- **Mobile nav** — toggles a `.is-open` class on `#navMenu`; CSS media queries at 768px control when the hamburger button is shown.
- **Fade-in on scroll** — any element with the `.fade-in` class is observed by an `IntersectionObserver` and gets `.is-visible` added once it scrolls into view (falls back to making everything visible immediately if `IntersectionObserver` is unsupported); disabled via `prefers-reduced-motion`.
- **Enquiry form** (`#enquiryForm`) — client-side only; validates name/email/phone with inline per-field error spans (no `alert()`), and on success logs the collected data to the console instead of POSTing anywhere. The spot for wiring up a real backend is marked with a `TODO` comment directly above the `console.log` in `initEnquiryForm`. The success message links to `new-patient-checklist.html` as an instant-access reward — there's no email service, so don't promise email delivery of anything.

`styles.css` uses CSS custom properties defined on `:root` — an ink-navy/brass/cream palette (`--color-ink*`, `--color-brass*`, `--color-bg*`), plus radius, shadow, and max-width tokens — reuse these variables rather than hardcoding new values. Typography pairs Fraunces (`--font-display`, headings only) with Inter (`--font-body`); both load from Google Fonts in `index.html`'s `<head>`. Layout is mobile-first; grid section breakpoints are at 640px and 992px, nav breakpoint is at 768px. The hero's signature element is `.hero-beacon` (a decorative, `aria-hidden` rotating/pulsing radar graphic) — keep new sections restrained around it rather than adding competing motion.

Images are hotlinked from Unsplash's CDN (`images.unsplash.com/photo-<id>?...`) rather than stored locally — when swapping images, verify the new photo ID resolves before committing. `assets/screenshot.png` is a local rendered screenshot (not hotlinked) used by the README and Open Graph/Twitter meta tags — regenerate it after any visual change that should be reflected there.
