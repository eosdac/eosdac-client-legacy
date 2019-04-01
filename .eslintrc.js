module.exports = {
  root: true,

  parserOptions: {
    parser: 'babel-eslint',
    sourceType: 'module'
  },

  env: {
    browser: true
  },

  extends: ['plugin:vue/essential', '@vue/standard', 'prettier'],

  // required to lint *.vue files
  plugins: ['vue', 'prettier'],

  globals: {
    ga: true, // Google Analytics
    cordova: true,
    __statics: true
  },

  // add your custom rules here
  rules: {
    // "standard/computed-property-even-spacing": "off",
    'prettier/prettier': 'warn',
    // semi: 'on',

    // Temp Rules
    eqeqeq: 'off',
    'spaced-comment': 'off',
    camelcase: 'off',
    'standard/computed-property-even-spacing': 'off',
    'no-empty-pattern': 'off',
    'no-useless-escape': 'off',
    'no-useless-return': 'off',
    'vue/return-in-computed-property': 'off',
    'vue/no-side-effects-in-computed-properties': 'off',
    'standard/no-callback-literal': 'off',
    'vue/require-prop-type-constructor': 'off',
    'vue/no-use-v-if-with-v-for': 'off',
    // Temp Rules End

    // allow async-await
    'generator-star-spacing': 'off',
    // allow paren-less arrow functions
    'arrow-parens': 'off',
    'one-var': 'off',
    'prefer-promise-reject-errors': 'off',

    'import/first': 'off',
    'import/named': 'error',
    'import/namespace': 'error',
    'import/default': 'error',
    'import/export': 'error',
    'import/extensions': 'off',
    'import/no-unresolved': 'off',
    'import/no-extraneous-dependencies': 'off',

    // allow console.log during development only
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    // allow debugger during development only
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off'
  }
};
