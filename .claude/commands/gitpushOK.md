---
description: Security-scan, push to GitHub, set up GitHub Pages via Actions, refresh the README, and update the repo About section
---

Run the full "ship it" sequence for this repo, in this order. Do not skip the security scan, and do not push anything until it passes.

## 1. Security scan (gate — run first, before touching git)

Scan the working tree and everything about to be committed for secrets or sensitive data:

- Diff/status of all changed and untracked files (`git status`, `git diff`, `git diff --staged`).
- Grep for common secret patterns: API keys, access/secret tokens, private keys (`-----BEGIN...PRIVATE KEY-----`), AWS keys (`AKIA...`), passwords, connection strings, `.env` files, JWTs, OAuth tokens (e.g. `gho_`, `ghp_`, `sk-`, etc.).
- Check for accidentally-included credential files (`.env`, `*.pem`, `*.key`, `credentials.json`, service-account JSON, `.npmrc` with tokens, etc.) and confirm they're covered by `.gitignore` if they must exist locally.
- Confirm no personal/internal data (real customer info, internal URLs, employee emails) has leaked into placeholder content.

If anything suspicious is found: **stop, do not commit or push**, report exactly what and where, and ask how to proceed (e.g. remove the file, add to `.gitignore`, rotate a leaked credential). Only continue past this step once the scan is clean.

## 2. Push/update code to GitHub

- `git status` to see what changed.
- Stage relevant files by name (never a blind `git add -A`/`git add .` without reviewing what's included).
- Commit with a concise message describing the actual change.
- Push to `origin/main` (if the repo/remote doesn't exist yet, initialize it and create the GitHub repo first — ask the user for the intended repo name/visibility if unclear).

## 3. Create/edit GitHub Pages via GitHub Actions

- Ensure `.github/workflows/deploy.yml` exists and deploys the static site using `actions/configure-pages`, `actions/upload-pages-artifact`, and `actions/deploy-pages` on push to `main`.
- If Pages isn't yet configured to build from GitHub Actions, try setting it via the API: `PUT /repos/{owner}/{repo}/pages` with `{"build_type":"workflow"}`, using a token obtained from the local git credential manager (`git credential fill`) if the `gh` CLI isn't available. If that fails (insufficient token scope), tell the user to enable it manually under **Settings → Pages → Build and deployment → Source → GitHub Actions**.
- After pushing, check the latest workflow run via `https://api.github.com/repos/{owner}/{repo}/actions/runs` and report whether it succeeded.

## 4. Create/edit a professional README

- Base it strictly on the actual project (real file structure, real features, real tech stack) — no fabricated sections.
- Include: project title/description, a live-demo link (the GitHub Pages URL), key features, tech stack, project structure, how to run it locally, how it's deployed, and any relevant caveats (e.g. a form that's client-side only).
- Commit and push it as part of the same flow if it changed.

## 5. Create/update the GitHub repo "About" section

- Use the GitHub API (`PATCH /repos/{owner}/{repo}`) to set/update the repo `description` and `homepage` (the live GitHub Pages URL), using the same token approach as step 3.
- Confirm the update by reading back the response.

Report a short summary at the end: what was committed/pushed, the Pages deployment status and URL, whether the README changed, whether the About section was updated, and the outcome of the security scan.
