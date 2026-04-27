// import boundaries from "eslint-plugin-boundaries";
// import nextPlugin from "@next/eslint-plugin-next";
// import typescriptParser from "@typescript-eslint/parser";
// import typescriptPlugin from "@typescript-eslint/eslint-plugin";

// export default [
//   {
//     ignores: [
//       ".next/**",
//       "out/**",
//       "build/**",
//       "dist/**",
//       "node_modules/**",
//       "next-env.d.ts",
//       "*.config.js",
//       "*.config.mjs",
//       "*.config.ts",
//       "coverage/**",
//       "public/**",
//     ],
//   },

//   {
//     files: ["**/*.ts", "**/*.tsx", "**/*.js", "**/*.jsx"],
//     languageOptions: {
//       parser: typescriptParser,
//       parserOptions: {
//         project: "./tsconfig.json",
//         ecmaVersion: "latest",
//         sourceType: "module",
//       },
//     },
//     plugins: {
//       "@typescript-eslint": typescriptPlugin,
//       boundaries,
//     },
//     rules: {
//       "@typescript-eslint/no-unused-vars": ["warn", {
//         argsIgnorePattern: "^_",
//         varsIgnorePattern: "^_"
//       }],
//       "@typescript-eslint/no-explicit-any": "warn",
//       "@typescript-eslint/no-empty-interface": "warn",

//       "no-console": ["warn", { allow: ["warn", "error", "log"] }],
//       "no-debugger": "error",
//       "prefer-const": "error",
//       "no-var": "error",
//     },
//   },

//   {
//     files: ["app/**/*.tsx", "app/**/*.ts"],
//     plugins: {
//       "@next/next": nextPlugin,
//     },
//     rules: {
//       ...nextPlugin.configs.recommended.rules,
//       ...nextPlugin.configs["core-web-vitals"].rules,
//     },
//   },

//   {
//     files: ["src/**/*.ts", "src/**/*.tsx"],
//     settings: {
//       'boundaries/elements': [
//         { type: 'shared', pattern: 'src/shared/**/*' },
//         { type: 'entities', pattern: 'src/entities/**/*' },
//         { type: 'features', pattern: 'src/features/**/*' },
//         { type: 'widgets', pattern: 'src/widgets/**/*' },
//       ],
//       'boundaries/ignore': [
//         '**/*.test.*',
//         '**/*.spec.*',
//         '**/*.stories.*',
//         '**/__tests__/**',
//       ],
//       'import/resolver': {
//         typescript: {
//           project: './tsconfig.json',
//         },
//       },
//     },
//     rules: {
//       'boundaries/element-types': [
//         'error',
//         {
//           default: 'disallow',
//           rules: [
//             { from: 'shared', allow: ['shared'] },
//             { from: 'entities', allow: ['shared', 'entities'] },
//             { from: 'features', allow: ['shared', 'entities', 'features'] },
//             { from: 'widgets', allow: ['shared', 'entities', 'features', 'widgets'] },
//           ],
//         },
//       ],

//       'boundaries/no-private': 'error',
//     },
//   },

//   {
//     files: ["src/shared/**/*.ts", "src/shared/**/*.tsx"],
//     rules: {
//       'boundaries/element-types': [
//         'error',
//         {
//           default: 'disallow',
//           rules: [
//             { from: 'shared', allow: ['shared'] },
//           ],
//         },
//       ],
//     },
//   },
// ];
