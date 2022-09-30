module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: "standard",
  overrides: [],
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
  },
  ignorePatterns: ["commitlint.config.js", "coverage"],
  rules: {
    semi: [2, "always"],
    quotes: ["warn", "double"],
    "comma-dangle": ["error", "only-multiline"],
    "no-undef": 0,
    "no-fallthrough": 0,
    "no-unused-vars": 0,
    "space-before-function-paren": 0,
    "no-useless-catch": 0,
  },
};
