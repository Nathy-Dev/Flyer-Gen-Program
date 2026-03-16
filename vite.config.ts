import { defineConfig } from 'vite'

export default defineConfig({
  // If you are deploying to https://<USERNAME>.github.io/<REPO>/
  // Set base to '/<REPO>/'
  base: './', 
  build: {
    outDir: 'dist',
  }
})
