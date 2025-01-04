import js from '@eslint/js';
import globals from 'globals';

import prettier from 'eslint-plugin-prettier';
import jest from 'eslint-plugin-jest';

export const eslintRecommended = js.configs.recommended;

export const eslintNodeJs = {
  files: ['**/*.cjs', '**/*.js', '**/*.mjs'],
  languageOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    globals: {
      ...globals.node,
    },
  },
  plugins: {
    prettier,
  },
  rules: {
    'prettier/prettier': 'warn',
    'no-unused-vars': ['off', { argsIgnorePattern: '^_' }],
  },
  ignores: [
    '**/.*',
    'node_modules/*',
    '--help/*',
    '.husky/*',
    '.vscode/*',
    'images/*',
    '**/*.amd.js',
    '**/*.umd.js',
  ],
};

export const eslintJest = {
  files: ['**/*.test.js'],
  plugins: {
    jest,
  },
  rules: {
    ...jest.configs['flat/all'].rules,
    'jest/prefer-expect-assertions': 'off',
    'jest/consistent-test-it': ['error', { fn: 'test' }],
    'jest/no-hooks': 'off',
    'jest/max-expects': [
      'error',
      {
        max: 20,
      },
    ],
  },
};

export default [
  js.configs.recommended,
  {
    files: ['scripts/**/*.js'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.node,
      },
    },
    plugins: {
      prettier,
    },
    rules: {
      'prettier/prettier': 'warn',
    },
    ignores: [
      '**/.*',
      'node_modules/*',
      '--help/*',
      '.husky/*',
      '.vscode/*',
      'images/*',
    ],
  },
];
