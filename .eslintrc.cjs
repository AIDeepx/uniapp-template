/* eslint-env node */
module.exports = {
  root: true,
  env: {
    browser: true,
    es2022: true,
    node: true
  },
  parserOptions: {
    ecmaVersion: 2022,
    sourceType: 'module'
  },
  extends: [
    'eslint:recommended',
    'plugin:vue/vue3-recommended',
    '@vue/eslint-config-prettier'
  ],
  rules: {
    // 模板采用 Options API，组件名单字/业务名允许
    'vue/multi-word-component-names': 'off',
    'vue/no-v-html': 'off',
    'vue/require-default-prop': 'off',
    'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
    'no-console': 'off',
    'no-debugger': 'warn'
  },
  globals: {
    uni: 'readonly',
    wx: 'readonly',
    dd: 'readonly',
    getApp: 'readonly',
    getCurrentPages: 'readonly',
    __uniConfig: 'readonly',
    process: 'readonly'
  },
  ignorePatterns: ['node_modules/', 'unpackage/', 'uni_modules/', 'dist/', '*.md']
}
