// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'
// import tailwindcss from '@tailwindcss/vite'

// export default defineConfig({
//   plugins: [react(
//     react(),
//     tailwindcss()
//   )],
//   server: {
//     host: '0.0.0.0',
//     port: process.env.PORT
//   },
//   preview: {
//     host: '0.0.0.0',
//     port: process.env.PORT,
//     allowedHosts: ['.onrender.com']
//   }
// })

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss()
  ],
  server: {
    host: '0.0.0.0',
    port: process.env.PORT
  },
  preview: {
    host: '0.0.0.0',
    port: process.env.PORT,
    allowedHosts: ['.onrender.com']
  }
})