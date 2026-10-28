import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { viteSingleFile } from 'vite-plugin-singlefile';

// Single-file build: one self-contained index.html, easy to preview and deploy anywhere (Vercel, Netlify, GitHub Pages).
export default defineConfig({
  plugins: [react(), viteSingleFile()],
});
