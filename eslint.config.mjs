import { defineConfig } from "eslint/config";
import js from "@eslint/js";
import tseslint from "typescript-eslint";
import reactHooks from "eslint-plugin-react-hooks";

export default defineConfig([
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    plugins: { "react-hooks": reactHooks },
    rules: { ...reactHooks.configs.recommended.rules },
  },
  // 빌드 도구 스크립트는 Node 환경에서 실행된다
  {
    files: ["scripts/**/*.mjs"],
    languageOptions: { globals: { console: "readonly", process: "readonly" } },
  },
  { ignores: ["dist/**", "node_modules/**", "src/lib/chibi/character.js"] }, // 치비 원본 사본 (chibi-pipeline 소유)
]);
