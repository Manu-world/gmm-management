import path from "path"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(path.dirname("."), "./src"),
    },
  },
  server: {
    port:  18014, 
    host: '0.0.0.0',
  }
})

