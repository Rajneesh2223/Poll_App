import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react() ,
    tailwindcss(),
  ],
   theme: {
    extend: {
      fontFamily: {
        sora: ['Sora', 'sans-serif'],
      },
    },
  },
   assetsInclude: ['**/*.svg'] // Add this line
})
