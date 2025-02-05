import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'

// https://vite.dev/config/
export default defineConfig({
  plugins: [svelte()],
  server: {
    host: '0.0.0.0',  // Accepte les connexions depuis toutes les interfaces réseau
    port: 5173,        // Assure-toi que le port correspond à celui que tu veux utiliser
    watch: {
      usePolling: true  // Utile si tu es dans un environnement Docker
    }
  }
   
})
