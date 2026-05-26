import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    ignores: [
      "node_modules/**",
      ".next/**",
      "out/**",
      "build/**",
      "next-env.d.ts",
    ],
  },
  {
    rules: {
      // 사용하지 않는 변수를 경고로 변경 (에러 → 경고)
      "@typescript-eslint/no-unused-vars": "warn",
      // 빈 인터페이스를 경고로 변경 (에러 → 경고)
      "@typescript-eslint/no-empty-object-type": "warn",
    },
  },
];

export default eslintConfig;
