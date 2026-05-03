# Portfolio – MILO Overview

## Project Overview

A personal developer portfolio for **Ridit** (`ridit.space`). Built with Next.js (App Router) to showcase projects, interactive UI experiments, and custom visual effects. The site loads quickly, supports dark mode, and uses a component‑driven architecture for reusable animated widgets.

## Tech Stack

- **Language**: TypeScript (strict mode)
- **Framework**: React 19 + Next 16 (App Router)
- **Styling**: Tailwind CSS, custom CSS variables, `tw-animate-css`
- **Animations / 3D**: GSAP, Framer Motion, three.js, OGL, postprocessing
- **UI helpers**: `clsx`, `tailwind-merge`, `class-variance-authority`, `lucide-react`
- **Build**: Vite‑less, uses Next's built‑in compiler; dev server via `next dev`
- **Lint**: ESLint with `eslint-config-next` (core‑web‑vitals + TypeScript)

## Package Manager

Detected **npm**. Install/run commands use npm scripts.

## Platform

Target: **win32** (PowerShell). Paths use backslashes. No OS‑specific code beyond standard Node/Next APIs.

## Build & Dev Commands

```bash
# Install dependencies
npm install

# Development server (hot reload)
npm run dev

# Production build
npm run build

# Start built app
npm start

# Lint codebase
npm run lint
```

## Project Structure

```
portfolio/
│   package.json
│   tsconfig.json
│   next.config.ts
│   README.md
│   MILO.md               ← this doc
│
├─ app/                   # Next.js App Router
│   ├─ layout.tsx         # Root layout, font imports, metadata
│   ├─ page.tsx           # Entry point (redirect to /home)
│   ├─ globals.css        # Tailwind + CSS vars
│   └─ fonts/…
│
├─ components/            # Visual widgets (GSAP, three.js, effects)
│   ├─ StaggeredMenu.tsx
│   ├─ Shuffle.tsx
│   ├─ PixelSnow.tsx
│   └─ …
│
├─ lib/                   # Helpers
│   └─ utils.ts           # `cn` class‑name merger
│
├─ public/                # Static assets (images, icons)
│   └─ preview.png
│
└─ (dashboard)/           # Optional nested route for project listings
```

## Code Style

- **Components**: functional, TSX, PascalCase filenames.
- **Props**: typed with explicit interfaces.
- **Imports**: absolute alias `@/*` (see `tsconfig.json`).
- **Class names**: `cn(...inputs)` merges `clsx` + `tailwind‑merge` for deterministic Tailwind output.
- **State**: React hooks; client components marked with `"use client"`.
- **Formatting**: enforced by ESLint (Next config) – no stray globals, strict `no‑implicit‑any`.
- **Error handling**: TypeScript `strict` mode catches most issues; runtime errors handled via React error boundaries if added.

## Architecture Notes

- **Next.js App Router** provides file‑system routing (`app/(dashboard)/…`).
- **Layout** loads Google fonts via `next/font/google` and injects CSS variables for theming.
- **Component library** houses self‑contained visual effects; many rely on GSAP or three.js for 3‑D transformations.
- **Utility layer** (`lib/utils.ts`) centralises class‑name merging, keeping components clean.
- **Theme** is driven by CSS custom properties; dark mode toggles via `.dark` class.
- **Static assets** served from `public/`; custom fonts loaded locally.
- **No server‑side API routes** – the site is fully static except for Next’s server rendering.

---
