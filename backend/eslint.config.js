import js from '@eslint/js';
import globals from 'globals';
import { defineConfig } from 'eslint/config';

export default defineConfig([
  {
    files: ['**/*.{js,mjs,cjs}'],

    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module', // change to "module" if using ES modules
      globals: {
        ...globals.node,
      },
    },

    plugins: {
      js,
    },

    extends: ['js/recommended'],

    rules: {
      'no-console': 'warn',
      'no-unused-vars': ['warn'],
      quotes: ['error', 'single'],
      semi: ['error', 'always'],
    },
  },
]);
