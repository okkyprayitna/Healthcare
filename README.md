# Harborview Family Clinic

A static, single-page marketing website for a fictional healthcare clinic. Built with plain HTML, CSS, and JavaScript — no framework, no build step, no dependencies.

**Live site:** https://okkyprayitna.github.io/Healthcare/

## Features

- Sticky, responsive navbar with a mobile hamburger menu and smooth-scroll anchor links
- Hero section with a headline, dual call-to-action buttons, and a trust-indicator strip
- Services section highlighting general checkups, pediatrics, cardiology, and dental care
- Patient testimonials with initials avatars and star ratings
- Appointment enquiry form with client-side validation (inline error messages, no `alert()`) and a success state
- Scroll-triggered fade-in animations via `IntersectionObserver`
- Footer with quick links, social placeholders, and a JS-injected copyright year

## Tech stack

- **HTML5** — semantic markup (`index.html`)
- **CSS3** — custom properties, mobile-first layout with breakpoints at 640px / 768px / 992px (`styles.css`)
- **Vanilla JavaScript** — no libraries (`script.js`)

## Project structure

```
├── index.html   # all markup
├── styles.css   # all styling
├── script.js    # all behavior
└── CLAUDE.md    # guidance for AI coding agents working in this repo
```

## Running locally

No build tooling is required. Open `index.html` directly in a browser:

```bash
start index.html   # Windows
```

## Deployment

The site is deployed to GitHub Pages automatically via GitHub Actions (`.github/workflows/deploy.yml`) on every push to `main`.

## Notes

The enquiry form is client-side only — on submit it validates the fields and logs the collected data to the browser console instead of sending it anywhere. The spot for wiring up a real backend API call is marked with a `TODO` comment in `initEnquiryForm` in `script.js`.
