import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // Serverless functions only run under `vercel dev`; start it on :3000 to exercise /api locally.
    proxy: { '/api': 'http://localhost:3000' },
  },
})
