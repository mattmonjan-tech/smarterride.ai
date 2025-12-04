
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { fileURLToPath } from 'url'

// Fix for __dirname in ES modules
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  // Set the third parameter to '' to load all env regardless of the `VITE_` prefix.
  const env = loadEnv(mode, '.', '');

  return {
    plugins: [react()],
    define: {
      // Vital: This replaces process.env.API_KEY in your code with the actual string during build
      'process.env.API_KEY': JSON.stringify(env.API_KEY),
      'process.env': {} // Polyfill to prevent "process is not defined" crash
    },
    resolve: {
      alias: {
        // Correctly resolve '@' to the project root 'src' folder
        '@': path.resolve(__dirname, './src'),
      },
    },
  }
})
