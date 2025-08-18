## Repository health baseline

This repo contains multiple Next.js/TypeScript templates under various folders. This change introduces minimal, conventional housekeeping and configs to standardize formatting and improve DX.

### Added
- `.editorconfig` for basic editor consistency
- `.prettierrc.json` and `.prettierignore` for formatting
- `.eslintrc.json` with safe defaults (React + TypeScript)

### Suggested workflow
1. Install Node LTS (>=18) and npm.
2. In a chosen app directory (e.g., `LEARNMATE-AI/nextjs-app`):
   - `npm ci`
   - `npm run lint` (or `npx eslint .`)
   - `npm run build`

No breaking changes were introduced; only repository-level configs.

