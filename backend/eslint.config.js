export default [
  {
    languageOptions: {
      sourceType: "module",
      globals: {
        process: "readonly",
        console: "readonly",
      },
    },
    rules: {
      "no-unused-vars": "warn",
      "no-undef": "error",
      "no-constant-binary-expression": "error",
    },
  },
];
