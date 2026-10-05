import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";

export default defineConfig({
  plugins: [react()],
  base: "./", // Автоматически добавляет точку перед слэшем для всех путей в dist/index.html
  build: {
    rollupOptions: {
      input: {
        popup: resolve(__dirname, "index.html"), // Собирает только ваше popup-приложение
      },
      output: {
        entryFileNames: "[name].js", // Файл на выходе гарантированно будет называться popup.js
      },
    },
  },
});
