# Farrell Fathurrahman · Portfolio

Personal portfolio of **Farrell Fathurrahman**, Informatics Engineering student at Politeknik Caltex Riau (Software Engineering track). Open to on-site internships in Jakarta, Singapore and Malaysia.

**Live site:** https://fareldmi2006-droid.github.io/portofolio/

![Built with React](https://img.shields.io/badge/React-18-20232a?logo=react) ![TypeScript](https://img.shields.io/badge/TypeScript-5-3178c6?logo=typescript&logoColor=white) ![Vite](https://img.shields.io/badge/Vite-5-646cff?logo=vite&logoColor=white) ![Remotion](https://img.shields.io/badge/Remotion-4-0b84f3)

## What's inside

- **Interactive motion background** built as a Remotion composition (`src/remotion/MetalSheen.tsx`). Scrolling sweeps light across engraved topographic contour lines, the cursor bends and lights the lines, and clicks send ripples.
- **Profile folders** (`src/FolderStack.tsx`). A centered stack of folders: pointing at one lifts it, clicking slides it out and turns it to the screen while the others blur. Spring physics with directional motion blur.
- **Motion details** (`src/Motion.tsx`, `src/Kinetic.tsx`): word-by-word heading reveal, cycling role word, rotating circular badge, section rail and a marquee whose speed and blur follow scroll velocity.
- **Dark and light themes** that follow the visitor's system setting, with a toggle.
- **English / Indonesian** content, all kept in one file (`src/content.ts`).
- **Certificate viewer** for CCNA: Introduction to Networks.
- Accessibility basics: keyboard support, visible focus, contextual cursor hints and full `prefers-reduced-motion` support.

## Tech stack

React 18 · TypeScript · Vite · Remotion Player · Lucide icons · plain CSS with design tokens

## Project structure

```
src/
  App.tsx              page layout and sections
  content.ts           all text, links and projects (EN + ID)
  FolderStack.tsx      profile folders
  Background.tsx       full-screen Remotion player driven by scroll and pointer
  remotion/            the MetalSheen composition (also opens in Remotion Studio)
  Motion.tsx           reveal, word cycle, badge, section rail
  Kinetic.tsx          marquee and name intro
  CursorHint.tsx       pointer hints and card highlights
  styles.css           design tokens and styles
public/certificates/   certificate PDFs
```

## Run locally

```bash
npm install
npm run dev        # http://localhost:5173
npm run studio     # open the background composition in Remotion Studio
npm run build      # production build in dist/
```

## Update the content

Edit `src/content.ts` (text, projects, certificates) or swap the photo in `src/assets/`, then rebuild and publish the `dist/` folder to the `gh-pages` branch (GitHub Pages).

## Contact

- Email: fareldmi2006@gmail.com
- LinkedIn: [farrell-fathurrahman](https://www.linkedin.com/in/farrell-fathurrahman-2132a43ab/)

Remotion is free for individuals; see [remotion.dev/license](https://www.remotion.dev/license).
