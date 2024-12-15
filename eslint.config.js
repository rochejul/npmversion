import js from '@eslint/js';
import globals from 'globals';

import prettier from 'eslint-plugin-prettier';
import jest from 'eslint-plugin-jest';

export const eslintRecommended = js.configs.recommended;
export const eslintWeb = {
  files: ['**/*.js', '**/*.mjs'],
  languageOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    globals: {
      ...globals.browser,
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
    '**/*.amd.js',
    '**/*.umd.js',
  ],
};

export const eslintNodeJs = {
  files: ['**/*.cjs'],
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
    '**/*.amd.js',
    '**/*.umd.js',
  ],
};

export const eslintAmd = {
  files: ['**/*.amd.js', '**/*.umd.js'],
  languageOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    globals: {
      ...globals.browser,
      ...globals.amd,
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
};

export const eslintCommonJs = {
  files: ['**/*.cjs'],
  languageOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    globals: {
      ...globals.browser,
      ...globals.commonjs,
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
