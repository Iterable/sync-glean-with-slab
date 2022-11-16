/**
 * The rules annotated with `// ts-eslint` are defaults from https://github.com/typescript-eslint/typescript-eslint/blob/master/docs/getting-started/linting/README.md
 *
 */
module.exports = {
  /**
   * this rule stops the eslint config resolver from looking any higher, i.e. any rule specified here is a top-level rule and will be applied
   */
  root: true, // ts-eslint
  parser: 'babel-eslint',
  env: {
    browser: true,
    es6: true,
    jest: true,
    'cypress/globals': true,
  },
  extends: [
    'airbnb-base',
    'prettier',
    'plugin:flowtype/recommended',
    'plugin:react/recommended',
    'plugin:redux-saga/recommended',
    'plugin:cypress/recommended',
  ],
  plugins: ['flowtype', 'redux-saga', 'import', 'cypress'],
  overrides: [
    {
      files: ['*.ts', '*.tsx'],
      parser: '@typescript-eslint/parser',
      plugins: ['@typescript-eslint'],
      extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended'],
      rules: {
        'consistent-return': 'off',

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
    'class-methods-use-this': [
      'error',
      {
        exceptMethods: [
          'render',
          'getInitialState',
          'getDefaultProps',
          'componentWillMount',
          'componentDidMount',
          'componentWillReceiveProps',
          'shouldComponentUpdate',
          'componentWillUpdate',
          'componentDidUpdate',
          'componentWillUnmount',
        ],
      },
    ],
    'flowtype/no-types-missing-file-annotation': 0,
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
    'react/display-name': 0,
    'react/jsx-no-target-blank': 'off', // disabled in webpack 4 / eslint upgrade
    'react/jsx-uses-react': 'off',
    'react/react-in-jsx-scope': 'off',
    'react/prop-types': 'off', // disabled in webpack 4 / eslint upgrade
  },
  settings: {
    react: {
      version: 'detect',
    },
    'import/parsers': {
      '@typescript-eslint/parser': ['.ts', '.tsx'],
    },
    'import/resolver': {
      webpack: {
        config: 'webpack.dev.js',
      },
      typescript: {
        alwaysTryTypes: true,
      },
    },
  },
};
