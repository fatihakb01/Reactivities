import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import mkcert from 'vite-plugin-mkcert' // if you want to use a certificate

// https://vite.dev/config/
export default defineConfig({
  server: {
    port: 3000
  },
  // plugins: [react()],
  plugins: [react(), mkcert()], // if you want to use a certificate
})
