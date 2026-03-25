import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/', // Түпкү папкадан файлдарды туура издөө үчүн ушул сапты кошуңуз
})