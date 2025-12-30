# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Luframe landing page - a Next.js 16 marketing site for an agentic meeting platform that provides real-time transcription, insight detection, agenda tracking, and automated drafts.

## Commands

```bash
npm run dev      # Start development server (localhost:3000)
npm run build    # Production build
npm run lint     # Run ESLint
npm run start    # Start production server
```

## Architecture

**Stack:** Next.js 16 with App Router, React 19, TypeScript, Tailwind CSS v4, shadcn/ui (new-york style)

**Path aliases:** `@/*` maps to project root (e.g., `@/components`, `@/lib/utils`)

**Directory structure:**
- `app/` - Next.js App Router pages (page.tsx, layout.tsx)
- `components/` - Page sections (Hero, Features, FAQ, CTA, Header, Footer, Pricing)
- `components/ui/` - shadcn/ui primitives (do not modify directly; regenerate with `npx shadcn@latest add`)
- `lib/utils.ts` - Contains `cn()` utility for Tailwind class merging
- `hooks/` - Custom React hooks (`use-mobile.ts`, `useInView.ts`)

**Landing page sections** (in order): Header → Hero → Features → FAQ → CTA → Footer

**Interactive demo components** (`Fake*` prefix): FakeMeetingRoom, FakeTranscriptionUI, FakeAgendaUI, FakeNoteTakerUI, FakeEmailDraftUI - these render mock UI demonstrations

## Styling

- Tailwind CSS v4 with CSS variables for theming (light/dark mode via `.dark` class)
- Colors use OKLCH color space defined in `app/globals.css`
- Custom animations for meeting room demos defined in `globals.css` (fade-in-up, pop-in, sound-wave, etc.)
- Icons from `lucide-react`

## Environment Variables

`NEXT_PUBLIC_APP_URL` - Main app URL for sign-up redirects (see `.env.example`)
