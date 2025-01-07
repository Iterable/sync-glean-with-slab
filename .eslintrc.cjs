/**
 * The rules annotated with `// ts-eslint` are defaults from https://github.com/typescript-eslint/typescript-eslint/blob/master/docs/getting-started/linting/README.md
 *
 */
module.exports = {
  /**
   * this rule stops the eslint config resolver from looking any higher, i.e. any rule specified here is a top-level rule and will be applied
   */
  root: true, // ts-eslint
  parser: '@typescript-eslint/parser',
  env: {
    es6: true,
  },
  extends: [
    'airbnb-base',
    'prettier',
  ],
  plugins: ['import'],
  overrides: [
    {
      files: ['*.ts', '*.tsx'],
      parser: '@typescript-eslint/parser',
      plugins: ['@typescript-eslint'],
      extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended'],
      rules: {
        'consistent-return': 'off',
        'no-console': 'off',

        // https://stackoverflow.com/questions/63961803/eslint-says-all-enums-in-typescript-app-are-already-declared-in-the-upper-scope
        'no-shadow': 'off',
        '@typescript-eslint/no-shadow': ['error'],

        // https://stackoverflow.com/questions/63818415/react-was-used-before-it-was-defined/64024916#64024916
        'no-use-before-define': 'off',
        '@typescript-eslint/no-use-before-define': ['error'],

        // forces explicit return type on React components, probably don't want this
        '@typescript-eslint/explicit-module-boundary-types': 'off',

        // temporary to try to satisfy the compiler
        '@typescript-eslint/no-explicit-any': 'off',
        '@typescript-eslint/ban-ts-comment': 'off',
        '@typescript-eslint/no-var-requires': 'off',
      },
    },
  ],
  rules: {
    'no-console': 'off',
    'function-paren-newline': 0,
    'import/extensions': 'off',
    'import/named': 'off', // disabled in webpack 4 / eslint upgrade
    'import/no-cycle': [
      2,
      {
        maxDepth: 2,
      },
    ],
    'no-else-return': 'off', // disabled in webpack 4 / eslint upgrade
    'import/no-named-as-default': 0,
    'import/no-useless-path-segments': 'off', // disabled in webpack 4 / eslint upgrade
    'import/no-extraneous-dependencies': 'off',
    'import/no-unresolved': 2,
    'import/prefer-default-export': 0,
    'lines-between-class-members': 'off', // disabled in webpack 4 / eslint upgrade
    'max-classes-per-file': 'off', // disabled in webpack 4 / eslint upgrade
    'no-unused-vars': [
      'warn',
      { vars: 'all', args: 'after-used', ignoreRestSiblings: true, varsIgnorePattern: 'React' },
    ],
    'no-extra-boolean-cast': 0,
    'no-plusplus': ['error', { allowForLoopAfterthoughts: true }],
    'no-underscore-dangle': 0,
    'prefer-object-spread': 'off', // disabled in webpack 4 / eslint upgrade
  },
  settings: {
    'import/parsers': {
      '@typescript-eslint/parser': ['.ts', '.tsx'],
    },
    'import/resolver': {
      typescript: {
        alwaysTryTypes: true,
      },
    },
  },
};
