const path = require('path');

module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: path.resolve(__dirname, './tsconfig.json'),
  },

  root: true,

  env: {
    es6: true,
    browser: true,
  },

  plugins: ['@typescript-eslint', 'import'],

  extends: [
    //
    'airbnb',
    'airbnb-typescript',
    'airbnb/hooks',
    'prettier',
  ],

  rules: {
    'react/require-default-props': 'off',
    'react/destructuring-assignment': 'off',
    '@typescript-eslint/object-curly-spacing': ['error', 'never'],
    'prefer-promise-reject-errors': 'off',
    'prefer-destructuring': 'off',
    'react/jsx-filename-extension': 'off',
    'react/jsx-props-no-spreading': 'off',
    'import/prefer-default-export': 'off',
    'react/prop-types': 'off',
    'import/no-default-export': 'off',
    'no-console': 'error',
    'no-param-reassign': [
      'error',
      {
        props: true,
        ignorePropertyModificationsFor: ['state'],
      },
    ],
    'react/jsx-sort-props': [
      'error',
      {
        callbacksLast: true,
        shorthandFirst: true,
        ignoreCase: true,
        reservedFirst: true,
      },
    ],
  },

  settings: {
    'import/resolver': {
      typescript: {},
    },
  },
};
